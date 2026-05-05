import { useApp } from "../context/AppContext";
import { Transaction } from "../data/mockData";

const METHOD_META: Record<string, { label: string; icon: string }> = {
  INSTANT_EFT:  { label: "Instant EFT",        icon: "⚡" },
  SAVED_CARD:   { label: "Saved Card",          icon: "💳" },
  MOBILE_MONEY: { label: "Mobile Money",        icon: "📱" },
  VOUCHER:      { label: "1Voucher",            icon: "🎟️" },
};

function getFavouriteMethod(txns: Transaction[]): string {
  const counts: Record<string, number> = {};
  for (const t of txns) {
    if (t.type === "TOP_UP" && t.method) {
      counts[t.method] = (counts[t.method] ?? 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "INSTANT_EFT";
}

export default function PaymentInsightsSlot() {
  const { wallet } = useApp();
  const txns = wallet.recentTransactions;

  const topUps = txns.filter(t => t.type === "TOP_UP");
  const totalDeposited = topUps.reduce((sum, t) => sum + t.amount, 0);
  const avgDeposit = topUps.length > 0 ? Math.round(totalDeposited / topUps.length) : 0;
  const favourite = getFavouriteMethod(txns);
  const meta = METHOD_META[favourite] ?? { label: favourite, icon: "💳" };

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 10 }}>
        💳 PAYMENT INSIGHTS
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>

        {/* Favourite method */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Your go-to method</div>
            <div style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 7 }}>
              <span>{meta.icon}</span>
              {meta.label}
            </div>
          </div>
          <div style={{ background: "rgba(0,196,140,0.12)", border: "1px solid rgba(0,196,140,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 800, color: "var(--green)", letterSpacing: 0.3 }}>
            FAVOURITE
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>R{totalDeposited}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>Total deposited</div>
          </div>
          <div style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{topUps.length}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>Deposits</div>
          </div>
          <div style={{ flex: 1, padding: "12px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>R{avgDeposit}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>Avg. deposit</div>
          </div>
        </div>

      </div>
    </div>
  );
}
