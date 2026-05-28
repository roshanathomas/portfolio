# StorySpeak — production latency probe

**Run:** 2026-05-28 12:34:28 -04:00
**Endpoint:** `https://api.speak.gathermind.app/actuator/health`
**Method:** 5 warmup requests (dropped) + 50 measured requests, 150ms apart
**Client:** `Invoke-WebRequest` from a Windows host, single-stream sequential
**User-Agent:** `roshanathomas-portfolio-latency-probe/1.0`

## What this measures

End-to-end latency of the Spring Actuator healthcheck on Cloud Run. This
is the **infrastructure latency floor** — network + TLS + Cloud Run
routing + Spring health endpoint. It does **not** measure LLM-bearing
endpoints (companion, math tutor), which require auth + COPPA-verified
child profile + Gemini multimodal/TTS round-trips and will be
substantially higher.

## Results

| Stat | ms |
|---|---|
| samples (successful / total) | 50 / 50 |
| errors | 0 |
| min | 59.9 |
| p50 | 72.2 |
| mean | 122.1 |
| p95 | 211.1 |
| p99 | 1,172.3 |
| max | 1,172.3 |

## Notes

- `p99 ≈ max` strongly suggests a single Cloud Run cold-start tail. Warmup
  pre-warmed the container but instance autoscaling can spin a new one mid-run.
- p50 of 72ms is the steady-state floor — anything below ~70ms on a real
  user request is wire-impossible from this client location.
- For a proper LLM-bearing latency number, run the full eval against an
  authenticated companion endpoint with `--target` pointed at prod (see
  `evals/README.md` — requires test child profile with pre-granted consent).

## Other endpoints probed

| Path | Status | Note |
|---|---|---|
| `/actuator/health` | 200 | public, used for this probe |
| `/` | 401 | gated, expected |
| `/api-docs` | 401 | gated — good security posture |
| `/swagger-ui.html` | 401 | gated — good security posture |
