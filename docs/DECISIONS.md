# Decisions

Format: date — decision — reason — alternatives considered.

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
