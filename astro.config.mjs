import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sevalesonar.angelmorab13.workers.dev',
  output: 'server',
  adapter: cloudflare(),
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()]
  }
});
