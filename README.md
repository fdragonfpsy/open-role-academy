# Open Role Academy

[Deutsch](README.de.md)

A free, public, open-source learning platform that gives every basic role in a company an **adaptive learning path** built on openly licensed or freely accessible learning content.

- Pick a **role** and a **self-rated level** (Foundation, Practitioner, Advanced).
- A short **placement check** estimates your level per competency.
- The platform recommends the **next best learning unit**, checks mastery and schedules **spaced reviews**.
- English and German. No account, no cookies, no tracking: your progress stays in your browser (export/import as JSON).

> All units and questions are currently **AI-generated drafts, not yet reviewed by a human**. They are labeled as such on the site.

## Status

See [docs/ROADMAP.md](docs/ROADMAP.md) and [docs/STATUS.md](docs/STATUS.md). The project rules are in [CLAUDE.md](CLAUDE.md).

## Tech stack

Astro (static output) · TypeScript (strict) · Tailwind CSS · Preact islands · Astro content collections with Zod schemas · Vitest. Hosted on Cloudflare Pages (free tier). Running cost: $0.

## Development

```bash
npm ci
npm run dev                 # local dev server
npm run lint                # ESLint
npm run typecheck           # astro check + tsc
npm test                    # Vitest (engine, validator, i18n)
npm run validate:content    # content rules (schemas, en/de parity, licenses, coverage)
npm run build               # static site in dist/
```

Node.js 22 (see `.nvmrc`).

## Project layout

| Path | What |
|---|---|
| `src/engine/` | Deterministic adaptive engine (Elo ability, path ordering, mastery, Leitner reviews, export/import). See [docs/ENGINE.md](docs/ENGINE.md). |
| `src/content/` | Roles, competencies, units (`units/en`, `units/de`), assessment items, resources. Schemas in `src/content/schemas.ts`. |
| `src/validator/`, `scripts/validate-content.ts` | Content validator. |
| `src/i18n/` | UI strings (`en.ts`, `de.ts`). |
| `src/pages/`, `src/components/` | Pages and Preact islands. |
| `docs/` | Roadmap, status, decisions, blockers, sources, engine documentation. |

## Licenses

- Code: [MIT](LICENSE)
- Original content: [CC BY-SA 4.0](LICENSE-CONTENT)
- Third-party resources keep their own licenses; they are linked or attributed per [CLAUDE.md §6](CLAUDE.md) and listed in [docs/SOURCES.md](docs/SOURCES.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
