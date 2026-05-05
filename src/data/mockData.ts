// Typed version of mock-data.json — canonical shared state for the whole team.
// Nico reads kingdom + user. Cris reads wallet. Abioye reads aiContext.

export type WalletState = "HEALTHY" | "LOW" | "EMPTY";
export type NudgeTone = "casual" | "competitive" | "analytical";
export type NudgeTrigger =
  | "LOW_BALANCE_BEFORE_SESSION"
  | "SESSION_REMINDER"
  | "GAME_ALERT"
  | "RECOVERY_NUDGE";

export interface Transaction {
  id: string;
  type: "TOP_UP" | "BET_PLACED" | "WINNINGS";
  amount: number; // positive = credit, negative = debit
  timestamp: string;
  description?: string;
  status: string;
  method?: string;
}

export interface PinnedGame {
  id: string;
  name: string;
  sport: string;
  icon: string;
  pinOrder: number;
  liveNow: boolean;
  nextMatch: string;
}

export interface Wallet {
  balance: number;
  currency: string;
  state: WalletState;
  autoTopUp: { enabled: boolean; triggerThreshold: number; topUpAmount: number };
  recentTransactions: Transaction[];
  topUpPresets: number[];
}

export interface User {
  id: string;
  displayName: string;
  fullName: string;
  avatar: string;
  memberSince: string;
  tier: string;
  preferredTheme: string;
  locale: string;
  currency: string;
  playStyle: string;
  usualSessionDay: string;
  usualSessionTime: string;
}

export interface Kingdom {
  pinnedGames: PinnedGame[];
  layout: "shelf-top" | "grid" | "list";
  theme: string;
}

export interface AiContext {
  lastSessionDate: string;
  averageSessionLengthMinutes: number;
  averageTopUpBeforeSession: number;
  typicalBetSize: number;
  favouriteMarket: string;
  nudgesTone: NudgeTone;
  openNudge: {
    id: string;
    type: NudgeTrigger;
    message: string;
    ctaLabel: string;
    ctaAction: string;
    suggestedAmount: number;
    firedAt: string;
    dismissed: boolean;
  } | null;
}

export const MOCK_USER: User = {
  id: "usr_nico_001",
  displayName: "Nico",
  fullName: "Nicolas Varela",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nico",
  memberSince: "2024-03-15",
  tier: "Gold",
  preferredTheme: "dark-gold",
  locale: "en-IE",
  currency: "EUR",
  playStyle: "competitive",
  usualSessionDay: "Friday",
  usualSessionTime: "20:00",
};

export const MOCK_WALLET: Wallet = {
  balance: 4.2,
  currency: "EUR",
  state: "LOW",
  autoTopUp: { enabled: true, triggerThreshold: 5, topUpAmount: 20 },
  recentTransactions: [
    {
      id: "txn_001",
      type: "TOP_UP",
      amount: 20,
      timestamp: "2026-05-02T19:45:00Z",
      method: "One-tap preset",
      status: "SUCCESS",
    },
    {
      id: "txn_002",
      type: "BET_PLACED",
      amount: -5,
      timestamp: "2026-05-02T20:10:00Z",
      description: "Man City vs Arsenal — Both to score",
      status: "SETTLED",
    },
    {
      id: "txn_003",
      type: "WINNINGS",
      amount: 12.5,
      timestamp: "2026-05-02T22:05:00Z",
      description: "Man City vs Arsenal — payout",
      status: "CREDITED",
    },
  ],
  topUpPresets: [10, 20, 50],
};

export const MOCK_KINGDOM: Kingdom = {
  pinnedGames: [
    {
      id: "game_001",
      name: "Premier League",
      sport: "football",
      icon: "⚽",
      pinOrder: 1,
      liveNow: true,
      nextMatch: "Man City vs Arsenal · Sat 17:30",
    },
    {
      id: "game_002",
      name: "UFC / MMA",
      sport: "mma",
      icon: "🥊",
      pinOrder: 2,
      liveNow: false,
      nextMatch: "UFC 314 · Sat 03:00",
    },
    {
      id: "game_003",
      name: "NBA",
      sport: "basketball",
      icon: "🏀",
      pinOrder: 3,
      liveNow: false,
      nextMatch: "Celtics vs Knicks · Fri 00:30",
    },
  ],
  layout: "shelf-top",
  theme: "dark-gold",
};

export const MOCK_AI_CONTEXT: AiContext = {
  lastSessionDate: "2026-05-02T20:00:00Z",
  averageSessionLengthMinutes: 90,
  averageTopUpBeforeSession: 20,
  typicalBetSize: 5,
  favouriteMarket: "Both teams to score",
  nudgesTone: "competitive",
  openNudge: {
    id: "nudge_001",
    type: "LOW_BALANCE_BEFORE_SESSION",
    message:
      "Friday night's almost here, Nico. Balance is €4.20 — not enough for your usual session. Top up €20?",
    ctaLabel: "Top up now",
    ctaAction: "OPEN_TOP_UP",
    suggestedAmount: 20,
    firedAt: "2026-05-08T17:00:00Z",
    dismissed: false,
  },
};

export const ALL_GAMES: PinnedGame[] = [
  ...MOCK_KINGDOM.pinnedGames,
  { id: "game_004", name: "Tennis", sport: "tennis", icon: "🎾", pinOrder: 4, liveNow: false, nextMatch: "Roland Garros · Mon" },
  { id: "game_005", name: "Formula 1", sport: "f1", icon: "🏎️", pinOrder: 5, liveNow: false, nextMatch: "Monaco GP · Sun" },
  { id: "game_006", name: "Cricket", sport: "cricket", icon: "🏏", pinOrder: 6, liveNow: false, nextMatch: "IPL · Sat" },
];

export function deriveWalletState(balance: number): WalletState {
  if (balance <= 0) return "EMPTY";
  if (balance < 10) return "LOW";
  return "HEALTHY";
}
