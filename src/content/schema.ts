// SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "astro/zod";
import rawLanding from "./landing.yaml";
import rawProse from "./prose.yaml";

const link = z.object({ label: z.string(), href: z.string() });
const heroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  accent: z.string(),
  logoAlt: z.string(),
  primary: link,
  secondary: link,
});
const recordingSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  src: z.string(),
  downloadLabel: z.string(),
  cols: z.number().int().positive(),
  rows: z.number().int().positive(),
  duration: z.string(),
  terminalLabel: z.string(),
  fallback: z.string(),
  markers: z.array(z.tuple([z.number().nonnegative(), z.string()])),
});
const imageSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  label: z.string(),
  link,
  parts: z.array(
    z.object({
      name: z.string(),
      detail: z.string(),
      body: z.string(),
      tone: z.enum(["blue", "purple", "orange", "green"]),
    }),
  ),
});
const statusSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  current: z.object({
    label: z.string(),
    title: z.string(),
    items: z.array(z.string()),
  }),
  planned: z.object({
    label: z.string(),
    title: z.string(),
    body: z.string(),
    link,
  }),
});
const footerSchema = z.object({
  title: z.string(),
  links: z.array(link),
  license: z.string(),
  licenseHref: z.string(),
});
const landingSchema = z.object({
  navigation: z.array(link),
  hero: heroSchema,
  demo: recordingSchema,
  image: imageSchema,
  status: statusSchema,
  footer: footerSchema,
});
const proseSchema = z.object({
  heroSub: z.string(),
  demoIntro: z.string(),
  demoCaption: z.string(),
  imageIntro: z.string(),
  statusIntro: z.string(),
  integrityNote: z.string(),
  footerIntro: z.string(),
});
export type LinkContent = z.infer<typeof link>;
export type HeroContent = z.infer<typeof heroSchema>;
export type RecordingContent = z.infer<typeof recordingSchema>;
export type LayerStackContent = z.infer<typeof imageSchema>;
export type SplitPanelContent = z.infer<typeof statusSchema>;
export type FooterContent = z.infer<typeof footerSchema>;
export const landing = landingSchema.parse(rawLanding);
export const prose = proseSchema.parse(rawProse);
