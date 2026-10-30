import { getPosts } from './content';

const display: Record<string, string> = {
  wordpress: 'WordPress', cms: 'CMS', cicd: 'CI/CD', php: 'PHP', javascript: 'JavaScript', ssg: 'SSG',
  jamstack: 'Jamstack', sanityio: 'Sanity.io', 'statamic-for-wp-devs': 'Statamic for WordPress developers',
};

const descriptions: Record<string, string> = {
  wordpress: 'Posts about WordPress: plugin and site security, going headless, deployment, the WordPress community and life beyond it.',
  conferences: 'Recaps and lessons from WordCamps and developer conferences: what I saw, what I spoke about, and how to organise and speak at events.',
  cms: 'Posts comparing content management systems, headless and traditional, from WordPress and Statamic to Sanity, Keystatic, Drupal and EmDash.',
  astro: 'Posts about the Astro web framework: content collections, the Content Layer API, documentation sites with Starlight, and pairing Astro with a CMS.',
  statamic: 'Posts about Statamic, the Laravel-based CMS: data modelling, field actions, live previews and how it compares with WordPress.',
  development: 'Web development posts: building and deploying websites, tooling, Tailwind CSS and blogging as a developer.',
  security: 'Posts on web security: WordPress plugin vulnerabilities, vulnerability disclosure and bug bounty, and securing Git repositories.',
  work: 'Posts about work in tech: new roles, layoffs, yearly reviews and what a vulnerability disclosure job involves.',
  cicd: 'Posts about CI/CD: deploying WordPress safely, pipelines in Buddy, staging and automated tests.',
  headless: 'Posts about headless architecture: when decoupling the CMS from the front end is worth it, and how to do it with WordPress and Astro.',
  'statamic-for-wp-devs': 'A series introducing Statamic to WordPress developers: installation, data modelling, collections and the differences between the two.',
  life: 'Personal posts: yearly summaries, travel and life as a developer and speaker.',
  testing: 'Posts about testing: Playwright, unit and integration tests, and automating checks.',
  buddy: 'Posts about Buddy, the CI/CD platform: custom actions and pipelines.',
};

/** Tags with fewer posts than this are kept out of the index: too thin to be worth a search result. */
export const MIN_INDEXED_POSTS = 3;

export const tagLabel = (tag: string) => display[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);

export async function getTagInfo() {
  const posts = await getPosts();
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
  return tags.map((tag) => {
    const list = posts.filter((p) => p.data.tags.includes(tag));
    const label = tagLabel(tag);
    return {
      tag,
      label,
      count: list.length,
      description: descriptions[tag] ?? `Posts tagged ${label} by Maciek Palmowski.`,
      indexed: list.length >= MIN_INDEXED_POSTS,
    };
  });
}
