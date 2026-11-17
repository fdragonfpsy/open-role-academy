# Launch checklist

What the **owner** must do before the first public launch. Claude never fills these in (CLAUDE.md §2, §9).

## 1. Legal placeholders (required)
Replace in `src/components/pages/ImprintPage.astro` and `src/components/pages/PrivacyPage.astro` (constants `owner`, `address`, `email`):
- `{{OWNER_NAME}}` — full name of the responsible person
- `{{OWNER_ADDRESS}}` — postal address (ladungsfähige Anschrift, required for a German Impressum)
- `{{CONTACT_EMAIL}}` — contact email address

Then read both pages (en/de) once; check that they match reality. The privacy policy currently describes only static hosting on Cloudflare Pages (server logs), no cookies, progress in the browser. It must be updated **before** accounts (`accountsEnabled` in `src/config/supabase.ts`) or the AI tutor go live (roadmap Phase 3b).

## 2. Cloudflare Pages
1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the GitHub repo `fdragonfpsy/open-role-academy`.
2. Production branch `main`; build command `npm run build`; output directory `dist`; Node version 20 or newer (set `NODE_VERSION` if needed).
3. After the first deploy, check the final URL. If it differs from `https://open-role-academy.pages.dev`, update `site` in `astro.config.*` (used for canonical and hreflang links).
4. No tokens are needed in this repo.

## 3. Pre-launch verification
- [ ] CI green on `main` (`lint`, `typecheck`, `test`, `validate:content`, `build`).
- [ ] `npm run e2e` against `npm run preview` passes (placement, unit, dashboard, mobile).
- [ ] Open `/` and `/de/` on the deployed site; switch language; run placement → unit → dashboard once.
- [ ] Imprint and privacy pages show no `{{…}}` placeholders.
- [ ] Footer states licenses: code MIT, content CC BY-SA 4.0.
- [ ] Spot-check a few AI-draft units/items yourself (all content is labelled "AI-generated, not yet reviewed").

## 4. Known limits at launch
- All content is `ai-draft`; no human review yet.
- Resources are link-only; a few competencies lack a non-Wikipedia resource (see `docs/STATUS.md`).
- Accounts and sync (Phase 3b) are disabled; progress lives in the browser (JSON export/import).

## 5. Status
The site is **ready to launch except for sections 1 and 2**, which only the owner can complete.
