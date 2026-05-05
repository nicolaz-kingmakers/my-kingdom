# My Kingdom — AI Prompts & Claude API Integration
# Owner: Abioye (You) · Tier 3 only

---

## Architecture overview

```
Trigger rules (Cris)
    │  fires when conditions met
    ▼
Nudge generator  ←─── user context from mock-data.json
    │  calls Claude API
    ▼
Personalised nudge text + CTA
    │
    ▼
Nudge UI component (Nico)
```

The Claude API call is **one call per nudge trigger** — not streaming, not conversational.
Input: user context object. Output: a short nudge message + optional CTA label.

---

## Claude API call — TypeScript/JS (Tier 3)

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface UserContext {
  name: string;
  balance: number;
  currency: string;
  usualSessionDay: string;
  usualSessionTime: string;
  nudgeTrigger: "LOW_BALANCE_BEFORE_SESSION" | "SESSION_REMINDER" | "GAME_ALERT" | "RECOVERY_NUDGE";
  favouriteGames: string[];
  nudgeTone: "casual" | "competitive" | "analytical";
  suggestedTopUpAmount: number;
}

interface NudgeResponse {
  message: string;
  ctaLabel: string;
  urgency: "low" | "medium" | "high";
}

async function generateNudge(user: UserContext): Promise<NudgeResponse> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001", // fast + cheap for nudges
    max_tokens: 150,
    system: `You are a smart wallet assistant for a sports betting app called My Kingdom.
Your job is to generate short, personalised nudge notifications.

Rules:
- Maximum 2 sentences. Never more.
- Match the user's tone: casual = friendly/relaxed, competitive = driven/energetic, analytical = data-led/precise.
- Always end with a clear action or observation.
- Never be pushy or gambling-promotional. Be helpful, like a smart friend.
- Output valid JSON only: { "message": "...", "ctaLabel": "...", "urgency": "low|medium|high" }`,

    messages: [
      {
        role: "user",
        content: `Generate a nudge for this user:

Name: ${user.name}
Balance: ${user.currency}${user.balance}
Trigger: ${user.nudgeTrigger}
Usual session: ${user.usualSessionDay} at ${user.usualSessionTime}
Favourite games: ${user.favouriteGames.join(", ")}
Tone: ${user.nudgeTone}
Suggested top-up: ${user.currency}${user.suggestedTopUpAmount}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as NudgeResponse;
}
```

---

## Example outputs by trigger type and tone

### LOW_BALANCE_BEFORE_SESSION · competitive tone
```json
{
  "message": "Friday night's almost here, Nico. €4.20 won't cut it for your usual session — you need to be ready.",
  "ctaLabel": "Top up €20",
  "urgency": "high"
}
```

### LOW_BALANCE_BEFORE_SESSION · casual tone
```json
{
  "message": "Hey Nico, Friday vibes incoming 🙌 Your balance is a bit low — want to sort that now?",
  "ctaLabel": "Add €20",
  "urgency": "medium"
}
```

### LOW_BALANCE_BEFORE_SESSION · analytical tone
```json
{
  "message": "Your average session spend is €18. Current balance: €4.20. You'll want to top up before tonight.",
  "ctaLabel": "Top up now",
  "urgency": "high"
}
```

### SESSION_REMINDER · competitive
```json
{
  "message": "Premier League kicks off in an hour, Nico. Kingdom's ready — are you?",
  "ctaLabel": "Open Kingdom",
  "urgency": "low"
}
```

### GAME_ALERT · competitive
```json
{
  "message": "Man City vs Arsenal is live now. Your kingdom is ready.",
  "ctaLabel": "Watch live",
  "urgency": "medium"
}
```

---

## Prompt design principles

1. **System prompt is the guardrail.** All tone rules, length limits, and output format live there — not in the user message. This keeps the user message small (fast + cheap).

2. **Haiku model for nudges.** Speed and cost matter here — nudges fire in real time. Haiku is fast enough to feel instant. Sonnet/Opus only if the output quality is demonstrably insufficient.

3. **Structured JSON output.** Parse `message`, `ctaLabel`, `urgency` separately — Nico's UI component can use `urgency` to control visual emphasis (high = amber border on nudge card).

4. **Never prompt for gambling encouragement.** The system prompt must always include the "helpful friend" framing. This is both ethically correct and keeps the demo clean.

5. **Fallback for demo safety.** If the API call fails during the demo, fall back to the pre-written example from `mock-data.json` → `aiContext.openNudge.message`. Never let the demo die on a network error.

---

## Demo integration checklist

- [ ] `ANTHROPIC_API_KEY` set in env (don't commit the key)
- [ ] Haiku model confirmed working
- [ ] Fallback mock nudge wired up
- [ ] Trigger fires on Friday + balance < €10 condition (Cris wires the trigger)
- [ ] Nudge card appears on home screen (Nico wires the UI component)
- [ ] CTA deep-links to confirm screen pre-filled with `suggestedAmount`
- [ ] Demo video recorded with live nudge firing

---

## What to ask Claude if you get stuck

In the shared Claude project, paste this:

> "I'm implementing Tier 3 of My Kingdom. The trigger has fired (LOW_BALANCE_BEFORE_SESSION). User context is [paste from mock-data.json → aiContext]. Generate the nudge using the system prompt in ai-prompts.md and suggest any improvements to the prompt."
