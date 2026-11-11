// Production identity. Canonicals, sitemap, feeds and structured data always point here,
// even on the GitHub Pages preview build (which is served under a base path and set to noindex).
export const SITE = 'https://maciekpalmowski.dev';
export const SITE_NAME = 'Maciek Palmowski';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** True for the preview build served under a base path. */
export const isPreview = base !== '';

/** Absolute production URL for a site path (accepts paths with or without the preview base). */
export function abs(path: string): string {
  const clean = base && path.startsWith(base) ? path.slice(base.length) : path;
  return new URL(clean || '/', SITE).href;
}
