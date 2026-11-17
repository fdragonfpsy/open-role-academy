// Keyboard-only e2e: skip placement -> dashboard -> recommended unit -> attribution/AI label -> mastery check -> dashboard updates.
// Usage: npm run build && npm run preview (other shell), then `npm run e2e`. Env: BASE_URL. Requires `playwright`.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

async function tabTo(page, pred, what) {
  for (let i = 0; i < 120; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(pred)) return true;
  }
  check(false, `could not reach ${what} by Tab`);
  return false;
}

const T = {
  en: { ai: 'AI-generated, not yet reviewed by a human', attribution: 'Sources and attribution', changes: 'Changes made', license: 'License', mastery: 'Mastery check' },
  de: { ai: 'KI-generiert, noch nicht von einem Menschen geprüft', attribution: 'Quellen und Namensnennung', changes: 'Vorgenommene Änderungen', license: 'Lizenz', mastery: 'Lernstandscheck' },
};

async function run(browser, lang) {
  const prefix = lang === 'de' ? '/de' : '';
  const tag = `[${lang}]`;
  const t = T[lang];
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  // Onboarding, skip placement.
  await page.goto(`${BASE}${prefix}/start`);
  await page.waitForSelector('form input[type=radio]');
  await tabTo(page, () => document.activeElement?.type === 'submit', 'start button');
  // The skip button is the next focusable button after submit.
  await page.keyboard.press('Tab');
  const skipOk = await page.evaluate(() => document.activeElement?.tagName === 'BUTTON');
  check(skipOk, `${tag} skip-placement button reachable`);
  await page.keyboard.press('Enter');
  await page.waitForSelector(`a[href="${prefix}/dashboard"]`);
  await tabTo(page, () => document.activeElement?.getAttribute('href')?.endsWith('/dashboard'), 'dashboard link');
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${prefix}/dashboard`);
  await page.waitForSelector('#next-title');

  // Learning path + recommended unit.
  const pathItems = await page.locator('#path-title ~ ol li').count();
  check(pathItems >= 1, `${tag} learning path lists ${pathItems} units`);
  const before = await page.locator('#comp-title ~ ul').innerText();
  const nextHref = await page.locator('#next-title ~ a').getAttribute('href');
  const firstPathHref = await page.locator('#path-title ~ ol li a').first().getAttribute('href');
  check(nextHref === firstPathHref, `${tag} next recommended unit equals first path step`);
  await tabTo(page, () => document.activeElement?.id === '' && document.activeElement?.getAttribute('href')?.includes('/units/'), 'recommended unit link');
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${nextHref}`);

  // Unit page.
  check((await page.getAttribute('html', 'lang')) === lang, `${tag} unit page lang`);
  const body = await page.locator('main').innerText();
  check(body.includes(t.ai), `${tag} AI-draft label shown`);
  check(await page.locator('#objectives ~ ul li').count() >= 1, `${tag} objectives listed`);
  check(await page.locator('#resources ~ ul li a').count() >= 1, `${tag} resources listed`);
  check((await page.locator('iframe').count()) === 0, `${tag} no iframes`);
  const resText = await page.locator('#resources ~ ul').innerText();
  check(resText.includes(t.license) && resText.includes(t.changes), `${tag} resource TASL fields (license, changes)`);
  const hasAttribution = (await page.locator('#sources').count()) > 0 && body.includes(t.attribution);
  check(hasAttribution, `${tag} attribution block present`);
  if (hasAttribution) check((await page.locator('#sources ~ ul').innerText()).includes(t.changes), `${tag} attribution shows changes made`);

  // Mastery check via keyboard.
  await tabTo(page, () => document.activeElement?.tagName === 'BUTTON' && document.activeElement.closest('section')?.getAttribute('aria-labelledby') === 'mastery', 'mastery start button');
  await page.keyboard.press('Enter');
  await page.waitForSelector('fieldset');
  let asked = 0;
  while (await page.locator('fieldset').count()) {
    if (!(await tabTo(page, () => document.activeElement?.name?.startsWith('q-'), 'answer input'))) break;
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter');
    await page.waitForSelector('[role=status][aria-live=polite]');
    await page.waitForTimeout(100);
    await tabTo(page, () => document.activeElement?.type === 'submit', 'next button');
    await page.keyboard.press('Enter');
    asked++;
    await page.waitForTimeout(100);
    if (asked > 6) break;
  }
  check(asked >= 3 && asked <= 5, `${tag} mastery check asked ${asked} items (3-5)`);
  await page.waitForSelector('#mastery ~ [role=status], [role=status][tabindex="-1"]');
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('role') === 'status');
  check(focused, `${tag} focus moved to mastery result panel`);
  const resultText = await page.locator('[role=status][tabindex="-1"]').innerText();
  check(resultText.length > 10, `${tag} mastery result shown`);

  // Back to dashboard by keyboard; state updated.
  await tabTo(page, () => document.activeElement?.getAttribute('href')?.endsWith('/dashboard'), 'dashboard link');
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${prefix}/dashboard`);
  await page.waitForSelector('#comp-title ~ ul');
  const after = await page.locator('#comp-title ~ ul').innerText();
  check(after !== before, `${tag} dashboard competency ratings updated after mastery check`);

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
console.log('\nAll unit e2e checks passed');
