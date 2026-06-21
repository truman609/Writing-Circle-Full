import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "placeholder",
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const { system, messages } = req.body as {
    system: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!system || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing system or messages" });
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages,
    });
    const text = response.content[0]?.type === "text" ? response.content[0].text : "...";
    res.json({ text });
  } catch (err) {
    req.log.error({ err }, "AI chat error");
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
