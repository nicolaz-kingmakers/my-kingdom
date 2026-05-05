// KEY DEMO BEAT: vault turns green here.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function TopUpSuccessScreen() {
  const navigate = useNavigate();
  const { wallet } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    const auto = setTimeout(() => navigate("/home", { replace: true }), 3500);
    return () => { clearTimeout(t); clearTimeout(auto); };
  }, [navigate]);

  const lastTopUp = wallet.recentTransactions.find((t) => t.type === "TOP_UP");

  return (
    <div className="app-frame" style={{ justifyContent: "center", alignItems: "center", background: "var(--bg-base)" }}>
      {show && (
        <div style={{ textAlign: "center", padding: "0 32px", width: "100%" }}>

          {/* Green ring */}
          <div className="pop" style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(0,196,140,0.1)",
            border: "2px solid var(--green)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 0 48px rgba(0,196,140,0.3)",
            fontSize: 44,
          }}>
            ✓
          </div>

          <h2 className="fade-up" style={{
            fontSize: 26, fontWeight: 900, color: "#fff",
            marginBottom: 6, animationDelay: "100ms",
          }}>
            Vault topped up
          </h2>

          <div className="fade-up" style={{
            fontSize: 44, fontWeight: 900,
            color: "var(--green)", letterSpacing: -1,
            marginBottom: 6, animationDelay: "180ms",
          }}>
            R{wallet.balance.toFixed(0)}
          </div>

          <p className="fade-up" style={{
            color: "var(--text-muted)", fontSize: 13,
            marginBottom: 40, animationDelay: "240ms",
          }}>
            {lastTopUp
              ? `+R${lastTopUp.amount.toFixed(0)} added · ${new Date(lastTopUp.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}`
              : "Funds added to your vault"}
          </p>

          <button
            className="btn btn-primary fade-up"
            onClick={() => navigate("/home", { replace: true })}
            style={{ animationDelay: "300ms", borderRadius: 12, fontSize: 15 }}
          >
            Back to My Kingdom →
          </button>

          <p className="fade-up" style={{
            marginTop: 16, fontSize: 11, color: "var(--text-muted)",
            animationDelay: "380ms",
          }}>
            Returning automatically…
          </p>

        </div>
      )}
    </div>
  );
}
