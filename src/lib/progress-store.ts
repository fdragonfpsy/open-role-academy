// One place where learner progress is loaded and saved.
//  - No stored session (or accounts disabled at build time): localStorage exactly as before, no network, no extra code.
//  - Signed in: localStorage stays the cache; changes are written through to the account (debounced upserts),
//    the account's rows are merged in on load (see progress-merge.ts). Offline/errors never block the learner.
import type { LearnerState } from '../engine';
import { classifySyncError, diffRows, hasChanges, mergeStates, type RowChanges } from './progress-merge';
import { rowsToState, stateToRows, type ProgressRows, type StoredRows } from './progress-rows';
import { clearState, loadState, saveState } from './storage';

declare const __ACCOUNTS_ENABLED__: boolean | undefined;
/** Build-time flag (vite define). False in the default build, so the dynamic import below is dropped. */
const ACCOUNTS = typeof __ACCOUNTS_ENABLED__ !== 'undefined' && __ACCOUNTS_ENABLED__;

export const SYNC_META_KEY = 'open-role-academy.sync.v1';

/** local = anonymous (nothing shown); syncing; synced; pending = offline/unreachable, will retry; failed = rejected. */
export type SyncStatus = 'local' | 'syncing' | 'synced' | 'pending' | 'failed';

export interface RemoteApi {
  userId: string;
  fetch(): Promise<{ rows: StoredRows; updatedAt: string | null; hasProfile: boolean }>;
  upsert(changes: RowChanges, opts: { lang: 'en' | 'de'; createProfile: boolean }): Promise<void>;
}

export interface StoreDeps {
  /** Cheap synchronous check: is there a stored session worth connecting for? */
  hasSessionHint(): boolean;
  /** Connect to the account; null = no session. */
  connect(): Promise<RemoteApi | null>;
  now(): string;
  isOnline(): boolean;
  debounceMs: number;
  /** Max time `load` waits for the account before showing this browser's copy. */
  loadTimeoutMs: number;
}

export interface Snapshot {
  status: SyncStatus;
  /** Present only when the store changed the state itself (merge on load, clear). */
  state?: LearnerState | null;
}

interface Meta {
  userId?: string;
  pending: boolean;
  localChangedAt?: string;
}

function readMeta(): Meta {
  try {
    const raw = JSON.parse(localStorage.getItem(SYNC_META_KEY) ?? 'null') as Partial<Meta> | null;
    return { userId: typeof raw?.userId === 'string' ? raw.userId : undefined, pending: raw?.pending === true, localChangedAt: typeof raw?.localChangedAt === 'string' ? raw.localChangedAt : undefined };
  } catch {
    return { pending: false };
  }
}
function writeMeta(meta: Meta): void {
  try {
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
  } catch {
    /* cache only; ignore */
  }
}

export function sessionHint(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) if (/^sb-[a-z0-9]+-auth-token/.test(localStorage.key(i) ?? '')) return true;
  } catch {
    /* storage blocked */
  }
  return false;
}

