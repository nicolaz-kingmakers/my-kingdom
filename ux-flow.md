# My Kingdom — UX Flow & Demo Script
# Owner: Abioye (You) · Reference: Nico (UI), Cris (logic)

---

## Tier 1 — The Kingdom flow

### Screen 1: Generic "Before" state
The starting point for the before/after demo beat.

```
┌─────────────────────────────────┐
│  [App Logo]   Sports Betting    │
│                                 │
│  Featured matches               │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Match │ │Match │ │Match │    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
│  Wallet: €4.20   [Top Up]       │
│                                 │
│  [Home] [Bets] [Live] [Profile] │
└─────────────────────────────────┘
```
**Feeling:** Could be anyone's app. Generic. No identity. Wallet buried.

---

### Screen 2: My Kingdom "After" state
The transformed home — Nico's kingdom.

```
┌─────────────────────────────────┐
│  👑 Welcome back, Nico          │
│  [Gold avatar]   Gold Member    │
│                                 │
│  YOUR KINGDOM                   │
│  ⚽ Premier League  🥊 UFC  🏀 NBA │
│  [pinned shelf, reorderable]    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 💰 VAULT  €4.20    [⚠️] │    │  ← static widget, Tier 1
│  └─────────────────────────┘    │
│                                 │
│  [Home] [Kingdom] [Live] [Me]   │
└─────────────────────────────────┘
```
**Feeling:** This is mine. My name. My games. My money. Front and center.

**Narrative line for demo:** *"Same app. Thirty seconds of setup. Now it's yours."*

---

### Onboarding flow (first-time setup — enables the before/after)

```
Step 1  →  Step 2  →  Step 3  →  Done
Pick 3+      Choose     Set a      Kingdom
 games       a theme    name       ready
```

- Keep it under 4 taps
- No sign-up wall — this is personalisation, not registration
- After step 3, animate the home screen building itself ("Your Kingdom is ready")

---

## Tier 2 — Kingdom Vault / PredictaPay flow

### Wallet state machine (hand this spec to Cris)

```
        balance >= €10          balance < €10          balance <= 0
HEALTHY ──────────────→ LOW ──────────────────→ EMPTY
  🟢                     🟡                      🔴
  "Ready"               "Running low"           "Top up to play"

Top-up action at any state → POST_TOPUP → recalculate → new state
Auto top-up fires when:  balance drops below €5  →  adds €20 automatically
```

---

### Top-up journey (one-tap flow)

```
Wallet widget (amber) 
    │
    ▼
[€10]  [€20 ✓]  [€50]          ← preset buttons appear inline on widget
    │
    ▼
Confirm screen
┌─────────────────────────────────┐
│  Add €20 to your vault?         │
│                                 │
│  Current balance:  €4.20        │
│  After top-up:     €24.20       │
│                                 │
│  [Cancel]    [Confirm — €20] ←  │  ← primary CTA, large
└─────────────────────────────────┘
    │
    ▼
Success state (1.5s animation)
┌─────────────────────────────────┐
│  ✅ Vault topped up             │
│  Balance: €24.20                │
│  Widget turns GREEN →           │  ← key demo beat
└─────────────────────────────────┘
```

**UX rules:**
- One confirm screen only — no extra steps
- Show before/after balance on confirm screen (builds trust)
- Green state must be visually unmistakable — the demo beat lives here
- Error state: "Payment method needed — add a card" (don't let it dead-end)

---

### Auto top-up rule UI

Accessible from wallet settings, not the primary flow.

```
⚡ Auto top-up
If my balance drops below  [€5 ▾]
automatically add           [€20 ▾]
[Toggle: ON]

Last auto top-up: never
```

---

### Mini transaction log (inline on widget, last 3)

```
│ ✅ Top-up +€20.00      02 May  │
│ 🎯 Bet    -€5.00       02 May  │
│ 💰 Won    +€12.50      02 May  │
```

Keep it inside the wallet widget — don't navigate away. Tap "See all" for full history.

---

## Tier 3 — AI Brain flow

### When nudges fire (hand trigger logic spec to Cris)

| Trigger | Condition | Nudge type |
|---------|-----------|------------|
| Pre-session low balance | Day = user's usual session day AND time ≥ 2h before usual session AND balance < €10 | LOW_BALANCE_BEFORE_SESSION |
| Post-loss drop | Balance dropped > 50% in last session | RECOVERY_NUDGE |
| Session time approaching | Time is 1h before usual session time | SESSION_REMINDER |
| New match in favourite sport | Match in user's pinned games going live | GAME_ALERT |

---

### Nudge placement on screen

```
┌─────────────────────────────────┐
│  👑 Welcome back, Nico          │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🧠 Friday night's almost    ││  ← nudge card, dismissable
│  │    here. Balance is €4.20 — ││
│  │    not enough for your usual ││
│  │    session.                  ││
│  │    [Top up €20]  [Dismiss]   ││
│  └─────────────────────────────┘│
│                                 │
│  YOUR KINGDOM                   │
│  ⚽ ⚽ Premier League  🥊 UFC    │
└─────────────────────────────────┘
```

Rules:
- Max 1 nudge visible at a time
- Always dismissable
- CTA deep-links directly to pre-filled top-up confirm screen (skips preset selection)
- Never nudge within 10 min of a previous nudge

---

## Demo script — 3-minute pitch

**0:00–0:30 — Problem**
> "Every sports betting app looks the same. You open it, you see the same featured matches everyone sees. Nothing feels like yours. And right when you want to place a bet — you're out of funds and the moment's gone."

**0:30–1:00 — Before**
> [show generic screen] "This is what users see today. No name. No favourites. Wallet buried at the bottom. You're a transaction to this app."

**1:00–1:30 — Tier 1 reveal**
> "Thirty seconds of setup." [run onboarding] "Now this is Nico's Kingdom." [show after screen] "His games. His theme. His balance. Front and center."

**1:30–2:00 — Tier 2 demo**
> "Balance drops below €5 — vault goes amber. One tap. Confirm." [tap €20 → confirm → green] "Green. Ready. Moment saved."

**2:00–2:30 — Tier 3 demo**
> "Friday afternoon. Nico hasn't opened the app. But the app's been watching." [nudge fires] "'Friday night's almost here. Balance is low — top up now?' Before he even thought to check."

**2:30–3:00 — Vision**
> "This isn't a wallet feature. This is the app working for the user between sessions. That's how you turn Month 1 churn into a loyal player. My Kingdom."

---

## Narrative one-liners (pick for slides/demo)

- *"Your space. Your rules. Your vault."*
- *"The app that works for you between sessions."*
- *"Not just a wallet. A vault that knows your game."*
- *"Before: a transaction. After: a kingdom."*
