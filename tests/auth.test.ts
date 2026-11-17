import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { de } from '../src/i18n/de';
import { en } from '../src/i18n/en';
import {
  MIN_PASSWORD_LENGTH,
  authHintPresent,
  deleteConfirmed,
  isNeutralAuthError,
  isRecoveryRedirect,
  mapAuthError,
  projectRefFromUrl,
  validateEmail,
  validatePassword,
  validateSignInPassword,
} from '../src/lib/auth';
import { rowsToState, stateToRows, type StoredRows } from '../src/lib/progress-rows';
import { exportProgress, importProgress, type LearnerState } from '../src/engine';

describe('validation', () => {
  it('validates emails', () => {
    expect(validateEmail('')).toBe('auth.err.emailRequired');
    expect(validateEmail('  ')).toBe('auth.err.emailRequired');
    expect(validateEmail('nope')).toBe('auth.err.emailInvalid');
    expect(validateEmail('a@b')).toBe('auth.err.emailInvalid');
    expect(validateEmail(' anna@example.org ')).toBeNull();
  });
  it('enforces password length', () => {
    expect(validatePassword('')).toBe('auth.err.passwordRequired');
    expect(validatePassword('x'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe('auth.err.passwordShort');
    expect(validatePassword('x'.repeat(MIN_PASSWORD_LENGTH))).toBeNull();
    expect(validatePassword('ä'.repeat(40))).toBe('auth.err.passwordLong'); // 80 bytes
    expect(validateSignInPassword('a')).toBeNull();
    expect(validateSignInPassword('')).toBe('auth.err.passwordRequired');
  });
  it('requires the typed delete word per language, case-insensitively', () => {
    expect(deleteConfirmed('en', ' delete ')).toBe(true);
    expect(deleteConfirmed('en', 'LÖSCHEN')).toBe(false);
    expect(deleteConfirmed('de', 'löschen')).toBe(true);
    expect(deleteConfirmed('de', '')).toBe(false);
  });
});

describe('error mapping', () => {
  it('maps known codes to friendly keys', () => {
    expect(mapAuthError({ code: 'invalid_credentials', message: 'Invalid login credentials' })).toBe('auth.err.invalidCredentials');
    expect(mapAuthError({ code: 'email_not_confirmed' })).toBe('auth.err.emailNotConfirmed');
    expect(mapAuthError({ code: 'weak_password' })).toBe('auth.err.weakPassword');
    expect(mapAuthError({ code: 'over_email_send_rate_limit' })).toBe('auth.err.rateLimit');
    expect(mapAuthError({ status: 429 })).toBe('auth.err.rateLimit');
    expect(mapAuthError({ code: 'otp_expired' })).toBe('auth.err.linkExpired');
    expect(mapAuthError({ name: 'AuthRetryableFetchError', status: 0 })).toBe('auth.err.network');
    expect(mapAuthError(new TypeError('Failed to fetch'))).toBe('auth.err.network');
  });
  it('never leaks raw messages and falls back to generic', () => {
    for (const e of [{ message: 'duplicate key value violates constraint users_pkey' }, null, undefined, 'boom', 42]) {
      expect(mapAuthError(e)).toBe('auth.err.generic');
    }
  });
  it('every mapped key exists in en and de with a non-raw text', () => {
    const codes = ['invalid_credentials', 'email_not_confirmed', 'weak_password', 'same_password', 'over_request_rate_limit', 'otp_expired', 'email_address_invalid', 'signup_disabled', 'x'];
    for (const code of codes) {
      const key = mapAuthError({ code });
      expect(en[key]).toBeTruthy();
      expect(de[key]).toBeTruthy();
    }
  });
  it('treats account-existence errors as neutral', () => {
    expect(isNeutralAuthError({ code: 'otp_disabled' })).toBe(true);
    expect(isNeutralAuthError({ code: 'user_already_exists' })).toBe(true);
    expect(isNeutralAuthError({ code: 'invalid_credentials' })).toBe(false);
  });
});

describe('auth hints (when supabase-js may load)', () => {
  const ref = projectRefFromUrl('https://abcd.supabase.co');
  it('is quiet for a plain visit', () => {
    expect(ref).toBe('abcd');
    expect(authHintPresent({ hash: '', search: '', storageKeys: ['open-role-academy.progress.v1'], projectRef: ref })).toBe(false);
  });
  it('fires for a stored session or an email-link redirect', () => {
    expect(authHintPresent({ hash: '', search: '', storageKeys: ['sb-abcd-auth-token'], projectRef: ref })).toBe(true);
    expect(authHintPresent({ hash: '#access_token=x&type=recovery', search: '', storageKeys: [], projectRef: ref })).toBe(true);
    expect(authHintPresent({ hash: '', search: '?code=abc', storageKeys: [], projectRef: ref })).toBe(true);
    expect(authHintPresent({ hash: '#error=access_denied&error_code=otp_expired', search: '', storageKeys: [], projectRef: ref })).toBe(true);
  });
  it('detects recovery redirects', () => {
    expect(isRecoveryRedirect('#access_token=x&type=recovery', '')).toBe(true);
    expect(isRecoveryRedirect('#access_token=x&type=magiclink', '')).toBe(false);
  });
});

const USER = '11111111-1111-4111-8111-111111111111';
const state: LearnerState = {
  version: 1,
  roleId: 'it-support',
  selfLevel: 'practitioner',
  createdAt: '2026-11-01T10:00:00.000Z',
  placementDone: true,
  competencies: {
    'information-security-basics': {
      rating: 1281.37,
      correctByLevel: { foundation: 3, practitioner: 1, advanced: 0 },
      answered: 5,
      answeredItems: ['isb-f-cia-confidentiality', 'isb-f-phishing'],
    },
    'working-with-data': {
      rating: 1250,
      correctByLevel: { foundation: 0, practitioner: 0, advanced: 0 },
      answered: 0,
      answeredItems: [],
    },
  },
  reviews: {
    'isb-f-cia-confidentiality': { itemId: 'isb-f-cia-confidentiality', competency: 'information-security-basics', box: 1, due: '2026-11-20' },
  },
  completedUnits: ['information-security-basics-foundation'],
};

describe('progress row mapping', () => {
  it('maps state to rows that satisfy the table constraints', () => {
    const rows = stateToRows(state, USER, 'de');
    expect(rows.profile).toEqual({ id: USER, role_family: 'it-support', experience_level: 'practitioner', preferred_language: 'de', placement_done: true });
    expect(rows.progress).toHaveLength(2);
    expect(rows.progress[0]).toMatchObject({ user_id: USER, competency_id: 'information-security-basics', rating: 1281.37, answered: 5 });
    const card = rows.itemResponses.find((r) => r.item_id === 'isb-f-cia-confidentiality');
    expect(card).toMatchObject({ box: 1, due_on: '2026-11-20', phase: 'review' });
    const plain = rows.itemResponses.find((r) => r.item_id === 'isb-f-phishing');
    expect(plain).toMatchObject({ box: null, due_on: null });
    for (const r of rows.itemResponses) expect((r.box === null) === (r.due_on === null)).toBe(true);
    expect(rows.completedUnits).toEqual([{ user_id: USER, unit_id: 'information-security-basics-foundation' }]);
  });
  it('round-trips through rows (numeric columns may come back as strings)', () => {
    const rows = stateToRows(state, USER, 'en');
    const stored: StoredRows = {
      profile: { ...rows.profile, created_at: state.createdAt },
      progress: rows.progress.map((p) => ({ ...p, rating: String(p.rating) })),
      itemResponses: rows.itemResponses,
      completedUnits: rows.completedUnits,
    };
    expect(rowsToState(stored, 'x')).toEqual(state);
  });
  it('round-trips through the JSON export format too', () => {
    const back = importProgress(exportProgress(state, new Date('2026-11-17T00:00:00Z')));
    expect(stateToRows(back, USER, 'en')).toEqual(stateToRows(state, USER, 'en'));
  });
  it('returns null without a complete profile and rejects unsafe ids', () => {
    expect(rowsToState({ profile: null, progress: [], itemResponses: [], completedUnits: [] }, 'x')).toBeNull();
    expect(rowsToState({ profile: { role_family: null, experience_level: null, placement_done: false }, progress: [], itemResponses: [], completedUnits: [] }, 'x')).toBeNull();
    const bad = { ...state, roleId: "x'; drop table" };
    expect(() => stateToRows(bad, USER, 'en')).toThrow(RangeError);
  });
  it('clamps ratings to the column range and rounds to 2 decimals', () => {
    const s = { ...state, competencies: { a: { ...state.competencies['working-with-data']!, rating: 99999.999 }, b: { ...state.competencies['working-with-data']!, rating: 1000.126 } } };
    const rows = stateToRows(s, USER, 'en').progress;
    expect(rows[0]!.rating).toBe(3000);
    expect(rows[1]!.rating).toBe(1000.13);
  });
});

describe('accounts flag', () => {
  it('defaults to disabled unless built with PUBLIC_ACCOUNTS_ENABLED=true', () => {
    const src = readFileSync('src/config/supabase.ts', 'utf8');
    expect(src).toMatch(/accountsEnabled:\s*\(import\.meta\.env\?\.PUBLIC_ACCOUNTS_ENABLED[^)]*\)\s*===\s*'true'/);
    expect(src).not.toMatch(/location|URLSearchParams/);
  });
  it('imports supabase-js only dynamically and only in the client wrapper', () => {
    expect(readFileSync('src/lib/supabase-client.ts', 'utf8')).toMatch(/import\('@supabase\/supabase-js'\)/);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies['@supabase/supabase-js']).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
