import type { PaymentInstrument } from "../../data/mockData";

interface Props {
  selected: PaymentInstrument;
  onChange: (instrument: PaymentInstrument) => void;
}

const INSTRUMENTS: {
  id: PaymentInstrument;
  icon: string;
  name: string;
  badge: string;
  description: string;
  badgeColor: string;
}[] = [
  {
    id: "INSTANT_EFT",
    icon: "⚡",
    name: "Instant EFT",
    badge: "Most popular",
    description: "Near-instant settlement · Ozow / Peach · For one-tap top-ups",
    badgeColor: "var(--brand)",
  },
  {
    id: "SAVED_CARD",
    icon: "💳",
    name: "Saved Card",
    badge: "Best for Keep me ready",
    description: "True one-tap · Visa / Mastercard · Required for auto vault",
    badgeColor: "var(--gold)",
  },
  {
    id: "VOUCHER",
    icon: "🎟️",
    name: "1Voucher",
    badge: "No bank needed",
    description: "Buy in-store · Works anywhere · Manual top-up only",
    badgeColor: "var(--green)",
  },
];

export default function StepFundVault({ selected, onChange }: Props) {
  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        Fund your vault
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
        Your payment method is saved and ready for one-tap top-ups before every session.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {INSTRUMENTS.map((inst) => {
          const isSelected = selected === inst.id;
          return (
            <button
              key={inst.id}
              onClick={() => onChange(inst.id)}
              style={{
                background: isSelected ? "var(--bg-card-raised)" : "var(--bg-card)",
                border: `2px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
                borderRadius: 14,
                padding: "16px 16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--transition)",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: isSelected ? "0 0 20px var(--gold-dim)" : "none",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: isSelected ? "rgba(240,180,41,0.12)" : "var(--bg-base)",
                border: `1px solid ${isSelected ? "rgba(240,180,41,0.3)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>
                {inst.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                    {inst.name}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: 0.4,
                    background: inst.badgeColor, color: inst.badgeColor === "var(--gold)" ? "#000" : "#fff",
                    padding: "2px 7px", borderRadius: 4,
                    opacity: isSelected ? 1 : 0.6,
                  }}>
                    {inst.badge.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {inst.description}
                </div>
              </div>

              {/* Selected indicator */}
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${isSelected ? "var(--gold)" : "var(--border-strong)"}`,
                background: isSelected ? "var(--gold)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#000",
                transition: "all var(--transition)",
              }}>
                {isSelected ? "✓" : ""}
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 20, lineHeight: 1.6 }}>
        You can change this at any time in your vault settings.
      </p>
    </div>
  );
}
