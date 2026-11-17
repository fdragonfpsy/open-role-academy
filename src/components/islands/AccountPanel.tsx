import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lang } from '../../config/site';
import { LEVELS } from '../../engine';
import { supabaseConfig } from '../../config/supabase';
import { localizePath, t, type UiKey } from '../../i18n';
import {
  authHintPresent,
  deleteConfirmWord,
  deleteConfirmed,
  isNeutralAuthError,
  isRecoveryRedirect,
  mapAuthError,
  projectRefFromUrl,
  validateEmail,
  validatePassword,
  validateSignInPassword,
} from '../../lib/auth';
import {
  GOAL_MAX,
  MINUTES_MAX,
  MINUTES_PRESETS,
  PROFILE_SELECT,
  emptyProfileForm,
  formToPatch,
  goalLength,
  rowToForm,
  validateProfile,
  type ProfileErrors,
  type ProfileField,
  type ProfileForm,
} from '../../lib/profile';
import { stateToRows } from '../../lib/progress-rows';
import { loadState } from '../../lib/storage';
import { getSupabase } from '../../lib/supabase-client';

interface Props {
  lang: Lang;
  /** Published roles (id + localized title) for the profile's role family select. */
  roles: { id: string; title: string }[];
}

type View = 'loading' | 'signin' | 'magic' | 'signup' | 'forgot' | 'sent' | 'recovery' | 'account' | 'deleted';
type SentKind = 'signUp' | 'magic' | 'reset';
interface User {
  id: string;
  email: string;
}

const btn =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-blue-900 bg-blue-900 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60';
const btnSecondary =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-slate-500 bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-slate-100';
const btnDanger =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-red-800 bg-red-800 px-4 py-2 font-semibold text-white hover:bg-red-700';
const linkBtn = 'inline-flex min-h-11 items-center text-blue-800 underline underline-offset-4 hover:text-blue-950';
const input = 'mt-1 block min-h-11 w-full rounded border border-slate-500 bg-white px-3 py-2';

const fmt = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
const dismissKey = (uid: string) => `open-role-academy.import-dismissed.${uid}`;
const skipKey = (uid: string) => `open-role-academy.profile-skipped.${uid}`;

function storageKeys(): string[] {
  try {
    return Object.keys(localStorage);
  } catch {
    return [];
  }
}
function dismissed(uid: string): boolean {
  try {
    return localStorage.getItem(dismissKey(uid)) === '1';
  } catch {
    return false;
  }
}
function remember(uid: string): void {
  try {
    localStorage.setItem(dismissKey(uid), '1');
  } catch {
    /* per-viewer convenience only */
  }
}

function flag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}
function setFlag(key: string): void {
  try {
    localStorage.setItem(key, '1');
  } catch {
    /* per-viewer convenience only */
  }
}

function Field(props: {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onInput: (v: string) => void;
  autocomplete: string;
  hint?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label for={props.id} class="block font-medium">
        {props.label}
      </label>
      <input
        id={props.id}
        name={props.id}
        type={props.type as 'text'}
        value={props.value}
        autocomplete={props.autocomplete}
        aria-invalid={props.invalid ? 'true' : undefined}
        aria-describedby={`${props.hint ? `${props.id}-hint ` : ''}auth-error`}
        class={input}
        onInput={(e) => props.onInput((e.currentTarget as HTMLInputElement).value)}
      />
      {props.hint && (
        <p id={`${props.id}-hint`} class="mt-1 text-sm text-slate-700">
          {props.hint}
        </p>
      )}
    </div>
  );
}

