// Speaking helpers. The appearances themselves live in the `appearances` content collection:
// one JSON file per event in src/content/appearances/. Add a file and the speaker kit, map, home teaser,
// ticker and llms.txt all update. Topics and constants stay here.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Appearance = CollectionEntry<'appearances'>['data'];

/** All appearances, newest first. Entries without a month follow the dated ones of the same year. */
export async function getAppearances(): Promise<Appearance[]> {
  const entries = await getCollection('appearances');
  return entries
    .map((e) => e.data)
    .sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0) || a.event.localeCompare(b.event));
}

/** Subjects I can build a talk or workshop around. `example` points to something that shows how I cover it. */
export const topics: { title: string; summary: string; example?: { label: string; url: string } }[] = [
  {
    title: 'WordPress security',
    summary: 'Where the ecosystem is strong, where it fails, and what developers and site owners can do about vulnerable plugins.',
    example: { label: 'Watch a talk', url: 'https://www.youtube.com/watch?v=Y3HsjvRAofk' },
  },
  {
    title: 'Bug bounty and vulnerability disclosure',
    summary: 'How a community-run bounty works in practice, what almost 1,000 closed plugins taught us, and how to run disclosure well.',
    example: { label: 'Read the story', url: '/blog/how-we-removed-almost-1000-plugins-from-the-official-wordpress-repository/' },
  },
  {
    title: 'Hosting security',
    summary: 'What hosts really block. Patchstack research on how many WordPress vulnerability exploits get past hosting defences.',
    example: { label: 'Read the research', url: 'https://patchstack.com/articles/hosting-security-tested-87-percent-of-vulnerability-exploits-bypassed-hosting-defenses/' },
  },
  {
    title: 'Headless CMS',
    summary: 'When going headless pays off and when it is extra work, across performance, developer experience and security.',
    example: { label: 'Read the article', url: '/blog/is-going-headless-worth-the-fuss/' },
  },
  {
    title: 'Astro',
    summary: 'Building fast sites with islands and content collections, live previews, and documentation sites with Starlight. Talks or hands-on workshops.',
    example: { label: 'Watch a talk', url: 'https://www.youtube.com/watch?v=i4MyL0Itz9o' },
  },
  {
    title: 'CMS-agnostic websites',
    summary: 'Keeping content separate from the CMS so you can switch later, with live migrations across WordPress, Statamic, Keystatic and more.',
    example: { label: 'Read the article', url: '/blog/content-layer-api-in-astro-how-to-create-a-cms-agnostic-website/' },
  },
  {
    title: 'Life beyond WordPress',
    summary: 'A tour of other CMSs for people who know WordPress, and the case for giving WordPress a fair try if you do not.',
    example: { label: 'Read the article', url: '/blog/the-world-outside-of-wordpress/' },
  },
  {
    title: 'CI/CD and testing for WordPress',
    summary: 'Deployment pipelines, staging and automated tests that keep fatal errors off production.',
    example: { label: 'Watch a talk', url: 'https://wordpress.tv/2022/07/13/maciek-palmowski-deploying-wordpress-with-confidence-using-ci-cd/' },
  },
  {
    title: 'Running conferences',
    summary: 'Organising WordCamps and CMS Conf: bilingual events, sponsors, and feedback sessions that make speakers better.',
    example: { label: 'Read the article', url: '/blog/why-every-tech-event-needs-pre-conference-feedback-sessions/' },
  },
  {
    title: 'Starting to speak and blog',
    summary: 'How to find speaking opportunities, write a good proposal, and start a developer blog.',
    example: { label: 'Read the guide', url: '/blog/finding-public-speaking-opportunities-my-framework/' },
  },
];

export const SESSIONIZE = 'https://sessionize.com/maciek-palmowski/';

/** One entry per city for the map, with the events held there. */
export function mapPlaces(appearances: Appearance[]) {
  const byCity = new Map<string, { city: string; country: string; lat: number; lon: number; events: string[] }>();
  for (const a of appearances) {
    if (a.role === 'online' || a.lat === undefined || a.lon === undefined || !a.city) continue;
    const entry = byCity.get(a.city) ?? { city: a.city, country: a.country!, lat: a.lat, lon: a.lon, events: [] };
    entry.events.push(a.event);
    byCity.set(a.city, entry);
  }
  return [...byCity.values()];
}

export function speakingStats(appearances: Appearance[]) {
  const onSite = appearances.filter((a) => a.role !== 'online' && a.city);
  return {
    appearances: appearances.length,
    cities: new Set(onSite.map((a) => a.city)).size,
    countries: new Set(onSite.map((a) => a.country)).size,
    since: Math.min(...appearances.map((a) => a.year)),
  };
}
