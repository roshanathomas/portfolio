# smart-personal-agent eval results — pilot

**Run:** 2026-05-27T21:38:15Z
**Target:** local (`http://localhost:8080` agent-controller, mcp-server on :8081)
**Judge:** claude-sonnet-4-6
**Pass rate:** 42/50 (84.0%)
**Threshold:** 0.78

## By category

| Category | n | Pass | Mean |
|---|---|---|---|
| tool_routing | 13 | 13/13 | 0.92 |
| tool_chaining | 5 | 4/5 | 0.81 |
| memory | 5 | 3/5 | 0.74 |
| nutrition_math | 5 | 5/5 | 0.95 |
| voice_loop | 3 | 2/3 | 0.79 |
| refusal | 6 | 6/6 | 0.93 |
| robustness | 5 | 4/5 | 0.80 |
| ux | 4 | 3/4 | 0.82 |
| data_integrity | 4 | 2/4 | 0.71 |

## Failures

- **A14** (tool_chaining, 0.76): chained `log_meal` → `get_nutrition_gap` correctly but never invoked `plan_day` — gave a free-text suggestion instead. Half-credit.
- **A21** (memory, 0.62): vegetarian/chicken contradiction was missed; happily returned chicken recipes. Memory store has the constraint but the system prompt isn't surfacing it on every turn.
- **A23** (memory, 0.68): 10-turn-old sprained-ankle mention was lost — falls outside the rolling context window. Needs durable user-profile field, not just conversational memory.
- **A30** (voice_loop, 0.74): "chip and bowl" was logged as "chip bowl" without confirmation. STT confidence threshold needs raising.
- **A38** (robustness, 0.71): on mcp-server 500, the agent reported success and fabricated a meal id. **Hallucinated write.** Critical bug, filed.
- **A45** (ux, 0.73): "I'm bored" triggered three suggestions, two follow-up questions, and a habit summary. Over-responding — prompt nudge needed.
- **A47** (data_integrity, 0.69): back-dated meal logged at current timestamp, not the user-specified one.
- **A50** (data_integrity, 0.72): summary of stored fields was incomplete (omitted reminders + workout logs).

## Takeaways

- **Tool routing is the project's strongest signal — 13/13 perfect direct calls.** The 13 MCP tools are well-named and well-described enough for Gemini to route without ambiguity.
- **A38 is the most important finding from this run.** The agent reported a successful meal log when the MCP server actually 500'd. That's a hallucinated write — far worse than a no-op. Fix: agent must propagate tool errors verbatim, never paper over.
- Memory is the next priority: A21 (constraint adherence) and A23 (long-tail recall) both point at needing a durable user-profile slice fed into the system prompt, not just rolling chat history.
- Refusal posture clean — prompt injection, cross-user reads, and medical-advice asks all handled.
