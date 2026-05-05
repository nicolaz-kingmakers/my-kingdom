import { useNavigate } from "react-router-dom";

const MATCHES = [
  { id: 1, league: "AFCON · Group Stage", home: "Nigeria",     away: "South Africa",    homeScore: 1, awayScore: 0, minute: "34", odds: ["2.30", "3.10", "3.20"] },
  { id: 2, league: "La Liga",             home: "Real Madrid", away: "Barcelona",        homeScore: 1, awayScore: 1, minute: "54", odds: ["2.60", "3.20", "2.80"] },
  { id: 3, league: "PSL",                 home: "Kaizer Chiefs", away: "Sundowns",       homeScore: 0, awayScore: 1, minute: "67", odds: ["2.10", "3.40", "3.60"] },
  { id: 4, league: "NBA Playoffs",        home: "Celtics",     away: "Knicks",           homeScore: 88, awayScore: 91, minute: "Q3", odds: ["1.62", "—",    "2.40"] },
];

const SPORTS = [
  { icon: "⚽", label: "Football", active: true },
  { icon: "🏀", label: "Basketball" },
  { icon: "🎾", label: "Tennis" },
  { icon: "✈️", label: "Aviator" },
  { icon: "🎯", label: "Betslip" },
];

export default function BeforeScreen() {
  const navigate = useNavigate();

  return (
    <div className="app-frame" style={{ background: "#0C0C0C" }}>

      {/* ── Header ── */}
      <div style={{
        background: "var(--brand)",
        padding: "16px 16px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 900, fontSize: 17, color: "#fff", letterSpacing: -0.3 }}>
          SuperSport<span style={{ opacity: 0.85 }}>BET</span>
        </span>
        <div style={{
          background: "rgba(0,0,0,0.2)", borderRadius: 8,
          padding: "7px 12px", fontSize: 13, fontWeight: 700, color: "#fff",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: 0.5 }} />
          R 62,084.62
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        background: "var(--brand)", display: "flex",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        {["SPORTS", "GAMES", "PROMOS", "LUCKY NUMBERS"].map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: "center", padding: "10px 4px",
            fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
            color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
            borderBottom: i === 0 ? "2px solid rgba(255,255,255,0.6)" : "2px solid transparent",
          }}>
            {t}
          </div>
        ))}
      </div>

      <div className="screen-content">

        {/* ── Sport icons ── */}
        <div style={{
          display: "flex", gap: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}>
          {SPORTS.map((s) => (
            <div key={s.label} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              padding: "12px 8px", gap: 5,
              fontSize: 10, fontWeight: 700,
              color: s.active ? "var(--brand)" : "var(--text-muted)",
              borderBottom: s.active ? "2px solid var(--brand)" : "2px solid transparent",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        {/* ── Live section label ── */}
        <div style={{ padding: "16px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--brand)", boxShadow: "0 0 6px var(--brand)",
              animation: "pulse 1.4s ease infinite",
            }} />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Live</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--brand)", fontWeight: 700 }}>View all</span>
        </div>

        {/* ── Match cards ── */}
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {MATCHES.map((m) => (
            <div key={m.id} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {/* Time badge */}
              <div style={{
                background: "var(--brand-dim)", color: "var(--brand-light)",
                fontSize: 10, fontWeight: 800, padding: "4px 7px",
                borderRadius: 6, flexShrink: 0, minWidth: 30, textAlign: "center",
              }}>
                {m.minute}{typeof m.minute === "string" && m.minute !== "Q3" ? "'" : ""}
              </div>

              {/* Teams */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                  {m.league}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  <span>{m.home}</span>
                  <span style={{ color: "var(--brand)", fontWeight: 800 }}>{m.homeScore}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                  <span>{m.away}</span>
                  <span style={{ color: "var(--brand)", fontWeight: 800 }}>{m.awayScore}</span>
                </div>
              </div>

              {/* Odds */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {m.odds.map((o, i) => (
                  <div key={i} style={{
                    background: "var(--bg-card-raised)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 7, padding: "7px 9px",
                    fontSize: 12, fontWeight: 800,
                    color: o === "—" ? "var(--text-muted)" : "var(--text-primary)",
                    minWidth: 42, textAlign: "center", cursor: "pointer",
                  }}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: "28px 16px 0", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Same app. Same screen. Same for everyone.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/onboarding")}
            style={{ fontSize: 14, borderRadius: 12, letterSpacing: 0.2 }}
          >
            Make it yours — 30 seconds ✨
          </button>
        </div>

      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        display: "flex", background: "var(--bg-card)",
        borderTop: "1px solid var(--border)", flexShrink: 0,
      }}>
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
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          padding: "6px 8px 8px", gap: 3, cursor: "pointer",
        }}>
          <div style={{
            background: "var(--brand)", borderRadius: 10,
            padding: "8px 0", width: "100%", textAlign: "center",
            fontSize: 20, lineHeight: 1,
          }}>+</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Deposit</span>
        </div>
      </div>
    </div>
  );
}
