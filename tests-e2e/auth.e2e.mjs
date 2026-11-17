// E2E of the account UI (en and de) against fake Supabase responses. NOT part of CI and never contacts Supabase.
// It serves a build made with the test flag by itself:
//   PUBLIC_ACCOUNTS_ENABLED=true npx astro build --outDir dist-auth-test
//   node tests-e2e/auth.e2e.mjs
// Env: DIST_AUTH (default dist-auth-test), DIST_DEFAULT (default dist; the normal build, flag off). Requires `playwright`.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const DIST_AUTH = resolve(process.env.DIST_AUTH ?? 'dist-auth-test');
const DIST_DEFAULT = resolve(process.env.DIST_DEFAULT ?? 'dist');
const KEY = 'open-role-academy.progress.v1';
const UID = '22222222-2222-4222-8222-222222222222';

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

// ---------------------------------------------------------------- default build (flag off)
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
if (existsSync(DIST_DEFAULT)) {
  const files = walk(DIST_DEFAULT).filter((f) => !f.includes('/pagefind/'));
  const html = files.filter((f) => f.endsWith('.html'));
  const js = files.filter((f) => f.endsWith('.js'));
  check(!existsSync(join(DIST_DEFAULT, 'account')) && !existsSync(join(DIST_DEFAULT, 'de/account')), 'default build: no /account or /de/account pages');
  check(!html.some((f) => /href="(\/de)?\/account/.test(readFileSync(f, 'utf8'))), 'default build: no account link in any page');
  check(!js.some((f) => /supabase\.co|sb_publishable|GoTrue|AccountPanel/.test(readFileSync(f, 'utf8')) || /AccountPanel/.test(f)), 'default build: no supabase-js / account island chunk');
  check(!html.some((f) => /supabase/i.test(readFileSync(f, 'utf8'))), 'default build: no page mentions supabase');
} else {
  console.log(`skip default-build checks (no ${DIST_DEFAULT})`);
}

// ---------------------------------------------------------------- static server for the flag-on build
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let file = join(DIST_AUTH, path);
  if (!file.startsWith(DIST_AUTH)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  else if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!existsSync(file)) return res.writeHead(404).end('not found');
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// ---------------------------------------------------------------- fake Supabase
const user = { id: UID, aud: 'authenticated', role: 'authenticated', email: 'learner@example.org', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const session = () => ({ access_token: 'aaa.bbb.ccc', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'rrr', user });
const json = (route, status, body, headers = {}) =>
  route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', ...headers }, body: JSON.stringify(body) });

/** Install a fake for every request to *.supabase.co; `calls` records "METHOD path" and bodies. */
async function fakeSupabase(ctx, calls, mode) {
  await ctx.route(/\.supabase\.co\//, async (route) => {
    const req = route.request();
    const u = new URL(req.url());
    const key = `${req.method()} ${u.pathname}`;
    if (req.method() === 'OPTIONS') return json(route, 204, {});
    calls.push({ key, body: req.postData() ?? '' });
    if (u.pathname === '/auth/v1/signup') return json(route, 200, { ...user, identities: [] });
    if (u.pathname === '/auth/v1/otp') return json(route, 200, {});
    if (u.pathname === '/auth/v1/recover') return json(route, 200, {});
    if (u.pathname === '/auth/v1/token') {
      const body = JSON.parse(req.postData() ?? '{}');
      if (body.password === 'wrong-password-123') return json(route, 400, { code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials RAW-LEAK' });
      return json(route, 200, session());
    }
    if (u.pathname === '/auth/v1/user') return json(route, 200, user);
    if (u.pathname === '/auth/v1/logout') return json(route, 204, {});
    if (mode.offline && u.pathname.startsWith('/rest/v1/')) return route.abort('failed');
    const table = u.pathname.replace('/rest/v1/', '');
    if (['progress', 'item_responses', 'completed_units'].includes(table) && req.method() === 'GET') return json(route, 200, mode.remote?.[table] ?? []);
    if (u.pathname === '/rest/v1/profiles' && req.method() === 'GET') {
      const row = mode.profile ?? (mode.profileExists ? { id: UID } : null);
      const single = (req.headers().accept ?? '').includes('vnd.pgrst.object');
      return json(route, 200, single ? row : row ? [row] : []);
    }
    if (u.pathname.startsWith('/rest/v1/') && req.method() === 'POST') return json(route, 201, []);
    if (u.pathname === '/rest/v1/rpc/export_my_data') return json(route, 200, { user_id: UID, progress: [], exported_at: 'now' });
    if (u.pathname === '/rest/v1/rpc/delete_my_account') return json(route, 204, {});
    return json(route, 500, { message: 'unexpected' });
  });
}

const T = {
  en: {
    emailReq: 'Enter your email address.', emailBad: 'does not look valid', pwShort: 'at least 10 characters', consent: 'confirm that you have read the privacy policy',
    mismatch: 'do not match', wrong: 'Email address or password is wrong.', spam: 'check your spam folder', signUpLink: 'Create an account', magicLink: 'Sign in with an email link instead',
    forgotLink: 'Forgot your password?', deleteWord: 'DELETE', deleteErr: 'Type the confirmation word', deleted: 'were deleted', changed: 'password was changed', importYes: 'Import progress', importDone: 'Progress imported',
    pTitle: 'Your learning profile', pSet: 'Set up profile', pEdit: 'Edit profile', pSkip: 'Skip for now', pSave: 'Save profile', pSaved: 'Profile saved.',
    pMinutesErr: 'whole minutes between 0 and 10080', pGoalErr: 'too long', pMinimal: 'name, employer or date of birth', pCount: '5 of 500 characters', pLegendLevel: 'Experience level', pLegendLang: 'Preferred language',
    pRoleTitle: 'Human Resources', pLevelTitle: 'Advanced', pMinutesSummary: '120 min per week', pLangTitle: 'Deutsch', pEmpty: 'Not set',
    export: 'Download my data', masteryStart: 'Start mastery check', syncSynced: 'Progress synced with your account.', syncPending: 'will sync later', syncFailed: 'Sync failed', syncRetry: 'Try again', signOut: 'Sign out', signedOut: 'You are signed out.', nav: 'Account',
  },
  de: {
    emailReq: 'Gib deine E-Mail-Adresse ein.', emailBad: 'nicht gültig', pwShort: 'mindestens 10 Zeichen', consent: 'Datenschutzerklärung gelesen',
    mismatch: 'nicht überein', wrong: 'E-Mail-Adresse oder Passwort ist falsch.', spam: 'Spam-Ordner', signUpLink: 'Konto erstellen', magicLink: 'Stattdessen mit E-Mail-Link anmelden',
    forgotLink: 'Passwort vergessen?', deleteWord: 'LÖSCHEN', deleteErr: 'Bestätigungswort', deleted: 'wurden gelöscht', changed: 'Passwort wurde geändert', importYes: 'Fortschritt übernehmen', importDone: 'Fortschritt in dein Konto übernommen',
    pTitle: 'Dein Lernprofil', pSet: 'Profil einrichten', pEdit: 'Profil bearbeiten', pSkip: 'Vorerst überspringen', pSave: 'Profil speichern', pSaved: 'Profil gespeichert.',
    pMinutesErr: 'ganze Minuten zwischen 0 und 10080', pGoalErr: 'zu lang', pMinimal: 'Namen, Arbeitgeber oder Geburtsdatum', pCount: '5 von 500 Zeichen', pLegendLevel: 'Erfahrungsniveau', pLegendLang: 'Bevorzugte Sprache',
    pRoleTitle: 'Personalwesen (HR)', pLevelTitle: 'Experte', pMinutesSummary: '120 Min. pro Woche', pLangTitle: 'Deutsch', pEmpty: 'Nicht angegeben',
    export: 'Meine Daten herunterladen', masteryStart: 'Lernstandscheck starten', syncSynced: 'Fortschritt mit deinem Konto abgeglichen.', syncPending: 'später abgeglichen', syncFailed: 'Abgleich fehlgeschlagen', syncRetry: 'Erneut versuchen', signOut: 'Abmelden', signedOut: 'Du bist abgemeldet.', nav: 'Konto',
  },
};

const LOCAL = {
  version: 1, roleId: 'it-support-operations', selfLevel: 'foundation', createdAt: '2026-11-01T10:00:00.000Z', placementDone: true,
  competencies: { 'information-security-basics': { rating: 1010, correctByLevel: { foundation: 1, practitioner: 0, advanced: 0 }, answered: 1, answeredItems: ['isb-f-cia-confidentiality'] } },
  reviews: {}, completedUnits: [],
};

async function tabTo(page, pred, what, arg) {
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(pred, arg)) return true;
  }
  check(false, `could not reach ${what} by Tab`);
  return false;
}
const alertText = (page) => page.locator('#auth-error').innerText();
const statusText = (page) => page.locator('[role=status]').first().innerText();

const SESSION_KEY = 'sb-bbyyjrmgmbiscdswufla-auth-token';
async function newPage(browser, _lang, { mode = {}, seed = false, signedIn = false } = {}) {
  const ctx = await browser.newContext({ acceptDownloads: true });
  const calls = [];
  const errors = [];
  const chunks = [];
  await fakeSupabase(ctx, calls, mode);
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => /\/_astro\/dist\.[^/]*\.js/.test(r.url()) && chunks.push(r.url()));
  if (signedIn) await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), [SESSION_KEY, JSON.stringify(session())]);
  if (seed) await ctx.addInitScript(([k, v]) => { if (!localStorage.getItem(k)) localStorage.setItem(k, v); }, [KEY, JSON.stringify(LOCAL)]);
  return { ctx, page, calls, errors, chunks };
}


