import photo from '../assets/speaker/maciek_color.jpg';
import { SITE, abs } from './site';

export const personId = `${SITE}/#person`;

/** Profiles that belong to this person: sameAs in structured data and rel="me" links in the head. */
export const profiles = [
  'https://bsky.app/profile/maciekpalmowski.dev',
  'https://twitter.com/palmiak_fp',
  'https://www.linkedin.com/in/maciekpalmowski/',
  'https://github.com/palmiak',
];

export const personDescription =
  "Maciek is a Growth Engineer at Patchstack. He's a huge fan of Open Source, Content Management Systems, and automation. After hours, he spends most of his time finding interesting cycling routes, coding side projects, or drinking coffee.";

/** The one Person entity every page points at through its @id. */
export function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: 'Maciek Palmowski',
    givenName: 'Maciek',
    familyName: 'Palmowski',
    url: `${SITE}/`,
    image: abs(photo.src),
    description: personDescription,
    jobTitle: 'Growth Engineer',
    worksFor: { '@type': 'Organization', name: 'Patchstack', url: 'https://patchstack.com' },
    address: { '@type': 'PostalAddress', addressLocality: 'Łódź', addressCountry: 'PL' },
    knowsLanguage: ['en', 'pl'],
    knowsAbout: ['WordPress security', 'Vulnerability disclosure and bug bounty', 'Headless CMS', 'Astro', 'CMS-agnostic websites', 'CI/CD for WordPress', 'Web development'],
    sameAs: [...profiles, 'https://sessionize.com/maciek-palmowski/'],
  };
}
