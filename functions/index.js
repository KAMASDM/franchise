const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize the Gemini AI model
// Use environment variable from .env file (modern approach)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in environment variables");
  console.error("Make sure to set it in functions/.env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to validate request authentication
const validateRequest = async (req) => {
  // For development/testing, allow requests without auth
  if (process.env.NODE_ENV === 'development') {
    return { isValid: true };
  }

  // Check for API key in headers (basic protection)
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== functions.config()?.api?.key) {
    return { isValid: false, error: 'Invalid API key' };
  }

  // For production, you might want to verify Firebase ID tokens
  // const idToken = req.headers.authorization?.split('Bearer ')[1];
  // if (idToken) {
  //   try {
  //     const decodedToken = await admin.auth().verifyIdToken(idToken);
  //     return { isValid: true, user: decodedToken };
  //   } catch (error) {
  //     return { isValid: false, error: 'Invalid authentication token' };
  //   }
  // }

  return { isValid: true };
};

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map();
const checkRateLimit = (identifier, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier);
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  return true;
};

// Cloud Function to handle Gemini API calls
exports.sendMessage = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB"
  })
  .https
  .onRequest((req, res) => {
    return cors(req, res, async () => {
      // Only allow POST requests
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      try {
        // Validate authentication
        const authResult = await validateRequest(req);
        if (!authResult.isValid) {
          return res.status(401).json({ error: authResult.error || "Unauthorized" });
        }

        // Rate limiting
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
        if (!checkRateLimit(clientIp, 20, 60000)) { // 20 requests per minute
          return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
        }

        const { message, chatHistory, systemPrompt } = req.body;

        // Validate required fields
        if (!message || typeof message !== 'string') {
          return res.status(400).json({ error: "Valid message is required" });
        }

        // Validate message length
        if (message.length > 1000) {
          return res.status(400).json({ error: "Message too long. Please keep it under 1000 characters." });
        }

        // Validate chat history format
        if (chatHistory && !Array.isArray(chatHistory)) {
          return res.status(400).json({ error: "Chat history must be an array" });
        }

        if (!API_KEY) {
          return res.status(500).json({ error: "API key not configured" });
        }

        // Start a new chat session with the provided history and system instruction
        const chat = model.startChat({
          history: chatHistory || [],
          generationConfig: {
            maxOutputTokens: 1000,
          },
          systemInstruction: systemPrompt ? {
            parts: [{ text: systemPrompt }],
          } : undefined,
        });

        // Send the message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Return the response
        return res.status(200).json({
          success: true,
          response: text,
        });

      } catch (error) {
        console.error("Error calling Gemini API:", error);
        return res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    });
  });

// Alternative function for starting a new chat
exports.startChat = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB"
  })
  .https
  .onRequest((req, res) => {
    return cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      try {
        const { systemPrompt, initialMessage } = req.body;

        if (!systemPrompt || !initialMessage) {
          return res.status(400).json({ 
            error: "systemPrompt and initialMessage are required" 
          });
        }

        if (!API_KEY) {
          return res.status(500).json({ error: "API key not configured" });
        }

        const chat = model.startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 1000,
          },
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        });

        const result = await chat.sendMessage(initialMessage);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
          success: true,
          response: text,
        });

      } catch (error) {
        console.error("Error starting chat:", error);
        return res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    });
  });

// AI Content Generation Function
exports.generateContent = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "512MB"
  })
  .https
  .onCall(async (data, context) => {
    try {
      const { contentType, brandInfo } = data;

      if (!contentType || !brandInfo) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'contentType and brandInfo are required'
        );
      }

      if (!API_KEY) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'API key not configured'
        );
      }

        let prompt = "";

        // Generate prompts based on content type
        switch (contentType) {
          case 'description':
            prompt = `You are a professional marketing copywriter specializing in franchise businesses. 

Create a compelling brand description for:
- Brand Name: ${brandInfo.brandName || 'the brand'}
- Industry: ${brandInfo.industry || 'not specified'}
- Business Model: ${brandInfo.businessModel || 'franchise'}
- Target Audience: ${brandInfo.targetAudience || 'general consumers'}
- Unique Features: ${brandInfo.uniqueFeatures || 'quality products and services'}

Write a 2-3 paragraph brand description that:
1. Captures the essence and value proposition
2. Highlights what makes the brand unique
3. Appeals to potential franchise partners
4. Is professional yet engaging
5. Focuses on benefits and opportunities

Keep it between 150-250 words. Make it inspiring and professional.`;
            break;

          case 'usps':
            prompt = `As a business strategy expert, identify 5 unique selling propositions (USPs) for:
- Brand: ${brandInfo.brandName || 'the brand'}
- Industry: ${brandInfo.industry || 'not specified'}
- Business Model: ${brandInfo.businessModel || 'franchise'}
- Target Market: ${brandInfo.targetMarket || 'general market'}
- Competitive Edge: ${brandInfo.competitiveAdvantage || 'quality and service'}

Format each USP as a concise, powerful statement (10-15 words each).
Focus on:
1. Market differentiation
2. Customer benefits
3. Franchise partner advantages
4. Proven business model
5. Support and systems

Return ONLY 5 numbered USPs, one per line, without additional explanation.`;
            break;

          case 'taglines':
            prompt = `As a creative advertising copywriter, create 5 memorable marketing taglines for:
- Brand: ${brandInfo.brandName || 'the brand'}
- Industry: ${brandInfo.industry || 'not specified'}
- Brand Personality: ${brandInfo.brandPersonality || 'professional and trustworthy'}
- Audience: ${brandInfo.targetAudience || 'general consumers'}

Each tagline should be:
- 3-7 words maximum
- Memorable and catchy
- Reflect brand values
- Easy to understand
- Emotionally engaging

Return ONLY 5 numbered taglines, one per line.`;
            break;

          case 'insights':
            prompt = `As a franchise industry expert, provide key insights for the ${brandInfo.industry || 'retail'} industry:

1. Current market trends (2-3 points)
2. Success factors for franchises (3 points)
3. Common challenges to address (2-3 points)
4. Recommended franchise fee range
5. Typical ROI timeline

Keep each point concise (1 sentence). Format as a structured list.`;
            break;

          case 'partnerProfile':
            prompt = `Create an ideal franchise partner profile for:
- Brand: ${brandInfo.brandName || 'the brand'}
- Industry: ${brandInfo.industry || 'not specified'}
- Model: ${brandInfo.businessModel || 'franchise'}
- Investment: ${brandInfo.investmentRange || 'varies'}

Describe the ideal partner in 3 concise paragraphs:
1. Background and experience (skills, industry knowledge)
2. Personal qualities and values (traits, work ethic)
3. Resources and commitment (financial capacity, time, dedication)

Keep it professional and specific. 150-200 words total.`;
            break;

          case 'enhance':
            prompt = `As a professional editor, improve this ${brandInfo.purpose || 'brand description'}:

"${brandInfo.content}"

Make it:
1. More compelling and engaging
2. Clear and concise
3. Professional yet approachable
4. Action-oriented
5. Better structured

Keep the same length (±20 words). Return ONLY the improved version without explanation.`;
            break;

          default:
            throw new functions.https.HttpsError(
              'invalid-argument',
              'Invalid content type'
            );
        }

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
          success: true,
          content: text.trim(),
          contentType,
        };

      } catch (error) {
        console.error("Error generating content:", error);
        throw new functions.https.HttpsError(
          'internal',
          'Content generation failed: ' + error.message
        );
      }
    });