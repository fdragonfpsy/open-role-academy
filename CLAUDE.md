# CLAUDE.md — Open Role Academy

This file is the project constitution. Every session (interactive or scheduled routine) reads it first and follows it. When this file and a prompt disagree, this file wins unless the prompt explicitly says it overrides a section.

## 1. Mission

A free, public, open-source learning platform that gives every basic role in a company an **adaptive learning path**, based on **openly licensed or freely accessible learning content**.

- Learners pick a **role** (e.g. HR, Finance, IT Support) and a **self-rated experience level**.
- A short **placement check** estimates their current level per competency.
- The platform then recommends the **next best learning unit**, re-checks mastery and schedules reviews.
- Languages: **English is the default**, **German is the second language**. Every learner-facing string and every unit exists in both.

Working name: "Open Role Academy" (rename freely; keep it in one place: `src/config/site.ts`).

## 2. Hard constraints (never violate)

1. **$0 running cost.** Only free tiers: GitHub (public repo + Actions), Cloudflare Pages. No paid APIs at runtime. No service that needs a credit card.
2. **No personal data in Phase 1.** No accounts, no server-side learner data, no analytics cookies, no third-party trackers, no embedded third-party iframes that set cookies (link out instead). Learner progress lives in `localStorage` with JSON export/import.
3. **No secrets in the repo.** Never commit tokens, passwords or account emails. Never ask for credentials. Never try to log in to any account.
4. **Licensing rules (section 6) are binding.** If a license is unclear, the resource is **link-only** or excluded.
5. **Everything static.** The site must build to static files (`dist/`) and run without a backend.
6. **Autonomy.** Do not ask the human questions. Make the most reasonable decision, record it in `docs/DECISIONS.md` (date, decision, reason, alternatives), and continue. If truly blocked, log it in `docs/BLOCKERS.md` and move to the next task.

## 3. Stack

- **Astro** (static output) + **TypeScript (strict)** + **Tailwind CSS**.
- Interactive parts (placement check, quiz, dashboard) as **Preact islands**.
- Content in **Astro content collections** with **Zod schemas** (see section 5).
- Astro i18n routing: `/` (English default) and `/de/` (German).
- Tests: **Vitest** for the adaptive engine and content validators.
- Package manager: **npm** (lockfile committed).
- Hosting: **Cloudflare Pages** via Git integration (deploys `main` automatically; no deploy token needed in this repo).
- Accessibility: WCAG 2.2 AA as the target (semantic HTML, keyboard navigation, contrast, `lang` attributes).
- No heavy dependencies without a recorded reason in `docs/DECISIONS.md`.

## 4. Roles, levels, competencies

### 4.1 Levels (same for every role)
| id | EN | DE | Typical learner |
|---|---|---|---|
| `foundation` | Foundation | Grundlagen | New to the role, 0–2 years |
| `practitioner` | Practitioner | Fortgeschritten | Works independently, 2–5 years |
| `advanced` | Advanced | Experte | Leads topics, 5+ years |

### 4.2 Core track (all roles inherit this)
Digital & AI literacy · Communication & collaboration · Information security & data protection basics · Working with data (spreadsheets, basic analysis) · Self-organisation & project basics · Business & finance fundamentals.

### 4.3 Role families (build in this order)
1. IT Support & Operations
2. Finance & Accounting
3. Human Resources
4. Sales
5. Marketing
6. Customer Service
7. Project Management
8. Procurement & Supply Chain
9. Data & Analytics
10. Software Development
11. Controlling
12. Legal & Compliance
13. People Leadership (team leads)

### 4.4 Competency framework rules
- Each role: **8–12 role-specific competencies** plus the core track.
- Each competency has: id, title (en/de), description (en/de), prerequisites, and a **target level per role level** (e.g. HR foundation needs `employment-law-basics` at foundation).
- Anchor competencies to public frameworks where possible and store the reference: **ESCO** (EU skills/occupations taxonomy, multilingual) and **DigComp 3.0** (EU digital competence framework, JRC, published November 2025: 5 competence areas, 21 competences, 4 proficiency levels Basic/Intermediate/Advanced/Highly advanced, AI competence integrated across all competences). Use only DigComp 3.0 names and numbering; never cite DigComp 2.2 names. Reference URI: https://joint-research-centre.ec.europa.eu/digcomp/digcomp-framework_en Store the ESCO/DigComp URI in the competency's `frameworkRefs`. Do not use proprietary frameworks (e.g. SFIA) as a source of text.

## 5. Data model (Zod schemas in `src/content/config.ts`)

