import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LearnerState } from '../src/engine';
import { classifySyncError, diffRows, hasChanges, mergeStates } from '../src/lib/progress-merge';
import { createProgressStore, SYNC_META_KEY, type RemoteApi, type StoreDeps } from '../src/lib/progress-store';
import { rowsToState, stateToRows, type StoredRows } from '../src/lib/progress-rows';
import { STORAGE_KEY } from '../src/lib/storage';

const comp = (rating: number, answered: number, items: string[] = []) => ({
  rating,
  correctByLevel: { foundation: answered, practitioner: 0, advanced: 0 },
  answered,
  answeredItems: items,
});
const base = (over: Partial<LearnerState> = {}): LearnerState => ({
  version: 1,
  roleId: 'it-support',
  selfLevel: 'foundation',
  createdAt: '2026-11-01T10:00:00.000Z',
  placementDone: true,
  competencies: {},
  reviews: {},
  completedUnits: [],
  ...over,
});
const UID = '22222222-2222-4222-8222-222222222222';

describe('mergeStates', () => {
  const ctx = { localChangedAt: '2026-11-10T00:00:00Z', remoteUpdatedAt: '2026-11-05T00:00:00Z' };
  it('returns the other side when one is missing', () => {
    const s = base();
    expect(mergeStates(null, s, ctx)).toBe(s);
    expect(mergeStates(s, null, ctx)).toBe(s);
    expect(mergeStates(null, null, ctx)).toBeNull();
  });
  it('unions competencies, items, reviews and units; never drops local data', () => {
    const local = base({
      competencies: { a: comp(1100, 3, ['i1', 'i2', 'i3']) },
      reviews: { i1: { itemId: 'i1', competency: 'a', box: 1, due: '2026-11-12' } },
      completedUnits: ['u1'],
    });
    const remote = base({
      competencies: { a: comp(1050, 2, ['i1', 'i9']), b: comp(900, 1, ['j1']) },
      reviews: { j1: { itemId: 'j1', competency: 'b', box: 0, due: '2026-11-03' } },
      completedUnits: ['u2'],
    });
    const m = mergeStates(local, remote, ctx)!;
    expect(Object.keys(m.competencies).sort()).toEqual(['a', 'b']);
    expect(m.competencies.a!.answered).toBe(3);
    expect(m.competencies.a!.rating).toBe(1100);
    expect(m.competencies.a!.answeredItems).toEqual(['i1', 'i2', 'i3', 'i9']);
    expect(Object.keys(m.reviews).sort()).toEqual(['i1', 'j1']);
    expect(m.completedUnits).toEqual(['u1', 'u2']);
  });
  it('more answers win per competency regardless of which side is newer', () => {
    const local = base({ competencies: { a: comp(1000, 1) } });
    const remote = base({ competencies: { a: comp(1200, 5) } });
    expect(mergeStates(local, remote, ctx)!.competencies.a!.rating).toBe(1200);
  });
  it('tie on answers: the newer side wins', () => {
    const local = base({ competencies: { a: comp(1000, 2) } });
    const remote = base({ competencies: { a: comp(1200, 2) } });
    expect(mergeStates(local, remote, ctx)!.competencies.a!.rating).toBe(1000);
    expect(mergeStates(local, remote, { localChangedAt: null, remoteUpdatedAt: ctx.remoteUpdatedAt })!.competencies.a!.rating).toBe(1200);
  });
  it('review card: later due date wins', () => {
    const l = base({ reviews: { i: { itemId: 'i', competency: 'a', box: 0, due: '2026-11-02' } } });
    const r = base({ reviews: { i: { itemId: 'i', competency: 'a', box: 2, due: '2026-11-20' } } });
    expect(mergeStates(l, r, ctx)!.reviews.i!.box).toBe(2);
    expect(mergeStates(r, l, ctx)!.reviews.i!.box).toBe(2);
  });
  it('identity: newer side wins; unknown local time loses against a remote profile', () => {
    const local = base({ roleId: 'hr', selfLevel: 'advanced', placementDone: false });
    const remote = base({ roleId: 'it-support', selfLevel: 'foundation', placementDone: true });
    expect(mergeStates(local, remote, ctx)!.roleId).toBe('hr');
    expect(mergeStates(local, remote, ctx)!.placementDone).toBe(false);
    expect(mergeStates(local, remote, { localChangedAt: null, remoteUpdatedAt: ctx.remoteUpdatedAt })!.roleId).toBe('it-support');
  });
  it('same role: placementDone is OR-ed', () => {
    expect(mergeStates(base({ placementDone: false }), base({ placementDone: true }), ctx)!.placementDone).toBe(true);
  });
  it('is idempotent and does not mutate inputs', () => {
    const local = base({ competencies: { a: comp(1100, 3, ['i1']) } });
    const remote = base({ competencies: { a: comp(1000, 1, ['i2']) } });
    const copy = JSON.stringify([local, remote]);
    const m = mergeStates(local, remote, ctx)!;
    expect(JSON.stringify([local, remote])).toBe(copy);
    expect(mergeStates(m, m, ctx)).toEqual(m);
  });
});

