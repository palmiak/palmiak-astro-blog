import type { APIRoute } from 'astro';
import { SITE, isPreview } from '../utils/site';

// Search and AI answer engines are welcome: the goal is to be found and cited.
// To opt a crawler out, move its name into a block with `Disallow: /`.
const aiCrawlers = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot',
];

export const GET: APIRoute = () => {
  const body = isPreview
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /style-guide/',
        '',
        ...aiCrawlers.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', 'Disallow: /style-guide/', '']),
        `Sitemap: ${SITE}/sitemap.xml`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
