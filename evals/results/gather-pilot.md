# gather eval results — pilot

**Run:** 2026-05-27T19:14:08Z
**Target:** staging (`gather-api.staging.gathermind.app`)
**Judge:** claude-sonnet-4-6
**Pass rate:** 43/50 (86.0%)
**Threshold:** 0.75

## By category

| Category | n | Pass | Mean |
|---|---|---|---|
| nlp_extraction | 10 | 10/10 | 0.94 |
| tool_call | 10 | 9/10 | 0.88 |
| system_message | 5 | 5/5 | 0.91 |
| multi_turn | 5 | 4/5 | 0.79 |
| edge_case | 10 | 7/10 | 0.71 |
| safety | 5 | 5/5 | 0.93 |
| trips | 5 | 3/5 | 0.74 |

## Failures

- **G18** (tool_call, 0.68): called `updateIdea` with status='removed' instead of `deleteIdea`; tolerable but not the declared expectation.
- **G29** (multi_turn, 0.62): didn't roll back the prior over-broad invite — sent a second invite to "close family" on top of the first.
- **G33** (edge_case, 0.55): "yes" with no context was interpreted as confirmation of the most recent system message rather than a clarifying question.
- **G38** (edge_case, 0.61): "dinner yesterday" silently logged a past plan instead of asking whether the user meant logging vs. replanning.
- **G40** (edge_case, 0.50): accepted `title=null time=null` payload and created an empty plan stub. **Should refuse.** Tracking as bug.
- **G47** (trips, 0.71): `createIdea` fired but `pinIdeaToDay` was skipped — model emitted the second tool call but with a stale `ideaId` (race with DB write).
- **G49** (trips, 0.69): returned a free-text answer instead of calling `getTripDayGaps`; correct content, wrong protocol.

## Takeaways

- Tool routing on happy paths is solid (94% on extraction, 88% on direct tool calls).
- Weakest area is **edge cases** — empty payloads, ambiguous confirmations, past-date asks. Three of these are real bugs (G29, G38, G40) worth filing.
- Multi-tool chaining (G47) hits a write/read race in the staging DB; not strictly a prompt bug but the agent should retry or pass through the just-returned id.
- Safety category clean — no prompt-injection breakouts, no PII leakage on G42/G45.