describe('diffRows / classifySyncError', () => {
  const s = base({ competencies: { a: comp(1100, 2, ['i1']) }, reviews: { i1: { itemId: 'i1', competency: 'a', box: 0, due: '2026-11-02' } }, completedUnits: ['u1'] });
  it('everything is new when nothing is known; profile patch has no language/goal/minutes', () => {
    const c = diffRows(null, stateToRows(s, UID, 'de'));
    expect(c.progress).toHaveLength(1);
    expect(c.itemResponses).toHaveLength(1);
    expect(c.completedUnits).toHaveLength(1);
    expect(Object.keys(c.profile!).sort()).toEqual(['experience_level', 'id', 'placement_done', 'role_family']);
  });
  it('no changes against identical rows; only changed rows otherwise', () => {
    const prev = stateToRows(s, UID, 'en');
    expect(hasChanges(diffRows(prev, stateToRows(s, UID, 'en')))).toBe(false);
    const next = { ...s, competencies: { ...s.competencies, b: comp(900, 1, ['j1']) }, completedUnits: ['u1', 'u2'] };
    const c = diffRows(prev, stateToRows(next, UID, 'en'));
    expect(c.progress.map((r) => r.competency_id)).toEqual(['b']);
    expect(c.itemResponses.map((r) => r.item_id)).toEqual(['j1']);
    expect(c.completedUnits.map((r) => r.unit_id)).toEqual(['u2']);
    expect(c.profile).toBeNull();
  });
  it('classifies errors', () => {
    expect(classifySyncError(new TypeError('Failed to fetch'))).toBe('offline');
    expect(classifySyncError({ message: 'x' }, false)).toBe('offline');
    expect(classifySyncError({ message: 'x', status: 503 })).toBe('offline');
    expect(classifySyncError({ message: 'new row violates row-level security policy', status: 403 })).toBe('failed');
  });
});

