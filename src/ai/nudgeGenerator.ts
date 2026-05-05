// Tier 3 — AI nudge generation.
// Pure frontend mock — no backend required. Messages are templated with real
// user context so they feel personalised without needing an API key.

import type { NudgeRequest, NudgeResponse } from "./types";
import type { AiContext } from "../data/mockData";

// ─── Fallback messages (demo safety net) ─────────────────────────────────────

const FALLBACKS: Record<string, NudgeResponse> = {
  LOW_BALANCE_BEFORE_SESSION: {
    message: "Friday night's almost here, Nico. Balance is R42 — not enough for your PSL session. Top up R180?",
    ctaLabel: "Top up now",
    urgency: "high",
  },
  SESSION_REMINDER: {
    message: "PSL kicks off soon, Nico. Your kingdom is ready.",
    ctaLabel: "Open Kingdom",
    urgency: "low",
  },
  GAME_ALERT: {
    message: "Kaizer Chiefs vs Orlando Pirates is live. Your kingdom is ready.",
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

export async function generateNudge(req: NudgeRequest): Promise<NudgeResponse> {
  await new Promise((r) => setTimeout(r, 600));
  return buildPersonalisedNudge(req);
}

function buildPersonalisedNudge(req: NudgeRequest): NudgeResponse {
  const { name, balance, currency, trigger, usualSessionTime, favouriteGames, suggestedTopUpAmount, paymentInstrument } = req;
  const game = favouriteGames?.[0] ?? "PSL";
  const sym = currency === "ZAR" ? "R" : "€";

  switch (trigger) {
    case "LOW_BALANCE_BEFORE_SESSION":
      if (paymentInstrument === "VOUCHER") {
        return {
          message: `Friday night's almost here, ${name}. PSL kicks off tonight — get your 1Voucher before the games start.`,
          ctaLabel: "Voucher info",
          urgency: "high",
        };
      }
      return {
        message: `Friday night's almost here, ${name}. Balance is ${sym}${balance.toFixed(0)} — not enough for your usual session. Top up ${sym}${suggestedTopUpAmount}?`,
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

// ─── Trigger evaluation ───────────────────────────────────────────────────────

export interface TriggerCheckInput {
  balance: number;
  usualSessionDay: string;
  usualSessionTime: string;
  now?: Date;
}

export function evaluateTrigger(
  input: TriggerCheckInput
): NonNullable<AiContext["openNudge"]>["type"] | null {
  const now = input.now ?? new Date();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayName = dayNames[now.getDay()];
  const [sessionHour, sessionMin] = input.usualSessionTime.split(":").map(Number);
  const sessionMinutes = sessionHour * 60 + sessionMin;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minutesUntilSession = sessionMinutes - nowMinutes;

  // Pre-session low balance: correct day, within 2h of session, balance < R100
  if (
    todayName === input.usualSessionDay &&
    minutesUntilSession > 0 &&
    minutesUntilSession <= 120 &&
    input.balance < 100
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
