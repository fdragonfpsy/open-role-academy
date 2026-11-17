// Mobile e2e: no horizontal overflow at 320px, minimum touch target sizes, on key pages (en and de).
// Usage: npm run build && npm run preview (other shell), then `node tests-e2e/mobile.e2e.mjs`. Env: BASE_URL, SHOT_DIR (optional screenshots).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const SHOT_DIR = process.env.SHOT_DIR;
const MIN = 24; // WCAG 2.2 AA 2.5.8 (target size minimum)
const COMFORT = 44; // buttons and form controls should reach this

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

const measure = () => {
  const vw = document.documentElement.clientWidth;
  const overflow = document.documentElement.scrollWidth - vw;
  const wide = [...document.querySelectorAll('body *')]
    .filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.right > vw + 1 && !e.closest('.sr-only') && getComputedStyle(e).position !== 'fixed';
    })
    .slice(0, 3)
    .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)}`);
  const small = [];
  for (const e of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea')) {
    if (e.closest('.sr-only') || e.classList.contains('sr-only')) continue;
    // Radios/checkboxes: the label is the target.
    const box = e.type === 'radio' || e.type === 'checkbox' ? (e.closest('label') ?? e) : e;
    const r = box.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.closest('p, li, span, td');
    const need = e.tagName === 'A' ? 24 : 44;
    if (!inline && (r.height < need - 0.5 || r.width < 24 - 0.5)) {
      small.push(`${e.tagName.toLowerCase()} "${(e.textContent || e.name || '').trim().slice(0, 25)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }
  return { overflow, wide, small };
};

async function audit(page, label, shotName) {
  await page.waitForTimeout(150);
  const m = await page.evaluate(measure);
  check(m.overflow <= 0, `${label}: no horizontal overflow (${m.overflow}px) ${m.overflow > 0 ? m.wide.join(', ') : ''}`);
  check(m.small.length === 0, `${label}: targets >= ${MIN}px links / ${COMFORT}px controls ${m.small.join('; ')}`);
  if (SHOT_DIR) await page.screenshot({ path: `${SHOT_DIR}/${shotName}.png`, fullPage: true });
}

async function pagesFor(ctx, lang, tag) {
  const p = lang === 'de' ? '/de' : '';
  const page = await ctx.newPage();
  const L = (s) => `${tag} [${lang}] ${s}`;
  const S = (s) => `${tag.replace(/\W+/g, '')}-${lang}-${s}`;
  await page.goto(`${BASE}${p}/`);
  await audit(page, L('home'), S('home'));
  await page.goto(`${BASE}${p}/catalog`);
  await page.waitForSelector('#filter-role');
  await audit(page, L('catalog'), S('catalog'));
  await page.goto(`${BASE}${p}/start`);
  await page.waitForSelector('form input[type=radio]');
  await audit(page, L('start'), S('start'));
  await page.getByRole('button').nth(0).click();
  await page.waitForSelector('#placement-title');
  await audit(page, L('placement question'), S('placement'));
  // Skip placement on a fresh page to get some progress, then dashboard.
  await page.goto(`${BASE}${p}/start`);
  await page.waitForSelector('form input[type=radio]');
  await page.locator('form button[type=button]').click();
  await page.waitForSelector(`a[href="${p}/dashboard"]`);
  await page.goto(`${BASE}${p}/dashboard`);
  await page.waitForSelector('#next-title');
  await audit(page, L('dashboard'), S('dashboard'));
  await page.goto(`${BASE}${p}/units/accounts-payable-foundation`);
  await audit(page, L('unit'), S('unit'));
  await page.goto(`${BASE}${p}/privacy`);
  await audit(page, L('privacy'), S('privacy'));
  await page.goto(`${BASE}${p}/imprint`);
  await audit(page, L('imprint'), S('imprint'));
  await page.close();
}

const browser = await chromium.launch();
const configs = [
  ['320px', { viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true }],
  ['iPhone13', devices['iPhone 13']],
  ['Pixel5', devices['Pixel 5']],
];
for (const [tag, opts] of configs) {
  for (const lang of ['en', 'de']) {
    const ctx = await browser.newContext(opts);
    await pagesFor(ctx, lang, tag);
    await ctx.close();
  }
}
await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall mobile checks passed');
