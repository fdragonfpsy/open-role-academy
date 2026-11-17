// Keyboard-only catalog e2e (en + de): lists units, level filter, Pagefind search in the right language, no console errors.
// Usage: npm run build && npm run preview (other shell), then `node tests-e2e/catalog.e2e.mjs`. Env: BASE_URL.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

const T = {
  en: { level: 'Level', search: 'Search', foundation: 'Foundation', term: 'invoice', nav: 'Catalog' },
  de: { level: 'Niveau', search: 'Suchen', foundation: 'Grundlagen', term: 'Rechnung', nav: 'Katalog' },
};

async function run(browser, lang) {
  const p = lang === 'de' ? '/de' : '';
  const L = (s) => `[${lang}] ${s}`;
  const t = T[lang];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const external = [];
  page.on('request', (r) => !r.url().startsWith(BASE) && !r.url().startsWith('data:') && external.push(r.url()));

  await page.goto(`${BASE}${p}/`);
  await page.getByRole('link', { name: t.nav, exact: true }).first().focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${p}/catalog`);
  await page.waitForSelector('#filter-level');
  check(true, L('catalog reachable from header nav via keyboard'));

  const total = await page.locator('#catalog-units > li').count();
  check(total > 10, L(`catalog lists units (${total})`));
  check((await page.locator('#catalog-units a').first().getAttribute('href')).startsWith(`${p}/units/`), L('unit links stay in language'));

  // Level filter by keyboard: focus the select, pick an option.
  await page.getByLabel(t.level, { exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  const afterLevel = await page.locator('#catalog-units > li').count();
  const selected = await page.getByLabel(t.level, { exact: true }).inputValue();
  check(selected === 'foundation' && afterLevel > 0 && afterLevel < total, L(`level filter narrows ${total} -> ${afterLevel}`));
  const texts = await page.locator('#catalog-units > li > p:first-of-type').allTextContents();
  check(texts.every((x) => x.includes(t.foundation)), L('all remaining units are foundation level'));
  const live = await page.locator('#filter-count').textContent();
  check(live.startsWith(String(afterLevel)), L('live region reports count'));

  // Search by keyboard.
  await page.locator('#catalog-q').focus();
  await page.keyboard.type(t.term);
  await page.keyboard.press('Enter');
  await page.waitForSelector('#catalog-search-results li', { timeout: 10000 });
  const hits = await page.locator('#catalog-search-results a').count();
  check(hits > 0, L(`search "${t.term}" returns ${hits} results`));
  const hrefs = await page.locator('#catalog-search-results a').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
  const other = lang === 'de' ? (h) => !h.startsWith('/de/') : (h) => h.startsWith('/de/');
  check(!hrefs.some(other), L('all results are in the page language'));
  check((await page.locator('#catalog-search-status').textContent()).length > 0, L('status announced'));

  check(errors.length === 0, L(`no console errors ${errors.join(' | ')}`));
  check(external.length === 0, L(`no third-party requests ${external.join(' ')}`));
  await ctx.close();
}

const browser = await chromium.launch();
for (const lang of ['en', 'de']) await run(browser, lang);
await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall catalog checks passed');
