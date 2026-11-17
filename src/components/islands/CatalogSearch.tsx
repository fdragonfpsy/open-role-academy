import { useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import { t } from '../../i18n';

interface Props {
  lang: Lang;
}

interface Hit {
  url: string;
  title: string;
  excerpt: string;
}

interface PagefindApi {
  search: (q: string) => Promise<{ results: { data: () => Promise<{ url: string; excerpt: string; meta: { title?: string } }> }[] }>;
}

let api: Promise<PagefindApi> | null = null;
const load = (): Promise<PagefindApi> => {
  // Built by `pagefind --site dist` after astro build; same origin, static file.
  const path = '/pagefind/pagefind.js';
  api ??= import(/* @vite-ignore */ path) as Promise<PagefindApi>;
  return api;
};

/** Full-text search over the static Pagefind index (language follows the page's html lang). */
export default function CatalogSearch({ lang }: Props) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [status, setStatus] = useState('');

  const run = async (e: Event) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setHits(null);
      setStatus('');
      return;
    }
    setStatus(t(lang, 'catalog.searching'));
    try {
      const pf = await load();
      const res = await pf.search(q);
      const found = await Promise.all(res.results.slice(0, 20).map((r) => r.data()));
      setHits(found.map((d) => ({ url: d.url, title: d.meta.title ?? d.url, excerpt: d.excerpt })));
      setStatus(res.results.length === 0 ? t(lang, 'catalog.searchNone') : `${res.results.length} ${t(lang, 'catalog.searchResults')}`);
    } catch {
      api = null;
      setHits(null);
      setStatus(t(lang, 'catalog.searchError'));
    }
  };

  return (
    <section aria-labelledby="catalog-search-title" class="mb-8 rounded border border-slate-300 bg-white p-4">
      <h2 id="catalog-search-title" class="mb-2 text-lg font-semibold">{t(lang, 'catalog.search')}</h2>
      <form role="search" class="flex flex-wrap items-end gap-3" onSubmit={run}>
        <div class="min-w-0 flex-1">
          <label for="catalog-q" class="font-medium">{t(lang, 'catalog.search')}</label>
          <input
            id="catalog-q"
            type="search"
            class="mt-1 block min-h-11 w-full rounded border border-slate-500 bg-white px-3 py-2"
            aria-describedby="catalog-q-hint"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
          <p id="catalog-q-hint" class="mt-1 text-sm text-slate-700">{t(lang, 'catalog.searchHint')}</p>
        </div>
        <button type="submit" class="min-h-11 rounded bg-blue-800 px-5 py-2 font-semibold text-white">
          {t(lang, 'catalog.searchButton')}
        </button>
      </form>
      <p role="status" aria-live="polite" id="catalog-search-status" class="mt-3 text-sm text-slate-700">{status}</p>
      {hits && hits.length > 0 && (
        <ul class="mt-2 space-y-3" id="catalog-search-results">
          {hits.map((h) => (
            <li class="rounded border border-slate-300 p-3">
              <a class="font-semibold text-blue-800 underline" href={h.url}>{h.title}</a>
              <p class="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: h.excerpt }} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
