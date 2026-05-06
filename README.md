# My Kingdom — KingMakers Hackathon 2026

> **"The vault that knows your game."**
> A smart funding layer that keeps players ready before their session starts —
> personalisation is the invisible engine, the vault is the product.

**Team InIt2WinIt** · Abioye Bankole · Nico · Cris

---

## Live Demo

**[nicolaz-kingmakers.github.io/my-kingdom](https://nicolaz-kingmakers.github.io/my-kingdom/)**

> Open on mobile or use Chrome DevTools device emulation (375px wide) for the intended experience.

---

## The Problem

Every sports betting app looks the same. Nothing feels like yours.
And right when PSL kicks off on Friday night — you're out of funds and the moment's gone.

- Top-up today is 6+ steps, buried in menus, breaks session momentum
- Players top up *reactively* (after running dry), not *proactively* (before session)
- No personalisation means no emotional ownership → high Month-1 churn

---

## What We Built

### Tier 1 — The Kingdom
A personalised home screen that feels built for this specific user.

- 4-tap onboarding: pick your sports → choose your theme → set your name → fund your vault
- 14 SA-rooted themes (Kaizer Chiefs, Orlando Pirates, Nigeria, Bafana Bafana, and more) — each one changes every colour, letter, and UI element app-wide
- Personalised header with your name, member tier, and vault balance front and center
- Pinned sports shelf with your favourite games

### Tier 2 — Kingdom Vault
Interactive wallet with real state changes — no real payment rails, but mock that convinces.

- Live vault balance (amber when low, green when healthy)
- One-tap top-up — 6-step flow reduced to 2 steps
- Three vault modes:
  - **Mode 1 — One-tap:** pre-filled amount, pre-selected instrument, single confirm
  - **Mode 2 — Smart reminder:** AI nudge fires before PSL kickoff with personalised amount and timing
  - **Mode 3 — Keep me ready:** vault auto-refills when balance drops below your threshold — with explicit consent and custom configuration
- Full payment instrument onboarding: Saved Card and Mobile Money enable Keep me ready; Instant EFT and 1Voucher for manual top-ups
- Betslip drawer with stake control, potential return calculation, and WIN/LOSS result

### Tier 3 — The AI Brain
Personalised nudge engine — templated on the frontend for a zero-latency demo.

- Nudge fires unprompted before your usual session time ("Friday 17:00 — PSL in 3 hours, vault is R42")
- Tone personalisation (casual vs competitive vs cautious)
- Post-top-up session nudge ("You're set. Match kicks off at 17:30 — go get it.")
- Voucher-user nudge variant ("Buy your voucher before Saturday's games")

---

## OKR Mapping

| OKR | How My Kingdom moves it |
|-----|------------------------|
| **Retention** | Personalised identity layer → emotional ownership → reduces Month-1 churn |
| **Revenue** | Smart vault + AI nudge → higher top-up frequency + avg. deposit size |
| **Market share** | SA-first (PSL, Instant EFT, Ozow) → same product scales to NG (MTN MoMo) and ZM (Airtel) |
| **Profitability** | AI nudge costs <$0.01 per fire vs multiples more for a CRM blast campaign |

---

## Demo Script (3 minutes)

**0:00–0:30 — Problem**
Generic screen. No name. No favourites. Wallet buried. "You're a transaction to this app."

**0:30–1:00 — Tier 1: Onboarding**
Four taps. Pick games → theme (pick Nigeria — everything goes green and white) → name → vault setup with Keep me ready configured.
"Now this is Nico's Kingdom."

**1:00–1:30 — Tier 2: Mode 1 (one-tap top-up)**
Balance is R42. Vault goes amber. Tap +R180. One confirm screen. Green.
Under 5 seconds from amber to ready.

**1:30–2:00 — Tier 3: Mode 2 (AI nudge)**
Friday afternoon. App fires unprompted: "PSL kicks off in 3 hours. Your vault is R42 — top up R180 now?"
One tap from nudge → pre-filled confirm → funded before kickoff.

**2:00–2:30 — Mode 3: Keep me ready**
Balance dips mid-session. Confirmation sheet slides up.
"Your vault dropped below R50. Add R180 from your Saved Card?"
Confirm → vault refills. Player never hits zero.

**2:30–3:00 — Vision**
"SA launches first. Nigeria and Zambia use the same vault with MTN MoMo.
One build. Three markets. The app that works for the player between sessions.
That's how you turn Month-1 churn into a loyal player. **My Kingdom.**"

---

## Running Locally

```bash
npm install
npm run dev
# App at http://localhost:5173
```

No `.env` needed. No backend needed. Pure frontend — just `npm run dev`.

---

## Team

| Person | Role |
|--------|------|
| **Abioye Bankole** | Flow, routing, AI nudge engine, demo narrative |
| **Nico** | UI/layout, onboarding visuals, slots, theming |
| **Cris** | Wallet logic, state machine, betslip |

---

## Tech Stack

React 18 · TypeScript · Vite 5 · React Router v6 · CSS custom properties (14 theme tokens) · Pure frontend — zero backend dependency for demo
