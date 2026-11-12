# Blockers

Open items that could not be solved autonomously. Newest first.

- 2026-11-12 — (owner) Accounts: the Supabase project exists (EU, auto-RLS on, site URL and redirect URLs set; config in `src/config/supabase.ts`). Still open: (1) email sending for confirmation/reset — owner registers a free domain (DigitalPlat FreeDomain, e.g. `*.dpdns.org`, nameservers on Cloudflare) and a free email sender without credit card (Brevo or Resend); (2) applying SQL migrations — connect the GitHub repo in the Supabase project (GitHub integration) so `supabase/migrations` deploy on merge. Until then keep `accountsEnabled: false`. **2026-11-12 update: resolved without a domain — email via Brevo SMTP (owner-managed). Remaining owner step: apply SQL migrations (Supabase SQL editor or GitHub integration).**


## Resolved
- 2026-11-12 — `frameworkRefs` re-mapped to DigComp 3.0 names (4 core competencies); CLAUDE.md §4.4 now requires DigComp 3.0.
- 2026-11-11 — Previous run could not push (GitHub write access missing). Resolved: write access now works; Phase 0 rebuilt from scratch.
