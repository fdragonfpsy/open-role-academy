# Status

## 2026-11-24 — Software Development content batch 1

**Done**
- programming-fundamentals-problem-solving, version-control-collaboration, software-design-architecture-basics: 18 units (en+de, `ai-draft`), 18 items, 26 new link-only resources (HTTP 200, verified 2026-11-24). Role stays `draft`. Closed QA #106 (fixed by #110). Stale branch `claude/admiring-mayer-dn6uyq` (pre-rewrite history) could not be deleted from here; owner may delete it. All checks green.

**Reviewer to-dos:** unit text paraphrases Wikipedia (layered architecture, trunk-based development, SOLID, microservices, merge vs rebase) without live re-check; git-scm.com, MDN, docs.github.com unreachable from here; no German non-Wikipedia source for version control/design; worked examples invented (labelled); German wording not human-reviewed.

**Next:** Software Development batch 2 (software-testing-quality, software-debugging, apis-integration).

## 2026-11-23 — Software Development framework

**Done**
- Role `software-development` (status `draft`): 10 role-specific competencies + 6 core, en/de texts, ESCO refs (looked up via ESCO API).

**Next:** Software Development content batches 1-3, then publish and quality pass.

## 2026-11-22 (f) — Data & Analytics complete and published; run summary

**Done**
- machine-learning-basics-ai-analytics (foundation+practitioner, en+de, `ai-draft`), 12 items, 3 new link-only resources. Quality pass: all 10 role competencies have a non-Wikipedia and a German resource (storytelling uses an OpenStax NC managerial-communication page, not data-specific). Data & Analytics set to `status: published`; FRAMEWORK.md regenerated. Validator: 0 errors, 0 warnings.
- This run (4 PRs and more): #110 QA #106 resources (#105 closed), #111 e2e job in CI (+ test timing fixes: hydration, selection, focus races on slow runners), #112/#113/#114 Data & Analytics batches 1–3, plus this PR (batch 4 + publish).
- Stopped: all window time not used up, run kept to a sensible slice count; next role is a fresh, larger task.

**Reviewer to-dos:** ML/AI units mention the EU AI Act at topic level only; Google ML Crash Course and Elements of AI unreachable from here; storytelling would benefit from a data-specific open source; German wording not human-reviewed.

**Counts:** roles 10 (0 draft) · competencies 98 · units 552 · items 1180 · resources 538

**Next:** Software Development framework (Phase 4).

## 2026-11-22 (e) — Data & Analytics content batch 3

**Done**
- business-intelligence-reporting (foundation+practitioner), analytical-problem-framing-storytelling and data-governance-privacy-analytics (3 levels): 16 units per language set (8 en + 8 de, `ai-draft`), 36 items, 8 new link-only resources; 11 existing resources re-tagged. Role stays `draft`. lint/typecheck/test/validate/build all green.

**Reviewer to-dos:** two GDPR statements rest on general knowledge, not a fetched source (pseudonymised data remains personal data; anonymisation needs no reasonably likely re-identification) — no article numbers, fines or deadlines used; storytelling has no non-Wikipedia resource beyond reused OpenStax NC pages; Wikipedia pages were confirmed to load, not read in full; German wording/gender-inclusion not human-reviewed.

**Next:** Data & Analytics batch 4 (machine-learning-basics-ai-analytics), publish role, quality pass (storytelling non-Wikipedia resource).

## 2026-11-22 (d) — Data & Analytics content batch 2

**Done**
- sql-data-querying, statistics-fundamentals, data-visualization-dashboards: 18 units (en+de, `ai-draft`), 36 items, 10 new link-only resources (HTTP 200, verified 2026-11-22). Role stays `draft`. Validator: 0 errors. Also in this run: PR #110 (QA #106 resources), #111 (e2e job in CI, plus several e2e timing fixes for slow runners), #112 (batch 1).

**Reviewer to-dos:** non-Wikipedia resources are Wikibooks/OpenStax only (postgresql.org, w3.org unreachable from here); viz has no German non-Wikipedia source; some German distractors lengthened (slightly padded); check invented A/B-test numbers (5,000 visitors, p = 0.36) and German wording ("Datenverantwortliche").

**Counts:** roles 10 (1 draft) · competencies 98 · units 532 · items 1132 · resources 527

**Next:** Data & Analytics batch 3 (business-intelligence-reporting, analytical-problem-framing-storytelling, data-governance-privacy-analytics), then batch 4, publish, quality pass.

## 2026-11-22 (c) — Data & Analytics content batch 1

**Done**
- data-analytics-fundamentals, data-sourcing-collection, data-quality-cleaning: 18 units (en+de, `ai-draft`), 36 items, 10 new link-only resources (`licenseVerifiedOn` 2026-11-22, HTTP 200). Role stays `draft`. Validator: 0 errors, 0 length warnings. Stopped: window end approaching for a full batch / run kept lean.

**Reviewer to-dos:** several facts rest on page intros (Wikipedia data collection/quality/integration; 5 quality dimensions labelled "our own"); German govdata/destatis unreachable, so data.europa.eu used (`free-access`); outlier and data-type statements are general knowledge, not from the linked pages; German wording not human-reviewed.

**Counts:** roles 10 (1 draft) · competencies 98 · units 514 · items 1096 · resources 517

**Next:** Data & Analytics batch 2 (sql-data-querying, statistics-fundamentals, data-visualization-dashboards).

## 2026-11-22 (b) — CI runs the browser e2e suite

**Done**
- `ci.yml`: new `e2e` job (build, install Playwright 1.49.1 with `--no-save`, serve `astro preview`, `npm run e2e`; 10-min timeout). Locally 238 checks pass in ~30 s. Stopped: run kept to two slices (window not exhausted).

**Next:** Data & Analytics content batches 1–3.

## 2026-11-22 — QA #106: non-Wikipedia resources for 8 competencies

**Done**
- 10 new link-only resources (`licenseVerifiedOn: 2026-11-22`, HTTP 200): OpenStax accounting/finance/managerial/OB chapters, EUR-Lex VAT directive 2006/112. it-service-management reuses BSI OPS.1.1.3 (German only; no open ITSM page was reachable). Resource ids added to the en/de units. Validator: 0 errors. Closed #105.
- Stopped after one slice: run kept lean; next slice is CI e2e job.

**Reviewer to-dos:** EUR-Lex page content was not read (bot check); gesetze-im-internet.de unreachable, so tax-basics has no German statute link. Confirm OpenStax license text on the resource notes.

**Counts:** roles 10 (1 draft) · competencies 98 · units 496 · items 1060 · resources 507

**Next:** CI e2e job; Data & Analytics content.

## 2026-11-21 — QA #105: German answer-length cues removed

**Done**
- Rewrote German distractors (de text only, en/flags unchanged) in 24 competencies; `validate:content` shows no `(de)` length warning anymore (0 errors). Roadmap length batches ticked.

**Reviewer to-dos:** skim German wording of lengthened distractors (done by subagents, not human-reviewed).

**Next:** #106 non-Wikipedia resources for 8 published competencies; then Data & Analytics content.

## 2026-11-20 — QA issues closed; Data & Analytics framework

**Done**
- Closed qa issues #53, #54, #55, #56, #58 (already fixed by merged PRs #60–#65). #57 (nit) stays open.
- Role `data-analytics` (status `draft`): 10 role-specific competencies + 6 core, en/de texts, ESCO refs.
- Stale branch `claude/admiring-mayer-dn6uyq` is superseded by merged PRs; owner may delete it.

**Next:** Data & Analytics content batches 1–3, then publish and quality pass.

## 2026-11-18 — Phase 4: Procurement content batch 4 (supply-chain-risk-sustainability), Procurement published; run summary

**Done**
- 4 unit files (2 en + 2 de, `status: ai-draft`, foundation and practitioner = required levels), invented example labelled (arithmetic: 36,000 € × 4 % = 1,440 €; 3 days × 30,000 € = 90,000 €). 12 items (4 per level, 5 multi).
- 4 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): Wikipedia supply chain risk management (en) and Lieferkettensorgfaltspflichtengesetz (de) (CC BY-SA); EUR-Lex Directive (EU) 2024/1760 en/de (free-access). ESCO refs added: corporate social responsibility, supply chain management; strategic-sourcing got "analyse supply chain strategies" (fits reasonably, not exactly), which clears the earlier warning.
- Quality pass: every Procurement competency has a non-Wikipedia and a German-language resource. Procurement & Supply Chain set to `status: published`; `docs/FRAMEWORK.md` regenerated. Validator: 0 errors, 0 warnings.
- Run summary (this evening): Marketing (batches 3-4) and Customer Service (framework + 4 batches) and Project Management (framework + 4 batches) and Procurement (framework + 4 batches) done and published; 14 PRs merged. Older open QA issues #53/#55/#56/#57 were not re-worked (#54, #58 already fixed by PRs #60/#61); #56 (Wikipedia-heavy resources) still applies, since gesetze-im-internet.de, BME and similar German sites are often unreachable from this environment.

**Reviewer to-dos**
- Legal wording rests on the Wikipedia LkSG article and only the title/status line of Directive 2024/1760; units state that the laws exist, that scope has been changing, and to ask Legal/Compliance, with no thresholds or duties. Confirm that is acceptable; add a primary LkSG link when reachable.
- Check practitioner example arithmetic; deliberately long distractors' wording; German wording of the 2 DE units.

**Counts:** roles 9 (0 draft) · competencies 88 · units 496 · items 1060 · resources 497

**Next:** Data & Analytics role framework (Phase 4).

## 2026-11-18 — Phase 4: Procurement content batch 3 (inventory-warehouse-management, logistics-transport-planning, supply-chain-planning-demand)

**Done**
- 14 unit files (7 en + 7 de, `status: ai-draft`): inventory at all three levels, logistics and planning at foundation/practitioner (role targets). Formulas, checklists and thresholds labelled "our own"; EOQ described in words only; Incoterms named at topic level; examples invented and labelled.
- 36 items (12 per competency, 4 per level, 1-2 multi per level).
- 19 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 13 Wikipedia (en/de, CC BY-SA), OpenStax Introduction to Business 10.4, and HGB §240 and §407 on gesetze-im-internet.de (`free-access`, licence terms not assessed). 5 existing resources re-tagged.
- Role stays `status: draft`; the missing-ESCO warning on strategic-sourcing remains.

**Reviewer to-dos**
- Facts rest on page intros: Incoterms, bill of lading, EOQ, S&OP (en Wikipedia). The bullwhip "price fluctuations" cause comes from a truncated passage on the German page and its wording was inferred.
- German Meldebestand/Sicherheitsbestand/Lagerhaltung pages have a redundancy banner and were not used.
- Supply-chain planning has no German non-Wikipedia source; 3 EN-only distractors were padded to defeat the longest-option check; German wording of the 7 DE units.

**Counts:** roles 9 (1 draft) · competencies 88 · units 492 · items 1048 · resources 493

**Next:** Procurement content: supply-chain-risk-sustainability; then publish and quality pass.

## 2026-11-18 — Phase 4: Procurement content batch 2 (tendering-rfx-contracting, negotiation-supplier-relationships, purchase-order-invoice-management)

**Done**
- 16 unit files (8 en + 8 de, `status: ai-draft`): tendering at foundation/practitioner, negotiation and PO/invoice at all three levels (role targets). Own methods (three-way match, tolerance/KPI/escalation rules) labelled "our own"; examples and figures (incl. 6% interest rate) invented and labelled; arithmetic hand-checked. No thresholds or section numbers in the units.
- 36 items (12 per competency, 4 per level, 3 multi each); longest-option check clean.
- 14 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 11 Wikipedia (en RFP, en Tendering, 9 de; CC BY-SA), EUR-Lex Directive 2014/24/EU en/de (free-access), OpenStax Organizational Behavior 14.3 and Financial Accounting 8.2 (CC BY-NC-SA). 14 existing resources re-tagged (plus one unrequested tag on an internal-controls resource).
- Role stays `status: draft`; the missing-ESCO warning on strategic-sourcing remains.

