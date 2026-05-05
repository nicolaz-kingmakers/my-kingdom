// Express API server — proxied by Vite at /api/*
// Run with: ts-node server/index.ts (or via npm run dev:server)
// Keeps the ANTHROPIC_API_KEY server-side only — never exposed to the browser.

import { config } from "dotenv";
import { resolve } from "path";
import express, { Request, Response } from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import type { NudgeRequest, NudgeResponse } from "../src/ai/types";

const dotenvResult = config({ path: resolve(__dirname, "../.env"), override: true });
const apiKey = dotenvResult.parsed?.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("[server] ANTHROPIC_API_KEY not found — check .env at project root");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const client = new Anthropic({ apiKey });

const SYSTEM_PROMPT = `You are a smart wallet assistant for a sports betting app called My Kingdom.
Your job is to generate short, personalised nudge notifications.

Rules:
- Maximum 2 sentences. Never more.
- Match the user's tone: casual = friendly/relaxed, competitive = driven/energetic, analytical = data-led/precise.
- Always end with a clear action or observation.
- Never be pushy or gambling-promotional. Be helpful, like a smart friend who has their back.
- Output valid JSON only — no markdown, no explanation, no code block:
  { "message": "...", "ctaLabel": "...", "urgency": "low|medium|high" }`;

app.post("/api/nudge", async (req: Request, res: Response) => {
  const body = req.body as NudgeRequest;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a nudge for this user:

Name: ${body.name}
Balance: ${body.currency}${body.balance.toFixed(2)}
Trigger: ${body.trigger}
Usual session: ${body.usualSessionDay} at ${body.usualSessionTime}
Favourite games: ${body.favouriteGames.join(", ")}
Tone: ${body.tone}
Suggested top-up: ${body.currency}${body.suggestedTopUpAmount}`,
        },
      ],
    });

    const raw =
      response.content[0].type === "text" ? response.content[0].text.trim() : "{}";
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const nudge = JSON.parse(text) as NudgeResponse;
    res.json(nudge);
  } catch (err) {
    console.error("[/api/nudge] Error:", err);
    res.status(500).json({ error: "nudge generation failed" });
  }
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
