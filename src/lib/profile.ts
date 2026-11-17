// Pure helpers for the optional learner profile (table `profiles`). No network, no Supabase import.
// Data minimisation: only the fields below are ever written; no name, employer or birth date.
import type { Lang } from '../config/site';
import type { UiKey } from '../i18n';
import { LEVELS, type Level } from '../engine';

export const GOAL_MAX = 500;
export const MINUTES_MAX = 10080;
export const MINUTES_PRESETS = [30, 60, 120, 300] as const;
const ROLE_RE = /^[a-z0-9-]{1,60}$/;

/** What the form edits. Everything is a string/empty so the UI can bind inputs directly. */
export interface ProfileForm {
  roleFamily: string;
  level: Level | '';
  goal: string;
  weeklyMinutes: string;
  language: Lang;
}

/** The exact set of columns the app writes to `profiles` from the profile form (never placement_done). */
export interface ProfilePatch {
  id: string;
  role_family: string | null;
  experience_level: Level | null;
  learning_goal: string | null;
  weekly_minutes: number | null;
  preferred_language: Lang;
}
export const PROFILE_COLUMNS = ['id', 'role_family', 'experience_level', 'learning_goal', 'weekly_minutes', 'preferred_language'] as const;
export const PROFILE_SELECT = PROFILE_COLUMNS.join(',');

export type ProfileErrorKey = Extract<UiKey, `profile.err.${string}`>;
export type ProfileField = 'roleFamily' | 'level' | 'goal' | 'weeklyMinutes' | 'language';
export type ProfileErrors = Partial<Record<ProfileField, ProfileErrorKey>>;

export function emptyProfileForm(lang: Lang): ProfileForm {
  return { roleFamily: '', level: '', goal: '', weeklyMinutes: '', language: lang };
}

/** Length as the database counts it (code points, like Postgres char_length). */
export function goalLength(goal: string): number {
  return [...goal].length;
}

export function validateProfile(form: ProfileForm, roleIds: readonly string[]): ProfileErrors {
  const errors: ProfileErrors = {};
  if (form.roleFamily !== '' && !(ROLE_RE.test(form.roleFamily) && roleIds.includes(form.roleFamily))) errors.roleFamily = 'profile.err.role';
  if (form.level !== '' && !LEVELS.includes(form.level)) errors.level = 'profile.err.level';
  if (goalLength(form.goal.trim()) > GOAL_MAX) errors.goal = 'profile.err.goalLong';
  const m = form.weeklyMinutes.trim();
  if (m !== '') {
    const n = Number(m);
    if (!/^\d{1,5}$/.test(m) || !Number.isInteger(n) || n < 0 || n > MINUTES_MAX) errors.weeklyMinutes = 'profile.err.minutes';
  }
  if (form.language !== 'en' && form.language !== 'de') errors.language = 'profile.err.language';
  return errors;
}

/** Form -> row. Empty optional fields become null (so clearing a field clears it in the database). */
export function formToPatch(form: ProfileForm, userId: string): ProfilePatch {
  const goal = form.goal.trim();
  const m = form.weeklyMinutes.trim();
  return {
    id: userId,
    role_family: form.roleFamily === '' ? null : form.roleFamily,
    experience_level: form.level === '' ? null : form.level,
    learning_goal: goal === '' ? null : goal,
    weekly_minutes: m === '' ? null : Number(m),
    preferred_language: form.language,
  };
}

/** Row as read back from the database -> form. Unknown or out-of-range values are dropped, never trusted. */
export function rowToForm(row: Partial<Record<(typeof PROFILE_COLUMNS)[number], unknown>> | null, fallbackLang: Lang): ProfileForm {
  const f = emptyProfileForm(fallbackLang);
  if (!row) return f;
  if (typeof row.role_family === 'string' && ROLE_RE.test(row.role_family)) f.roleFamily = row.role_family;
  if (typeof row.experience_level === 'string' && (LEVELS as readonly string[]).includes(row.experience_level)) f.level = row.experience_level as Level;
  if (typeof row.learning_goal === 'string') f.goal = [...row.learning_goal].slice(0, GOAL_MAX).join('');
  if (typeof row.weekly_minutes === 'number' && Number.isInteger(row.weekly_minutes) && row.weekly_minutes >= 0 && row.weekly_minutes <= MINUTES_MAX) {
    f.weeklyMinutes = String(row.weekly_minutes);
  }
  if (row.preferred_language === 'en' || row.preferred_language === 'de') f.language = row.preferred_language;
  return f;
}
