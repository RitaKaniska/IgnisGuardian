import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in server/.env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

function buildPromptFromMessages(messages) {
  const lines = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && m.role && typeof m.content === "string")
    .map((m) => `${String(m.role).toUpperCase()}: ${m.content.trim()}`)
    .join("\n");
  return lines || "";
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/chat", async (req, res) => {
  try {
    const { message, messages } = req.body || {};

    const prompt =
      (typeof message === "string" && message.trim()) ||
      buildPromptFromMessages(messages);

    if (!prompt) return res.status(400).json({ error: "Missing message/messages" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemHint =
      "Bạn là chatbot hỗ trợ người dùng trên website. Trả lời ngắn gọn, rõ ràng, tiếng Việt.";

    const result = await model.generateContent(`${systemHint}\n\n${prompt}`);
    const reply = result?.response?.text?.() ?? "Mình chưa trả lời được.";

    return res.json({ reply });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`MVP server listening on http://localhost:${PORT}`);
});
