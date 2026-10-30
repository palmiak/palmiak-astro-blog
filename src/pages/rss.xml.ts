import type { APIRoute } from 'astro';
import { SITE, SITE_NAME } from '../utils/site';
import { getPosts, postDescription, xmlEscape } from '../utils/content';

export const GET: APIRoute = async () => {
  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const link = `${SITE}/blog/${post.slug}/`;
      const tags = post.data.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join('\n');
      return `    <item>
      <title>${xmlEscape(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <description>${xmlEscape(postDescription(post))}</description>
${tags}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE}/</link>
    <description>Notes on WordPress security, headless CMS, Astro, conferences and speaking.</description>
    <language>en</language>
    <lastBuildDate>${(posts[0].data.updatedDate ?? posts[0].data.pubDate).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
