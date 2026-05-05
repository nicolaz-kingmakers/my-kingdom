import { useApp } from "../context/AppContext";

export default function WalletWidgetSlot({ onTopUpRequest }: { onTopUpRequest: (amount: number) => void }) {
  const { wallet } = useApp();

  const stateColor =
    wallet.state === "HEALTHY" ? "var(--green)" :
    wallet.state === "LOW"     ? "var(--amber)" :
                                 "var(--red-state)";

  const stateDim =
    wallet.state === "HEALTHY" ? "var(--green-dim)" :
    wallet.state === "LOW"     ? "var(--amber-dim)" :
                                 "var(--red-dim)";

  const stateLabel =
    wallet.state === "HEALTHY" ? "Ready to play" :
    wallet.state === "LOW"     ? "Running low" :
                                 "Top up to play";

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${stateColor}`,
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      boxShadow: `0 0 20px ${stateDim}`,
    }}>
      {/* Top bar */}
      <div style={{
        background: stateDim,
        padding: "10px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: stateColor, boxShadow: `0 0 6px ${stateColor}`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: stateColor, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {stateLabel}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Kingdom Vault</span>
      </div>

      <div style={{ padding: "14px 14px 12px" }}>
        {/* Balance */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>AVAILABLE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: stateColor, letterSpacing: -1 }}>
              €{wallet.balance.toFixed(2)}
            </div>
          </div>
          {wallet.autoTopUp.enabled && (
            <div style={{
              fontSize: 10, color: "var(--text-muted)",
              background: "var(--bg-card-raised)",
              padding: "4px 8px", borderRadius: "var(--radius-xs)",
              border: "1px solid var(--border)", textAlign: "right",
            }}>
              Auto top-up<br />
              <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>€{wallet.autoTopUp.topUpAmount} if &lt; €{wallet.autoTopUp.triggerThreshold}</span>
            </div>
          )}
        </div>

        {/* Top-up presets */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {wallet.topUpPresets.map((amount) => (
            <button
              key={amount}
              onClick={() => onTopUpRequest(amount)}
              style={{
                flex: 1,
                background: "var(--bg-card-raised)",
                border: `1px solid ${stateColor}`,
                borderRadius: "var(--radius-sm)",
                color: stateColor,
                fontSize: 13, fontWeight: 800,
                padding: "10px 0", cursor: "pointer",
                transition: "all 180ms ease",
              }}
            >
              +€{amount}
            </button>
          ))}
        </div>

        {/* Mini tx log — Cris replaces this */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          {wallet.recentTransactions.slice(0, 3).map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div key={tx.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "4px 0", fontSize: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14 }}>
                    {tx.type === "TOP_UP" ? "💳" : tx.type === "WINNINGS" ? "🏆" : "🎯"}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {tx.description ?? tx.type.replace("_", " ")}
                  </span>
                </div>
                <span style={{ fontWeight: 800, color: isCredit ? "var(--green)" : "var(--text-secondary)" }}>
                  {isCredit ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
