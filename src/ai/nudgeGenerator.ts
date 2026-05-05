// Tier 3 — AI nudge generation via Claude API.
// Calls /api/nudge (Express server proxied by Vite).
// Falls back to pre-written mock if the API call fails — demo never dies.

import type { NudgeRequest, NudgeResponse } from "./types";
import type { AiContext } from "../data/mockData";
import { MOCK_AI_CONTEXT } from "../data/mockData";

// ─── Fallback messages (demo safety net) ─────────────────────────────────────

const FALLBACKS: Record<string, NudgeResponse> = {
  LOW_BALANCE_BEFORE_SESSION: {
    message: "Friday night's almost here, Nico. Balance is low — not enough for your usual session.",
    ctaLabel: "Top up now",
    urgency: "high",
  },
  SESSION_REMINDER: {
    message: "Premier League kicks off soon, Nico. Your kingdom is ready.",
    ctaLabel: "Open Kingdom",
    urgency: "low",
  },
  GAME_ALERT: {
    message: "Man City vs Arsenal is live. Your kingdom is ready.",
    ctaLabel: "Watch live",
    urgency: "medium",
  },
  RECOVERY_NUDGE: {
    message: "Your balance dropped after last session. Top up when you're ready.",
    ctaLabel: "Top up",
    urgency: "low",
  },
};

// ─── Main generator ───────────────────────────────────────────────────────────
// Pure frontend mock — no backend required. Messages are templated with real
// user context so they feel personalised without needing an API key.

export async function generateNudge(req: NudgeRequest): Promise<NudgeResponse> {
  // Small simulated delay so the nudge feels like it was "thought about"
  await new Promise((r) => setTimeout(r, 600));
  return buildPersonalisedNudge(req);
}

function buildPersonalisedNudge(req: NudgeRequest): NudgeResponse {
  const { name, balance, currency, trigger, usualSessionTime, favouriteGames, suggestedTopUpAmount } = req;
  const game = favouriteGames?.[0] ?? "your game";

  switch (trigger) {
    case "LOW_BALANCE_BEFORE_SESSION":
      return {
        message: `Friday night's almost here, ${name}. Balance is ${currency}${balance.toFixed(2)} — not enough for your usual session. Top up ${currency}${suggestedTopUpAmount}?`,
        ctaLabel: "Top up now",
        urgency: "high",
      };
    case "SESSION_REMINDER":
      return {
        message: `Your session starts at ${usualSessionTime}, ${name}. Vault's ready — ${game} is on tonight.`,
        ctaLabel: "Open Kingdom",
        urgency: "low",
      };
    case "GAME_ALERT":
      return {
        message: `${game} is live right now, ${name}. Your Kingdom is ready.`,
        ctaLabel: "Watch live",
        urgency: "medium",
      };
    case "RECOVERY_NUDGE":
      return {
        message: `Balance dropped after last session, ${name}. Top up when you're ready — no pressure.`,
        ctaLabel: "Top up",
        urgency: "low",
      };
    default:
      return FALLBACKS.LOW_BALANCE_BEFORE_SESSION;
  }
}

// ─── Trigger evaluation (Cris wires the schedule; this is the logic spec) ────

export interface TriggerCheckInput {
  balance: number;
  usualSessionDay: string;  // e.g. "Friday"
  usualSessionTime: string; // e.g. "20:00"
  now?: Date;
}

export function evaluateTrigger(
  input: TriggerCheckInput
): AiContext["openNudge"]["type"] | null {
  const now = input.now ?? new Date();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayName = dayNames[now.getDay()];
  const [sessionHour, sessionMin] = input.usualSessionTime.split(":").map(Number);
  const sessionMinutes = sessionHour * 60 + sessionMin;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minutesUntilSession = sessionMinutes - nowMinutes;

  // Pre-session low balance: it's their usual day, 2h window before session, balance < €10
  if (
    todayName === input.usualSessionDay &&
    minutesUntilSession > 0 &&
    minutesUntilSession <= 120 &&
    input.balance < 10
  ) {
    return "LOW_BALANCE_BEFORE_SESSION";
  }

  // Session starting soon (within 60 min, any balance)
  if (
    todayName === input.usualSessionDay &&
    minutesUntilSession > 0 &&
    minutesUntilSession <= 60
  ) {
    return "SESSION_REMINDER";
  }

  return null;
}
