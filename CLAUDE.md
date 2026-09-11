# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing landing page for [pichi-vm](https://github.com/pichi-vm), a static
site built with [Astro 7](https://astro.build) and deployed to GitHub Pages at
<https://pichi-vm.github.io>. No client framework, no runtime — Astro renders
everything to static HTML/CSS at build time. There is no application logic here;
the site is content plus presentation.

## Commands

Requires Node.js 24 (pinned in `.nvmrc`; run `nvm use`). Astro 7 needs ≥22.12.

```sh
npm install           # install dependencies
npm run dev           # dev server at http://localhost:4321
npm run build         # static build into dist/
npm run preview       # serve the built dist/ locally

npm run check         # astro check — type-checks .astro files
npm run format        # Prettier, writing changes
npm run format:check  # Prettier, verify only (what CI runs)
```

CI (`.github/workflows/ci.yml`) runs `format:check`, `check`, and `build` on
every PR and on pushes to `main`. Run all three locally before pushing — a
formatting diff or type error fails CI. Pushing to `main` also triggers
`deploy.yml`, which publishes to GitHub Pages.

## Architecture: content is data, components are presentation, pages compose

Three roles, kept separate so sections are reusable across pages:

1. **Content lives in data, not markup.**
   - **`src/content/landing.yaml`** — all repeated/structured copy: hero
     headline and CTAs, problem cards, "Why pichi" props, terminal lines,
     how-it-works and trust steps, audience columns, comparison table. Inline
     comments document allowed values (e.g. `dot: gray|gold|green`,
     `style: primary|ghost`).
   - **`src/content/prose.yaml`** — the standalone section paragraphs (hero
     sub-line, intros, captions, comparison caveat), one string per snippet.
     Rendered as-is with `set:html`, so inline HTML like `<br>` is live;
     Markdown syntax (`**bold**`) is not processed — use `<strong>` etc. if you
     need emphasis.
   - **`src/content/schema.ts`** — Zod schemas that parse both YAML files at
     build time. Each section's shape is exported on its own (`heroSchema`,
     `problemSchema`, …) and the page schema is composed from them; the file
     also exports the validated, typed `landing` and `prose` objects (and the
     `Landing` / `Prose` types).

2. **Section components are presentation and take content as input — they do
   not read the global `landing`.** Components are **named for the layout they
   render** (`CardGrid`, `FeatureGrid`, `Terminal`, `ComparisonTable`,
   `ColumnLists`, `StepsFanout`, `StepsCaption`), not for their role in this
   page's story. Each takes its data through a generic `content` prop typed as
   the matching per-section type (`content`, typed `CardGridContent`) and its
   prose through a **named slot** (`<slot name="intro" />`). Generic names +
   generic prop are what let a second page render its own content through the
   same component.

3. **Pages are the composition root, and the one place a content role meets a
   layout.** `src/pages/index.astro` imports `landing` + `prose` and maps each
   content slice onto a layout component — data via `content`, prose rendered
   into a named slot with `set:html`:
   ```astro
   <CardGrid content={landing.problem}>
     <p slot="intro" set:html={prose.problemIntro} />
   </CardGrid>
   ```
   The YAML keys stay content-named (`problem`, `why`, `who`) — the page is
   where "the problem section is rendered as a card grid" is decided.

**To change wording, edit the YAML or the `.md` files — not the components.**
The components loop over the data, so appending a `comparison.rows` or
`problem.cards` entry updates the page with zero code changes.

**The schema is a hard gate.** A misspelled `style`, an unknown `dot` color, or
a missing field fails `astro build` with a clear message rather than rendering
a broken section. If you add a new field to `landing.yaml`, add it to
`schema.ts` in the same change or the build breaks.

**`Layout.astro` takes `<head>` metadata as props** (`title`, `description`,
`socialDescription`, `ogImage`), each defaulting to the site-wide value. A page
overrides only what it needs; `index.astro` uses the defaults, `404.astro`
renders `<Layout>` bare.

## Layout

```
public/                static assets served at site root (pichi-logo.png, robots.txt)
src/
  content/
    landing.yaml       ← edit page copy here (cards, table, steps, CTAs, terminal)
    prose.yaml         ← edit section paragraphs here (one string per snippet)
    schema.ts          per-section schemas + composed `landing` + `prose` + types
  styles/global.css    design tokens (:root), reset, shared section/button
                       styles, and .grid / .grid-2 / .grid-3 utilities
  layouts/Layout.astro <head> meta as props (title/description/…) + page shell
  components/*.astro    layout-named sections (CardGrid, Terminal, …); content
                       in via a `content` prop + named slots
  pages/
    index.astro        composition root: maps each content slice onto a layout
    404.astro          branded not-found page
.github/workflows/     ci.yml (PR checks) + deploy.yml (GitHub Pages)
```

Components are named for what they render, so reuse the fitting one before
adding a new layout: `CardGrid` (dot/name/body cards), `FeatureGrid`
(heading/body/note cards), `ColumnLists` (bulleted columns), `Terminal` (mock
terminal), `ComparisonTable`, `StepsFanout` / `StepsCaption` (numbered steps +
a trailer). `Hero`, `Footer`, and the `Steps` / `Ctas` leaves are shared too.

**Adding a section (only when no layout fits):** create
`src/components/Foo.astro` that takes a generic `content` prop typed as
`FooContent` and any prose via a named `<slot>` — do not import `landing` inside
the component. Add a `fooSchema` in `schema.ts`, export `FooContent =
z.infer<typeof fooSchema>`, include it in the page schema, add the data to
`landing.yaml` (and any intro/caption line to `prose.yaml`), then place
`<Foo content={landing.foo}>` in the page, feeding prose into the slot with
`<p slot="intro" set:html={prose.fooIntro} />`.

**Adding a page:** create `src/content/<page>.yaml` and a matching schema in
`schema.ts` composed from the exported section schemas (`heroSchema`,
`problemSchema`, …) — reuse the shapes, don't redefine them. Then add
`src/pages/<page>.astro` that parses its YAML, renders `<Layout title=… >`, and
maps its content slices onto the layout components as `index.astro` does. The
same `CardGrid`, `ComparisonTable`, etc. render any page's content unchanged.

## Conventions

- **Styling:** component-scoped `<style>` blocks for section-specific rules;
  `src/styles/global.css` for design tokens and anything shared. Use the CSS
  variables (`--bg`, `--fg`, `--green`, `--border`, …) — don't hardcode colors.
- **Responsive columns:** wrap cells in `<div class="grid grid-2">` or `grid-3`.
  The mobile breakpoint that collapses them to one column lives once in
  `global.css`, so multi-column sections need no per-component media query.
- **License headers:** source files carry the SPDX pair
  `Advanced Micro Devices, Inc.` / `Apache-2.0`. Match the surrounding style
  when adding files.
- **Punctuation is verbatim.** `prose.yaml` is rendered as-is (not through a
  Markdown processor), and `smartypants: false` (astro.config) covers any `.md`
  that returns — straight quotes and hyphens are intentional; don't "fix" them
  to curly quotes or em-dashes.
- **YAML import** works via the `@rollup/plugin-yaml` Vite plugin wired in
  `astro.config.mjs`.

## Status

The site is under construction: some links (`docs.html`, the live demo) are
placeholders. The `UnderConstructionBanner` component surfaces this on the page.
