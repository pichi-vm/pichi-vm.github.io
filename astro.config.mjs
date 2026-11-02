// SPDX-FileCopyrightText: Advanced Micro Devices, Inc.
// SPDX-License-Identifier: Apache-2.0

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";

// https://astro.build/config
export default defineConfig({
  site: "https://pichi.dev",
  base: "/",
  // Emits sitemap-index.xml + sitemap-0.xml from `site` above.
  integrations: [sitemap()],
  vite: {
    // Lets components `import data from '../content/landing.yaml'`.
    plugins: [yaml()],
  },
});
