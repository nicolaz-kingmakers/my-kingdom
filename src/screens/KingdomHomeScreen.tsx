import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NudgeCardSlot from "../slots/NudgeCardSlot";
import KingdomShelfSlot from "../slots/KingdomShelfSlot";
import { THEME_CATALOG, DEFAULT_THEME } from "../data/themes";
import StepPickTheme from "./onboarding/StepPickTheme";

const FOR_YOU = [
  { id: 1, league: "PSL · Premier Soccer League", home: "Kaizer Chiefs", away: "Orlando Pirates", time: "Sat 17:30", odds: ["2.10", "3.40", "3.60"], pinned: true },
  { id: 2, league: "AFCON · Group Stage",         home: "Nigeria",        away: "South Africa",   time: "Sat 20:00", odds: ["2.30", "3.10", "3.20"], pinned: false },
  { id: 3, league: "La Liga",                      home: "Real Madrid",    away: "Barcelona",      time: "Sun 20:00", odds: ["2.40", "3.30", "2.95"], pinned: false },
  { id: 4, league: "UFC · Main Event",             home: "Poirier",        away: "Oliveira",       time: "Sat 03:00", odds: ["1.85", null, "2.05"],   pinned: false },
];

// Per-match labels for each odds button (null = button not rendered)
const ODD_LABELS: (string | null)[][] = [
  ["Kaizer Chiefs to Win", "Draw", "Orlando Pirates to Win"],
  ["Nigeria to Win", "Draw", "South Africa to Win"],
  ["Real Madrid to Win", "Draw", "Barcelona to Win"],
  ["Poirier to Win", null, "Oliveira to Win"],
];

const TABS = ["MY KINGDOM", "SPORTS", "GAMES", "PROMOS"];

const TAB_PLACEHOLDER: Record<string, { icon: string; label: string }> = {
  SPORTS:  { icon: "⚽", label: "Full sports markets — coming soon" },
  GAMES:   { icon: "🎮", label: "Casino & games — coming soon" },
  PROMOS:  { icon: "🎁", label: "Your personalised offers — coming soon" },
};

interface BetslipState {
  matchLabel: string;
  selectionLabel: string;
  odds: string;
  stake: number;
  phase: "open" | "placing" | "result";
  result?: "WIN" | "LOSS";
}