**Reviewer to-dos**
- German EUR-Lex text: only the most-economically-advantageous-tender recital checked in German; equal treatment, procedure choice, life-cycle costing rest on the English text.
- Own methods with no source read: three-way match definition, tolerance, KPI and escalation rules. Check against pages: Harvard principles/BATNA (de), OpenStax OB 14.3/14.4, Skonto and Zahlungsbedingungen wording, Bestellung as an offer, Kaufvertrag formfree (intros only read).
- Judgement items: tr-a-keep, tr-a-tie. German wording of the 8 DE units.
- OpenStax Business Law contract chapters are US-law only and were skipped.

**Counts:** roles 9 (1 draft) · competencies 88 · units 478 · items 1012 · resources 474

**Next:** Procurement content: inventory-warehouse-management, logistics-transport-planning, supply-chain-planning-demand.

## 2026-11-18 — Phase 4: Procurement content batch 1 (procurement-fundamentals-p2p, strategic-sourcing-category-management, supplier-selection-evaluation)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`), all three levels. Own methods (seven-step purchase-to-pay cycle, three-way match, invoice-exception rules, ABC limits, scorecard KPI definitions, escalation ladder) labelled "our own"; examples invented and labelled, arithmetic hand-checked.
- 36 items (12 per competency, 4 per level, 3 multi each); correct option uniquely longest in at most 4 of 9 singles.
- 12 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 10 Wikipedia (CC BY-SA; 7 German), OpenStax Introduction to Business 12.4 (CC BY) and Managerial Accounting 10.3 (CC BY-NC-SA). 5 existing resources re-tagged.
- Role stays `status: draft`. No fitting verified ESCO skill for strategic-sourcing-category-management, so that validator warning remains.

**Reviewer to-dos**
- Check against sources: direct/indirect spend (en Procurement); Kraljič four fields (de page reads like machine translation); de Lieferantenbewertung criteria and ppm; B2B buying stages and rebuy types; make-or-buy factors. No source was read for three-way matching.
- Supplier advanced unit mentions the Lieferkettensorgfaltspflichtengesetz and says to ask legal counsel. German wording of the 9 DE units.
- BME, BMWK and gesetze-im-internet were unreachable, so German-language resources are de.Wikipedia only (see QA #56).

**Counts:** roles 9 (1 draft) · competencies 88 · units 462 · items 976 · resources 462

**Next:** Procurement content: tendering-rfx-contracting, negotiation-supplier-relationships, purchase-order-invoice-management.

## 2026-11-18 — Phase 4: Procurement & Supply Chain framework (draft, no content yet)

**Done**
- `src/content/roles/procurement-supply-chain.yaml` (`status: draft`, en/de) with 10 role competencies plus the 6 core-track ones; 10 new competency files (en/de, `track: role`, acyclic prerequisites on existing ids). Negotiation does not reuse the sales-only objection-handling competency.
- 18 ESCO refs verified against the ESCO API (HTTP 200, label equals stored label); `strategic-sourcing-category-management` has no ESCO ref (no fitting skill found), which gives one validator warning. EU public procurement, Incoterms and supply-chain due diligence are at topic level only.
- `docs/FRAMEWORK.md` regenerated; decision logged. lint, typecheck, tests, validate:content (0 errors; draft-role and missing-ESCO warnings) and build pass.

**Counts:** roles 9 (1 draft) · competencies 88 · units 444 · items 940 · resources 450

**Next:** Procurement content in batches of 3 competencies, then publish.

## 2026-11-18 — Phase 4: Project Management content batch 4 (project-closure-lessons-learned), Project Management published

**Done**
- 4 unit files (2 en + 2 de, `status: ai-draft`, foundation and practitioner = required levels); own methods (90-minute agenda, "five questions", ERP example) labelled/invented. 12 items (4 per level, 3 multi).
- 5 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): en/de Wikipedia Lessons learned, en After-action review, de Projektabschluss (CC BY-SA), Wikibooks PMBOK Integration Management (CC BY-SA, linked only).
- Quality pass: every Project Management competency has a non-Wikipedia and a German-language resource. Project Management set to `status: published`; `docs/FRAMEWORK.md` regenerated. Validator: 0 errors, 0 warnings.
- Open QA issues #53/#55/#56/#57 (older, broad) were not re-worked this run; #54 and #58 were already fixed by merged PRs.

**Reviewer to-dos**
- Check against `sources[]`: NASA/OECD lesson definitions, after-action review points (intended vs actual, no blame), de Projektabschluss steps.
- The only non-Wikipedia source for closure is a 2018 PMBOK-vocabulary Wikibooks page (OpenStax has no closure page). Item `pcl-a-timing` is judgement. German wording of the 2 DE units; en distractors were adjusted for the length check.

**Counts:** roles 8 (0 draft) · competencies 78 · units 444 · items 940 · resources 450

**Next:** Procurement & Supply Chain role framework (Phase 4).

## 2026-11-18 — Phase 4: Project Management content batch 3 (resource-team-coordination, agile-hybrid-delivery, quality-change-management)

**Done**
- 14 unit files (7 en + 7 de, `status: ai-draft`): team coordination at all three levels, agile and quality at foundation/practitioner (role targets). Own methods labelled "our own"; examples invented and labelled.
- 36 items (12 per competency, 4 per level, multi mixed in); longest-option check clean.
- 16 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 5 OpenStax pages (4 CC BY-NC-SA, Introduction to Business 10.6 CC BY) and 11 Wikipedia (en/de). 3 existing resources re-tagged. Pages with maintenance banners or disambiguation were dropped.
- Role stays `status: draft`.

**Reviewer to-dos**
- Check facts against `sources[]`: Tuckman stages and regression, resource leveling, Scrum sprint rules, QA vs QC, six-step change control, change requests in contracts, OpenStax 17.8.
- Item `ahd-a-lead` (eight-week lead time) and the quality "late inspection" explanation are own reasoning. Only the introductions of the Wikipedia articles were read.
- agilemanifesto.org and scrumguides.org were unreachable, so neither is cited; no non-Wikipedia agile source except OpenStax 17.8 as background.
- German wording of the 7 DE units.

**Counts:** roles 8 (1 draft) · competencies 78 · units 440 · items 928 · resources 445

**Next:** Project Management content: project-closure-lessons-learned; then publish and quality pass.

## 2026-11-18 — Phase 4: Project Management content batch 2 (project-budget-cost-control, risk-issue-management, stakeholder-management-communication)

**Done**
- 16 unit files (8 en + 8 de, `status: ai-draft`): budget at foundation/practitioner, risk and stakeholder at all three levels. Methodology-neutral; own methods labelled "our own"; examples invented and labelled; CV/SV/CPI formulas and figures are our own and hand-checked.
- 36 items (12 per competency, 3 multi per file); the longest-option check is clean.
- 15 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 6 OpenStax CC BY-NC-SA pages (Managerial Accounting 7.1, 7.5; Principles of Management 2.4, 16.1; Organizational Behavior 14.4; Business Ethics 3.2) and 9 Wikipedia pages (6 German). 4 existing resources re-tagged.
- Role stays `status: draft`.

**Reviewer to-dos**
- DIN 69901 wording and earned-value terms against de.wikipedia Projektcontrolling; risk-register facts (NCVO impact-weighting remark, Toyota criticism) from Wikipedia only; stakeholder salience types from en.wikipedia (German terms "schlafend", "fordernd", "nachrangig").
- No primary standard (ISO 31000, DIN 69901) was read; OpenStax pages are general and only partly read (OB 14.4 up to the influence stage).
- Judgement items: pbc-a-sunk, pbc-a-favourable, rim-a-aggregate, rim-a-commit, smc-a-claims, smc-a-culture. German wording of the 8 DE units.

**Counts:** roles 8 (1 draft) · competencies 78 · units 426 · items 892 · resources 429

**Next:** Project Management content: resource-team-coordination, agile-hybrid-delivery, quality-change-management.

## 2026-11-18 — Phase 4: Project Management content batch 1 (project-initiation-business-case, scope-requirements-management, work-breakdown-scheduling)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`), all three levels; methodology-neutral, own methods (one-page business case, feasibility checks, requirement format, change-request steps, buffer and re-plan rules, one-to-two-week work-package size) labelled "our own"; all figures in examples invented and labelled.
- 36 items (12 per competency, 4 per level, 6 multi-select in total per file at most; correct option uniquely longest in at most 4 of 9 singles).
- 22 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): 17 Wikipedia (12 German, CC BY-SA), OpenStax Principles of Management 17.2 and 17.4 (CC BY-NC-SA), 2 Wikibooks PMBOK Scope/Time pages (CC BY-SA, linked only, nothing copied).
- Role stays `status: draft`.

**Reviewer to-dos**
- Spot-check: PERT "late 1950s" origin, Bundeshaushaltsordnung §7 mention, MoSCoW "Won't have" wording.
- OpenStax has no project-management chapter, so it only supports the initiation units; German resources are all de.Wikipedia (CIO Bund, German Wikibooks, OpenLearn unreachable). Preferred open sources are thin here (see QA #56).
- German wording of the 9 DE units; en distractors were lengthened to satisfy the length validator.

**Counts:** roles 8 (1 draft) · competencies 78 · units 410 · items 856 · resources 414

**Next:** Project Management content: project-budget-cost-control, risk-issue-management, stakeholder-management-communication.

## 2026-11-18 — Phase 4: Project Management framework (draft, no content yet)

**Done**
- `src/content/roles/project-management.yaml` (`status: draft`, en/de) with 10 role competencies plus the 6 core-track ones; 10 new competency files (en/de, `track: role`, acyclic prerequisites chaining from `self-organisation-project-basics`). Descriptions are original and methodology-neutral (no PMBOK/PRINCE2 text).
- 16 ESCO refs verified against the ESCO API (HTTP 200, label equals stored label); no DigComp refs.
- `docs/FRAMEWORK.md` regenerated; decision logged. lint, typecheck, tests, validate:content (0 errors; draft-role warning) and build pass.

**Counts:** roles 8 (1 draft) · competencies 78 · units 392 · items 820 · resources 392

**Next:** Project Management content in batches of 3 competencies, then publish.

## 2026-11-18 — Phase 4: Customer Service content batch 4 (consumer-rights-basics), Customer Service published

**Done**
- 4 unit files (2 en + 2 de, `status: ai-draft`, foundation and practitioner = the required levels), EU/Germany labelled, topic level; invented example labelled. 12 items (4 per level, 3 multi).
- 4 new link-only EUR-Lex resources (free-access, `licenseVerifiedOn: 2026-11-18`, HTTP 200): Consumer Rights Directive 2011/83/EU and Directive (EU) 2019/771, en and de.
- Quality pass: every Customer Service competency has a non-Wikipedia and a German-language resource; Customer Service set to `status: published`; `docs/FRAMEWORK.md` regenerated. Validator: 0 errors, 0 warnings.
- Open QA issues #53/#55/#56/#57 (older, broad) were not re-worked this run; #54 and #58 were already fixed by merged PRs.

**Reviewer to-dos**
- Check units against EUR-Lex: CRD Art. 6(1), 9-14, 16; Directive 2019/771 Art. 2, 3, 10-14, 17 (13(4)(c) was cut off in reading, so only (a) and (b) are cited).
- "Gewährleistung"/"Garantie" are labelled as German terms; the directives say "Vertragswidrigkeit"/"gewerbliche Garantie".
- gesetze-im-internet.de unreachable: units give no BGB sections or national deadlines and say "ask legal counsel". UCPD not cited.
- Judgement items: crb-a-late, crb-a-old, crb-a-ad. German wording of the DE units.

**Counts:** roles 7 (0 draft) · competencies 68 · units 392 · items 820 · resources 392

**Next:** Project Management role framework (Phase 4).

## 2026-11-18 — Phase 4: Customer Service content batch 3 (service-level-quality-management, customer-data-privacy-service, customer-retention-feedback-voc)

**Done**
- 14 unit files (7 en + 7 de, `status: ai-draft`): SLQM and retention at foundation/practitioner, privacy at all three levels (role targets). Own methods (first-contact resolution definition, scorecard and coaching, five-fact breach note, proportionate identity checks, theme tagging, insight note) labelled "our own"; examples invented and labelled.
- 36 items (12 per competency, 3 multi each).
- 4 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): OpenStax Marketing 2.4 (CC BY-NC-SA), en/de Wikipedia Net Promoter Score (CC BY-SA), EUR-Lex GDPR German text (free-access). 13 existing resources re-tagged.
- Role stays `status: draft`. Privacy units at topic level (GDPR Art. 5, 12, 15, 17, 21, 25, 28, 33, 34) and point to the data protection officer; national rules and call-recording legality are left to the DPO.

