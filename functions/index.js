const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize the Gemini AI model
// First try environment variable, then fall back to functions.config()
const API_KEY = process.env.GEMINI_API_KEY || functions.config()?.gemini?.api_key;

if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in environment or config");
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