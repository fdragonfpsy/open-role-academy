# Weekly review reports

QA and project-management reports by the weekly review run (CLAUDE.md §13). Newest first.

## 2026-11-14 — Weekly review #1 (scope: everything merged, #1–#52, 2026-11-11 to 2026-11-13)

**Done this week (counts)**
- 52 PRs merged, 0 open, 0 abandoned. Roadmap: Phase 0 (12/12), Phase 1 (5/5), Phase 2 (4/4 groups, 38 competencies), Phase 3 landing page (1/7).
- Content: 4 roles (all published), 38 competencies, 228 units (114 en + 114 de, all `ai-draft`), 456 items, 273 resources.
- CI: 53 CI runs and 104 automerge runs, **0 failures**, so 0 hours red. All checks pass on `main` (lint, typecheck, 58 tests, validate:content, build).

**Runs (Berlin time, first → last merge)**
| Run | PRs | Span | Note |
|---|---|---|---|
| Wed 11 Nov, 11:22–12:09 | #1–#14 | 47 min | before the work-window rule existed (#16) |
| Wed 11 Nov, 22:12 | #15 | — | single slice |
| Thu 12 Nov, 10:43–14:09 | #16–#22 | — | owner-initiated setup/config sessions (rules, Supabase, accounts), daytime |
| Thu 12 Nov, 20:15–23:01 | #23–#47 | 2 h 46 min | 25 competencies, ≈ 6.6 min each |
| Fri 13 Nov, 20:14–20:31 | #48–#52 | 17 min | stopped with > 4 h of window left; no reason logged |

**QA verdict: acceptable facts, weak assessment design.**
Sampled: 4 items for each of the 38 competencies (152 items, en+de), full reading of 3 units (en/de) and their worked examples, an automated en/de structure diff of all 114 unit pairs, and a fact-risk scan (numbers, laws, standards) of one unit per competency.
- Facts: all sampled calculations correct (VAT netting, break-even, contribution margin, ratios, median, cost-plus); HGB/IFRS, accruals, Skonto, controls and IT basics correct. Two problems: a legal rule taken from one Wikipedia sentence (#54) and a probably wrong e-invoicing detail (#58).
- Licensing (§6): clean. All 273 resources `mode: link`; licenses CC-BY-SA-4.0 (263), free-access (5), CC-BY-NC-SA-4.0 (5); no embeds, no adaptations, so no TASL attribution needed yet. `licenseVerifiedOn` set on all.
- Items (§8): **main problem.** In 87% of single-choice items the correct option is the longest one (≈ 2× the distractor length). Many distractors are absurd ("read the salaries out in the canteen"). Advanced items are no harder than foundation items, so placement and mastery will overrate learners (#53). Calculation items in Finance are the good exception (distractors are typical calculation errors).
- Resources: 96% Wikipedia; preferred open sources (OpenStax, OpenLearn, BSI, statutes) are hardly used (#56).
- en/de: parity good overall. Gaps in financial-analysis-kpis (a missing German section) plus small grammar errors (#55). German "du"-form and inclusive wording are consistent. Half the units narrate "the English/German article says …" (#57, nit).
- AI-draft label present (en/de). DigComp 3.0 labels in `frameworkRefs` could not be checked against the JRC page (HTTP 429); re-check next week.
- UI: no new UI was merged this week (the landing page already existed), so there was no accessibility check. The Phase 3 islands still need a browser test.

**Problems found**
1. Speed over depth: about 6.6 min per competency on Thursday. STATUS admits definitions were "written without fetching the pages (rate-limited)". The quality signals (answer cue, Wikipedia-only, "the article says") match that.
2. If Phase 4 starts as things are, all 10 new roles will repeat the item-cue and Wikipedia-only patterns.
3. Friday's run ended after 17 min with no entry in STATUS or BLOCKERS saying why. Usage limit is likely but not recorded.
4. §12 model use cannot be checked from git (commits don't record the model).
5. Stale branch `claude/admiring-mayer-dn6uyq` still exists (superseded, safe to delete).
6. Daytime work on Thu 12 Nov (#16–#22) happened inside the 08:00–20:00 window. These were owner-initiated setup sessions, not builder runs. Since the rule was introduced, no builder run has fallen outside a window.

**Changes made (this PR, `claude/pm-weekly-2026-11-14`)**
- `npm run validate:content` now **warns** (does not fail) when more than 50% of a competency's single-choice items have the correct option as the uniquely longest. It currently flags 35 of 38 competencies. Test added.
- ROADMAP: added quality criteria for all new content (Phase 2 header, applies to Phase 4). Added a "Content quality pass" task with 4 per-role batches, placed before the remaining Phase 3 work. Sharpened the acceptance criteria for onboarding/placement UI (browser test, keyboard, 15-question budget).
- Issues opened: #53, #54, #55, #56, #58 (`qa`, `fix`) and #57 (`qa`, `nit`). Per §13 the builder fixes `fix` issues before new roadmap work.

**Recommendations for the owner**
- Run windows: throughput is high, about 30 competency slices per good night. More windows are not needed. Quality per slice is the limit, so I'd keep the current windows and let the next runs go into the quality pass.
- Delete the stale branch `claude/admiring-mayer-dn6uyq` (one click in GitHub → Branches).
- Still open from BLOCKERS: apply the Supabase SQL migrations once Phase 3b produces them.
- Optional builder habit (no rule change needed): when a run stops early, write the reason (usage limit, rate limit, window end) as one line in STATUS.
- Compare this report with the Claude plan's usage meter: did Thursday's 25-slice night or Friday's 17-minute stop use up the week?
