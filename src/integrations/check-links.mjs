import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CONCURRENCY = 10;
const TIMEOUT_MS = 10_000;
const USER_AGENT = 'Mozilla/5.0 (compatible; astro-check-links/1.0)';

const SKIPPED_DOMAINS = [
  'twitter.com', 'x.com',
  'facebook.com', 'fb.com',
  'instagram.com',
  'linkedin.com',
  'tiktok.com',
  'pinterest.com',
  'reddit.com',
  'threads.net',
  'mastodon.social',
  'bsky.app',
  'youtube.com', 'youtu.be',
];

const distPath = resolve(process.cwd(), 'dist');

console.log('Scanning for broken links...');

const htmlFiles = collectHtmlFiles(distPath);
const builtPaths = buildPathSet(distPath);

const linkMap = new Map();
for (const file of htmlFiles) {
  const relativePage = file.replace(distPath, '');
  for (const href of extractLinks(file)) {
    if (!linkMap.has(href)) linkMap.set(href, new Set());
    linkMap.get(href).add(relativePage);
  }
}

const internalLinks = [];
const externalLinks = [];

for (const href of linkMap.keys()) {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    externalLinks.push(href);
  } else {
    internalLinks.push(href);
  }
}

const report = [];

for (const href of internalLinks) {
  if (isInternalBroken(href, builtPaths)) {
    for (const page of linkMap.get(href)) {
      report.push({ page, href, type: 'internal' });
    }
  }
}

if (externalLinks.length > 0) {
  console.log(`Checking ${externalLinks.length} unique external URL(s)...`);
  const results = await checkExternalLinks(externalLinks);
  for (const [href, ok] of results) {
    if (!ok) {
      for (const page of linkMap.get(href)) {
        report.push({ page, href, type: 'external' });
      }
    }
  }
}

if (report.length === 0) {
  console.log(
    `check-links: All links valid — ${htmlFiles.length} pages, ` +
    `${internalLinks.length} internal, ${externalLinks.length} external.`
  );
} else {
  for (const { page, href, type } of report) {
    console.warn(`[${type}] Broken link [${href}] in ${page}`);
  }
  console.error(`check-links: Found ${report.length} broken link(s).`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function buildPathSet(distPath) {
  const paths = new Set();
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const relative = full.replace(distPath, '') || '/';
      paths.add(relative);
      if (statSync(full).isDirectory()) walk(full);
    }
  }
  walk(distPath);
  return paths;
}

function extractLinks(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const hrefs = [];
  const re = /href=["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const href = match[1].trim();
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      continue;
    }
    if (href.startsWith('//')) continue;
    hrefs.push(href);
  }
  return hrefs;
}

function isInternalBroken(href, builtPaths) {
  const clean = href.split('?')[0].split('#')[0];
  if (!clean) return false;

  const normalized = clean.startsWith('/') ? clean : '/' + clean;

  if (builtPaths.has(normalized)) return false;
  if (builtPaths.has(normalized + '.html')) return false;
  if (builtPaths.has(normalized.replace(/\/$/, '') + '/index.html')) return false;
  if (builtPaths.has(normalized.replace(/\/$/, ''))) return false;

  return true;
}

async function checkExternalLinks(urls) {
  const results = new Map();
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      results.set(url, await isExternalOk(url));
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  return results;
}

function isSkippedDomain(url) {
  try {
    const { hostname } = new URL(url);
    return SKIPPED_DOMAINS.some((d) => hostname === d || hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

async function isExternalOk(url) {
  if (isSkippedDomain(url)) return true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });

    if (res.status === 405) {
      res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
        redirect: 'follow',
      });
    }

    return res.status < 400;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
