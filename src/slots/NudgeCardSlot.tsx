import { useApp } from "../context/AppContext";

export default function NudgeCardSlot({ onTopUpRequest }: { onTopUpRequest: (amount: number) => void }) {
  const { aiContext, dismissNudge } = useApp();
  const nudge = aiContext.openNudge;

  if (!nudge || nudge.dismissed) return null;

  return (
    <div style={{ padding: "0 16px" }} className="fade-up">
      <div style={{
        background: "linear-gradient(135deg, var(--bg-card-raised), var(--bg-card))",
        border: "1px solid rgba(240,180,41,0.35)",
        borderRadius: 14, padding: "14px 14px 14px 16px",
        boxShadow: "0 0 24px rgba(240,180,41,0.08)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {/* Icon */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(240,180,41,0.12)",
            border: "1px solid rgba(240,180,41,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, flexShrink: 0,
          }}>🧠</div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--gold)", letterSpacing: 0.8, marginBottom: 4 }}>
              KINGDOM INSIGHT
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
              {nudge.message}
            </div>
          </div>

          {/* Dismiss */}
          <button onClick={dismissNudge} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", fontSize: 18, lineHeight: 1,
            padding: 2, flexShrink: 0,
          }}>×</button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, paddingLeft: 42 }}>
          <button
            onClick={() => nudge.suggestedAmount > 0 ? onTopUpRequest(nudge.suggestedAmount) : dismissNudge()}
            style={{
            background: "var(--brand)", border: "none", borderRadius: 8,
            color: "#fff", fontSize: 12, fontWeight: 800,
            padding: "8px 16px", cursor: "pointer",
          }}>
            {nudge.ctaLabel}
          </button>
          <button onClick={dismissNudge} style={{
            background: "transparent",
            border: "1px solid var(--border-strong)",
            borderRadius: 8, color: "var(--text-muted)",
            fontSize: 12, fontWeight: 600, padding: "8px 12px", cursor: "pointer",
          }}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
