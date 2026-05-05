import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

const INSTRUMENT_LABEL: Record<string, string> = {
  INSTANT_EFT:  "Instant EFT (Ozow)",
  SAVED_CARD:   "Saved Card",
  MOBILE_MONEY: "Mobile Money (MTN MoMo)",
  VOUCHER:      "1Voucher",
};

export default function TopUpConfirmScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { wallet, user, topUp } = useApp();
  const [loading, setLoading] = useState(false);

  const amount = Number(params.get("amount") ?? 180);
  const afterBalance = wallet.balance + amount;
  const method = INSTRUMENT_LABEL[user.paymentInstrument] ?? "saved payment method";

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    topUp(amount);
    navigate("/topup/success", { replace: true });
  };

  return (
    <div className="app-frame">

      {/* ── Header ── */}
      <div style={{
        background: "var(--brand)",
        padding: "16px 16px 14px",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          disabled={loading}
          style={{
            background: "rgba(0,0,0,0.2)", border: "none", borderRadius: 8,
            color: "#fff", fontSize: 18, width: 34, height: 34,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >←</button>
        <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Top Up Vault</span>
      </div>

      <div className="screen-content" style={{ padding: "28px 16px" }}>

        {/* ── Amount hero ── */}
        <div className="fade-up" style={{
          background: "linear-gradient(135deg, var(--bg-card-raised), var(--bg-card))",
          border: "1px solid rgba(200,16,46,0.3)",
          borderRadius: 16, padding: "28px 20px",
          textAlign: "center", marginBottom: 16,
          boxShadow: "0 0 32px var(--brand-glow)",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1, marginBottom: 10 }}>
            ADDING TO YOUR VAULT
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>
            R{amount}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            via {method}
          </div>
        </div>

        {/* ── Before / After ── */}
        <div className="fade-up" style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14, overflow: "hidden",
          marginBottom: 24,
          animationDelay: "60ms",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Current balance</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--amber)" }}>
              R{wallet.balance.toFixed(0)}
            </span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px",
            background: "rgba(0,196,140,0.05)",
          }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>After top-up</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "var(--green)" }}>
              R{afterBalance.toFixed(0)}
            </span>
          </div>
        </div>

        {/* ── Confirm CTA ── */}
        <button
          className="btn btn-primary fade-up"
          onClick={handleConfirm}
          disabled={loading}
          style={{
            animationDelay: "120ms", fontSize: 16, borderRadius: 12,
            height: 52, letterSpacing: 0.2,
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                </path>
              </svg>
              Processing…
            </span>
          ) : `Confirm — Add R${amount} →`}
        </button>

        <button
          className="btn"
          onClick={() => navigate(-1)}
          disabled={loading}
          style={{
            width: "100%", marginTop: 10, background: "transparent",
            color: "var(--text-muted)", fontSize: 14, padding: "12px",
            border: "none", cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <p style={{
          textAlign: "center", fontSize: 11, color: "var(--text-muted)",
          marginTop: 20, lineHeight: 1.7,
        }}>
          Funds added instantly · Responsible gambling limits apply
        </p>

      </div>
    </div>
  );
}
