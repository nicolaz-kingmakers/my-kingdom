// Root routing shell — owned by Abioye.
// All screen navigation lives here. Nico and Cris never need to touch this.

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useNudgeEngine } from "../ai/useNudgeEngine";

import BeforeScreen from "../screens/BeforeScreen";
import KingdomHomeScreen from "../screens/KingdomHomeScreen";
import OnboardingFlow from "./OnboardingFlow";
import TopUpConfirmScreen from "../screens/topup/TopUpConfirmScreen";
import TopUpSuccessScreen from "../screens/topup/TopUpSuccessScreen";
import Toast from "../components/Toast";

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

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppFlow() {
  return (
    <HashRouter>
      <Routes_ />
      <Toast />
    </HashRouter>
  );
}
