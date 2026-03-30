import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

export default defineConfig({
  site: isGhPages ? 'https://palmiak.github.io' : 'https://maciekpalmowski.dev',
  base: isGhPages ? '/palmiak-astro-blog' : '/',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@takumi-rs/core'],
    },
  },
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false,
    },
  },
});