**Reviewer to-dos**
- GDPR: Art. 5(1) and Art. 12 checked against EUR-Lex; Art. 25, 28, 34 read only briefly.
- NPS definition (promoters 9-10, detractors 0-6) rests on Wikipedia (citation-needed tags, no banner).
- German wording and gender-inclusive phrasing of the 7 DE units; check "our own" methods read as such.

**Counts:** roles 7 (1 draft) · competencies 68 · units 388 · items 808 · resources 388

**Next:** Customer Service content: consumer-rights-basics; then publish and quality pass.

## 2026-11-18 — Phase 4: Customer Service content batch 2 (complaint-handling-de-escalation, omnichannel-support, ticketing-knowledge-base)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`), all three levels; own methods (4-step reply, 3-part reply, channel routing criteria, ticket fields/statuses, 4-line case notes, article template, knowledge lifecycle) labelled "our own". Customer-facing example dialogues use "Sie" deliberately (company voice).
- 36 items (12 per competency, 3 multi each); correct option uniquely longest in at most 4 of 9 singles.
- 4 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): de.wikipedia Beschwerdemanagement, Callcenter, Netiquette, Frequently Asked Questions (CC BY-SA). Existing OpenStax 1.6/11.3/13.2/16.2 and Wikipedia Deeskalation, SLA, Customer support re-tagged.
- Role stays `status: draft`. Legal points topic-level only.

**Reviewer to-dos**
- Check: complaint-management process and ISO 10002 mention; de-escalation techniques and conflict styles; Callcenter definitions; netiquette; FAQ origin; SLA contents; OpenStax CRM/social statements.
- Ticket fields, statuses and the omnichannel definition are own/common practice (Wikipedia pages with maintenance banners were skipped). Escalation thresholds rest on en Customer support ("needs citations" banner). Response-time targets in examples are invented.
- Judgement items: chd-a-goodwill, chd-a-escalate, oc-a-route, oc-a-staff, tkb-a-lifecycle, tkb-a-gaming. German wording of the 9 DE units.

**Counts:** roles 7 (1 draft) · competencies 68 · units 374 · items 772 · resources 384

**Next:** Customer Service content: service-level-quality-management, customer-data-privacy-service, customer-retention-feedback-voc.

## 2026-11-18 — Phase 4: Customer Service content batch 1 (fundamentals, communication-empathy, needs-problem-solving)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`), all three levels; own methods (first-contact resolution definition, 4 habits, 5-step cycle, handover template, empowerment limits, follow-up) labelled "our own". Identical headings/list counts en/de.
- 36 items (12 per competency, 3 multi each).
- 9 new link-only resources (`licenseVerifiedOn: 2026-11-18`, HTTP 200): OpenStax Marketing 11.2, 11.3, 13.2 (CC BY-NC-SA); en Customer service; de Kundendienst, Kundenzufriedenheit, Vier-Seiten-Modell, Problemlösen (CC BY-SA). Four existing Wikipedia resources re-tagged. Every competency has an OpenStax and a German-language resource.
- Customer Service stays `status: draft`. No legal sources used ("ask legal counsel").

**Reviewer to-dos**
- OpenStax 11.2 (service-profit chain, empowerment, services triangle), 11.3 (five gaps, RATER), 13.2 (communication, noise, feedback).
- Wikipedia-only claims: Rogers' attitudes, echo vs paraphrase, four sides of a message, problem-solving gap; "escalation at defined thresholds" seen only as a search snippet of en Customer_support.
- German RATER terms ("Souveränität", "Reaktionsfähigkeit") are own translations; German wording of the 9 DE units.
- Judgement items: csf-a-empower, csf-a-causes, cce-a-first, cce-a-close, cnp-a-limit, cnp-a-goodwill.

**Counts:** roles 7 (1 draft) · competencies 68 · units 356 · items 736 · resources 380

**Next:** Customer Service content: complaint-handling-de-escalation, omnichannel-support, ticketing-knowledge-base.

## 2026-11-18 — Phase 4: Customer Service framework (draft, no content yet)

**Done**
- `src/content/roles/customer-service.yaml` (`status: draft`, en/de) with 10 role competencies plus the 6 core-track ones; 10 new competency files (en/de, `track: role`, acyclic prerequisites on existing ids). `active-listening-empathy` merged into `customer-communication-empathy` (overlap with core communication-collaboration).
- 19 ESCO refs verified against the ESCO API (HTTP 200, label equals stored label); no DigComp refs. Privacy and consumer-rights competencies are labelled EU/Germany, topic level only.
- `docs/FRAMEWORK.md` regenerated. lint, typecheck, tests, validate:content (0 errors; draft-role warning) and build pass.

**Counts:** roles 7 (1 draft) · competencies 68 · units 338 · items 700 · resources 372

**Next:** Customer Service content in batches of 3 competencies, then publish.

## 2026-11-18 — Phase 4: Marketing content batch 4 (marketing-analytics-attribution), Marketing published

**Done**
- 6 unit files (3 en + 3 de, `status: ai-draft`): KPIs vs vanity metrics, funnel/conversion, attribution models and limits, holdout/incrementality (own method, labelled), consent-aware measurement at topic level. 12 items (4 per level, 3 multi).
- 2 new resources (link-only, `licenseVerifiedOn: 2026-11-18`, HTTP 200): EDPB Guidelines 05/2020 on consent (German PDF, free-access), de.wikipedia Konversion (Marketing). OpenStax 16.3 and GDPR re-tagged.
- Quality pass: every Marketing competency has a non-Wikipedia and a German-language resource. Marketing set to `status: published`; `docs/FRAMEWORK.md` regenerated. Validator: 0 errors, 0 warnings.
- Subagent saw one unexplained test failure on a first chained run, then 109/109 on four reruns (possibly flaky).
- Open QA issues #53/#55/#56/#57 (older, broad) not re-worked this run.

**Reviewer to-dos**
- OpenStax 16.3 metric definitions; EDPB consent statements (freely given, specific, informed, unambiguous; no pre-ticked boxes; withdrawal as easy as giving); German wording of the 3 DE units.
- UTM is concept-level and unsourced (common practice); cookie/ePrivacy device-access rules are "ask legal counsel".
- Own methods ("if doubled" KPI test, UTM naming rules, holdout design, report rules). Judgement items: maa-p-report, maa-a-report, maa-a-consent.

**Counts:** roles 6 (0 draft) · competencies 58 · units 338 · items 700 · resources 372

**Next:** Customer Service role framework (Phase 4).

## 2026-11-18 — Phase 4: Marketing content batch 3 (social-media-community, email-marketing-automation, campaign-planning-budgeting)

**Done**
- 14 unit files (7 en + 7 de, `status: ai-draft`): social and campaign at foundation/practitioner, email at all three levels (role targets). Own methods (reply protocol, holdout group, flow spec, agency brief, phased budget) labelled as such. Worked examples are invented illustrations.
- 36 items, 12 per competency (4 per level, 3 multi per competency); correct option uniquely longest in at most 4 of 9 single items.
- 5 new resources (`mode: link`, `licenseVerifiedOn: 2026-11-18`, HTTP 200): OpenStax 16.2 (CC BY-NC-SA), EUR-Lex ePrivacy 2002/58 en/de (free-access), de.wikipedia Opt-in and Social Media Marketing. Existing OpenStax 2.3/13.3/16.3, Budgetierung, GDPR, UCPD re-tagged.
- Marketing stays `status: draft`. QA issues: #54 and #58 were already fixed by merged PRs #60/#61; #53/#55/#56/#57 are older broad findings, not re-worked this run.

**Reviewer to-dos**
- de Opt-in claims (double opt-in not mandatory but expected by courts; BGH as proof; consent not resellable) and the fake-followers statement come from Wikipedia only.
- Check ePrivacy Art. 13(1),(2),(4),(5), GDPR Art. 5, 7(3), 21(2)-(3), UCPD Annex I point 11 and Art. 7.
- UWG is cited via Wikipedia only (gesetze-im-internet.de unreachable); units say "ask legal counsel".
- Items em-a-stop and cp-a-over cite sources for own-method points. Judgement items: sm-p-influ, sm-a-report, sm-a-imprint, em-p-exception, cp-a-over, cp-a-dep.
- German wording of the 7 DE units.

**Counts:** roles 6 (1 draft) · competencies 58 · units 332 · items 688 · resources 370

**Next:** Marketing content: marketing-analytics-attribution; then publish Marketing and run the quality pass.

## 2026-11-17 — Phase 4: Marketing content batch 2 (brand-messaging, content-marketing-copywriting, digital-channels-seo-sem)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`): the three competencies at foundation, practitioner and advanced (all targets require advanced). Original text, worked example labelled as invented illustration, key takeaways, `sources[]`. Own working methods (message hierarchy, funnel mapping, intent types, "remove the brand name" test, claims register) are labelled as such in the text. SEO is kept to stable principles (relevance, crawlability, intent); no ranking-factor claims.
- 36 items, 12 per competency (4 per level; multi-select: 4 brand, 3 content, 3 digital); distractors written as plausible misconceptions; no `uniquely longest` warning.
- 7 new resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`, HTTP 200): OpenStax Principles of Marketing 9.5, 9.6, 13.3, 16.3 (CC BY-NC-SA); Wikipedia en Brand, de Content-Marketing, de Suchmaschinenoptimierung (CC BY-SA footer checked). Re-tagged existing: EUR-Lex UCPD en/de (brand-messaging, content-marketing-copywriting), EUR-Lex GDPR (digital-channels-seo-sem), de Positionierung (brand-messaging). Every competency has an OpenStax or EUR-Lex (non-Wikipedia) and a German-language resource.
- Marketing stays `status: draft`.

**Reviewer to-dos**
- Check OpenStax claims: 9.5 (brand definition, Keller's four levels, positioning bases, name criteria), 9.6 (page only opened, loyalty/metrics not used in detail), 13.3 (IMC), 16.3 (traffic sources, paid/organic search, conversions, bounce rate; the page's "40 percent" target was deliberately not used).
- Check UCPD statements: Annex I point 11 (advertorial) and Art. 7(2) (commercial intent) were read on EUR-Lex; Art. 6 is cited only generally. The German UWG could not be fetched; units refer to it only via the German Wikipedia Content-Marketing article and say "ask legal counsel".
- The SEO units rely on the German Wikipedia SEO article (crawler/indexer, SEM as superset, on-/off-page, search-engine spamming, markets differ). The on-/off-page definitions in the practitioner unit paraphrase the section structure; verify. Google's own SEO guide could not be reached through the proxy, so no vendor source is cited.
- GDPR Art. 5 principles used at topic level in the digital units (lawfulness, purpose limitation, data minimisation); no ePrivacy/cookie-law detail written.
- Judgement items worth a second opinion: bm-a-claims, cm-a-disclose, cm-a-test, dc-a-attrib, dc-a-mix.
- German wording of all 9 DE units (du-form, gender-inclusive where natural).

**Counts:** roles 6 (1 draft) · competencies 58 · units 318 · items 652 · resources 365

**Next:** Marketing content: social-media-community, email-marketing-automation, campaign-planning-budgeting.

## 2026-11-17 — Phase 4: Marketing content batch 1 (fundamentals-strategy, market-customer-research, segmentation-targeting-positioning)

**Done**
- 18 unit files (9 en + 9 de, `status: ai-draft`): the three competencies at foundation, practitioner and advanced (all three role targets require advanced). Original text, worked example labelled as invented illustration, key takeaways, `sources[]`, EU/Germany context labelled (GDPR Art. 5(1) principles only at topic level in the research units; no invented laws or figures).
- 37 items: marketing-fundamentals-strategy 13, market-customer-research 12, segmentation-targeting-positioning 12 (4 per level, 5 at advanced for fundamentals; 5 multi-select items in total; distractors written as plausible misconceptions, no `uniquely longest` warning).
- 22 new resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`, HTTP 200 checked): 9 OpenStax Principles of Marketing chapters (1.2, 2.2, 2.3, 5.1, 5.4, 5.5, 5.6, 6.2, 6.3; CC BY-NC-SA, link only; URLs from the TOC embedded in the openstax.org page) and 13 Wikipedia pages (8 en, 5 de, CC BY-SA footer checked, no "insufficiently sourced" banner). Existing OpenStax 1.5 and the EUR-Lex GDPR resource now also tagged for market-customer-research. Every competency has OpenStax (non-Wikipedia) and German-language Wikipedia resources.
- Marketing stays `status: draft`. Checks: lint, typecheck, tests, validate:content (0 errors; only the draft-role warning), build pass.

