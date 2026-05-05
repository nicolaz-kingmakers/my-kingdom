# My Kingdom — Strategy & Business Context
# TeamInIt2WinIt · KingMakers · May 2026 Hackathon
# Last updated: 2026-05-05
# Owner: Abioye — reference for all team members and all Claude sessions

---

## The sharpened idea

The original pitch had personalisation as the headline with a wallet widget bolted on.
The sharpened pitch is the inverse:

> **"The vault that knows your game."**
> A smart funding layer that keeps players ready before their session starts —
> powered by personalisation as the invisible engine underneath.

Personalisation is not the product. It's what makes the amount right, the timing right,
the instrument right. The user-facing story is the vault.

---

## KingMakers OKRs this idea moves

| OKR | How My Kingdom moves it | Primary tier |
|-----|------------------------|--------------|
| **Retention** | Personalised home creates emotional ownership → reduces Month 1 churn | Tier 1 |
| **Revenue** | Smart vault increases top-up frequency + avg. deposit size | Tier 2 |
| **Market share** | SA-first launch with localised instruments; same product scales to NG/ZM | Tier 2–3 |
| **Profitability** | AI nudges replace expensive CRM blast campaigns at <$0.01 per nudge | Tier 3 |

---

## Priority problem order

1. **Friction** — top-up today is 6+ steps, buried in menus, breaks session momentum
2. **Frequency** — users top up reactively (after running dry) not proactively (before session)
3. Auto-charge trust — lower priority; addressed by "Keep me ready" framing and explicit confirmation

---

## Market: South Africa first

KingMakers is replacing its outsourced SA platform with its own product.
SA is the launch market for this feature. Nigeria and Zambia are the expansion narrative.

### SA payment landscape

- **Instant EFT** (Ozow / Peach / PayFast) — dominant trusted method for SA sports betting. Near-instant settlement. Primary instrument for Mode 1 + Mode 2.
- **Saved card** (Visa/Mastercard tokenised) — best for true one-tap and auto vault. Growing in SA. Required instrument for Mode 3 ("Keep me ready").
- **1Voucher / OTT** — critical fallback for unbanked segment. Cannot be automated. Nudge changes to: "Buy your voucher before Saturday's PSL games."

### Expansion instrument map

| Market | Primary instrument | Auto vault possible? |
|--------|-------------------|----------------------|
| South Africa | Instant EFT + saved card | Yes (card) / near (EFT mandate) |
| Nigeria | MTN MoMo / card | Yes (MoMo standing order) |
| Zambia | MTN MoMo / Airtel Money | Yes (MoMo standing order) |

### SA player behaviour
- PSL (Premier Soccer League) drives massive Friday/Saturday session spikes
- Players top up reactively — run dry, then top up. Goal: shift to proactive.
- Session timing is highly predictable → AI nudge timing is very powerful here

---

## The vault model — three modes, one product

### Mode 1 — One-tap (solves: friction)
Instrument pre-selected. Amount pre-filled from avg. session spend.
One confirm screen. No redirects if card saved. Single auth if Instant EFT.
6-step flow → 2-step flow.
**Demo beat:** balance amber → tap R180 → confirm → vault green. Under 5 seconds.

### Mode 2 — Smart reminder (solves: frequency)
AI nudge fires Friday afternoon before PSL kicks off.
"Balance is R42 — your usual session needs R180. Top up now?"
Amount personalised, timing personalised, instrument already stored.
One tap from nudge → directly to pre-filled confirm screen.
Shifts top-up from reactive to proactive.
**Demo beat:** nudge appears unprompted at 17:00 Friday → one tap → funded before kickoff.

### Mode 3 — Keep me ready (solves: retention + revenue)
"Keep my vault above R100 automatically."
Card charged (with confirmation prompt) when balance drops below threshold.
User never hits zero mid-session.
Requires card on file + explicit opt-in.
Frame as **"Keep me ready"** / **"Vault standing order"** — never "auto-charge."
**Demo beat:** balance dips → confirmation sheet slides up → user confirms → vault refills.

---

## Personalisation model — three layers

Personalisation is the engine, not the product. Each layer feeds the next.

### Layer 1 — Identity (collected at onboarding)
Name, avatar, theme, member tier, time-aware greeting.
**OKR:** Retention. Makes users stay — emotional ownership.
**KRs:** Day 7 return rate, Month 1 churn, session frequency.

