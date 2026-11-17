// Pure logic for syncing progress between this browser and a signed-in account. No network, no storage.
// Merge policy (see docs/DECISIONS.md, "Dashboard sync"): union of everything, never delete local data.
import type { CompetencyState, LearnerState, ReviewCard } from '../engine';
import type { CompletedUnitRow, ItemResponseRow, ProfileRow, ProgressRow, ProgressRows } from './progress-rows';

export interface MergeContext {
  /** When this browser's copy last changed (ISO). Null = unknown (older local data). */
  localChangedAt: string | null;
  /** `updated_at` of the remote profile row (ISO). Null = no profile row. */
  remoteUpdatedAt: string | null;
}

const time = (iso: string | null | undefined): number => {
  const n = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(n) ? 0 : n;
};

function pickCompetency(a: CompetencyState, b: CompetencyState, preferA: boolean): CompetencyState {
  // `answered` only ever grows, so more answers = more recent evidence. Tie: the newer side wins.
  const winner = a.answered > b.answered ? a : b.answered > a.answered ? b : preferA ? a : b;
  return {
    rating: winner.rating,
    correctByLevel: { ...winner.correctByLevel },
    answered: winner.answered,
    answeredItems: [...new Set([...a.answeredItems, ...b.answeredItems])].sort(),
  };
}

function pickReview(a: ReviewCard, b: ReviewCard, preferA: boolean): ReviewCard {
  // A later due date means the item was answered later (boxes only advance by answering).
  if (a.due !== b.due) return a.due > b.due ? a : b;
  if (a.box !== b.box) return a.box > b.box ? a : b;
  return preferA ? a : b;
}

/**
 * Merge this browser's state with the account's state.
 * - Identity (role, self level, createdAt): the newer side wins (local time vs remote profile `updated_at`).
 *   Without a local timestamp the local copy is treated as older than any remote profile.
 * - `placementDone`: OR when the role is the same, else taken from the winning side.
 * - Competencies: union; per competency the side with more answers wins; answered item ids are unioned.
 * - Review cards: union; per item the later due date wins.
 * - Completed units: union.
 * Nothing present on either side is dropped (except a competency/review superseded by its newer version).
 */
export function mergeStates(local: LearnerState | null, remote: LearnerState | null, ctx: MergeContext): LearnerState | null {
  if (!local) return remote;
  if (!remote) return local;
  const localNewer = time(ctx.localChangedAt) > 0 && time(ctx.localChangedAt) >= time(ctx.remoteUpdatedAt);
  const id = localNewer ? local : remote;
  const placementDone = local.roleId === remote.roleId ? local.placementDone || remote.placementDone : id.placementDone;

  const competencies: LearnerState['competencies'] = {};
  for (const key of new Set([...Object.keys(local.competencies), ...Object.keys(remote.competencies)])) {
    const a = local.competencies[key];
    const b = remote.competencies[key];
    competencies[key] = a && b ? pickCompetency(a, b, localNewer) : structuredClone((a ?? b)!);
  }
  const reviews: LearnerState['reviews'] = {};
  for (const key of new Set([...Object.keys(local.reviews), ...Object.keys(remote.reviews)])) {
    const a = local.reviews[key];
    const b = remote.reviews[key];
    reviews[key] = { ...(a && b ? pickReview(a, b, localNewer) : (a ?? b)!) };
  }
  return {
    version: 1,
    roleId: id.roleId,
    selfLevel: id.selfLevel,
    createdAt: id.createdAt,
    placementDone,
    competencies,
    reviews,
    completedUnits: [...new Set([...local.completedUnits, ...remote.completedUnits])].sort(),
  };
}

/** Rows that must be written. Only new or changed rows; nothing is ever deleted remotely. */
export interface RowChanges {
  /** Patch of the 3 progress-owned profile columns; null when unchanged. Never carries goal/minutes/language. */
  profile: Pick<ProfileRow, 'id' | 'role_family' | 'experience_level' | 'placement_done'> | null;
  progress: ProgressRow[];
  itemResponses: ItemResponseRow[];
  completedUnits: CompletedUnitRow[];
}

export const hasChanges = (c: RowChanges): boolean =>
  c.profile !== null || c.progress.length > 0 || c.itemResponses.length > 0 || c.completedUnits.length > 0;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Diff the rows of `next` against the rows known to be on the server (`prev`, null = nothing known). */
export function diffRows(prev: ProgressRows | null, next: ProgressRows): RowChanges {
  const prevProgress = new Map(prev?.progress.map((r) => [r.competency_id, r]));
  const prevItems = new Map(prev?.itemResponses.map((r) => [r.item_id, r]));
  const prevUnits = new Set(prev?.completedUnits.map((r) => r.unit_id));
  const p = next.profile;
  const q = prev?.profile;
  const profileSame = !!q && q.role_family === p.role_family && q.experience_level === p.experience_level && q.placement_done === p.placement_done;
  return {
    profile: profileSame ? null : { id: p.id, role_family: p.role_family, experience_level: p.experience_level, placement_done: p.placement_done },
    progress: next.progress.filter((r) => !same(prevProgress.get(r.competency_id), r)),
    itemResponses: next.itemResponses.filter((r) => !same(prevItems.get(r.item_id), r)),
    completedUnits: next.completedUnits.filter((r) => !prevUnits.has(r.unit_id)),
  };
}

export type SyncKind = 'offline' | 'failed';

/** Network trouble and 5xx mean "will sync later"; anything else (RLS, validation, 4xx) is a real failure. */
export function classifySyncError(e: unknown, online = true): SyncKind {
  if (!online) return 'offline';
  const err = (e ?? {}) as { message?: unknown; status?: unknown; name?: unknown };
  const msg = typeof err.message === 'string' ? err.message : '';
  if (e instanceof TypeError || /failed to fetch|network ?error|load failed|fetch failed|timeout|timed out/i.test(msg)) return 'offline';
  if (typeof err.status === 'number' && (err.status >= 500 || err.status === 0)) return 'offline';
  return 'failed';
}
