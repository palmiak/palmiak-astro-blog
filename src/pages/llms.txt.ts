import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, SITE_NAME } from '../utils/site';
import { getPosts, postDescription } from '../utils/content';
import { getAppearances, topics, SESSIONIZE } from '../data/speaking';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const appearances = await getAppearances();
  const events = await getCollection('events');

  const line = (title: string, url: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ''}`;

  const body = `# ${SITE_NAME}

> Web developer, public speaker and open source enthusiast. Growth Engineer at Patchstack (WordPress security), 15+ years in web development. Writes about WordPress security, headless CMS and Astro, and co-organises CMS Conf 2026 in Gdynia, Poland. Based in Łódź, Poland.

## About
${line('Home', `${SITE}/`, 'who I am, latest posts and talks')}
${line('Speaking', `${SITE}/speaking/`, 'talks on offer, every conference spoken at, speaker kit with bios in English and Polish and photos')}
${line('Contact', `${SITE}/contact-me/`, 'email, X and LinkedIn')}

## Latest writing (Markdown versions)
${posts.slice(0, 20).map((p) => line(p.data.title, `${SITE}/blog/${p.slug}.md`, postDescription(p))).join('\n')}
${line('Full text of every post', `${SITE}/llms-full.txt`, `all ${posts.length} posts in one Markdown file`)}

## Speaking topics
${topics.map((t) => `- ${t.title}: ${t.summary}`).join('\n')}

## Speaking history
${appearances.map((a) => `- ${a.year}: ${a.event}${a.city ? `, ${a.city}, ${a.country}` : ' (online)'}${a.role === 'organiser' ? ' (organiser)' : ''}${a.talk ? `. ${a.talk}` : ''}`).join('\n')}
${line('Sessionize profile', SESSIONIZE)}

## Conference resources
${events.map((e) => line(e.data.name, `${SITE}/events/${e.id}/`, 'slides and resources')).join('\n')}

## Optional
${line('All posts (RSS)', `${SITE}/rss.xml`)}
${line('Sitemap', `${SITE}/sitemap.xml`)}
${line('GitHub', 'https://github.com/palmiak')}
${line('LinkedIn', 'https://www.linkedin.com/in/maciekpalmowski/')}
${line('Bluesky', 'https://bsky.app/profile/maciekpalmowski.dev')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
