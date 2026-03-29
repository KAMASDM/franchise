const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize the Gemini AI model
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in environment variables. Set it in functions/.env");
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

// ---------------------------------------------------------------------------
// CORS — restricted to configured origins only
// ---------------------------------------------------------------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
};

// ---------------------------------------------------------------------------
// Firebase ID token verification
// ---------------------------------------------------------------------------
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, user: null };
  }
  try {
    const idToken = authHeader.slice(7);
    const decoded = await admin.auth().verifyIdToken(idToken);
    return { authenticated: true, user: decoded };
  } catch {
    return { authenticated: false, user: null };
  }
};

// ---------------------------------------------------------------------------
// Rate limiting — in-memory per IP / UID
// Authenticated users: 20 req/min; anonymous: 5 req/min
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();

// Periodic cleanup to prevent unbounded memory growth (every 10 min)
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((t) => t > cutoff);
    if (recent.length === 0) rateLimitMap.delete(key);
    else rateLimitMap.set(key, recent);
  }
}, 10 * 60 * 1000);

const checkRateLimit = (identifier, maxRequests, windowMs) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (rateLimitMap.get(identifier) || []).filter((t) => t > windowStart);
  if (timestamps.length >= maxRequests) {
    rateLimitMap.set(identifier, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(identifier, timestamps);
  return true;
};

const getRateLimitKey = (req, authResult) => {
  if (authResult.authenticated && authResult.user) return `uid:${authResult.user.uid}`;
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || req.connection?.remoteAddress
    || "unknown";
  return `ip:${ip}`;
};

// ---------------------------------------------------------------------------
// Input sanitization for prompt injection prevention
// ---------------------------------------------------------------------------
const sanitizeField = (val, maxLen = 200) => {
  if (!val || typeof val !== "string") return "";
  // Strip characters that could break prompt structure
  return val.replace(/[`\\]/g, "").trim().substring(0, maxLen);
};

// ---------------------------------------------------------------------------
// Cloud Function: sendMessage
// ---------------------------------------------------------------------------
exports.sendMessage = functions
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https
  .onRequest(async (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
      const authResult = await verifyToken(req);
      const key = getRateLimitKey(req, authResult);
      const maxReq = authResult.authenticated ? 20 : 5;

      if (!checkRateLimit(key, maxReq, 60000)) {
        return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      }

      const { message, chatHistory, systemPrompt } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Valid message is required" });
      }
      if (message.length > 1000) {
        return res.status(400).json({ error: "Message too long. Maximum 1000 characters." });
      }
      if (chatHistory && !Array.isArray(chatHistory)) {
        return res.status(400).json({ error: "chatHistory must be an array" });
      }
      if (systemPrompt && (typeof systemPrompt !== "string" || systemPrompt.length > 2000)) {
        return res.status(400).json({ error: "Invalid systemPrompt" });
      }

      if (!model) return res.status(503).json({ error: "Service temporarily unavailable" });

      // Limit history to last 20 turns to cap token usage
      const sanitizedHistory = (chatHistory || []).slice(-20);

      const chat = model.startChat({
        history: sanitizedHistory,
        generationConfig: { maxOutputTokens: 1000 },
        systemInstruction: systemPrompt
          ? { parts: [{ text: systemPrompt }] }
          : undefined,
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();

      return res.status(200).json({ success: true, response: text });
    } catch (error) {
      console.error("Error in sendMessage:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

// ---------------------------------------------------------------------------
// Cloud Function: startChat
// ---------------------------------------------------------------------------
exports.startChat = functions
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https
  .onRequest(async (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
      const authResult = await verifyToken(req);
      const key = getRateLimitKey(req, authResult);
      const maxReq = authResult.authenticated ? 10 : 3;

      if (!checkRateLimit(key, maxReq, 60000)) {
        return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      }

      const { systemPrompt, initialMessage } = req.body;

      if (!systemPrompt || !initialMessage) {
        return res.status(400).json({ error: "systemPrompt and initialMessage are required" });
      }
      if (typeof systemPrompt !== "string" || systemPrompt.length > 2000) {
        return res.status(400).json({ error: "Invalid systemPrompt" });
      }
      if (typeof initialMessage !== "string" || initialMessage.length > 1000) {
        return res.status(400).json({ error: "Invalid initialMessage" });
      }

      if (!model) return res.status(503).json({ error: "Service temporarily unavailable" });

      const chat = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 1000 },
        systemInstruction: { parts: [{ text: systemPrompt }] },
      });

      const result = await chat.sendMessage(initialMessage);
      const text = result.response.text();

      return res.status(200).json({ success: true, response: text });
    } catch (error) {
      console.error("Error in startChat:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

// ---------------------------------------------------------------------------
// Cloud Function: generateContent (callable — requires authentication)
// ---------------------------------------------------------------------------
exports.generateContent = functions
  .runWith({ timeoutSeconds: 60, memory: "512MB" })
  .https
  .onCall(async (data, context) => {
    // Require authentication — this is only called from the brand registration flow
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required to generate content"
      );
    }

    if (!model) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Service temporarily unavailable"
      );
    }

    const { contentType, brandInfo } = data;

    if (!contentType || !brandInfo) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "contentType and brandInfo are required"
      );
    }

    // Sanitize all user-supplied fields to prevent prompt injection
    const safe = {
      brandName: sanitizeField(brandInfo.brandName, 100),
      industry: sanitizeField(brandInfo.industry, 50),
      businessModel: sanitizeField(brandInfo.businessModel, 50),
      targetAudience: sanitizeField(brandInfo.targetAudience),
      uniqueFeatures: sanitizeField(brandInfo.uniqueFeatures),
      targetMarket: sanitizeField(brandInfo.targetMarket),
      competitiveAdvantage: sanitizeField(brandInfo.competitiveAdvantage),
      brandPersonality: sanitizeField(brandInfo.brandPersonality),
      investmentRange: sanitizeField(brandInfo.investmentRange, 50),
      purpose: sanitizeField(brandInfo.purpose, 50),
      content: sanitizeField(brandInfo.content, 1000),
    };

    let prompt = "";

    switch (contentType) {
      case "description":
        prompt = `You are a professional marketing copywriter specializing in franchise businesses.

Create a compelling brand description for:
- Brand Name: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Business Model: ${safe.businessModel || "franchise"}
- Target Audience: ${safe.targetAudience || "general consumers"}
- Unique Features: ${safe.uniqueFeatures || "quality products and services"}

Write a 2-3 paragraph brand description that:
1. Captures the essence and value proposition
2. Highlights what makes the brand unique
3. Appeals to potential franchise partners
4. Is professional yet engaging
5. Focuses on benefits and opportunities

Keep it between 150-250 words. Make it inspiring and professional.`;
        break;

      case "usps":
        prompt = `As a business strategy expert, identify 5 unique selling propositions (USPs) for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Business Model: ${safe.businessModel || "franchise"}
- Target Market: ${safe.targetMarket || "general market"}
- Competitive Edge: ${safe.competitiveAdvantage || "quality and service"}

Format each USP as a concise, powerful statement (10-15 words each).
Focus on:
1. Market differentiation
2. Customer benefits
3. Franchise partner advantages
4. Proven business model
5. Support and systems

Return ONLY 5 numbered USPs, one per line, without additional explanation.`;
        break;

      case "taglines":
        prompt = `As a creative advertising copywriter, create 5 memorable marketing taglines for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Brand Personality: ${safe.brandPersonality || "professional and trustworthy"}
- Audience: ${safe.targetAudience || "general consumers"}

Each tagline should be:
- 3-7 words maximum
- Memorable and catchy
- Reflect brand values
- Easy to understand
- Emotionally engaging

Return ONLY 5 numbered taglines, one per line.`;
        break;

      case "insights":
        prompt = `As a franchise industry expert, provide key insights for the ${safe.industry || "retail"} industry:

1. Current market trends (2-3 points)
2. Success factors for franchises (3 points)
3. Common challenges to address (2-3 points)
4. Recommended franchise fee range
5. Typical ROI timeline

Keep each point concise (1 sentence). Format as a structured list.`;
        break;

      case "partnerProfile":
        prompt = `Create an ideal franchise partner profile for:
- Brand: ${safe.brandName || "the brand"}
- Industry: ${safe.industry || "not specified"}
- Model: ${safe.businessModel || "franchise"}
- Investment: ${safe.investmentRange || "varies"}

Describe the ideal partner in 3 concise paragraphs:
1. Background and experience (skills, industry knowledge)
2. Personal qualities and values (traits, work ethic)
3. Resources and commitment (financial capacity, time, dedication)

Keep it professional and specific. 150-200 words total.`;
        break;

      case "enhance":
        prompt = `As a professional editor, improve this ${safe.purpose || "brand description"}:

"${safe.content}"

Make it:
1. More compelling and engaging
2. Clear and concise
3. Professional yet approachable
4. Action-oriented
5. Better structured

Keep the same length (±20 words). Return ONLY the improved version without explanation.`;
        break;

      default:
        throw new functions.https.HttpsError("invalid-argument", "Invalid content type");
    }

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return { success: true, content: text.trim(), contentType };
    } catch (error) {
      console.error("Error generating content:", error.message);
      throw new functions.https.HttpsError("internal", "Content generation failed");
    }
  });

