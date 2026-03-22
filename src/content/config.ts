import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    thumbnail: z.string().optional(),
    ogImage: z.string().optional(),
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

export const collections = { posts, talks };
