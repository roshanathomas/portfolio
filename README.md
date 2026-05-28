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

## Structure

```
showcase/
  app/
    page.tsx              — home (hero + work grid + skills + about)
    projects/[slug]/      — per-project detail pages
    layout.tsx, globals.css
  components/             — Nav, Footer, ProjectCard
  lib/projects.ts         — project data (edit here)
  tailwind.config.ts
```
