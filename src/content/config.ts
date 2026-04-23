import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    thumbnail: z.string().optional(),
tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const talks = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    year: z.number(),
    url: z.string().optional(),
  }),
});

const events = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })),
  }),
});

export const collections = { posts, talks, events };