### Layer 2 — Preference (collected at onboarding)
Pinned games, favourite market, payment instrument (critical unlock), top-up presets.
**OKR:** Revenue. Makes users engage deeper — reduces time-to-bet.
**KRs:** Bets per session, time-to-first-bet, top-up opt-in rate.
⚠️ Payment instrument setup MUST be in onboarding. Without it, Modes 1, 2, 3 are UI theatre.

### Layer 3 — Behaviour (inferred from usage — never ask)
Session timing, avg. session spend, nudge tone, favourite market.
**OKR:** Revenue + Profitability. App works between sessions.
**KRs:** Pre-session funding rate, nudge→top-up conversion, cost per active user vs CRM.

---

## Key product decisions made

1. **Payment instrument setup is part of Tier 1 onboarding.** Without a stored instrument, Tier 2 and Tier 3 are blocked.
   Onboarding flow: Pick games → Choose theme → Set name → **Fund your vault** → Kingdom ready.

2. **Demo is anchored to South Africa and PSL.** "Friday night. PSL is on. Balance is R42." Rand amounts, not euros. PSL, not Premier League.

3. **Three vault modes shown in demo — 30 seconds each.** Mode 1 = friction fix. Mode 2 = frequency fix. Mode 3 = retention premium tier.

4. **"Keep me ready" language is non-negotiable.** "Auto-charge" or "auto top-up" kills trust and opt-in rates. The feature is "a standing rule that works for you."

5. **Voucher users get a different nudge.** Not "top up now" but "buy your voucher before Saturday's games." Same OKR (pre-session funding rate), different mechanic.

6. **Personalisation is the engine, vault is the product.** Demo headline: "The vault that knows your game." Not "personalised home screen."

7. **SA is the launch story, NG/ZM is the expansion story.** One build, three markets, localised instrument per country. Market share argument built into architecture.

8. **"Keep me ready" fires with user confirmation, not silently.** Trust is earned first. The confirmation sheet is the Mode 3 demo beat — it shows the app asking permission, not acting unilaterally.

---

## Profitability argument for judges

> One Claude API nudge (Haiku model) costs <$0.01.
> The same nudge via a CRM blast campaign costs multiples more in tooling and ops.
> At scale, this is a cost-to-retain story as much as a revenue story.

Frame Tier 3 as: AI replaces expensive manual CRM intervention with a personalised,
timely, cheap nudge that converts better because it's relevant.

---

## Demo script — SA context (3 minutes)

**0:00–0:30 — Problem**
"Every sports betting app looks the same. Nothing feels like yours.
And right when PSL kicks off on Friday night — you're out of funds and the moment's gone."

**0:30–1:00 — Before**
[generic screen] "No name. No favourites. Wallet buried. You're a transaction to this app."

**1:00–1:30 — Tier 1 reveal**
"Four taps of setup." [run onboarding incl. instrument setup]
"Now this is Nico's Kingdom. His games. His vault. His method. Front and center."

**1:30–2:00 — Tier 2: Mode 1 (one-tap)**
"Balance drops below R50 — vault goes amber. One tap. Confirm."
[tap R180 → confirm → green] "Green. Ready. Session saved."

**2:00–2:30 — Tier 3: Mode 2 (AI nudge)**
"Friday afternoon. Nico hasn't opened the app.
But the app's been watching." [nudge fires at 17:00]
"'PSL kicks off in 3 hours. Your vault is R42 — top up R180 now?'
Before he even thought to check."

**2:30–3:00 — Vision + expansion**
"This ships in SA — our new platform. Same vault, same AI, mobile money in Nigeria and Zambia.
One build. Three markets. The app that works for the user between sessions.
That's how you turn Month 1 churn into a loyal player. My Kingdom."

---

## Open questions (resolve before demo)

- [ ] "Keep me ready" vs "Vault standing order" — which name in the final demo?
- [ ] Does KingMakers already have Instant EFT integrated in SA, or is that part of the new platform build?
- [ ] Do we have real SA session timing data showing Friday/PSL spikes? (strengthens the nudge timing argument)
- [ ] What is the actual Month 1 churn rate in SA? (makes the retention argument concrete for judges)
