import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  competencySchema,
  itemFileSchema,
  resourceSchema,
  roleSchema,
  unitSchema,
} from './content/schemas';

const base = './src/content';

export const collections = {
  roles: defineCollection({ loader: glob({ pattern: '*.yaml', base: `${base}/roles` }), schema: roleSchema }),
  competencies: defineCollection({
    loader: glob({ pattern: '*.yaml', base: `${base}/competencies` }),
    schema: competencySchema,
  }),
  units: defineCollection({ loader: glob({ pattern: '{en,de}/*.mdx', base: `${base}/units` }), schema: unitSchema }),
  items: defineCollection({ loader: glob({ pattern: '*.yaml', base: `${base}/items` }), schema: itemFileSchema }),
  resources: defineCollection({
    loader: glob({ pattern: '*.yaml', base: `${base}/resources` }),
    schema: resourceSchema,
  }),
};