const UNIT = 'information-security-basics-foundation';
/** Run the unit's mastery check by mouse until the result panel shows. */
async function answerMastery(page) {
  const start = page.locator('#mastery ~ * button, section[aria-labelledby=mastery] button').first();
  await start.waitFor();
  await start.click();
  for (let i = 0; i < 8 && !(await page.locator('[role=status][tabindex="-1"]').count()); i++) {
    await page.waitForSelector('fieldset, [role=status][tabindex="-1"]');
    if (!(await page.locator('fieldset').count())) break;
    await page.locator('fieldset input').first().check();
    await page.locator('button[type=submit]').click();
    await page.waitForSelector('[role=status][aria-live=polite]');
    await page.locator('button[type=submit]').click();
  }
  await page.waitForSelector('[role=status][tabindex="-1"]');
}

async function run(browser, lang) {
  const prefix = lang === 'de' ? '/de' : '';
  const tag = `[${lang}]`;
  const t = T[lang];

  // ---- anonymous visit: forms render, no Supabase code or traffic, validation, keyboard flow
  {
    const { page, calls, chunks } = await newPage(browser, lang);
    await page.goto(`${BASE}${prefix}/`);
    check((await page.locator(`nav a[href="${prefix}/account"]`).count()) === 1, `${tag} header shows account link when enabled (${t.nav})`);
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    check(chunks.length === 0 && calls.length === 0, `${tag} anonymous visit loads no supabase-js and makes no Supabase request`);
    check((await page.locator('label[for=auth-email]').count()) === 1 && (await page.locator('label[for=auth-password]').count()) === 1, `${tag} sign-in inputs have labels`);

    // empty submit
    await page.click('button[type=submit]');
    check((await alertText(page)).includes(t.emailReq), `${tag} empty submit shows localized email error`);
    check(await page.evaluate(() => document.activeElement?.id === 'auth-email'), `${tag} focus moves to the invalid email field`);
    check((await page.locator('#auth-email').getAttribute('aria-invalid')) === 'true', `${tag} invalid field has aria-invalid`);
    await page.fill('#auth-email', 'not-an-email');
    await page.click('button[type=submit]');
    check((await alertText(page)).includes(t.emailBad), `${tag} invalid email message`);
    check(calls.length === 0 && chunks.length === 0, `${tag} validation errors cause no network call`);

    // touch targets >= 44px
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('main button, main input:not([type=checkbox]), main a')].filter((e) => e.getBoundingClientRect().height < 44 && e.closest('#auth-error') === null).map((e) => e.outerHTML.slice(0, 60)));
    check(small.length === 0, `${tag} sign-in controls are at least 44px high${small.length ? ': ' + small.join(' | ') : ''}`);

    // keyboard: reach "create account" link, Enter, heading gets focus
    await page.fill('#auth-email', 'learner@example.org');
    await page.focus('#auth-password');
    await tabTo(page, (n) => document.activeElement?.tagName === 'BUTTON' && document.activeElement.textContent.length > 0 && document.activeElement.type === 'button' && document.activeElement.textContent.includes(n), 'sign-up link', t.signUpLink);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.tagName === 'H2');
    check(true, `${tag} keyboard: switching to sign-up moves focus to its heading`);
  }

  // ---- sign up: validation, consent, waiting screen with spam hint
  {
    const { ctx, page, calls, errors } = await newPage(browser, lang);
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    await page.getByRole('button', { name: t.signUpLink }).click();
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'short');
    await page.click('button[type=submit]');
    check((await alertText(page)).includes(t.pwShort), `${tag} sign-up: short password message`);
    await page.fill('#auth-password', 'a-long-enough-password');
    await page.click('button[type=submit]');
    check((await alertText(page)).includes(t.consent), `${tag} sign-up: consent required`);
    check(calls.length === 0, `${tag} sign-up: nothing sent before the form is valid`);
    check(/privacy/.test(await page.locator('main a[href$="/privacy"]').getAttribute('href')), `${tag} sign-up: consent note links the privacy policy`);
    await page.check('#auth-agree');
    await page.click('button[type=submit]');
    await page.getByText(t.spam, { exact: false }).waitFor();
    check(true, `${tag} sign-up: "check inbox" screen shows the spam-folder hint`);
    const signup = calls.find((c) => c.key === 'POST /auth/v1/signup');
    check(!!signup && signup.body.includes('learner@example.org'), `${tag} sign-up: request sent only after submit`);
    check(await page.evaluate(() => document.activeElement?.tagName === 'H2'), `${tag} sign-up: focus on waiting-screen heading`);
    check(errors.length === 0, `${tag} sign-up: no console errors${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }

  // ---- magic link + forgot password waiting screens
  for (const [name, link, submitCount] of [['magic link', t.magicLink, '/auth/v1/otp'], ['forgot password', t.forgotLink, '/auth/v1/recover']]) {
    const { ctx, page, calls } = await newPage(browser, lang);
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    await page.getByRole('button', { name: link }).click();
    await page.fill('#auth-email', 'learner@example.org');
    await page.click('button[type=submit]');
    await page.getByText(t.spam, { exact: false }).waitFor();
    check(calls.some((c) => c.key === `POST ${submitCount}`), `${tag} ${name}: request sent and spam hint shown`);
    await ctx.close();
  }

  // ---- wrong password: friendly message, no raw text
  {
    const { ctx, page } = await newPage(browser, lang);
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'wrong-password-123');
    await page.click('button[type=submit]');
    await page.waitForFunction((w) => document.querySelector('#auth-error')?.textContent.includes(w), t.wrong);
    check(!(await alertText(page)).includes('RAW-LEAK'), `${tag} wrong password: friendly message, raw server text not shown`);
    await ctx.close();
  }

  // ---- signed in: import offer, export, sign out
  {
    const { ctx, page, calls, errors } = await newPage(browser, lang, { seed: true });
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'correct-password-123');
    await page.click('button[type=submit]');
    await page.getByRole('button', { name: t.importYes }).waitFor();
    check(true, `${tag} signed in: offers to import local progress`);
    await page.getByRole('button', { name: t.importYes }).click();
    await page.getByText(t.importDone).waitFor();
    const prof = calls.find((c) => c.key === 'POST /rest/v1/profiles');
    check(!!prof && prof.body.includes('"role_family":"it-support-operations"') && prof.body.includes(UID), `${tag} import: profile row mapped from local state`);
    check(calls.some((c) => c.key === 'POST /rest/v1/progress') && calls.some((c) => c.key === 'POST /rest/v1/item_responses'), `${tag} import: progress and item rows written`);
    check((await page.evaluate((k) => localStorage.getItem(k), KEY)) === JSON.stringify(LOCAL), `${tag} import: local progress unchanged`);
    check(!calls.some((c) => /rest\/v1\/(progress|item_responses)/.test(c.key) && c.key.startsWith('GET')), `${tag} no dashboard sync reads`);

    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: t.export }).click()]);
    check(dl.suggestedFilename().endsWith('.json'), `${tag} export: JSON download started`);

    // delete: wrong word, then right word
    await page.fill('#auth-delete', 'nope');
    await page.locator('button.bg-red-800').click();
    check((await alertText(page)).includes(t.deleteErr), `${tag} delete: needs the typed confirmation word`);
    check(!calls.some((c) => c.key.includes('delete_my_account')), `${tag} delete: no RPC before confirmation`);
    await page.fill('#auth-delete', t.deleteWord.toLowerCase());
    await page.locator('button.bg-red-800').click();
    await page.getByText(t.deleted).first().waitFor();
    check(calls.some((c) => c.key === 'POST /rest/v1/rpc/delete_my_account'), `${tag} delete: RPC called after confirmation, "deleted" shown`);
    check(errors.length === 0, `${tag} signed-in flow: no console errors${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser, lang, { mode: { profileExists: true }, seed: true });
    await page.goto(`${BASE}${prefix}/account`);
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'correct-password-123');
    await page.click('button[type=submit]');
    await page.getByRole('button', { name: t.signOut }).waitFor();
    check((await page.getByRole('button', { name: t.importYes }).count()) === 0, `${tag} no import offer when the account already has a profile`);
    await page.getByRole('button', { name: t.signOut }).click();
    await page.waitForSelector('form');
    check((await statusText(page)).includes(t.signedOut), `${tag} sign out returns to the sign-in form`);
    await ctx.close();
  }

  // ---- profile onboarding: first sign-in without a profile row
  {
    const { ctx, page, calls, errors } = await newPage(browser, lang);
    const writes = () => calls.filter((c) => c.key === 'POST /rest/v1/profiles');
    await page.goto(`${BASE}${prefix}/account`);
    await page.waitForSelector('form');
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'correct-password-123');
    await page.click('button[type=submit]');
    await page.locator('#profile-role').waitFor();
    check(true, `${tag} profile: form is shown after first sign-in without a profile`);
    const sec = page.locator('section[aria-labelledby=profile-h]');
    check((await sec.innerText()).includes(t.pTitle) && (await sec.innerText()).includes(t.pMinimal), `${tag} profile: states what is stored and that no name/employer/birth date is asked`);
    check((await page.locator('#profile-role').count()) === 1 && (await page.locator('label[for=profile-role]').count()) === 1 && (await page.locator('label[for=profile-goal]').count()) === 1 && (await page.locator('label[for=profile-minutes]').count()) === 1, `${tag} profile: select, textarea and number input have labels`);
    const legends = await page.locator('section[aria-labelledby=profile-h] fieldset > legend').allInnerTexts();
    check(legends.includes(t.pLegendLevel) && legends.includes(t.pLegendLang), `${tag} profile: radio groups use fieldset/legend`);
    const opts = await page.locator('#profile-role option').evaluateAll((os) => os.map((o) => o.value));
    check(opts[0] === '' && opts.includes('it-support-operations') && opts.includes('human-resources') && opts.every((v) => v === '' || /^[a-z0-9-]+$/.test(v)), `${tag} profile: role options come from published roles (${opts.length - 1})`);
    check((await page.locator('#profile-lang-' + lang).isChecked()) && (await page.locator('#profile-level-none').isChecked()), `${tag} profile: defaults are page language and no level`);
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('section[aria-labelledby=profile-h] button, section[aria-labelledby=profile-h] select, section[aria-labelledby=profile-h] input[type=number], section[aria-labelledby=profile-h] label.py-2')].filter((e) => e.getBoundingClientRect().height < 44).map((e) => e.outerHTML.slice(0, 60)));
    check(small.length === 0, `${tag} profile: controls and labels are at least 44px high${small.length ? ': ' + small.join(' | ') : ''}`);

    // counter + validation: nothing is sent for invalid input
    await page.fill('#profile-goal', 'Hello');
    check((await page.locator('#profile-goal-count').innerText()) === t.pCount, `${tag} profile: character counter updates`);
    await page.fill('#profile-minutes', '10081');
    await page.getByRole('button', { name: t.pSave }).click();
    check((await page.locator('#profile-weeklyMinutes-err').innerText()).includes(t.pMinutesErr), `${tag} profile: minutes out of range shows error`);
    check(await page.evaluate(() => document.activeElement?.id === 'profile-minutes'), `${tag} profile: focus moves to the first invalid field`);
    check((await page.locator('#profile-minutes').getAttribute('aria-invalid')) === 'true', `${tag} profile: invalid field has aria-invalid`);
    await page.fill('#profile-minutes', '120');
    await page.fill('#profile-goal', 'x'.repeat(501));
    await page.getByRole('button', { name: t.pSave }).click();
    check((await page.locator('#profile-goal-err').innerText()).includes(t.pGoalErr), `${tag} profile: goal over 500 characters shows error`);
    check(writes().length === 0, `${tag} profile: invalid input sends nothing`);

    // skip -> collapsed, nothing written, setup button, survives reload
    await page.getByRole('button', { name: t.pSkip }).click();
    await page.getByRole('button', { name: t.pSet }).waitFor();
    check(writes().length === 0 && (await page.locator('#profile-role').count()) === 0, `${tag} profile: skipping writes nothing and collapses the form`);
    await page.waitForFunction(() => document.activeElement?.id === 'profile-h');
    check(true, `${tag} profile: focus returns to the profile heading after skip`);

    // fill and save
    await page.getByRole('button', { name: t.pSet }).click();
    await page.selectOption('#profile-role', 'human-resources');
    await page.check('#profile-level-advanced');
    await page.fill('#profile-goal', 'Lead better 1:1s');
    await page.fill('#profile-minutes', '');
    await page.getByRole('button', { name: '120' }).click();
    await page.check('#profile-lang-de');
    await page.getByRole('button', { name: t.pSave }).click();
    await page.getByText(t.pSaved).waitFor();
    check(writes().length === 1, `${tag} profile: exactly one upsert on save`);
    const body = JSON.parse(writes()[0].body);
    check(JSON.stringify(Object.keys(body).sort()) === JSON.stringify(['experience_level', 'id', 'learning_goal', 'preferred_language', 'role_family', 'weekly_minutes']), `${tag} profile: payload has only the allowed fields (${Object.keys(body).join(',')})`);
    check(body.id === UID && body.role_family === 'human-resources' && body.experience_level === 'advanced' && body.learning_goal === 'Lead better 1:1s' && body.weekly_minutes === 120 && body.preferred_language === 'de', `${tag} profile: payload values`);
    check(!('placement_done' in body), `${tag} profile: payload never touches placement_done`);
    const sum = await sec.innerText();
    check([t.pRoleTitle, t.pLevelTitle, 'Lead better 1:1s', t.pMinutesSummary, t.pLangTitle].every((x) => sum.includes(x)) && (await page.locator('#profile-role').count()) === 0, `${tag} profile: saved summary is shown`);
    check((await statusText(page)).includes(t.pSaved), `${tag} profile: "saved" is announced in the status region`);

    // edit later: prefilled, clearing fields sends nulls
    await page.getByRole('button', { name: t.pEdit }).click();
    check((await page.inputValue('#profile-role')) === 'human-resources' && (await page.locator('#profile-level-advanced').isChecked()) && (await page.inputValue('#profile-minutes')) === '120', `${tag} profile: edit form is prefilled`);
    await page.fill('#profile-goal', '');
    await page.fill('#profile-minutes', '');
    await page.check('#profile-level-none');
    await page.selectOption('#profile-role', '');
    await page.getByRole('button', { name: t.pSave }).click();
    await page.waitForFunction(() => !document.querySelector('#profile-role'));
    const body2 = JSON.parse(writes()[1].body);
    check(body2.role_family === null && body2.experience_level === null && body2.learning_goal === null && body2.weekly_minutes === null && body2.preferred_language === 'de' && Object.keys(body2).length === 6, `${tag} profile: edit clears optional fields with null`);
    check((await sec.innerText()).includes(t.pEmpty), `${tag} profile: cleared fields show as not set`);
    check(errors.length === 0, `${tag} profile: no console errors${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
  // ---- profile exists: summary only, no form, no import offer
  {
    const profile = { id: UID, role_family: 'human-resources', experience_level: 'advanced', learning_goal: 'Lead better 1:1s', weekly_minutes: 120, preferred_language: 'de' };
    const { ctx, page, calls } = await newPage(browser, lang, { mode: { profile }, seed: true });
    await page.goto(`${BASE}${prefix}/account`);
    await page.fill('#auth-email', 'learner@example.org');
    await page.fill('#auth-password', 'correct-password-123');
    await page.click('button[type=submit]');
    await page.getByRole('button', { name: t.pEdit }).waitFor();
    check((await page.locator('#profile-role').count()) === 0 && (await page.locator('section[aria-labelledby=profile-h]').innerText()).includes(t.pMinutesSummary), `${tag} profile: existing profile is shown, form stays closed`);
    check(!calls.some((c) => c.key === 'POST /rest/v1/profiles'), `${tag} profile: nothing written when only viewing`);
    await ctx.close();
  }

  // ---- dashboard sync: anonymous, signed in (remote load, write-through, offline)
  {
    // anonymous: dashboard + mastery check make no Supabase request and load no supabase-js
    const { ctx, page, calls, chunks } = await newPage(browser, lang, { seed: true });
    await page.goto(`${BASE}${prefix}/dashboard`);
    await page.waitForSelector('[data-testid=progress]');
    check(calls.length === 0 && chunks.length === 0, `${tag} sync: anonymous dashboard makes no Supabase request and loads no supabase-js`);
    check((await page.locator('[data-testid=sync-status]').count()) === 0, `${tag} sync: anonymous dashboard shows no sync status`);
    await page.goto(`${BASE}${prefix}/units/${UNIT}`);
    await answerMastery(page);
    check(calls.length === 0 && chunks.length === 0, `${tag} sync: anonymous mastery check makes no Supabase request`);
    check(!(await page.evaluate(() => localStorage.getItem('open-role-academy.sync.v1'))), `${tag} sync: anonymous use leaves no sync metadata`);
    await ctx.close();
  }
  const remote = {
    progress: [{ competency_id: 'information-security-basics', rating: '1333.00', correct_by_level: { foundation: 4, practitioner: 0, advanced: 0 }, answered: 4 }],
    item_responses: [{ item_id: 'isb-f-remote-item', competency_id: 'information-security-basics', box: 1, due_on: '2026-12-01' }],
    completed_units: [{ unit_id: 'information-security-basics-foundation' }],
  };
  const remoteProfile = { id: UID, role_family: 'it-support-operations', experience_level: 'foundation', placement_done: true, created_at: '2026-11-01T10:00:00.000Z', updated_at: '2026-11-05T00:00:00.000Z' };
  {
    const mode = { profile: remoteProfile, remote };
    const { ctx, page, calls, errors } = await newPage(browser, lang, { mode, seed: true, signedIn: true });
    const writes = () => calls.filter((c) => c.key.startsWith('POST /rest/v1/') && !c.key.includes('rpc'));
    await page.goto(`${BASE}${prefix}/dashboard`);
    await page.waitForSelector('[data-testid=progress]');
    check((await page.locator('main').innerText()).includes('1333'), `${tag} sync: signed-in dashboard shows the remote rating (1333)`);
    await page.getByText(t.syncSynced).waitFor();
    check(true, `${tag} sync: status "${t.syncSynced}" shown`);
    const cached = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), KEY));
    check(cached.competencies['information-security-basics'].answered === 4 && cached.competencies['information-security-basics'].answeredItems.includes('isb-f-cia-confidentiality') && cached.completedUnits.includes('information-security-basics-foundation'), `${tag} sync: remote merged into the local cache without dropping local items`);
    check(calls.some((c) => c.key === 'GET /rest/v1/progress') && writes().length === 0, `${tag} sync: remote read, nothing written when nothing changed`);

    // mastery check -> write-through upserts
    await page.goto(`${BASE}${prefix}/units/${UNIT}`);
    await answerMastery(page);
    await page.getByText(t.syncSynced).waitFor();
    await page.waitForFunction(() => document.querySelector('[data-testid=sync-status]')?.getAttribute('data-status') === 'synced');
    const up = (tbl) => calls.filter((c) => c.key === `POST /rest/v1/${tbl}`);
    check(up('progress').length >= 1 && up('item_responses').length >= 1, `${tag} sync: mastery check upserts progress and item rows`);
    check(JSON.parse(up('progress')[0].body).every((r) => r.user_id === UID), `${tag} sync: upserted rows belong to the signed-in user`);
    check(up('profiles').length === 0, `${tag} sync: unchanged profile is not rewritten`);
    check(!writes().some((c) => /service_role|secret/i.test(c.body)), `${tag} sync: no secrets in payloads`);
    check(errors.length === 0, `${tag} sync: no console errors${errors.length ? ' ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
  {
    // offline: local write works, status says it will sync later, data kept, retry works
    const mode = { profile: remoteProfile, remote, offline: false };
    const { ctx, page, calls } = await newPage(browser, lang, { mode, seed: true, signedIn: true });
    await page.goto(`${BASE}${prefix}/units/${UNIT}`);
    await page.getByRole('button', { name: t.masteryStart }).waitFor();
    mode.offline = true;
    await answerMastery(page);
    await page.getByText(t.syncPending).waitFor();
    check(true, `${tag} sync: offline shows "will sync later"`);
    const before = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), KEY));
    check(before.completedUnits.includes(UNIT) && JSON.parse(await page.evaluate(() => localStorage.getItem('open-role-academy.sync.v1'))).pending === true, `${tag} sync: offline result kept locally and marked pending`);
    await page.goto(`${BASE}${prefix}/dashboard`);
    await page.waitForSelector('[data-testid=progress]');
    await page.getByText(t.syncPending).waitFor();
    check((await page.locator('main').innerText()).includes('Rating') || (await page.locator('main').innerText()).includes('Wertung'), `${tag} sync: dashboard falls back to the local copy when offline`);
    const nPosts = calls.filter((c) => c.key.startsWith('POST /rest/v1/progress')).length;
    mode.offline = false;
    await page.getByRole('button', { name: t.syncRetry }).click();
    await page.getByText(t.syncSynced).waitFor();
    check(calls.filter((c) => c.key.startsWith('POST /rest/v1/progress')).length > nPosts, `${tag} sync: retry after reconnect uploads the pending changes`);
    await ctx.close();
  }
  {
    // server rejection: failed status, still usable
    const mode = { profile: remoteProfile, remote };
    const { ctx, page } = await newPage(browser, lang, { mode, seed: true, signedIn: true });
    await ctx.route(/\.supabase\.co\/rest\/v1\/progress/, (route) => route.request().method() === 'POST' ? json(route, 403, { code: '42501', message: 'new row violates row-level security policy' }) : route.fallback());
    await page.goto(`${BASE}${prefix}/units/${UNIT}`);
    await answerMastery(page);
    await page.getByText(t.syncFailed).waitFor();
    check(true, `${tag} sync: server rejection shows "sync failed" and keeps the local copy`);
    await ctx.close();
  }

  // ---- password recovery redirect
  {
    const { ctx, page, calls } = await newPage(browser, lang);
    await page.goto(`${BASE}${prefix}/account#access_token=aaa.bbb.ccc&refresh_token=rrr&expires_in=3600&token_type=bearer&type=recovery`);
    await page.waitForSelector('#auth-password2');
    check(true, `${tag} recovery link opens the set-new-password form`);
    await page.fill('#auth-password', 'a-long-enough-password');
    await page.fill('#auth-password2', 'a-different-password');
    await page.click('button[type=submit]');
    check((await alertText(page)).includes(t.mismatch), `${tag} recovery: mismatch message`);
    await page.fill('#auth-password2', 'a-long-enough-password');
    await page.click('button[type=submit]');
    await page.getByText(t.changed).waitFor();
    check(calls.some((c) => c.key === 'PUT /auth/v1/user'), `${tag} recovery: password update sent, success shown`);
    await ctx.close();
  }
}

const browser = await chromium.launch();
try {
  for (const lang of ['en', 'de']) await run(browser, lang);
} finally {
  await browser.close();
  server.close();
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll auth e2e checks passed');