- `roles/<id>.yaml` — `id`, `title{en,de}`, `summary{en,de}`, `competencies: [{ id, priority (1–3), targets: {foundation, practitioner, advanced} }]`.
- `competencies/<id>.yaml` — `id`, `title{en,de}`, `description{en,de}`, `prerequisites[]`, `track: core|role`, `frameworkRefs[]`.
- `units/<lang>/<competency>-<level>.mdx` — frontmatter: `id`, `competency`, `level`, `objectives[]`, `minutes`, `resources[]` (resource ids), `status: ai-draft|reviewed`, `sources[]`. Body: a short original explanation (300–800 words), worked example, key takeaways, then the curated resources.
- `items/<competency>.yaml` — assessment items: `id`, `level`, `difficulty` (number, see 7.2), `type: single|multi`, `stem{en,de}`, `options[{en,de,correct}]`, `explanation{en,de}`, `source`.
- `resources/<id>.yaml` — `id`, `url`, `title`, `provider`, `language`, `format` (article|video|course|book|interactive), `minutes`, `license` (SPDX-style id, e.g. `CC-BY-4.0`, or `free-access` for non-open but free), `licenseUrl`, `licenseVerifiedOn` (ISO date), `mode: embed|link`, `competencies[]`, `levels[]`.

A content validator script (`npm run validate:content`) must enforce:
- schema validity;
- **en/de parity** (every unit and every learner-facing string exists in both languages);
- license whitelist for `mode: embed` (section 6);
- attribution present on every unit that embeds or adapts third-party material;
- every competency referenced by a role has ≥1 unit per required level and ≥6 items spread across difficulties;
- no dead internal references.

## 6. Licensing policy

| License | Allowed use |
|---|---|
| CC0, Public Domain, CC BY, CC BY-SA | **embed / adapt** (with attribution; CC BY-SA content makes that unit CC BY-SA) |
| CC BY-NC, CC BY-NC-SA | **link only** (project is non-commercial, but keep the platform license clean) |
| CC BY-ND, CC BY-NC-ND | **link only, never adapted, never translated** |
| Free-access but not openly licensed (vendor docs, YouTube, free courses) | **link only** |
| Unknown / unclear | **exclude** (or link only if the page is clearly free to access) |

- Attribution format (TASL): Title, Author, Source (link), License (link), plus "changes made" if adapted.
- Original text written for this project: **CC BY-SA 4.0**. Code: **MIT**. State both in `LICENSE`, `LICENSE-CONTENT` and the footer.
- Never copy long passages from any source, open or not. Units are original explanations that **cite** sources.
- Record `licenseVerifiedOn` for every resource. Re-verify resources older than 180 days during maintenance runs.

### Preferred sources (verify license per resource, every time)
OERSI (oersi.org, German OER search index), OpenStax, OpenLearn (Open University), Saylor Academy, Wikibooks/Wikipedia, MIT OpenCourseWare (NC → link only), Khan Academy (NC → link only), EU sources (ESCO, DigComp, EU publications), German public sources (e.g. BSI for IT security basics, official statutes on gesetze-im-internet.de for legal basics), Microsoft Learn / vendor docs (link only unless the license says otherwise).

## 7. Adaptive learning engine (`src/engine/`, pure TypeScript, fully unit-tested)

### 7.1 Flow
1. **Onboarding:** choose language, role, self-rated level (`foundation|practitioner|advanced`). The self-rating sets the **prior** ability.
2. **Placement check:** for each target competency of the role, 3–5 items, adaptive (next item harder after a correct answer, easier after a wrong one). Total ≤ 15 minutes; allow "skip placement" (prior only).
3. **Learning path:** ordered list of units. Order = prerequisites first, then largest gap (target − current), weighted by competency priority.
4. **Unit → mastery check** (3–5 items) → update ability → recompute path.
5. **Review:** spaced repetition of items from mastered competencies (simple Leitner boxes: 1, 3, 7, 21 days).
6. **Dashboard:** per-competency level vs. target, progress, next recommended unit, review queue, export/import progress (JSON).

### 7.2 Model
- Ability per competency: **Elo-style rating** θ. Item difficulty b on the same scale.
- Level bands: foundation ≈ 800–1099, practitioner ≈ 1100–1399, advanced ≥ 1400. Prior from self-rating: 950 / 1250 / 1500.
- Expected score p = 1 / (1 + 10^((b − θ)/400)); update θ ← θ + K·(score − p), K = 40 during placement, 24 afterwards.
- **Mastery** of a level = θ ≥ lower band bound of that level **and** ≥2 correct answers on items of that level.
- Item difficulty is set at authoring time from the item's level (foundation 950 ± 100, practitioner 1250 ± 100, advanced 1550 ± 100). No server-side calibration in Phase 1.
- The engine must be deterministic, documented in `docs/ENGINE.md`, and covered by tests (path ordering, prerequisite handling, mastery, review scheduling, export/import round-trip).

### 7.3 What AI does and does not do
- **Build time (Claude, in this repo):** map competencies to frameworks, find and license-check resources, write original unit texts, write assessment items, translate en↔de.
- **Runtime:** no LLM. Sequencing and mastery decisions are made by the deterministic engine only.
- Phase 5 (optional, later): a small AI tutor via Cloudflare Workers AI free allocation, behind strict rate limits, clearly labeled, never used for scoring.

## 8. Quality bar for content

