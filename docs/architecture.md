<!--
SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
SPDX-License-Identifier: Apache-2.0
-->

# Site architecture

How the content, schema, components, and pages fit together — and how to change
each without touching the others. This is the "why it's shaped this way" companion
to the file-by-file summary in [`../CLAUDE.md`](../CLAUDE.md).

## The one idea

**Content is data, components are presentation, and the page is the only place the
two meet.** Keep those three roles in separate files and a section written for this
page can be reused on the next one unchanged.

```
 content (YAML)          schema (Zod)             components (.astro)        page (.astro)
 ─────────────           ────────────             ──────────────────        ────────────
 landing.yaml   ──parse──►  landing  ─────typed props (content=…)──────►  index.astro
 prose.yaml     ──parse──►  prose    ─────named slots  (slot=…)  ──────►  composes them
                            (build-time gate)         CardGrid, Terminal…   into <Layout>
```

Nothing flows the other way: a component never reaches back for `landing`, and the
YAML never names a component. The page is the hinge.

## The four roles

### 1. Content lives in data, not markup

Two files under `src/content/`, split by _shape_, not by section:

- **`landing.yaml`** — every **repeated or structured** item: the CTA buttons, the
  problem cards, the "why" props, the terminal lines, the how-it-works / trust
  steps, the audience columns, the comparison table. Anything the components
  `.map()` over lives here. Inline comments document the allowed values
  (`dot: gray|gold|green`, `style: primary|ghost`).

