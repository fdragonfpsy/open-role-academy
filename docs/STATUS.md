# Status

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
