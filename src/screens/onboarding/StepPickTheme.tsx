import { useState } from "react";
import { THEME_CATALOG, THEME_CATEGORIES } from "../../data/themes";

interface Props {
  selected: string;
  onChange: (theme: string) => void;
}

export default function StepPickTheme({ selected, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("kingdom");

  const visibleThemes = Object.values(THEME_CATALOG).filter(
    (t) => t.category === activeCategory
  );

  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        Choose your style
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
        Your Kingdom colours. Pick your club, country, or a tournament.
      </p>

      {/* ── Category tabs ── */}
      <div style={{
        display: "flex", gap: 0,
        background: "var(--bg-card)",
        borderRadius: 10, overflow: "hidden",
        border: "1px solid var(--border)",
        marginBottom: 20,
      }}>
        {THEME_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flex: 1, padding: "10px 4px",
                fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                background: isActive ? "var(--brand)" : "transparent",
                color: isActive ? "#fff" : "var(--text-muted)",
                border: "none", cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Theme grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: activeCategory === "kingdom" ? "1fr" : "1fr 1fr",
        gap: 10,
      }}>
        {visibleThemes.map((theme) => {
          const isActive = selected === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              style={{
                background: isActive ? "var(--bg-card-raised)" : "var(--bg-card)",
                border: `2px solid ${isActive ? theme.accentColor : "var(--border)"}`,
                borderRadius: 12, padding: "14px 12px",
                cursor: "pointer", textAlign: "left",
                transition: "all var(--transition)",
                boxShadow: isActive ? `0 0 16px ${theme.accentColor}33` : "none",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Gradient preview strip across top */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: theme.headerGradient,
                borderRadius: "10px 10px 0 0",
              }} />

              {/* Colour swatches */}
              <div style={{ display: "flex", gap: 5, marginBottom: 10, marginTop: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: theme.swatchA, border: "1px solid rgba(255,255,255,0.1)" }} />
                <div style={{ width: 18, height: 18, borderRadius: 4, background: theme.swatchB, border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              {/* Label row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: activeCategory === "kingdom" ? 20 : 16 }}>{theme.preview}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      {theme.label}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: theme.accentColor, color: theme.accentTextColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 900, flexShrink: 0,
                  }}>✓</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && selected !== "dark-gold" && (
        <p className="fade-up" style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          {THEME_CATALOG[selected]?.preview} {THEME_CATALOG[selected]?.label} Kingdom selected
        </p>
      )}
    </div>
  );
}
