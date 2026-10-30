import type { APIRoute } from 'astro';
import { getPosts } from '../../utils/content';
import { postToMarkdown } from '../../utils/markdown';

// A plain Markdown copy of each post for AI readers, announced from the post page with rel="alternate".
export async function getStaticPaths() {
  return (await getPosts()).map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(postToMarkdown(props.post), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
