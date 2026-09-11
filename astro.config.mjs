// @ts-check
import { defineConfig } from 'astro/config';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  site: 'https://pichi-vm.github.io',
  base: '/',
  markdown: {
    // Keep prose punctuation verbatim (no curly quotes / em-dash mangling),
    // so it matches the straight quotes used elsewhere on the page.
    smartypants: false,
  },
  vite: {
    // Lets components `import data from '../content/landing.yaml'`.
    plugins: [yaml()],
  },
});
