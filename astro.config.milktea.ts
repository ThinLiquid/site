// @ts-check
import { defineConfig } from 'astro/config'
import shared from './astro.config.shared'
import type { RemarkPlugin } from '@astrojs/markdown-remark';

const DEFAULT_LAYOUT = '../../layouts/MarkdownLayout.astro';

function setDefaultLayout(): ReturnType<RemarkPlugin> {
  return function (_, file) {
    const { frontmatter } = file.data.astro ?? { frontmatter: {} };
    if (frontmatter != null && !frontmatter.layout && file) frontmatter.layout = DEFAULT_LAYOUT;
  };
}

export default {
  ...shared,
  ...defineConfig({
    site: "https://milktea.coffee",
    srcDir: 'src-milktea/',

    markdown: {
      remarkPlugins: [
        setDefaultLayout
      ]
    }
  })
}