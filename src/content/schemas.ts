/**
 * Zod schemas for all content (CLAUDE.md §5). Shared by Astro content collections
 * (src/content.config.ts) and the content validator (scripts/validate-content.ts).
 */
import { z } from 'zod';
import { LEVELS } from '../engine/levels';

export const level = z.enum(LEVELS);
export const lang = z.enum(['en', 'de']);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a kebab-case id');
/** ISO date string. Some YAML parsers turn unquoted dates into Date objects; normalise those. */
const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)'),
);

/** Every learner-facing string exists in both languages (en/de parity). */
export const localized = z.object({
  en: z.string().trim().min(1),
  de: z.string().trim().min(1),
});

export const roleSchema = z.object({
  id: slug,
  /** `core` = the shared core track offered on its own; `role` = a role family. */
  kind: z.enum(['role', 'core']).default('role'),
  /** draft = framework defined but content not complete: hidden in the UI, coverage not enforced. */
  status: z.enum(['draft', 'published']).default('published'),
  title: localized,
  summary: localized,
  competencies: z
    .array(
      z.object({
        id: slug,
        priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        targets: z.object({
          foundation: level.nullable(),
          practitioner: level.nullable(),
          advanced: level.nullable(),
        }),
      }),
    )
    .min(1),
});

export const frameworkRef = z.object({
  framework: z.enum(['ESCO', 'DigComp']),
  uri: z.url(),
  label: z.string().min(1),
});

export const competencySchema = z.object({
  id: slug,
  title: localized,
  description: localized,
  prerequisites: z.array(slug).default([]),
  track: z.enum(['core', 'role']),
  frameworkRefs: z.array(frameworkRef).default([]),
});

export const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1).optional(),
  url: z.url(),
  license: z.string().min(1).optional(),
  licenseUrl: z.url().optional(),
  /** cited = facts referenced; adapted = text/structure adapted; embedded = shown inside the unit. */
  usage: z.enum(['cited', 'adapted', 'embedded']).default('cited'),
  changes: z.string().min(1).optional(),
});

export const unitSchema = z.object({
  id: slug,
  competency: slug,
  level,
  title: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(1),
  minutes: z.number().int().positive().max(120),
  resources: z.array(slug).default([]),
  status: z.enum(['ai-draft', 'reviewed']),
  sources: z.array(sourceSchema).default([]),
});

export const optionSchema = z.object({
  en: z.string().trim().min(1),
  de: z.string().trim().min(1),
  correct: z.boolean(),
});

export const itemSchema = z.object({
  id: slug,
  level,
  difficulty: z.number().int().min(600).max(1900),
  type: z.enum(['single', 'multi']),
  stem: localized,
  options: z.array(optionSchema).min(2).max(6),
  explanation: localized,
  source: z.string().min(1),
  status: z.enum(['ai-draft', 'reviewed']).default('ai-draft'),
});

/** One file per competency: `items/<competency>.yaml`. */
export const itemFileSchema = z.object({
  competency: slug,
  items: z.array(itemSchema).min(1),
});

export const LICENSES = [
  'CC0-1.0',
  'public-domain',
  'CC-BY-4.0',
  'CC-BY-3.0',
  'CC-BY-SA-4.0',
  'CC-BY-SA-3.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-ND-4.0',
  'CC-BY-NC-ND-4.0',
  'free-access',
] as const;

/** Licenses that allow `mode: embed` / adaptation (CLAUDE.md §6). */
export const EMBED_LICENSES: readonly string[] = [
  'CC0-1.0',
  'public-domain',
  'CC-BY-4.0',
  'CC-BY-3.0',
  'CC-BY-SA-4.0',
  'CC-BY-SA-3.0',
];

export const resourceSchema = z.object({
  id: slug,
  url: z.url(),
  title: z.string().min(1),
  provider: z.string().min(1),
  language: lang,
  format: z.enum(['article', 'video', 'course', 'book', 'interactive']),
  minutes: z.number().int().positive(),
  license: z.enum(LICENSES),
  licenseUrl: z.url(),
  licenseVerifiedOn: isoDate,
  mode: z.enum(['embed', 'link']),
  competencies: z.array(slug).min(1),
  levels: z.array(level).min(1),
  note: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;
export type Competency = z.infer<typeof competencySchema>;
export type Unit = z.infer<typeof unitSchema>;
export type Item = z.infer<typeof itemSchema>;
export type ItemFile = z.infer<typeof itemFileSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Localized = z.infer<typeof localized>;
