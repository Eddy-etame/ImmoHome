import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://immopro.cm',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      // Exclude non-public surfaces from the public sitemap.
      filter: (page) =>
        !page.includes('/agent') &&
        !page.includes('/atelier') &&
        !page.includes('/404')
    })
  ]
});