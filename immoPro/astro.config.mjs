import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

const vercelAdapter = vercel();
const buildVercelOutput = vercelAdapter.hooks['astro:build:done'];

// The Astro 4 adapter falls back to Node 18. Set the Vercel function's
// runtime after the adapter has written the Build Output API manifest.
vercelAdapter.hooks['astro:build:done'] = async (options) => {
  await buildVercelOutput(options);

  const manifestPath = new URL('../functions/_render.func/.vc-config.json', options.dir);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.launcherType !== 'Nodejs') {
    throw new Error('Expected the Astro Vercel render function to use the Node.js launcher.');
  }

  manifest.runtime = 'nodejs26.x';
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  options.logger.info('Vercel render function now targets Node.js 26.');
};

// https://astro.build/config
export default defineConfig({
  site: 'https://immohome.vercel.app',

  // Hybrid: public pages prerender by default; pages/endpoints opt into SSR
  // with `export const prerender = false`. API routes are always on-demand.
  output: 'hybrid',
  adapter: vercelAdapter,

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
