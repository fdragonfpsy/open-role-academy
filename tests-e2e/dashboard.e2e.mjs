// Keyboard-only e2e of the dashboard (en and de): accessible bars, export, import round-trip, invalid import, review queue.
// Usage: npm run build && npm run preview (other shell), then `npm run e2e`. Env: BASE_URL. Requires `playwright`.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const KEY = 'open-role-academy.progress.v1';
const ITEM = { id: 'isb-f-cia-confidentiality', competency: 'information-security-basics' };

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

async function tabTo(page, pred, what) {
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(pred)) return true;
  }
  check(false, `could not reach ${what} by Tab`);
  return false;
}

const T = {
  en: { err: 'Could not import file', ok: 'Progress imported.', invalid: 'not valid JSON' },
  de: { err: 'Datei konnte nicht importiert werden', ok: 'Fortschritt importiert.', invalid: 'kein gültiges JSON' },
};

async function run(browser, lang, dir) {
  const prefix = lang === 'de' ? '/de' : '';
  const tag = `[${lang}]`;
  const t = T[lang];
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  // Onboarding, skip placement (keyboard).
  await page.goto(`${BASE}${prefix}/start`);
  await page.waitForSelector('form input[type=radio]');
  await tabTo(page, () => document.activeElement?.type === 'submit', 'start button');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForSelector(`a[href="${prefix}/dashboard"]`);

  // Seed one due review card, then open the dashboard.
  await page.evaluate(([key, item]) => {
    const s = JSON.parse(localStorage.getItem(key));
    s.reviews[item.id] = { itemId: item.id, competency: item.competency, box: 0, due: '2020-01-01' };
    localStorage.setItem(key, JSON.stringify(s));
  }, [KEY, ITEM]);
  await page.goto(`${BASE}${prefix}/dashboard`);
  await page.waitForSelector('#next-title');

  // Bars with accessible text.
  const meters = page.locator('[role=meter]');
  const n = await meters.count();
  check(n >= 1, `${tag} ${n} competency bars`);
  let allLabelled = true;
  for (let i = 0; i < n; i++) {
    const m = meters.nth(i);
    const label = (await m.getAttribute('aria-label')) ?? '';
    const text = await m.locator('xpath=preceding-sibling::div[1]').innerText();
    if (!label.includes(':') || !/\d/.test(text) || !text.includes(':')) allLabelled = false;
  }
  check(allLabelled, `${tag} every bar has aria-label and visible current/target/rating text`);
  check((await page.locator('[data-testid=progress]').innerText()).match(/\d+ \/ \d+/) !== null, `${tag} progress summary shown`);

  // Review queue reachable by keyboard.
  const dueBefore = await page.locator('#review-title ~ div ul li').count();
  check(dueBefore >= 1, `${tag} review queue lists ${dueBefore} due item(s)`);
  await tabTo(page, () => document.activeElement?.tagName === 'BUTTON' && !!document.activeElement.closest('section[aria-labelledby=review-title]'), 'review start button');
  await page.keyboard.press('Enter');
  await page.waitForSelector('fieldset');
  check(true, `${tag} review item shown`);
  await tabTo(page, () => document.activeElement?.name?.startsWith('q-'), 'review answer input');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[role=status][aria-live=polite]');
  await tabTo(page, () => document.activeElement?.type === 'submit', 'review next button');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => !document.querySelector('fieldset'));
  const stored = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).reviews, KEY);
  check(stored[ITEM.id] && stored[ITEM.id].due > '2020-01-01', `${tag} review answer rescheduled the card`);

  // Export via keyboard.
  await tabTo(page, () => document.activeElement?.tagName === 'BUTTON' && document.activeElement.className.includes('border-blue-800') && !!document.activeElement.closest('section:not([aria-labelledby])'), 'export button');
  const [download] = await Promise.all([page.waitForEvent('download'), page.keyboard.press('Enter')]);
  const file = join(dir, `export-${lang}.json`);
  await download.saveAs(file);
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    parsed = null;
  }
  check(parsed?.format === 'open-role-academy-progress' && parsed.state?.version === 1, `${tag} export is valid progress JSON`);

  // Import round trip (modify the file so the change is observable).
  parsed.state.completedUnits = ['roundtrip-marker'];
  writeFileSync(file, JSON.stringify(parsed));
  await page.setInputFiles('input[type=file]', file);
  await page.waitForFunction((m) => document.body.innerText.includes(m), t.ok);
  const back = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  check(back.completedUnits.includes('roundtrip-marker') && back.roleId === parsed.state.roleId, `${tag} import round-trips`);

  // Invalid imports.
  const bad = join(dir, `bad-${lang}.json`);
  writeFileSync(bad, '{ not json');
  await page.setInputFiles('input[type=file]', bad);
  await page.waitForFunction((m) => document.body.innerText.includes(m), t.err);
  const msg = await page.locator('section [role=status]').last().innerText();
  check(msg.includes(t.invalid), `${tag} invalid JSON shows localized error ("${msg}")`);
  writeFileSync(bad, '{"format":"x"}');
  await page.setInputFiles('input[type=file]', bad);
  await page.waitForFunction(() => /Open Role Academy/.test(document.querySelector('section:last-of-type [role=status]')?.textContent ?? ''));
  check(true, `${tag} wrong-format file shows error`);
  const still = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).completedUnits, KEY);
  check(still.includes('roundtrip-marker'), `${tag} failed import leaves progress untouched`);

  check(errors.length === 0, `${tag} no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  await ctx.close();
}

const dir = mkdtempSync(join(tmpdir(), 'ora-e2e-'));
const browser = await chromium.launch();
try {
  for (const lang of ['en', 'de']) await run(browser, lang, dir);
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll dashboard e2e checks passed');