- Every unit and item starts as `status: ai-draft` and is shown with a visible label "AI-generated, not yet reviewed by a human" (en/de).
- Facts must be traceable to `sources[]`. No invented statistics, laws, numbers or quotes. When in doubt, leave it out.
- Items: one unambiguous correct answer (single) or clearly defined set (multi); plausible distractors; explanation that teaches; no trick questions; no reliance on country-specific law unless the unit is explicitly about that country (then say so: "Germany", "EU").
- German: natural, gender-inclusive where it reads naturally (e.g. "Mitarbeitende"), "du"-form for learners.
- Region: EU/Germany context by default for law, tax and HR topics; label it.

## 9. Legal pages (required before first public launch)

- Impressum and privacy policy pages (en/de) with placeholders `{{OWNER_NAME}}`, `{{OWNER_ADDRESS}}`, `{{CONTACT_EMAIL}}` — the human fills these in. Never fill them with guessed data.
- Privacy policy must accurately describe: static hosting on Cloudflare Pages (server logs), no cookies, progress stored only in the learner's browser.
- Do not launch Phase 5 features (accounts, AI tutor) without updating the privacy policy.

## 10. Workflow rules for every session

1. Read `CLAUDE.md`, `docs/ROADMAP.md`, `docs/STATUS.md`, `docs/BLOCKERS.md`.
2. Pick the **first unchecked task(s)** in `docs/ROADMAP.md` that fit into this session. Prefer finishing a phase over starting a new one.
3. Work on a branch named `claude/<short-task-name>`. Small, coherent commits with clear messages.
4. Before opening a PR, run: `npm run lint && npm run typecheck && npm test && npm run validate:content && npm run build`. All must pass. Never disable a check to make it pass.
5. Update: tick tasks in `docs/ROADMAP.md`, add a dated entry to `docs/STATUS.md` (what was done, what is next, counts of roles/competencies/units/items/resources), log decisions in `docs/DECISIONS.md`.
6. Open a pull request into `main` with label `automerge`. The `automerge` workflow merges it when CI is green. Do not wait for human review.
7. If CI fails on your PR and you cannot fix it in this session: leave the PR open, remove the `automerge` label, describe the cause in the PR description, and add an entry to `docs/BLOCKERS.md` in the same PR. The next session starts by fixing open, failing `claude/*` PRs before picking new roadmap tasks.
8. Stay within one session's budget: better one finished, tested slice than three half-built ones.

## 11. Work windows and usage budget

The owner runs this project on a Claude Pro plan and needs his usage during the day. You cannot see the plan's usage meter, so time is the budget. All times are **Europe/Berlin** (`TZ=Europe/Berlin date`). Check the time before starting each new slice.

**Never work between 08:00 and 20:00 on any day, including weekends.**

| Run starts | No new slice after | Hard stop |
|---|---|---|
| Sun–Thu evening (20:00) | 23:15 | 23:45 |
| Fri and Sat evening (20:00) | 00:45 | 01:30 |
| Sat and Sun night (02:00) | 07:00 | 07:45 |

- The weekly limit resets on **Sunday at 18:00**. The Saturday and Sunday night runs use what is left of the week; the Sunday evening run already uses the new week, so it stays short.
- Within the window, **work continuously**: after a slice is merged, take the next task. Finished, merged slices are the goal, not one slice per run.
- If you hit a usage or rate limit, stop cleanly: nothing half-done on `main`; push the current branch only if its checks pass.
- If a run starts outside its allowed window (e.g. a delayed start), write one line and stop.

## 12. Model choice and token efficiency

Use the cheapest model that does a task well. The main session coordinates; delegate with subagents (Task/Agent tool with an explicit `model`) where it saves usage:

| Work | Model |
|---|---|
| Mechanical: link and license checks, YAML formatting, renames, running checks, counting, simple fixes from a clear error | **haiku** |
| Standard: unit texts, assessment items, en↔de translation and wording review, competency frameworks, docs | **sonnet** |
| Hard: engine and architecture changes, tricky CI or build failures after one failed fix attempt, reviewing a whole role for quality | **opus**, sparingly |

Token hygiene:
- Read only the files a task needs; use `grep`/`head` instead of reading whole large files; never re-read a file you just wrote.
- Give subagents a precise brief with file paths and acceptance criteria; ask them for short results, not file dumps.
- Batch similar work (e.g. all items of one competency in one pass).
- Keep run output terse: no long summaries in the session, the details belong in `docs/STATUS.md`.

## 13. Quality review (second instance)

A separate weekly **QA run** reviews the builder's work with fresh context. It does not approve PRs; it audits merged work and files findings.

- Scope: everything merged since the last QA report (`docs/QA.md`). Sample at least 1 unit (en and de) and 4 items per new competency, plus every engine or UI change.
- Check: facts against the cited sources, license and attribution rules (§6), item quality (§8), en/de wording and parity, accessibility of new UI, and whether the work matches the roadmap and this file.
- Output: GitHub issues labeled `qa` with severity (`blocker`, `fix`, `nit`), file paths and a concrete fix; small, clear fixes may be done directly in a `claude/qa-*` PR with `automerge`. Append a dated summary to `docs/QA.md`.
- Builder rule: at the start of every run, fix open `qa` issues labeled `blocker` or `fix` before new roadmap work.
- Models: sonnet for the review pass, opus only for judging disputed facts or engine logic (§12).
