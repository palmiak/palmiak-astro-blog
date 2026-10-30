const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Paths ending in one of these are files; everything else is a page and gets a trailing slash.
const FILE = /\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|xml|txt|md|json|css|m?js|webmanifest|pdf)$/i;

export function u(path: string): string {
  const hashAt = path.indexOf('#');
  const hash = hashAt >= 0 ? path.slice(hashAt) : '';
  let p = hashAt >= 0 ? path.slice(0, hashAt) : path;
  if (p !== '' && !p.endsWith('/') && !FILE.test(p)) p += '/';
  return `${base}${p}${hash}`;
}
