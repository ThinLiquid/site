// @ts-check
import { defineConfig } from 'astro/config';
import shared from './astro.config.shared'

export default {
  ...shared,
  ...defineConfig({
    site: "https://thinliquid.dev",
    srcDir: 'src-thnlqd/'
  })
}