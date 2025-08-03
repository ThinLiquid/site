// @ts-check
import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import icon from 'astro-icon'

export default defineConfig({
  output: 'static',

  server: {
    port: 5173
  },

  build: {
    format: 'file'
  },

  integrations: [mdx(), svelte(), icon()],

  site: "https://thinliquid.dev"
});