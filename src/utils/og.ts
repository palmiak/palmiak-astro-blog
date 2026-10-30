import { ImageResponse } from '@takumi-rs/image-response';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement as h } from 'react';

// Hush tokens (see src/styles/tokens.css). Fonts are static instances of the site fonts, loaded once.
const c = {
  accent: '#ff3d9a',
  bg: '#08090a',
  ink: '#ededee',
  muted: '#a3a4aa',
  subtle: '#85868d',
  border: '#2a2b2f',
  onAccent: '#0a0a0b',
};

const font = (file: string) => readFileSync(join(process.cwd(), 'src/utils/og-fonts', file));
const fonts = [
  { data: font('fraunces-latin-300.ttf'), name: 'Fraunces', weight: 300, style: 'normal' as const },
  { data: font('fraunces-latin-ext-300.ttf'), name: 'Fraunces', weight: 300, style: 'normal' as const },
  { data: font('geist-latin-400.ttf'), name: 'Geist', weight: 400, style: 'normal' as const },
  { data: font('geist-latin-ext-400.ttf'), name: 'Geist', weight: 400, style: 'normal' as const },
  { data: font('geist-latin-500.ttf'), name: 'Geist', weight: 500, style: 'normal' as const },
  { data: font('geist-latin-ext-500.ttf'), name: 'Geist', weight: 500, style: 'normal' as const },
];

export interface OgOptions {
  title: string;
  /** Call to action drawn as a button, since some networks hide the link */
  cta: string;
}

// Satori-style renderers have no emoji font: strip pictographs so they do not render as boxes
const clean = (text: string) =>
  text.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s{2,}/g, ' ').trim();

// Cut a very long title on a word boundary
const truncate = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]+$/, '').trimEnd()}…`;
};

export function renderOg({ title, cta }: OgOptions) {
  const heading = truncate(clean(title), 96);

  // The pink full stop closes every title. A title that already ends in ? or ! keeps it and the stop is dropped;
  // the wordmark in the corner always carries one.
  const endsWithMark = /[?!]$/.test(heading);
  const text = heading.replace(/[.…]+$/, '');
  const size = text.length <= 20 ? 132 : text.length <= 36 ? 108 : text.length <= 56 ? 88 : text.length <= 80 ? 72 : 60;

  const tree = h(
    'div',
    { style: { display: 'flex', width: '100%', height: '100%', backgroundColor: c.accent, padding: 24 } },
    h(
      'div',
      {
        style: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          borderRadius: 20,
          padding: '48px 64px 52px',
          backgroundColor: c.bg,
          backgroundImage: 'radial-gradient(circle, rgba(133,134,141,0.32) 2px, transparent 2.6px)',
          backgroundSize: '32px 32px',
        },
      },
      // Fade the dot grid out toward the bottom, like the site background
      h('div', {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 380,
          backgroundImage: `linear-gradient(180deg, rgba(8,9,10,0) 0%, ${c.bg} 100%)`,
        },
      }),
      // Wordmark
      h(
        'div',
        { style: { display: 'flex', fontFamily: 'Fraunces', fontWeight: 300, fontSize: 34, letterSpacing: '-0.05em', color: c.ink } },
        'Maciek Palmowski',
        h('span', { style: { color: c.accent } }, '.')
      ),
      // Title
      h(
        'div',
        {
          style: {
            display: 'block',
            maxWidth: 1040,
            fontFamily: 'Fraunces',
            fontWeight: 300,
            fontSize: size,
            lineHeight: 1.02,
            letterSpacing: '-0.05em',
            color: c.ink,
          },
        },
        text,
        endsWithMark ? null : h('span', { style: { color: c.accent } }, '.')
      ),
      // Call to action
      h(
        'div',
        { style: { display: 'flex' } },
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Geist',
              fontWeight: 500,
              fontSize: 30,
              color: c.onAccent,
              backgroundColor: c.accent,
              borderRadius: 12,
              padding: '18px 34px',
            },
          },
          cta
        )
      )
    )
  );

  return new ImageResponse(tree, { width: 1200, height: 630, format: 'png', fonts });
}
