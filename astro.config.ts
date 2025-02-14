// @ts-check
import { defineConfig } from 'astro/config';

import { visit } from "unist-util-visit";
import twemoji from "@twemoji/api"

import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

const remarkTwemoji = (options?: {
  callback?: Function
  attributes?: Function
  base?: string
  ext?: string
  className?: string
  size?: string | number
  folder?: string
  isReact?: boolean
}) => {
  const settings = options || {};
  function attributesCallback(rawText: string) {
    return {
      title: rawText
    };
  }
  function transformer(tree: any) {
    visit(tree, "text", node => {
      const parsedNode = twemoji.parse(
        node.value,
        Object.assign({ attributes: attributesCallback }, settings) as any
      );
      node.type = "html";
      // Check if 'isReact: true' is specified in options
      node.value = settings.isReact ? parsedNode.replace(/class/g, "className") : parsedNode;
    });
  }

  return transformer;
};

// https://astro.build/config
export default defineConfig({
  output: 'static',
  markdown: {
    remarkPlugins: [
      [remarkTwemoji, {}]
    ]
  },

  build: {
    format: 'file'
  },

  integrations: [mdx(), svelte()],

  site: "https://thinliquid.dev"
});