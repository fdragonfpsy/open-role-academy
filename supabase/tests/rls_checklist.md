# RLS manual checklist

Run after applying a migration, with two test users A and B (create via the app; use throwaway addresses). Use the SQL editor with `set local role authenticated; set local request.jwt.claims = '{"sub":"<uid>"}';` or the app itself.

- [ ] As anon (no JWT): `select` on each table returns 0 rows or permission denied.
- [ ] As A: insert own profile, progress, item_responses, completed_units rows: succeeds.
- [ ] As A: insert a row with `user_id` = B: fails (RLS violation).
- [ ] As A: `select` returns only A's rows; B's rows are invisible.
- [ ] As A: update/delete B's row: affects 0 rows.
- [ ] As A: update own `user_id` to B: fails.
- [ ] `profiles.updated_at` changes after an update.
- [ ] Constraint checks: `experience_level = 'expert'`, `preferred_language = 'fr'`, `weekly_minutes = -1`, `box = 4`, `box` set but `due_on` null: all rejected.
- [ ] `select public.export_my_data()` as A returns only A's data in all four sections.
- [ ] `export_my_data()` as anon: permission denied.
- [ ] `delete_my_account()` as anon: permission denied.
- [ ] `delete_my_account()` as A: A's auth user and all rows in the four tables are gone; B's data is untouched.
- [ ] Dashboard > Database > Advisors shows no "RLS disabled" warning for `public` tables.
