import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { MOCK_KINGDOM } from "../data/mockData";
import type { PaymentInstrument } from "../data/mockData";
import StepPickGames from "../screens/onboarding/StepPickGames";
import StepPickTheme from "../screens/onboarding/StepPickTheme";
import StepSetName from "../screens/onboarding/StepSetName";
import StepFundVault, { type KeepMeReadyConfig } from "../screens/onboarding/StepFundVault";
import StepComplete from "../screens/onboarding/StepComplete";

const TOTAL_STEPS = 4; // Complete screen is not a numbered step

const STEP_LABELS = ["Your games", "Your style", "Your name", "Your vault"];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(() => {
    const s = parseInt(searchParams.get("step") ?? "0");
    return isNaN(s) ? 0 : Math.min(s, 3);
  });
  const [name, setName] = useState("Nico");
  const [selectedGames, setSelectedGames] = useState<string[]>(
    ["game_006", "game_005", "game_001", "game_004", "game_009"]
  );
  const [theme, setTheme] = useState("dark-gold");
  const [instrument, setInstrument] = useState<PaymentInstrument>("SAVED_CARD");
  const [keepMeReady, setKeepMeReady] = useState<KeepMeReadyConfig>({ enabled: false, threshold: 50, amount: 180 });

  const canAdvance = () => {
    if (step === 0) return selectedGames.length >= 1;
    if (step === 1) return !!theme;
    if (step === 2) return name.trim().length >= 1;
    if (step === 3) return !!instrument;
    return true;
  };

  const advance = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      completeOnboarding(name.trim(), selectedGames, theme, instrument, keepMeReady);
      setStep(TOTAL_STEPS); // completion screen
    }
  };

  const enterKingdom = () => navigate("/home");

  return (
    <div className="app-frame">
      <div className="screen-content" style={{ paddingTop: 48, paddingBottom: 120 }}>

        {/* ── Completion screen ── */}
        {step === TOTAL_STEPS && (
          <StepComplete name={name} onEnterKingdom={enterKingdom} />
        )}

        {/* ── Step 0: Pick games ── */}
        {step === 0 && (
          <StepPickGames selected={selectedGames} onChange={setSelectedGames} />
        )}

        {/* ── Step 1: Pick theme ── */}
        {step === 1 && (
          <StepPickTheme selected={theme} onChange={setTheme} />
        )}

        {/* ── Step 2: Set name ── */}
        {step === 2 && (
          <StepSetName value={name} onChange={setName} />
        )}

        {/* ── Step 3: Fund vault ── */}
        {step === 3 && (
          <StepFundVault
            selected={instrument}
            onChange={setInstrument}
            keepMeReady={keepMeReady}
            onKeepMeReadyChange={setKeepMeReady}
          />
        )}

      </div>

      {/* ── Footer: progress + CTA ── */}
      {step < TOTAL_STEPS && (
        <div
          style={{
            position: "sticky", bottom: 0,
            background: "var(--bg-base)",
            borderTop: "1px solid var(--border)",
            padding: "16px 16px 32px",
          }}
        >
          {/* Step label */}
          <div style={{
            fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
            letterSpacing: 0.8, textAlign: "center", marginBottom: 12,
          }}>
            {STEP_LABELS[step].toUpperCase()} · {step + 1} of {TOTAL_STEPS}
          </div>

          {/* Progress dots */}
          <div className="progress-dots" style={{ marginBottom: 16 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`progress-dot ${i === step ? "active" : ""}`} />
            ))}
          </div>

          <button
            className="btn btn-primary"
            disabled={!canAdvance()}
            onClick={advance}
          >
            {step < TOTAL_STEPS - 1 ? "Continue" : "Enter my Kingdom →"}
          </button>

          {step > 0 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
