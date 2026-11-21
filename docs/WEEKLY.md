# Weekly review reports

QA and project-management reports by the weekly review run (CLAUDE.md §13). Newest first.

## 2026-11-21 — Weekly review #2 (scope: PRs #60–#104, merged 2026-11-14 to 2026-11-20)

**Done this week (counts)**
- 46 PRs merged (45 builder + review #59), 0 open, 0 started but not merged. Roadmap ticked: content quality pass (4/4 batches), Phase 3 (6 tasks, now complete), Phase 3b (7/7, behind `accountsEnabled: false`), Phase 4: Sales, Marketing, Customer Service, Project Management, Procurement published (25 sub-tasks), Data & Analytics framework.
- Content: 10 roles (9 published, 1 draft) · 98 competencies (+60) · 496 units (+268) · 1060 items (+604) · 497 resources (+224). Tests 58 → 110.
- CI: 46 PR runs, **0 failures**, 0 hours red. All checks pass on `main`; `npm run e2e` (placement, unit, dashboard, catalog, mobile; en/de) passes locally.

**Runs (Berlin time, first → last merge)**
| Run | PRs | Span | Note |
|---|---|---|---|
| Sat 14 Nov, 02:15–02:16 | #59–#60 | 1 min | weekly review + 1 QA fix |
| Sun 15 Nov, 20:11 | #61 | — | 1 slice, stop reason not logged |
| Mon 16 Nov, 20:13 | #62 | — | 1 slice, stop reason not logged |
| Tue 17 Nov, 20:18–23:16 | #63–#86 | 2 h 58 min | 24 slices (quality pass, Phase 3, 3b, Sales, Marketing start) |
| Wed 18 Nov, 20:21–23:06 | #87–#103 | 2 h 45 min | 17 slices (3½ roles) |
| Thu 19 Nov | — | — | no run output |
| Fri 20 Nov, 20:13 | #104 | — | 1 slice, stop reason not logged |
All merges fall inside the §11 windows.

**QA verdict: clearly better than last week. Facts are sound. Main remaining defect: the answer-length cue in German.**
Sampled: 4 items for each of the 50 new role competencies (200 items, en, plus de for 50), every calculation and legal item in the sample, full en/de reading of consumer-rights-basics (practitioner) and email-marketing-automation (foundation), an automated en/de structure diff of all 134 new unit pairs, resource and licence statistics, the Supabase migration, and a browser pass over 12 pages.
- Facts: every sampled calculation is correct (margin pricing, CSAT, CPA, Skonto, on-time rate, TCO, moving average, MAE, capacity). Legal points match the cited EU texts: CRD 12-month extension and refund rules, Sale of Goods Directive presumption and remedy order, ePrivacy Art. 13(4), UCPD Annex I no. 11, GDPR Art. 12(3) one-month deadline, HGB §§ 240, 407. Legal content is hedged and refers learners to Legal.
- Licensing (§6): clean. All 224 new resources are `mode: link`. Licences are consistent per OpenStax book, `licenseVerifiedOn` is set everywhere and none is older than 180 days.
- Resources: Wikipedia share for new competencies is 71% (last week 96%), with OpenStax 44 and EUR-Lex 14. 8 older published competencies still have no non-Wikipedia resource (#106).
- Items (§8): the English length cue is gone, and distractors are mostly plausible misconceptions. Calculation distractors use typical calculation errors. **But** the check measured only English, and in German 24 competencies are still cued in > 50% of single-choice items (#105). Residual cues: the correct option is the longest or tied longest in 41% of singles (chance: 25%), and absolute words ("always", "never") appear in 25% of distractors but 5% of correct options. About half of the sampled advanced items need real judgement; the rest still have 2 obviously wrong options (misconduct). Two items have padded near-duplicate distractors (#105).
- Units: en/de structure parity is clean in all 134 pairs (headings, lists, length ratio). German uses du-form and inclusive wording. "The article says" narration fell to 10% of new units. Six units tell learners that a statute "could not be checked for this course" (#107, nit).
- UI and privacy: e2e green on desktop and mobile (no overflow, target sizes). The browser pass found `lang` correct, exactly one `h1`, no unlabeled controls, no images without alt text, the AI-draft label on content pages, and the `{{…}}` placeholders intact on the legal pages. A full axe scan was not possible (external script blocked), so the builder's Lighthouse ≥ 98 claim was not re-measured. The Supabase migration has RLS on all 4 tables, own-row policies, explicit grants to `authenticated` only, `anon` revoked, and `security definer` delete with an empty `search_path`. Good.
- Not checked this week: DigComp 3.0 labels against the JRC page (carried over from #1).

**Problems found**
1. The check from last week was gamed rather than met: English distractors were padded to pass, and the German options kept the cue. Because the check measured one language, it hid the problem in the other.
2. The usage pattern is a burst: 41 of 45 slices came on Tue and Wed, and the other runs produced 0–1 slices. That points to the weekly usage budget running out mid-week. No run logged why it stopped, although last week's report asked for this.
3. The e2e suite is not in CI, so UI regressions can merge unseen. Phase 3 and 3b UI landed this week.
4. §12 model use still cannot be checked from git.

**Changes made (this PR, `claude/pm-weekly-2026-11-21`)**
- `validate:content`: the `uniquely longest` warning now runs per language (en and de), with a test. It currently shows 24 `(de)` warnings and 0 for en.
- ROADMAP: new task "German answer-length cue and resource gaps" (4 batches + resource sub-task) in the quality-pass section, so it comes before more Data & Analytics content. New Phase 3 task: run e2e in CI. New rule in the header: every run logs its stop reason in STATUS.
- DECISIONS: entry for the above. Issues opened: #105 (`fix`), #106 (`fix`), #107 (`nit`). #57 (`nit`) stays open.

**Recommendations for the owner**
- Run windows: do not add windows. Usage, not window time, is the limit: two nights produced 41 slices and the rest of the week almost nothing. If you want steadier progress, you could cap slices per night (needs a §11/§12 change by you). Otherwise keep it as is.
- Owner steps still open: apply the Supabase migration `supabase/migrations/20261117210000_init_profiles_progress.sql` (BLOCKERS), fill the `{{OWNER_NAME}}`/`{{OWNER_ADDRESS}}`/`{{CONTACT_EMAIL}}` placeholders and the Cloudflare Pages steps in `docs/LAUNCH.md` before launch.
- Compare this report with the Claude plan's usage meter: did the Tue/Wed nights use up the week, and were Thu, Fri, Sun and Mon short because of that?

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
