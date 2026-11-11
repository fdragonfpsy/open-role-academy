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
