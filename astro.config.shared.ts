// @ts-check
import { defineConfig } from 'astro/config';
import compressor from 'astro-compressor';

import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import icon from 'astro-icon'

export default defineConfig({
  output: 'static',
  server: { allowedHosts: true },
  build: { format: 'file' },

  integrations: [mdx(), svelte(), icon(), compressor()],
})