import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../utils/site';
import { getPosts, PAGE_SIZE, xmlEscape } from '../utils/content';
import { getTagInfo } from '../utils/tags';

const day = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const events = await getCollection('events');
  const newest = day(posts[0].data.updatedDate ?? posts[0].data.pubDate);

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: newest },
    { loc: '/blog/', lastmod: newest },
    { loc: '/speaking/' },
    { loc: '/contact-me/' },
  ];

  for (let n = 2; n <= Math.ceil(posts.length / PAGE_SIZE); n++) urls.push({ loc: `/blog/${n}/`, lastmod: newest });

  for (const post of posts) {
    urls.push({ loc: `/blog/${post.slug}/`, lastmod: day(post.data.updatedDate ?? post.data.pubDate) });
  }

  // Tags with a handful of posts are noindex, so they stay out of the sitemap too
  const tagInfo = (await getTagInfo()).filter((t) => t.indexed);
  for (const { tag } of tagInfo) {
    const list = posts.filter((p) => p.data.tags.includes(tag));
    const last = day(list[0].data.updatedDate ?? list[0].data.pubDate);
    urls.push({ loc: `/tags/${tag}/`, lastmod: last });
    for (let n = 2; n <= Math.ceil(list.length / PAGE_SIZE); n++) urls.push({ loc: `/tags/${tag}/${n}/`, lastmod: last });
  }

  for (const event of events) urls.push({ loc: `/events/${event.id}/` });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => `  <url><loc>${xmlEscape(SITE + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
