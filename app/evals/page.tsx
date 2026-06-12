import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { repoUrl } from "@/lib/site";
import summary from "@/evals/results/summary.json";

type ProjectEval = {
  project: string;
  prompts: number;
  threshold: number;
  categories: string[];
  blocking_rule: string | null;
};

const projectMeta: Record<string, { name: string; href: string }> = {
  gather: { name: "Gather", href: "/projects/gather" },
  storyspeak: { name: "StorySpeak", href: "/projects/storyspeak" },
  "smart-personal-agent": {
    name: "Smart Personal Agent",
    href: "/projects/smart-personal-agent",
  },
};

const evalsTree = `${repoUrl}/tree/main/evals`;
const runnerHref = `${repoUrl}/blob/main/evals/run-evals.ts`;

export const metadata = {
  title: "Evals — Roshan Thomas",
  description:
    "Behavioral eval sets (50 prompts each) for three production AI projects, with rubric, runner, and Claude-as-judge harness.",
};

export default function EvalsPage() {
  const projects = summary.projects as ProjectEval[];
  return (
    <>
      <Nav />
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <p className="font-mono text-sm text-accent mb-4">// Eval engineering</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          150 prompts. 3 projects. One judge.
        </h1>
        <p className="mt-5 text-lg text-white/75 max-w-3xl leading-relaxed">
          Anyone can wire up an LLM call. The harder part is knowing — every
          prompt edit, every model bump — whether the system still does the
          right thing. So I wrote 50 behavioral prompts per AI-bearing project in
          this portfolio, plus a rubric, a runner, and a Claude-as-judge harness.
          The eval set itself is the artifact: it&apos;s how I&apos;d ask any of
          these systems to prove its marketing copy.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-white/10 bg-ink-800/50 p-6">
          <div className="grid grid-cols-3 gap-6">
            <Stat label="Prompts authored" value={String(summary.totals.prompts)} />
            <Stat label="Rubrics" value={String(summary.totals.rubrics)} />
            <Stat label="Judge model" value={summary.judge_model} />
          </div>
          <p className="mt-5 text-sm text-white/55">
            <span className="inline-block rounded-md bg-accent-warm/15 text-accent-warm border border-accent-warm/30 px-2 py-0.5 font-mono text-[11px] mr-2">
              Pilot pending
            </span>
            {summary.note}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-6">Per project</h2>
        <div className="space-y-4">
          {projects.map((p) => {
            const meta = projectMeta[p.project];
            return (
              <div
                key={p.project}
                className="rounded-xl border border-white/10 bg-ink-800/40 p-6"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="text-xl font-semibold">
                    <Link href={meta.href} className="hover:text-accent transition">
                      {meta.name}
                    </Link>
                  </h3>
                  <span className="font-mono text-sm text-white/50">
                    {p.prompts} prompts · threshold {p.threshold}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-white/45 mb-2">
                    Categories probed
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.categories.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-md bg-ink-900/60 text-white/80 border border-white/10 font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                {p.blocking_rule && (
                  <p className="mt-4 text-sm text-white/65">
                    <span className="text-accent-mint font-mono text-[11px] uppercase tracking-wider mr-2">
                      Blocking rule
                    </span>
                    {p.blocking_rule}
                  </p>
                )}
                <div className="mt-4 flex gap-4 text-sm">
                  <a
                    href={`${repoUrl}/blob/main/evals/${p.project}.eval.json`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    eval JSON →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Card title="Prompts">
            50 per project, bucketed by category — tool routing, multi-turn,
            refusal, edge cases, safety, project-specific concerns (COPPA gating,
            MCP chaining, trip planning). Negative space is included on purpose.
          </Card>
          <Card title="Rubric">
            Five criteria scored 0–1 each, averaged per prompt. Each project sets
            its own pass threshold (0.75–0.80). StorySpeak has a blocking rule —
            any COPPA miss fails the whole run regardless of average.
          </Card>
          <Card title="Runner">
            <code className="text-xs text-accent">run-evals.ts</code> calls the
            target system (HTTP or fixtures), feeds prompt + expected + actual
            into Claude Sonnet 4.6 as the judge, and writes per-category
            breakdowns + a failure list to{" "}
            <code className="text-xs">evals/results/</code>.
          </Card>
          <Card title="What these prompts hunt for">
            The hard cases each set is designed to catch: a tool 500 that the
            agent papers over with a fabricated success, resume idempotency after
            a mid-session drop, empty/null plan payloads that should be refused.
            The eval set is the spec those behaviors get measured against.
          </Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a
            href={evalsTree}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Browse the eval sets on GitHub →
          </a>
          <a
            href={runnerHref}
            target="_blank"
            rel="noreferrer"
            className="text-white/60 hover:text-white transition"
          >
            run-evals.ts
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-white/55">{label}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-800/40 p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{children}</p>
    </div>
  );
}
