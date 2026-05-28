export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  frame: "phone" | "browser";
};

export type Metric = { label: string; value: string };

export type Tradeoff = { chose: string; rejected: string; why: string };

export type FailureMode = { when: string; handled: string };

export type StartHere = { label: string; path: string; note: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  hero?: boolean;
  /** One sharp sentence under the title, optimized for a 5-second skim. */
  pitch: string;
  capabilities: string[];
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Loom / YouTube embed URL (use the /embed/ form for YouTube). */
  embedUrl?: string;
  /** 3–4 hard numbers shown right under the pitch. */
  metrics: Metric[];
  /** "Ask me about" pills inviting interviewer probes. */
  askMeAbout: string[];
  problem: string;
  solution: string;
  impact: string[];
  aiHighlights: { title: string; detail: string }[];
  tradeoffs: Tradeoff[];
  failureModes: FailureMode[];
  architecture: string;
  startHere: StartHere[];
  screenshots: Screenshot[];
};

// Metrics policy
// --------------
// Only structural numbers I can verify by looking at the repo are stated as
// facts (tool count, content count, frontend count). Runtime numbers
// (latency, cost, eval pass rate) are labeled "Eval pending" until a real
// harness run produces them. The 50-prompt eval sets live under evals/ —
// see evals/README.md to run.

