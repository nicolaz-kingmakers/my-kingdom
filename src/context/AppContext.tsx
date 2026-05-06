import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  MOCK_USER, MOCK_WALLET, MOCK_KINGDOM, MOCK_AI_CONTEXT,
  User, Wallet, Kingdom, AiContext, WalletState, PaymentInstrument, deriveWalletState,
} from "../data/mockData";

// ─── Shape ───────────────────────────────────────────────────────────────────

interface AppState {
  user: User;
  wallet: Wallet;
  kingdom: Kingdom;
  aiContext: AiContext;
  isOnboarded: boolean;
  toast: string | null;
  pendingAutoTopUp: number | null;
}

interface AppActions {
  completeOnboarding: (name: string, pinnedGameIds: string[], theme: string, instrument: PaymentInstrument, autoTopUp: { enabled: boolean; threshold: number; amount: number }) => void;
  topUp: (amount: number) => void;
  spendBalance: (amount: number) => void;
  setAutoTopUp: (enabled: boolean, threshold: number, amount: number) => void;
  setTheme: (themeId: string) => void;
  dismissNudge: () => void;
  setOpenNudge: (nudge: AiContext["openNudge"]) => void;
  clearToast: () => void;
  confirmAutoTopUp: () => void;
  cancelAutoTopUp: () => void;
}

type AppContextValue = AppState & AppActions;

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [wallet, setWallet] = useState<Wallet>(MOCK_WALLET);
  const [kingdom, setKingdom] = useState<Kingdom>(MOCK_KINGDOM);
  const [aiContext, setAiContext] = useState<AiContext>(MOCK_AI_CONTEXT);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingAutoTopUp, setPendingAutoTopUp] = useState<number | null>(null);

  const autoTopUpPending = useRef(false);
  const prevWalletState = useRef<WalletState>(MOCK_WALLET.state);

  const completeOnboarding = useCallback(
    (
      name: string,
      pinnedGameIds: string[],
      theme: string,
      instrument: PaymentInstrument,
      autoTopUp: { enabled: boolean; threshold: number; amount: number },
    ) => {
      setUser((u) => ({ ...u, displayName: name, preferredTheme: theme, paymentInstrument: instrument }));
      setKingdom((k) => ({
        ...k,
        theme,
        pinnedGames: k.pinnedGames
          .filter((g) => pinnedGameIds.includes(g.id))
          .map((g, i) => ({ ...g, pinOrder: i + 1 })),
      }));
      setWallet((w) => ({
        ...w,
        autoTopUp: {
          enabled: autoTopUp.enabled,
          triggerThreshold: autoTopUp.threshold,
          topUpAmount: autoTopUp.amount,
        },
      }));
      setIsOnboarded(true);
    },
    []
  );

  const topUp = useCallback((amount: number) => {
    setWallet((w) => {
      const newBalance = w.balance + amount;
      const newState: WalletState = deriveWalletState(newBalance);
      return {
        ...w,
        balance: newBalance,
        state: newState,
        recentTransactions: [
          {
            id: `txn_${Date.now()}`,
            type: "TOP_UP",
            amount,
            timestamp: new Date().toISOString(),
            method: "One-tap preset",
            status: "SUCCESS",
          },
          ...w.recentTransactions.slice(0, 2),
        ],
      };
    });
    // Dismiss stale low-balance nudge; post-top-up nudge fires via wallet state effect
    setAiContext((a) => ({ ...a, openNudge: null }));
  }, []);

  const spendBalance = useCallback((amount: number) => {
    setWallet((w) => {
      const newBalance = Math.max(0, w.balance - amount);
      const newState: WalletState = deriveWalletState(newBalance);
      if (w.autoTopUp.enabled && newBalance < w.autoTopUp.triggerThreshold) {
        autoTopUpPending.current = true;
      }
      return {
        ...w,
        balance: newBalance,
        state: newState,
        recentTransactions: [
          {
            id: `txn_${Date.now()}`,
            type: "BET_PLACED" as const,
            amount,
            timestamp: new Date().toISOString(),
            method: "Kingdom",
            status: "SUCCESS" as const,
          },
          ...w.recentTransactions.slice(0, 2),
        ],
      };
    });
  }, []);

  // Keep me ready: show confirmation prompt when balance drops below threshold
  useEffect(() => {
    if (!autoTopUpPending.current) return;
    if (!wallet.autoTopUp.enabled) return;
    if (wallet.balance >= wallet.autoTopUp.triggerThreshold) return;

    autoTopUpPending.current = false;
    const t = setTimeout(() => {
      setPendingAutoTopUp(wallet.autoTopUp.topUpAmount);
    }, 1500);
    return () => clearTimeout(t);
  }, [wallet.balance, wallet.autoTopUp.enabled]);

  // Post-top-up nudge: fires when vault transitions from low → healthy
  useEffect(() => {
    const prev = prevWalletState.current;
    prevWalletState.current = wallet.state;

    if (prev !== "HEALTHY" && wallet.state === "HEALTHY") {
      const matchInfo = kingdom.pinnedGames[0]?.nextMatch ?? "your next match";
      const t = setTimeout(() => {
        setAiContext((a) => ({
          ...a,
          openNudge: {
            id: `nudge_${Date.now()}`,
            type: "SESSION_REMINDER",
            message: `You're set, ${user.displayName}. ${matchInfo} — go get it.`,
            ctaLabel: "Let's go",
            ctaAction: "DISMISS",
            suggestedAmount: 0,
            firedAt: new Date().toISOString(),
            dismissed: false,
          },
        }));
      }, 500);
      return () => clearTimeout(t);
    }
  }, [wallet.state, user.displayName, kingdom.pinnedGames]);

  const confirmAutoTopUp = useCallback(() => {
    if (pendingAutoTopUp === null) return;
    const amount = pendingAutoTopUp;
    setPendingAutoTopUp(null);
    topUp(amount);
    setToast(`Keep me ready: +R${amount} added ✓`);
  }, [pendingAutoTopUp, topUp]);

  const cancelAutoTopUp = useCallback(() => {
    setPendingAutoTopUp(null);
  }, []);

  const setAutoTopUp = useCallback(
    (enabled: boolean, threshold: number, amount: number) => {
      setWallet((w) => ({
        ...w,
        autoTopUp: { enabled, triggerThreshold: threshold, topUpAmount: amount },
      }));
    },
    []
  );

  const setTheme = useCallback((themeId: string) => {
    setKingdom((k) => ({ ...k, theme: themeId }));
    setUser((u) => ({ ...u, preferredTheme: themeId }));
  }, []);

  const dismissNudge = useCallback(() => {
    setAiContext((a) => ({ ...a, openNudge: null }));
  }, []);

  const setOpenNudge = useCallback((nudge: AiContext["openNudge"]) => {
    setAiContext((a) => ({ ...a, openNudge: nudge }));
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return (
    <AppContext.Provider
      value={{
        user, wallet, kingdom, aiContext, isOnboarded, toast, pendingAutoTopUp,
        completeOnboarding, topUp, spendBalance, setAutoTopUp, setTheme,
        dismissNudge, setOpenNudge, clearToast, confirmAutoTopUp, cancelAutoTopUp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
