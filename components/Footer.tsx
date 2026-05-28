export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-white/50">
        <div>© {new Date().getFullYear()} Roshan Thomas. Built with Next.js + Tailwind.</div>
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/roshanathomas"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>
          <a href="mailto:" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
