import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import summary from "@/evals/results/summary.json";

type ProjectResult = {
  project: string;
  prompts: number;
  pass_rate: number;
  threshold: number;
  weakest_category: string;
  filed_bugs: string[];
  blocking_failures?: number;
};

const projectMeta: Record<string, { name: string; href: string; resultHref: string }> = {
  gather: {
    name: "Gather",
    href: "/projects/gather",
    resultHref: "https://github.com/roshanathomas/showcase/blob/main/evals/results/gather-pilot.md",
  },
  storyspeak: {
    name: "StorySpeak",
    href: "/projects/storyspeak",
    resultHref:
      "https://github.com/roshanathomas/showcase/blob/main/evals/results/storyspeak-pilot.md",
  },
  "smart-personal-agent": {
    name: "Smart Personal Agent",
    href: "/projects/smart-personal-agent",
    resultHref:
      "https://github.com/roshanathomas/showcase/blob/main/evals/results/smart-personal-agent-pilot.md",
  },
};

export const metadata = {
  title: "Evals — Roshan Thomas",
  description:
    "Behavioral eval sets (50 prompts each) for three production AI projects, with rubric, runner, and pilot results.",
};

export default function EvalsPage() {
  const projects = summary.projects as ProjectResult[];
  return (
    <>
      <Nav />
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <p className="font-mono text-sm text-accent mb-4">// Eval engineering</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          150 prompts. 3 projects. One judge.
        </h1>
        <p className="mt-5 text-lg text-white/75 max-w-3xl leading-relaxed">
          Anyone can wire up an LLM call. The harder part is knowing — every prompt
          edit, every model bump — whether the system still does the right thing. So I
          wrote 50 behavioral prompts per AI-bearing project in this portfolio, plus a
          rubric, a runner, and a Claude-as-judge harness. The eval set itself is the
          artifact: it&apos;s how I&apos;d ask any of these systems to prove its
          marketing copy.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-white/10 bg-ink-800/50 p-6">
          <div className="grid grid-cols-3 gap-6">
            <Stat label="Prompts" value={String(summary.totals.prompts)} />
            <Stat
              label="Pass rate"
              value={`${(summary.totals.pass_rate * 100).toFixed(0)}%`}
            />
            <Stat label="Judge model" value={summary.judge_model} />
          </div>
          <p className="mt-5 text-sm text-white/55">
            Pilot run · {summary.run_date} · scored against staging endpoints (Gather,
            SPA) and STT fixtures (StorySpeak).
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
                    {Math.round(p.pass_rate * p.prompts)}/{p.prompts} pass · threshold{" "}
                    {p.threshold}
                  </span>
                </div>
                <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
                  <Field
                    label="Pass rate"
                    value={`${(p.pass_rate * 100).toFixed(1)}%`}
                  />
                  <Field label="Weakest area" value={p.weakest_category} />
                  <Field
                    label="Bugs filed from this run"
                    value={p.filed_bugs.join(", ")}
                  />
                </div>
                {p.blocking_failures !== undefined && (
                  <p className="mt-3 text-sm text-white/65">
                    Blocking failures: <strong>{p.blocking_failures}</strong>
                    {p.project === "storyspeak" && p.blocking_failures === 0 && (
                      <> — every COPPA-gating prompt behaved correctly.</>
                    )}
                  </p>
                )}
                <div className="mt-4 flex gap-3 text-sm">
                  <a
                    href={meta.resultHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    Full results report →
                  </a>
                  <a
                    href={`https://github.com/roshanathomas/showcase/blob/main/evals/${p.project}.eval.json`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white transition"
                  >
                    eval JSON
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
            50 per project, bucketed by category — tool routing, multi-turn, refusal,
            edge cases, safety, project-specific concerns (COPPA gating, MCP chaining,
            trip planning). Negative space is included on purpose.
          </Card>
          <Card title="Rubric">
            Five criteria scored 0–1 each, averaged per prompt. Each project sets its
            own pass threshold (0.75–0.80). StorySpeak has blocking failures — any
            COPPA miss fails the whole run.
          </Card>
          <Card title="Runner">
            <code className="text-xs text-accent">run-evals.ts</code> calls the target
            system (HTTP or fixtures), feeds prompt + expected + actual into Claude
            Sonnet 4.6 as the judge, and writes per-category breakdowns + a failure
            list to <code className="text-xs">evals/results/</code>.
          </Card>
          <Card title="Findings travel">
            Failures from the pilot run became real bug filings — A38 (SPA fabricating
            a successful tool write on a 500), S44 (StorySpeak resume idempotency), and
            G40 (Gather accepting empty plan payloads). The eval set is the spec the
            fixes get measured against.
          </Card>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-white/45">{label}</div>
      <div className="mt-1 text-white/85">{value}</div>
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
