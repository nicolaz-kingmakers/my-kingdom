// Root routing shell — owned by Abioye.
// All screen navigation lives here. Nico and Cris never need to touch this.

import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useNudgeEngine } from "../ai/useNudgeEngine";
import { THEME_CATALOG, DEFAULT_THEME } from "../data/themes";

import BeforeScreen from "../screens/BeforeScreen";
import KingdomHomeScreen from "../screens/KingdomHomeScreen";
import OnboardingFlow from "./OnboardingFlow";
import TopUpConfirmScreen from "../screens/topup/TopUpConfirmScreen";
import TopUpSuccessScreen from "../screens/topup/TopUpSuccessScreen";
import SubmissionDeckScreen from "../screens/SubmissionDeckScreen";
import Toast from "../components/Toast";

// Injects theme CSS variables at the root so every var(--brand) etc. across
// the whole app automatically reflects the active theme.
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { kingdom } = useApp();
  const theme = THEME_CATALOG[kingdom.theme] ?? DEFAULT_THEME;
  return (
    <div style={{ ...theme.vars as React.CSSProperties, display: "contents" }}>
      {children}
    </div>
  );
}

function Routes_() {
  const { isOnboarded } = useApp();

  // Tier 3: AI nudge engine runs silently once the user is onboarded
  useNudgeEngine();

  return (
    <Routes>
      {/* Demo entry: "before" generic screen */}
      <Route path="/" element={<BeforeScreen />} />

      {/* Onboarding wizard */}
      <Route path="/onboarding" element={<OnboardingFlow />} />

      {/* Post-onboarding home */}
      <Route
        path="/home"
        element={isOnboarded ? <KingdomHomeScreen /> : <Navigate to="/onboarding" replace />}
      />

      {/* Top-up flow (Tier 2) */}
      <Route path="/topup/confirm" element={<TopUpConfirmScreen />} />
      <Route path="/topup/success" element={<TopUpSuccessScreen />} />

      {/* Submission deck */}
      <Route path="/submission-deck" element={<SubmissionDeckScreen />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppFlow() {
  return (
    <HashRouter>
      <ThemeWrapper>
        <Routes_ />
        <Toast />
      </ThemeWrapper>
    </HashRouter>
  );
}
