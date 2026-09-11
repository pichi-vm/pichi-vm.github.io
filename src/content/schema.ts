// SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
// SPDX-License-Identifier: Apache-2.0
//
// Schema for landing.yaml. The raw YAML is parsed through these Zod shapes at
// build time, so a bad edit — a misspelled `style`, an unknown `dot` color, a
// missing field — fails `astro build` with a clear message instead of silently
// rendering a broken component. Components import the validated `landing`
// object from here and get full autocomplete/types for free.
import { z } from "astro/zod";
import raw from "./landing.yaml";

// A call-to-action button, reused in the hero and footer.
const cta = z.object({
  label: z.string(),
  href: z.string(),
  style: z.enum(["primary", "ghost"]),
});

// One numbered step in a 3-up row (How it works / Build on trust).
const step = z.object({
  n: z.string(),
  heading: z.string(),
  body: z.string(),
});

const schema = z.object({
  ctas: z.array(cta),

  hero: z.object({
    logoAlt: z.string(),
    eyebrow: z.string(),
    // Rendered with set:html so an inline <br> in the headline works.
    title: z.string(),
  }),

  problem: z.object({
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
  }),

  why: z.object({
    title: z.string(),
    props: z.array(
      z.object({
        heading: z.string(),
        body: z.string(),
        // Optional muted footnote under the body.
        note: z.string().optional(),
      }),
    ),
  }),

  tryIt: z.object({
    title: z.string(),
    terminal: z.array(
      z.object({
        kind: z.enum(["cmd", "out", "gap"]),
        // Absent for kind: "gap" (renders as a blank line).
        text: z.string().optional(),
      }),
    ),
  }),

  howItWorks: z.object({
    heading: z.string(),
    steps: z.array(step),
    fanout: z.object({
      image: z.string(),
      targets: z.array(z.string()),
    }),
  }),

  trust: z.object({
    heading: z.string(),
    steps: z.array(step),
  }),

  who: z.object({
    title: z.string(),
    columns: z.array(
      z.object({
        heading: z.string(),
        items: z.array(z.string()),
      }),
    ),
  }),

  comparison: z.object({
    title: z.string(),
    columns: z.array(
      z.object({
        key: z.string(),
        label: z.string(),
        // Tints the winning column.
        pichi: z.boolean().optional(),
      }),
    ),
    // Each row carries a `label` plus one cell per column key (containers, vms,
    // pichi, …). The catchall covers those dynamic per-column cells.
    rows: z.array(z.object({ label: z.string() }).catchall(z.string())),
  }),

  footer: z.object({
    meta: z.array(z.object({ label: z.string(), href: z.string() })),
    license: z.string(),
    badge: z.string(),
  }),
});

export type Landing = z.infer<typeof schema>;

export const landing: Landing = schema.parse(raw);
