// Public Supabase configuration (Phase 3b: accounts).
// The publishable key is designed to be exposed in the browser; access is
// enforced by Row Level Security in the database. Never put the secret /
// service-role key here or anywhere else in this repository.
export const supabaseConfig = {
  url: 'https://bbyyjrmgmbiscdswufla.supabase.co',
  publishableKey: 'sb_publishable_XCyTUGhvlJIIbC1TgM3I5A_5VFGLzuZ',
  // Accounts stay hidden in production until email sending works (see docs/BLOCKERS.md).
  accountsEnabled: false,
} as const;
