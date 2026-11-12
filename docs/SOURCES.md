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
| ITIL (PeopleCert) | proprietary framework | reference by name only; describe via open sources (e.g. Wikipedia), never copy ITIL text |
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
| wikipedia-income-statement, wikipedia-balance-sheet, wikipedia-contribution-margin, wikipedia-cash-flow, wikipedia-performance-indicator | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-gewinn-und-verlustrechnung, wikipedia-de-bilanz, wikipedia-de-deckungsbeitrag | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-it-service-management, wikipedia-itil, wikipedia-service-level-agreement, wikipedia-incident-management-itsm, wikipedia-change-management-itsm | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-it-service-management, wikipedia-de-itil, wikipedia-de-service-level-agreement | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-issue-tracking-system, wikipedia-root-cause-analysis, wikipedia-five-whys, wikipedia-knowledge-base | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-trouble-ticket-system, wikipedia-de-5-why-methode, wikipedia-de-incident-management | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-troubleshooting, wikipedia-logging-computing, wikipedia-osi-model, wikipedia-ishikawa-diagram | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-de-logdatei, wikipedia-de-osi-modell, wikipedia-de-ursache-wirkungs-diagramm | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-11 |
| wikipedia-identity-management, wikipedia-access-control, wikipedia-multi-factor-authentication, wikipedia-role-based-access-control | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-identitaetsmanagement, wikipedia-de-rollenbasierte-zugriffskontrolle, wikipedia-de-single-sign-on | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-customer-support, wikipedia-plain-language, wikipedia-remote-desktop-software, wikipedia-conflict-resolution | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-leichte-sprache, wikipedia-de-fernwartung, wikipedia-de-deeskalation | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-operating-system, wikipedia-patch-computing, wikipedia-disk-encryption, wikipedia-mobile-device-management | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-betriebssystem, wikipedia-de-patch-software, wikipedia-de-mobile-device-management | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-ip-address, wikipedia-domain-name-system, wikipedia-subnetwork, wikipedia-virtual-private-network, wikipedia-firewall-computing | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-ip-adresse, wikipedia-de-domain-name-system | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-backup, wikipedia-disaster-recovery, wikipedia-recovery-point-objective, wikipedia-raid | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-datensicherung, wikipedia-de-disaster-recovery, wikipedia-de-raid | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-it-asset-management, wikipedia-configuration-management-database, wikipedia-software-license, wikipedia-release-management | Wikipedia (en) | CC BY-SA 4.0 | link | 2026-11-12 |
| wikipedia-de-configuration-management-database, wikipedia-de-lizenzmanagement, wikipedia-de-change-management-itil | Wikipedia (de) | CC BY-SA 4.0 | link | 2026-11-12 |
| openstax-principles-accounting-statements | OpenStax (*Principles of Accounting, Vol. 1*) | CC BY-NC-SA (page footer); no LLM ingestion without permission | link | 2026-11-11 |

## Framework references

- DigComp 2.2 (European Commission, JRC): https://joint-research-centre.ec.europa.eu/scientific-activities-z/education-and-training/digital-transformation-education/digital-competence-framework-citizens-digcomp_en
- ESCO (European Skills, Competences, Qualifications and Occupations): https://esco.ec.europa.eu/ — to be referenced per competency from Phase 1.

## Verification notes

- 2026-11-11: Wikipedia footers checked ("Text is available under the Creative Commons Attribution-ShareAlike 4.0 License"; the German footer names CC BY-SA without a version number — Wikimedia projects have used 4.0 since 2023). BSI pages are reachable and state no open license → link only. The OpenLearn course page shows a BY-NC-SA licence badge → link only; the server answers 403 to automated clients, so the weekly link check lists it for manual review.
