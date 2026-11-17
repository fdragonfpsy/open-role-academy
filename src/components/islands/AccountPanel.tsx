import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lang } from '../../config/site';
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
import { stateToRows } from '../../lib/progress-rows';
import { loadState } from '../../lib/storage';
import { getSupabase } from '../../lib/supabase-client';

interface Props {
  lang: Lang;
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

export default function AccountPanel({ lang }: Props) {
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

  // Offer to import local progress once per account that has no profile yet.
  useEffect(() => {
    if (!user || dismissed(user.id) || !loadState()) return;
    let cancelled = false;
    void (async () => {
      try {
        const sb = await getSupabase();
        const { data, error: err } = await sb.from('profiles').select('id').eq('id', user.id).maybeSingle();
        if (!cancelled && !err && !data) setOffer(true);
      } catch {
        /* no offer if the check fails */
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
        const steps = [
          await sb.from('profiles').upsert(rows.profile),
          await sb.from('progress').upsert(rows.progress, { onConflict: 'user_id,competency_id' }),
          await sb.from('item_responses').upsert(rows.itemResponses, { onConflict: 'user_id,item_id' }),
          await sb.from('completed_units').upsert(rows.completedUnits, { onConflict: 'user_id,unit_id', ignoreDuplicates: true }),
        ];
        if (steps.some((s) => s.error)) throw new Error('import');
        remember(user.id);
        setOffer(false);
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
