import type { Lang } from '../config/site';
import { de } from './de';
import { en, type UiKey } from './en';

export const ui: Record<Lang, Record<UiKey, string>> = { en, de };
export type { UiKey };

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

/** Prefix a site path with the language segment (`/de/...` for German, unprefixed for English). */
export function localizePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  return clean === '/' ? '/de/' : `/de${clean}`;
}

/** Path of the same page in the other language. */
export function alternatePath(currentPath: string, target: Lang): string {
  const stripped = currentPath.replace(/^\/de(?=\/|$)/, '') || '/';
  return localizePath(target, stripped);
}
