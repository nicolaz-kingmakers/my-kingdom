import { useState } from "react";
import { THEME_CATALOG } from "../../data/themes";
import type { ThemeDefinition } from "../../data/themes";

interface Props {
  selected: string;
  onChange: (theme: string) => void;
}

const SECTIONS: { id: ThemeDefinition["category"]; label: string; icon: string }[] = [
  { id: "clubs",     label: "CLUBS",       icon: "⚽" },
  { id: "countries", label: "COUNTRIES",   icon: "🌍" },
  { id: "events",    label: "TOURNAMENTS", icon: "🏆" },
];

export default function StepPickTheme({ selected, onChange }: Props) {
  const allThemes = Object.values(THEME_CATALOG);

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const sel = allThemes.find(t => t.id === selected);
    if (sel && sel.category !== "kingdom") return new Set([sel.category]);
    return new Set<string>();
  });

  const toggle = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderCard = (theme: ThemeDefinition, large = false) => {
    const isActive = selected === theme.id;
    return (
      <button
        key={theme.id}
        onClick={() => onChange(theme.id)}
        style={{
          background: isActive ? "var(--bg-card-raised)" : "var(--bg-card)",
          border: `2px solid ${isActive ? theme.accentColor : "var(--border)"}`,
          borderRadius: 12, padding: "14px 12px",
          cursor: "pointer", textAlign: "left", width: "100%",
          transition: "all var(--transition)",
          boxShadow: isActive ? `0 0 16px ${theme.accentColor}33` : "none",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: theme.headerGradient, borderRadius: "10px 10px 0 0",
        }} />
        <div style={{ display: "flex", gap: 5, marginBottom: 10, marginTop: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: theme.swatchA, border: "1px solid rgba(255,255,255,0.1)" }} />
          <div style={{ width: 18, height: 18, borderRadius: 4, background: theme.swatchB, border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: large ? 20 : 16 }}>{theme.preview}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{theme.label}</span>
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
  };

  return (
    <div className="fade-up">
      <h2 className="heading-gold" style={{ marginBottom: 8 }}>
        Choose your style
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
        Your Kingdom colours. Pick your club, country, or a tournament.
      </p>

      {/* My Kingdom — always visible */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
          color: "var(--text-muted)", marginBottom: 8,
        }}>
          MY KINGDOM
        </div>
        {renderCard(THEME_CATALOG["dark-gold"], true)}
      </div>

      {/* Accordion sections */}
      {SECTIONS.map(section => {
        const themes = allThemes.filter(t => t.category === section.id);
        const isOpen = openSections.has(section.id);
        const hasSelected = themes.some(t => t.id === selected);

        return (
          <div key={section.id} style={{ marginBottom: 8 }}>
            <button
              onClick={() => toggle(section.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                background: "var(--bg-card)",
                border: `1px solid ${hasSelected ? "var(--brand)" : "var(--border)"}`,
                borderRadius: isOpen ? "12px 12px 0 0" : 12,
                padding: "12px 14px", cursor: "pointer",
                transition: "border-radius 0ms, border-color 150ms ease",
              }}
            >
              <span style={{ fontSize: 18 }}>{section.icon}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 800, color: "var(--text-primary)", letterSpacing: 0.5, textAlign: "left" }}>
                {section.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginRight: 6 }}>
                {themes.length}
              </span>
              {hasSelected && (
                <span style={{
                  fontSize: 8, fontWeight: 900, letterSpacing: 0.5,
                  background: "var(--brand)", color: "#fff",
                  padding: "2px 7px", borderRadius: 3, marginRight: 6,
                }}>SELECTED</span>
              )}
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div style={{
                background: "var(--bg-card)",
                border: `1px solid ${hasSelected ? "var(--brand)" : "var(--border)"}`,
                borderTop: "1px solid var(--border-strong)",
                borderRadius: "0 0 12px 12px",
                padding: "10px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {themes.map(t => renderCard(t))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {selected && selected !== "dark-gold" && (
        <p className="fade-up" style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          {THEME_CATALOG[selected]?.preview} {THEME_CATALOG[selected]?.label} Kingdom selected
        </p>
      )}
    </div>
  );
}
