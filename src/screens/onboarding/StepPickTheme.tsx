const THEMES = [
  { id: "dark-gold",  label: "Dark Gold",  bg: "#0f0f0f", accent: "#c9a84c", preview: "👑" },
  { id: "dark-blue",  label: "Dark Blue",  bg: "#0a0f1a", accent: "#4a90e2", preview: "🌊" },
  { id: "light",      label: "Clean Light", bg: "#f5f5f5", accent: "#1a1a1a", preview: "☀️" },
];

interface Props {
  selected: string;
  onChange: (theme: string) => void;
}

export default function StepPickTheme({ selected, onChange }: Props) {
  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        Choose your style
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
        Your Kingdom, your look.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {THEMES.map((theme) => {
          const isActive = selected === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: isActive ? "var(--bg-card-raised)" : "var(--bg-card)",
                border: `2px solid ${isActive ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                cursor: "pointer",
                color: "var(--text-primary)",
                textAlign: "left",
                transition: "all var(--transition)",
                boxShadow: isActive ? "var(--shadow-gold)" : "none",
              }}
            >
              {/* Mini preview swatch */}
              <div
                style={{
                  width: 44, height: 44,
                  borderRadius: "var(--radius-sm)",
                  background: theme.bg,
                  border: `2px solid ${theme.accent}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}
              >
                {theme.preview}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{theme.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {theme.id === "dark-gold" ? "Recommended" : ""}
                </div>
              </div>
              {isActive && (
                <div style={{ marginLeft: "auto", color: "var(--gold)", fontWeight: 800 }}>✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
