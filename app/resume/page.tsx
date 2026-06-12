import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PrintButton } from "@/components/PrintButton";
import { projects } from "@/lib/projects";
import { contactEmail, linkedInUrl, siteUrl } from "@/lib/site";

export const metadata = {
  title: "Resume — Roshan Thomas",
  description:
    "One-page resume for Roshan Thomas, AI Engineer. Print or save as PDF.",
};

// Editable header bits. Experience / education are intentionally omitted rather
// than fabricated — add a section here when you want them on the one-pager.
const summary =
  "AI Engineer who ships LLMs into real products, not demos. I build tool-using agents (Model Context Protocol), multimodal pipelines (STT + LLM + TTS), and full-stack platforms on Spring AI + Java 21 — with the production-grade parts most LLM projects skip: feature flags, entitlement gating, consent flows, graceful failure handling, and behavioral evals.";

const competencies = [
  "Agent & tool orchestration (MCP, Spring AI function-calling)",
  "Multimodal AI (Gemini STT/LLM + GCP TTS)",
  "Production LLM backends (Java 21, Spring Boot, feature flags)",
  "Eval engineering (Claude-as-judge, behavioral rubrics)",
  "AI safety & compliance (COPPA consent, server-side gating)",
  "Full-stack (Spring Boot + PostgreSQL + Flyway; Expo / React Native; Cloud Run / Vercel)",
];

export default function ResumePage() {
  return (
    <>
      <Nav />
      <main className="print-sheet max-w-3xl mx-auto px-6 pt-12 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Roshan Thomas
            </h1>
            <p className="mt-1 text-lg text-accent print-accent font-medium">
              AI Engineer
            </p>
          </div>
          <PrintButton />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/70 print-muted">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer">
            linkedin.com/in/roshanathomas
          </a>
          <a href={siteUrl} target="_blank" rel="noreferrer">
            {siteUrl.replace(/^https?:\/\//, "")}
          </a>
        </div>

        {/* Summary */}
        <Section title="Summary">
          <p className="text-sm text-white/80 print-muted leading-relaxed">
            {summary}
          </p>
        </Section>

        {/* Core competencies */}
        <Section title="Core competencies">
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/80 print-muted">
            {competencies.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-accent print-accent shrink-0">▸</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Selected projects */}
        <Section title="Selected projects">
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.slug} className="print-card">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="font-semibold text-white print-accent">
                    {p.name}
                  </h3>
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent print-muted"
                    >
                      {p.liveUrl.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/75 print-muted leading-snug">
                  {p.tagline}
                </p>
                <ul className="mt-2 space-y-1">
                  {p.impact.slice(0, 2).map((i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-white/70 print-muted leading-snug"
                    >
                      <span className="text-accent print-accent shrink-0">▸</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-white/45 print-muted font-mono">
                  {p.stack.slice(0, 7).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <p className="mt-10 text-xs text-white/40 print-muted no-print">
          Tip: this page prints to a clean one-pager — use “Download PDF” or
          Cmd/Ctrl-P.
        </p>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-mono uppercase tracking-widest text-accent print-accent border-b border-white/10 print-card pb-1 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
