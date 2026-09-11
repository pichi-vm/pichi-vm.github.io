# pichi-vm.github.io

Landing page for [pichi-vm](https://github.com/pichi-vm), built with [Astro](https://astro.build).

> 🚧 **Under construction** — the site is a work in progress. Some links
> (`docs.html`, the live demo) are placeholders and not yet wired up.

## Develop

Requires Node.js 24 (pinned in `.nvmrc`; run `nvm use` to match). Astro 7
needs ≥22.12.

```sh
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:4321
npm run build     # produce the static site in dist/
npm run preview   # serve the built dist/ locally

npm run check     # type-check .astro files (astro check)
npm run format    # auto-format with Prettier
npm run format:check  # verify formatting without writing (what CI runs)
```

CI (`.github/workflows/ci.yml`) runs `format:check`, `check`, and `build` on
every pull request, so run those locally before pushing.

## Editing content

**You almost never need to touch the components or CSS to change the words.**
The copy lives in two places:

- **`src/content/landing.yaml`** — every repeated item: the hero headline and
  CTA buttons, the problem cards, the "Why pichi" props, the terminal lines,
  the how-it-works / trust steps, the audience lists, and the comparison table
  (columns + rows). Edit the text in place. Comments in the file explain each
  field (e.g. `dot: gray|gold|green`, `style: primary|ghost`).
- **`src/content/prose/*.md`** — the standalone paragraphs that head a section
  (hero sub-line, section intros, captions, the comparison caveat). These are
  Markdown, so you can add `**bold**` or `[links](…)` and they render as HTML.

Add a comparison row by appending to `comparison.rows`; add a card by appending
to `problem.cards`; the components loop over the data, so the page updates with
no code changes.

The YAML is validated against a schema (`src/content/schema.ts`) at build time,
so a bad edit — a misspelled `style`, an unknown `dot` color, a missing field —
**fails the build with a clear message** instead of silently rendering a broken
section. If you add a new field, add it to the schema too.

## Structure

```
public/            static assets served at the site root (pichi-logo.png,
                   robots.txt)
src/
  content/
    landing.yaml   ← edit page copy here (cards, table, steps, CTAs, terminal)
    prose/*.md     ← edit section paragraphs here (Markdown)
    schema.ts      validates landing.yaml + exports the typed `landing` object
  styles/
    global.css     design tokens (:root), reset, shared section/button styles,
                   and the .grid / .grid-2 / .grid-3 responsive utilities
  layouts/         Layout.astro — <head> meta (title, canonical, social) + shell
  components/      one .astro component per section; render from content/
  pages/           index.astro composes the sections; 404.astro is the not-found
.github/workflows/ ci.yml (PR checks) + deploy.yml (publish to GitHub Pages)
```

The components under `src/components/` are presentation only — reach for them
when you need to change _layout or styling_, not wording. For a multi-column
section, put the cells in a `<div class="grid grid-2">` (or `grid-3`); the
mobile breakpoint that collapses them to one column lives in `global.css`, so
you never touch a shared media query.

## Deploy

Pushing to `main` triggers the **Deploy to GitHub Pages** GitHub Actions
workflow, which builds the site and publishes it to
<https://pichi-vm.github.io>.

**One-time setup:** in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions** (not "Deploy from a branch"). Astro needs a build step, so
the branch-deploy mode won't work.
