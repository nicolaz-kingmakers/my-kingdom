import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  MOCK_USER, MOCK_WALLET, MOCK_KINGDOM, MOCK_AI_CONTEXT,
  User, Wallet, Kingdom, AiContext, WalletState, deriveWalletState,
} from "../data/mockData";

// ─── Shape ───────────────────────────────────────────────────────────────────

interface AppState {
  user: User;
  wallet: Wallet;
  kingdom: Kingdom;
  aiContext: AiContext;
  isOnboarded: boolean;
  toast: string | null;
}

interface AppActions {
  completeOnboarding: (name: string, pinnedGameIds: string[], theme: string) => void;
  topUp: (amount: number) => void;
  spendBalance: (amount: number) => void;
  setAutoTopUp: (enabled: boolean, threshold: number, amount: number) => void;
  dismissNudge: () => void;
  setOpenNudge: (nudge: AiContext["openNudge"]) => void;
  clearToast: () => void;
}

type AppContextValue = AppState & AppActions;

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [wallet, setWallet] = useState<Wallet>(MOCK_WALLET);
  const [kingdom, setKingdom] = useState<Kingdom>(MOCK_KINGDOM);
  const [aiContext, setAiContext] = useState<AiContext>(MOCK_AI_CONTEXT);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const autoTopUpPending = useRef(false);

  const completeOnboarding = useCallback(
    (name: string, pinnedGameIds: string[], theme: string) => {
      setUser((u) => ({ ...u, displayName: name, preferredTheme: theme }));
      setKingdom((k) => ({
        ...k,
        theme,
        pinnedGames: k.pinnedGames
          .filter((g) => pinnedGameIds.includes(g.id))
          .map((g, i) => ({ ...g, pinOrder: i + 1 })),
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
    // Dismiss any open nudge — message is now stale
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

  // Auto top-up: fires 1.5s after a bet drops balance below threshold
  useEffect(() => {
    if (!autoTopUpPending.current) return;
    if (!wallet.autoTopUp.enabled) return;
    if (wallet.balance >= wallet.autoTopUp.triggerThreshold) return;

    autoTopUpPending.current = false;
    const t = setTimeout(() => {
      const amount = wallet.autoTopUp.topUpAmount;
      topUp(amount);
      setToast(`Auto top-up: +€${amount} added automatically 🔄`);
    }, 1500);
    return () => clearTimeout(t);
  }, [wallet.balance, wallet.autoTopUp.enabled]);

  const setAutoTopUp = useCallback(
    (enabled: boolean, threshold: number, amount: number) => {
      setWallet((w) => ({
        ...w,
        autoTopUp: { enabled, triggerThreshold: threshold, topUpAmount: amount },
      }));
    },
    []
  );

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
        user, wallet, kingdom, aiContext, isOnboarded, toast,
        completeOnboarding, topUp, spendBalance, setAutoTopUp,
        dismissNudge, setOpenNudge, clearToast,
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
