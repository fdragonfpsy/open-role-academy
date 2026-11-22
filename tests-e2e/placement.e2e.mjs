// Keyboard-only end-to-end check of onboarding + placement (en and de).
// Usage: npm run build && npm run preview (in another shell), then `npm run e2e`.
// Env: BASE_URL (default http://localhost:4321). Requires `playwright` to be available (not a project dependency).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const BUDGET = 15;

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

const EN_ONLY = ['Start placement check', 'Check answer', 'Next question', 'Placement complete', 'Your dashboard'];
const DE_ONLY = ['Einstufungstest', 'Antwort prüfen', 'Nächste Frage', 'Einstufung abgeschlossen', 'Zu deinem Dashboard'];

const focusInfo = (page) =>
  page.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return null;
    const cs = getComputedStyle(e);
    return {
      tag: e.tagName,
      type: e.type ?? '',
      name: e.name ?? '',
      text: (e.textContent ?? '').trim().slice(0, 40),
      outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
    };
  });

/** Tab forward until the focused element satisfies `pred` (evaluated in page), max 60 presses. */
async function tabTo(page, pred, what) {
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate(pred);
    if (hit) return true;
  }
  check(false, `could not reach ${what} by Tab`);
  return false;
}

async function run(browser, lang) {
  const de = lang === 'de';
  const prefix = de ? '/de' : '';
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const tag = `[${lang}]`;

  await page.goto(`${BASE}${prefix}/start`);
  await page.waitForSelector('form input[type=radio]');
  check((await page.getAttribute('html', 'lang')) === lang, `${tag} html lang="${lang}"`);

  // Language switch is reachable by keyboard (link to other language exists in nav/header).
  const otherHref = await page.evaluate((l) => {
    const a = [...document.querySelectorAll('a[hreflang], a[lang]')].find((x) => (x.getAttribute('hreflang') ?? x.getAttribute('lang')) === (l === 'de' ? 'en' : 'de'));
    return a?.getAttribute('href') ?? null;
  }, lang);
  check(otherHref !== null, `${tag} language switch link present (${otherHref})`);

  // Role + level radios: labelled, grouped in fieldsets with legends.
  const groups = await page.evaluate(() =>
    [...document.querySelectorAll('form fieldset')].map((f) => ({
      legend: f.querySelector('legend')?.textContent?.trim() ?? '',
      radios: [...f.querySelectorAll('input[type=radio]')].map((r) => r.labels?.[0]?.textContent?.trim() ?? ''),
    })),
  );
  check(groups.length === 2 && groups.every((g) => g.legend && g.radios.length >= 3 && g.radios.every(Boolean)), `${tag} role and level fieldsets with legends and labelled radios`);
  const roleCount = groups[0]?.radios.length ?? 0;
  check(roleCount >= 2, `${tag} ${roleCount} roles selectable`);

  // Keyboard: Tab into role group, ArrowDown to select the 2nd role.
  await tabTo(page, () => document.activeElement?.name === 'role', 'role radio group');
  let f = await focusInfo(page);
  check(f?.outline === true || (await page.evaluate(() => getComputedStyle(document.activeElement).boxShadow !== 'none')), `${tag} focus indicator visible on radio`);
  await page.keyboard.press('ArrowDown');
  const roleChecked = await page.evaluate(() => [...document.querySelectorAll('input[name=role]')].findIndex((r) => r.checked));
  check(roleChecked === 1, `${tag} role changed with ArrowDown`);

  // Level group: select "practitioner" (2nd).
  await tabTo(page, () => document.activeElement?.name === 'level', 'level radio group');
  await page.keyboard.press('ArrowDown');
  const levelChecked = await page.evaluate(() => [...document.querySelectorAll('input[name=level]')].findIndex((r) => r.checked));
  check(levelChecked === 1, `${tag} level changed with ArrowDown`);

  // Start button, Enter.
  await tabTo(page, () => document.activeElement?.type === 'submit', 'start button');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#placement-title');

  // Focus management: after the placement view appears, focus should not be lost to <body>.
  let asked = 0;
  let sawFocusLost = false;
  let sawLiveFeedback = true;
  while (asked < BUDGET + 3) {
    if (await page.locator('#placement-title').count() === 0) break;
    const legend = (await page.locator('fieldset legend').first().textContent()) ?? '';
    const m = legend.match(/(\d+)\D+(\d+)/);
    check(!!m && Number(m[1]) === asked + 1, `${tag} question counter shows ${asked + 1} (${legend.trim().slice(0, 40)})`) ;
    if (m && Number(m[2]) > BUDGET) check(false, `${tag} announced total ${m[2]} exceeds budget`);
    if (asked === 0) {
      const body = await page.locator('main').innerText();
      check(!(de ? EN_ONLY : DE_ONLY).some((s) => body.includes(s)), `${tag} no foreign-language UI strings in placement`);
    }
    // Move focus to the answer group via Tab, pick option by arrows (vary: first or second).
    const ok = await tabTo(page, () => document.activeElement?.name?.startsWith('q-'), 'answer radio/checkbox');
    if (!ok) break;
    const isMulti = (await focusInfo(page))?.type === 'checkbox';
    if (!isMulti && asked % 2 === 1) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    // Enter submits via implicit submission -> "check answer".
    await page.keyboard.press('Enter');
    await page.waitForSelector('[role=status][aria-live=polite]');
    sawLiveFeedback &&= (await page.locator('[role=status][aria-live=polite]').count()) === 1;
    // Next / finish: focus must still be in the form; Tab to submit button then Enter.
    await page.waitForTimeout(100); // let the focus effect run
    const fi = await focusInfo(page);
    if (!fi) sawFocusLost = true;
    await tabTo(page, () => document.activeElement?.type === 'submit', 'next button');
    await page.keyboard.press('Enter');
    asked++;
    await page.waitForTimeout(50);
  }
  check(asked >= 1 && asked <= BUDGET, `${tag} placement ended after ${asked} questions (<= ${BUDGET})`);
  check(sawLiveFeedback, `${tag} feedback announced via role=status aria-live`);
  check(!sawFocusLost, `${tag} focus not lost to <body> after checking an answer`);

  // Result page.
  await page.waitForSelector(`a[href="${prefix}/dashboard"]`);
  const resultBody = await page.locator('main').innerText();
  check(!(de ? EN_ONLY : DE_ONLY).some((s) => resultBody.includes(s)), `${tag} no foreign strings on result`);
  await page.waitForTimeout(100);
  const focusAfter = await focusInfo(page);
  check(focusAfter !== null, `${tag} focus is managed on the result view (not on <body>)`);
  await tabTo(page, () => document.activeElement?.tagName === 'A' && document.activeElement.getAttribute('href')?.endsWith('/dashboard'), 'dashboard link');
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${prefix}/dashboard`);
  await page.waitForSelector('main h1');
  await page.waitForSelector('#comp-title ~ ul'); // dashboard content is rendered by the island after hydration
  const dash = await page.locator('main').innerText();
  check(dash.length > 100, `${tag} dashboard reachable and rendered`);
  check(!(de ? EN_ONLY : DE_ONLY).some((s) => dash.includes(s)), `${tag} no foreign strings on dashboard`);
  check((await page.getAttribute('html', 'lang')) === lang, `${tag} dashboard lang="${lang}"`);

  check(errors.length === 0, `${tag} no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  await page.close();
}

const browser = await chromium.launch();
try {
  for (const lang of ['en', 'de']) await run(browser, lang);
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll e2e checks passed');
