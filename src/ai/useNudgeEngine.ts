// Hook that wires the trigger evaluator + nudge generator together.
// Mount it once in App.tsx — it runs silently in the background.

import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { generateNudge, evaluateTrigger } from "./nudgeGenerator";

const CHECK_INTERVAL_MS = 60_000;

export function useNudgeEngine() {
  const { user, wallet, aiContext, setOpenNudge } = useApp();
  const lastFiredRef = useRef<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (aiContext.openNudge && !aiContext.openNudge.dismissed) return;

      const trigger = evaluateTrigger({
        balance: wallet.balance,
        usualSessionDay: user.usualSessionDay,
        usualSessionTime: user.usualSessionTime,
      });

      if (!trigger) return;

      const triggerKey = `${trigger}_${new Date().toISOString().slice(0, 13)}`;
      if (lastFiredRef.current === triggerKey) return;
      lastFiredRef.current = triggerKey;

      const nudgeResponse = await generateNudge({
        name: user.displayName,
        balance: wallet.balance,
        currency: user.currency,
        usualSessionDay: user.usualSessionDay,
        usualSessionTime: user.usualSessionTime,
        trigger,
        favouriteGames: aiContext.lastSessionDate ? [user.usualSessionDay] : [],
        tone: aiContext.nudgesTone,
        suggestedTopUpAmount: wallet.autoTopUp.topUpAmount,
        paymentInstrument: user.paymentInstrument,
      });

      setOpenNudge({
        id: `nudge_${Date.now()}`,
        type: trigger,
        message: nudgeResponse.message,
        ctaLabel: nudgeResponse.ctaLabel,
        ctaAction: "OPEN_TOP_UP",
        suggestedAmount: wallet.autoTopUp.topUpAmount,
        firedAt: new Date().toISOString(),
        dismissed: false,
      });
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [wallet.balance, user.usualSessionDay, user.usualSessionTime, aiContext.openNudge]);
}
