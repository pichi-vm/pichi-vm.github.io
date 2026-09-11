# pichi-vm.github.io

Landing page for [pichi-vm](https://github.com/pichi-vm), built with [Astro](https://astro.build).

> 🚧 **Under construction** — the site is a work in progress. Some links
> (`docs.html`, the live demo) are placeholders and not yet wired up.

## Develop

Requires Node.js (v20+).

```sh
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:4321
npm run build   # produce the static site in dist/
npm run preview # serve the built dist/ locally
```

## Structure

```
public/            static assets served at the site root (e.g. /pichi-logo.png)
src/
  layouts/         Layout.astro — <head> meta + global/shared CSS
  components/      one .astro component per page section (scoped styles)
  pages/           index.astro — composes the components into the landing page
.github/workflows/ deploy.yml — build + publish to GitHub Pages
```

To edit page content, find the relevant component under `src/components/`
(e.g. `Hero.astro`, `Comparison.astro`) and edit its markup.

## Deploy

Pushing to `main` triggers the **Deploy to GitHub Pages** GitHub Actions
workflow, which builds the site and publishes it to
<https://pichi-vm.github.io>.

**One-time setup:** in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions** (not "Deploy from a branch"). Astro needs a build step, so
the branch-deploy mode won't work.
