const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({ origin: true });

const API_KEY =
  process.env.GEMINI_API_KEY || functions.config()?.gemini?.api_key;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.sendMessage = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB",
  })
  .https.onRequest((req, res) => {
    return cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      try {
        const { message, chatHistory, systemPrompt } = req.body;

        if (!message) {
          return res.status(400).json({ error: "Message is required" });
        }

        if (!API_KEY) {
          return res.status(500).json({ error: "API key not configured" });
        }

        const chat = model.startChat({
          history: chatHistory,
          generationConfig: {
            maxOutputTokens: 500,
          },
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
          success: true,
          response: text,
        });
      } catch (error) {
        console.error("error", error);
        return res.status(500).json({
          error: "Internal server error",
          message: error.message,
        });
      }
    });
  });