**Reviewer to-dos**
- Check OpenStax claims against the chapters: 1.2 (4Ps), 2.2 (SWOT, SBUs), 2.3 (no agreed plan structure, 12 elements), 5.4 (ADAMS), 5.5 (four target strategies, personas), 5.6 (head-to-head vs differentiation, statements), 6.3 (primary/secondary, four research types).
- Wikipedia claims are general (survey methodology, persona origin in UX, SWOT); spot-check them and the German Marktforschung and Marketingstrategie wording used in the units.
- Judgement items worth a second opinion: mfs-a-coherence, mfs-a-units, mcr-a-causal, stp-a-veto, stp-a-micro, stp-p-statement (correct option is the longest there).
- The units mention the OpenStax chapter 2.4 (metrics) and 5.7 (ethics) by title only; not read in full. No resource entries for them yet.
- German wording of all 9 DE units (du-form, gender-inclusive where natural).

**Counts:** roles 6 (1 draft) · competencies 58 · units 300 · items 615 · resources 358

**Next:** Marketing content: brand-messaging, content-marketing-copywriting, digital-channels-seo-sem.

## 2026-11-17 — Phase 4: Marketing framework (draft, no content yet)

**Done**
- `src/content/roles/marketing.yaml` (`status: draft`, en/de) with 10 role competencies plus the 6 core-track ones; 10 new `src/content/competencies/*.yaml` (en/de, `track: role`, prerequisites acyclic, existing ids only). Campaign-planning-budgeting starts at practitioner/foundation; social media caps at practitioner.
- 19 ESCO refs, each verified against the ESCO API (HTTP 200, preferred label equals stored label); no DigComp refs. Email-marketing consent (GDPR/ePrivacy/UWG) described at topic level only.
- `docs/FRAMEWORK.md` regenerated. lint, typecheck, tests, validate:content (0 errors; draft-role warning as designed) and build pass.

**Counts:** roles 6 (1 draft) · competencies 58 · units 282 · items 578 · resources 336

**Next:** this run's window ends here; Marketing content in batches of 3 competencies (see ROADMAP), then publish.

## 2026-11-17 — Phase 4: Sales content batch 4 (sales-ethics-compliance), quality pass, Sales published

**Done**
- 6 unit files (3 en + 3 de, `status: ai-draft`, EU/Germany labelled, worked example, takeaways, `sources[]`): sales-ethics-compliance at foundation/practitioner/advanced. 13 items (4 foundation, 5 practitioner, 4 advanced; one multi), distractors as plausible misconceptions, no `uniquely longest` warning.
- 6 new ethics/pricing resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`, HTTP 200 checked): EUR-Lex Directive 2005/29/EC (en and de, free-access), OpenStax 4.5 Ethical Issues in B2B Marketing and 12.3 Pricing Policy (CC BY-NC-SA), German Wikipedia UWG and Korruption (CC BY-SA). Existing GDPR and OpenStax 15.4 resources now also tagged for the ethics competency.
- Legal statements: only EUR-Lex texts actually read via curl: UCPD Art. 3, 5-9 and Annex I points 5-7, GDPR Art. 21(2)-(4) (Art. 15 only as right named). gesetze-im-internet.de (UWG, StGB) was still unreachable via the proxy, so the UWG and German criminal-law bribery offences are mentioned at topic level only, citing the German Wikipedia overviews; no section numbers stated in learner-facing text. The UCPD applies to consumers only, which units and items say.
- Quality pass Sales: the OpenStax pricing chapter was found via the page's embedded TOC (12.3) and added to both proposals units, so every Sales competency now has a non-Wikipedia resource. German-language resources added where the German units had none (Wikipedia de: Customer-Relationship-Management, Kundenbindung, Verhandlung, Verkaufsgespräch; all CC BY-SA footer verified) for solution-presentation-demo, closing foundation, objection-handling foundation, account-management and CRM units.
- Reviewer-flagged items rewritten with plausible misconceptions (en+de): crm-p-error, crm-f-notes, crm-p-weight, dna-p-impact, dna-a-conflict, spp-a-standard.
- Sales set to `status: published`; `validate:content` passes with 0 errors and 0 warnings with coverage rules enforced. `docs/FRAMEWORK.md` regenerated.
- Checks: lint, typecheck, tests, validate:content, build all pass.

**Reviewer to-dos**
- Check the UCPD summaries against Art. 5-9 / Annex I and the German wording of the DE units.
- Confirm items sec-a-pilot and sec-a-claim have exactly one defensible best answer (judgement items).
- When gesetze-im-internet.de is reachable, add UWG sections and the business-dealing bribery offence from the primary source.
- Sanity-check difficulty ordering of the new items.

**Counts:** roles 5 (0 draft) · competencies 48 · units 282 · items 578 · resources 336

**Next:** next unchecked Phase 4 role in `docs/ROADMAP.md`.

## 2026-11-17 — Phase 4: Sales content batch 3 (closing-contract-handover, account-management-upselling, crm-sales-data-forecasting)

**Done**
- 14 unit files (7 en + 7 de, `status: ai-draft`, original text with worked example, takeaways, `sources[]`): closing-contract-handover at foundation/practitioner/advanced; account-management-upselling and crm-sales-data-forecasting at foundation/practitioner only (role targets stop there). 36 items (12 per competency, 4 per level for closing, 6 per level for the other two; single and multi, difficulty per section 7.2, no `uniquely longest` warning, distractors written as plausible misconceptions).
- 10 new resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`, HTTP 200 checked): OpenStax Principles of Marketing 1.6 (CRM) and 15.4 (sales force management), both CC BY-NC-SA (link only); Wikipedia pages on contract (en, de Vertrag), CRM, sales operations, upselling, cross-selling, customer retention. Existing `openstax-marketing-selling-process`, `wikipedia-forecasting` and the EUR-Lex GDPR resource now also tagged for the new competencies.
- Legal statements: GDPR Art. 5(1) principles (read on EUR-Lex via curl; Art. 15 and 17 only as rights named at topic level). Contract law stays at topic level (EU/Germany labelled, referred to legal teams); no paragraphs, deadlines or rates stated. Numbers in worked examples are invented and labelled.
- Open limitation: German CRM and Key-Account Wikipedia pages are flagged as poorly sourced, so they were not used; German units rely on the English resources plus de Vertrag. Sales role stays `status: draft`.
- Checks: lint, typecheck, tests, validate:content (0 errors), build.

**Counts:** roles 5 (1 draft) · competencies 48 · units 276 · items 565 · resources 326

**Next:** Sales content: sales-ethics-compliance; then publish the role and run the content quality pass for Sales.

## 2026-11-17 — Phase 4: Sales content batch 2 (solution-presentation-demo, objection-handling-negotiation, proposals-quoting-pricing-basics)

