# Sources and license notes

Every resource is stored in `src/content/resources/<id>.yaml` with `license`, `licenseUrl` and `licenseVerifiedOn`. This file summarises the source types and how they may be used (CLAUDE.md §6).

## Source types

| Source | Typical license | Allowed use |
|---|---|---|
| Wikipedia / Wikibooks (en, de) | CC BY-SA 4.0 (text) | embed/adapt with attribution (makes the unit CC BY-SA); currently link only |
| OpenStax | CC BY 4.0 for many books, but e.g. *Organizational Behavior* is CC BY-NC-SA 4.0 | verify per book; NC → link only |
| OpenLearn (Open University) | CC BY-NC-SA 4.0 (most free courses) | **link only** |
| MIT OpenCourseWare | CC BY-NC-SA 4.0 | **link only** |
| Khan Academy | CC BY-NC-SA (most content) | **link only** |
| Saylor Academy | mostly CC BY 3.0 — verify per course | depends on course |
| OERSI search results | varies per resource | verify each resource |
| BSI (German Federal Office for Information Security) | free access, no open license stated | **link only** |
| EU sources (ESCO, DigComp, EU publications) | EU reuse policy, often CC BY 4.0 — verify per document | framework references; link |
| gesetze-im-internet.de (German statutes) | official texts, free access | link and cite |
| Vendor docs (e.g. Microsoft Learn) | free access, proprietary | **link only** unless stated otherwise |

## Resources in use

| Resource id | Provider | License | Mode | Verified |
|---|---|---|---|---|
| wikipedia-information-security | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-phishing | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-informationssicherheit | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| bsi-sichere-passwoerter | BSI | free-access | link | 2026-11-11 |
| bsi-phishing-password-theft | BSI | free-access | link | 2026-11-11 |
| bsi-it-grundschutz | BSI | free-access | link | 2026-11-11 |
| openlearn-intro-cyber-security | OpenLearn | CC BY-NC-SA 4.0 | link | 2026-11-11 |
| wikipedia-large-language-model, wikipedia-ai-hallucination, wikipedia-information-literacy | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-halluzination-ki, wikipedia-de-grosses-sprachmodell | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| bsi-kuenstliche-intelligenz | BSI | free-access | link | 2026-11-11 |
| jrc-digcomp-framework | European Commission JRC | free-access (no license stated on page) | link | 2026-11-11 |
| wikipedia-active-listening, wikipedia-psychological-safety | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-aktives-zuhoeren, wikipedia-de-teamarbeit | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| openstax-ob-communication, openstax-ob-groups | OpenStax (*Organizational Behavior*) | CC BY-NC-SA 4.0 | link | 2026-11-11 |
| wikipedia-pivot-table, wikipedia-data-cleansing, wikipedia-misleading-graph, wikipedia-correlation-causation | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-tabellenkalkulation, wikipedia-de-pivot-tabelle, wikipedia-de-deskriptive-statistik | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| openstax-intro-stats-descriptive | OpenStax (*Introductory Statistics 2e*) | CC BY-NC-SA (page footer) | link | 2026-11-11 |
| wikipedia-time-management, wikipedia-smart-criteria, wikipedia-project-management, wikipedia-kanban-development, wikipedia-raci | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-eisenhower-prinzip, wikipedia-de-smart, wikipedia-de-projektmanagement, wikipedia-de-kanban-entwicklung | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |

## Framework references

- DigComp 2.2 (European Commission, JRC): https://joint-research-centre.ec.europa.eu/scientific-activities-z/education-and-training/digital-transformation-education/digital-competence-framework-citizens-digcomp_en
- ESCO (European Skills, Competences, Qualifications and Occupations): https://esco.ec.europa.eu/ — to be referenced per competency from Phase 1.

## Verification notes

- 2026-11-11: Wikipedia footers checked ("Text is available under the Creative Commons Attribution-ShareAlike 4.0 License"; the German footer names CC BY-SA without a version number — Wikimedia projects have used 4.0 since 2023). BSI pages are reachable and state no open license → link only. The OpenLearn course page shows a BY-NC-SA licence badge → link only; the server answers 403 to automated clients, so the weekly link check lists it for manual review.