export default function KingdomHomeScreen() {
  const navigate = useNavigate();
  const { user, wallet, kingdom, spendBalance, setTheme, pendingAutoTopUp, confirmAutoTopUp, cancelAutoTopUp } = useApp();
  const activeTheme = THEME_CATALOG[kingdom.theme] ?? DEFAULT_THEME;
  const [activeTab, setActiveTab] = useState("MY KINGDOM");
  const [tappedOdd, setTappedOdd] = useState<string | null>(null);
  const [betslip, setBetslip] = useState<BetslipState | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleTopUp = (amount: number) => navigate(`/topup/confirm?amount=${amount}`);

  const handleOddTap = (matchIdx: number, oddIdx: number, odd: string) => {
    const match = FOR_YOU[matchIdx];
    const key = `${match.id}-${oddIdx}`;
    setTappedOdd(key);
    setTimeout(() => setTappedOdd(null), 600);
    setBetslip({
      matchLabel: `${match.home} vs ${match.away}`,
      selectionLabel: ODD_LABELS[matchIdx][oddIdx] ?? `${match.home} to Win`,
      odds: odd,
      stake: 5,
      phase: "open",
    });
  };

  const handlePlaceBet = () => {
    if (!betslip) return;
    const stake = betslip.stake;
    setBetslip((b) => b ? { ...b, phase: "placing" } : null);
    setTimeout(() => {
      spendBalance(stake);
      const result: "WIN" | "LOSS" = Math.random() > 0.4 ? "WIN" : "LOSS";
      setBetslip((b) => b ? { ...b, phase: "result", result } : null);
      setTimeout(() => setBetslip(null), 2200);
    }, 900);
  };

  const closeBetslip = () => {
    if (betslip?.phase === "open") setBetslip(null);
  };

  const balanceColor =
    wallet.state === "HEALTHY" ? "var(--green)" :
    wallet.state === "LOW"     ? "var(--amber)" : "var(--red-state)";

  const potentialReturn = betslip
    ? (betslip.stake * parseFloat(betslip.odds)).toFixed(2)
    : "0.00";

  return (
    <div className="app-frame">

      {/* ── Kingdom Header ── */}
      <div style={{
        background: activeTheme.headerGradient,
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
              background: activeTheme.accentColor, color: activeTheme.accentTextColor,
              fontSize: 10, fontWeight: 800, padding: "3px 9px",
              borderRadius: 4, letterSpacing: 0.5,
            }}>
              {user.tier.toUpperCase()} MEMBER
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setShowThemePicker(true)}
              title="Change theme"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 150ms ease",
              }}
            >
              🎨
            </button>
            <img
              src={user.avatar}
              alt={user.displayName}
              width={46} height={46}
              style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.3)" }}
            />
          </div>
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
              R{wallet.balance.toFixed(2)}
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
                  +R{amt}
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
            {FOR_YOU.map((m, matchIdx) => (
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
                  {m.odds.map((o, oddIdx) => {
                    const key = `${m.id}-${oddIdx}`;
                    const tapped = tappedOdd === key;
                    return o ? (
                      <div
                        key={oddIdx}
                        onClick={() => handleOddTap(matchIdx, oddIdx, o)}
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

      {/* ── Auto Top-Up Confirmation ── */}
      {pendingAutoTopUp !== null && (
        <>
          <div
            onClick={cancelAutoTopUp}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 38,
              animation: "fadeIn 200ms ease",
            }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "var(--bg-card)",
            borderRadius: "18px 18px 0 0",
            borderTop: "2px solid var(--amber)",
            zIndex: 39,
            padding: "16px 16px 28px",
            animation: "slideUp 240ms cubic-bezier(0.34, 1.1, 0.64, 1)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: "rgba(240,180,41,0.12)", border: "1px solid rgba(240,180,41,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>⚡</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
                  Vault running low
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Your balance dropped below R{wallet.autoTopUp.triggerThreshold}. Auto top-up{" "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>R{pendingAutoTopUp}</span> to keep playing?
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={confirmAutoTopUp}
                style={{
                  flex: 1, padding: "13px 0",
                  background: "var(--brand)", color: "#fff",
                  border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 800, cursor: "pointer",
                }}
              >
                Top Up R{pendingAutoTopUp}
              </button>
              <button
                onClick={cancelAutoTopUp}
                style={{
                  flex: 0, padding: "13px 18px",
                  background: "transparent", color: "var(--text-muted)",
                  border: "1px solid var(--border-strong)", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                Not now
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Theme Picker Sheet ── */}
      {showThemePicker && (
        <>
          <div
            onClick={() => setShowThemePicker(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.65)",
              zIndex: 42,
              animation: "fadeIn 200ms ease",
            }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "var(--bg-base)",
            borderRadius: "20px 20px 0 0",
            borderTop: `2px solid ${activeTheme.accentColor}`,
            zIndex: 43,
            maxHeight: "82%",
            display: "flex", flexDirection: "column",
            animation: "slideUp 240ms cubic-bezier(0.34, 1.1, 0.64, 1)",
          }}>
            {/* Handle + header */}
            <div style={{ padding: "10px 16px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1.4 }}>
                  YOUR KINGDOM STYLE
                </span>
                <span
                  onClick={() => setShowThemePicker(false)}
                  style={{ fontSize: 16, color: "var(--text-muted)", cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
                >
                  ✕
                </span>
              </div>
            </div>
            {/* Scrollable picker body */}
            <div style={{ overflowY: "auto", padding: "0 16px 32px" }}>
              <StepPickTheme
                selected={kingdom.theme}
                onChange={(themeId) => {
                  setTheme(themeId);
                  setTimeout(() => setShowThemePicker(false), 300);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Betslip Drawer ── */}
      {betslip && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeBetslip}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.65)",
              zIndex: 40,
              animation: "fadeIn 200ms ease",
            }}
          />

          {/* Drawer panel */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "var(--bg-card)",
            borderRadius: "18px 18px 0 0",
            borderTop: "1px solid var(--border-strong)",
            zIndex: 41,
            paddingBottom: 28,
            animation: "slideUp 240ms cubic-bezier(0.34, 1.1, 0.64, 1)",
          }}>

            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
            </div>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 16px 14px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1.4 }}>BETSLIP</span>
              <span
                onClick={closeBetslip}
                style={{ fontSize: 16, color: "var(--text-muted)", cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}
              >
                ✕
              </span>
            </div>

            {betslip.phase === "result" ? (

              /* ── Result ── */
              <div style={{ textAlign: "center", padding: "8px 16px 4px" }}>
                <div style={{ fontSize: 54, marginBottom: 10, animation: "pop 320ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  {betslip.result === "WIN" ? "🏆" : "😔"}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 900, marginBottom: 6,
                  color: betslip.result === "WIN" ? "var(--green)" : "var(--text-secondary)",
                }}>
                  {betslip.result === "WIN" ? `You won R${potentialReturn}!` : "Better luck next time"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {betslip.result === "WIN" ? "Winnings added to your vault" : `R${betslip.stake.toFixed(2)} staked`}
                </div>
              </div>

            ) : betslip.phase === "placing" ? (

              /* ── Placing ── */
              <div style={{ textAlign: "center", padding: "28px 16px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 0.3 }}>
                  Placing your bet...
                </div>
              </div>

            ) : (

              /* ── Open: selection + stake + CTA ── */
              <>
                {/* Selection row */}
                <div style={{
                  margin: "0 16px 14px",
                  background: "var(--bg-base)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: 10, padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3 }}>{betslip.selectionLabel}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{betslip.matchLabel}</div>
                  </div>
                  <div style={{
                    background: "var(--brand)", color: "#fff",
                    borderRadius: 8, padding: "7px 11px",
                    fontSize: 15, fontWeight: 900, flexShrink: 0,
                  }}>
                    {betslip.odds}
                  </div>
                </div>

                {/* Stake row */}
                <div style={{ margin: "0 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Stake</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      onClick={() => setBetslip((b) => b ? { ...b, stake: Math.max(1, b.stake - 1) } : null)}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: "1px solid var(--border-strong)", background: "var(--bg-base)",
                        color: "#fff", fontSize: 18, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                    >−</button>
                    <span style={{ fontSize: 17, fontWeight: 800, minWidth: 52, textAlign: "center" }}>
                      R{betslip.stake.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setBetslip((b) => b ? { ...b, stake: b.stake + 1 } : null)}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: "1px solid var(--border-strong)", background: "var(--bg-base)",
                        color: "#fff", fontSize: 18, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                    >+</button>
                  </div>
                </div>

                {/* Potential return */}
                <div style={{ margin: "0 16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Potential return</span>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "var(--green)" }}>R{potentialReturn}</span>
                </div>

                {/* Place Bet CTA */}
                <div style={{ padding: "0 16px" }}>
                  <button
                    onClick={handlePlaceBet}
                    style={{
                      width: "100%", padding: "15px 0",
                      background: "var(--brand)", color: "#fff",
                      border: "none", borderRadius: 12,
                      fontSize: 15, fontWeight: 900, letterSpacing: 0.3,
                      cursor: "pointer",
                    }}
                  >
                    Place Bet · R{betslip.stake.toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
