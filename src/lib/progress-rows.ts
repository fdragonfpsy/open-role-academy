// Pure mapping between the engine's LearnerState and the Supabase rows (supabase/migrations/*init_profiles_progress*).
// No network, no Supabase import. Used by the account UI's "import local progress" offer.
import { LEVELS, type LearnerState, type Level, type ReviewCard } from '../engine';

const ID_RE = /^[a-z0-9-]+$/;
const MAX = { role: 60, competency: 80, item: 120, unit: 160 } as const;

export interface ProfileRow {
  id: string;
  role_family: string;
  experience_level: Level;
  preferred_language: 'en' | 'de';
  placement_done: boolean;
}
export interface ProgressRow {
  user_id: string;
  competency_id: string;
  rating: number;
  correct_by_level: Record<Level, number>;
  answered: number;
}
export interface ItemResponseRow {
  user_id: string;
  item_id: string;
  competency_id: string;
  phase: 'placement' | 'learning' | 'review';
  correct: boolean;
  box: number | null;
  due_on: string | null;
}
export interface CompletedUnitRow {
  user_id: string;
  unit_id: string;
}
export interface ProgressRows {
  profile: ProfileRow;
  progress: ProgressRow[];
  itemResponses: ItemResponseRow[];
  completedUnits: CompletedUnitRow[];
}

/** Row shapes as read back from the database (numeric columns may arrive as strings). */
export interface StoredRows {
  profile: { role_family: string | null; experience_level: Level | null; placement_done: boolean; created_at?: string } | null;
  progress: { competency_id: string; rating: number | string; correct_by_level: Partial<Record<Level, number>>; answered: number }[];
  itemResponses: { item_id: string; competency_id: string; box: number | null; due_on: string | null }[];
  completedUnits: { unit_id: string }[];
}

function checkId(kind: keyof typeof MAX, id: string): string {
  if (!ID_RE.test(id) || id.length > MAX[kind]) throw new RangeError(`Invalid ${kind} id: ${id.slice(0, 40)}`);
  return id;
}

/** Engine state -> rows. `correct` is best effort: the engine stores no per-item result, only that a review card exists (created after a correct answer). */
export function stateToRows(state: LearnerState, userId: string, lang: 'en' | 'de'): ProgressRows {
  const progress: ProgressRow[] = Object.entries(state.competencies)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, c]) => ({
      user_id: userId,
      competency_id: checkId('competency', id),
      rating: Math.min(3000, Math.max(0, Math.round(c.rating * 100) / 100)),
      correct_by_level: { foundation: c.correctByLevel.foundation, practitioner: c.correctByLevel.practitioner, advanced: c.correctByLevel.advanced },
      answered: c.answered,
    }));

  const byItem = new Map<string, { competency: string; card?: ReviewCard }>();
  for (const [competency, c] of Object.entries(state.competencies)) {
    for (const itemId of c.answeredItems) byItem.set(itemId, { competency });
  }
  for (const card of Object.values(state.reviews)) byItem.set(card.itemId, { competency: card.competency, card });

  const itemResponses: ItemResponseRow[] = [...byItem.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([itemId, v]) => ({
      user_id: userId,
      item_id: checkId('item', itemId),
      competency_id: checkId('competency', v.competency),
      phase: v.card ? 'review' : 'learning',
      correct: v.card !== undefined,
      box: v.card ? v.card.box : null,
      due_on: v.card ? v.card.due : null,
    }));

  return {
    profile: {
      id: userId,
      role_family: checkId('role', state.roleId),
      experience_level: state.selfLevel,
      preferred_language: lang,
      placement_done: state.placementDone,
    },
    progress,
    itemResponses,
    completedUnits: [...new Set(state.completedUnits)].sort().map((u) => ({ user_id: userId, unit_id: checkId('unit', u) })),
  };
}

/** Rows -> engine state. Returns null when the profile has no role/level yet (nothing to restore). */
export function rowsToState(rows: StoredRows, fallbackCreatedAt: string): LearnerState | null {
  const p = rows.profile;
  if (!p || !p.role_family || !p.experience_level) return null;
  const competencies: LearnerState['competencies'] = {};
  for (const r of rows.progress) {
    const cbl = r.correct_by_level;
    competencies[r.competency_id] = {
      rating: Number(r.rating),
      correctByLevel: Object.fromEntries(LEVELS.map((l) => [l, cbl[l] ?? 0])) as Record<Level, number>,
      answered: r.answered,
      answeredItems: [],
    };
  }
  const reviews: LearnerState['reviews'] = {};
  for (const r of rows.itemResponses) {
    const c = (competencies[r.competency_id] ??= {
      rating: 0,
      correctByLevel: { foundation: 0, practitioner: 0, advanced: 0 },
      answered: 0,
      answeredItems: [],
    });
    c.answeredItems.push(r.item_id);
    if (r.box !== null && r.due_on !== null) reviews[r.item_id] = { itemId: r.item_id, competency: r.competency_id, box: r.box, due: r.due_on };
  }
  for (const c of Object.values(competencies)) c.answeredItems.sort();
  return {
    version: 1,
    roleId: p.role_family,
    selfLevel: p.experience_level,
    createdAt: p.created_at ?? fallbackCreatedAt,
    placementDone: p.placement_done,
    competencies,
    reviews,
    completedUnits: rows.completedUnits.map((u) => u.unit_id).sort(),
  };
}
