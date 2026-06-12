# Roshan Thomas — AI Portfolio

Next.js 15 + Tailwind portfolio showcasing AI engineering work.

## Run locally

```powershell
npm install
npm run dev
# http://localhost:3000
```

## Deploy to Vercel

```powershell
npx vercel
# or push to a GitHub repo and import on vercel.com
```

## Add / edit projects

All project content lives in [`lib/projects.ts`](lib/projects.ts) — one entry per project. Each renders a card on the home page and a full page at `/projects/<slug>`.

## Deployed URL

Set `NEXT_PUBLIC_SITE_URL` in the deploy environment (Vercel project settings)
to the real domain — it drives canonical tags, Open Graph URLs, and the social
preview image at `/opengraph-image`. The fallback in [`lib/site.ts`](lib/site.ts)
is only for local/preview builds.

## Structure

```
portfolio/
  app/
    page.tsx              — home (hero + work grid + skills + about)
    projects/[slug]/      — per-project detail pages
    evals/                — eval-engineering page
    resume/               — printable one-pager (Cmd/Ctrl-P → PDF)
    opengraph-image.tsx   — generated social preview card
    layout.tsx, globals.css
  components/             — Nav, Footer, ProjectCard, PrintButton
  lib/projects.ts         — project data (edit here)
  lib/site.ts             — site URL + contact constants
  evals/                  — 150-prompt eval sets, rubric, runner
  tailwind.config.ts
```
