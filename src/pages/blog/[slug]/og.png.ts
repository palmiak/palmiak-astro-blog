import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@takumi-rs/image-response';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement as h } from 'react';

// Load fonts once at module level — not per request
const unboundedFont = readFileSync(
  join(process.cwd(), 'public/fonts/unbounded-v7-latin-700.woff2')
);
const monoFont = readFileSync(
  join(process.cwd(), 'public/fonts/ibm-plex-mono-400.woff2')
);

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: {
      title: post.data.title,
      description: post.data.description ?? post.data.intro ?? '',
      pubDate: post.data.pubDate,
      tags: post.data.tags,
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, pubDate, tags } = props as {
    title: string;
    description: string;
    pubDate: Date;
    tags: string[];
  };

  const dateStr = pubDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Scale title font size down for longer titles
  const titleSize = title.length > 60 ? 38 : title.length > 40 ? 46 : 54;

  // Strip emoji characters — no emoji font loaded, they render as squares
  const stripEmoji = (text: string) =>
    text.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s{2,}/g, ' ').trim();

  // Truncate description to avoid overflow (after stripping emoji)
  const rawDesc = stripEmoji(description);
  const desc = rawDesc.length > 110 ? rawDesc.slice(0, 110) + '…' : rawDesc;

  // Grid lines drawn as absolute divs (repeating-linear-gradient not supported)
  // 630px tall → 9 horizontal lines at ~63px spacing
  // 1200px wide → 19 vertical lines at 60px spacing
  const hLines = Array.from({ length: 9 }, (_, i) =>
    h('div', {
      style: {
        position: 'absolute' as const,
        left: 0,
        right: 0,
        top: (i + 1) * 63,
        height: 1,
        // Fade opacity toward edges for the "gradiented" feel
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
          // Single radial glow — Takumi only supports one backgroundImage value
          backgroundImage: 'radial-gradient(ellipse at 15% 85%, rgba(168,85,247,0.1) 0%, transparent 55%)',
        },
      },
      ...hLines,
      ...vLines,
      // Top gradient accent bar
      h('div', {
        style: {
          width: 100,
          height: 3,
          background: 'linear-gradient(90deg, #ff2d78, #a855f7, #00ffb3)',
          borderRadius: 2,
        },
      }),
      // Main content — vertically centred between bar and footer
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
        // Tags row
        tags.length > 0 &&
          h(
            'div',
            { style: { display: 'flex', gap: 10 } },
            ...tags.slice(0, 3).map((tag) =>
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
                  },
                },
                tag
              )
            )
          ),
        // Title
        h(
          'div',
          {
            style: {
              fontFamily: 'Unbounded',
              fontSize: titleSize,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: '#f0f0f6',
            },
          },
          title
        ),
        // Description (optional)
        desc &&
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
            desc
          )
      ),
      // Footer
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
        ),
        h(
          'div',
          {
            style: {
              fontFamily: 'IBM Plex Mono',
              fontSize: 12,
              letterSpacing: '0.06em',
              color: '#8e8eaa',
            },
          },
          dateStr
        )
      )
    ),
    {
      width: 1200,
      height: 630,
      // Using PNG to match the .png file extension so Netlify serves the
      // correct Content-Type (image/png). WebP bytes in a .png file cause
      // silent OG scraper failures on static hosts.
      format: 'png',
      fonts: [
        { data: unboundedFont, name: 'Unbounded', weight: 700, style: 'normal' },
        { data: monoFont, name: 'IBM Plex Mono', weight: 400, style: 'normal' },
      ],
    }
  );
};
