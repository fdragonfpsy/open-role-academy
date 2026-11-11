import { z } from 'zod';
import { LEVELS } from './levels';
import type { LearnerState } from './types';

export const EXPORT_FORMAT = 'open-role-academy-progress';

const level = z.enum(LEVELS);
const competencyState = z.object({
  rating: z.number(),
  correctByLevel: z.object({
    foundation: z.number().int().min(0),
    practitioner: z.number().int().min(0),
    advanced: z.number().int().min(0),
  }),
  answered: z.number().int().min(0),
  answeredItems: z.array(z.string()),
});
const reviewCard = z.object({
  itemId: z.string(),
  competency: z.string(),
  box: z.number().int().min(0).max(3),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const learnerStateSchema = z.object({
  version: z.literal(1),
  roleId: z.string().min(1),
  selfLevel: level,
  createdAt: z.string(),
  placementDone: z.boolean(),
  competencies: z.record(z.string(), competencyState),
  reviews: z.record(z.string(), reviewCard),
  completedUnits: z.array(z.string()),
});

const exportSchema = z.object({
  format: z.literal(EXPORT_FORMAT),
  exportedAt: z.string(),
  state: learnerStateSchema,
});

/** Serialise progress to a JSON string for download. */
export function exportProgress(state: LearnerState, now: Date): string {
  return JSON.stringify({ format: EXPORT_FORMAT, exportedAt: now.toISOString(), state }, null, 2);
}

/** Parse and validate an exported JSON string. Throws a descriptive error on invalid input. */
export function importProgress(json: string): LearnerState {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error('Not valid JSON.');
  }
  const parsed = exportSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid progress file: ${parsed.error.issues[0]?.message ?? 'unknown error'}`);
  }
  return parsed.data.state;
}
