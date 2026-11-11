# Open Role Academy

[English](README.md)

Eine kostenlose, öffentliche Open-Source-Lernplattform, die jeder grundlegenden Rolle in einem Unternehmen einen **adaptiven Lernpfad** bietet – auf Basis offen lizenzierter oder frei zugänglicher Lerninhalte.

- Wähle eine **Rolle** und dein **selbst eingeschätztes Niveau** (Grundlagen, Fortgeschritten, Experte).
- Ein kurzer **Einstufungstest** schätzt dein Niveau pro Kompetenz.
- Die Plattform empfiehlt die **beste nächste Lerneinheit**, prüft deinen Lernstand und plant **Wiederholungen**.
- Englisch und Deutsch. Kein Konto, keine Cookies, kein Tracking: Dein Fortschritt bleibt in deinem Browser (Export/Import als JSON).

> Alle Einheiten und Fragen sind derzeit **KI-generierte Entwürfe, noch nicht von einem Menschen geprüft**. Sie sind auf der Website entsprechend gekennzeichnet.

## Stand

Siehe [docs/ROADMAP.md](docs/ROADMAP.md) und [docs/STATUS.md](docs/STATUS.md). Die Projektregeln stehen in [CLAUDE.md](CLAUDE.md).

## Technik

Astro (statische Ausgabe) · TypeScript (strict) · Tailwind CSS · Preact-Islands · Astro Content Collections mit Zod-Schemas · Vitest. Hosting auf Cloudflare Pages (kostenloser Tarif). Laufende Kosten: 0 $.

## Entwicklung

```bash
npm ci
npm run dev                 # lokaler Entwicklungsserver
npm run lint                # ESLint
npm run typecheck           # astro check + tsc
npm test                    # Vitest (Engine, Validator, i18n)
npm run validate:content    # Inhaltsregeln (Schemas, en/de-Parität, Lizenzen, Abdeckung)
npm run build               # statische Website in dist/
```

Node.js 22 (siehe `.nvmrc`).

## Lizenzen

- Code: [MIT](LICENSE)
- Eigene Inhalte: [CC BY-SA 4.0](LICENSE-CONTENT)
- Ressourcen Dritter behalten ihre eigenen Lizenzen; sie werden gemäß [CLAUDE.md §6](CLAUDE.md) verlinkt oder mit Namensnennung verwendet und in [docs/SOURCES.md](docs/SOURCES.md) aufgeführt.

## Mitmachen

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) (auf Englisch).
