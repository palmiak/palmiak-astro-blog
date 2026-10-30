import type { APIRoute } from 'astro';
import { renderOg } from '../../../utils/og';
import { getPosts } from '../../../utils/content';

export async function getStaticPaths() {
  return (await getPosts()).map((post) => ({
    params: { slug: post.slug },
    props: { title: post.data.title },
  }));
}

export const GET: APIRoute = ({ props }) => renderOg({ title: (props as { title: string }).title, cta: 'Read the article' });