**Done**
- 16 unit files (8 en + 8 de, `status: ai-draft`, original text with worked example, takeaways, `sources[]`): foundation/practitioner/advanced for presentation and negotiation; foundation/practitioner only for proposals-quoting-pricing-basics (role targets stop at practitioner). 37 items (12 + 12 + 13), single and multi, difficulty per section 7.2, no `uniquely longest` warning, distractors written as plausible misconceptions.
- 8 new resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`, HTTP 200 checked): Wikipedia pages on negotiation, BATNA, product demonstration, value-based pricing, cost-plus pricing, request for quotation, plus German Harvard-Konzept and Preispolitik. `openstax-marketing-selling-process` (15.3, CC BY-NC-SA, link) now also tagged for the two new competencies.
- Pricing is at topic level only: VAT is mentioned as a separate quote line with rate and mandatory details deferred to finance/legal; no rates, paragraphs or deadlines. Numbers in examples are invented and labelled.
- Open limitation: the OpenStax pricing chapter pages could not be resolved (404 on guessed URLs), so pricing has no non-Wikipedia resource. Sales role stays `status: draft`.
- Checks: lint, typecheck, tests (109), validate:content (0 errors), build all pass.

**Counts:** roles 5 (1 draft) · competencies 48 · units 262 · items 529 · resources 317 · tests 109

**Next:** Sales content batch 3 (closing-contract-handover, account-management-upselling, crm-sales-data-forecasting).

## 2026-11-17 — Phase 4: Sales content batch 1 (sales-process-pipeline, prospecting-lead-qualification, discovery-needs-analysis)

**Done**
- 3 competencies x 3 levels, en and de: 18 unit files (`status: ai-draft`, original text with worked example and takeaways, `sources[]`), 36 items (12 per competency, 4 per level, single and multi, difficulty per section 7.2, correct option position varied, no `uniquely longest` warning), 12 new resources (all `mode: link`, `licenseVerifiedOn: 2026-11-17`).
- Non-Wikipedia resources: OpenStax Principles of Marketing (15.3, 1.5, 4.4; CC BY-NC-SA, link only) and the GDPR text on EUR-Lex (`free-access`, link only; Art. 21(2)-(4) and recital 47 read on the page). Existing active-listening resources (en/de) now also tagged `discovery-needs-analysis`.
- Legal statements: only GDPR Art. 21 (cited from EUR-Lex). Germany's UWG rules on unsolicited advertising are only named and referred to legal advice because gesetze-im-internet.de was unreachable from the build proxy; no UWG details stated.
- Sales role stays `status: draft`. Checks: lint, typecheck, tests (109), validate:content (0 errors), build all pass.

**Counts:** roles 5 (1 draft) · competencies 48 · units 246 · items 492 · resources 309 · tests 109

**Next:** Sales content batch 2 (solution-presentation-demo, objection-handling-negotiation, proposals-quoting-pricing-basics).

## 2026-11-17 — Phase 4: Sales framework (draft, no content yet)

**Done**
- `src/content/roles/sales.yaml` (`status: draft`, en/de) with 10 role competencies plus the 6 core-track competencies; 10 new `src/content/competencies/*.yaml` (en/de, prerequisites acyclic, `track: role`). Targets progress foundation -> advanced; account-management and proposals/pricing start at practitioner/foundation.
- ESCO refs only where verified against the ESCO API (URI resolves, label matches); no DigComp refs added. Legal topics (UWG, consumer protection, GDPR contact data) described at topic level only.
- `docs/FRAMEWORK.md` regenerated. Validator: 0 errors; the draft role gives a warning (coverage not checked, hidden in UI) as designed.
- Merged two competencies planned separately (CRM data hygiene and forecasting/metrics) into `crm-sales-data-forecasting` to stay at 10.
- Roadmap: Brevo/spam-hint/magic-link line ticked (done in the auth UI; SMTP owner-managed).

**Counts:** roles 5 (1 draft) · competencies 48 · units 228 · items 456 · resources 297 · tests 109

**Next:** Sales content in batches of 3 competencies (see ROADMAP), then publish.

## 2026-11-17 — Phase 3b: Privacy policy for accounts (behind flag, off)

**Done**
- `src/components/pages/PrivacyAccounts.astro` (en/de): full account privacy text, rendered by `PrivacyPage.astro` only when `accountsEnabled` is true. Covers data processed (credentials/hash, optional profile, progress, item responses, completed units, session token and sync marker in localStorage, no cookies), purposes and legal bases (Art. 6(1)(b), 6(1)(f)), processors (Cloudflare, Supabase EU, Brevo), cautious transfer wording (Art. 44 ff.), retention, rights (Art. 15-21, 77) with in-app export/delete, no profiling/automated decisions/AI at runtime.
- Default build: privacy pages byte-identical to before (verified by diff); flag-on build shows the account sections. Home page privacy line has a flag-on variant (`home.privacyAccounts`) because "no account" would be wrong with accounts on.
- Imprint unchanged (see DECISIONS). `docs/LAUNCH.md`: new section "Before enabling accounts".
- Still a draft: a lawyer/DPO should review it (processor roles, DPAs, transfer mechanisms, email-log retention, whether the sign-up checkbox wording is right). Not verified against the real providers' current documents.

**Next:** Brevo/magic-link verification with the real project (owner), then Phase 4 roles.

## 2026-11-17 — Phase 3b: Dashboard sync (behind flag, off)

**Done**
- One storage path for all islands: `useProgress` -> `src/lib/progress-store.ts`. Anonymous (no stored session, or flag off): localStorage exactly as before, no network, no metadata. Signed in: localStorage is the cache, account rows (profile, progress, item_responses, completed_units) are read and merged on load, every change is written through (debounced, only changed rows upserted, never deletes). Wired into Dashboard (incl. review answers, import), MasteryCheck and Onboarding/placement.
- Pure logic with tests (`src/lib/progress-merge.ts`, `tests/progress-sync.test.ts`; tests now 109): merge policy (see DECISIONS), row diff, error classification, store controller with a fake account (offline, rejection, pending-after-reload, other-account cache, clear).
- Non-blocking status (en/de, `role=status`): synced / syncing / "will sync later" (offline) / "sync failed", with a retry button; retried automatically on `online`. Shown on dashboard, after the mastery check and after placement; hidden for anonymous learners.
- Default build unchanged: remote code sits behind the vite constant `__ACCOUNTS_ENABLED__` (no sync chunk, no supabase-js in `dist/`; default-build assertions pass).
- `tests-e2e/auth.e2e.mjs` extended (en + de, fake backend): anonymous dashboard/mastery make no Supabase request, signed-in dashboard loads remote progress, mastery check upserts, offline shows the status and falls back to the local copy then retries, server rejection shows "failed". All checks, `npm run e2e` and the auth e2e pass locally.
- **Not verified against a real Supabase project** (fake backend only; real PostgREST paging/row limits, upsert conflict behaviour and RLS are untested). Flag stays off; privacy policy not yet updated.
- Known limits: local-only progress is uploaded on the next change, not on sign-in (the account page's import offer remains); role switch keeps other competencies' progress from the account (union); `item_responses.correct` is still best effort; the dashboard reset only clears this browser.

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 297 · tests 109

**Next:** privacy policy and imprint for accounts, magic-link/spam notes (already in UI), then Phase 4 roles.

## 2026-11-17 — Phase 3b: Profile onboarding (behind flag, off)

**Done**
- Account island (`/account`, `/de/account`): after sign-in, if the account has no `profiles` row, a short skippable profile form is shown; afterwards a summary with "Edit profile". Fields (all optional): role family (select of published roles, passed from content), experience level (radio, same labels/hints as onboarding), learning goal (textarea, max 500 chars, live counter), weekly minutes (number 0-10080 + presets 30/60/120/300), preferred language (en/de radio). Visible note on what is stored and why (no name/employer/birth date). Save = one upsert on `profiles` (RLS own row); clearing a field writes null. `placement_done` is never part of the payload.
- Pure logic in `src/lib/profile.ts` (validate, form <-> row, column whitelist `PROFILE_COLUMNS`); tests in `tests/auth.test.ts` (tests now 88). Strings `profile.*` en/de (parity tested). a11y: labels, fieldset/legend, per-field errors with `aria-invalid` + focus on first invalid field, status region announces "saved", focus returns to the profile heading, 44px targets.
- `tests-e2e/auth.e2e.mjs` extended (en + de, fake backend): form shown on first sign-in, validation sends nothing, skip writes nothing, save payload has exactly the 6 allowed keys, edit prefill, clear -> nulls, existing profile -> summary only. Default build still free of account code (checks pass). All checks, `npm run e2e` and the auth e2e pass locally.
- **Not verified against a real Supabase project** (fake backend only). Flag stays off; privacy policy not yet updated.
- Known limits: if a learner saves a profile before using the "import local progress" offer, the offer no longer applies (the import only runs for accounts without a profile row). Skipping is remembered per browser (localStorage), not in the account. `npm run lint` also scans a leftover `dist-auth-test/` after a flag-on build (delete it first; pre-existing, gitignored).

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 297 · tests 88

**Next:** dashboard sync with Supabase, privacy/imprint for accounts, magic-link/spam notes.

## 2026-11-17 — Phase 3b: Auth UI (behind flag, off)

**Done**
- `/account` and `/de/account` (Preact island `AccountPanel`): sign up (consent note + checkbox, min 10 chars), "check your inbox - also check your spam folder" on every waiting screen (sign-up, magic link, reset), password sign-in, magic-link sign-in, forgot/set-new-password (recovery redirect handled on the same page), sign out, export my data (`export_my_data` -> JSON), delete account (typed word DELETE/LÖSCHEN, `delete_my_account`), offer to import local progress (one-time upsert via `stateToRows`; skipped if a profile already exists). Dashboard reads/writes are NOT wired (next task).
- Flag: `accountsEnabled` stays false; build-time override `PUBLIC_ACCOUNTS_ENABLED=true`. When off, the account routes are not injected (`astro.config.mjs`), no header link, no supabase-js chunk in `dist/`. supabase-js 2.119.0 is loaded dynamically only inside the island and only when a session/email-link is present or a form is submitted.
- Pure helpers `src/lib/auth.ts` (validation, error mapping, hints) and `src/lib/progress-rows.ts` (state <-> rows), tests in `tests/auth.test.ts`. E2E `tests-e2e/auth.e2e.mjs` (fake Supabase via Playwright routes; not in CI, not in `npm run e2e`).
- **Not verified against a real Supabase project** (no real calls by design): real email links, real error codes/shapes, RLS on the import upserts, SMTP/spam behaviour. Privacy policy is NOT updated (separate roadmap task); keep the flag off until it is.
- Note: auth UI strings are part of the shared i18n tables and therefore appear in the default JS bundle (unused when disabled).

**Next:** profile onboarding, dashboard sync, privacy/imprint for accounts.

## 2026-11-17 — Fix flaky dashboard e2e

**Done**
- Root cause: test race. `QuizItemView` focuses the question stem in a mount effect; Tab pressed before it ran got pulled back to the stem. Test now waits for focus on the stem. 12 consecutive loops of all 5 e2e scripts pass. App unchanged.
- Possible follow-up: `placement.e2e.mjs` (~line 108) has the same pattern (did not fail).

**Next:** Auth UI (en/de) behind `accountsEnabled: false`.

## 2026-11-17 — Phase 3b: Supabase schema migration

**Done**
- `supabase/migrations/20261117210000_init_profiles_progress.sql`: `profiles`, `progress`, `item_responses`, `completed_units`; RLS on all tables, policies `to authenticated` with `(select auth.uid())`, explicit grants (none to anon), `export_my_data()` (GDPR Art. 15/20) and `delete_my_account()` (Art. 17, cascade). No employer/name/birth date. `supabase/README.md` + RLS checklist; static test `tests/supabase-migrations.test.ts` (tests now 66).
- **PENDING (owner):** migration `20261117210000_init_profiles_progress.sql` is not applied. Apply via Supabase SQL editor or GitHub integration. SQL was never run against a database; run `supabase/tests/rls_checklist.md` after applying.

**Next:** fix flaky dashboard e2e; Auth UI behind `accountsEnabled` flag.

## 2026-11-17 — Phase 3b: catalog + Pagefind search

**Done**
- `/catalog` and `/de/catalog`: published roles, competencies and units with role/level filters (labelled selects, live count) and Pagefind full-text search (same-origin, no third-party requests). Pagefind 1.6.0 added as devDependency (build = `astro build && pagefind --site dist`); header nav link; e2e `tests-e2e/catalog.e2e.mjs`; mobile e2e covers catalog.
- Caveats: search needs a built site (not in `astro dev`); without JS the filters/search do nothing; no Pagefind filters/sorts yet.
- **Flaky test:** `tests-e2e/dashboard.e2e.mjs` failed in 3 of 5 runs at the review-flow `waitForSelector('[role=status][aria-live=polite]')` (passed earlier today in PR #68). Not in CI; investigate next (possible race in Dashboard review status).

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 297 · tests 59

**Next:** fix the flaky dashboard e2e, then Supabase schema migrations (Phase 3b).

## 2026-11-17 — Phase 3 complete: launch checklist

**Done**
- `docs/LAUNCH.md`: owner steps (Impressum/privacy placeholders, Cloudflare Pages setup), pre-launch verification list, known limits. Phase 3 is complete; the site is ready except for the owner-only steps.
- Run summary: quality batches IT/Finance/HR (#63–#65), onboarding+placement e2e (#66), unit page (#67), dashboard (#68), accessibility (#69), mobile (#70).

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 297 · tests 59

**Next:** Phase 3b — catalog with Pagefind search.

## 2026-11-17 — Phase 3: mobile layout pass

**Done**
- Checked home, start, placement, dashboard, unit, privacy, imprint (en + de) at 320px, iPhone 13, Pixel 5. Fixed: German unit h1 overflow (47px sideways scroll), footer link height, button min height 44px, table/pre overflow in unit body.
- New `tests-e2e/mobile.e2e.mjs` (overflow + target sizes), part of `npm run e2e`.

**Unverified:** real devices, landscape, 200% zoom, post-answer placement states, other unit pages.

**Next:** launch checklist `docs/LAUNCH.md` (last Phase 3 item), then Phase 3b catalog (Pagefind).

## 2026-11-17 — Phase 3: accessibility pass + Lighthouse

**Done**
- Lighthouse 12.8.2 (run outside the repo) on 12 pages (home, start, dashboard, unit, privacy, imprint; en + de): a11y 100, best-practices 100, SEO 100, performance 98–100. Before: SEO 90 (hreflang, label-content-name-mismatch).
- Fixes: absolute canonical + hreflang (self + alternate) in `BaseLayout.astro`; language-switch `aria-label` now starts with its visible text (en/de).
- e2e scripts (placement, unit, dashboard) still pass.

**Not covered:** dynamic island states (Lighthouse audits initial load only), manual screen-reader test, WCAG 2.2 target size / focus appearance beyond radios, other unit pages.

**Next:** mobile layout pass, then launch checklist (`docs/LAUNCH.md`), then Phase 3b catalog (Pagefind).

## 2026-11-17 — Phase 3: dashboard

**Done**
- Dashboard already had bars (role=meter, text values), next unit, path, Leitner review queue, export/import, reset. Added: localized import errors (invalid JSON, wrong format, unknown role) with progress untouched on failure; "Targets reached X / Y" summary; status messages after review/reset.
- New keyboard-only e2e `tests-e2e/dashboard.e2e.mjs` (en + de): accessible bars, review practice, export/import round-trip, invalid import errors.
- Ticked: dashboard. Bars chosen over radar (see roadmap wording "radar or bars").

**Gaps:** reset uses `window.confirm` and is not covered by e2e; review items with unknown ids are silently skipped; Supabase sync is Phase 3b.

**Next:** accessibility pass (contrast, screen reader, Lighthouse ≥ 90) and mobile layout pass.

## 2026-11-17 — Phase 3: learning path + unit page

**Done**
- Unit page resources now show type, format, language, minutes, provider (as author), source host, license link and "changes made"; source blocks show author/changes. No iframes (link-only everywhere).
- `MasteryCheck` result panel takes focus; new keyboard-only e2e `tests-e2e/unit.e2e.mjs` (en + de): skip placement → recommended unit → attribution + AI-draft label → mastery check → ratings updated on dashboard.
- Learning path stays on the dashboard (no separate page); see DECISIONS.

**Gaps:** mastery result has no link to the next unit; resources lack a real `author` field; embed rendering untested (no open-licensed embed resources yet); e2e checks rating change, not path recomputation (covered by engine tests).

**Next:** Dashboard task (radar/bars, review queue, export/import verification), then accessibility and mobile passes.

## 2026-11-17 — Phase 3: onboarding + placement verified in browser

**Done**
- Playwright run (keyboard only, en + de): role/level selection, placement ends at exactly 15 questions, result → dashboard, no console errors, no cross-language strings. Script: `tests-e2e/placement.e2e.mjs` (`npm run e2e`, not in CI; needs a running preview server).
- Fixed focus loss in `QuizItemView` (after checking an answer) and `Onboarding` (result panel).
- Not covered: skip-placement path, multi-select items, `MasteryCheck` result focus, contrast audit, screen reader.
- Decision: language is chosen through the header switcher (route-based i18n), not inside the onboarding form.

**Next:** learning path view + unit page with mastery check (verify `MasteryCheck` in browser, add focus handling), then dashboard.

## 2026-11-17 — Content quality pass: Human Resources (batch complete)

**Done**
- HR items (11 files): options rewritten en/de; `uniquely longest` warnings now 0 across the project.
- 9 new OpenStax (Organizational Behavior / Principles of Management) resources, CC BY-NC-SA, link only, verified 2026-11-17. Chapter bodies are JS-rendered, so topic fit rests on titles/slugs; a human should spot-check `openstax-pom-hrm-introduction` and `openstax-ob-reward-systems` (US-centric).
- Earlier today: IT (#63) and Finance (#64) batches merged.
- Known gaps: no German/EU primary source added for employment-law-basics, health-safety-wellbeing, hr-data-protection; Finance/IT gaps listed in the entries below. New resources not yet in unit `resources[]`.

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 297 · tests 59

**Next:** list the new resources in unit `resources[]` frontmatter, re-sample unit voice (#57); then Phase 3 UI verification (onboarding + placement in Playwright). Issues #53/#56/#57 can be closed once the above gaps are accepted.

## 2026-11-17 — Content quality pass: Finance & Accounting

**Done**
- Finance items (9 files): options rewritten en/de; `uniquely longest` warnings gone for all Finance competencies (20 → 11, only HR left).
- 5 new OpenStax Principles of Accounting resources (CC BY-NC-SA, link only, verified 2026-11-17).
- Gaps: no non-Wikipedia resource yet for accounts-payable, tax-basics, cash-liquidity-management, budgeting-forecasting, financial-statements-reporting, financial-analysis-kpis (gesetze-im-internet.de unreachable via proxy). German wording of shortened correct answers may be slightly longer than English: worth a de review. New resources not yet in unit `resources[]`.

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 288 · tests 59

**Next:** HR (11) quality batch.

## 2026-11-17 — Content quality pass: IT Support & Operations

**Done**
- IT items (10 files): options rewritten en/de; `uniquely longest` warnings gone for all 10 IT competencies (30 → 20 warnings overall).
- 9 new resources (BSI IT-Grundschutz modules, Wikibooks Bash scripting / technical writing, MS Learn Windows troubleshooting; all link-only, verified 2026-11-17).
- Gap: `it-service-management` still has no non-Wikipedia resource (no verifiable open one reachable). New resources are not yet listed in unit `resources[]` frontmatter.

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 283 · tests 59

**Next:** Finance (11) quality batch, then HR (11); close #53/#56/#57 afterwards.

## 2026-11-16 — Content quality pass: core track

**Done**
- Core track items (5 files): options rewritten (en/de) so the correct answer is no longer the uniquely longest in most items; `uniquely longest` warnings gone for the core track (35 → 30 warnings overall).
- `self-organisation-project-basics` was the only core competency without a non-Wikipedia resource: added `wikibooks-project-management` (CC BY-SA 4.0, link only, verified 2026-11-16).
- Roadmap: core-track quality batch ticked. Issues #53/#56/#57 stay open until the IT, Finance and HR batches are done. #54, #55, #58 were already fixed by merged PRs (#60, #61); not closed here (no issue-write step in this run).

**Counts:** roles 3 (+draft IT) · resources 274 · tests 59

**Next:** quality batch IT Support & Operations (10), then Finance (11), HR (11).

## 2026-11-15 — QA fixes (#58, #55)

**Done**
- #58: removed the unverified "except small businesses" detail from the e-invoice receiving rule (en/de accounts-payable-advanced); text now points to current BMF guidance. Adding the BMF page as a resource is still open (host not reachable for verification).
- #55 parts 1-2: German "Mischung der Indikatorarten" section added, takeaways aligned, financial-analysis-kpis-foundation (de) brought to parity (863 vs 858 words).

**Next:** content quality pass (#53, #56, #57), starting with the Core track batch; Phase 3 UI verification.

**Counts:** roles 4 · competencies 38 · units 228 · items 456 · resources 273

## 2026-11-13 — Phase 3: landing page ticked

**Done**
- Landing page (en/de) already implemented in `HomePage.astro` (intro, how it works, privacy note, published roles list, AI-draft transparency note); ticked in ROADMAP after all checks passed.
- Run summary: HR content finished and role published (#48–#51); stale branch `claude/admiring-mayer-dn6uyq` is superseded and can be deleted.

**Next:** Phase 3 — verify/finish onboarding + placement UI, learning path view, dashboard (these exist as islands; need browser verification and gap review), then accessibility and mobile passes.

## 2026-11-13 — Phase 2: Human Resources complete and published

**Done**
- `diversity-inclusion`: 6 units (en/de, ai-draft), 12 items, 8 new link-only Wikipedia resources (URLs verified 200); AGG mentioned only generally (based on the German Wikipedia intro); 4 existing resources tagged.
- Role `human-resources` set to `published` (coverage now enforced, 0 errors); `docs/FRAMEWORK.md` regenerated.
- Earlier this run: learning-development (#48), employee-relations-conflict (#49), health-safety-wellbeing (#50).

**Counts:** roles 4 (4 published) · competencies 38 · units 228 · items 456 · resources 273

**Next:** Phase 2 roadmap item after HR (see ROADMAP).

## 2026-11-13 — Phase 2: Human Resources content for health-safety-wellbeing

**Done**
- `health-safety-wellbeing`: 6 units (en/de, ai-draft), 12 items, 8 new link-only Wikipedia resources (URLs verified 200).
- Review note: definitions attributed to articles (hazard, risk, stress factors, hazard controls, return-to-work support) were written without fetching the pages; QA should check them.

**Next:** HR `diversity-inclusion`, then publish the role.

## 2026-11-13 — Phase 2: Human Resources content for employee-relations-conflict

**Done**
- `employee-relations-conflict`: 6 units (en/de, ai-draft), 12 items, 7 new link-only Wikipedia resources (3 existing reused and tagged); German Wikipedia "Mediation" URL 404, dropped.

**Next:** HR `health-safety-wellbeing`, `diversity-inclusion`, then publish the role.

## 2026-11-13 — Phase 2: Human Resources content for learning-development

**Done**
- `learning-development`: 6 units (3 levels x en/de, ai-draft), 12 items (4 per level), 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0, verified 2026-11-13).
- Kirkpatrick Wikipedia URL returned 404 and was left out; Kirkpatrick levels and 70:20:10 appear only as labelled practice insight (70:20:10 as a rule of thumb, not a finding).
- Stale branch `claude/admiring-mayer-dn6uyq` (troubleshooting-methods) is superseded by main and can be deleted.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 210 · items 420 · resources 250

**Next:** HR `employee-relations-conflict`, `health-safety-wellbeing`, `diversity-inclusion`, then publish the role.

## 2026-11-12 — Phase 2: Human Resources content for performance-feedback

**Done**
- `payroll-compensation` merged ([#46](https://github.com/fdragonfpsy/open-role-academy/pull/46)).
- `performance-feedback`: 6 units (3 levels x en/de, bodies 585-713 words), 12 items, 7 new link-only resources (Wikipedia, CC BY-SA 4.0). No statistics or study claims.
- Levels: foundation = purpose, goals vs tasks, useful feedback, check-ins, fairness; practitioner = supporting goal setting, appraisal steps and documentation, coaching managers, difficult conversations; advanced = rating biases and how to reduce them, consistency across teams, development vs pay talks, appraisal data protection, process improvement.
- Review notes for humans: the situation-behaviour-impact model, calibration/evidence as bias reducers, "keep development talks separate from pay" and data-minimisation advice are labelled "practice insight" without a source; the English foundation and practitioner units cite the German feedback article (English "Feedback" page covers system feedback loops); recency bias is cited only in the German units; three reused resources were not tagged with this competency.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 204 · items 408 · resources 243

**Next:** `learning-development`, `employee-relations-conflict`, `health-safety-wellbeing`, `diversity-inclusion`, then publish the Human Resources role.

## 2026-11-12 — Phase 2: Human Resources content for payroll-compensation

**Done**
- `onboarding-offboarding` merged ([#45](https://github.com/fdragonfpsy/open-role-academy/pull/45)).
- `payroll-compensation` (Germany): 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), several reused. No tax or contribution rates, ceilings, deadlines or § numbers; worked examples use invented round figures and "example amount" labels; statutory deductions are only named.
- Levels: foundation = gross to net, payslip sections, payroll data needs, confidentiality; practitioner = HR-to-payroll data flow, cut-off discipline, common errors, benefits and variable pay, corrections; advanced = reconciling payroll with HR and finance, pay structures and grading, pay transparency principles, providers and tax advisors, controls, pay-data protection.
- Review notes for humans (payroll is high-risk, needs human payroll/tax review before leaving `ai-draft`): collective agreement, four-eyes, audit trail, access control, DPO and GDPR pages were cited generically for definitions without being read in full (rate-limited); the English unit bodies run about 807-823 words including example, takeaways and resources (guideline is 800, not enforced by the validator) — trim in review.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 198 · items 396 · resources 236

**Next:** `performance-feedback`, then `learning-development`, `employee-relations-conflict`, `health-safety-wellbeing`, `diversity-inclusion`, then publish the Human Resources role.

## 2026-11-12 — Phase 2: Human Resources content for onboarding-offboarding

**Done**
- `hr-data-protection` merged ([#44](https://github.com/fdragonfpsy/open-role-academy/pull/44)).
- `onboarding-offboarding`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), several reused. No legal numbers or statistics (Wikipedia figures deliberately left out).
- Levels: foundation = onboarding vs offboarding, preboarding and first-day checklist, buddy idea, respectful exits; practitioner = first-weeks plan, coordinating IT/facilities/manager, feedback loops, exit process (handover, access removal, equipment, reference concept, exit interview); advanced = improving the journey, knowledge transfer, difficult exits (involve legal/works council), data protection in onboarding/exit data, remote and multi-site consistency.
- Review note for humans: keeping exit-interview notes out of the personnel file, remote-joiner tips, the self-measurement questions and "never share logins" are practitioner advice, not from a cited page. The reused resources' `competencies` lists were not extended to this competency.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 192 · items 384 · resources 229

**Next:** `payroll-compensation`, then the remaining Human Resources competencies in roadmap order.

## 2026-11-12 — Phase 2: Human Resources content for hr-data-protection

**Done**
- `personnel-administration` merged ([#43](https://github.com/fdragonfpsy/open-role-academy/pull/43)).
- `hr-data-protection` (EU/Germany, GDPR): 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 5 reused. Concepts only: no deadlines, retention periods, article or § numbers, or fine amounts; breach handling is described as internal escalation to the DPO.
- Levels: foundation = personal data, why HR data is sensitive, principles, need-to-know, DPO; practitioner = legal bases and purpose limitation (concept), minimisation, special categories, access requests (route to DPO), secure files, retention concept; advanced = privacy by design, processors, breach process, monitoring caution, documentation, keeping up with guidance.
- Review note for humans (legal content, needs human legal review before leaving `ai-draft`): the Betriebsrat description relies on an earlier resource; German units attribute some points to the German DSGVO page that were read on the English GDPR page; German DPO tasks come from the English DPO page.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 186 · items 372 · resources 222

**Next:** `onboarding-offboarding`, then the remaining Human Resources competencies in roadmap order.

## 2026-11-12 — Phase 2: Human Resources content for personnel-administration

**Done**
- `recruitment-selection` merged ([#42](https://github.com/fdragonfpsy/open-role-academy/pull/42)).
- `personnel-administration`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 3 reused. No retention periods, leave entitlements, notice periods or section numbers.
- Levels: foundation = personnel records, lifecycle documents, accuracy and confidentiality, absence types; practitioner = contract changes, leave/absence workflows, time recording, certificates, HR system hygiene; advanced = retention/deletion concept (check rules/DPO), audit-ready files, need-to-know access, automation, data corrections, HR/payroll reconciliation.
- Review note for humans: worked scenarios and the six-step contract-change routine are illustrations, not from a cited page. Several units sit near the 800-word limit.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 180 · items 360 · resources 215

**Next:** `hr-data-protection`, then the remaining Human Resources competencies in roadmap order.

## 2026-11-12 — Phase 2: Human Resources content for recruitment-selection

**Done**
- `employment-law-basics` merged ([#41](https://github.com/fdragonfpsy/open-role-academy/pull/41)).
- `recruitment-selection`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). No legal numbers (no § or Art., retention periods or statistics); retention and data handling say to check current law, the DPO or legal counsel.
- Levels: foundation = hiring process, requirement profile vs job ad, documenting; practitioner = inclusive job ads, sourcing, fair screening, structured interviews with a rubric; advanced = bias and structure, documented decisions, hiring managers, applicant data (concept), process measurement, candidate experience.
- Review note for humans: "score before group discussion", the time-to-hire definition, inclusive-ad advice and the rubric tip are general practice or own wording, not from a cited page.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 174 · items 348 · resources 208

**Next:** `personnel-administration`, then the remaining Human Resources competencies in roadmap order.

## 2026-11-12 — Phase 2: Human Resources started (employment-law-basics)

**Done**
- Finance & Accounting published ([#40](https://github.com/fdragonfpsy/open-role-academy/pull/40)).
- Split "Human Resources content complete" into 11 per-competency sub-tasks (ROADMAP). The role stays `draft` until all are done.
- `employment-law-basics` (Germany/EU): 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Concepts only: no day counts, § or Art. numbers, thresholds or court decisions; every unit says HR staff do not give legal advice.
- Review note for humans (legal content, needs human legal review before leaving `ai-draft`): the "when to involve counsel" list is a rule of thumb, labelled "not a legal test"; "write terms down and check current documentation duties" is advice; Kündigungsschutz and AGG are only named as listed on the Arbeitsrecht page.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 168 · items 336 · resources 201

**Next:** `recruitment-selection`, then the remaining Human Resources competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting complete and published

**Done**
- `cost-accounting` merged ([#39](https://github.com/fdragonfpsy/open-role-academy/pull/39)).
- `financial-analysis-kpis`: 6 units (3 levels x en/de), 12 items (arithmetic checked, formulas stated in stems), 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). No benchmark thresholds (a quoted ROE range was removed). Amounts invented and labelled as illustration.
- All 11 role-specific Finance & Accounting competencies now have units for all 3 levels (en/de), 12 items each and verified resources. Role `finance-accounting` is published (removed `status: draft`). Published roles: core-track, it-support-operations, finance-accounting.
- Review note for humans: German Rohertragsmarge and Liquiditätsgrad 2/3 formulas (page not available), chart-truncation remark and ROE averaging advice are general knowledge without a cited page. Tax content (`tax-basics`) needs human tax review.

**Counts:** roles 4 (3 published, 1 draft) · competencies 38 · units 162 · items 324 · resources 194

**Next:** Human Resources content (split into per-competency sub-tasks first), then Phase 3 learner experience.

## 2026-11-12 — Phase 2: Finance & Accounting content for cost-accounting

**Done**
- `internal-controls-audit` merged ([#38](https://github.com/fdragonfpsy/open-role-academy/pull/38)).
- `cost-accounting`: 6 units (3 levels x en/de), 12 items (calculation items re-checked by hand), 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 3 reused. All amounts invented and labelled as illustration.
- Levels: foundation = cost types, fixed/variable, direct/indirect, cost centres and objects; practitioner = overhead allocation, unit cost, contribution margin, break-even, cost reports; advanced = pricing support and its limits, make-or-buy with relevant vs sunk costs, activity-based costing concept, CVP limits.
- Review note for humans: the cost-plus formula, CVP simplifications and cost-report contents are general definitions without a dedicated cited page.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 156 · items 312 · resources 187

**Next:** `financial-analysis-kpis`, then publish the Finance & Accounting role.

## 2026-11-12 — Phase 2: Finance & Accounting content for internal-controls-audit

**Done**
- `budgeting-forecasting` merged ([#37](https://github.com/fdragonfpsy/open-role-academy/pull/37)).
- `internal-controls-audit`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 5 reused. No retention periods, § numbers or thresholds; retention text names only HGB and AO as the cited German page does; examples use invented amounts.
- Levels: foundation = internal controls, segregation of duties, four-eyes, documentation; practitioner = preventive vs detective controls, control matrix idea, approval limits, retention concept, audit requests; advanced = control design/testing, internal vs external audit, findings and remediation, evidence quality, IT/access controls, fraud-risk awareness.
- Review note for humans: fraud warning signs, control-matrix columns, audit-request steps and "never split a payment to stay under a limit" are general practice without a cited page.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 150 · items 300 · resources 180

**Next:** `cost-accounting`, `financial-analysis-kpis`, then publish the Finance & Accounting role.

## 2026-11-12 — Phase 2: Finance & Accounting content for budgeting-forecasting

**Done**
- `cash-liquidity-management` merged ([#36](https://github.com/fdragonfpsy/open-role-academy/pull/36)).
- `budgeting-forecasting`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 4 reused. Amounts invented and labelled as illustration.
- Levels: foundation = budget vs forecast, plan vs actual; practitioner = budgets with owners, assumptions, variances, rolling forecast idea, spreadsheet hygiene; advanced = variance drivers, scenarios/sensitivity, forecast accuracy, process design side effects, communicating variances.
- Review note for humans: rolling forecast definition, price/volume/mix for sales, top-down/bottom-up steps in the en units, sign-convention advice and the "practice insight" on sandbagging are general knowledge without a dedicated cited page.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 144 · items 288 · resources 173

**Next:** `internal-controls-audit`, then `cost-accounting`, `financial-analysis-kpis`, then publish the Finance & Accounting role.

## 2026-11-12 — Phase 2: Finance & Accounting content for cash-liquidity-management

**Done**
- `tax-basics` merged ([#35](https://github.com/fdragonfpsy/open-role-academy/pull/35)).
- `cash-liquidity-management`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Amounts invented and labelled as illustration; no SEPA or EU-specific claims (pages could not be read).
- Levels: foundation = cash vs profit, balance monitoring, daily cash position; practitioner = weekly rolling liquidity plan, payment timing, working capital, payment runs; advanced = forecast variance, working-capital levers, payment fraud controls, contingencies.
- Review note for humans: the cash conversion cycle formula is inferred from the cited page's definitions; contingency options and bank/management communication advice are practice guidance without a source.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 138 · items 276 · resources 166

**Next:** `budgeting-forecasting`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting content for tax-basics

**Done**
- `financial-statements-reporting` merged ([#34](https://github.com/fdragonfpsy/open-role-academy/pull/34)).
- `tax-basics` (Germany/EU): 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Concepts only: no rates, thresholds, deadlines, section or form numbers; worked examples use invented amounts.
- Levels: foundation = VAT as a chain, input vs output tax, invoices; practitioner = net/gross, VAT in the booking flow, intra-EU vs domestic overview, filing duty exists, business tax types; advanced = reverse charge concept, cross-border pitfalls, VAT control in AP/AR, tax advisors, keeping up with law changes.
- Review note for humans (tax is high-risk): general-practice statements without a dedicated source: AP/AR control suggestions, net vs gross definitions, "retention periods are set by law", profit-based tax wording. The German Umsatzsteuer Wikipedia page is flagged as partly outdated and was used for concepts only. Needs human tax review before leaving `ai-draft`.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 132 · items 264 · resources 159

**Next:** `cash-liquidity-management`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting content for financial-statements-reporting

**Done**
- `reconciliation-closing` merged ([#33](https://github.com/fdragonfpsy/open-role-academy/pull/33)).
- `financial-statements-reporting`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 6 reused. HGB vs IFRS kept to what the cited pages state; amounts invented and labelled as illustration.
- Levels: foundation = balance sheet, income statement, notes and how they relate; practitioner = reading statements, cash flow idea, HGB vs IFRS overview, basic management report; advanced = consistency and period comparison, reports for non-finance readers, disclosures, limits, review before release.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 126 · items 252 · resources 152

**Next:** `tax-basics`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting content for reconciliation-closing

**Done**
- `accounts-receivable` merged ([#32](https://github.com/fdragonfpsy/open-role-academy/pull/32)).
- `reconciliation-closing`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 4 reused. Amounts invented and labelled as illustration; no depreciation rates or deadlines.
- Levels: foundation = bank reconciliation, accrual/deferral meaning, closing checklist; practitioner = sub-ledger reconciliation, accruals/deferrals, straight-line depreciation, closing calendar; advanced = root causes, materiality, review/sign-off, reversing entries, audit-ready documentation.
- Review note for humans: the materiality paragraph and reversing-entry details are general definitions without a dedicated cited page.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 120 · items 240 · resources 145

**Next:** `financial-statements-reporting`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting content for accounts-receivable

**Done**
- `accounts-payable` merged ([#31](https://github.com/fdragonfpsy/open-role-academy/pull/31)).
- `accounts-receivable`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0), 3 reused. Amounts invented and labelled as illustration; no rates or statutory deadlines (units say "check your country's rules").
- Levels: foundation = order-to-cash, correct invoices, posting payments, open items; practitioner = payment matching, aging list, dunning tone, disputes/credit notes; advanced = credit limits and risk, DSO, bad-debt allowance concept, collections handoff, fraud.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 114 · items 228 · resources 138

**Next:** `reconciliation-closing`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting content for accounts-payable

**Done**
- `bookkeeping-fundamentals` merged ([#30](https://github.com/fdragonfpsy/open-role-academy/pull/30)).
- `accounts-payable`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Amounts are invented and labelled as illustration; country rules (Germany/EU) are labelled and kept general.
- Levels: foundation = invoice-to-payment flow, formal vs factual check; practitioner = matching, approval limits, payment runs, discounts, disputes; advanced = fraud red flags and callbacks, segregation of duties, accruals, KPIs, e-invoicing concept.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 108 · items 216 · resources 131

**Next:** `accounts-receivable`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: Finance & Accounting started (bookkeeping-fundamentals)

**Done**
- IT Support & Operations published ([#29](https://github.com/fdragonfpsy/open-role-academy/pull/29)).
- Split "Finance & Accounting content complete" into 11 per-competency sub-tasks (ROADMAP). The role stays `draft` until all are done.
- `bookkeeping-fundamentals`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Examples use invented amounts, labelled as illustration; German specifics (GoB, SKR03/SKR04) are labelled and kept general.

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 102 · items 204 · resources 124

**Next:** `accounts-payable`, then the remaining Finance & Accounting competencies in roadmap order.

## 2026-11-12 — Phase 2: IT Support & Operations complete and published

**Done**
- `change-asset-management` merged ([#28](https://github.com/fdragonfpsy/open-role-academy/pull/28)).
- `scripting-automation`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0).
- All 10 role-specific IT Support competencies now have units for all 3 levels (en/de), 12 items each and verified resources. Role `it-support-operations` is published (removed `status: draft`).

**Counts:** roles 4 (2 published, 2 draft) · competencies 38 · units 96 · items 192 · resources 117

**Next:** Finance & Accounting content (split into per-competency sub-tasks first), then Human Resources.

## 2026-11-12 — Phase 2: IT Support content for change-asset-management

**Done**
- `backup-recovery` merged ([#27](https://github.com/fdragonfpsy/open-role-academy/pull/27)).
- `change-asset-management`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus 2 shared. ITIL is described only via Wikipedia.
- Levels: foundation = controlled change flow, asset inventory and lifecycle; practitioner = change types, risk/impact, rollback, CMDB basics, licence tracking; advanced = approval governance, change calendars, post-implementation review, audit readiness, CMDB data quality.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 90 · items 180 · resources 110

**Next:** `scripting-automation`, then publish the IT Support role.

## 2026-11-12 — Phase 2: IT Support content for backup-recovery

**Done**
- `networking-fundamentals` merged ([#26](https://github.com/fdragonfpsy/open-role-academy/pull/26)).
- `backup-recovery`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus shared BSI IT-Grundschutz.
- Levels: foundation = why backups, full/incremental/differential, 3-2-1, restore as the real test; practitioner = RPO/RTO, retention, monitoring, restore tests, offsite, encryption; advanced = disaster recovery plans, immutable/offline copies, business-impact priorities, runbooks and exercises.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 84 · items 168 · resources 103

**Next:** `change-asset-management`, `scripting-automation`, then publish the IT Support role.

## 2026-11-12 — Phase 2: IT Support content for networking-fundamentals

**Done**
- `identity-access-management` merged ([#25](https://github.com/fdragonfpsy/open-role-academy/pull/25)).
- `networking-fundamentals`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0).
- Levels: foundation = LAN/WAN, devices, IP/DHCP/DNS in plain terms, basic connectivity checks; practitioner = subnets/gateways, DNS troubleshooting, VPN, firewalls and ports, Wi-Fi problems; advanced = segmentation and zero trust, monitoring, redundancy, documentation and change impact.
- Note: in the item YAML the correct option is authored first; the site shuffles options deterministically per item id (`src/lib/shuffle.ts`), so learners do not see this.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 78 · items 156 · resources 96

**Next:** `backup-recovery`, then `change-asset-management`, `scripting-automation`, then publish the IT Support role.

## 2026-11-12 — Phase 2: IT Support content for identity-access-management

**Done**
- `endpoint-management` merged ([#24](https://github.com/fdragonfpsy/open-role-academy/pull/24)).
- `identity-access-management`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus 2 shared (BSI).
- Levels: foundation = accounts, passwords, MFA, joiner/mover/leaver, verified resets; practitioner = RBAC, least privilege, access requests, SSO, lockouts; advanced = access reviews, privileged access, directory services, federation, segregation of duties, audit trails.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 72 · items 144 · resources 89

**Next:** `networking-fundamentals`, then the remaining IT Support competencies in roadmap order.

## 2026-11-12 — Phase 2: IT Support content for endpoint-management

**Done**
- `user-support-communication` merged ([#23](https://github.com/fdragonfpsy/open-role-academy/pull/23)).
- `endpoint-management`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus 1 shared (BSI IT-Grundschutz).
- Levels: foundation = OS basics, software install/updates, setup checklist; practitioner = patch cycles, standard images, security baselines, device onboarding/offboarding; advanced = centralised management (MDM), rollout rings, compliance/drift, lifecycle and secure retirement.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 66 · items 132 · resources 82

**Next:** `identity-access-management`, then the remaining IT Support competencies in roadmap order.

## 2026-11-12 — Phase 2: IT Support content for user-support-communication

**Done**
- `user-support-communication`: 6 units (3 levels x en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus 4 shared resources.
- Levels: foundation = good questions, plain language, polite ticket updates; practitioner = remote guidance, expectation management, frustrated users, how-to writing; advanced = escalation and major-incident communication, coaching, knowledge articles, feedback loops.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 60 · items 120 · resources 75

**Next:** `endpoint-management`, then the remaining IT Support competencies in roadmap order.

## 2026-11-11 — Phase 2: IT Support content for troubleshooting-methods

**Done**
- `incident-request-handling` content merged ([#14](https://github.com/fdragonfpsy/open-role-academy/pull/14)).
- `troubleshooting-methods`: 6 units (3 levels × en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0: Troubleshooting, Logging, OSI model, Ishikawa diagram; Logdatei, OSI-Modell, Ursache-Wirkungs-Diagramm) plus 3 shared resources (root cause analysis, five whys, 5-Why-Methode).
- Levels: foundation = systematic sequence (describe, reproduce, simple checks, one change at a time, logs, verify); practitioner = hypotheses, layer isolation and half-splitting, known-good comparison, log analysis; advanced = root causes, five whys/Ishikawa, bisection, reasoning traps, blameless reviews.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 54 · items 108 · resources 68

**Next:** `user-support-communication`, then the remaining IT Support competencies in roadmap order.

## 2026-11-11 — Phase 2: IT Support content for incident-request-handling

**Done**
- `it-service-management` content merged ([#13](https://github.com/fdragonfpsy/open-role-academy/pull/13)).
- `incident-request-handling`: 6 units (3 levels × en/de), 12 items, 7 new link-only resources (Wikipedia en/de, CC BY-SA 4.0) plus 3 shared resources from `it-service-management`.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 48 · items 96 · resources 61

**Next:** `troubleshooting-methods`, then the remaining IT Support competencies in roadmap order.

## 2026-11-11 — Phase 2: IT Support & Operations content started (it-service-management)

**Done**
- Placement budget merged ([#12](https://github.com/fdragonfpsy/open-role-academy/pull/12)).
- Split "IT Support & Operations content complete" into one sub-task per role-specific competency (ROADMAP). The role stays `draft` (hidden) until all ten are done.
- `it-service-management`: 6 units (3 levels × en/de), 12 items, 8 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). ITIL is described only via Wikipedia; no proprietary ITIL text is used.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 42 · items 84 · resources 54

**Next:** `incident-request-handling`, then the remaining IT Support competencies in roadmap order.

## 2026-11-11 — Engine: placement question budget

**Done**
- Core track content complete, merged ([#11](https://github.com/fdragonfpsy/open-role-academy/pull/11)).
- Placement check limited to 15 questions in total (`planPlacement`): competencies are placed in priority order, 3–5 items each; the rest keep the prior. With the full core track the placement now asks 15 instead of 24 questions (checked in the browser).
- Dashboard label "Not yet placed" → "Not yet mastered" (en/de), which is accurate for placed-but-not-mastered competencies.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 36 · items 72 · resources 46 · tests 58

**Next:** Phase 2 — IT Support & Operations content (split into per-competency sub-tasks), then publish the role.

## 2026-11-11 — Phase 2: core track content complete (business-finance-fundamentals)

**Done**
- `self-organisation-project-basics` content merged ([#10](https://github.com/fdragonfpsy/open-role-academy/pull/10)).
- `business-finance-fundamentals`: 6 units (3 levels × en/de), 12 items, 9 new link-only resources (Wikipedia en/de CC BY-SA 4.0; OpenStax *Principles of Accounting, Vol. 1* ch. 2, CC BY-NC-SA → link only). Added to the published `core-track` role (priority 3).
- **Core track content complete:** all 6 core competencies have units for all 3 levels in en/de, 12 items each and 6–9 verified resources.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 36 · items 72 · resources 46

**Next:** Phase 2 — IT Support & Operations content (10 role-specific competencies; split into per-competency sub-tasks), then publish the role.

## 2026-11-11 — Phase 2: core track content for self-organisation-project-basics

**Done**
- `working-with-data` content merged ([#9](https://github.com/fdragonfpsy/open-role-academy/pull/9)).
- `self-organisation-project-basics`: 6 units (3 levels × en/de), 12 items, 9 new link-only resources (Wikipedia en/de, CC BY-SA 4.0). Added to the published `core-track` role (priority 2). Items are generated in YAML block style with quoted strings.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 30 · items 60 · resources 37

**Next:** core track content for `business-finance-fundamentals` (last core sub-task), then IT Support & Operations content.

## 2026-11-11 — Phase 2: core track content for working-with-data

**Done**
- Fix for truncated answer options merged ([#8](https://github.com/fdragonfpsy/open-role-academy/pull/8)).
- `working-with-data`: 6 units (3 levels × en/de), 12 items, 8 new link-only resources (Wikipedia en/de CC BY-SA 4.0; OpenStax *Introductory Statistics 2e* ch. 2, page footer states CC BY-NC-SA → link only). Added to the published `core-track` role (priority 2).

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 24 · items 48 · resources 28

**Next:** core track content for `self-organisation-project-basics` and `business-finance-fundamentals`.

## 2026-11-11 — Fix: truncated answer options in items

**Done**
- `communication-collaboration` content merged ([#7](https://github.com/fdragonfpsy/open-role-academy/pull/7)).
- Found and fixed a content bug: unquoted commas in one-line YAML option mappings cut option texts short (22 options in 3 item files). Options are now written in block style, and item/option schemas are strict, so this fails validation from now on.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 18 · items 36 · resources 20

**Next:** core track content for `working-with-data`.

## 2026-11-11 — Phase 2: core track content for communication-collaboration

**Done**
- `digital-ai-literacy` content merged ([#6](https://github.com/fdragonfpsy/open-role-academy/pull/6)).
- `communication-collaboration`: 6 units (3 levels × en/de), 12 items, 6 new link-only resources (Wikipedia en/de CC BY-SA 4.0; OpenStax *Organizational Behavior* chapters 9 and 11, CC BY-NC-SA → link only). Added to the published `core-track` role.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 18 · items 36 · resources 20

**Next:** core track content for `working-with-data`, `self-organisation-project-basics`, `business-finance-fundamentals`.

## 2026-11-11 — Phase 2 started: core track content for digital-ai-literacy

**Done**
- Phase 1 complete: HR framework and generated `docs/FRAMEWORK.md` merged ([#5](https://github.com/fdragonfpsy/open-role-academy/pull/5)).
- Split "Core track content complete" into one sub-task per competency (ROADMAP).
- `digital-ai-literacy`: 6 units (3 levels × en/de), 12 items (4 per level), 7 resources (Wikipedia en/de, BSI, JRC DigComp — all link only, licenses checked 2026-11-11). Added to the published `core-track` role.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 · units 12 · items 24 · resources 14

**Next:** core track content for `communication-collaboration`, then `working-with-data`, `self-organisation-project-basics`, `business-finance-fundamentals`.

## 2026-11-11 — Phase 1 complete: Human Resources framework + FRAMEWORK.md

**Done**
- Finance & Accounting framework merged ([#4](https://github.com/fdragonfpsy/open-role-academy/pull/4)).
- Role `human-resources` (status `draft`): 11 role-specific competencies + 6 core competencies with targets and priorities; en/de texts, prerequisites, ESCO references.
- `docs/FRAMEWORK.md` generated from the YAML (`npm run docs:framework`); a test keeps it in sync.

**Counts:** roles 4 (1 published, 3 draft) · competencies 38 (6 core, 32 role) · units 6 · items 12 · resources 7

**Next:** Phase 2 — core track content (units en/de, ≥ 6 items and 2–4 verified resources per competency), starting with `digital-ai-literacy`.

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
