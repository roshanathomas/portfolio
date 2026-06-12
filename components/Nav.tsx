import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-ink-900/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="text-accent">/</span>roshan.thomas
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <Link href="/#work" className="hover:text-white transition">
            Work
          </Link>
          <Link href="/#skills" className="hover:text-white transition">
            Skills
          </Link>
          <Link href="/evals" className="hover:text-white transition">
            Evals
          </Link>
          <Link href="/resume" className="hover:text-white transition">
            Resume
          </Link>
          <Link href="/#about" className="hover:text-white transition">
            About
          </Link>
          <a
            href="https://www.linkedin.com/in/roshanathomas"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-full bg-accent text-white hover:opacity-90 transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </nav>
  );
}
