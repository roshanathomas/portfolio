import type { Screenshot } from "@/lib/projects";

export function ScreenshotGallery({ shots }: { shots: Screenshot[] }) {
  if (!shots.length) return null;
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {shots.map((s) => (
        <figure key={s.src} className="group">
          <div
            className={
              s.frame === "phone"
                ? "mx-auto w-full max-w-[260px] rounded-[36px] border-4 border-ink-700 bg-ink-900 shadow-2xl overflow-hidden"
                : "rounded-xl border border-white/10 bg-ink-900 shadow-2xl overflow-hidden"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.alt}
              loading="lazy"
              className="block w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <figcaption className="mt-3 text-sm text-white/60 leading-relaxed">
            {s.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function HeroShot({ shot }: { shot: Screenshot }) {
  return (
    <div
      className={
        shot.frame === "phone"
          ? "mx-auto w-full max-w-[220px] rounded-[28px] border-[3px] border-ink-700 bg-ink-900 shadow-xl overflow-hidden"
          : "rounded-lg border border-white/10 bg-ink-900 shadow-xl overflow-hidden"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shot.src} alt={shot.alt} loading="lazy" className="block w-full h-auto" />
    </div>
  );
}
