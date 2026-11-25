# Decisions

Format: date — decision — reason — alternatives considered.

## 2026-11-21 — Answer-length cue checked per language; German cue pass before more Phase 4 content (weekly review)
- **Decision:** The `uniquely longest` warning in `validate:content` runs separately for en and de. ROADMAP gets a "German answer-length cue and resource gaps" task (4 batches + 1 resource sub-task) in the quality-pass section, ahead of the remaining Data & Analytics content. Browser e2e in CI is added as a Phase 3 task.
- **Reason:** The en-only check was cleared by padding English distractors; in German 24 competencies are still cued (> 50%). German is a first-class language (CLAUDE.md §1). e2e passes locally but is not run in CI.
- **Alternatives:** Making the check an error (would block every PR until 24 files are rewritten); measuring only the language the learner sees most (no data, and no analytics allowed); leaving the batches to a later maintenance run (the cue would spread to 4 more roles).

## 2026-11-17 — Profile form: scope and placement
- **Decision:** The profile form lives inside the account island; role options are passed from content at build time; skipping is remembered in localStorage per user id; the upsert payload is a fixed column whitelist (`PROFILE_COLUMNS`) without `placement_done`. Preferred language always has a value (column is NOT NULL, default = page language); all other fields may stay empty (null).
- **Reason:** Data minimisation and no new route or dependency; a partial upsert leaves `placement_done` and `created_at` untouched.
- **Alternatives:** Separate onboarding page (more code, extra route); storing the skip flag in the database (collects more data for no benefit). Limitation accepted: saving a profile first makes the one-time local-progress import offer unavailable.

## 2026-11-14 — Answer-length cue is a validator warning, and a quality pass comes before the rest of Phase 3 (weekly review)
- **Decision:** `validate:content` warns when more than 50% of a competency's single-choice items have the correct option as the uniquely longest (en). ROADMAP gets a per-role "Content quality pass" ahead of the remaining Phase 3 tasks.
- **Reason:** 87% of single-choice items are cued by length, so placement and mastery overrate learners. Fixing it before the learner UI and before Phase 4 keeps the pattern from spreading to 10 more roles.
- **Alternatives:** Make it an error. Rejected: that would turn CI red on `main` at once and block all work. Promote it to an error once the quality pass is done. A second alternative was to leave it to maintenance. Rejected: the problem affects the core adaptive function.

## 2026-11-12 — Accounts via Supabase Auth + Brevo SMTP, no own domain (owner decision)
- **Decision:** Email/password sign-up with confirmation, password reset and email-link sign-in, sent through Brevo's free SMTP from a verified freemail sender.
- **Reason:** No free domain was acceptable to the owner; Supabase's built-in mailer only reaches project team members; Brevo's free tier needs no domain and no credit card.
- **Trade-offs:** Some mail lands in spam (freemail sender via a third-party relay, no DKIM/DMARC alignment); Brevo branding in mails. Switch to a domain later by changing only the SMTP settings.

