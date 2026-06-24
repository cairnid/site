import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['Start', 'Reference', 'Operate', 'Trust', 'Product', 'Protocol', 'Project']),
    order: z.number().int().nonnegative(),
    source: z.string().min(1),
  }),
});

export const collections = { docs };
