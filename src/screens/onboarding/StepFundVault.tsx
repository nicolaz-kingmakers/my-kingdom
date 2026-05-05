import { useState } from "react";
import type { PaymentInstrument } from "../../data/mockData";

export interface KeepMeReadyConfig {
  enabled: boolean;
  threshold: number;
  amount: number;
}

interface Props {
  selected: PaymentInstrument;
  onChange: (instrument: PaymentInstrument) => void;
  keepMeReady: KeepMeReadyConfig;
  onKeepMeReadyChange: (config: KeepMeReadyConfig) => void;
}

const INSTRUMENTS: {
  id: PaymentInstrument;
  icon: string;
  name: string;
  badge: string;
  description: string;
  badgeColor: string;
  eligibleForKMR: boolean;
}[] = [
  {
    id: "SAVED_CARD",
    icon: "💳",
    name: "Saved Card",
    badge: "Keep me ready ✨",
    description: "Visa / Mastercard · True one-tap · Enables automatic vault refill",
    badgeColor: "var(--gold)",
    eligibleForKMR: true,
  },
  {
    id: "MOBILE_MONEY",
    icon: "📱",
    name: "Mobile Money",
    badge: "Keep me ready ✨",
    description: "MTN MoMo · Airtel · Instant · Enables automatic vault refill",
    badgeColor: "var(--gold)",
    eligibleForKMR: true,
  },
  {
    id: "INSTANT_EFT",
    icon: "⚡",
    name: "Instant EFT",
    badge: "Fast deposits",
    description: "Ozow / Peach · Near-instant settlement · Manual top-up only",
    badgeColor: "var(--brand)",
    eligibleForKMR: false,
  },
  {
    id: "VOUCHER",
    icon: "🎟️",
    name: "1Voucher",
    badge: "Cash friendly",
    description: "Buy in-store · Works anywhere · Manual top-up only",
    badgeColor: "var(--green)",
    eligibleForKMR: false,
  },
];

const THRESHOLD_PRESETS = [50, 100, 150];
const AMOUNT_PRESETS    = [100, 180, 250];