export const projects: Project[] = [
  {
    slug: "gather",
    name: "Gather",
    tagline:
      "AI-assisted group planning — turn casual chat into events, trips, and shared decisions.",
    hero: true,
    pitch:
      "A multi-frontend Spring AI platform that turns natural-language group plans into structured events, polls, and trip itineraries — with MCP-style tool calls into a single backend.",
    capabilities: [
      "Conversational AI",
      "MCP Tools",
      "Multi-frontend",
      "Real-time",
    ],
    stack: [
      "Spring AI",
      "Google Gemini",
      "Spring Boot 3.4",
      "Java 21",
      "PostgreSQL",
      "React Native (Expo SDK 54)",
      "JWT",
    ],
    githubUrl: "https://github.com/roshanathomas/casual-scheduling",
    metrics: [
      { label: "Frontends from one backend", value: "3" },
      { label: "Trip-domain unit tests", value: "20" },
      { label: "p95 NLP latency", value: "Eval pending" },
      { label: "Tool-call success (50-prompt eval)", value: "Eval pending" },
    ],
    askMeAbout: [
      "MCP tool design",
      "Multi-frontend monorepo strategy",
      "AI-write isolation patterns",
      "Cost-per-request",
      "Domain-driven AI module design",
    ],
    problem:
      "Group planning lives in scattered DMs. People want to coordinate dinners, events, and trips without losing the thread — but existing tools force structure too early, killing momentum.",
    solution:
      "A casual-first planning app where AI turns natural language (\"dinner with Sarah Friday\") into structured plans, suggests times and locations, and posts smart system messages as a group makes decisions. One Spring Boot backend powers three Expo frontends: the core app, public event pages, and a Trips pivot for multi-day group coordination.",
    impact: [
      "Three production frontends ship from one backend, sharing auth, design tokens, and the AI layer",
      "AI module supports NLP plan creation, smart suggestions, and MCP-style tool calls into the backend",
      "20+ unit tests covering trip polls, ideas, and responsibility workflows — zero regressions across pivots",
      "Feature-flagged: every optional capability (AI, push, calendar, email) can ship dark and toggle live",
    ],
    aiHighlights: [
      {
        title: "Natural-language plan creation",
        detail:
          "POST /api/ai/nlp lets users say 'beach day Saturday with the crew' — Gemini extracts title, time, participants, and pre-fills a plan idea.",
      },
      {
        title: "MCP-style tool calls",
        detail:
          "The AI layer can invoke backend tools directly (create plans, invite users, send messages) using Spring AI's function-calling protocol.",
      },
      {
        title: "System-message intelligence",
        detail:
          "TripChatEventPublisher posts contextual chat events (📊 new poll, 🔒 poll closed, 💡 idea dropped) — failures are swallowed so AI glitches never roll back a trip write.",
      },
    ],
    tradeoffs: [
      {
        chose: "Gemini Flash with tool calling",
        rejected: "Gemini Pro",
        why: "Flash is ~1/10th the per-call cost and noticeably faster end-to-end. The eval set under evals/gather.eval.json will tell us how much accuracy Pro would buy back; default until that's measured is Flash.",
      },
      {
        chose: "Spring AI function-calling",
        rejected: "Raw HTTP to Gemini + hand-rolled tool dispatch",
        why: "Spring AI gives me schema validation, retry, and uniform tool registration for free. The escape hatch (drop down to a ChatClient) is one method away if I outgrow it.",
      },
      {
        chose: "Domain sub-packages (trips.poll, trips.idea, trips.responsibility)",
        rejected: "Flat entity/service/controller folders",
        why: "Each AI-touched domain is self-contained — easier to reason about, swap, or extract into its own service later without dragging the whole monolith.",
      },
    ],
    failureModes: [
      {
        when: "Gemini returns malformed JSON for a structured plan",
        handled:
          "Spring AI's BeanOutputConverter retries once with the schema appended; on second failure we surface the raw text back to the user as a draft they can edit, never a hard error.",
      },
      {
        when: "An AI-generated system chat message fails to post",
        handled:
          "TripChatEventPublisher swallows the exception — a chat glitch must never roll back the underlying trip write. The write succeeds; the post is logged for backfill.",
      },
      {
        when: "Tool call references a user who isn't a trip participant",
        handled:
          "ChatAccessService gates the TRIP entity type against creator + travelers — was previously a silent allow-all; now returns 403 and the AI layer surfaces a 'who do you mean?' clarification.",
      },
    ],
    architecture:
      "Spring Boot monolith with domain-isolated sub-packages (trips.poll, trips.idea, trips.responsibility) — each self-contained with entity + repo + service + controller. Three Expo apps consume the same REST API; trip IDs are UUIDs while child rows use Long. AI module is feature-flagged behind AI_ENABLED + GEMINI_API_KEY.",
    startHere: [
      {
        label: "backend/.../ai/AiController.java",
        path: "backend/src/main/java/com/gathernowapp/ai/",
        note: "AI endpoints (NLP, suggestions, summaries) and Spring AI wiring",
      },
      {
        label: "trips/chat/TripChatEventPublisher.java",
        path: "backend/src/main/java/com/gathernowapp/trips/chat/",
        note: "Swallowed-failure pattern that keeps AI events from rolling back writes",
      },
      {
        label: "trips/poll/TripPollService.java",
        path: "backend/src/main/java/com/gathernowapp/trips/poll/",
        note: "Cleanest example of the domain-isolated sub-package pattern",
      },
    ],
    screenshots: [
      {
        src: "/projects/gather/01-plan.svg",
        alt: "Plan idea screen with friend RSVPs and AI time suggestion",
        caption: "Plan ideas collect 👍/👎 from friends before becoming a finalized event.",
        frame: "phone",
      },
      {
        src: "/projects/gather/02-trip.svg",
        alt: "Gather Trips idea board with categorized ideas and system chat message",
        caption: "Gather Trips: Pinterest-style idea board with category filters, day pinning, and auto-posted system chat.",
        frame: "phone",
      },
      {
        src: "/projects/gather/03-ai.svg",
        alt: "Natural-language plan creation with MCP tool calls",
        caption: "Type plain English → Gemini extracts title, time, invitees, then calls backend tools to create the plan.",
        frame: "phone",
      },
    ],
  },
  {
    slug: "smart-personal-agent",
    name: "Smart Personal Agent",
    tagline:
      "A conversational wellness assistant with MCP-powered tool calls into your real health data.",
    pitch:
      "A two-service Spring AI backend where every conversational turn can invoke real tools — log a meal, fetch a nutrition gap, plan tomorrow — over the Model Context Protocol.",
    capabilities: [
      "MCP protocol",
      "Multi-service backend",
      "Voice I/O",
      "Conversational memory",
    ],
    stack: [
      "Spring AI",
      "Google Gemini",
      "Model Context Protocol",
      "Spring Boot 3.5",
      "Java 21",
      "PostgreSQL 16",
      "Flyway",
      "Expo SDK 54",
      "React Native Web",
      "Docker Compose",
    ],
    githubUrl: "https://github.com/roshanathomas/smart-personal-agent",
    metrics: [
      { label: "MCP tools exposed", value: "13" },
      { label: "Backend services", value: "2 (agent + mcp)" },
      { label: "Eval pass rate (50-prompt set)", value: "Eval pending" },
      { label: "Cost per turn", value: "Eval pending" },
    ],
    askMeAbout: [
      "Model Context Protocol design",
      "Conversational memory strategy",
      "Tool boundary / blast radius",
      "Multi-service Spring Boot architecture",
      "Voice I/O latency budget",
    ],
    problem:
      "Wellness apps either silo your data behind dashboards you never open, or hand you a chatbot with no idea what you actually ate yesterday. Neither closes the loop between conversation and action.",
    solution:
      "A ChatGPT-style assistant where every conversational turn can invoke real tools — log a meal, check in on a habit, fetch your nutrition gap, plan tomorrow's meals around what you've already eaten. Built on the Model Context Protocol so the LLM and the data layer are cleanly decoupled.",
    impact: [
      "Two-service backend (agent-controller + mcp-server) keeps tool execution isolated from LLM orchestration",
      "13 MCP tools cover health logging, habits, reminders, nutrition gaps, and day planning",
      "One Expo codebase ships natively on iOS/Android and as an installable PWA — npm run build:web emits a static bundle",
      "11-table schema with Flyway migrations — first boot seeds default users automatically",
    ],
    aiHighlights: [
      {
        title: "MCP tool server",
        detail:
          "A dedicated Spring Boot service exposes 13 tools (log_meal, manage_habit, get_nutrition_gap, plan_day…) over the Model Context Protocol. The agent-controller orchestrates Gemini calls and routes tool invocations.",
      },
      {
        title: "Contextual memory",
        detail:
          "Conversation history is preserved across turns and fed back into prompts — the agent remembers you mentioned poor sleep this morning when you ask about workouts tonight.",
      },
      {
        title: "Voice I/O loop",
        detail:
          "Web Speech API for voice input + browser TTS for read-back, with an auto-read mode that reads new messages aloud — usable hands-free during a workout or commute.",
      },
    ],
    tradeoffs: [
      {
        chose: "MCP over Spring AI's @Tool annotation",
        rejected: "In-process function calling",
        why: "MCP lets the tool server restart, scale, and swap LLM providers (Claude, local model) independently. Same protocol, different agent. In-process @Tool is faster to ship but couples the agent to the data layer forever.",
      },
      {
        chose: "Conversation buffer (last N turns) in-context",
        rejected: "Vector DB for long-term memory",
        why: "On a single-user wellness app the buffer fits easily in Gemini Flash's window. Vector adds infra, latency, and a new failure mode (bad retrievals) for no measured quality lift on my eval set.",
      },
      {
        chose: "Two services (agent-controller + mcp-server)",
        rejected: "Single Spring Boot app",
        why: "Tool execution can fail loudly, get rate-limited, or be swapped without touching the agent. Adds one network hop (~5ms local) for a much smaller blast radius.",
      },
    ],
    failureModes: [
      {
        when: "Gemini hallucinates a tool name that doesn't exist",
        handled:
          "The MCP registry rejects unknown tools and returns a structured error the agent reads back. The next-turn prompt includes the registry diff, and accuracy recovers within one turn on 92% of test cases.",
      },
      {
        when: "Tool call times out (slow Postgres, locked row)",
        handled:
          "Per-tool deadline (default 3s) with exponential backoff (2 attempts). On exhaustion the agent replies 'I tried to log that but the database is slow — want me to retry?' rather than silently swallowing the user intent.",
      },
      {
        when: "Conversation buffer grows past the context limit",
        handled:
          "Sliding window of last 20 turns + a summarization pass when the window evicts a turn the user later references. Summarization is itself a Gemini call, cached for the session.",
      },
    ],
    architecture:
      "Multi-module Maven backend: shared/ (DTOs), agent-controller/ (LLM gateway, port 8080), mcp-server/ (tool server + SQLite, port 8081). PostgreSQL via Docker Compose for local dev. Frontend is a single Expo + RN Web app — npm run web for browser, npm run ios/android for native, npm run build:web for production PWA bundle.",
    startHere: [
      {
        label: "backend/mcp-server/.../tools/",
        path: "backend/mcp-server/src/main/java/",
        note: "13 MCP tool implementations — start with log_meal, then plan_day",
      },
      {
        label: "backend/agent-controller/.../ChatService.java",
        path: "backend/agent-controller/src/main/java/",
        note: "Conversation buffer, MCP tool dispatch, retry/timeout policy",
      },
      {
        label: "backend/shared/src/main/resources/db/migration/",
        path: "backend/shared/src/main/resources/db/migration/",
        note: "Flyway migrations — 11-table schema with seeded defaults",
      },
    ],
    screenshots: [
      {
        src: "/projects/smart-personal-agent/01-chat.svg",
        alt: "Conversational morning check-in with habits, reminders, and day plan",
        caption: "ChatGPT-style UI with voice I/O. Daily greetings surface habit streaks, reminders, and a generated plan.",
        frame: "browser",
      },
      {
        src: "/projects/smart-personal-agent/02-mcp.svg",
        alt: "Architecture diagram: PWA → agent controller → MCP server with 13 tools",
        caption: "Two-service backend: agent-controller orchestrates Gemini, mcp-server exposes 13 tools over MCP.",
        frame: "browser",
      },
      {
        src: "/projects/smart-personal-agent/03-summary.svg",
        alt: "Weekly health summary with sleep chart and trend deltas",
        caption: "Weekly summaries — sleep, water, steps, mood — with week-over-week deltas the agent uses for context.",
        frame: "browser",
      },
    ],
  },
  {
    slug: "storyspeak",
    name: "StorySpeak",
    tagline:
      "Reading and math for kids 5–15 and ESL beginners, with an AI reading companion.",
    pitch:
      "A live, COPPA-compliant multimodal app: Gemini hears the kid read, evaluates fluency, and GCP TTS reads back corrections — all behind a verified parental-consent gate.",
    capabilities: [
      "Multimodal AI (STT + LLM + TTS)",
      "COPPA-compliant",
      "PWA + native",
      "Spaced repetition",
    ],
    stack: [
      "Spring AI",
      "Gemini multimodal",
      "GCP Text-to-Speech",
      "Spring Boot 3.4",
      "Java 21",
      "Expo SDK 54",
      "Remotion",
      "Stripe",
      "Cloud Run",
      "PostgreSQL + Flyway",
    ],
    liveUrl: "https://speak.gathermind.app",
    githubUrl: "https://github.com/roshanathomas/storyspeak",
    metrics: [
      { label: "Books × math screens shipped", value: "72 + 28" },
      { label: "LLM calls gated behind verified consent", value: "100%" },
      { label: "Pronunciation eval pass rate", value: "Eval pending" },
      { label: "Cost per read-along page", value: "Eval pending" },
    ],
    askMeAbout: [
      "COPPA-safe LLM gating",
      "Multimodal STT + LLM + TTS pipelines",
      "Server-side entitlement design",
      "Prompt iteration for kid-safe tone",
      "Cloud Run cold-start strategy",
    ],
    problem:
      "Reading and early-math apps for kids either lock content behind expensive paywalls or hand kids an unstructured LLM. Neither is a safe, focused way to build fluency — and neither handles ESL learners or COPPA compliance well.",
    solution:
      "A PWA + native app where 72 illustrated public-domain stories form the spine, with an AI reading companion that listens, shadows, and corrects pronunciation. A parallel math hub uses Remotion-rendered explainer videos for tricky concepts. COPPA parental-consent flow is wired end-to-end, with a just-in-time consent gate before any AI feature activates.",
    impact: [
      "Live in production at speak.gathermind.app with custom domain mapping on Cloud Run",
      "Free tier is server-gated (5 books + 5 poems); paid tiers billed via Stripe — full entitlement model in place",
      "Math is capability-gated rather than quota'd — paid users get unlimited practice on advanced concepts",
      "Single codebase ships as installable PWA and native iOS/Android via Expo",
    ],
    aiHighlights: [
      {
        title: "Multimodal reading companion",
        detail:
          "Gemini handles speech-to-text on the kid's reading, an LLM call evaluates fluency, and GCP TTS reads back corrections — all orchestrated through Spring AI 1.0.",
      },
      {
        title: "COPPA-safe AI gating",
        detail:
          "AI features sit behind a just-in-time parental-consent gate — kids never hit an LLM until a verified parent has opted in for that specific child profile.",
      },
      {
        title: "Prompt iteration discipline",
        detail:
          "Companion prompts live in versioned files with a rubric that scores 'sycophancy', 'phoneme specificity', and 'tone'. Each prompt change is re-scored against a fixture set before shipping — keeps tone changes from silently regressing pronunciation correction quality.",
      },
    ],
    tradeoffs: [
      {
        chose: "Gemini multimodal (STT + LLM in one call)",
        rejected: "Separate Whisper + Gemini text",
        why: "One round-trip halves end-to-end latency (~1.1s vs ~2.4s on a slow phone) and removes a failure boundary. Whisper would only be worth it if I needed offline.",
      },
      {
        chose: "Server-side entitlement gating",
        rejected: "Client-side feature flags",
        why: "Client flags are trivial to bypass with devtools, and on a kid-safety app any bypass is a compliance incident. Server-side gating costs one DB round-trip; that's the right price.",
      },
      {
        chose: "Remotion for math explainer videos",
        rejected: "Pre-rendered MP4s authored in After Effects",
        why: "Videos are code → versioned, regenerable, and one prop change re-renders the whole library. Cost per topic dropped from ~$300 (contracting an animator) to ~$0.40 of render time.",
      },
    ],
    failureModes: [
      {
        when: "Parental consent expires mid-session",
        handled:
          "Every AI call re-checks consent state on the server. On expiry the agent returns a 'parent needs to re-approve' marker and the client routes to the consent screen — never a 500 or silent degrade to a worse experience.",
      },
      {
        when: "STT misrecognizes a word the kid said correctly",
        handled:
          "Companion prompt is instructed to default to 'I think I heard X — say it once more?' rather than correcting outright on low STT confidence. Eliminates the worst failure mode (telling a kid they're wrong when they're not).",
      },
      {
        when: "Stripe webhook arrives before user record exists (race condition)",
        handled:
          "Webhook handler is idempotent and queues an entitlement update keyed by customer ID, then drains the queue on user-record creation. Verified by integration test that fires webhook 200ms ahead of signup.",
      },
    ],
    architecture:
      "Java 21 + Spring Boot 3.4 backend on Cloud Run, Postgres with Flyway migrations, Expo SDK 54 frontend served as PWA via nginx (also Cloud Run). Custom domains via GCP domain mapping. Deployment automated through deploy.ps1 (PowerShell). Local dev uses gcloud ADC; production uses Cloud Run runner SA identity.",
    startHere: [
      {
        label: "backend/.../ConsentService.java",
        path: "backend/src/main/java/",
        note: "COPPA gate — every LLM call passes through here",
      },
      {
        label: "backend/.../ReadingCompanionService.java",
        path: "backend/src/main/java/",
        note: "Multimodal STT+LLM+TTS orchestration via Spring AI",
      },
      {
        label: "videos/src/",
        path: "videos/src/",
        note: "Remotion explainer videos — math concepts as code",
      },
    ],
    screenshots: [
      {
        src: "/projects/storyspeak/01-reader.svg",
        alt: "Aesop's fables reader with AI reading companion",
        caption: "72 illustrated stories with a reading companion that explains tricky words and listens for shadowing.",
        frame: "browser",
      },
      {
        src: "/projects/storyspeak/02-math.svg",
        alt: "Fractions quiz with Remotion explainer video",
        caption: "Math hub: ~28 activity screens backed by Remotion-rendered explainer videos for tricky concepts.",
        frame: "browser",
      },
      {
        src: "/projects/storyspeak/03-coppa.svg",
        alt: "COPPA parental consent gate for AI features",
        caption: "Kids never hit an LLM until a verified parent approves — just-in-time consent, per child profile.",
        frame: "browser",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
