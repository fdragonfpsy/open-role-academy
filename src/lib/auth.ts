// Pure helpers for the account UI (no Supabase import, safe to bundle anywhere).
import type { Lang } from '../config/site';
import type { UiKey } from '../i18n';

export const MIN_PASSWORD_LENGTH = 10;
/** Supabase (bcrypt) ignores everything beyond 72 bytes; reject longer input instead of truncating silently. */
export const MAX_PASSWORD_BYTES = 72;

export type AuthErrorKey = Extract<UiKey, `auth.err.${string}`>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): AuthErrorKey | null {
  const v = value.trim();
  if (v === '') return 'auth.err.emailRequired';
  return v.length <= 254 && EMAIL_RE.test(v) ? null : 'auth.err.emailInvalid';
}

export function validatePassword(value: string): AuthErrorKey | null {
  if (value === '') return 'auth.err.passwordRequired';
  if ([...value].length < MIN_PASSWORD_LENGTH) return 'auth.err.passwordShort';
  if (new TextEncoder().encode(value).length > MAX_PASSWORD_BYTES) return 'auth.err.passwordLong';
  return null;
}

/** Sign-in only checks presence: the server decides whether the password is right. */
export function validateSignInPassword(value: string): AuthErrorKey | null {
  return value === '' ? 'auth.err.passwordRequired' : null;
}

/** Codes where the UI must not reveal whether an address has an account: show the neutral "sent" screen. */
const NEUTRAL_CODES = new Set(['otp_disabled', 'signup_disabled', 'user_not_found', 'email_not_found', 'user_already_exists', 'email_exists']);

export function isNeutralAuthError(err: unknown): boolean {
  return NEUTRAL_CODES.has(readField(err, 'code'));
}

function readField(err: unknown, field: string): string {
  if (typeof err === 'object' && err !== null && field in err) {
    const v = (err as Record<string, unknown>)[field];
    return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
  }
  return '';
}

/** Map a Supabase auth/PostgREST error to a friendly UI key. Raw messages are never shown. */
export function mapAuthError(err: unknown): AuthErrorKey {
  const code = readField(err, 'code');
  const status = readField(err, 'status');
  const name = readField(err, 'name');
  switch (code) {
    case 'invalid_credentials':
    case 'user_not_found':
      return 'auth.err.invalidCredentials';
    case 'email_not_confirmed':
      return 'auth.err.emailNotConfirmed';
    case 'weak_password':
      return 'auth.err.weakPassword';
    case 'same_password':
      return 'auth.err.samePassword';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
    case 'over_sms_send_rate_limit':
      return 'auth.err.rateLimit';
    case 'otp_expired':
    case 'flow_state_expired':
    case 'flow_state_not_found':
    case 'bad_jwt':
    case 'session_expired':
    case 'session_not_found':
      return 'auth.err.linkExpired';
    case 'email_address_invalid':
    case 'validation_failed':
      return 'auth.err.emailInvalid';
    case 'signup_disabled':
    case 'email_provider_disabled':
      return 'auth.err.signupDisabled';
    default:
  }
  if (status === '429') return 'auth.err.rateLimit';
  if (name === 'AuthRetryableFetchError' || status === '0' || /fetch|network/i.test(readField(err, 'message'))) {
    return 'auth.err.network';
  }
  return 'auth.err.generic';
}

/** Word the learner must type to confirm account deletion. */
export function deleteConfirmWord(lang: Lang): string {
  return lang === 'de' ? 'LÖSCHEN' : 'DELETE';
}

export function deleteConfirmed(lang: Lang, input: string): boolean {
  return input.trim().toLocaleUpperCase(lang) === deleteConfirmWord(lang);
}

export interface AuthHintInput {
  hash: string;
  search: string;
  /** Keys currently present in localStorage. */
  storageKeys: string[];
  /** Supabase project ref, e.g. `bbyyjrmgmbiscdswufla`. */
  projectRef: string;
}

/**
 * True when there is a reason to load the Supabase client on page load: a stored session or an auth
 * redirect (email link) in the URL. Otherwise supabase-js is only loaded when a form is submitted.
 */
export function authHintPresent({ hash, search, storageKeys, projectRef }: AuthHintInput): boolean {
  const inUrl = /(^|[#&?])(access_token|refresh_token|code|error|error_code|type)=/.test(`${hash}&${search}`);
  const stored = storageKeys.some((k) => k === `sb-${projectRef}-auth-token` || k.startsWith(`sb-${projectRef}-auth-token`));
  return inUrl || stored;
}

export function projectRefFromUrl(url: string): string {
  try {
    return new URL(url).hostname.split('.')[0] ?? '';
  } catch {
    return '';
  }
}

/** True when the URL fragment/query says this visit comes from a password-recovery email. */
export function isRecoveryRedirect(hash: string, search: string): boolean {
  return /(^|[#&?])type=recovery(&|$)/.test(`${hash}&${search}`);
}
