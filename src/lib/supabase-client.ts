// Lazy Supabase client. supabase-js is imported dynamically and ONLY from the account island, so it is
// never part of any page when accounts are disabled (no account page is generated then).
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';

let client: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
      // Session lives in localStorage (no cookies); email links are parsed from the URL fragment.
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  );
  return client;
}
