import type { NudgeTone, NudgeTrigger } from "../data/mockData";

export interface NudgeRequest {
  name: string;
  balance: number;
  currency: string;
  usualSessionDay: string;
  usualSessionTime: string;
  trigger: NudgeTrigger;
  favouriteGames: string[];
  tone: NudgeTone;
  suggestedTopUpAmount: number;
}

export interface NudgeResponse {
  message: string;
  ctaLabel: string;
  urgency: "low" | "medium" | "high";
}
