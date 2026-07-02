import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://immohome.vercel.app',

  // Hybrid: public pages prerender by default; pages/endpoints opt into SSR
  // with `export const prerender = false`. API routes are always on-demand.
  output: 'hybrid',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      // Keep private surfaces and API routes out of the public sitemap.
      filter: (page) =>
        !page.includes('/agent') &&
        !page.includes('/atelier') &&
        !page.includes('/api') &&
        !page.includes('/404')
    })
  ]
});
