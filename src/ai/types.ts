import type { NudgeTone, NudgeTrigger, PaymentInstrument } from "../data/mockData";

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
  paymentInstrument?: PaymentInstrument;
}

export interface NudgeResponse {
  message: string;
  ctaLabel: string;
  urgency: "low" | "medium" | "high";
}
