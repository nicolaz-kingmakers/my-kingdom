# My Kingdom — Claude Context
# TeamInIt2WinIt · KingMakers · May 2026 Hackathon
# Team: Abioye (flow/AI) · Nico (UI/layout) · Cris (wallet logic)

---

## What This Is

> **"The vault that knows your game."**
> A smart funding layer that keeps players ready before their session starts —
> personalisation is the invisible engine, the vault is the product.

Demo arc: Generic app → "Make it yours" → 4-tap onboarding → Kingdom home → AI nudge fires → top up → vault turns green → place bet → smart vault auto-refills.

**Full business context, OKR mapping, and demo script → read `strategy.md` first.**

---

## Critical Rules

- **Pure frontend — no backend required.** All nudges are templated in `src/ai/nudgeGenerator.ts`. Do NOT add fetch calls to `/api/nudge` — the Express server in `server/` is kept for reference only.
- **Mock everything.** This is a hackathon. UX is what matters. No real payments, no real bets, no real auth.
- **Do not commit `.env`.** Gitignored. API key not needed for the demo.
- **One command to run:** `npm run dev` → app at `http://localhost:5173`
- **Currency is ZAR for the demo.** Code currently uses EUR (€). All new copy, nudge messages, and mock amounts should use Rand (R) and SA context. A full code currency swap is tracked in What's Next.
- **Language:** "Keep me ready" / "Vault standing order" — never "auto-charge" or "auto top-up." Trust language matters for opt-in rates.

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
    KingdomHomeScreen.tsx          # Main screen — personalised home + betslip drawer + auto top-up confirm
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
    Toast.tsx                      # Auto-dismiss toast for wallet events
  index.css                        # Design tokens + global styles
server/
  index.ts                         # Express Claude proxy — NOT USED, kept for reference
strategy.md                        # OKRs, product decisions, SA market context, demo script ← read this
```

---

## OKR Map (one line each)

| OKR | How My Kingdom moves it | Tier |
|-----|------------------------|------|
| **Retention** | Personalised identity layer → emotional ownership → reduces Month 1 churn | 1 |
| **Revenue** | Smart vault modes → higher top-up frequency + avg. deposit size | 2 |
| **Market share** | SA-first launch (PSL + Instant EFT) → same product scales to NG/ZM | 2–3 |
| **Profitability** | AI nudges replace CRM blast campaigns at <$0.01 per nudge | 3 |

---

## Three Vault Modes

| Mode | Problem it solves | Demo beat |
|------|------------------|-----------|
| **Mode 1 — One-tap** | Friction (6-step flow → 2-step) | Amber → tap R180 → confirm → green. Under 5s. |
| **Mode 2 — Smart reminder** | Frequency (reactive → proactive) | Friday 17:00 nudge fires unprompted before PSL |
| **Mode 3 — Keep me ready** | Retention (never hits zero mid-session) | Silent vault refill when balance drops below R50 |

Mode 3 is "Keep me ready" (saved card only). Never call it "auto-charge."

---

## SA Market Context (demo anchoring)

- **Currency:** ZAR (R). Target amounts: balance R42, session spend R180, threshold R50.
- **Sport:** PSL (Premier Soccer League) drives Friday/Saturday spikes — use this, not Premier League.
- **Primary instrument:** Instant EFT (Ozow/Peach) for Mode 1+2. Saved card for Mode 3.
- **Expansion story:** Same vault, mobile money (MTN MoMo / Airtel) in NG and ZM.
- **Unbanked segment:** 1Voucher users get a different nudge — "buy your voucher before Saturday's games" not "top up now."

Full SA payment landscape → `strategy.md §Market`.

---

## Shared State (AppContext)

```ts
// State
user        // displayName, tier, avatar, usualSessionDay/Time, currency
wallet      // balance, state (HEALTHY/LOW/EMPTY), recentTransactions, autoTopUp config
kingdom     // pinnedGames, theme
aiContext   // openNudge, nudgesTone
isOnboarded // guards /home route
toast       // string | null — shown by Toast component
pendingAutoTopUp  // number | null — amount awaiting user confirmation

