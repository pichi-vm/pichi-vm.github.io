# Pichi website

The Pichi landing page, built with Astro and deployed to GitHub Pages.
The page introduces the workflow, plays a real terminal demo, explains the
image format, and separates implemented capabilities from planned work.

## Develop

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
npm run format:check
npm run check
npm run build
```

## Content and presentation

- `src/content/landing.yaml` holds structured content and links.
- `src/content/prose.yaml` holds section paragraphs.
- `src/content/schema.ts` validates both at build time.
- `src/pages/index.astro` composes the page; components receive data and slots.
- `src/styles/global.css` contains shared tokens and layout rules. Components
  own their section styles.
- `public/recordings/codex.cast` is the self-hosted asciinema demo. Playback
  starts when it enters view and loops, except with reduced motion enabled.
  The original timeline is preserved; the player supports pause, seek,
  chapter markers, and fullscreen.

Keep claims grounded in implemented behavior. Runtime attestation and
confidential-computing support are planned. Do not present boot targets as
measurements, use fictional images as runnable examples, or infer authenticity
from integrity checks.

## Deployment

Pushes to `main` run CI and the GitHub Pages deployment workflow. Run formatting,
Astro checks, and the build locally first; verify CI and deployment afterward.
