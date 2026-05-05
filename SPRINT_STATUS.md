# My Kingdom — Hackathon Sprint Status
**Team:** Nico (UI/layout) · Cris (wallet logic) · Abioye (flow/AI)
**Last updated:** 2026-05-05

---

## What We're Building

**My Kingdom** is a personalised home screen and smart wallet for a sports betting app.
The core idea: instead of a generic feed the same for every user, each person gets their own Kingdom — their sports, their balance, their AI assistant nudging them at the right moment.

The demo arc:
> *Generic app* → **"Make it yours"** → 30-second onboarding → *Kingdom home* → AI nudge fires → top up → vault turns green → place bets → smart wallet auto-refills

---

## OKRs for the Hackathon

| Objective | Key Result |
|-----------|-----------|
| Show personalisation is real, not cosmetic | Judge can see their name, their sports, their balance — all set in under 30 seconds |
| Show the AI assistant adds genuine value | Claude-generated nudge fires in context (right day, right balance, right tone) — not a generic alert |
| Show the wallet is smart, not passive | Auto top-up fires automatically when balance drops — zero manual action |
| Make the product feel complete and shippable | Every tap has feedback; no dead buttons on the critical demo path |

---

## What's Built and Working ✅

### Core Flow (Abioye)
- **Before screen** — generic SuperSportBET-style app with "Make it yours" CTA
- **Onboarding wizard** — 3 steps: pick sports → choose style → set name → Kingdom ready
- **Routing & guards** — `/` → `/onboarding` → `/home` → `/topup/confirm` → `/topup/success`
- **All routes protected** — non-onboarded users redirect to onboarding

### Wallet & State (Cris)
- **Vault balance** — live in the Kingdom header, colour-coded (green/amber/red)
- **Top-up flow** — confirm screen with before/after, 900ms processing animation, success screen with green ring
- **Auto top-up** — fires automatically 1.5s after balance drops below threshold (€5), adds €20, shows toast
- **Odds buttons deduct balance** — tapping any odds button spends €2 (mock stake), triggers auto top-up if needed
- **Transaction history** — TOP_UP and BET_PLACED entries logged in wallet state
- **`spendBalance(amount)`** action available in AppContext for further wallet interactions

### AI & Nudges (Abioye)
- **Live Claude API** — Express proxy server (port 3001) calls `claude-haiku-4-5-20251001`
- **Personalised nudge copy** — prompt includes name, balance, tone, session day/time, favourite games
- **Trigger evaluation** — fires `LOW_BALANCE_BEFORE_SESSION` if: correct day + within 2h of session + balance < €10
- **Fallback safety net** — pre-written messages used if API times out; demo never dies
- **Nudge auto-dismisses** after top-up — stale message clears the moment funds land
- **Polls every 60 seconds** — won't re-fire same trigger within the same hour

### UI Polish (Nico)
- **SuperSportBET brand** — `#C8102E` red, dark backgrounds, gold Kingdom accent
- **Tab navigation** — MY KINGDOM / SPORTS / GAMES / PROMOS; non-Kingdom tabs show placeholder
- **Odds button feedback** — tapped button flashes brand red + scales down, resets after 600ms
- **Kingdom shelf** — pinned sports icons with live dot indicator
- **AI nudge card** — gold border, 🧠 icon, KINGDOM INSIGHT label, CTA + dismiss
- **Animations** — `fadeUp`, `pop` on success screen green ring
- **Toast notification** — slides up from bottom when auto top-up fires

---

## What's Next — Prioritised

### 🔴 P1 — Biggest demo impact (do these next)

**1. Betslip drawer** *(~30 min · Nico + Abioye)*
When an odds button is tapped, a drawer slides up from the bottom showing:
- Selection: "Man City to Win · 2.10"
- Stake input (preset: €5)
- Potential return: €10.50
- "Place Bet" button → mock result (win flash or loss)

*Why it matters:* Every judge will tap an odds button. Right now it silently deducts €2. Without a betslip it feels broken. This is the single biggest UX gap.

**2. Post-top-up session nudge** *(~10 min · Abioye)*
After the vault turns green and the low-balance nudge clears, fire a contextual follow-up:
*"You're set, Nico. Man City vs Arsenal kicks off at 17:30 — your kind of match."*
Closes the AI assistant loop. Shows the AI reacts to what you did, not just what you haven't done.

### 🟡 P2 — Adds energy and depth

**3. Live score pulse on match cards** *(~15 min · Nico)*
Mock scores update every few seconds with a brief highlight on change. Makes the home screen feel alive. Mocked entirely on the frontend with `setInterval`.

**4. My Bets panel** *(~20 min · Cris + Nico)*
Bottom nav "My Bets" shows last 2–3 placed bets from transaction history. Gives the app depth if judges explore beyond the scripted path.

### 🟢 P3 — Nice to have, low effort

**5. Deposit button in bottom nav** — already navigates to top-up confirm ✅ (done)
**6. "Edit" on Kingdom shelf** — could open a sport picker modal (same component as onboarding step 1)
**7. Avatar tap** — mini profile card showing tier, session preferences, auto top-up status

---

## Demo Script (60-second arc)

1. Show the **Before screen** — "Same app, same screen, same for everyone"
2. Tap **"Make it yours"** → onboarding
3. Pick **Premier League + UFC** → choose **Dark Gold** → type **"Nico"**
4. Hit **"Enter My Kingdom"** → Kingdom home loads
5. AI nudge fires: *"Friday night's almost here, Nico. Top up €20?"*
6. Tap **"Top up now"** → confirm → success → vault turns green → nudge clears
7. Tap **Man City 2.10** → betslip drawer slides up → Place Bet → result
8. Balance dips → **auto top-up fires** → toast appears → vault refills automatically

**Key narrative beat:** *"The app knows who you are, when you play, and what you need — before you ask."*

---

## Running Locally

```bash
# Terminal 1 — Frontend (Vite)
cd hackathon-my-kingdom
node node_modules/vite/bin/vite.js hackathon-my-kingdom --port 5173

# Terminal 2 — Claude API proxy (Express)
cd hackathon-my-kingdom
node node_modules/ts-node/dist/bin.js --project tsconfig.server.json server/index.ts
```

Requires: `hackathon-my-kingdom/.env` with `ANTHROPIC_API_KEY=sk-ant-...`

App runs at: `http://localhost:5173`

---

## Integration Points

| Slot / Action | Owner | Status |
|---------------|-------|--------|
| `NudgeCardSlot` | Nico (styling) + Abioye (data) | ✅ Done |
| `KingdomShelfSlot` | Nico | ✅ Done |
| `WalletWidgetSlot` | Cris | Built, not used in home — available if needed |
| `spendBalance(amount)` in AppContext | Cris to call from betslip | ✅ Available |
| `topUp(amount)` in AppContext | Cris | ✅ Done |
| `setOpenNudge(nudge)` in AppContext | Abioye | ✅ Done |
| Betslip drawer component | Nico builds UI, Abioye wires state | ⬜ Next |
| Post-top-up nudge trigger | Abioye | ⬜ Next |
