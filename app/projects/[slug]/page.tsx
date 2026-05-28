import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />

      {/* Hero */}
      <article className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <Link
          href="/#work"
          className="text-sm text-white/50 hover:text-white transition"
        >
          ← All work
        </Link>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          {project.name}
        </h1>
        <p className="mt-4 text-xl text-white/85 leading-relaxed font-medium">
          {project.pitch}
        </p>

        {/* Metric strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3"
            >
              <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {m.value}
              </div>
              <div className="mt-1 text-[11px] text-white/55 leading-tight">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Capability + ask-me-about pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.capabilities.map((c) => (
            <span
              key={c}
              className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/30"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:opacity-90 transition"
            >
              Live demo →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm hover:border-white/40 transition"
            >
              <GitHubIcon /> View code
            </a>
          )}
        </div>

        {/* Ask me about */}
        <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
          <div className="text-[11px] font-mono text-accent uppercase tracking-wider mb-2">
            Ask me about
          </div>
          <div className="flex flex-wrap gap-2">
            {project.askMeAbout.map((a) => (
              <span
                key={a}
                className="text-xs px-2.5 py-1 rounded-md bg-ink-900/60 text-white/85 border border-white/10"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Video embed */}
      {project.embedUrl && (
        <article className="max-w-4xl mx-auto px-6 py-8">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-ink-900">
            <iframe
              src={project.embedUrl}
              title={`${project.name} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </article>
      )}

      {project.screenshots.length > 0 && (
        <article className="max-w-6xl mx-auto px-6 py-10">
          <ScreenshotGallery shots={project.screenshots} />
        </article>
      )}

      <Section title="The problem" body={project.problem} />
      <Section title="The solution" body={project.solution} />

      <article className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Business impact</h2>
        <ul className="space-y-3">
          {project.impact.map((i) => (
            <li key={i} className="flex gap-3 text-white/80 leading-relaxed">
              <span className="text-accent shrink-0">▸</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">AI deep dive</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {project.aiHighlights.map((h) => (
            <div
              key={h.title}
              className="rounded-xl border border-white/10 bg-ink-800/60 p-5"
            >
              <h3 className="font-semibold text-white">{h.title}</h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{h.detail}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Trade-offs */}
      <article className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Trade-offs I made</h2>
        <p className="text-white/55 text-sm mb-6">
          What I chose, what I rejected, and why — the questions a senior interviewer
          will ask anyway.
        </p>
        <div className="space-y-4">
          {project.tradeoffs.map((t) => (
            <div
              key={t.chose}
              className="rounded-xl border border-white/10 bg-ink-800/60 p-5"
            >
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[11px] font-mono text-accent-mint uppercase tracking-wider mb-1">
                    Chose
                  </div>
                  <div className="text-white font-semibold">{t.chose}</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
                    Rejected
                  </div>
                  <div className="text-white/70">{t.rejected}</div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3">
                {t.why}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Failure modes */}
      <article className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          How it fails (and how I handle it)
        </h2>
        <p className="text-white/55 text-sm mb-6">
          Production AI is mostly failure-handling. Here are the real ones.
        </p>
        <div className="space-y-3">
          {project.failureModes.map((f) => (
            <div
              key={f.when}
              className="rounded-xl border border-white/10 bg-ink-800/60 p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-accent-warm text-lg leading-none">⚠</span>
                <div className="flex-1">
                  <div className="text-white font-medium">{f.when}</div>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">
                    <span className="text-accent-mint font-mono text-[11px] uppercase tracking-wider mr-2">
                      Handled
                    </span>
                    {f.handled}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <Section title="Architecture" body={project.architecture} mono />

      {/* Start reading here */}
      {project.startHere.length > 0 && (
        <article className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Start reading here
          </h2>
          <p className="text-white/55 text-sm mb-6">
            If you only open three files, open these.
          </p>
          <div className="space-y-3">
            {project.startHere.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-ink-800/60 p-5"
              >
                <div className="font-mono text-sm text-accent">{s.label}</div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </article>
      )}

      <article className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="text-sm px-3 py-1.5 rounded-md bg-ink-700/70 border border-white/10 text-white/80 font-mono"
            >
              {s}
            </span>
          ))}
        </div>
      </article>

      <Footer />
    </>
  );
}

function Section({
  title,
  body,
  mono = false,
}: {
  title: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      <p
        className={`text-white/75 leading-relaxed ${
          mono
            ? "font-mono text-sm bg-ink-800/60 border border-white/10 rounded-xl p-5"
            : "text-lg"
        }`}
      >
        {body}
      </p>
    </article>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