// ------------------------------------------------------------------ store controller with a fake account
class MemStorage {
  m = new Map<string, string>();
  get length() { return this.m.size; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
function fakeRemote(initial: StoredRows, updatedAt: string | null = '2026-11-05T00:00:00Z') {
  const upserts: unknown[] = [];
  const api = {
    fail: null as unknown,
    userId: UID,
    async fetch() { return { rows: initial, updatedAt, hasProfile: initial.profile !== null }; },
    async upsert(changes: unknown, opts: unknown) {
      if (api.fail) throw api.fail;
      upserts.push({ changes, opts });
    },
  };
  return { api: api as RemoteApi & { fail: unknown }, upserts };
}
const EMPTY: StoredRows = { profile: null, progress: [], itemResponses: [], completedUnits: [] };
const deps = (remote: RemoteApi | null, hint = true): StoreDeps => ({
  hasSessionHint: () => hint,
  connect: async () => remote,
  now: () => '2026-11-10T00:00:00.000Z',
  isOnline: () => true,
  debounceMs: 10,
  loadTimeoutMs: 1000,
});

describe('progress store', () => {
  let storage: MemStorage;
  beforeEach(() => {
    storage = new MemStorage();
    vi.stubGlobal('localStorage', storage);
  });
  const seed = (s: LearnerState) => storage.setItem(STORAGE_KEY, JSON.stringify(s));
  const waitFor = async (cond: () => boolean) => { for (let i = 0; i < 100 && !cond(); i++) await new Promise((r) => setTimeout(r, 5)); };

  it('anonymous: localStorage only, no connect, no meta', async () => {
    const connect = vi.fn(async () => null);
    const store = createProgressStore({ ...deps(null, false), connect });
    seed(base());
    expect((await store.load('en'))!.roleId).toBe('it-support');
    store.save(base({ completedUnits: ['u1'] }));
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).completedUnits).toEqual(['u1']);
    expect(connect).not.toHaveBeenCalled();
    expect(storage.getItem(SYNC_META_KEY)).toBeNull();
    expect(store.status).toBe('local');
  });

  it('signed in: loads remote rows into the local cache', async () => {
    const remoteState = base({ competencies: { a: comp(1100, 3, ['i1']) }, completedUnits: ['u9'] });
    const rows = stateToRows(remoteState, UID, 'en');
    const { api } = fakeRemote({
      profile: { role_family: 'it-support', experience_level: 'foundation', placement_done: true, created_at: '2026-11-01T10:00:00.000Z' },
      progress: rows.progress,
      itemResponses: rows.itemResponses,
      completedUnits: rows.completedUnits,
    });
    const store = createProgressStore(deps(api));
    const s = (await store.load('en'))!;
    expect(s.completedUnits).toEqual(['u9']);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).competencies.a.answered).toBe(3);
    expect(store.status).toBe('synced');
  });

  it('write-through: one debounced upsert of only the changed rows', async () => {
    const { api, upserts } = fakeRemote(EMPTY, null);
    const store = createProgressStore(deps(api));
    await store.load('de');
    const s1 = base({ competencies: { a: comp(1100, 1, ['i1']) } });
    store.save(s1);
    store.save({ ...s1, completedUnits: ['u1'] });
    await waitFor(() => store.status === 'synced' && upserts.length > 0);
    expect(upserts).toHaveLength(1);
    const first = upserts[0] as { changes: { progress: unknown[]; completedUnits: unknown[] }; opts: { createProfile: boolean; lang: string } };
    expect(first.opts).toEqual({ createProfile: true, lang: 'de' });
    expect(first.changes.progress).toHaveLength(1);
    store.save({ ...s1, completedUnits: ['u1', 'u2'] });
    await waitFor(() => upserts.length > 1 && store.status === 'synced');
    const second = upserts[1] as { changes: { progress: unknown[]; completedUnits: { unit_id: string }[] }; opts: { createProfile: boolean } };
    expect(second.changes.progress).toHaveLength(0);
    expect(second.changes.completedUnits.map((r) => r.unit_id)).toEqual(['u2']);
    expect(second.opts.createProfile).toBe(false);
    expect(JSON.parse(storage.getItem(SYNC_META_KEY)!).pending).toBe(false);
  });

  it('offline: keeps local data, reports pending, retries successfully', async () => {
    const { api, upserts } = fakeRemote(EMPTY, null);
    api.fail = new TypeError('Failed to fetch');
    const store = createProgressStore(deps(api));
    await store.load('en');
    store.save(base({ completedUnits: ['u1'] }));
    await waitFor(() => store.status === 'pending');
    expect(store.status).toBe('pending');
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).completedUnits).toEqual(['u1']);
    expect(JSON.parse(storage.getItem(SYNC_META_KEY)!).pending).toBe(true);
    api.fail = null;
    await store.retry();
    await waitFor(() => store.status === 'synced');
    expect(store.status).toBe('synced');
    expect(upserts).toHaveLength(1);
  });

  it('server rejection reports failed (not pending) and keeps local data', async () => {
    const { api } = fakeRemote(EMPTY, null);
    api.fail = Object.assign(new Error('row-level security'), { status: 403 });
    const store = createProgressStore(deps(api));
    await store.load('en');
    store.save(base());
    await waitFor(() => store.status === 'failed');
    expect(store.status).toBe('failed');
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('unreachable account on load: shows local copy, status pending', async () => {
    seed(base({ completedUnits: ['u1'] }));
    const store = createProgressStore({ ...deps(null), connect: async () => { throw new TypeError('Failed to fetch'); } });
    expect((await store.load('en'))!.completedUnits).toEqual(['u1']);
    expect(store.status).toBe('pending');
  });

  it('pending changes from an earlier visit are pushed after load', async () => {
    seed(base({ completedUnits: ['u1'] }));
    storage.setItem(SYNC_META_KEY, JSON.stringify({ userId: UID, pending: true, localChangedAt: '2026-11-09T00:00:00Z' }));
    const { api, upserts } = fakeRemote(EMPTY, null);
    const store = createProgressStore(deps(api));
    await store.load('en');
    await waitFor(() => store.status === 'synced' && upserts.length > 0);
    expect(upserts).toHaveLength(1);
  });

  it('a cached copy of another account is not merged into this one', async () => {
    seed(base({ completedUnits: ['other-user-unit'] }));
    storage.setItem(SYNC_META_KEY, JSON.stringify({ userId: 'someone-else', pending: false }));
    const { api } = fakeRemote({
      profile: { role_family: 'hr', experience_level: 'advanced', placement_done: true, created_at: '2026-11-01T10:00:00.000Z' },
      progress: [], itemResponses: [], completedUnits: [{ unit_id: 'mine' }],
    });
    const store = createProgressStore(deps(api));
    const s = (await store.load('en'))!;
    expect(s.completedUnits).toEqual(['mine']);
  });

  it('clear removes the local copy and meta only', async () => {
    const { api, upserts } = fakeRemote(EMPTY, null);
    const store = createProgressStore(deps(api));
    await store.load('en');
    seed(base());
    store.clear();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(storage.getItem(SYNC_META_KEY)).toBeNull();
    expect(upserts).toHaveLength(0);
  });

  it('remote rows round-trip through the merge', () => {
    const s = base({ competencies: { a: comp(1100, 2, ['i1']) }, completedUnits: ['u1'] });
    const rows = stateToRows(s, UID, 'en');
    const back = rowsToState({ profile: { role_family: rows.profile.role_family, experience_level: rows.profile.experience_level, placement_done: true }, progress: rows.progress, itemResponses: rows.itemResponses, completedUnits: rows.completedUnits }, s.createdAt)!;
    expect(mergeStates(s, { ...back, createdAt: s.createdAt }, { localChangedAt: null, remoteUpdatedAt: null })!.competencies.a!.answered).toBe(2);
  });
});
