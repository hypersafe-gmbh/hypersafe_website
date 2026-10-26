import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/about': '/#about',
  },
  integrations: [tailwind({ applyBaseStyles: false })]
});