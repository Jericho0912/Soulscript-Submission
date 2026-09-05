import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client securely on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

// API endpoint for Gemini reflections and chat assistance
app.post("/api/reflect", async (req, res) => {
  try {
    const { messages, userPrompt, contextTopic } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const systemInstruction = `You are a compassionate, insightful, and wise AI reflection partner and journaling guide. 
    Your goal is to help the user unpack their thoughts, journal entries, or brainstorming topics, provide meaningful reflections, 
    gentle psychological insights, constructive feedback, brainstorming ideas, and a concise takeaway summary.
    Always be supportive, empathetic, articulate, and structured.`;

    const chatHistory = messages || [];
    
    const formattedHistory = chatHistory.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const contents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: `Topic / Context: ${contextTopic || "General Reflection"}\n\nUser Input: ${userPrompt}` }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    });

    const replyText = response.text || "I'm here to listen and reflect with you. Could you tell me a bit more about how you're feeling?";

    // Generate a brief 1-sentence summary/insight for the session entry card
    let summaryText = "";
    try {
      const summaryResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Summarize this journal reflection in one concise, uplifting, insightful sentence (max 20 words):\n\nTopic: ${contextTopic}\nLatest Exchange: ${userPrompt} -> ${replyText}` }]
          }
        ],
        config: { temperature: 0.3, maxOutputTokens: 60 }
      });
      summaryText = summaryResponse.text?.trim() || "";
    } catch {
      summaryText = "Reflection session completed.";
    }

    res.json({ reply: replyText, summary: summaryText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