export default function AccountPanel({ lang, roles }: Props) {
  const [view, setView] = useState<View>('loading');
  const [sentKind, setSentKind] = useState<SentKind>('signUp');
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<UiKey | null>(null);
  const [errorField, setErrorField] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const [offer, setOffer] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  // Profile: `saved` is what the database holds (null = no row yet); `draft` is the form being edited.
  const [saved, setSaved] = useState<ProfileForm | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileForm>(() => emptyProfileForm(lang));
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const profileHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listening = useRef(false);
  const firstView = useRef(true);

  // Focus management: move focus to the new view's heading (not on first paint).
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  const go = (v: View) => {
    setError(null);
    setErrorField('');
    setInfo('');
    setPassword('');
    setPassword2('');
    setView(v);
  };

  /** Load supabase-js (first use only) and subscribe to auth changes once. */
  const ensureClient = async (): Promise<SupabaseClient> => {
    const sb = await getSupabase();
    if (!listening.current) {
      listening.current = true;
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setView('recovery');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setOffer(false);
          setView((v) => (v === 'deleted' ? v : 'signin'));
        } else if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? '' });
          setView((v) => (v === 'recovery' ? v : 'account'));
        }
      });
    }
    return sb;
  };

  // Initial state. supabase-js is only loaded when a session or an email-link redirect is present.
  useEffect(() => {
    const { hash, search } = window.location;
    const hint = authHintPresent({ hash, search, storageKeys: storageKeys(), projectRef: projectRefFromUrl(supabaseConfig.url) });
    if (!hint) {
      setView('signin');
      return;
    }
    if (isRecoveryRedirect(hash, search)) setView('recovery');
    if (/(^|[#&?])error(_code)?=/.test(`${hash}&${search}`)) {
      history.replaceState(null, '', window.location.pathname);
      setError('auth.err.linkExpired');
      setView('signin');
      return;
    }
    void (async () => {
      try {
        const sb = await ensureClient();
        const { data } = await sb.auth.getSession();
        if (data.session?.user) {
          setUser({ id: data.session.user.id, email: data.session.user.email ?? '' });
          setView((v) => (v === 'recovery' ? v : 'account'));
        } else {
          setView((v) => (v === 'loading' ? 'signin' : v));
        }
      } catch (e) {
        setError(mapAuthError(e));
        setView('signin');
      }
    })();
  }, []);

  // Load the profile row once per signed-in user. No row yet: show the (skippable) profile form and,
  // if this browser holds progress, the one-time import offer.
  useEffect(() => {
    if (!user) {
      setProfileLoaded(false);
      setSaved(null);
      setEditing(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const sb = await getSupabase();
        const { data, error: err } = await sb.from('profiles').select(PROFILE_SELECT).eq('id', user.id).maybeSingle();
        if (cancelled || err) return;
        const form = data ? rowToForm(data as unknown as Record<string, unknown>, lang) : null;
        setSaved(form);
        setDraft(form ?? emptyProfileForm(lang));
        setProfileLoaded(true);
        if (!data) {
          setEditing(!flag(skipKey(user.id)));
          if (!dismissed(user.id) && loadState()) setOffer(true);
        }
      } catch {
        /* no profile UI if the check fails */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const fail = (key: UiKey, field = '') => {
    setError(key);
    setErrorField(field);
    if (field) document.getElementById(field)?.focus();
  };

  /** Run an async step with busy state; unexpected errors become friendly messages. */
  const run = async (fn: (sb: SupabaseClient) => Promise<void>) => {
    setBusy(true);
    setError(null);
    setErrorField('');
    setInfo('');
    try {
      await fn(await ensureClient());
    } catch (e) {
      fail(mapAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const redirectTo = () => `${window.location.origin}${localizePath(lang, '/account')}`;
  const sent = (kind: SentKind) => {
    setSentKind(kind);
    go('sent');
  };

  const onSignIn = (e: Event) => {
    e.preventDefault();
    const ev = validateEmail(email);
    if (ev) return fail(ev, 'auth-email');
    const pv = validateSignInPassword(password);
    if (pv) return fail(pv, 'auth-password');
    void run(async (sb) => {
      const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (err) return fail(mapAuthError(err));
      setPassword('');
    });
  };

  const onSignUp = (e: Event) => {
    e.preventDefault();
    const ev = validateEmail(email);
    if (ev) return fail(ev, 'auth-email');
    const pv = validatePassword(password);
    if (pv) return fail(pv, 'auth-password');
    if (!agree) return fail('auth.err.consentRequired', 'auth-agree');
    void run(async (sb) => {
      const { data, error: err } = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo() },
      });
      if (err && !isNeutralAuthError(err)) return fail(mapAuthError(err));
      if (!err && data.session) return; // confirmation disabled: the auth listener shows the account
      sent('signUp');
    });
  };

  const onMagic = (e: Event) => {
    e.preventDefault();
    const ev = validateEmail(email);
    if (ev) return fail(ev, 'auth-email');
    void run(async (sb) => {
      const { error: err } = await sb.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo() },
      });
      if (err && !isNeutralAuthError(err)) return fail(mapAuthError(err));
      sent('magic');
    });
  };

  const onForgot = (e: Event) => {
    e.preventDefault();
    const ev = validateEmail(email);
    if (ev) return fail(ev, 'auth-email');
    void run(async (sb) => {
      const { error: err } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectTo() });
      if (err && !isNeutralAuthError(err)) return fail(mapAuthError(err));
      sent('reset');
    });
  };

  const onReset = (e: Event) => {
    e.preventDefault();
    const pv = validatePassword(password);
    if (pv) return fail(pv, 'auth-password');
    if (password !== password2) return fail('auth.err.passwordMismatch', 'auth-password2');
    void run(async (sb) => {
      const { error: err } = await sb.auth.updateUser({ password });
      if (err) return fail(mapAuthError(err));
      history.replaceState(null, '', window.location.pathname);
      go('account');
      setInfo(t(lang, 'auth.reset.done'));
    });
  };

  const onSignOut = () =>
    void run(async (sb) => {
      const { error: err } = await sb.auth.signOut();
      if (err) return fail(mapAuthError(err));
      setInfo(t(lang, 'auth.me.signedOut'));
    });

  const onImport = () =>
    void run(async (sb) => {
      const local = loadState();
      if (!user || !local) return;
      try {
        const { data: existing, error: e0 } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle();
        if (e0) throw e0;
        if (existing) {
          setOffer(false);
          setInfo(t(lang, 'auth.import.exists'));
          return;
        }
        const rows = stateToRows(local, user.id, lang);
        const importedProfile = rowToForm(rows.profile, lang);
        const steps = [
          await sb.from('profiles').upsert(rows.profile),
          await sb.from('progress').upsert(rows.progress, { onConflict: 'user_id,competency_id' }),
          await sb.from('item_responses').upsert(rows.itemResponses, { onConflict: 'user_id,item_id' }),
          await sb.from('completed_units').upsert(rows.completedUnits, { onConflict: 'user_id,unit_id', ignoreDuplicates: true }),
        ];
        if (steps.some((s) => s.error)) throw new Error('import');
        remember(user.id);
        setOffer(false);
        setSaved(importedProfile);
        setDraft(importedProfile);
        setEditing(false);
        setInfo(t(lang, 'auth.import.done'));
      } catch {
        fail('auth.import.failed' as UiKey);
      }
    });

  const onExport = () =>
    void run(async (sb) => {
      const { data, error: err } = await sb.rpc('export_my_data');
      if (err) return fail(mapAuthError(err));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'open-role-academy-account-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setInfo(t(lang, 'auth.export.done'));
    });

  const setField = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const fieldIds: Record<ProfileField, string> = {
    roleFamily: 'profile-role',
    level: 'profile-level-none',
    goal: 'profile-goal',
    weeklyMinutes: 'profile-minutes',
    language: 'profile-lang-en',
  };
  const openProfile = () => {
    setDraft(saved ?? emptyProfileForm(lang));
    setProfileErrors({});
    setError(null);
    setInfo('');
    setEditing(true);
    setTimeout(() => profileHeadingRef.current?.focus(), 0);
  };
  const closeProfile = () => {
    setEditing(false);
    setProfileErrors({});
    setTimeout(() => profileHeadingRef.current?.focus(), 0);
  };
  const onProfileSkip = () => {
    if (user) setFlag(skipKey(user.id));
    closeProfile();
  };
  const onProfileSave = (e: Event) => {
    e.preventDefault();
    if (!user) return;
    const errs = validateProfile(draft, roles.map((r) => r.id));
    setProfileErrors(errs);
    const first = (Object.keys(errs) as ProfileField[])[0];
    if (first) {
      document.getElementById(fieldIds[first])?.focus();
      return;
    }
    const uid = user.id;
    const snapshot = draft;
    void run(async (sb) => {
      const { error: err } = await sb.from('profiles').upsert(formToPatch(snapshot, uid));
      if (err) return fail('profile.err.save');
      setSaved(snapshot);
      setEditing(false);
      setInfo(t(lang, 'profile.saved'));
      setTimeout(() => profileHeadingRef.current?.focus(), 0);
    });
  };

  const onDelete = (e: Event) => {
    e.preventDefault();
    if (!deleteConfirmed(lang, confirmText)) return fail('auth.err.deleteConfirm', 'auth-delete');
    void run(async (sb) => {
      const { error: err } = await sb.rpc('delete_my_account');
      if (err) return fail(mapAuthError(err));
      setView('deleted');
      setUser(null);
      setConfirmText('');
      await sb.auth.signOut({ scope: 'local' }).catch(() => undefined);
      setInfo(t(lang, 'auth.delete.done'));
    });
  };

  const heading = (key: UiKey) => (
    <h2 ref={headingRef} tabIndex={-1} class="mb-3 text-xl font-semibold outline-none focus:underline">
      {t(lang, key)}
    </h2>
  );
  const submit = (key: UiKey, cls = btn) => (
    <button type="submit" class={cls} disabled={busy} aria-disabled={busy ? 'true' : undefined}>
      {busy ? t(lang, 'auth.busy') : t(lang, key)}
    </button>
  );
  const spamHint = <p class="mt-2 rounded border border-amber-600 bg-amber-50 p-3">{t(lang, 'auth.sent.spam')}</p>;
  const emailField = (
    <Field id="auth-email" label={t(lang, 'auth.email')} type="email" autocomplete="email" value={email} onInput={setEmail} invalid={errorField === 'auth-email'} />
  );
  const link = (label: UiKey, to: View) => (
    <button type="button" class={linkBtn} onClick={() => go(to)}>
      {t(lang, label)}
    </button>
  );
  const form = (onSubmit: (e: Event) => void, children: ComponentChildren) => (
    <form noValidate onSubmit={onSubmit} class="space-y-4">
      {children}
    </form>
  );

  const levelLabel = (l: string) => t(lang, `level.${l}` as UiKey);
  const fieldError = (f: ProfileField) =>
    profileErrors[f] ? (
      <p id={`profile-${f}-err`} class="mt-1 text-red-900">
        {t(lang, profileErrors[f] as UiKey)}
      </p>
    ) : null;
  const describedBy = (f: ProfileField, extra = '') => `${extra}${profileErrors[f] ? `profile-${f}-err` : ''}`.trim() || undefined;
  const radio = (name: string, id: string, value: string, checked: boolean, label: string, hint: string | undefined, onPick: () => void, invalid: boolean) => (
    <div class="flex items-start gap-3">
      <input id={id} type="radio" name={name} value={value} checked={checked} aria-invalid={invalid ? 'true' : undefined} class="mt-2.5 h-6 w-6 shrink-0" onChange={onPick} />
      <label for={id} class="min-h-11 py-2">
        {label}
        {hint && <span class="block text-sm text-slate-700">{hint}</span>}
      </label>
    </div>
  );

  const profileSection = () => (
    <section class="mb-6 rounded border border-slate-400 p-4" aria-labelledby="profile-h">
      <h3 id="profile-h" ref={profileHeadingRef} tabIndex={-1} class="mb-2 text-lg font-semibold outline-none focus:underline">
        {t(lang, 'profile.title')}
      </h3>
      {editing ? (
        <form noValidate onSubmit={onProfileSave} class="space-y-5" aria-describedby="profile-minimal">
          <p>{t(lang, 'profile.intro')}</p>
          <p id="profile-minimal" class="rounded border border-slate-400 bg-slate-50 p-3 text-sm">
            {t(lang, 'profile.minimal')}
          </p>
          <div>
            <label for="profile-role" class="block font-medium">
              {t(lang, 'profile.role')}
            </label>
            <select
              id="profile-role"
              name="profile-role"
              class={input}
              value={draft.roleFamily}
              aria-invalid={profileErrors.roleFamily ? 'true' : undefined}
              aria-describedby={describedBy('roleFamily')}
              onChange={(e) => setField('roleFamily', (e.currentTarget as HTMLSelectElement).value)}
            >
              <option value="">{t(lang, 'profile.role.none')}</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id} selected={draft.roleFamily === r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            {fieldError('roleFamily')}
          </div>
          <fieldset aria-describedby={describedBy('level')}>
            <legend class="font-medium">{t(lang, 'profile.level')}</legend>
            {radio('profile-level', 'profile-level-none', '', draft.level === '', t(lang, 'profile.level.none'), undefined, () => setField('level', ''), !!profileErrors.level)}
            {LEVELS.map((l) =>
              radio('profile-level', `profile-level-${l}`, l, draft.level === l, levelLabel(l), t(lang, `level.${l}.hint` as UiKey), () => setField('level', l), !!profileErrors.level),
            )}
            {fieldError('level')}
          </fieldset>
          <div>
            <label for="profile-goal" class="block font-medium">
              {t(lang, 'profile.goal')}
            </label>
            <p id="profile-goal-hint" class="text-sm text-slate-700">
              {t(lang, 'profile.goal.hint')}
            </p>
            <textarea
              id="profile-goal"
              name="profile-goal"
              rows={4}
              class={`${input} min-h-24`}
              value={draft.goal}
              aria-invalid={profileErrors.goal ? 'true' : undefined}
              aria-describedby={describedBy('goal', 'profile-goal-hint profile-goal-count ')}
              onInput={(e) => setField('goal', (e.currentTarget as HTMLTextAreaElement).value)}
            />
            <p id="profile-goal-count" class={`mt-1 text-sm ${goalLength(draft.goal.trim()) > GOAL_MAX ? 'font-semibold text-red-900' : 'text-slate-700'}`}>
              {fmt(t(lang, 'profile.goal.count'), { n: String(goalLength(draft.goal)), max: String(GOAL_MAX) })}
            </p>
            {fieldError('goal')}
          </div>
          <div>
            <label for="profile-minutes" class="block font-medium">
              {t(lang, 'profile.minutes')}
            </label>
            <input
              id="profile-minutes"
              name="profile-minutes"
              type="number"
              inputMode="numeric"
              min={0}
              max={MINUTES_MAX}
              step={1}
              class={input}
              value={draft.weeklyMinutes}
              aria-invalid={profileErrors.weeklyMinutes ? 'true' : undefined}
              aria-describedby={describedBy('weeklyMinutes', 'profile-minutes-hint ')}
              onInput={(e) => setField('weeklyMinutes', (e.currentTarget as HTMLInputElement).value)}
            />
            <p id="profile-minutes-hint" class="mt-1 text-sm text-slate-700">
              {t(lang, 'profile.minutes.hint')}
            </p>
            <div class="mt-1 flex flex-wrap gap-2">
              {MINUTES_PRESETS.map((n) => (
                <button key={n} type="button" class={btnSecondary} aria-pressed={draft.weeklyMinutes === String(n)} onClick={() => setField('weeklyMinutes', String(n))}>
                  {fmt(t(lang, 'profile.minutes.preset'), { n: String(n) })}
                </button>
              ))}
            </div>
            {fieldError('weeklyMinutes')}
          </div>
          <fieldset aria-describedby={describedBy('language')}>
            <legend class="font-medium">{t(lang, 'profile.language')}</legend>
            {radio('profile-lang', 'profile-lang-en', 'en', draft.language === 'en', t(lang, 'profile.lang.en'), undefined, () => setField('language', 'en'), !!profileErrors.language)}
            {radio('profile-lang', 'profile-lang-de', 'de', draft.language === 'de', t(lang, 'profile.lang.de'), undefined, () => setField('language', 'de'), !!profileErrors.language)}
            {fieldError('language')}
          </fieldset>
          <div class="flex flex-wrap gap-3">
            {submit('profile.save')}
            {saved ? (
              <button type="button" class={btnSecondary} disabled={busy} onClick={closeProfile}>
                {t(lang, 'profile.cancel')}
              </button>
            ) : (
              <button type="button" class={btnSecondary} disabled={busy} onClick={onProfileSkip}>
                {t(lang, 'profile.skip')}
              </button>
            )}
          </div>
        </form>
      ) : (
        <>
          {saved && (
            <dl class="mb-3 grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
              <dt class="font-medium">{t(lang, 'profile.role')}</dt>
              <dd>{roles.find((r) => r.id === saved.roleFamily)?.title ?? t(lang, 'profile.summary.empty')}</dd>
              <dt class="font-medium">{t(lang, 'profile.level')}</dt>
              <dd>{saved.level ? levelLabel(saved.level) : t(lang, 'profile.summary.empty')}</dd>
              <dt class="font-medium">{t(lang, 'profile.goal')}</dt>
              <dd class="whitespace-pre-line break-words">{saved.goal || t(lang, 'profile.summary.empty')}</dd>
              <dt class="font-medium">{t(lang, 'profile.minutes')}</dt>
              <dd>{saved.weeklyMinutes !== '' ? fmt(t(lang, 'profile.summary.minutes'), { n: saved.weeklyMinutes }) : t(lang, 'profile.summary.empty')}</dd>
              <dt class="font-medium">{t(lang, 'profile.language')}</dt>
              <dd>{t(lang, `profile.lang.${saved.language}` as UiKey)}</dd>
            </dl>
          )}
          <p class="mb-3 text-sm">{t(lang, 'profile.minimal')}</p>
          <button type="button" class={btnSecondary} disabled={busy} onClick={openProfile}>
            {t(lang, saved ? 'profile.edit' : 'profile.setup')}
          </button>
        </>
      )}
    </section>
  );

  let body: ComponentChildren;
  if (view === 'loading') {
    body = <p>{t(lang, 'account.loading')}</p>;
  } else if (view === 'signin') {
    body = (
      <>
        {heading('auth.signIn.title')}
        {form(
          onSignIn,
          <>
            {emailField}
            <Field id="auth-password" label={t(lang, 'auth.password')} type="password" autocomplete="current-password" value={password} onInput={setPassword} invalid={errorField === 'auth-password'} />
            <div>{submit('auth.signIn.submit')}</div>
          </>,
        )}
        <div class="mt-4 flex flex-col items-start">
          {link('auth.link.forgot', 'forgot')}
          {link('auth.link.magic', 'magic')}
          {link('auth.link.signUp', 'signup')}
        </div>
      </>
    );
  } else if (view === 'magic') {
    body = (
      <>
        {heading('auth.magic.title')}
        <p class="mb-4">{t(lang, 'auth.magic.intro')}</p>
        {form(onMagic, <>{emailField}<div>{submit('auth.magic.submit')}</div></>)}
        <div class="mt-4 flex flex-col items-start">{link('auth.link.password', 'signin')}</div>
      </>
    );
  } else if (view === 'signup') {
    body = (
      <>
        {heading('auth.signUp.title')}
        {form(
          onSignUp,
          <>
            {emailField}
            <Field id="auth-password" label={t(lang, 'auth.password')} type="password" autocomplete="new-password" value={password} onInput={setPassword} hint={t(lang, 'auth.passwordHint')} invalid={errorField === 'auth-password'} />
            <p class="text-sm text-slate-700">
              {t(lang, 'auth.signUp.consent')}{' '}
              <a class="underline" href={localizePath(lang, '/privacy')}>
                {t(lang, 'auth.signUp.privacyLink')}
              </a>
            </p>
            <div class="flex items-start gap-3">
              <input
                id="auth-agree"
                type="checkbox"
                checked={agree}
                aria-invalid={errorField === 'auth-agree' ? 'true' : undefined}
                aria-describedby="auth-error"
                class="mt-1 h-6 w-6 shrink-0"
                onChange={(e) => setAgree((e.currentTarget as HTMLInputElement).checked)}
              />
              <label for="auth-agree" class="min-h-11 py-1">
                {t(lang, 'auth.signUp.agree')}
              </label>
            </div>
            <div>{submit('auth.signUp.submit')}</div>
          </>,
        )}
        <div class="mt-4 flex flex-col items-start">{link('auth.link.signIn', 'signin')}</div>
      </>
    );
  } else if (view === 'forgot') {
    body = (
      <>
        {heading('auth.forgot.title')}
        <p class="mb-4">{t(lang, 'auth.forgot.intro')}</p>
        {form(onForgot, <>{emailField}<div>{submit('auth.forgot.submit')}</div></>)}
        <div class="mt-4 flex flex-col items-start">{link('auth.link.signIn', 'signin')}</div>
      </>
    );
  } else if (view === 'sent') {
    const key = (`auth.sent.${sentKind}`) as UiKey;
    body = (
      <>
        {heading('auth.sent.title')}
        <p>{fmt(t(lang, key), { email: email.trim() })}</p>
        {spamHint}
        <div class="mt-4 flex flex-col items-start">{link('auth.link.signIn', 'signin')}</div>
      </>
    );
  } else if (view === 'recovery') {
    body = (
      <>
        {heading('auth.reset.title')}
        {form(
          onReset,
          <>
            <Field id="auth-password" label={t(lang, 'auth.newPassword')} type="password" autocomplete="new-password" value={password} onInput={setPassword} hint={t(lang, 'auth.passwordHint')} invalid={errorField === 'auth-password'} />
            <Field id="auth-password2" label={t(lang, 'auth.confirmPassword')} type="password" autocomplete="new-password" value={password2} onInput={setPassword2} invalid={errorField === 'auth-password2'} />
            <div>{submit('auth.reset.submit')}</div>
          </>,
        )}
      </>
    );
  } else if (view === 'deleted') {
    body = (
      <>
        {heading('auth.delete.title')}
        <p>{t(lang, 'auth.delete.done')}</p>
        <div class="mt-4 flex flex-col items-start">{link('auth.link.signIn', 'signin')}</div>
      </>
    );
  } else {
    body = (
      <>
        {heading('auth.me.title')}
        <p class="mb-6">{fmt(t(lang, 'auth.me.signedInAs'), { email: user?.email ?? '' })}</p>
        {offer && (
          <section class="mb-6 rounded border border-blue-800 bg-blue-50 p-4" aria-labelledby="auth-import-h">
            <h3 id="auth-import-h" class="mb-2 text-lg font-semibold">
              {t(lang, 'auth.import.title')}
            </h3>
            <p class="mb-3">{t(lang, 'auth.import.intro')}</p>
            <div class="flex flex-wrap gap-3">
              <button type="button" class={btn} disabled={busy} onClick={onImport}>
                {t(lang, 'auth.import.yes')}
              </button>
              <button
                type="button"
                class={btnSecondary}
                onClick={() => {
                  if (user) remember(user.id);
                  setOffer(false);
                }}
              >
                {t(lang, 'auth.import.no')}
              </button>
            </div>
          </section>
        )}
        {profileLoaded && profileSection()}
        <section class="mb-6" aria-labelledby="auth-export-h">
          <h3 id="auth-export-h" class="mb-2 text-lg font-semibold">
            {t(lang, 'auth.export.title')}
          </h3>
          <p class="mb-3">{t(lang, 'auth.export.intro')}</p>
          <button type="button" class={btnSecondary} disabled={busy} onClick={onExport}>
            {t(lang, 'auth.export.button')}
          </button>
        </section>
        <div class="mb-8">
          <button type="button" class={btnSecondary} disabled={busy} onClick={onSignOut}>
            {t(lang, 'auth.me.signOut')}
          </button>
        </div>
        <section class="rounded border border-red-800 p-4" aria-labelledby="auth-delete-h">
          <h3 id="auth-delete-h" class="mb-2 text-lg font-semibold">
            {t(lang, 'auth.delete.title')}
          </h3>
          <p class="mb-3">{t(lang, 'auth.delete.intro')}</p>
          {form(
            onDelete,
            <>
              <Field id="auth-delete" label={fmt(t(lang, 'auth.delete.label'), { word: deleteConfirmWord(lang) })} type="text" autocomplete="off" value={confirmText} onInput={setConfirmText} invalid={errorField === 'auth-delete'} />
              <div>{submit('auth.delete.button', btnDanger)}</div>
            </>,
          )}
        </section>
      </>
    );
  }

  return (
    <div class="max-w-xl">
      <div role="alert" id="auth-error" class="mb-4 empty:hidden">
        {error && <p class="rounded border border-red-800 bg-red-50 p-3 text-red-900">{t(lang, error)}</p>}
      </div>
      <div role="status" class="mb-4 empty:hidden">
        {info && <p class="rounded border border-green-800 bg-green-50 p-3 text-green-900">{info}</p>}
      </div>
      {body}
    </div>
  );
}
