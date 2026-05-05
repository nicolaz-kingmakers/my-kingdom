import { useApp } from "../context/AppContext";

export default function KingdomShelfSlot() {
  const { kingdom } = useApp();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 12px" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1 }}>YOUR SPORTS</span>
        <span style={{ fontSize: 11, color: "var(--brand)", fontWeight: 700, cursor: "pointer" }}>Edit</span>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "0 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        {kingdom.pinnedGames.map((game) => (
          <div key={game.id} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 8, cursor: "pointer", flexShrink: 0, minWidth: 64,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: game.liveNow ? "var(--brand-dim)" : "var(--bg-card-raised)",
              border: `2px solid ${game.liveNow ? "var(--brand)" : "var(--border-strong)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, position: "relative",
              boxShadow: game.liveNow ? "0 0 16px var(--brand-glow)" : "none",
              transition: "all 200ms ease",
            }}>
              {game.icon}
              {game.liveNow && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "var(--brand)", border: "2px solid var(--bg-base)",
                }} />
              )}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.2,
              color: game.liveNow ? "var(--text-primary)" : "var(--text-secondary)",
            }}>
              {game.name}
            </span>
          </div>
        ))}

        {/* Add slot */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0, minWidth: 64 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--bg-card)",
            border: "2px dashed var(--border-strong)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "var(--text-muted)",
          }}>+</div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Add</span>
        </div>
      </div>
    </div>
  );
}
