const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });

<<<<<<< HEAD
// Initialize the Gemini AI model
// First try environment variable, then fall back to functions.config()
const API_KEY = process.env.GEMINI_API_KEY || functions.config()?.gemini?.api_key;

if (!API_KEY) {
  console.error("GEMINI_API_KEY not found in environment or config");
}
=======
const API_KEY =
  process.env.GEMINI_API_KEY || functions.config()?.gemini?.api_key;
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

<<<<<<< HEAD
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
=======
exports.sendMessage = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB",
  })
  .https.onRequest((req, res) => {
    return cors(req, res, async () => {
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      try {
        const { message, chatHistory, systemPrompt } = req.body;

<<<<<<< HEAD
        // Validate required fields
=======
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
        if (!message) {
          return res.status(400).json({ error: "Message is required" });
        }

        if (!API_KEY) {
          return res.status(500).json({ error: "API key not configured" });
        }

<<<<<<< HEAD
        // Start a new chat session with the provided history and system instruction
        const chat = model.startChat({
          history: chatHistory || [],
          generationConfig: {
            maxOutputTokens: 500,
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
=======
        const chat = model.startChat({
          history: chatHistory,
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
          generationConfig: {
            maxOutputTokens: 500,
          },
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        });

<<<<<<< HEAD
        const result = await chat.sendMessage(initialMessage);
=======
        const result = await chat.sendMessage(message);
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
          success: true,
          response: text,
        });
<<<<<<< HEAD

      } catch (error) {
        console.error("Error starting chat:", error);
=======
      } catch (error) {
        console.error("error", error);
>>>>>>> 26922e07c3c25e255c880ae07fc5d5dcac8cb5fd
        return res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    });
  });