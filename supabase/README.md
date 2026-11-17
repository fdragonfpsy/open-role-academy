# Supabase schema

Project: `open-role-academy` (EU region). The repo holds only SQL; no keys. Never put the service-role/secret key anywhere in this repo.

## Applying migrations (owner)

Migrations are applied by the owner, in timestamp order, each once:

1. **SQL editor:** Dashboard > SQL Editor > paste the file from `supabase/migrations/` > Run.
2. **GitHub integration:** Dashboard > Project Settings > Integrations > GitHub, point it at this repo with `supabase` as the directory; it applies new migrations on `main`.

Check `docs/STATUS.md` for the pending migration.

## Objects (`20261117210000_init_profiles_progress.sql`)

| Object | Purpose |
|---|---|
| `profiles` | Optional profile: role family, experience level, goal, weekly minutes, language, placement flag. No name, employer or birth date. |
| `progress` | Per user and competency: Elo rating, correct counts per level, answered count (engine `CompetencyState`). |
| `item_responses` | Per user and item: latest answer, phase, Leitner `box` (0..3) and `due_on` (engine `ReviewCard`). |
| `completed_units` | Units the learner finished. |
| `set_updated_at()` | Trigger function for `updated_at`. |
| `export_my_data()` | GDPR Art. 15/20: caller's rows as jsonb (security invoker). |
| `delete_my_account()` | GDPR Art. 17: deletes the caller's `auth.users` row; cascade removes all data (security definer). |

## RLS design

- RLS is enabled on every table; no policy for `anon`, so anonymous requests see nothing.
- One policy per operation, `to authenticated`, restricted to `user_id = (select auth.uid())` (`id` for profiles). The `(select ...)` form lets Postgres evaluate it once per statement.
- Insert/update use `with check` so a user cannot write rows for someone else.
- Grants are explicit and only to `authenticated` (new tables are not exposed automatically). `anon` and `public` are revoked.
- Account deletion relies on `on delete cascade` from `auth.users`.
- `delete_my_account()` is the only security definer object: empty `search_path`, schema-qualified names, executable by `authenticated` only.

Manual verification: `supabase/tests/rls_checklist.md`. Static checks: `tests/supabase-migrations.test.ts`.
