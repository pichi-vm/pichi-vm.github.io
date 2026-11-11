# Website contributor guidance

This is Pichi's static Astro site, hosted on GitHub Pages. Use Node.js 24
(`.nvmrc`). The official asciinema player is the only interactive application
component; no application framework or backend is needed.

## Required checks

```sh
npm ci
npm run format:check
npm run check
npm run build
```

Check commit messages with gitlint, including a body explaining the change.
CI runs on PRs and main; `deploy.yml` publishes main. Observe both workflows
through completion after publishing.

## File purposes

- `src/content/landing.yaml`: structured content, links, image parts, status,
  and recording metadata. Edit visible copy here, not in layout components.
- `src/content/prose.yaml`: plain-text section paragraphs.
- `src/content/schema.ts`: Zod validation and exported component content types.
- `src/pages/index.astro`: composition root; maps data and prose to components.
- `src/components/`: presentation-only components receiving typed props and
  named slots. Do not import global landing content into a component.
- `src/layouts/Layout.astro`: document, metadata, global styles, skip link.
- `src/styles/global.css`: design tokens, typography, shared layout and controls.
  Keep section-specific styles scoped to their component.
- `src/pages/404.astro`: the matching not-found experience.
- `public/recordings/codex.cast`: the public terminal recording, never the
  credential-bearing demo source or built image.

## Design and content

The page progresses from the value proposition to the demo, image anatomy,
project status, and next steps. Each section should add information. Avoid
repeated feature pitches, speculative benchmarks, unsupported competitor
comparisons, and disabled placeholder links.

Preserve the armadillo branding and the paper/ink palette. Maintain readable
contrast, keyboard access, visible focus, responsive layouts, and reduced-motion
behavior. The terminal is intentionally dark. It autoplays when visible and
loops unless reduced motion is requested; preserve manual controls.

Use SPDX headers for new source files. Never remove copyright attribution.
Keep dependencies minimal and follow the workspace approval policy for additions.

## Claims

Check claims against current implementation, not design aspirations.
Attestation and confidential computing are planned. Block integrity, source
annotations, publisher authenticity, and protection from a malicious host are
different properties; do not conflate them. Preserve real timing in recordings.
