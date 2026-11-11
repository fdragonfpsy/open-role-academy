import { LEVELS, LEVEL_LOWER_BOUND, type Level } from './levels';
import type { CompetencyState } from './types';

export const MIN_CORRECT_FOR_MASTERY = 2;

/** Mastery of a level: θ ≥ lower band bound AND ≥ 2 correct answers on items of that level. */
export function isLevelMastered(state: CompetencyState | undefined, level: Level): boolean {
  if (!state) return false;
  return (
    state.rating >= LEVEL_LOWER_BOUND[level] &&
    state.correctByLevel[level] >= MIN_CORRECT_FOR_MASTERY
  );
}

/**
 * Highest mastered level. Mastering a higher level implies the lower ones
 * (a learner who answers advanced items correctly is not sent back to foundation units).
 */
export function masteredLevel(state: CompetencyState | undefined): Level | null {
  let result: Level | null = null;
  for (const level of LEVELS) {
    if (isLevelMastered(state, level)) result = level;
  }
  return result;
}
