# Launch checklist

What the **owner** must do before the first public launch. Claude never fills these in (CLAUDE.md §2, §9).

## 1. Legal placeholders (required)
Replace in `src/components/pages/ImprintPage.astro` and `src/components/pages/PrivacyPage.astro` (constants `owner`, `address`, `email`):
- `{{OWNER_NAME}}` — full name of the responsible person
- `{{OWNER_ADDRESS}}` — postal address (ladungsfähige Anschrift, required for a German Impressum)
- `{{CONTACT_EMAIL}}` — contact email address

Then read both pages (en/de) once; check that they match reality. With accounts off, the privacy policy describes only static hosting on Cloudflare Pages (server logs), no cookies, progress in the browser. With accounts on it additionally covers Supabase, Brevo, retention and rights (section 5). It must be updated **before** the AI tutor goes live (roadmap Phase 5).

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
- Accounts and sync (Phase 3b) are disabled (see section 5 before enabling); progress lives in the browser (JSON export/import).

## 5. Before enabling accounts
Accounts are off by default (`accountsEnabled` in `src/config/supabase.ts`, build flag `PUBLIC_ACCOUNTS_ENABLED`). Do all of this first:
1. Apply the migration `supabase/migrations/20261117210000_init_profiles_progress.sql` (Supabase SQL editor or GitHub integration; see `supabase/README.md`).
2. Run the RLS checklist `supabase/tests/rls_checklist.md` against the real project (two test users; each sees only their own rows; anonymous sees nothing; export and delete work).
3. Verify the processor details and transfer wording on the privacy page against the current Supabase and Brevo documents (DPA concluded or accepted, data region EU for the Supabase project, sub-processors, retention of email logs). Adjust section 7 of the account privacy text (`src/components/pages/PrivacyAccounts.astro`) if reality differs. Hint: {{OWNER_TO_VERIFY_PROCESSOR_DETAILS}} (Supabase DPA, Brevo DPA, any transfers outside the EU/EEA).
4. Fill the placeholders (section 1) and read the privacy page with accounts on: build with `PUBLIC_ACCOUNTS_ENABLED=true` locally and open `/privacy` and `/de/privacy`. Have a lawyer or data protection officer check it if you can.
5. Confirm email sending works (Brevo SMTP set up in Supabase; confirmation, magic link and reset mails arrive, also check spam).
6. In the Cloudflare Pages project set the build environment variable `PUBLIC_ACCOUNTS_ENABLED=true` (production), then redeploy.

## 6. Status
The site is **ready to launch except for sections 1 and 2**, which only the owner can complete.
