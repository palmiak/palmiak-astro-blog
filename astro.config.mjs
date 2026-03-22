import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://maciekpalmowski.dev',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false,
    },
  },
});
