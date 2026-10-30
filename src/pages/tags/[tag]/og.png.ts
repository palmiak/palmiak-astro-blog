import type { APIRoute } from 'astro';
import { renderOg } from '../../../utils/og';
import { getPosts } from '../../../utils/content';

export async function getStaticPaths() {
  const posts = await getPosts();
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
  return tags.map((tag) => ({
    params: { tag },
    props: { tag },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { tag } = props as { tag: string };
  return renderOg({ title: tag, cta: 'Browse the posts' });
};
