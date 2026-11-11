import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(['getting-started', 'website', 'leads', 'email', 'domains']),
    order: z.number(),
    minutes: z.number(),
    updated: z.date(),
  }),
});

export const collections = { docs };
