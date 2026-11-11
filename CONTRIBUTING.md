# Contributing

Thanks for helping! Contributions in English or German are welcome.

## Ground rules

Read [CLAUDE.md](CLAUDE.md) first — it is the project constitution. The most important rules:

1. **$0 running cost, static site, no personal data.** No accounts, analytics, cookies or third-party embeds that set cookies.
2. **Licensing (CLAUDE.md §6).** Only CC0 / public domain / CC BY / CC BY-SA material may be embedded or adapted (with attribution). NC and ND material and free-access vendor content are **link only**. Unclear license → exclude. Never copy long passages from any source.
3. **Every learner-facing text exists in English and German.** German uses the "du" form and gender-inclusive wording where it reads naturally.
4. **Facts must be traceable** to the unit's `sources`. No invented statistics, laws, numbers or quotes.

## Adding content

- Competency: `src/content/competencies/<id>.yaml`
- Unit: `src/content/units/en/<competency>-<level>.mdx` **and** `src/content/units/de/<competency>-<level>.mdx` (300–800 words: explanation, worked example, key takeaways)
- Items: `src/content/items/<competency>.yaml` (≥ 6 per competency, ≥ 2 per required level; difficulty foundation 950 ± 100, practitioner 1250 ± 100, advanced 1550 ± 100)
- Resource: `src/content/resources/<id>.yaml` with `license`, `licenseUrl`, `licenseVerifiedOn`

New content starts with `status: ai-draft` (shown with a label on the site). Human reviewers may set `status: reviewed`.

## Before opening a pull request

```bash
npm run lint && npm run typecheck && npm test && npm run validate:content && npm run build
```

All must pass. Never disable a check to make it pass.

## Licensing of contributions

By contributing you agree that code is licensed under MIT and content under CC BY-SA 4.0.
