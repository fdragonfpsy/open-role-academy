import { describe, expect, it } from 'vitest';
import { de } from '../src/i18n/de';
import { en } from '../src/i18n/en';
import { alternatePath, localizePath } from '../src/i18n';

describe('UI string parity', () => {
  it('has the same keys in en and de', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });
  it('has no empty strings', () => {
    for (const table of [en, de]) for (const v of Object.values(table)) expect(v.trim()).not.toBe('');
  });
});

describe('localized paths', () => {
  it('prefixes German paths only', () => {
    expect(localizePath('en', '/start')).toBe('/start');
    expect(localizePath('de', '/start')).toBe('/de/start');
    expect(localizePath('de', '/')).toBe('/de/');
  });
  it('maps to the alternate language', () => {
    expect(alternatePath('/de/start', 'en')).toBe('/start');
    expect(alternatePath('/de', 'en')).toBe('/');
    expect(alternatePath('/dashboard', 'de')).toBe('/de/dashboard');
  });
});
