import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NudgeCardSlot from "../slots/NudgeCardSlot";
import KingdomShelfSlot from "../slots/KingdomShelfSlot";

const FOR_YOU = [
  { id: 1, league: "Premier League", home: "Man City", away: "Arsenal", time: "Sat 17:30", odds: ["2.10", "3.40", "3.60"], pinned: true },
  { id: 2, league: "UFC · Main Event", home: "Poirier", away: "Oliveira", time: "Sat 03:00", odds: ["1.85", null, "2.05"], pinned: false },
];

const TABS = ["MY KINGDOM", "SPORTS", "GAMES", "PROMOS"];

const TAB_PLACEHOLDER: Record<string, { icon: string; label: string }> = {
  SPORTS:  { icon: "⚽", label: "Full sports markets — coming soon" },
  GAMES:   { icon: "🎮", label: "Casino & games — coming soon" },
  PROMOS:  { icon: "🎁", label: "Your personalised offers — coming soon" },
};

export default function KingdomHomeScreen() {
  const navigate = useNavigate();
  const { user, wallet, spendBalance } = useApp();
  const [activeTab, setActiveTab] = useState("MY KINGDOM");
  const [tappedOdd, setTappedOdd] = useState<string | null>(null);

  const handleTopUp = (amount: number) => navigate(`/topup/confirm?amount=${amount}`);

  const handleOddTap = (matchId: number, oddIndex: number, odd: string) => {
    const key = `${matchId}-${oddIndex}`;
    setTappedOdd(key);
    spendBalance(2);
    setTimeout(() => setTappedOdd(null), 600);
  };

  const balanceColor =
    wallet.state === "HEALTHY" ? "var(--green)" :
    wallet.state === "LOW"     ? "var(--amber)" : "var(--red-state)";

  return (
    <div className="app-frame">

      {/* ── Kingdom Header ── */}
      <div style={{
        background: "linear-gradient(160deg, #1A0408 0%, var(--brand) 60%, #8B0B1E 100%)",
        padding: "20px 16px 18px",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, marginBottom: 4 }}>
              MY KINGDOM
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>
              {user.displayName} 👑
            </div>
            <div style={{
              display: "inline-block", marginTop: 7,
              background: "var(--gold)", color: "#000",
              fontSize: 10, fontWeight: 800, padding: "3px 9px",
              borderRadius: 4, letterSpacing: 0.5,
            }}>
              {user.tier.toUpperCase()} MEMBER
            </div>
          </div>
          <img
            src={user.avatar}
            alt={user.displayName}
            width={46} height={46}
            style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.3)" }}
          />
        </div>

        {/* Balance row */}
        <div style={{
          background: "rgba(0,0,0,0.28)", borderRadius: 12, padding: "12px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          backdropFilter: "blur(8px)",
        }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 3, letterSpacing: 0.5 }}>VAULT</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: balanceColor, letterSpacing: -0.5, transition: "color 400ms ease" }}>
              €{wallet.balance.toFixed(2)}
            </div>
          </div>
          {wallet.state !== "HEALTHY" ? (
            <div style={{ display: "flex", gap: 6 }}>
              {wallet.topUpPresets.map((amt) => (
                <button key={amt} onClick={() => handleTopUp(amt)} style={{
                  background: "rgba(255,255,255,0.1)",
                  border: `1px solid ${balanceColor}`,
                  borderRadius: 8, color: balanceColor,
                  fontSize: 12, fontWeight: 800, padding: "7px 12px", cursor: "pointer",
                }}>
                  +€{amt}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
              Ready to play
            </div>
          )}
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div style={{ background: "var(--bg-card)", display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {TABS.map((t) => (
          <div key={t} onClick={() => setActiveTab(t)} style={{
            flex: 1, textAlign: "center", padding: "11px 4px",
            fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
            color: activeTab === t ? "var(--brand)" : "var(--text-muted)",
            borderBottom: activeTab === t ? "2px solid var(--brand)" : "2px solid transparent",
            cursor: "pointer", transition: "color 150ms ease",
          }}>
            {t}
          </div>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab !== "MY KINGDOM" ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
          color: "var(--text-muted)",
        }}>
          <span style={{ fontSize: 48 }}>{TAB_PLACEHOLDER[activeTab]?.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{TAB_PLACEHOLDER[activeTab]?.label}</span>
        </div>
      ) : (
        <div className="screen-content">

          {/* ── AI Nudge ── */}
          <div style={{ paddingTop: 14 }}>
            <NudgeCardSlot onTopUpRequest={handleTopUp} />
          </div>

          {/* ── Kingdom shelf ── */}
          <div style={{ paddingTop: 20 }}>
            <KingdomShelfSlot />
          </div>

          {/* ── Recommended divider ── */}
          <div style={{ margin: "22px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, whiteSpace: "nowrap" }}>
              ⭐ RECOMMENDED FOR YOU
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* ── Match cards ── */}
          <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {FOR_YOU.map((m) => (
              <div key={m.id} style={{
                background: "var(--bg-card)",
                border: m.pinned ? "1px solid rgba(200,16,46,0.4)" : "1px solid var(--border)",
                borderRadius: 12, padding: "13px 14px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: m.pinned ? "0 0 16px rgba(200,16,46,0.1)" : "none",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 10, color: m.pinned ? "var(--brand)" : "var(--text-muted)",
                    fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3,
                  }}>
                    {m.league}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>{m.home}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {m.away}
                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{m.time}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  {m.odds.map((o, i) => {
                    const key = `${m.id}-${i}`;
                    const tapped = tappedOdd === key;
                    return o ? (
                      <div
                        key={i}
                        onClick={() => handleOddTap(m.id, i, o)}
                        style={{
                          background: tapped ? "var(--brand)" : "var(--bg-card-raised)",
                          border: tapped ? "1px solid var(--brand)" : "1px solid var(--border-strong)",
                          borderRadius: 8, padding: "8px 10px",
                          fontSize: 12, fontWeight: 800,
                          minWidth: 44, textAlign: "center", cursor: "pointer",
                          transform: tapped ? "scale(0.93)" : "scale(1)",
                          transition: "all 160ms ease",
                          color: tapped ? "#fff" : "inherit",
                        }}
                      >
                        {o}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── Bottom nav ── */}
      <div style={{ display: "flex", background: "var(--bg-card)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        {[
          { icon: "☰", label: "Menu" },
          { icon: "🔴", label: "Live" },
          { icon: "🎫", label: "Betslip" },
          { icon: "✅", label: "My Bets" },
        ].map((item) => (
          <div key={item.label} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            padding: "10px 4px 12px", gap: 3,
            fontSize: 10, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div
          onClick={() => handleTopUp(wallet.topUpPresets[1] ?? 20)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 8px 8px", gap: 3, cursor: "pointer" }}
        >
          <div style={{
            background: "var(--brand)", borderRadius: 10,
            padding: "8px 0", width: "100%", textAlign: "center", fontSize: 20, lineHeight: 1,
          }}>+</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Deposit</span>
        </div>
      </div>
    </div>
  );
}