## 2026-11-12 — Weekly reviewer on Opus (owner decision)
- **Decision:** The weekly review run uses Opus (medium effort) and reviews itself; Haiku only for mechanical subtasks. The builder stays on Sonnet.
- **Reason:** Judgement is the reviewer's whole job; it runs once a week on budget that would otherwise reset unused; a different model than the builder catches more of its mistakes.
- **Alternatives:** Sonnet reviewer (cheaper, but shares the builder's blind spots).

## 2026-11-12 — Evening/night-only work windows, weekly QA run, accounts planned (owner decisions)
- **Decision:** No agent work 08:00–20:00 on any day (CLAUDE.md §11). A separate weekly QA run audits merged work and files `qa` issues (§13). Accounts (Supabase Auth + Postgres, EU) and a catalog move into Phase 3b, ahead of scaling to more roles.
- **Reason:** The owner needs his usage during the day. A fresh-context reviewer catches errors the builder repeats. Accounts and a catalog are what turn the site into a usable learning platform; more roles are worth less without them.
- **Alternatives:** A manager agent approving every PR (doubles usage and blocks automerge); accounts built on Cloudflare D1 with self-written auth (more security risk, still needs an email sender).

## 2026-11-12 — Time-boxed work windows instead of a usage-percentage rule (owner decision)
- **Decision:** Runs work continuously inside fixed windows (CLAUDE.md §11): weekdays 20:00–23:45 only, weekends longer, Sunday stop before the 18:00 weekly reset. Model choice per task via subagents (§12).
- **Reason:** The owner needs most of the weekly Pro usage for his own weekday work. The agent cannot read the plan's usage meter, so a rule like "use at most 14–20 % per weekday" cannot be enforced from inside a run; time windows are the enforceable proxy.
- **Alternatives:** One slice per run (too slow: about one competency per night); unbounded runs (would eat the owner's weekday budget).

## 2026-11-12 — DigComp 3.0 replaces DigComp 2.2
- **Decision:** All `frameworkRefs` use DigComp 3.0 names and the JRC framework page as URI.
- **Reason:** The JRC published DigComp 3.0 in November 2025; 2.2 names are outdated.

## 2026-11-11 — Astro 7 with `src/content.config.ts`; schemas in `src/content/schemas.ts`
- **Decision:** Use the current Astro (7.x) content layer. Collections are defined in `src/content.config.ts` (glob loaders); the Zod schemas live in `src/content/schemas.ts` instead of `src/content/config.ts` as CLAUDE.md §5 names it.
- **Reason:** Astro 5+ treats `src/content/config.ts` as the deprecated legacy config location. A plain schema module can be shared by Astro and the Node validator script.
- **Alternatives:** Pin an older Astro version (outdated, security fixes missing); duplicate schemas (drift risk).

## 2026-11-11 — Tailwind CSS 4 via `@tailwindcss/vite`
- **Decision:** Tailwind 4 through its Vite plugin, no `@astrojs/tailwind` integration.
- **Reason:** The Astro integration is deprecated for Tailwind 4; the Vite plugin is the documented path.

## 2026-11-11 — Zod as a direct dependency
- **Decision:** Add `zod` (same major version Astro bundles) as a direct dependency.
- **Reason:** The schemas and the engine's import validation must also run outside Astro (validator CLI, Vitest). No extra weight, since Astro already ships it.

## 2026-11-11 — `core-track` role for the demo slice
- **Decision:** Roles get a `kind` field: `role` (role family, 8–12 role-specific competencies enforced) or `core` (shared core track only). The demo slice is offered as the role `core-track` ("Core skills for every role").
- **Reason:** Phase 0 needs an end-to-end flow before any role family exists, and a role with one competency would violate the 8–12 rule. The core track is also useful on its own.
- **Alternatives:** Relax the 8–12 rule (weakens a check); hard-code a demo outside the content model.

## 2026-11-11 — Role level = self-rated level
- **Decision:** The targets that apply to a learner are those of the role level equal to their self-rating.
- **Reason:** Simple and predictable; the learner can restart onboarding with another level. Recorded in docs/ENGINE.md.

## 2026-11-11 — Coverage rule interpretation
- **Decision:** "≥1 unit per required level" means every level from foundation up to the highest target of the competency in any role (the path walks through lower levels). "≥6 items spread across difficulties" means ≥ 6 items in total and ≥ 2 items for every required level; item difficulty must lie in its level's authoring range (centre ± 100).
- **Reason:** Makes the rule checkable and guarantees that placement and mastery checks have items at every level.

## 2026-11-11 — Units: word count, attribution and source model
- **Decision:** Units have a `title` field (needed for display) and `sources[]` objects with `usage: cited|adapted|embedded`. The validator requires full TASL attribution (title, author, url, license, licenseUrl, plus `changes` when adapted) for adapted/embedded sources, only open licenses for them, and a matching `embedded` source for every resource with `mode: embed`. Body length 300–800 words is enforced.

## 2026-11-11 — Licence-age check is a warning
- **Decision:** `licenseVerifiedOn` older than 180 days produces a validator **warning** (not an error); a date in the future is an error.
- **Reason:** CLAUDE.md asks for re-verification during maintenance runs; failing all CI on a calendar date would block unrelated work.

## 2026-11-11 — Answer option order
- **Decision:** Options are displayed in a deterministic shuffled order seeded by the item id.
- **Reason:** The end-to-end test showed that authored items had the correct option first; deterministic shuffling keeps the engine reproducible.

## 2026-11-11 — Link-check treats 401/403/429 as "needs manual check"
- **Decision:** The weekly link check reports these responses separately and does not open an issue for them alone.
- **Reason:** Some providers (e.g. OpenLearn) block automated clients with 403 while the page works in a browser.

## 2026-11-11 — Automerge via GitHub Actions + `gh`
- **Decision:** `automerge.yml` runs on `workflow_run` (CI completed) and on `pull_request: labeled`. It squash-merges only if the PR carries `automerge` and the latest CI run for the head SHA succeeded, then deletes the branch.
- **Reason:** No third-party action or token needed (`GITHUB_TOKEN`). Note: merges made with `GITHUB_TOKEN` do not trigger new workflow runs on `main`; Cloudflare Pages deploys via its Git integration and is unaffected.

## 2026-11-11 — Working branch name
- **Decision:** This session works on the branch assigned by the execution environment (`claude/admiring-mayer-dn6uyq`), which matches the `claude/*` convention; after each merge the same branch is restarted from the updated `main`.
- **Reason:** The environment only permits pushing to that branch.

## 2026-11-11 — Legal pages use § 5 DDG
- **Decision:** The imprint template refers to § 5 DDG (Digitale-Dienste-Gesetz), which replaced § 5 TMG in 2024. All owner data are placeholders `{{OWNER_NAME}}`, `{{OWNER_ADDRESS}}`, `{{CONTACT_EMAIL}}`. The templates should be checked by the owner before launch.

## 2026-11-11 — Core track competency ids and prerequisites
- **Decision:** The six core competencies are `digital-ai-literacy`, `communication-collaboration`, `information-security-basics`, `working-with-data`, `self-organisation-project-basics`, `business-finance-fundamentals`. Prerequisites: `working-with-data` and `information-security-basics` require `digital-ai-literacy`; the others have none.
- **Reason:** Mirrors the core track in CLAUDE.md §4.2; digital basics come first. Prerequisites outside a learner's open gaps are ignored by the engine, so this does not block anyone already proficient.
- **Framework refs:** ESCO skill URIs were looked up with the public ESCO API (ec.europa.eu/esco/api) on 2026-11-11. DigComp has no per-competence URIs; the reference points to the JRC DigComp page and names the competence area/numbers in `label`.
- **Not yet in a role:** The new competencies are not added to the `core-track` role until their units and items exist (Phase 2), because the validator requires full coverage for every competency a role references.

## 2026-11-11 — Missing framework references are a warning
- **Decision:** The validator warns (does not fail) when a competency has no `frameworkRefs`, because CLAUDE.md §4.4 says "where possible".

## 2026-11-11 — Draft roles (`status: draft|published`)
- **Decision:** Roles have `status: draft|published` (default `published`). Draft roles are hidden in the UI and the validator skips the content-coverage rules for them; schema, references, the 8–12 rule and target checks still apply.
- **Reason:** Phase 1 defines role frameworks before Phase 2 writes their content. Without a draft state the coverage rule would fail CI for every framework-only role.
- **Alternatives:** Keep frameworks outside `src/content` (no validation); relax coverage globally (weakens a check).

## 2026-11-11 — Target sanity checks
- **Decision:** The validator rejects role competencies with no target at any role level, and targets that decrease from the foundation to the advanced role level.

## 2026-11-11 — IT Support & Operations framework
- **Decision:** 10 role-specific competencies: incident-request-handling, troubleshooting-methods, user-support-communication, endpoint-management (priority 1); it-service-management, identity-access-management, networking-fundamentals, backup-recovery (priority 2); change-asset-management, scripting-automation (priority 3, not required at foundation role level). All six core competencies are included; information security is raised (practitioner at foundation role level), business & finance is not required at foundation role level.
- **Reason:** Covers the typical service-desk-to-operations scope; ITIL is referenced only as a common practice framework (no proprietary text). ESCO skill URIs looked up via the ESCO API on 2026-11-11.

## 2026-11-11 — Finance & Accounting framework
- **Decision:** 11 role-specific competencies: bookkeeping-fundamentals, accounts-payable, accounts-receivable, reconciliation-closing (priority 1); financial-statements-reporting, tax-basics, cash-liquidity-management, budgeting-forecasting, internal-controls-audit (priority 2); cost-accounting, financial-analysis-kpis (priority 3). Budgeting, internal controls and financial analysis are not required at foundation role level. Core: business & finance fundamentals and working with data are priority 1.
- **Reason:** Covers the typical accounting cycle from transaction to reporting. Law/tax-related competencies are explicitly labelled "Germany/EU" (CLAUDE.md §8); `tax-basics` keeps the label in its title. ESCO refs looked up via the ESCO API on 2026-11-11.

## 2026-11-11 — Human Resources framework
- **Decision:** 11 role-specific competencies: employment-law-basics, recruitment-selection, personnel-administration, hr-data-protection (priority 1); onboarding-offboarding, payroll-compensation, performance-feedback, learning-development, employee-relations-conflict (priority 2); health-safety-wellbeing, diversity-inclusion (priority 3). Law-related competencies carry "Germany/EU" or "Germany" in their titles. Core: communication & collaboration is priority 1.
- **Reason:** Covers the employee lifecycle plus the legal and data-protection basics HR needs in the EU/Germany context (CLAUDE.md §8). ESCO refs looked up via the ESCO API on 2026-11-11.

## 2026-11-11 — `docs/FRAMEWORK.md` is generated and checked in CI
- **Decision:** `npm run docs:framework` renders the file from the YAML; a Vitest test fails when the committed file is out of date.
- **Reason:** Keeps the overview trustworthy without a separate CI step.

## 2026-11-11 — Phase 2 split into per-competency sub-tasks
- **Decision:** "Core track content complete" is split into one roadmap sub-task per competency; each competency's content (units en/de, ≥ 12 items, 2–4+ resources) is one PR, and the competency is added to the published `core-track` role in the same PR.
- **Reason:** One competency is a finished, testable slice that fits into a session (CLAUDE.md §10.8).

## 2026-11-11 — DigComp 3.0
- **Decision:** Keep the existing DigComp 2.2 labels in `frameworkRefs` for now; content cites the current JRC DigComp page (DigComp 3.0: 5 areas, 21 competences). Updating the labels to the 3.0 structure is logged as a maintenance item in docs/BLOCKERS.md.
- **Elements of AI** could not be reached from the build environment, so it was not added as a resource (license not verifiable).

## 2026-11-11 — Strict item schemas; options in YAML block style
- **Decision:** `itemSchema` and `optionSchema` are strict (unknown keys are errors). All answer options were converted from one-line flow mappings to block style with quoted strings.
- **Reason:** An unquoted comma inside a YAML flow mapping (`{ en: text, more text, de: … }`) silently truncated option texts, because Zod dropped the resulting extra keys. 22 options in the merged core-track items were affected and showed shortened text on the site. Strict schemas make this class of error fail validation.

## 2026-11-11 — Placement question budget
- **Decision:** The placement check is limited to 15 questions in total. Competencies are placed in priority order; with more than 5 targeted competencies, the lowest-priority ones are not placed and keep their prior (self-rating) until their mastery checks.
- **Reason:** CLAUDE.md §7.1 requires 3–5 items per competency **and** ≤ 15 minutes in total. With the full core track (6 competencies) or a role (up to 18 competencies) both cannot hold at once; the time limit protects learners, and priorities decide what is measured first.
- **Alternatives:** 1–2 items per competency (too unreliable for an Elo estimate); a multi-session placement (more complex UI) — possible later.

## 2026-11-11 — `troubleshooting-methods`: German resources and canonical Wikipedia URLs
- **Decision:** German Wikipedia has no general article on IT troubleshooting ("Fehlersuche" does not exist; "Fehleranalyse" is a generic article about the notion of an error). The German units therefore link to the German articles *Logdatei*, *OSI-Modell*, *5-Why-Methode* and *Ursache-Wirkungs-Diagramm* and additionally to the English *Troubleshooting* article. Resource URLs use the canonical article title (*Ursache-Wirkungs-Diagramm*), not the redirect *Ishikawa-Diagramm*.
- **Reason:** Link only to pages that match the unit's topic; canonical URLs avoid redirect noise in the link check.
- **Alternatives:** Link the generic *Fehleranalyse* article (off-topic); omit German resources for the foundation level (worse for German learners).


## 2026-11-17 — Language selection via header switcher
- Decision: onboarding form has no language control; language comes from the route (`/` vs `/de/`) via the header switcher.
- Reason: Astro i18n routing makes the URL the single source of truth; a second control would conflict.
- Alternatives: language radio in the form that redirects (redundant).


## 2026-11-17 — Learning path lives on the dashboard
- Decision: no separate path page; the ordered path and next unit are shown on the dashboard.
- Reason: avoids duplicate views of the same engine output; meets the roadmap acceptance.
- Alternatives: dedicated /path page (can be added if the dashboard gets crowded).


## 2026-11-17 — Catalog search with Pagefind
- Decision: add `pagefind` (exact version 1.6.0, devDependency) and run `pagefind --site dist` after `astro build`. Only unit pages of published roles carry `data-pagefind-body`; the mastery check is `data-pagefind-ignore`. The search island imports `/pagefind/pagefind.js` (same origin) and uses its own accessible markup. Filters (role, level) are a Preact island over server-rendered data; language is implicit from the route.
- Reason: static, open source (MIT), no backend, no cookies, no third-party requests, per-language indexes from `<html lang>`; roadmap requires it. Only a build-time tool, nothing heavy at runtime.
- Alternatives: Lunr/MiniSearch with a hand-built index (more code, no language handling); hosted search (violates $0 / no third-party constraints).


## 2026-11-17 — Supabase schema design (migration 20261117210000)
- Decision: tables `profiles`, `progress`, `item_responses`, `completed_units` in `public`. `progress` stores rating, `correct_by_level` (jsonb with the three level keys) and `answered`; `answeredItems` is derived from `item_responses`. `item_responses` holds one row per (user, item): latest answer plus Leitner `box`/`due_on` (mirrors the engine's `ReviewCard`), instead of an append-only log. `completed_units` and `profiles.placement_done` are added because the engine's `LearnerState` needs them to round-trip. Role id and self level of the engine state map to `profiles.role_family` / `experience_level`.
- Reason: smallest model that reproduces the export/import state exactly; data minimisation (no history log, no employer, name or birth date); no calibration data needed in Phase 1.
- Alternatives: append-only response log (more personal data, more storage, not needed by the engine); one jsonb blob per user (no constraints, harder RLS-level validation).

## 2026-11-17 — RLS, grants and GDPR functions
- Decision: RLS on all tables with per-operation policies `to authenticated` using `(select auth.uid())`; explicit grants to `authenticated` only, `anon`/`public` revoked. `export_my_data()` is security invoker (RLS applies); `delete_my_account()` is security definer with `search_path = ''`, deletes only the caller's `auth.users` row and relies on `on delete cascade`. Migrations are applied by the owner; the repo contains no keys. A static Vitest test enforces these rules for every migration.
- Reason: least privilege, new tables are not auto-exposed to the Data API, GDPR Art. 15/17/20 without a backend or service-role key.
- Alternatives: Edge Function for deletion (needs service-role key and deployment); views for export (no gain over a function).


## 2026-11-17 — Auth UI: supabase-js, build-time flag, route injection
- Decision: add `@supabase/supabase-js` (exact 2.119.0). It is imported dynamically only in `src/lib/supabase-client.ts`, which only the account island uses; the island loads it only when a stored session or email-link redirect exists or a form is submitted. `accountsEnabled` = `PUBLIC_ACCOUNTS_ENABLED === 'true'` at build time (default off, no runtime/query-param override). Account routes are injected by an integration in `astro.config.mjs` only when the flag is on, so the default build has no account pages and no supabase-js chunk (a normal `src/pages` route emitted orphan chunks even with empty `getStaticPaths`).
- Decision: session in localStorage (supabase-js default, implicit flow, no cookies); password minimum 10 characters (max 72 bytes); "neutral" sent-screens for sign-up/magic link/reset so account existence is not revealed; magic link uses `shouldCreateUser: false`; sign-up needs an explicit privacy checkbox; delete requires typing DELETE/LÖSCHEN.
- Decision: `item_responses.correct` cannot be reconstructed from engine state; the mapping sets it to "a review card exists" (best effort, not read by the engine).
- Reason: official client handles token refresh and email-link parsing; avoids hand-rolled auth. Alternatives: raw fetch against GoTrue (more code and risk), PKCE flow (breaks when the email link opens in another browser).

## 2026-11-17 — Dashboard sync: storage abstraction and merge policy
- Decision: all islands load/save progress through `useProgress` (`src/lib/use-progress.ts`) -> `progress-store.ts`. Without a stored session (or with accounts off at build time) it is plain localStorage as before: no network, no sync metadata. With a stored session, localStorage stays the cache and changes are written through (debounced 800 ms, upserts of only changed rows, never deletes remotely). Remote code (`progress-sync.ts`, supabase-js) is only reachable via a dynamic import behind the build-time constant `__ACCOUNTS_ENABLED__` (vite `define`), so the default build contains none of it.
- Decision (merge on load, `progress-merge.ts`): union of everything, nothing silently deleted. Per competency the side with more `answered` wins (it only grows; tie: newer side), answered item ids are unioned; review cards: later due date wins; completed units: union; identity (role, self level) and `placementDone`: the newer side wins (local change time kept in `open-role-academy.sync.v1` vs remote profile `updated_at`; unknown local time loses against an existing remote profile; same role: `placementDone` OR-ed). A cached copy that belongs to another account (shared browser) is not merged into the signed-in account. Local-only progress is uploaded on the next change (the account page keeps its explicit "import" offer), not automatically on load.
- Decision: the profile upsert from sync only carries role_family, experience_level, placement_done (plus preferred_language only when the row is created); learning goal, weekly minutes and language stay owned by the profile form.
- Decision: statuses synced / syncing / pending (offline or 5xx: "will sync later", retried on `online` and by button) / failed (4xx, RLS); never blocking. "Delete my progress" on the dashboard removes only this browser's copy; account data is deleted on the account page.
- Reason: anonymous use must always work; no data loss across devices; per-row timestamps for progress cannot be trusted locally, answer counts are monotonic.
- Alternatives: last-write-wins on the whole state (loses data), a local per-competency change log (more storage and code), auto-upload of local data on sign-in (bypasses the consent step of the import offer).


## 2026-11-17 — Privacy policy for accounts: flag-gated separate text; imprint unchanged
- Decision: the account privacy text lives in its own component and replaces the current text only when `accountsEnabled` is true; the default text is untouched, so the live site stays accurate. Legal bases: Art. 6(1)(b) for account functions, 6(1)(f) for logs; the sign-up checkbox is only a notice confirmation, not consent. Transfers phrased cautiously ("may involve group companies or sub-processors outside the EU/EEA, safeguards per the providers' DPAs/SCCs"); owner verifies details (hint in `docs/LAUNCH.md`). Home page privacy line also switches with the flag.
- Imprint: no change. A German Impressum (§ 5 DDG) must state provider identity and contact; accounts add no new imprint duty. Alternatives: edit the one text in place (would make the live site claim processing that does not happen), a runtime toggle (not allowed: build-time flag only).

## 2026-11-17 — Sales framework: 10 competencies, draft status
- Decision: Sales role added as `status: draft` with 10 role competencies; CRM data hygiene and forecasting/metrics merged into `crm-sales-data-forecasting`. ESCO refs only for URIs verified via the ESCO API (matching label); none for sales-process beyond two verified ones, and no DigComp refs.
- Reason: draft keeps coverage unenforced and the role hidden until content exists; 10 stays within the 8-12 rule and the batch size of content sessions.
- Alternatives: 11 competencies with a separate forecasting one (larger content load), publishing early (would fail coverage validation).

## 2026-11-17 — Marketing framework: 10 competencies, draft status
- Decision: Marketing role added as `status: draft` with 10 role competencies (strategy, research, segmentation/positioning, brand, content/copywriting, digital channels/SEO/SEM, social media, email marketing, campaign planning/budgeting, analytics/attribution). Email marketing is labelled Germany/EU and covers GDPR/ePrivacy/UWG consent at topic level only. 19 ESCO refs, each checked against the ESCO API (HTTP 200, preferred label equals stored label); no DigComp refs. Prerequisites form a chain through existing ids, acyclic.
- Reason: same pattern as Sales; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: separate competencies for PR/events and pricing (exceeds 10, pricing already covered in Sales and business basics), publishing early (fails coverage validation).

## 2026-11-18 — Customer Service framework: 10 competencies, draft status
- Decision: Customer Service role added as `status: draft` with 10 role competencies (service fundamentals, communication/listening/empathy, needs and problem solving, complaint handling/de-escalation, omnichannel support, ticketing/knowledge base, service levels/quality, customer data privacy, retention/voice of the customer, consumer-rights basics). Active listening and empathy are merged into `customer-communication-empathy` and build on the core `communication-collaboration`; IT-specific `user-support-communication` and `incident-request-handling` are not duplicated. Privacy and consumer-rights competencies are labelled EU/Germany and stay at topic level (no statute citations). 19 ESCO refs, each checked against the ESCO API (HTTP 200, preferred label equals stored label); no DigComp refs. Prerequisites use existing ids and are acyclic.
- Reason: same pattern as Sales and Marketing; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: separate `active-listening-empathy` (overlaps core communication), a dedicated social-care competency (covered in omnichannel), publishing early (fails coverage validation).

## 2026-11-18 — Project Management framework: 10 competencies, draft status
- Decision: Project Management role added as `status: draft` with 10 role competencies (initiation/business case, scope and requirements, work breakdown and scheduling, budget and cost control, risk and issue management, stakeholder management and communication, resource and team coordination, agile and hybrid delivery, quality and change management, closure and lessons learned). Core `self-organisation-project-basics` is a prerequisite and stays at core track (priority 1 for this role); the role goes deeper without duplicating it. Descriptions are methodology-neutral and original; no text from proprietary frameworks (PMBOK, PRINCE2) is used. 16 ESCO refs, each checked against the ESCO API (HTTP 200, preferred label equals stored label); no DigComp refs. Prerequisites use existing ids and are acyclic.
- Reason: same pattern as Sales, Marketing and Customer Service; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: a separate procurement/contract competency (belongs to the Procurement role), a PMO/portfolio competency (out of scope for basic roles), publishing early (fails coverage validation).

## 2026-11-18 — Procurement & Supply Chain framework: 10 competencies, draft status
- Decision: Procurement & Supply Chain role added as `status: draft` with 10 role competencies (procurement fundamentals and purchase-to-pay, strategic sourcing and category management, supplier selection and evaluation, tendering/RFx and contracting, negotiation and supplier relationships, purchase order and invoice management, inventory and warehouse management, logistics and transport planning, supply chain planning and demand management, supply chain risk and sustainability) plus the 6 core-track competencies. Existing ids are reused as prerequisites (`business-finance-fundamentals`, `communication-collaboration`, `accounts-payable`, `working-with-data`); the Sales-specific negotiation competency is not reused because its prerequisite chain is sales-only. Public procurement (EU rules), Incoterms and supply-chain due diligence (EU/Germany) are covered at topic level only: no thresholds, figures or legal details. 18 ESCO refs, each checked against the ESCO API (HTTP 200, preferred label equals stored label); `strategic-sourcing-category-management` has no ref (no fitting ESCO skill found; validator warns only). No DigComp refs; no text from proprietary frameworks (APICS, CIPS). Prerequisites are acyclic.
- Reason: same pattern as Project Management; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: a separate public-procurement competency (too jurisdiction-specific for a basic role), merging logistics and inventory (too broad for one unit set), publishing early (fails coverage validation).

## 2026-11-20 — Data & Analytics framework: 10 competencies, draft status
- Decision: Data & Analytics role added as `status: draft` with 10 role competencies (analytics fundamentals, data sourcing and collection, data quality and cleaning, SQL and querying, statistics fundamentals, visualisation and dashboards, BI and reporting, problem framing and storytelling, data governance and privacy in analytics, machine learning basics and AI in analytics) plus the 6 core-track competencies. Existing ids reused as prerequisites (`working-with-data`, `digital-ai-literacy`, `information-security-basics`, `communication-collaboration`). Privacy/governance (EU/Germany) is topic level only: no articles, thresholds or legal details. ESCO refs were looked up via the ESCO search API (URI and preferred label as returned); no DigComp refs; no proprietary framework text. Prerequisites are acyclic.
- Reason: same pattern as Procurement and Project Management; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: separate data engineering competencies (out of scope for a basic role), publishing early (fails coverage validation).

## 2026-11-22 — e2e in CI installs Playwright per job
- Decision: `ci.yml` e2e job runs `npm install --no-save playwright@1.49.1` instead of adding it as a dependency.
- Reason: keeps the lockfile/deps lean (CLAUDE.md §3); the suite already requires it only at test time.
- Alternatives: devDependency (heavier install for every job); Playwright test runner (rewrite of existing scripts).

## 2026-11-23 — Software Development framework: 10 competencies, draft status
- Decision: Software Development role added as `status: draft` with 10 role competencies (programming fundamentals and problem solving, version control and collaboration, software design and architecture basics, testing and quality, debugging, APIs and integration, databases and data modelling basics, secure coding basics, CI/CD and DevOps basics, requirements/agile delivery/code review) plus the 6 core-track competencies. Existing ids reused as prerequisites (`digital-ai-literacy`, `sql-data-querying`, `information-security-basics`, `communication-collaboration`). ESCO refs were looked up via the ESCO search API (URI and preferred label as returned); no DigComp refs; no proprietary framework text. Prerequisites are acyclic. CI/CD and databases start at practitioner-level targets for foundation = none, like other niche competencies.
- Reason: same pattern as Data & Analytics and Procurement; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: language-specific competencies (too narrow for a basic role), publishing early (fails coverage validation).

## 2026-11-25 — Controlling framework: 11 role competencies (6 reused, 5 new), draft status
- Decision: Controlling role added as `status: draft` with 11 role competencies plus the 6 core-track competencies. Reused from Finance & Accounting / Data & Analytics: `cost-accounting`, `budgeting-forecasting`, `financial-analysis-kpis`, `business-intelligence-reporting`, `cash-liquidity-management`, `internal-controls-audit`. New: `variance-analysis-performance-management`, `investment-appraisal-capital-budgeting`, `profitability-pricing-analysis`, `controlling-processes-systems`, `business-partnering-decision-support`. ESCO refs were looked up via the ESCO search API (URI and preferred label as returned); no DigComp refs; no proprietary framework text. Prerequisites are acyclic and reference existing ids only. Investment appraisal, liquidity, business partnering and internal controls start at foundation target = none (practitioner-level topics), like other niche competencies.
- Reason: avoids duplicating shared finance competencies (units/items are reused across roles); draft keeps coverage unenforced and the role hidden until content exists, same as Software Development.
- Alternatives: separate controlling-specific variants of cost accounting/KPIs (duplicate content), a dedicated "management reporting" competency (overlaps business-intelligence-reporting and financial-analysis-kpis), publishing early (fails coverage validation).

## 2026-11-25 — Legal & Compliance framework: 12 role competencies (3 reused, 9 new), draft status
- Decision: Legal & Compliance role added as `status: draft` with 12 role competencies plus the 6 core-track competencies. Reused: `employment-law-basics`, `risk-issue-management`, `internal-controls-audit`. New: `legal-foundations-sources-of-law`, `contract-law-basics`, `gdpr-data-protection-compliance`, `compliance-management-governance` (governance and business ethics folded in), `anti-corruption-whistleblower-protection`, `intellectual-property-copyright-basics`, `regulatory-monitoring-legal-research`, `ai-regulation-digital-law` (topic-level EU AI Act overview), `legal-operations-documentation`. Descriptions stay at topic level (no article numbers, deadlines or figures); EU/Germany scope is labelled. ESCO refs were looked up via the ESCO search API (URI and preferred label as returned; no ESCO skill exists for whistleblowing, so ethics/code-of-ethics skills are used); no DigComp refs. Prerequisites are acyclic and reference existing ids only. Niche topics (IP, risk, audit, AI regulation, legal operations) start at foundation target = none.
- Reason: reuse avoids duplicate units/items; `gdpr-data-protection-compliance` is separate from `hr-data-protection` and `data-governance-privacy-analytics` (HR/analytics-specific) to give a general legal view; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: separate corporate-governance and internal-investigation competencies (13+ competencies, exceeds 8-12 cap; covered by compliance management and internal-controls-audit), reusing `hr-data-protection` as the GDPR competency (too HR-specific), publishing early (fails coverage validation).

## 2026-11-25 — People Leadership framework: 12 role competencies (4 reused, 8 new), draft status
- Decision: People Leadership (team leads) role added as `status: draft` with 12 role competencies plus the 6 core-track competencies. Reused: `performance-feedback`, `employee-relations-conflict`, `employment-law-basics` (covers labour-law and works-council basics for leaders at topic level, Germany/EU), `diversity-inclusion`. New: `leadership-fundamentals-role-transition`, `delegation-accountability`, `goal-setting-team-planning` (SMART/OKR at concept level), `one-to-one-coaching`, `team-building-psychological-safety`, `motivation-engagement-wellbeing` (workload and wellbeing folded in), `meetings-decision-making`, `leading-change` (leadership angle; PM-oriented `quality-change-management` not reused). ESCO refs were looked up via the ESCO search API (URI and preferred label as returned); no DigComp refs; descriptions at topic level, no invented laws, figures or named studies. Prerequisites are acyclic and reference existing ids only. `leading-change` and `diversity-inclusion` start at foundation target = none.
- Reason: reuse avoids duplicate units/items; draft keeps coverage unenforced and the role hidden until content exists.
- Alternatives: separate hiring/onboarding and health-and-safety competencies (`recruitment-selection`, `onboarding-offboarding`, `health-safety-wellbeing` exist but would exceed the 8-12 cap; leaders' onboarding and wellbeing duties are covered within motivation and leadership fundamentals), a dedicated works-council competency (topic covered by `employment-law-basics` and `employee-relations-conflict`), publishing early (fails coverage validation).
