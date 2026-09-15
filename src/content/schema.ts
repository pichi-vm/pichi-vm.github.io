// SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
// SPDX-License-Identifier: Apache-2.0
//
// Content schemas for the site. Raw YAML is parsed through these Zod shapes at
// build time, so a bad edit — a misspelled `style`, an unknown `dot` color, a
// missing field — fails `astro build` with a clear message instead of silently
// rendering a broken component. Components import the validated, typed content
// and get full autocomplete/types for free.
//
// Each section's shape is exported on its own so a NEW page can compose just
// the pieces it reuses (see the bottom of this file for how `landing` is built
// from them). To add a page: assemble a `z.object({ … })` from these section
// schemas, then `parse` your page's YAML the same way `landing` does below.
import { z } from "astro/zod";
import rawLanding from "./landing.yaml";
import rawProse from "./prose.yaml";
import rawSecurity from "./security.yaml";
import rawSecurityProse from "./security-prose.yaml";

// ── Reusable primitives ───────────────────────────────

// A call-to-action button, reused in the hero and footer.
export const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  style: z.enum(["primary", "ghost"]),
});

// One numbered step in a 3-up row (How it works / Build on trust).
export const stepSchema = z.object({
  n: z.string(),
  heading: z.string(),
  body: z.string(),
});

// ── Reusable section schemas ──────────────────────────
// One per <section> component under src/components/. Pair each with its
// component when building a page.

export const heroSchema = z.object({
  logoAlt: z.string(),
  eyebrow: z.string(),
  // Rendered with set:html so an inline <br> in the headline works.
  title: z.string(),
});

export const problemSchema = z.object({
  heading: z.string(),
  cards: z.array(
    z.object({
      dot: z.enum(["gray", "gold", "green"]),
      name: z.string(),
      // Highlights the winning card.
      win: z.boolean().optional(),
      body: z.string(),
    }),
  ),
});

export const whySchema = z.object({
  title: z.string(),
  props: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
      // Optional muted footnote under the body.
      note: z.string().optional(),
    }),
  ),
});

// One line of the mock terminal: a `$` command, its output, or a blank gap.
export const terminalLineSchema = z.object({
  kind: z.enum(["cmd", "out", "gap"]),
  // Absent for kind: "gap" (renders as a blank line).
  text: z.string().optional(),
});

export const tryItSchema = z.object({
  title: z.string(),
  terminal: z.array(terminalLineSchema),
});

// The merged walkthrough: numbered steps beside the live terminal that runs
// them. Steps and commands are one slice so the page wires a single section.
export const howItWorksSchema = z.object({
  heading: z.string(),
  steps: z.array(stepSchema),
  terminal: z.array(terminalLineSchema),
});

export const trustSchema = z.object({
  heading: z.string(),
  steps: z.array(stepSchema),
});

export const whoSchema = z.object({
  title: z.string(),
  columns: z.array(
    z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
  ),
});

export const comparisonSchema = z.object({
  heading: z.string(),
  columns: z.array(
    z.object({
      key: z.string(),
      // Column header = the option's card: colored dot, name, one-line verdict.
      name: z.string(),
      // dot: gray | gold | green (the colored bullet next to the name).
      dot: z.enum(["gray", "gold", "green"]),
      // The one-line verdict shown under the name in the header.
      verdict: z.string(),
      // Highlights the winning column (header + cells tinted green).
      win: z.boolean().optional(),
    }),
  ),
  // Each row carries a `label`, an optional `good` list of the column keys whose
  // cell is the strong choice on that dimension (tinted green so a reader can
  // eyeball the wins), plus one string cell per column key (containers, vms,
  // pichi, …). The catchall covers those dynamic per-column cells.
  rows: z.array(
    z
      .object({
        label: z.string(),
        good: z.array(z.string()).optional(),
      })
      .catchall(z.string()),
  ),
});

export const footerSchema = z.object({
  meta: z.array(z.object({ label: z.string(), href: z.string() })),
  license: z.string(),
  badge: z.string(),
});

// ── The landing page ──────────────────────────────────
// Composed from the section schemas above. A second page would define its own
// object the same way, reusing whichever sections it needs.
const landingSchema = z.object({
  ctas: z.array(ctaSchema),
  hero: heroSchema,
  why: whySchema,
  howItWorks: howItWorksSchema,
  // A one-button row linking into the security page (rendered as a Ctas row).
  exploreSecurity: z.array(ctaSchema),
  comparison: comparisonSchema,
  footer: footerSchema,
});

export type Landing = z.infer<typeof landingSchema>;

// Per-section content types, named for the layout that renders them (the
// generic components take these rather than `Landing["…"]`). The YAML keys stay
// content-named — the mapping from key to layout lives in the page.
export type CtaContent = z.infer<typeof ctaSchema>;
export type StepContent = z.infer<typeof stepSchema>;
export type HeroContent = z.infer<typeof heroSchema>;
export type CardGridContent = z.infer<typeof problemSchema>;
export type FeatureGridContent = z.infer<typeof whySchema>;
export type TerminalContent = z.infer<typeof tryItSchema>;
export type StepsTerminalContent = z.infer<typeof howItWorksSchema>;
export type StepsCaptionContent = z.infer<typeof trustSchema>;
export type ColumnListsContent = z.infer<typeof whoSchema>;
export type ComparisonTableContent = z.infer<typeof comparisonSchema>;
export type FooterContent = z.infer<typeof footerSchema>;

export const landing: Landing = landingSchema.parse(rawLanding);

// ── Section prose ─────────────────────────────────────
// The standalone paragraphs from prose.yaml. Each is rendered into a section's
// named slot with set:html (so inline HTML like <br> is live). Keys are the
// snippet names, not section names, so any page can pull the lines it needs.
const proseSchema = z.object({
  heroSub: z.string(),
  comparisonIntro: z.string(),
  howItWorksIntro: z.string(),
  howItWorksCaption: z.string(),
  comparisonCaveat: z.string(),
});

export type Prose = z.infer<typeof proseSchema>;

export const prose: Prose = proseSchema.parse(rawProse);

// ── The security page ─────────────────────────────────
// A second page, composed from the same section schemas as the landing page —
// proof that the shapes (and the components that render them) are reusable. It
// carries the trust/layers mechanism and audience columns split off the landing
// page to keep that page's pitch tight.
const securitySchema = z.object({
  ctas: z.array(ctaSchema),
  hero: heroSchema,
  trust: trustSchema,
  comparison: comparisonSchema,
  who: whoSchema,
  footer: footerSchema,
});

export type Security = z.infer<typeof securitySchema>;

export const security: Security = securitySchema.parse(rawSecurity);

// The security page's standalone prose, same contract as `prose` above.
const securityProseSchema = z.object({
  heroSub: z.string(),
  trustIntro: z.string(),
  trustCaption: z.string(),
  comparisonIntro: z.string(),
  comparisonCaveat: z.string(),
});

export type SecurityProse = z.infer<typeof securityProseSchema>;

export const securityProse: SecurityProse =
  securityProseSchema.parse(rawSecurityProse);