export default function StepFundVault({ selected, onChange, keepMeReady, onKeepMeReadyChange }: Props) {
  const [thresholdCustom, setThresholdCustom] = useState(false);
  const [amountCustom, setAmountCustom]       = useState(false);
  const [thresholdInput, setThresholdInput]   = useState("");
  const [amountInput, setAmountInput]         = useState("");

  const selectedInst = INSTRUMENTS.find(i => i.id === selected);

  const selectInstrument = (inst: typeof INSTRUMENTS[0]) => {
    onChange(inst.id);
    if (!inst.eligibleForKMR) {
      onKeepMeReadyChange({ ...keepMeReady, enabled: false });
    }
  };

  const setThreshold = (v: number) => {
    setThresholdCustom(false);
    onKeepMeReadyChange({ ...keepMeReady, threshold: v });
  };

  const setAmount = (v: number) => {
    setAmountCustom(false);
    onKeepMeReadyChange({ ...keepMeReady, amount: v });
  };

  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>Fund your vault</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
        Cards and Mobile Money unlock <strong style={{ color: "var(--text-primary)" }}>Keep me ready</strong> — your vault refills automatically so you're never cut off mid-session.
      </p>

      {/* ── Instrument selector ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {INSTRUMENTS.map(inst => {
          const isSelected = selected === inst.id;
          const borderColor = isSelected
            ? inst.eligibleForKMR ? "var(--gold)" : "var(--brand)"
            : "var(--border)";
          return (
            <button
              key={inst.id}
              onClick={() => selectInstrument(inst)}
              style={{
                background: isSelected ? "var(--bg-card-raised)" : "var(--bg-card)",
                border: `2px solid ${borderColor}`,
                borderRadius: 14, padding: "14px 16px",
                cursor: "pointer", textAlign: "left",
                transition: "all var(--transition)",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: isSelected && inst.eligibleForKMR ? "0 0 20px var(--gold-dim)" : "none",
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: isSelected ? "rgba(240,180,41,0.10)" : "var(--bg-base)",
                border: `1px solid ${isSelected ? "rgba(240,180,41,0.25)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {inst.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{inst.name}</span>
                  <span style={{
                    fontSize: 8, fontWeight: 900, letterSpacing: 0.4,
                    background: inst.badgeColor,
                    color: inst.eligibleForKMR ? "#000" : "#fff",
                    padding: "2px 6px", borderRadius: 4,
                    opacity: isSelected ? 1 : 0.55,
                  }}>
                    {inst.badge.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{inst.description}</div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${isSelected ? borderColor : "var(--border-strong)"}`,
                background: isSelected ? borderColor : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#000", transition: "all var(--transition)",
              }}>
                {isSelected ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Keep me ready panel (eligible instruments only) ── */}
      {selectedInst?.eligibleForKMR && (
        <div className="fade-up" style={{
          background: "var(--bg-card)",
          border: "1px solid var(--gold)",
          borderRadius: 16, padding: "16px",
          boxShadow: "0 0 24px var(--gold-dim)",
        }}>
          {/* Header + toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontSize: 14, fontWeight: 900 }}>Keep me ready</span>
            </div>
            <button
              onClick={() => onKeepMeReadyChange({ ...keepMeReady, enabled: !keepMeReady.enabled })}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0,
                background: keepMeReady.enabled ? "var(--gold)" : "var(--border-strong)",
                position: "relative", transition: "background 200ms ease",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: keepMeReady.enabled ? 22 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 200ms ease",
              }} />
            </button>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: keepMeReady.enabled ? 16 : 0 }}>
            {keepMeReady.enabled
              ? `Your vault will top up from your ${selectedInst.name} automatically — you stay in the game.`
              : "Enable to automatically refill your vault from your saved payment method."}
          </p>

          {keepMeReady.enabled && (
            <div className="fade-up">
              {/* Threshold */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 0.6, marginBottom: 8 }}>
                  TOP UP WHEN VAULT DROPS BELOW
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {THRESHOLD_PRESETS.map(v => {
                    const active = keepMeReady.threshold === v && !thresholdCustom;
                    return (
                      <button key={v} onClick={() => setThreshold(v)} style={{
                        padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: 800, transition: "all 150ms ease",
                        background: active ? "var(--gold)" : "var(--bg-card-raised)",
                        color: active ? "#000" : "var(--text-secondary)",
                      }}>R{v}</button>
                    );
                  })}
                  <button onClick={() => { setThresholdCustom(true); setThresholdInput(String(keepMeReady.threshold)); }} style={{
                    padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 800, transition: "all 150ms ease",
                    background: thresholdCustom ? "var(--gold)" : "var(--bg-card-raised)",
                    color: thresholdCustom ? "#000" : "var(--text-secondary)",
                  }}>Custom</button>
                </div>
                {thresholdCustom && (
                  <div className="fade-up" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-muted)" }}>R</span>
                    <input
                      type="number" min={10} max={500}
                      value={thresholdInput}
                      onChange={e => {
                        setThresholdInput(e.target.value);
                        const n = parseInt(e.target.value);
                        if (!isNaN(n) && n > 0) onKeepMeReadyChange({ ...keepMeReady, threshold: n });
                      }}
                      placeholder="e.g. 75"
                      style={{
                        background: "var(--bg-base)", border: "1px solid var(--border-strong)",
                        borderRadius: 8, padding: "8px 12px", fontSize: 14, fontWeight: 700,
                        color: "var(--text-primary)", width: 120, outline: "none",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 0.6, marginBottom: 8 }}>
                  AMOUNT TO ADD AUTOMATICALLY
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {AMOUNT_PRESETS.map(v => {
                    const active = keepMeReady.amount === v && !amountCustom;
                    return (
                      <button key={v} onClick={() => setAmount(v)} style={{
                        padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: 800, transition: "all 150ms ease",
                        background: active ? "var(--gold)" : "var(--bg-card-raised)",
                        color: active ? "#000" : "var(--text-secondary)",
                      }}>R{v}</button>
                    );
                  })}
                  <button onClick={() => { setAmountCustom(true); setAmountInput(String(keepMeReady.amount)); }} style={{
                    padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: 800, transition: "all 150ms ease",
                    background: amountCustom ? "var(--gold)" : "var(--bg-card-raised)",
                    color: amountCustom ? "#000" : "var(--text-secondary)",
                  }}>Custom</button>
                </div>
                {amountCustom && (
                  <div className="fade-up" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-muted)" }}>R</span>
                    <input
                      type="number" min={10} max={2000}
                      value={amountInput}
                      onChange={e => {
                        setAmountInput(e.target.value);
                        const n = parseInt(e.target.value);
                        if (!isNaN(n) && n > 0) onKeepMeReadyChange({ ...keepMeReady, amount: n });
                      }}
                      placeholder="e.g. 200"
                      style={{
                        background: "var(--bg-base)", border: "1px solid var(--border-strong)",
                        borderRadius: 8, padding: "8px 12px", fontSize: 14, fontWeight: 700,
                        color: "var(--text-primary)", width: 120, outline: "none",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Consent statement */}
              <div style={{
                background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.2)",
                borderRadius: 10, padding: "10px 12px",
                fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6,
              }}>
                By enabling Keep me ready, you authorise automatic top-ups of{" "}
                <strong style={{ color: "var(--text-primary)" }}>R{keepMeReady.amount}</strong> from your{" "}
                {selectedInst.name} when your vault drops below{" "}
                <strong style={{ color: "var(--text-primary)" }}>R{keepMeReady.threshold}</strong>.{" "}
                You can pause or cancel at any time in vault settings.
              </div>
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.6 }}>
        You can change your payment method at any time in vault settings.
      </p>
    </div>
  );
}
