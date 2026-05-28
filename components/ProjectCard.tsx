import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const hero = project.screenshots[0];
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl border border-white/10 bg-ink-800/60 overflow-hidden hover:border-accent/60 hover:bg-ink-700/60 transition"
    >
      {hero && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt={hero.alt}
            loading="lazy"
            className={
              hero.frame === "phone"
                ? "h-full w-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-500"
                : "w-full h-auto rounded-md shadow-lg group-hover:scale-105 transition-transform duration-500"
            }
          />
        </div>
      )}
      <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-accent transition">
            {project.name}
          </h3>
          <p className="mt-2 text-white/70 leading-relaxed">{project.tagline}</p>
        </div>
        {project.hero && (
          <span className="shrink-0 text-xs font-mono px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
            featured
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.capabilities.map((cap) => (
          <span
            key={cap}
            className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10"
          >
            {cap}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-white/40 font-mono">
          {project.stack.slice(0, 3).join(" · ")}
          {project.stack.length > 3 && " …"}
        </span>
        <span className="text-accent group-hover:translate-x-1 transition">→</span>
      </div>
      </div>
    </Link>
  );
}