// Actions
completeOnboarding(name, pinnedGameIds, theme)
topUp(amount)             // adds funds + dismisses open nudge + triggers post-top-up nudge
spendBalance(amount)      // deducts funds + queues auto top-up confirmation if below threshold
setAutoTopUp(enabled, threshold, amount)
dismissNudge()
setOpenNudge(nudge)
clearToast()
confirmAutoTopUp()        // user confirms pending auto top-up → calls topUp()
cancelAutoTopUp()         // user dismisses pending auto top-up confirmation
```

---

## Vault State Machine

```
balance >= R100  →  HEALTHY  🟢  "Ready to play"
R10 < balance < R100  →  LOW  🟡  "Running low"     ← triggers nudge + shows top-up presets
balance <= R10   →  EMPTY   🔴  "Top up to play"

Current code thresholds (EUR, pending ZAR migration):
  HEALTHY ≥ €10 | LOW €0–€10 | EMPTY €0
  Keep me ready fires when: balance < €5 → adds €20
```

---

## Design Tokens (key ones)

```css
--brand: #C8102E          /* SuperSportBET red */
--gold:  #F0B429          /* Kingdom / premium accent */
--green: #00C48C          /* Healthy vault */
--amber: #F0B429          /* Low vault */
--bg-base: #0D0D0D        /* App background */
--bg-card: #1A1A1A        /* Card background */
```

---

## Mock Data Defaults

**Target (SA demo):**
- User: Nico, Gold member, usual session Friday 20:00, competitive tone
- Balance: R42 (LOW), "Keep me ready" ON (threshold R50 → add R180), presets [R50, R100, R180]
- Kingdom: PSL (live), UFC/MMA, NBA pinned
- Nudge trigger: `LOW_BALANCE_BEFORE_SESSION` fires Friday within 2h of 20:00 with balance < R100

**Current code state:** EUR (€4.20 balance, €5 threshold, €20 add). ZAR migration is in What's Next.

To change the demo persona, edit `src/data/mockData.ts`.

---

## What's Built ✅

- Before screen (generic app entry point)
- 3-step onboarding wizard (sports → style → name)
- Kingdom home screen (personalised header, vault, nudge, shelf, match cards)
- Top-up confirm + success screens
- **Betslip drawer** — slides up when odds tapped; selection + stake (±) + potential return + Place Bet CTA; WIN/LOSS result
- **"Keep me ready" confirmation sheet** — vault running low prompts user confirmation before auto top-up fires (not silent)
- **Post-top-up session nudge** — after vault turns green, contextual follow-up nudge fires ("You're set, Nico. Match kicks off at 17:30 — go get it.")
- Auto top-up logic (fires on confirm, not silently)
- Odds button tap feedback (flash + scale) + betslip opens
- Tab navigation (MY KINGDOM / SPORTS / GAMES / PROMOS)
- Toast notification for wallet events
- Nudge auto-dismisses after top-up
- Pure frontend nudge engine with personalised templated messages

## What's Next ⬜

### P1 — Remaining demo impact
1. **ZAR currency migration** (~20 min) — swap € → R in mockData.ts, nudgeGenerator.ts, all UI copy. PSL replaces Premier League. Match: "Kaizer Chiefs vs Orlando Pirates".
2. **Payment instrument step in onboarding** (~30 min · Abioye+Cris) — "How do you want to fund your vault?" (Instant EFT / Saved Card / 1Voucher). Unlocks the Mode 3 demo beat. Currently missing.

### P2 — Adds energy and depth
3. **Live score pulse** (~15 min · Nico) — mock scores update every few seconds on match cards
4. **My Bets panel** (~20 min · Cris + Nico) — show last 2–3 placed bets from transaction history

### P3 — Nice to have
5. **"Edit" on Kingdom shelf** — sport picker modal (reuse onboarding step 1)
6. **Avatar tap** — mini profile showing tier, session preferences, vault standing order status

---

## Running Locally

```bash
npm install
npm run dev
# App at http://localhost:5173
```

No `.env` needed. No backend needed. Just `npm run dev`.

---

## Ownership

| Area | Owner |
|------|-------|
| Flow, routing, AI nudge engine, demo narrative | Abioye |
| UI/layout, onboarding visuals, slots styling, live score pulse | Nico |
| Wallet logic, state, WalletWidgetSlot, My Bets | Cris |
| Payment instrument onboarding step | Abioye (flow) + Cris (state) |
| ZAR migration | Abioye (copy/nudges) + Nico (UI) + Cris (thresholds) |
