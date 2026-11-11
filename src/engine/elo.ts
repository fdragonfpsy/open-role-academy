/** Elo-style ability model (CLAUDE.md §7.2). */
export const K_PLACEMENT = 40;
export const K_LEARNING = 24;

/** Expected score p = 1 / (1 + 10^((b − θ)/400)). */
export function expectedScore(rating: number, difficulty: number): number {
  return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
}

/** θ ← θ + K·(score − p). Score is 1 (correct) or 0 (wrong). */
export function updateRating(rating: number, difficulty: number, score: 0 | 1, k: number): number {
  return rating + k * (score - expectedScore(rating, difficulty));
}
