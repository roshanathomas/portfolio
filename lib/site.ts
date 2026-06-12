// Single source of truth for absolute URLs (OG tags, canonical, metadataBase).
// Set NEXT_PUBLIC_SITE_URL in your deploy env to your real domain; the fallback
// is only used for local dev / preview builds.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://roshan-thomas.vercel.app";

// This portfolio's own repo — used for the deep links on the /evals page.
export const repoUrl = "https://github.com/roshanathomas/portfolio";

export const contactEmail = "roshanathomas@outlook.com";
export const linkedInUrl = "https://www.linkedin.com/in/roshanathomas";