- **`prose.yaml`** — the **standalone paragraphs**: a section's intro line, a
  caption, the hero sub-line. One string per snippet. These are rendered **as-is
  with `set:html`** (see [Prose is verbatim](#prose-is-verbatim-html-not-markdown)).

The dividing line: _would you ever have two of it?_ Two cards, yes → `landing.yaml`.
A single intro sentence under a heading → `prose.yaml`.

### 2. The schema is the build-time gate

`src/content/schema.ts` parses both YAML files through [Zod](https://zod.dev)
shapes. A misspelled `style`, an unknown `dot`, or a missing field **fails
`astro build` with a clear message** instead of rendering a broken section.

Its structure matters for reuse:

- **One schema per section, each exported on its own** — `heroSchema`,
  `problemSchema`, `whySchema`, … A couple of primitives (`ctaSchema`,
  `stepSchema`) are shared by several sections.
- **The page schema is _composed_ from those**, not redefined:
  ```ts
  const landingSchema = z.object({
    ctas: z.array(ctaSchema),
    hero: heroSchema,
    problem: problemSchema,
    // …
  });
  ```
- **Each section also exports a type named for the component that renders it**:
  ```ts
  export type CardGridContent = z.infer<typeof problemSchema>;
  export type TerminalContent = z.infer<typeof tryItSchema>;
  ```
  The YAML key stays content-named (`problem`), the type is layout-named
  (`CardGridContent`). That rename is deliberate — it's what lets `CardGrid` take
  "any card-grid content" rather than "the landing page's problem section."
- **The bottom of the file exports the validated, typed values** the page imports:
  ```ts
  export const landing: Landing = landingSchema.parse(rawLanding);
  export const prose: Prose = proseSchema.parse(rawProse);
  ```

If you add a field to the YAML, add it to the schema **in the same change** — the
build breaks otherwise, by design.

### 3. Components are presentation and take content as input

Every section component under `src/components/`:

- **Is named for the layout it renders** — `CardGrid`, `FeatureGrid`, `Terminal`,
  `ComparisonTable`, `ColumnLists`, `StepsFanout`, `StepsCaption` — **not** for its
  role in this page's story ("problem", "why", "how it works"). A card grid is a
  card grid regardless of what it's selling.
- **Takes its structured data through one generic `content` prop**, typed as the
  matching per-section type:
  ```astro
  ---
  import type { CardGridContent } from "../content/schema";
  interface Props { content: CardGridContent; }
  const { content } = Astro.props;
  ---
  <section class="section">
    <h2 class="h">{content.heading}</h2>
    <div class="section-desc"><slot name="intro" /></div>
    <div class="grid grid-3">
      {content.cards.map((card) => ( /* … */ ))}
    </div>
  </section>
  ```
- **Takes its prose through a named `<slot>`** (`<slot name="intro" />`,
  `<slot name="caption" />`, `<slot name="sub" />`) so the _page_ owns the wording,
  not the component.
- **Never imports `landing` or `prose`.** Generic name + generic prop + slotted
  prose are exactly what let a second page feed its own content through the same
  component.

Two components are shared **leaves** rather than sections — `Steps` (the 3-up
numbered row inside both `StepsFanout` and `StepsCaption`) and `Ctas` (the button
row inside both `Hero` and `Footer`). `Hero`, `Footer`, and
`UnderConstructionBanner` are page furniture.

### 4. The page is the composition root

`src/pages/index.astro` is the **one file that imports `landing` + `prose` and
maps each content slice onto a layout component** — data via `content`, prose
rendered into a named slot with `set:html`:

```astro
---
import { landing, prose } from "../content/schema";
import CardGrid from "../components/CardGrid.astro";
// …
---

<Layout>
  <Hero hero={landing.hero} ctas={landing.ctas}>
    <p slot="sub" set:html={prose.heroSub} />
  </Hero>
  <CardGrid content={landing.problem}>
    <p slot="intro" set:html={prose.problemIntro} />
  </CardGrid>
  <!-- FeatureGrid, Terminal, StepsFanout, StepsCaption, ColumnLists,
       ComparisonTable, Footer … -->
</Layout>
```

This is where — and only where — "the **problem** content is rendered as a
**CardGrid**, with the **problemIntro** prose in its intro slot" is decided. The
YAML never knew it would become a card grid; the component never knew it would
show the problem section. The page joins them.

## Following one section end to end

Take the hero sub-line, `heroSub`:

```
prose.yaml                schema.ts                 index.astro                Hero.astro
──────────                ─────────                 ───────────                ──────────
heroSub: >-       ─parse─►  proseSchema     ─read─►  <p slot="sub"      ─fill─►  <slot
  One portable…             .heroSub                   set:html=                   name="sub" />
                            (must exist)               {prose.heroSub} />
```

The link is **name matching**, not a reference: `heroSub` in the YAML → the
`heroSub` key required by `proseSchema` → `prose.heroSub` in the page → the page's
choice to drop it into Hero's `sub` slot. Rename it and you touch three files
(`prose.yaml`, `proseSchema`, `index.astro`) — but a typo can't slip through,
because `proseSchema.parse()` throws at build if `heroSub` goes missing.

Structured data (`landing.problem` → `CardGrid`) follows the identical path, minus
the slot: the page passes it as `content={landing.problem}` and the component maps
over `content.cards`.

## Prose is verbatim HTML, not Markdown

`prose.yaml` values are rendered with `set:html` and **not** run through a Markdown
processor. Consequences:

- Inline HTML is **live**: `<br>` breaks a line, `<strong>` bolds. Use these when
  you need emphasis.
- Markdown syntax is **inert**: `**bold**` renders as literal asterisks.
- **Punctuation is intentional.** Straight quotes, hyphens, and a bare `*`
  (the comparison-table footnote marker) are kept as written — don't "fix" them to
  curly quotes or em-dashes.

## The `<head>` is props on `Layout`

`Layout.astro` takes `title`, `description`, `socialDescription`, and `ogImage` as
props, **each defaulting to the site-wide value**. A page overrides only what it
needs:

- `index.astro` renders `<Layout>` with no props — pure site defaults.
- `404.astro` renders `<Layout>` bare too.
- A new page with its own social card passes `<Layout title="…" ogImage="…">`.

Canonical and Open Graph URLs are derived from `site` in `astro.config.mjs`, so
they're correct per-page for free.

## Styling

- **Design tokens and shared rules** live in `src/styles/global.css`:
  the `:root` CSS variables (`--bg`, `--fg`, `--green`, `--border`, …), the reset,
  the shared `.section` / button styles, and the `.grid` / `.grid-2` / `.grid-3`
  utilities. **Use the variables — don't hardcode colors.**
- **Section-specific rules** live in a component-scoped `<style>` block inside that
  component's `.astro` file.
- **Responsive columns** come free: wrap cells in `<div class="grid grid-2">` (or
  `grid-3`) and the single mobile breakpoint in `global.css` collapses them to one
  column. Multi-column sections need no per-component media query.

## How to extend

### Change wording

Edit `landing.yaml` (structured items) or `prose.yaml` (paragraphs). **Don't touch
components.** Appending a `comparison.rows` or `problem.cards` entry updates the
page with zero code changes — the components loop over the data.

### Add a section — reuse a layout first

Before writing a component, check whether an existing one fits; they're named for
what they render:

| Component         | Renders                                            |
| ----------------- | -------------------------------------------------- |
| `CardGrid`        | dot / name / body cards                            |
| `FeatureGrid`     | heading / body / optional-note cards               |
| `ColumnLists`     | bulleted columns                                   |
| `Terminal`        | a mock terminal window                             |
| `ComparisonTable` | a per-column comparison table (tint a winning col) |
| `StepsFanout`     | numbered steps + a fan-out diagram                 |
| `StepsCaption`    | numbered steps + a trailing caption                |

If one fits, you only add **data**: a new key in `landing.yaml`, its shape in the
page schema (reuse the existing section schema), any intro/caption in `prose.yaml`,
and a line in `index.astro`.

### Add a section — new layout (only when none fits)

1. **Component** — `src/components/Foo.astro` taking a generic `content` prop typed
   `FooContent` and any prose via a named `<slot>`. Do **not** import `landing`
   inside it.
2. **Schema** — add `fooSchema` in `schema.ts`, `export type FooContent =
z.infer<typeof fooSchema>`, and include `foo: fooSchema` in the page schema.
3. **Data** — add the `foo:` block to `landing.yaml` (and any intro line to
   `prose.yaml`).
4. **Page** — place it in `index.astro`:
   ```astro
   <Foo content={landing.foo}>
     <p slot="intro" set:html={prose.fooIntro} />
   </Foo>
   ```

Steps 1–3 in the **same change**, or the build breaks at the schema gate.

### Add a page

1. `src/content/<page>.yaml` for its content.
2. A matching schema in `schema.ts`, **composed from the exported section schemas**
   (`heroSchema`, `problemSchema`, …) — reuse the shapes, don't redefine them.
3. `src/pages/<page>.astro` that parses its YAML, renders `<Layout title=… >`, and
   maps its content slices onto the same layout components exactly as
   `index.astro` does.

The same `CardGrid`, `ComparisonTable`, etc. render any page's content unchanged —
that reuse is the whole point of keeping content, schema, components, and page in
separate files.

## Why this shape (the tradeoff)

The cost is **indirection**: one section's wording is spread across `landing.yaml`
/ `prose.yaml`, its shape across `schema.ts`, its markup across a component, and
its placement across `index.astro`. For a single page that's more files than a flat
`index.astro` with the copy inlined.

The payoff shows up on the **second** page and on **every edit after the first**:
copy changes never risk the markup, the schema catches typos before they ship, and
a new page reuses the existing sections instead of re-implementing them. The split
is an investment in reuse and safe edits, paid up front.
