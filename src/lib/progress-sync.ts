// Remote side of progress sync. Imported ONLY via dynamic import from progress-store.ts and only when
// accounts are enabled at build time and a stored session exists, so the default build never contains it.
import { getSupabase } from './supabase-client';
import { hasChanges, type RowChanges } from './progress-merge';
import type { StoredRows } from './progress-rows';
import type { RemoteApi } from './progress-store';

const PAGE = 1000;
const CHUNK = 500;

function unwrap<T>(res: { data: T | null; error: { message: string; code?: string } | null; status?: number }): T | null {
  if (res.error) throw Object.assign(new Error(res.error.message), { status: res.status, code: res.error.code });
  return res.data;
}

/** Connect to the signed-in account. Returns null when there is no session. */
export async function connectRemote(): Promise<RemoteApi | null> {
  const sb = await getSupabase();
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;

  /** Read all rows of a table (PostgREST caps one response, so page through). */
  async function all<T>(table: 'progress' | 'item_responses' | 'completed_units', columns: string): Promise<T[]> {
    const out: T[] = [];
    for (let from = 0; ; from += PAGE) {
      const rows = unwrap(await sb.from(table).select(columns).order(table === 'progress' ? 'competency_id' : table === 'completed_units' ? 'unit_id' : 'item_id').range(from, from + PAGE - 1)) as unknown as T[] | null;
      out.push(...(rows ?? []));
      if (!rows || rows.length < PAGE) return out;
    }
  }

  return {
    userId: user.id,
    async fetch() {
      const profile = unwrap(
        await sb.from('profiles').select('role_family,experience_level,placement_done,created_at,updated_at').eq('id', user.id).maybeSingle(),
      ) as (StoredRows['profile'] & { updated_at?: string }) | null;
      const [progress, itemResponses, completedUnits] = await Promise.all([
        all<StoredRows['progress'][number]>('progress', 'competency_id,rating,correct_by_level,answered'),
        all<StoredRows['itemResponses'][number]>('item_responses', 'item_id,competency_id,box,due_on'),
        all<StoredRows['completedUnits'][number]>('completed_units', 'unit_id'),
      ]);
      return { rows: { profile, progress, itemResponses, completedUnits }, updatedAt: profile?.updated_at ?? null, hasProfile: profile !== null };
    },
    async upsert(changes: RowChanges, opts) {
      if (!hasChanges(changes)) return;
      if (changes.profile) {
        // preferred_language is only set when the row is created; later it belongs to the profile form.
        const row = opts.createProfile ? { ...changes.profile, preferred_language: opts.lang } : changes.profile;
        unwrap(await sb.from('profiles').upsert(row, { onConflict: 'id' }));
      }
      for (let i = 0; i < changes.progress.length; i += CHUNK) {
        unwrap(await sb.from('progress').upsert(changes.progress.slice(i, i + CHUNK), { onConflict: 'user_id,competency_id' }));
      }
      for (let i = 0; i < changes.itemResponses.length; i += CHUNK) {
        unwrap(await sb.from('item_responses').upsert(changes.itemResponses.slice(i, i + CHUNK), { onConflict: 'user_id,item_id' }));
      }
      for (let i = 0; i < changes.completedUnits.length; i += CHUNK) {
        unwrap(await sb.from('completed_units').upsert(changes.completedUnits.slice(i, i + CHUNK), { onConflict: 'user_id,unit_id', ignoreDuplicates: true }));
      }
    },
  };
}
