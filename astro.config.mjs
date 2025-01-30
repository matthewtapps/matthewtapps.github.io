// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { remarkModifiedTime } from "./src/services/remark-modified-time.mjs";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import { SITE_URL } from "./src/consts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "solarized-light",
        dark: "everforest-dark",
      },
    },
    remarkPlugins: [remarkModifiedTime],
  },
});
