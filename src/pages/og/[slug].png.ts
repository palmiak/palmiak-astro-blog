import type { APIRoute } from 'astro';
import { renderOg, type OgOptions } from '../../utils/og';

const pages: Record<string, OgOptions> = {
  home: {
    title: 'Developer and speaker',
    cta: 'Visit maciekpalmowski.dev',
  },
  blog: {
    title: 'Writing',
    cta: 'Read the blog',
  },
  speaking: {
    title: 'Speaking',
    cta: 'See talks and events',
  },
  contact: {
    title: 'Get in touch',
    cta: 'Get in touch',
  },
};

export function getStaticPaths() {
  return Object.entries(pages).map(([slug, props]) => ({ params: { slug }, props }));
}

export const GET: APIRoute = ({ props }) => renderOg(props as OgOptions);
