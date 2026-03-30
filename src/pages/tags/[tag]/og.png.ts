import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@takumi-rs/image-response';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement as h } from 'react';

const unboundedFont = readFileSync(
  join(process.cwd(), 'public/fonts/unbounded-v7-latin-700.woff2')
);
const monoFont = readFileSync(
  join(process.cwd(), 'public/fonts/ibm-plex-mono-400.woff2')
);

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
  return tags.map((tag) => ({
    params: { tag },
    props: { tag, count: posts.filter((p) => p.data.tags.includes(tag)).length },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { tag, count } = props as { tag: string; count: number };

  const hLines = Array.from({ length: 9 }, (_, i) =>
    h('div', {
      style: {
        position: 'absolute' as const,
        left: 0,
        right: 0,
        top: (i + 1) * 63,
        height: 1,
        background: `rgba(255,255,255,${i < 4 ? 0.02 + i * 0.008 : 0.05 - (i - 4) * 0.008})`,
      },
    })
  );
  const vLines = Array.from({ length: 19 }, (_, i) =>
    h('div', {
      style: {
        position: 'absolute' as const,
        top: 0,
        bottom: 0,
        left: (i + 1) * 60,
        width: 1,
        background: `rgba(255,255,255,${i < 9 ? 0.02 + i * 0.004 : 0.05 - (i - 9) * 0.004})`,
      },
    })
  );

  return new ImageResponse(
    h(
      'div',
      {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          backgroundColor: '#0b0b0e',
          backgroundImage: 'radial-gradient(ellipse at 15% 85%, rgba(168,85,247,0.1) 0%, transparent 55%)',
        },
      },
      ...hLines,
      ...vLines,
      h('div', {
        style: {
          width: 100,
          height: 3,
          background: 'linear-gradient(90deg, #ff2d78, #a855f7, #00ffb3)',
          borderRadius: 2,
        },
      }),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            flex: 1,
            justifyContent: 'center',
          },
        },
        h(
          'span',
          {
            style: {
              fontFamily: 'IBM Plex Mono',
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#c084fc',
              border: '1px solid rgba(168,85,247,0.4)',
              background: 'rgba(168,85,247,0.08)',
              borderRadius: 3,
              padding: '4px 12px',
              alignSelf: 'flex-start',
            },
          },
          'Tag'
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'Unbounded',
              fontSize: 54,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: '#f0f0f6',
            },
          },
          `#${tag}`
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'IBM Plex Mono',
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.65,
              color: '#c8c8e4',
            },
          },
          `${count} post${count !== 1 ? 's' : ''}`
        )
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.09)',
            paddingTop: 22,
          },
        },
        h(
          'div',
          {
            style: {
              fontFamily: 'Unbounded',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#f0f0f6',
            },
          },
          'maciekpalmowski.dev'
        )
      )
    ),
    {
      width: 1200,
      height: 630,
      format: 'png',
      fonts: [
        { data: unboundedFont, name: 'Unbounded', weight: 700, style: 'normal' },
        { data: monoFont, name: 'IBM Plex Mono', weight: 400, style: 'normal' },
      ],
    }
  );
};
