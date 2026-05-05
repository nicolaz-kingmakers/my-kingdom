# My Kingdom — Claude Context
# Hackathon project — TeamInIt2WinIt
# Team: Abioye (flow/AI) · Nico (UI/layout) · Cris (wallet logic)

---

## What This Is

A personalised home screen and smart wallet for a sports betting app (SuperSportBET / BetKing).
The pitch: every user gets their own "Kingdom" — their sports, their balance, their AI assistant.

Demo arc: Generic app → "Make it yours" → 30s onboarding → Kingdom home → AI nudge fires → top up → vault turns green → place bets → smart wallet auto-refills.

---

## Critical Rules

- **Pure frontend — no backend required.** All nudges are templated on the frontend in `src/ai/nudgeGenerator.ts`. Do NOT add fetch calls to `/api/nudge` — the Express server in `server/` is kept for reference only.
- **Mock everything.** This is a hackathon. UX is what matters. No real payments, no real bets, no real auth.
- **Do not commit `.env`.** It is gitignored. The API key is not needed for the demo.
- **One command to run:** `npm run dev` → app at `http://localhost:5173`

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript + Vite 5 |
| Routing | React Router v6 |
| State | React Context API (`src/context/AppContext.tsx`) |
| Styling | Inline styles + CSS custom properties (`src/index.css`) |
| AI nudge | Frontend mock (`src/ai/nudgeGenerator.ts`) — personalised templates, no API call |
| Package manager | npm |

---

## Repo Structure

```
src/
  App.tsx                          # Root — wraps AppProvider + AppFlow
  context/AppContext.tsx           # ALL shared state and actions
  data/mockData.ts                 # Typed mock data — user, wallet, kingdom, AI context
  flows/
    AppFlow.tsx                    # All routes + Toast
    OnboardingFlow.tsx             # 3-step onboarding wizard
  screens/
    BeforeScreen.tsx               # Generic "before" state — entry point
    KingdomHomeScreen.tsx          # Main screen — personalised home
    onboarding/                    # StepPickGames, StepPickTheme, StepSetName, StepComplete
    topup/                         # TopUpConfirmScreen, TopUpSuccessScreen
  slots/
    NudgeCardSlot.tsx              # AI nudge card (Nico styles, Abioye data)
    KingdomShelfSlot.tsx           # Pinned sports icons (Nico)
    WalletWidgetSlot.tsx           # Wallet widget — built, available if needed (Cris)
  ai/
    nudgeGenerator.ts              # Frontend mock nudge generator — edit this for new triggers
    useNudgeEngine.ts              # Hook: polls every 60s, evaluates triggers, calls generator
    types.ts                       # NudgeRequest / NudgeResponse types
  components/
    Toast.tsx                      # Auto-dismiss toast for auto top-up notification
  index.css                        # Design tokens + global styles
server/
  index.ts                         # Express Claude proxy — NOT USED, kept for reference
```

---

## Shared State (AppContext)

```ts
// State
user        // displayName, tier, avatar, usualSessionDay/Time, currency
wallet      // balance, state (HEALTHY/LOW/EMPTY), recentTransactions, autoTopUp config
kingdom     // pinnedGames, theme
aiContext    // openNudge, nudgesTone
isOnboarded // guards /home route
toast       // string | null — shown by Toast component

// Actions
completeOnboarding(name, pinnedGameIds, theme)
topUp(amount)          // adds funds + dismisses open nudge
spendBalance(amount)   // deducts funds + triggers auto top-up if below threshold
setAutoTopUp(enabled, threshold, amount)
dismissNudge()
setOpenNudge(nudge)
clearToast()
```

---

## Design Tokens (key ones)

```css
--brand: #C8102E          /* SuperSportBET red */
--gold: #F0B429           /* Kingdom / premium accent */
--green: #00C48C          /* Healthy vault */
--amber: #F0B429          /* Low vault */
--bg-base: #0D0D0D        /* App background */
--bg-card: #1A1A1A        /* Card background */
```

---

## Mock Data Defaults

- **User:** Nico, Gold member, usual session Friday 20:00, competitive tone
- **Wallet:** €4.20 starting balance, LOW state, auto top-up ON (threshold €5 → add €20), presets [10, 20, 50]
- **Kingdom:** Premier League (live), UFC/MMA, NBA pinned
- **Nudge trigger:** LOW_BALANCE_BEFORE_SESSION fires on Friday within 2h of 20:00 with balance < €10

To change the demo persona, edit `src/data/mockData.ts`.

---

## What's Built ✅

- Before screen (generic app entry point)
- 3-step onboarding wizard (sports → style → name)
- Kingdom home screen (personalised header, vault, nudge, shelf, match cards)
- Top-up confirm + success screens
- Auto top-up (fires 1.5s after balance drops below threshold)
- Odds button tap feedback (flash + scale) + balance deduction
- Tab navigation (MY KINGDOM / SPORTS / GAMES / PROMOS)
- Toast notification for auto top-up
- Nudge auto-dismisses after top-up
- Pure frontend nudge engine with personalised templated messages

## What's Next ⬜

1. **Betslip drawer** — slide-up when odds tapped; stake input; mock Place Bet → result
2. **Post-top-up nudge** — after vault turns green, fire contextual follow-up nudge
3. **Live score pulse** — mock scores update every few seconds on match cards
4. **My Bets panel** — show recent bets from transaction history

---

## Running Locally

```bash
npm install
npm run dev
# App at http://localhost:5173
```

No `.env` needed. No backend needed. Just npm run dev.

---

## Ownership

| Area | Owner |
|------|-------|
| Flow, routing, AI nudge engine | Abioye |
| UI/layout, onboarding visuals, slots styling | Nico |
| Wallet logic, state, WalletWidgetSlot | Cris |
| Betslip drawer (next) | Nico (UI) + Abioye (state) |
