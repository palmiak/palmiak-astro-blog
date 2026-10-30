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

// One JSON file per talk, workshop, meetup or organised event: src/content/appearances/<year>-<month>-<slug>.json
const appearances = defineCollection({
  type: 'data',
  schema: z
    .object({
      event: z.string(),
      year: z.number().int(),
      month: z.number().int().min(1).max(12).optional(),
      /** speaker | organiser | meetup | online. Online entries are listed but not put on the map. */
      role: z.enum(['speaker', 'organiser', 'meetup', 'online']),
      /** A speaker who also helped organise the event */
      organiser: z.boolean().default(false),
      city: z.string().optional(),
      country: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
      talk: z.string().optional(),
      links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    })
    .refine((a) => a.role === 'online' || (a.city && a.country && a.lat !== undefined && a.lon !== undefined), {
      message: 'On-site appearances need city, country, lat and lon',
    }),
});

export const collections = { posts, events, appearances };
