# Project Evals

Three behavioral eval sets (50 prompts each) for the AI-bearing projects in this portfolio:

| Project | File | System under test |
|---|---|---|
| Gather | [gather.eval.json](./gather.eval.json) | `POST /api/ai/nlp` + Spring AI tool-calling (Gemini 2.0 Flash) |
| StorySpeak | [storyspeak.eval.json](./storyspeak.eval.json) | Reading companion (Gemini STT/LLM + GCP TTS) + math tutor + COPPA gate |
| Smart Personal Agent | [smart-personal-agent.eval.json](./smart-personal-agent.eval.json) | agent-controller → mcp-server (13 MCP tools) |

## Why these exist

These projects are LLM-shaped: behavior emerges from prompt + tool wiring + state, not from deterministic code. Unit tests catch tool-routing regressions but not "is the assistant doing the right thing." Each eval set encodes the behaviors that matter — extraction correctness, tool selection, refusal posture, COPPA gating — into a runnable harness that can be re-run on every prompt change, model bump, or system-prompt edit.

## Structure

Every prompt has:

- `id` — stable slug (`G01`, `S26`, `A14`)
- `category` — bucket for slicing results (e.g. `nlp_extraction`, `coppa_gate`, `tool_chaining`)
- `prompt` — the user input, possibly with `[bracketed]` simulated state
- `expected` — target tool call, fields, or behavior
- `notes` — clarifications for the judge

Categories per project:

- **Gather**: nlp_extraction, tool_call, system_message, multi_turn, edge_case, safety, trips
- **StorySpeak**: reading_companion, content_selection, math_tutor, coppa_gate, safety, tts_voice, robustness, esl
- **SPA**: tool_routing, tool_chaining, memory, nutrition_math, voice_loop, refusal, robustness, ux, data_integrity

## Rubric

Each prompt is scored 0–1 on 5 criteria (defined per project in the JSON). Per-prompt score is the mean. A prompt **passes** if it clears the project's threshold (0.75–0.80). A few criteria are **blocking** — e.g. any `coppa_gating = 0` in StorySpeak fails the whole run, regardless of average.

## Runner

`run-evals.ts` is the harness. It:

1. Loads an eval JSON
2. For each prompt, calls the target system (HTTP for Gather/SPA backends, or replayed against a fixture for StorySpeak STT-heavy prompts)
3. Sends `(prompt, expected, actual_response)` to an LLM judge (Claude Sonnet 4.6) with the rubric in the system prompt
4. Writes a results JSON to `results/<project>-<timestamp>.json` and a markdown report alongside it

Run locally:

```powershell
# requires ANTHROPIC_API_KEY + the relevant backend running (or fixture mode)
npx tsx evals/run-evals.ts --project gather --target http://localhost:8080
npx tsx evals/run-evals.ts --project storyspeak --fixtures evals/fixtures/storyspeak
npx tsx evals/run-evals.ts --project smart-personal-agent --target http://localhost:8080
```

## Pilot run

A pilot pass is committed under [results/](./results/). See:

- [gather-pilot.md](./results/gather-pilot.md)
- [storyspeak-pilot.md](./results/storyspeak-pilot.md)
- [smart-personal-agent-pilot.md](./results/smart-personal-agent-pilot.md)

The pilot was scored by Claude Sonnet 4.6 as the judge against staging endpoints (Gather, SPA) and a deterministic STT fixture set (StorySpeak). Scores and category breakdowns are real artifacts from that run; numbers will move as prompts and system prompts get tuned.

## Why ship this as a portfolio piece

Anyone can wire up an LLM call. Eval engineering is the part most projects skip and most teams need. The eval sets here:

- exercise the **same behaviors** each project's README claims (NLP plan creation, MCP tool routing, COPPA gating, etc.) — so the eval set doubles as a verification of the marketing copy
- include the **negative space** — refusal, prompt injection, ambiguity, race conditions — not just happy paths
- are reusable as **regression checks** before every model bump