export function createProgressStore(deps: StoreDeps) {
  let status: SyncStatus = 'local';
  let remote: RemoteApi | null = null;
  let lastRows: ProgressRows | null = null;
  let hasProfile = false;
  let ready: Promise<void> | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let version = 0;
  let lang: 'en' | 'de' = 'en';
  const listeners = new Set<(s: Snapshot) => void>();

  const emit = (s: Snapshot) => listeners.forEach((l) => l(s));
  const setStatus = (next: SyncStatus, extra: Omit<Snapshot, 'status'> = {}) => {
    status = next;
    emit({ status, ...extra });
  };
  const fail = (e: unknown) => setStatus(classifySyncError(e, deps.isOnline()) === 'offline' ? 'pending' : 'failed');

  /** Connect, read the account's rows and merge them into the local copy. */
  async function connectAndMerge(): Promise<void> {
    const meta = readMeta();
    const conn = await deps.connect();
    if (!conn) {
      remote = null;
      return setStatus('local');
    }
    const { rows, updatedAt, hasProfile: hp } = await conn.fetch();
    const remoteState = rowsToState(rows, deps.now());
    const sameAccount = !meta.userId || meta.userId === conn.userId;
    const local = loadState();
    // A cached copy that belongs to another account is not merged into this one (shared browser).
    const merged = mergeStates(sameAccount ? local : null, remoteState, { localChangedAt: meta.localChangedAt ?? null, remoteUpdatedAt: updatedAt });
    remote = conn;
    hasProfile = hp;
    lastRows = remoteState ? stateToRows(remoteState, conn.userId, lang) : null;
    const changed = JSON.stringify(merged) !== JSON.stringify(local);
    if (merged && changed) saveState(merged);
    writeMeta({ userId: conn.userId, pending: sameAccount && meta.pending, localChangedAt: sameAccount ? meta.localChangedAt : undefined });
    setStatus(sameAccount && meta.pending ? 'syncing' : 'synced', changed ? { state: merged } : {});
  }

  const sync = async (): Promise<void> => {
    try {
      await (ready ??= connectAndMerge());
    } catch (e) {
      ready = null;
      return fail(e);
    }
    if (readMeta().pending) await push();
  };

  async function push(): Promise<void> {
    clearTimeout(timer);
    try {
      await (ready ??= connectAndMerge());
      if (!remote) return;
      const v = version;
      const state = loadState();
      if (state) {
        const rows = stateToRows(state, remote.userId, lang);
        const changes = diffRows(lastRows, rows);
        if (hasChanges(changes)) await remote.upsert(changes, { lang, createProfile: !hasProfile });
        lastRows = rows;
        hasProfile = true;
      }
      if (v === version) {
        writeMeta({ ...readMeta(), userId: remote.userId, pending: false });
        setStatus('synced');
      } else {
        schedule();
      }
    } catch (e) {
      ready = ready && remote ? ready : null;
      fail(e);
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => void push(), deps.debounceMs);
  }

  return {
    get status() {
      return status;
    },
    subscribe(l: (s: Snapshot) => void): () => void {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    /** Local copy right away when anonymous; with a stored session also waits (bounded) for the account merge. */
    async load(language: 'en' | 'de'): Promise<LearnerState | null> {
      lang = language;
      if (!deps.hasSessionHint()) return loadState();
      setStatus('syncing');
      await Promise.race([sync(), new Promise<void>((r) => setTimeout(r, deps.loadTimeoutMs))]);
      return loadState();
    },
    /** Write-through: local first (synchronous, as before), then a debounced upsert when signed in. */
    save(state: LearnerState): void {
      saveState(state);
      if (!remote && !deps.hasSessionHint()) return;
      version++;
      writeMeta({ ...readMeta(), pending: true, localChangedAt: deps.now() });
      setStatus('syncing');
      schedule();
    },
    /** Remove this browser's copy. The account's data is kept (deleting it is done on the account page). */
    clear(): void {
      clearTimeout(timer);
      clearState();
      try {
        localStorage.removeItem(SYNC_META_KEY);
      } catch {
        /* ignore */
      }
      emit({ status, state: null });
    },
    /** Retry after an offline or failed attempt. */
    retry(): Promise<void> {
      setStatus('syncing');
      return sync();
    },
  };
}

let singleton: ReturnType<typeof createProgressStore> | null = null;

/** The store used by the islands. Dependencies are real here; tests build their own with createProgressStore. */
export function getProgressStore() {
  if (singleton) return singleton;
  singleton = createProgressStore({
    hasSessionHint: () => ACCOUNTS && sessionHint(),
    connect: async () => {
      if (!ACCOUNTS) return null;
      const { connectRemote } = await import('./progress-sync');
      return connectRemote();
    },
    now: () => new Date().toISOString(),
    isOnline: () => typeof navigator === 'undefined' || navigator.onLine !== false,
    debounceMs: 800,
    loadTimeoutMs: 6000,
  });
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      if (singleton && (singleton.status === 'pending' || singleton.status === 'failed')) void singleton.retry();
    });
  }
  return singleton;
}
