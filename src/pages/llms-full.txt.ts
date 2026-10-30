import type { APIRoute } from 'astro';
import { SITE, SITE_NAME } from '../utils/site';
import { getPosts } from '../utils/content';
import { postToMarkdown } from '../utils/markdown';
import { personDescription } from '../utils/person';

// Everything on the blog as one Markdown file. The curated index is /llms.txt.
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const body = [
    `# ${SITE_NAME}: full text`,
    '',
    `> ${personDescription}`,
    '',
    `Site: ${SITE}/. Index for AI readers: ${SITE}/llms.txt. ${posts.length} posts follow, newest first, each separated by a rule.`,
    '',
    ...posts.flatMap((post) => ['---', '', postToMarkdown(post)]),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
