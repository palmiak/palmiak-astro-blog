import type { CollectionEntry } from 'astro:content';
import { SITE } from './site';

type Post = CollectionEntry<'posts'>;

const attr = (attrs: string, name: string) => {
  const m = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1].replace(/&quot;/g, '"') : undefined;
};

// MDX to plain Markdown for AI readers: components become text, imports vanish, code fences are left alone.
function convert(segment: string): string {
  return segment
    .replace(/^\s*(import|export)\s.*$/gm, '')
    .replace(/<PostImage\b([\s\S]*?)\/>/g, (_, attrs: string) => {
      const alt = attr(attrs, 'alt');
      const caption = attr(attrs, 'caption');
      return [alt ? `*[Image: ${alt}]*` : '', caption ? `*${caption}*` : ''].filter(Boolean).join('\n');
    })
    .replace(/<YouTube\s+url="([^"]+)"\s*\/>/g, (_, url: string) => `[Embedded video](${url.replace('/embed/', '/watch?v=')})`)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<a\b[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replace(/<Alert>([\s\S]*?)<\/Alert>/g, (_, body: string) =>
      body
        .trim()
        .split('\n')
        .map((line, i) => (i === 0 ? `> **Note:** ${line}` : `> ${line}`))
        .join('\n')
    )
    .replace(/\]\(\//g, `](${SITE}/`)
    .replace(/\n{3,}/g, '\n\n');
}

/** A post as Markdown: a short header with the facts, then the article. */
export function postToMarkdown(post: Post): string {
  const { title, intro, description, pubDate, updatedDate, tags } = post.data;
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const parts = post.body.split(/(^```[^\n]*\n[\s\S]*?^```[^\n]*$)/m);
  const body = parts.map((part, i) => (i % 2 === 1 ? part : convert(part))).join('').trim();

  const updated = updatedDate && iso(updatedDate) !== iso(pubDate) ? `, updated ${iso(updatedDate)}` : '';
  const meta = [
    `- Author: Maciek Palmowski (${SITE}/)`,
    `- Published: ${iso(pubDate)}${updated}`,
    tags.length ? `- Topics: ${tags.join(', ')}` : '',
    `- URL: ${SITE}/blog/${post.slug}/`,
  ].filter(Boolean);
  const header = [
    `# ${title}`,
    meta.join('\n'),
    description ? `> ${description}` : '',
    intro && intro !== description ? intro : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  return `${header}\n\n${body}\n`;
}
