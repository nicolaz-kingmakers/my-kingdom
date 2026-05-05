import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import NudgeCardSlot from "../slots/NudgeCardSlot";
import KingdomShelfSlot from "../slots/KingdomShelfSlot";
import PaymentInsightsSlot from "../slots/PaymentInsightsSlot";
import { THEME_CATALOG, DEFAULT_THEME } from "../data/themes";
import StepPickTheme from "./onboarding/StepPickTheme";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Match {
  id: number;
  league: string;
  home: string;
  away: string;
  time: string;
  isLive: boolean;
  liveMinute?: string;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  odds: (string | null)[];
  oddLabels: (string | null)[];
  pinned?: boolean;
}

interface BetslipState {
  matchLabel: string;
  selectionLabel: string;
  odds: string;
  stake: number;
  phase: "open" | "placing" | "result";
  result?: "WIN" | "LOSS";
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FOR_YOU: Match[] = [
  {
    id: 1, league: "PSL · PREMIER SOCCER LEAGUE",
    home: "Kaizer Chiefs", away: "Orlando Pirates",
    time: "Sat 17:30", isLive: true, liveMinute: "67",
    homeScore: 0, awayScore: 1, sport: "football",
    odds: ["1.85", "3.40", "4.20"],
    oddLabels: ["Kaizer Chiefs", "Draw", "Orlando Pirates"],
    pinned: true,
  },
  {
    id: 2, league: "AFCON · GROUP STAGE",
    home: "Nigeria", away: "South Africa",
    time: "Sat 20:00", isLive: true, liveMinute: "34",
    homeScore: 2, awayScore: 1, sport: "football",
    odds: ["2.30", "3.10", "3.20"],
    oddLabels: ["Nigeria", "Draw", "South Africa"],
  },
  {
    id: 3, league: "LA LIGA",
    home: "Real Madrid", away: "Barcelona",
    time: "Sun 20:00", isLive: false, sport: "football",
    odds: ["2.40", "3.30", "2.95"],
    oddLabels: ["Real Madrid", "Draw", "Barcelona"],
  },
  {
    id: 4, league: "UFC · MAIN EVENT",
    home: "Poirier", away: "Oliveira",
    time: "Sat 03:00", isLive: false, sport: "mma",
    odds: ["1.85", null, "2.05"],
    oddLabels: ["Poirier", null, "Oliveira"],
  },
];

const SPORTS_LIVE: Match[] = [
  ...FOR_YOU.filter(m => m.isLive),
  {
    id: 5, league: "NBA PLAYOFFS",
    home: "Celtics", away: "Knicks",
    time: "Q3", isLive: true, liveMinute: "Q3",
    homeScore: 88, awayScore: 91, sport: "basketball",
    odds: ["1.62", null, "2.40"],
    oddLabels: ["Celtics", null, "Knicks"],
  },
];

const SPORTS_UPCOMING: Match[] = [
  { id: 101, league: "CHAMPIONS LEAGUE", home: "Real Madrid", away: "Man City", time: "Wed 20:00", isLive: false, sport: "football", odds: ["2.10", "3.40", "3.60"], oddLabels: ["Real Madrid", "Draw", "Man City"] },
  { id: 102, league: "PSL", home: "Sundowns", away: "Cape Town City", time: "Sat 15:00", isLive: false, sport: "football", odds: ["1.45", "4.00", "7.50"], oddLabels: ["Sundowns", "Draw", "Cape Town"] },
  { id: 103, league: "UFC 314", home: "Poirier", away: "Oliveira", time: "Sat 03:00", isLive: false, sport: "mma", odds: ["1.85", null, "2.05"], oddLabels: ["Poirier", null, "Oliveira"] },
  { id: 104, league: "NBA PLAYOFFS", home: "Miami Heat", away: "Indiana Pacers", time: "Thu 01:00", isLive: false, sport: "basketball", odds: ["1.90", null, "2.00"], oddLabels: ["Heat", null, "Pacers"] },
  { id: 105, league: "RUGBY · URC", home: "Stormers", away: "Bulls", time: "Sat 15:00", isLive: false, sport: "rugby", odds: ["1.75", null, "2.20"], oddLabels: ["Stormers", null, "Bulls"] },
  { id: 106, league: "ROLAND GARROS", home: "Alcaraz", away: "Djokovic", time: "Sun 14:00", isLive: false, sport: "tennis", odds: ["1.90", null, "2.00"], oddLabels: ["Alcaraz", null, "Djokovic"] },
];

const SPORT_FILTERS = [
  { id: "football",   icon: "⚽", label: "Football" },
  { id: "basketball", icon: "🏀", label: "Basketball" },
  { id: "mma",        icon: "🥊", label: "MMA" },
  { id: "tennis",     icon: "🎾", label: "Tennis" },
  { id: "rugby",      icon: "🏉", label: "Rugby" },
  { id: "cricket",    icon: "🏏", label: "Cricket" },
];

const GAMES_LIST = [
  { id: "aviator",   name: "Aviator",          icon: "🚀", badge: "HOT",  badgeColor: "#EF4444", gradient: "linear-gradient(135deg,#1a0a2e,#6B21A8)" },
  { id: "crash",     name: "Crash",             icon: "💥", badge: "NEW",  badgeColor: "#059669", gradient: "linear-gradient(135deg,#1a0808,#C8102E)" },
  { id: "slots",     name: "Slots",             icon: "🎰", badge: null,   badgeColor: "",        gradient: "linear-gradient(135deg,#0a1a0a,#166534)" },
  { id: "virtual",   name: "Virtual Football",  icon: "⚽", badge: null,   badgeColor: "",        gradient: "linear-gradient(135deg,#0a0a1a,#1e3a8a)" },
  { id: "roulette",  name: "Roulette",          icon: "🎡", badge: null,   badgeColor: "",        gradient: "linear-gradient(135deg,#1a1000,#854d0e)" },
  { id: "blackjack", name: "Blackjack",         icon: "🃏", badge: "LIVE", badgeColor: "#7c3aed", gradient: "linear-gradient(135deg,#111,#374151)" },
];

const PROMOS = [
  { id: "welcome",   icon: "🎁", title: "First Deposit Bonus",  subtitle: "Deposit R200, get R200 FREE",                          tag: "NEW USER",      tagColor: "#059669", cta: "Claim Now",     note: "Ends 31 May" },
  { id: "psl-boost", icon: "⚽", title: "PSL Combo Boost",      subtitle: "Pick 5+ PSL legs and earn a 25% odds boost",           tag: "WEEKEND ONLY",  tagColor: "var(--brand)", cta: "View Offer", note: "Sat & Sun only" },
  { id: "refer",     icon: "👥", title: "Refer a Friend",        subtitle: "Give R100 free bet, get R100 when they deposit",        tag: "ONGOING",       tagColor: "#7c3aed", cta: "Share Link",    note: "No expiry" },
];

const TABS = ["MY KINGDOM", "SPORTS", "GAMES", "PROMOS"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function KingdomHomeScreen() {
  const navigate = useNavigate();
  const { user, wallet, kingdom, spendBalance, setTheme, pendingAutoTopUp, confirmAutoTopUp, cancelAutoTopUp } = useApp();
  const activeTheme = THEME_CATALOG[kingdom.theme] ?? DEFAULT_THEME;

  const [activeTab, setActiveTab]         = useState("MY KINGDOM");
  const [activeSport, setActiveSport]     = useState("football");
  const [tappedOdd, setTappedOdd]         = useState<string | null>(null);
  const [betslip, setBetslip]             = useState<BetslipState | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleTopUp = (amount: number) => navigate(`/topup/confirm?amount=${amount}`);

  const openBetslip = (m: Match, oddIdx: number, odd: string) => {
    setTappedOdd(`${m.id}-${oddIdx}`);
    setTimeout(() => setTappedOdd(null), 600);
    setBetslip({
      matchLabel: `${m.home} vs ${m.away}`,
      selectionLabel: m.oddLabels[oddIdx] ?? `${m.home} to Win`,
      odds: odd,
      stake: 5,
      phase: "open",
    });
  };

  const handlePlaceBet = () => {
    if (!betslip) return;
    const stake = betslip.stake;
    setBetslip(b => b ? { ...b, phase: "placing" } : null);
    setTimeout(() => {
      spendBalance(stake);
      const result: "WIN" | "LOSS" = Math.random() > 0.4 ? "WIN" : "LOSS";
      setBetslip(b => b ? { ...b, phase: "result", result } : null);
      setTimeout(() => setBetslip(null), 2200);
    }, 900);
  };

  const balanceColor =
    wallet.state === "HEALTHY" ? "var(--green)" :
    wallet.state === "LOW"     ? "var(--amber)" : "var(--red-state)";

  const potentialReturn = betslip
    ? (betslip.stake * parseFloat(betslip.odds)).toFixed(2)
    : "0.00";

  const heroMatch    = FOR_YOU.find(m => m.pinned && m.isLive);
  const filteredLive = SPORTS_LIVE.filter(m => m.sport === activeSport);
  const filteredUpcoming = SPORTS_UPCOMING.filter(m => m.sport === activeSport);

  // ── Shared match card ──────────────────────────────────────────────────────
  const renderMatchCard = (m: Match) => (
    <div key={m.id} style={{
      background: "var(--bg-card)",
      border: `1px solid ${m.isLive ? "var(--brand)" : "var(--border)"}`,
      borderLeft: `3px solid ${m.isLive ? "var(--brand)" : "var(--border-strong)"}`,
      borderRadius: 12, padding: "12px 14px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: m.isLive ? "0 0 14px var(--brand-glow)" : "none",
    }}>
      {/* Time / minute badge */}
      <div style={{
        background: m.isLive ? "var(--brand-dim)" : "var(--bg-card-raised)",
        color: m.isLive ? "var(--brand-light)" : "var(--text-muted)",
        fontSize: 9, fontWeight: 800, padding: "4px 7px",
        borderRadius: 6, flexShrink: 0, minWidth: 32, textAlign: "center", letterSpacing: 0.3,
      }}>
        {m.isLive ? `${m.liveMinute}'` : m.time.split(" ")[1] ?? m.time}
      </div>

      {/* Teams */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 9, fontWeight: 800, marginBottom: 5,
          textTransform: "uppercase", letterSpacing: 0.4,
          color: m.isLive ? "var(--brand)" : "var(--text-muted)",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {m.isLive && (
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--brand)", animation: "pulse 1.4s ease infinite" }} />
          )}
          {m.league}
        </div>
        {m.isLive && m.homeScore !== undefined ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{m.home}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{m.away}</div>
            </div>
            <div style={{ background: "var(--bg-card-raised)", border: "1px solid var(--border-strong)", borderRadius: 8, padding: "4px 10px", textAlign: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: 3 }}>
                {m.homeScore} — {m.awayScore}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 1 }}>{m.home}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              {m.away}
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 8 }}>{m.time}</span>
            </div>
          </>
        )}
      </div>

      {/* Odds */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {m.odds.map((o, i) => {
          if (!o) return null;
          const tapped = tappedOdd === `${m.id}-${i}`;
          return (
            <div key={i} onClick={() => openBetslip(m, i, o)} style={{
              background: tapped ? "var(--brand)" : "var(--bg-card-raised)",
              border: `1px solid ${tapped ? "var(--brand)" : "var(--border-strong)"}`,
              borderRadius: 8, padding: "7px 10px",
              fontSize: 12, fontWeight: 900, minWidth: 44, textAlign: "center", cursor: "pointer",
              transform: tapped ? "scale(0.93)" : "scale(1)",
              transition: "all 160ms ease",
              color: tapped ? "#fff" : "var(--text-primary)",
            }}>
              {o}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-frame">

      {/* ── Header ── */}
      <div style={{ background: activeTheme.headerGradient, padding: "20px 16px 18px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, marginBottom: 4 }}>MY KINGDOM</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>{user.displayName} 👑</div>
            <div style={{ display: "inline-block", marginTop: 7, background: activeTheme.accentColor, color: activeTheme.accentTextColor, fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 4, letterSpacing: 0.5 }}>
              {user.tier.toUpperCase()} MEMBER
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowThemePicker(true)} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🎨
            </button>
            <img src={user.avatar} alt={user.displayName} width={46} height={46} style={{ borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Balance */}
        <div style={{ background: "rgba(0,0,0,0.28)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(8px)" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 3, letterSpacing: 0.5 }}>VAULT</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: balanceColor, letterSpacing: -0.5, transition: "color 400ms ease" }}>
              R{wallet.balance.toFixed(2)}
            </div>
          </div>
          {wallet.state !== "HEALTHY" ? (
            <div style={{ display: "flex", gap: 6 }}>
              {wallet.topUpPresets.map(amt => (
                <button key={amt} onClick={() => handleTopUp(amt)} style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${balanceColor}`, borderRadius: 8, color: balanceColor, fontSize: 12, fontWeight: 800, padding: "7px 12px", cursor: "pointer" }}>
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
        {TABS.map(t => (
          <div key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, textAlign: "center", padding: "11px 4px", fontSize: 9, fontWeight: 800, letterSpacing: 0.3, color: activeTab === t ? "var(--brand)" : "var(--text-muted)", borderBottom: activeTab === t ? "2px solid var(--brand)" : "2px solid transparent", cursor: "pointer", transition: "color 150ms ease" }}>
            {t}
          </div>
        ))}
      </div>

      {/* ── MY KINGDOM ── */}
      {activeTab === "MY KINGDOM" && (
        <div className="screen-content">
          <div style={{ paddingTop: 14 }}><NudgeCardSlot onTopUpRequest={handleTopUp} /></div>
          <div style={{ paddingTop: 20 }}><KingdomShelfSlot /></div>
          <div style={{ paddingTop: 20 }}><PaymentInsightsSlot /></div>

          {/* Hero live match */}
          {heroMatch && (
            <div style={{ padding: "20px 16px 0" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--brand)", boxShadow: "0 0 32px var(--brand-glow)" }}>
                <div style={{ background: activeTheme.headerGradient, padding: "14px 16px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 800, letterSpacing: 0.8 }}>📍 {heroMatch.league}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.35)", padding: "4px 9px", borderRadius: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 1.4s ease infinite" }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>LIVE · {heroMatch.liveMinute}'</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{heroMatch.home}</div>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.45)", borderRadius: 12, padding: "8px 18px", flexShrink: 0, textAlign: "center" }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 4, lineHeight: 1 }}>
                        {heroMatch.homeScore} — {heroMatch.awayScore}
                      </div>
                    </div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{heroMatch.away}</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: "var(--bg-card)", padding: "10px 12px 12px", display: "flex", gap: 6 }}>
                  {heroMatch.odds.map((o, i) => {
                    if (!o) return null;
                    const tapped = tappedOdd === `${heroMatch.id}-${i}`;
                    return (
                      <button key={i} onClick={() => openBetslip(heroMatch, i, o)} style={{ flex: 1, padding: "10px 4px", background: tapped ? "var(--brand)" : "var(--bg-card-raised)", border: `1px solid ${tapped ? "var(--brand)" : "var(--border-strong)"}`, borderRadius: 10, cursor: "pointer", textAlign: "center", transform: tapped ? "scale(0.95)" : "scale(1)", transition: "all 160ms ease" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: tapped ? "#fff" : "var(--text-primary)", marginBottom: 3 }}>{o}</div>
                        <div style={{ fontSize: 9, color: tapped ? "rgba(255,255,255,0.7)" : "var(--text-muted)", fontWeight: 700, letterSpacing: 0.3 }}>
                          {heroMatch.oddLabels[i]?.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ margin: "20px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: 0.5 }}>⭐ RECOMMENDED FOR YOU</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {FOR_YOU.filter(m => !m.pinned).map(m => renderMatchCard(m))}
          </div>
        </div>
      )}

      {/* ── SPORTS ── */}
      {activeTab === "SPORTS" && (
        <div className="screen-content">
          {/* Sport filter */}
          <div style={{ display: "flex", overflowX: "auto", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", flexShrink: 0, scrollbarWidth: "none" }}>
            {SPORT_FILTERS.map(s => (
              <button key={s.id} onClick={() => setActiveSport(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "11px 16px", minWidth: "fit-content", background: "transparent", border: "none", borderBottom: activeSport === s.id ? "2px solid var(--brand)" : "2px solid transparent", cursor: "pointer", color: activeSport === s.id ? "var(--brand)" : "var(--text-muted)", fontSize: 10, fontWeight: 700, transition: "all 150ms ease" }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {filteredLive.length > 0 && (
            <>
              <div style={{ padding: "16px 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)", boxShadow: "0 0 6px var(--brand)", animation: "pulse 1.4s ease infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 800 }}>Live Now</span>
                <span style={{ fontSize: 10, color: "var(--brand)", fontWeight: 800, background: "var(--brand-dim)", padding: "2px 7px", borderRadius: 4 }}>{filteredLive.length}</span>
              </div>
              <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredLive.map(m => renderMatchCard(m))}
              </div>
            </>
          )}

          {filteredUpcoming.length > 0 && (
            <>
              <div style={{ padding: "20px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>Upcoming</span>
                <span style={{ fontSize: 12, color: "var(--brand)", fontWeight: 700 }}>View all</span>
              </div>
              <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredUpcoming.map(m => renderMatchCard(m))}
              </div>
            </>
          )}

          {filteredLive.length === 0 && filteredUpcoming.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "60px 16px", color: "var(--text-muted)" }}>
              <span style={{ fontSize: 48 }}>{SPORT_FILTERS.find(s => s.id === activeSport)?.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>No matches right now</span>
            </div>
          )}
        </div>
      )}

      {/* ── GAMES ── */}
      {activeTab === "GAMES" && (
        <div className="screen-content">
          <div style={{ padding: "16px" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
              Casino &amp; instant games. Play between matches.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {GAMES_LIST.map(game => (
                <div key={game.id} style={{ background: game.gradient, borderRadius: 14, padding: "20px 14px 16px", border: "1px solid var(--border)", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                  {game.badge && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: game.badgeColor, color: "#fff", fontSize: 8, fontWeight: 900, padding: "2px 6px", borderRadius: 4, letterSpacing: 0.5 }}>
                      {game.badge}
                    </div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{game.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{game.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROMOS ── */}
      {activeTab === "PROMOS" && (
        <div className="screen-content">
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {PROMOS.map(promo => (
              <div key={promo.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 3, background: promo.tagColor }} />
                <div style={{ padding: "14px 16px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{promo.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{promo.title}</div>
                      <div style={{ display: "inline-block", background: promo.tagColor, color: "#fff", fontSize: 8, fontWeight: 900, padding: "2px 7px", borderRadius: 4, letterSpacing: 0.5 }}>
                        {promo.tag}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.5 }}>{promo.subtitle}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                      {promo.cta}
                    </button>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{promo.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom nav ── */}
      <div style={{ display: "flex", background: "var(--bg-card)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        {[{ icon: "☰", label: "Menu" }, { icon: "🔴", label: "Live" }, { icon: "🎫", label: "Betslip" }, { icon: "✅", label: "My Bets" }].map(item => (
          <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 4px 12px", gap: 3, fontSize: 10, fontWeight: 600, color: "var(--text-muted)", cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
        <div onClick={() => handleTopUp(wallet.topUpPresets[1] ?? 20)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 8px 8px", gap: 3, cursor: "pointer" }}>
          <div style={{ background: "var(--brand)", borderRadius: 10, padding: "8px 0", width: "100%", textAlign: "center", fontSize: 20, lineHeight: 1 }}>+</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Deposit</span>
        </div>
      </div>

      {/* ── Auto Top-Up Confirmation ── */}
      {pendingAutoTopUp !== null && (
        <>
          <div onClick={cancelAutoTopUp} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 38, animation: "fadeIn 200ms ease" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--bg-card)", borderRadius: "18px 18px 0 0", borderTop: "2px solid var(--amber)", zIndex: 39, padding: "16px 16px 28px", animation: "slideUp 240ms cubic-bezier(0.34,1.1,0.64,1)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(240,180,41,0.12)", border: "1px solid rgba(240,180,41,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Vault running low</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Balance dropped below R{wallet.autoTopUp.triggerThreshold}. Top up{" "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>R{pendingAutoTopUp}</span> to keep playing?
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={confirmAutoTopUp} style={{ flex: 1, padding: "13px 0", background: "var(--brand)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Top Up R{pendingAutoTopUp}</button>
              <button onClick={cancelAutoTopUp} style={{ padding: "13px 18px", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-strong)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Not now</button>
            </div>
          </div>
        </>
      )}

      {/* ── Theme Picker Sheet ── */}
      {showThemePicker && (
        <>
          <div onClick={() => setShowThemePicker(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 42, animation: "fadeIn 200ms ease" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--bg-base)", borderRadius: "20px 20px 0 0", borderTop: `2px solid ${activeTheme.accentColor}`, zIndex: 43, maxHeight: "82%", display: "flex", flexDirection: "column", animation: "slideUp 240ms cubic-bezier(0.34,1.1,0.64,1)" }}>
            <div style={{ padding: "10px 16px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1.4 }}>YOUR KINGDOM STYLE</span>
                <span onClick={() => setShowThemePicker(false)} style={{ fontSize: 16, color: "var(--text-muted)", cursor: "pointer", padding: "4px 8px" }}>✕</span>
              </div>
            </div>
            <div style={{ overflowY: "auto", padding: "0 16px 32px" }}>
              <StepPickTheme selected={kingdom.theme} onChange={themeId => { setTheme(themeId); setTimeout(() => setShowThemePicker(false), 300); }} />
            </div>
          </div>
        </>
      )}

      {/* ── Betslip Drawer ── */}
      {betslip && (
        <>
          <div onClick={() => betslip.phase === "open" && setBetslip(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 40, animation: "fadeIn 200ms ease" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--bg-card)", borderRadius: "18px 18px 0 0", borderTop: "1px solid var(--border-strong)", zIndex: 41, paddingBottom: 28, animation: "slideUp 240ms cubic-bezier(0.34,1.1,0.64,1)" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 16px 14px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: 1.4 }}>BETSLIP</span>
              <span onClick={() => betslip.phase === "open" && setBetslip(null)} style={{ fontSize: 16, color: "var(--text-muted)", cursor: "pointer", padding: "4px 8px" }}>✕</span>
            </div>

            {betslip.phase === "result" ? (
              <div style={{ textAlign: "center", padding: "8px 16px 4px" }}>
                <div style={{ fontSize: 54, marginBottom: 10, animation: "pop 320ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  {betslip.result === "WIN" ? "🏆" : "😔"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: betslip.result === "WIN" ? "var(--green)" : "var(--text-secondary)" }}>
                  {betslip.result === "WIN" ? `You won R${potentialReturn}!` : "Better luck next time"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {betslip.result === "WIN" ? "Winnings added to your vault" : `R${betslip.stake.toFixed(2)} staked`}
                </div>
              </div>
            ) : betslip.phase === "placing" ? (
              <div style={{ textAlign: "center", padding: "28px 16px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)" }}>Placing your bet...</div>
              </div>
            ) : (
              <>
                <div style={{ margin: "0 16px 14px", background: "var(--bg-base)", border: "1px solid var(--border-strong)", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3 }}>{betslip.selectionLabel}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{betslip.matchLabel}</div>
                  </div>
                  <div style={{ background: "var(--brand)", color: "#fff", borderRadius: 8, padding: "7px 11px", fontSize: 15, fontWeight: 900, flexShrink: 0 }}>{betslip.odds}</div>
                </div>
                <div style={{ margin: "0 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Stake</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => setBetslip(b => b ? { ...b, stake: Math.max(1, b.stake - 1) } : null)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--bg-base)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 17, fontWeight: 800, minWidth: 52, textAlign: "center" }}>R{betslip.stake.toFixed(2)}</span>
                    <button onClick={() => setBetslip(b => b ? { ...b, stake: b.stake + 1 } : null)} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--bg-base)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
                <div style={{ margin: "0 16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Potential return</span>
                  <span style={{ fontSize: 17, fontWeight: 900, color: "var(--green)" }}>R{potentialReturn}</span>
                </div>
                <div style={{ padding: "0 16px" }}>
                  <button onClick={handlePlaceBet} style={{ width: "100%", padding: "15px 0", background: "var(--brand)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
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
