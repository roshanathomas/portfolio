import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

const skills = [
  {
    title: "Agent & Tool Orchestration",
    detail:
      "Model Context Protocol (MCP) tool servers, Spring AI function-calling, multi-turn agent loops with conversational memory.",
  },
  {
    title: "Multimodal AI",
    detail:
      "Speech-to-text, LLM reasoning, and text-to-speech pipelines wired together — Gemini multimodal + GCP TTS in production.",
  },
  {
    title: "Production LLM Backends",
    detail:
      "Spring AI on Java 21, feature flags, entitlement gating, COPPA consent flows, observability for prompt + tool calls.",
  },
  {
    title: "Full-stack Shipping",
    detail:
      "Spring Boot + PostgreSQL + Flyway on the backend; Expo / React Native + PWA on the client; Cloud Run deploys via PowerShell.",
  },
  {
    title: "Domain-driven design",
    detail:
      "Self-contained sub-packages (entity + repo + service + controller), Zelle-style privacy models, RFC 5545 calendar generation.",
  },
  {
    title: "AI Safety & Compliance",
    detail:
      "Server-side entitlement gating, just-in-time parental consent, swallowed-failure patterns so AI glitches never corrupt user data.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 glow" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <p className="font-mono text-sm text-accent mb-4">// AI Engineer</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Roshan Thomas
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed">
            I build production AI systems — agents that use real tools, multimodal apps
            that ship to kids, and full-stack platforms where the LLM is one part of a
            larger architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              href="#work"
              className="px-5 py-2.5 rounded-full bg-accent text-white hover:opacity-90 transition"
            >
              See the work →
            </a>
            <a
              href="https://www.linkedin.com/in/roshanathomas"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 transition"
            >
              Connect on LinkedIn
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <Stat label="Production AI apps" value="3+" />
            <Stat label="MCP tools shipped" value="13+" />
            <Stat label="Frontends from one backend" value="3" />
            <Stat label="Cloud Run services live" value="2" />
          </div>
        </div>
      </section>

      <section id="work" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Featured work</h2>
          <span className="text-white/40 font-mono text-sm">{projects.length} projects</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section id="skills" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">What I bring</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-white/10 bg-ink-800/50 p-5"
            >
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About</h2>
        <div className="space-y-4 text-white/75 leading-relaxed">
          <p>
            I&apos;m a full-stack engineer focused on shipping AI into real products —
            not demos. My work spans group-coordination platforms, kid-safe learning
            apps, and conversational health agents, all built around the same belief:
            LLMs are most useful when they can act on real data through well-defined
            tools.
          </p>
          <p>
            I lean on Spring AI + Java 21 on the backend, Expo + React Native on the
            client, and Cloud Run / Vercel for shipping. I care about feature flags,
            entitlement gating, and the messy parts of production AI — consent flows,
            graceful failures, observability.
          </p>
          <p>
            Open to AI engineering roles. The fastest way to reach me is{" "}
            <a
              href="https://www.linkedin.com/in/roshanathomas"
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-white/50">{label}</div>
    </div>
  );
}
