/** Level definitions and rating bands (CLAUDE.md §4.1, §7.2). */
export const LEVELS = ['foundation', 'practitioner', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

/** Lower bound of each level band on the Elo scale. */
export const LEVEL_LOWER_BOUND: Record<Level, number> = {
  foundation: 800,
  practitioner: 1100,
  advanced: 1400,
};

/** Prior ability from the learner's self-rating. */
export const PRIOR_RATING: Record<Level, number> = {
  foundation: 950,
  practitioner: 1250,
  advanced: 1500,
};

/** Authoring-time item difficulty: centre ± tolerance per level. */
export const ITEM_DIFFICULTY_CENTER: Record<Level, number> = {
  foundation: 950,
  practitioner: 1250,
  advanced: 1550,
};
export const ITEM_DIFFICULTY_TOLERANCE = 100;

/** 1-based rank of a level; 0 means "no level reached yet". */
export function levelRank(level: Level | null): number {
  return level === null ? 0 : LEVELS.indexOf(level) + 1;
}

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value);
}

/** Level band that a rating falls into (null below the foundation band). */
export function bandForRating(rating: number): Level | null {
  let result: Level | null = null;
  for (const level of LEVELS) {
    if (rating >= LEVEL_LOWER_BOUND[level]) result = level;
  }
  return result;
}

/** True when a difficulty value is inside the authoring range of its level. */
export function difficultyMatchesLevel(difficulty: number, level: Level): boolean {
  return Math.abs(difficulty - ITEM_DIFFICULTY_CENTER[level]) <= ITEM_DIFFICULTY_TOLERANCE;
}
