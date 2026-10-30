import { getCollection } from 'astro:content';

export const PAGE_SIZE = 10;

/** Published posts, newest first. */
export async function getPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export const postDescription = (post: Awaited<ReturnType<typeof getPosts>>[number]) =>
  post.data.description ?? post.data.excerpt ?? post.data.intro ?? '';

export const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
