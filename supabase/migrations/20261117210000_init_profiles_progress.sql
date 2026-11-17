-- Open Role Academy: initial schema (profiles, progress, item responses, completed units).
-- Data minimisation: no name, no employer, no birth date. Email lives only in auth.users.
-- Every table: RLS on, own-rows-only policies, explicit grants to `authenticated` only.
-- Every user_id/id references auth.users ON DELETE CASCADE, so deleting the auth user erases everything.

-- Shared trigger function: keeps updated_at current on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- profiles
-- One optional profile row per user (Phase 3b onboarding fields only).
create table public.profiles (
  -- Same id as the auth user; cascade = account deletion removes the profile.
  id uuid primary key references auth.users (id) on delete cascade,
  -- Free-text role family id (e.g. 'it-support'); validated by the app against content.
  role_family text check (role_family is null or role_family ~ '^[a-z0-9-]{1,60}$'),
  -- Self-rated level, same ids as the engine's Level type.
  experience_level text check (experience_level is null or experience_level in ('foundation', 'practitioner', 'advanced')),
  -- Optional short learning goal, length-limited.
  learning_goal text check (learning_goal is null or char_length(learning_goal) <= 500),
  -- Weekly time budget in minutes, bounded to one week.
  weekly_minutes integer check (weekly_minutes is null or weekly_minutes between 0 and 10080),
  -- UI / content language.
  preferred_language text not null default 'en' check (preferred_language in ('en', 'de')),
  -- Engine flag: placement check finished (LearnerState.placementDone).
  placement_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Optional learner profile. No name, employer or birth date by design.';

-- ---------------------------------------------------------------- progress
-- One row per user and competency (engine CompetencyState).
create table public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  competency_id text not null check (competency_id ~ '^[a-z0-9-]{1,80}$'),
  -- Elo-style ability theta (docs/ENGINE.md); generous bounds guard against garbage.
  rating numeric(7, 2) not null check (rating between 0 and 3000),
  -- Correct answers per level, e.g. {"foundation":2,"practitioner":0,"advanced":0}.
  correct_by_level jsonb not null default '{"foundation":0,"practitioner":0,"advanced":0}'::jsonb
    check (
      jsonb_typeof(correct_by_level) = 'object'
      and correct_by_level ?& array['foundation', 'practitioner', 'advanced']
    ),
  -- Total answered items (CompetencyState.answered).
  answered integer not null default 0 check (answered >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, competency_id)
);
comment on table public.progress is 'Per-competency ability and correct counts (engine CompetencyState).';

-- ---------------------------------------------------------------- item_responses
-- One row per user and item: latest answer plus Leitner review state (engine ReviewCard).
create table public.item_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id text not null check (item_id ~ '^[a-z0-9-]{1,120}$'),
  competency_id text not null check (competency_id ~ '^[a-z0-9-]{1,80}$'),
  -- Phase in which the item was last answered.
  phase text not null default 'learning' check (phase in ('placement', 'learning', 'review')),
  -- Was the latest answer correct?
  correct boolean not null,
  answered_at timestamptz not null default now(),
  -- Leitner box 0..3 (intervals 1, 3, 7, 21 days); null = item is not a review card.
  box smallint check (box is null or box between 0 and 3),
  -- Date when the review is due (ReviewCard.due); null together with box.
  due_on date,
  constraint item_responses_review_state check ((box is null) = (due_on is null)),
  constraint item_responses_user_item_unique unique (user_id, item_id)
);
comment on table public.item_responses is 'Latest answer per item plus Leitner review state.';
-- Fast review queue lookup: due cards of one user.
create index item_responses_user_due_idx on public.item_responses (user_id, due_on) where due_on is not null;
-- Fast per-competency lookups.
create index item_responses_user_competency_idx on public.item_responses (user_id, competency_id);

-- ---------------------------------------------------------------- completed_units
-- Units the learner finished (LearnerState.completedUnits).
create table public.completed_units (
  user_id uuid not null references auth.users (id) on delete cascade,
  unit_id text not null check (unit_id ~ '^[a-z0-9-]{1,160}$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);
comment on table public.completed_units is 'Units the learner has completed.';

-- ---------------------------------------------------------------- updated_at triggers
-- Keep updated_at honest on the tables that have it.
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger progress_set_updated_at before update on public.progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- row level security
-- Enable RLS on every table: without a matching policy no row is visible.
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.item_responses enable row level security;
alter table public.completed_units enable row level security;

-- Policies: authenticated users reach only their own rows.
-- (select auth.uid()) is evaluated once per statement instead of once per row.

-- profiles: keyed by id.
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_delete_own on public.profiles for delete to authenticated
  using (id = (select auth.uid()));

-- progress: keyed by user_id.
create policy progress_select_own on public.progress for select to authenticated
  using (user_id = (select auth.uid()));
create policy progress_insert_own on public.progress for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy progress_update_own on public.progress for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy progress_delete_own on public.progress for delete to authenticated
  using (user_id = (select auth.uid()));

-- item_responses: keyed by user_id.
create policy item_responses_select_own on public.item_responses for select to authenticated
  using (user_id = (select auth.uid()));
create policy item_responses_insert_own on public.item_responses for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy item_responses_update_own on public.item_responses for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy item_responses_delete_own on public.item_responses for delete to authenticated
  using (user_id = (select auth.uid()));

-- completed_units: keyed by user_id (no update: rows are insert/delete only).
create policy completed_units_select_own on public.completed_units for select to authenticated
  using (user_id = (select auth.uid()));
create policy completed_units_insert_own on public.completed_units for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy completed_units_delete_own on public.completed_units for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------- grants
-- New tables are not exposed to the Data API automatically: grant explicitly, to `authenticated` only.
-- Defensive: remove any default privileges that may exist for anon/public.
revoke all on public.profiles, public.progress, public.item_responses, public.completed_units from anon, public;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.progress to authenticated;
grant select, insert, update, delete on public.item_responses to authenticated;
grant select, insert, delete on public.completed_units to authenticated;

-- ---------------------------------------------------------------- GDPR functions
-- Art. 15 / 20: export everything stored about the caller as one JSON document.
-- SECURITY INVOKER: RLS applies, so the caller can only ever see their own rows.
create or replace function public.export_my_data()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'exported_at', now(),
    'user_id', (select auth.uid()),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = (select auth.uid())),
    'progress', coalesce((select jsonb_agg(to_jsonb(g) order by g.competency_id) from public.progress g where g.user_id = (select auth.uid())), '[]'::jsonb),
    'item_responses', coalesce((select jsonb_agg(to_jsonb(r) order by r.item_id) from public.item_responses r where r.user_id = (select auth.uid())), '[]'::jsonb),
    'completed_units', coalesce((select jsonb_agg(to_jsonb(c) order by c.unit_id) from public.completed_units c where c.user_id = (select auth.uid())), '[]'::jsonb)
  );
$$;
comment on function public.export_my_data() is 'GDPR Art. 15/20: returns the caller''s own data as jsonb.';

-- Art. 17: delete the caller's auth user; ON DELETE CASCADE removes all rows above.
-- SECURITY DEFINER because authenticated users cannot touch auth.users; empty search_path + qualified names.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  -- Refuse when there is no authenticated caller.
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  -- Only ever the caller's own row.
  delete from auth.users where id = uid;
end;
$$;
comment on function public.delete_my_account() is 'GDPR Art. 17: deletes the caller''s account and, by cascade, all their data.';

-- Functions are executable by PUBLIC by default: lock down, then allow authenticated only.
revoke all on function public.export_my_data() from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.export_my_data() to authenticated;
grant execute on function public.delete_my_account() to authenticated;
