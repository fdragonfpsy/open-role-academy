import type { z } from 'zod';
import {
  EMBED_LICENSES,
  competencySchema,
  itemFileSchema,
  resourceSchema,
  roleSchema,
  unitSchema,
  type Competency,
  type ItemFile,
  type Resource,
  type Role,
  type Unit,
} from '../content/schemas';
import { LEVELS, difficultyMatchesLevel, levelRank, type Level } from '../engine/levels';
import type { ContentBundle, Issue, RawFile } from './bundle';

export const ROLE_COMPETENCIES_MIN = 8;
export const ROLE_COMPETENCIES_MAX = 12;
export const MIN_ITEMS_PER_COMPETENCY = 6;
export const MIN_ITEMS_PER_LEVEL = 2;
export const UNIT_WORDS_MIN = 300;
export const UNIT_WORDS_MAX = 800;
export const LICENSE_MAX_AGE_DAYS = 180;

export interface ValidateOptions {
  /** ISO date used for "verified in the future" / "older than 180 days" checks. */
  today: string;
}

/** Count words of a unit body, ignoring MDX import/export lines, HTML/JSX tags and markdown syntax. */
export function countWords(body: string): number {
  const text = body
    .split('\n')
    .filter((l) => !/^\s*(import|export)\s/.test(l))
    .join(' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`|-]/g, ' ');
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function parseAll<T>(files: RawFile[], schema: z.ZodType<T>, issues: Issue[]): { file: string; data: T }[] {
  const out: { file: string; data: T }[] = [];
  for (const f of files) {
    const res = schema.safeParse(f.data);
    if (res.success) out.push({ file: f.file, data: res.data });
    else
      for (const issue of res.error.issues)
        issues.push({ level: 'error', file: f.file, message: `schema: ${issue.path.join('.') || '(root)'}: ${issue.message}` });
  }
  return out;
}

function fileStem(file: string): string {
  const name = file.split('/').pop() ?? file;
  return name.replace(/\.(ya?ml|mdx)$/, '');
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/** Validate a content bundle against CLAUDE.md §5/§6. Pure function: no I/O. */
export function validateContent(bundle: ContentBundle, opts: ValidateOptions): Issue[] {
  const issues: Issue[] = [];
  const err = (file: string, message: string) => issues.push({ level: 'error', file, message });
  const warn = (file: string, message: string) => issues.push({ level: 'warning', file, message });

  // 1. Schema validity
  const roles = parseAll<Role>(bundle.roles, roleSchema, issues);
  const competencies = parseAll<Competency>(bundle.competencies, competencySchema, issues);
  const itemFiles = parseAll<ItemFile>(bundle.items, itemFileSchema, issues);
  const resources = parseAll<Resource>(bundle.resources, resourceSchema, issues);
  const units: { file: string; data: Unit; lang: 'en' | 'de'; name: string; body: string }[] = [];
  for (const u of bundle.units) {
    const res = unitSchema.safeParse(u.data);
    if (res.success) units.push({ ...u, data: res.data });
    else
      for (const issue of res.error.issues)
        err(u.file, `schema: ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }

  // File names match ids; ids unique
  const checkIds = (list: { file: string; data: { id: string } }[], kind: string) => {
    const seen = new Set<string>();
    for (const { file, data } of list) {
      if (fileStem(file) !== data.id) err(file, `${kind} id "${data.id}" does not match file name`);
      if (seen.has(data.id)) err(file, `duplicate ${kind} id "${data.id}"`);
      seen.add(data.id);
    }
  };
  checkIds(roles, 'role');
  checkIds(competencies, 'competency');
  checkIds(resources, 'resource');

  const compById = new Map(competencies.map((c) => [c.data.id, c.data]));
  const resById = new Map(resources.map((r) => [r.data.id, r.data]));

  // 2. Dead references + prerequisite cycles
  for (const { file, data } of competencies) {
    for (const p of data.prerequisites) {
      if (!compById.has(p)) err(file, `unknown prerequisite "${p}"`);
      if (p === data.id) err(file, 'competency lists itself as prerequisite');
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycleIn = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const hit = (compById.get(id)?.prerequisites ?? []).some((p) => compById.has(p) && cycleIn(p));
    visiting.delete(id);
    visited.add(id);
    return hit;
  };
  for (const { file, data } of competencies) if (cycleIn(data.id)) err(file, 'prerequisite cycle detected');

  for (const { file, data } of resources) {
    for (const c of data.competencies) if (!compById.has(c)) err(file, `unknown competency "${c}"`);
    // 3. License whitelist for embed
    if (data.mode === 'embed' && !EMBED_LICENSES.includes(data.license))
      err(file, `license ${data.license} does not allow mode: embed (link only)`);
    if (data.licenseVerifiedOn > opts.today) err(file, 'licenseVerifiedOn is in the future');
    else if (daysBetween(data.licenseVerifiedOn, opts.today) > LICENSE_MAX_AGE_DAYS)
      warn(file, `license verified more than ${LICENSE_MAX_AGE_DAYS} days ago — re-verify`);
  }

  // Items
  const itemsByComp = new Map<string, ItemFile['items']>();
  const itemIds = new Set<string>();
  for (const { file, data } of itemFiles) {
    if (fileStem(file) !== data.competency) err(file, `items file name must be "${data.competency}.yaml"`);
    if (!compById.has(data.competency)) err(file, `unknown competency "${data.competency}"`);
    itemsByComp.set(data.competency, [...(itemsByComp.get(data.competency) ?? []), ...data.items]);
    for (const item of data.items) {
      if (itemIds.has(item.id)) err(file, `duplicate item id "${item.id}"`);
      itemIds.add(item.id);
      const correct = item.options.filter((o) => o.correct).length;
      if (item.type === 'single' && correct !== 1) err(file, `${item.id}: single-choice item needs exactly 1 correct option`);
      if (item.type === 'multi' && (correct < 1 || correct === item.options.length))
        err(file, `${item.id}: multi-choice item needs ≥1 correct and ≥1 incorrect option`);
      if (!difficultyMatchesLevel(item.difficulty, item.level))
        err(file, `${item.id}: difficulty ${item.difficulty} outside the ${item.level} range`);
    }
  }

  // Units: refs, en/de parity, attribution, length
  const unitKey = (u: { data: Unit }) => `${u.data.competency}/${u.data.level}`;
  const unitsByLang = { en: new Map<string, (typeof units)[number]>(), de: new Map<string, (typeof units)[number]>() };
  for (const u of units) {
    const { file, data } = u;
    if (u.name !== data.id) err(file, `unit id "${data.id}" does not match file name`);
    if (data.id !== `${data.competency}-${data.level}`) err(file, `unit id must be "<competency>-<level>"`);
    if (!compById.has(data.competency)) err(file, `unknown competency "${data.competency}"`);
    if (unitsByLang[u.lang].has(unitKey(u))) err(file, `duplicate unit for ${unitKey(u)} (${u.lang})`);
    unitsByLang[u.lang].set(unitKey(u), u);

    for (const r of data.resources) if (!resById.has(r)) err(file, `unknown resource "${r}"`);

    const embedded = data.resources.map((r) => resById.get(r)).filter((r): r is Resource => r?.mode === 'embed');
    for (const r of embedded) {
      if (!data.sources.some((s) => s.url === r.url && s.usage === 'embedded'))
        err(file, `embedded resource "${r.id}" needs a source entry with usage: embedded (attribution)`);
    }
    for (const s of data.sources) {
      if (s.usage === 'cited') continue;
      if (!s.author || !s.license || !s.licenseUrl)
        err(file, `source "${s.title}" is ${s.usage}: attribution needs title, author, url, license, licenseUrl`);
      if (s.license && !EMBED_LICENSES.includes(s.license))
        err(file, `source "${s.title}" has license ${s.license}, which may not be ${s.usage}`);
      if (s.usage === 'adapted' && !s.changes) err(file, `adapted source "${s.title}" must describe changes made`);
    }
    const words = countWords(u.body);
    if (words < UNIT_WORDS_MIN || words > UNIT_WORDS_MAX)
      err(file, `unit body has ${words} words (expected ${UNIT_WORDS_MIN}–${UNIT_WORDS_MAX})`);
  }
  for (const [a, b] of [['en', 'de'], ['de', 'en']] as const) {
    for (const [key, u] of unitsByLang[a]) {
      const other = unitsByLang[b].get(key);
      if (!other) {
        err(u.file, `missing ${b} translation for unit ${key}`);
        continue;
      }
      if (a === 'en') {
        if (u.data.id !== other.data.id) err(other.file, `unit id differs from en version (${u.data.id})`);
        if (u.data.objectives.length !== other.data.objectives.length)
          err(other.file, 'number of objectives differs from en version');
      }
    }
  }

  // Roles: competency count, refs, coverage
  for (const { file, data } of roles) {
    const seen = new Set<string>();
    for (const rc of data.competencies) {
      if (seen.has(rc.id)) err(file, `competency "${rc.id}" listed twice`);
      seen.add(rc.id);
      if (!compById.has(rc.id)) err(file, `unknown competency "${rc.id}"`);
    }
    const roleSpecific = data.competencies.filter((rc) => compById.get(rc.id)?.track === 'role').length;
    if (data.kind === 'role' && (roleSpecific < ROLE_COMPETENCIES_MIN || roleSpecific > ROLE_COMPETENCIES_MAX))
      err(file, `role needs ${ROLE_COMPETENCIES_MIN}–${ROLE_COMPETENCIES_MAX} role-specific competencies (has ${roleSpecific})`);
    if (data.kind === 'core' && roleSpecific > 0) err(file, 'core track may only contain core competencies');

    for (const rc of data.competencies) {
      if (!compById.has(rc.id)) continue;
      const maxRank = Math.max(...LEVELS.map((l) => levelRank(rc.targets[l])));
      const required: Level[] = LEVELS.slice(0, maxRank);
      for (const lvl of required) {
        for (const lang of ['en', 'de'] as const) {
          if (!unitsByLang[lang].has(`${rc.id}/${lvl}`))
            err(file, `competency "${rc.id}" has no ${lang} unit for level ${lvl}`);
        }
      }
      const items = itemsByComp.get(rc.id) ?? [];
      if (items.length < MIN_ITEMS_PER_COMPETENCY)
        err(file, `competency "${rc.id}" has ${items.length} items (needs ≥ ${MIN_ITEMS_PER_COMPETENCY})`);
      for (const lvl of required) {
        const n = items.filter((i) => i.level === lvl).length;
        if (n < MIN_ITEMS_PER_LEVEL) err(file, `competency "${rc.id}" has ${n} ${lvl} items (needs ≥ ${MIN_ITEMS_PER_LEVEL})`);
      }
    }
  }

  return issues;
}
