# Status

## 2026-11-11 — Phase 1: Finance & Accounting framework

**Done**
- IT Support & Operations framework merged ([#3](https://github.com/fdragonfpsy/open-role-academy/pull/3)).
- Role `finance-accounting` (status `draft`): 11 role-specific competencies + 6 core competencies with targets and priorities; en/de texts, prerequisites, ESCO references.

**Counts:** roles 3 (1 published, 2 draft) · competencies 27 · units 6 · items 12 · resources 7

**Next:** Human Resources framework, then `docs/FRAMEWORK.md` generator.

## 2026-11-11 — Phase 1: IT Support & Operations framework

**Done**
- Core track competencies merged ([#2](https://github.com/fdragonfpsy/open-role-academy/pull/2)) — first PR merged by the automerge workflow.
- Role `it-support-operations` (status `draft`): 10 role-specific competencies + 6 core competencies with targets and priorities; all with en/de texts, prerequisites and ESCO references.
- Roles can be `draft` (hidden in UI, coverage not enforced) or `published`. Validator checks targets (none empty, non-decreasing).

**Counts:** roles 2 (1 published, 1 draft) · competencies 16 · units 6 · items 12 · resources 7

**Next:** Role Finance & Accounting framework, then Human Resources, then `docs/FRAMEWORK.md` generator.

## 2026-11-11 — Phase 1: core track competencies defined

**Done**
- Phase 0 merged ([#1](https://github.com/fdragonfpsy/open-role-academy/pull/1)).
- All 6 core-track competencies defined (en/de titles and descriptions, prerequisites, ESCO + DigComp references). `information-security-basics` now also references ESCO "cyber security" / "protect ICT devices" and requires `digital-ai-literacy`.
- Validator warns about competencies without framework references.

**Counts:** roles 1 · competencies 6 · units 6 · items 12 · resources 7

**Next:** Role IT Support & Operations (8–12 competencies with targets per level).

## 2026-11-11 — Phase 0 complete (rebuilt from scratch)

**Done**
- Astro 7 + TypeScript strict + Tailwind 4 + Preact islands, static output; npm scripts `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `validate:content`.
- i18n: English at `/`, German at `/de/`, language switcher, UI strings in `src/i18n/{en,de}.ts` with a parity test.
- Content collections + Zod schemas (`src/content/schemas.ts`, `src/content.config.ts`).
- Content validator (`npm run validate:content`): schemas, en/de parity, embed license whitelist, attribution, coverage (units per required level, ≥ 6 items, ≥ 2 per level, difficulty ranges), dead references, prerequisite cycles, unit length, license age. Tests in `tests/validator.test.ts`.
- Adaptive engine in `src/engine/` (Elo, path ordering, mastery, Leitner reviews, placement/mastery item selection, export/import) with tests and `docs/ENGINE.md`.
- GitHub Actions: `ci.yml`, `automerge.yml`, `link-check.yml` (weekly).
- `LICENSE` (MIT), `LICENSE-CONTENT` (CC BY-SA 4.0), `README.md`, `README.de.md`, `CONTRIBUTING.md`, docs (STATUS, DECISIONS, BLOCKERS, ENGINE, SOURCES).
- Legal page templates (imprint, privacy; en/de) with placeholders.
- Demo slice `information-security-basics` (core track): 3 levels × en/de units, 12 items, 7 verified resources; tested end to end in a browser (onboarding → placement → dashboard → unit → mastery check → dashboard → export).

**Counts:** roles 1 (core-track) · competencies 1 · units 6 (3 en + 3 de) · items 12 · resources 7 · tests 48

**Next:** Phase 1 — define all 6 core-track competencies (en/de, prerequisites, ESCO/DigComp refs), then the IT Support & Operations role.

**One-time settings the owner still has to make**
1. GitHub → Settings → Actions → General → Workflow permissions: "Read and write permissions" (needed by `automerge.yml` to merge and by `link-check.yml` to open issues).
2. GitHub → Settings → General: enable "Automatically delete head branches" (optional; the workflow deletes branches anyway).
3. Cloudflare Pages: create a project connected to this repository — framework preset Astro, build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
4. Fill in `{{OWNER_NAME}}`, `{{OWNER_ADDRESS}}`, `{{CONTACT_EMAIL}}` in `src/components/pages/ImprintPage.astro` and `PrivacyPage.astro` before the public launch, and have the legal templates checked.
