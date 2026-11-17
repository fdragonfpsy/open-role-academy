import { useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import { LEVELS, type Level } from '../../engine';
import { localizePath, t } from '../../i18n';
import type { CatalogData } from '../../lib/types';

interface Props {
  lang: Lang;
  catalog: CatalogData;
}

const field = 'mt-1 block min-h-11 w-full rounded border border-slate-500 bg-white px-3 py-2';

/** Role and level filters. Without JavaScript the full lists are still rendered (server side). */
export default function CatalogBrowser({ lang, catalog }: Props) {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const roleTitle = (id: string) => catalog.roles.find((r) => r.id === id)?.title ?? id;
  const competencyTitle = (id: string) => catalog.competencies.find((c) => c.id === id)?.title ?? id;

  const units = catalog.units.filter((u) => (!role || u.roleIds.includes(role)) && (!level || u.level === level));
  const competencies = catalog.competencies.filter(
    (c) => (!role || c.roleIds.includes(role)) && (!level || catalog.units.some((u) => u.competency === c.id && u.level === level)),
  );
  const roles = catalog.roles.filter((r) => !role || r.id === role);

  return (
    <div>
      <form class="mb-6 grid gap-4 rounded border border-slate-300 bg-white p-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <h2 class="text-lg font-semibold sm:col-span-2">{t(lang, 'catalog.filters')}</h2>
        <div>
          <label for="filter-role" class="font-medium">{t(lang, 'catalog.filterRole')}</label>
          <select id="filter-role" class={field} value={role} onChange={(e) => setRole(e.currentTarget.value)}>
            <option value="">{t(lang, 'catalog.filterAll')}</option>
            {catalog.roles.map((r) => (
              <option value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label for="filter-level" class="font-medium">{t(lang, 'catalog.filterLevel')}</label>
          <select id="filter-level" class={field} value={level} onChange={(e) => setLevel(e.currentTarget.value)}>
            <option value="">{t(lang, 'catalog.filterAll')}</option>
            {LEVELS.map((l) => (
              <option value={l}>{t(lang, `level.${l as Level}`)}</option>
            ))}
          </select>
        </div>
        <p role="status" aria-live="polite" class="text-sm text-slate-700 sm:col-span-2" id="filter-count">
          {units.length} {t(lang, 'catalog.filterCount')}
        </p>
      </form>

      <section aria-labelledby="cat-roles" class="mb-10">
        <h2 id="cat-roles" class="mb-3 text-2xl font-semibold">{t(lang, 'catalog.roles')}</h2>
        <ul class="space-y-3" id="catalog-roles">
          {roles.map((r) => (
            <li class="rounded border border-slate-300 bg-white p-4">
              <span class="font-semibold">{r.title}</span>
              <p class="text-slate-700">{r.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cat-competencies" class="mb-10">
        <h2 id="cat-competencies" class="mb-3 text-2xl font-semibold">{t(lang, 'catalog.competencies')}</h2>
        <ul class="space-y-3" id="catalog-competencies">
          {competencies.map((c) => (
            <li class="rounded border border-slate-300 bg-white p-4">
              <span class="font-semibold">{c.title}</span>{' '}
              <span class="text-sm text-slate-700">({t(lang, `catalog.track.${c.track}`)})</span>
              <p class="text-slate-700">{c.description}</p>
              <p class="mt-1 text-sm text-slate-700">
                {t(lang, 'catalog.usedBy')}: {c.roleIds.map(roleTitle).join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cat-units">
        <h2 id="cat-units" class="mb-3 text-2xl font-semibold">{t(lang, 'catalog.units')}</h2>
        {units.length === 0 && <p>{t(lang, 'catalog.noUnits')}</p>}
        <ul class="space-y-3" id="catalog-units">
          {units.map((u) => (
            <li class="rounded border border-slate-300 bg-white p-4">
              <a class="font-semibold text-blue-800 underline" href={localizePath(lang, `/units/${u.id}`)}>
                {u.title}
              </a>
              <p class="text-sm text-slate-700">
                {competencyTitle(u.competency)} · {t(lang, `level.${u.level}`)} · {u.minutes} {t(lang, 'unit.minutes')}
              </p>
              {u.status === 'ai-draft' && (
                <p class="mt-1 inline-block rounded border border-amber-700 bg-amber-50 px-2 py-1 text-sm font-medium text-amber-900">
                  {t(lang, 'aiDraft.label')}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
