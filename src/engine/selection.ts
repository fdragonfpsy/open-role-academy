import type { Level } from './levels';
import type { CompetencyState, EngineItem } from './types';

export const PLACEMENT_MIN_ITEMS = 3;
export const PLACEMENT_MAX_ITEMS = 5;
export const PLACEMENT_DEFAULT_ITEMS = 4;
export const MASTERY_CHECK_ITEMS = 4;
/** Total placement questions (≈ 1 minute each) so that placement stays ≤ 15 minutes (CLAUDE.md §7.1). */
export const PLACEMENT_QUESTION_BUDGET = 15;

export interface PlacementPlanEntry {
  competency: string;
  /** Number of placement items for this competency (3–5, or fewer if fewer items exist). */
  items: number;
}

/**
 * Plan the placement check within the question budget.
 * Competencies with at least one item are ordered by priority (1 first), then id.
 * At most floor(budget / 3) competencies are placed; each gets floor(budget / n) items, clamped to 3–5
 * and to the number of available items. Competencies left out keep their prior rating.
 */
export function planPlacement(
  competencies: { id: string; priority: number }[],
  itemCounts: Record<string, number>,
  budget: number = PLACEMENT_QUESTION_BUDGET,
): PlacementPlanEntry[] {
  const candidates = competencies
    .filter((c) => (itemCounts[c.id] ?? 0) > 0)
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const selected = candidates.slice(0, Math.max(0, Math.floor(budget / PLACEMENT_MIN_ITEMS)));
  if (selected.length === 0) return [];
  const perCompetency = Math.min(
    PLACEMENT_MAX_ITEMS,
    Math.max(PLACEMENT_MIN_ITEMS, Math.floor(budget / selected.length)),
  );
  return selected.map((c) => ({ competency: c.id, items: Math.min(perCompetency, itemCounts[c.id] ?? 0) }));
}

function byClosest(rating: number) {
  return (a: EngineItem, b: EngineItem) =>
    Math.abs(a.difficulty - rating) - Math.abs(b.difficulty - rating) || a.id.localeCompare(b.id);
}

/**
 * Adaptive placement item selection for one competency.
 * After a correct answer the next item is harder than the last one, after a wrong answer easier
 * (closest to the current rating within that direction). Falls back to the closest unanswered item.
 */
export function selectPlacementItem(
  items: EngineItem[],
  state: CompetencyState,
  last?: { item: EngineItem; correct: boolean },
): EngineItem | null {
  const unanswered = items.filter((i) => !state.answeredItems.includes(i.id));
  if (unanswered.length === 0) return null;
  if (last) {
    const directional = unanswered.filter((i) =>
      last.correct ? i.difficulty > last.item.difficulty : i.difficulty < last.item.difficulty,
    );
    if (directional.length > 0) return [...directional].sort(byClosest(state.rating))[0]!;
  }
  return [...unanswered].sort(byClosest(state.rating))[0]!;
}

/** Placement for a competency is finished after `max` items or when no items are left. */
export function placementFinished(
  items: EngineItem[],
  answeredInPlacement: number,
  max: number = PLACEMENT_DEFAULT_ITEMS,
): boolean {
  const limit = Math.min(Math.max(max, PLACEMENT_MIN_ITEMS), PLACEMENT_MAX_ITEMS);
  return answeredInPlacement >= limit || answeredInPlacement >= items.length;
}

/**
 * Items for a mastery check at a level: unanswered items first, then previously answered ones,
 * each group ordered by difficulty then id (deterministic).
 */
export function selectMasteryItems(
  items: EngineItem[],
  level: Level,
  state: CompetencyState | undefined,
  count: number = MASTERY_CHECK_ITEMS,
): EngineItem[] {
  const answered = new Set(state?.answeredItems ?? []);
  const atLevel = items
    .filter((i) => i.level === level)
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));
  const fresh = atLevel.filter((i) => !answered.has(i.id));
  const seen = atLevel.filter((i) => answered.has(i.id));
  return [...fresh, ...seen].slice(0, count);
}
