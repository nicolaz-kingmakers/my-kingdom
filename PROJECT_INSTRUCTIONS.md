# My Kingdom — Hackathon Project Context
# TeamInIt2WinIt · 2-Day Hackathon

## What we're building
A personalised home screen + smart wallet for a sports betting app.
One screen that feels built specifically for this user — their games, their identity, their balance.
Working name: **My Kingdom / Kingdom Vault / PredictaPay**.

---

## Team & ownership — fixed across all tiers

| Person | Always owns |
|--------|-------------|
| **Nico** | How things **look** — UI shell, layout, components, visual states |
| **Cris** | How the wallet **behaves** — state machine, logic, trigger rules |
| **You (Abioye)** | **Flow, narrative, AI** — UX journey, demo story, Claude API integration |

---

## The 3 tiers

### Tier 1 — The Kingdom (Day 1, everyone)
Clickable prototype or coded mockup.
- Personalised home screen (user picks top games, layout, theme)
- Identity layer (name, avatar, greeting)
- Static wallet widget (balance visible, prominent)
- Favourite games shelf (pinned, reorderable)

**Key demo beat:** before/after contrast in 10 seconds.

### Tier 2 — Kingdom Vault · PredictaPay (Day 2 AM)
Interactive prototype with wallet state changes. No real payment rails — mock convincingly.
- Live balance state (widget turns amber when low)
- One-tap top-up (€10 / €20 / €50, single confirm)
- Auto top-up rule ("if balance < €5, add €20 automatically")
- Mini transaction log (last 3 top-ups inline)

**Key demo beat:** amber → green state change on top-up.

### Tier 3 — The AI Brain (Day 2 PM, if time)
Live Claude API powering real nudges — not mocked.
- Play pattern nudges ("You usually play Friday nights. Balance is low — top up now?")
- AI game recommendations ("Your kingdom, curated for tonight")
- Predictive top-up timing
- Tone personalisation (casual vs competitive)

**Key demo beat:** live AI nudge fires during demo video.

---

## Shared mock data
All three of us should use the same mock user. See `mock-data.json` in this project.

## Handoff rule
**Finish Tier 1 together before anyone moves to Tier 2.**
Tier 1 output is Tier 2 input — this is the critical constraint.

---

## Files in this project

| File | Who reads it | Purpose |
|------|-------------|---------|
| `PROJECT_INSTRUCTIONS.md` | Everyone | This file — shared context |
| `mock-data.json` | Everyone | Canonical mock user, wallet, games |
| `ux-flow.md` | Abioye + Nico (for UI spec) | UX journeys, screen flows, demo script |
| `ai-prompts.md` | Abioye (Cris/Nico for reference) | Claude API prompt designs for Tier 3 |
