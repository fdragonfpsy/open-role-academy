// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Build-time switch, mirrored by `accountsEnabled` in src/config/supabase.ts. Default: off.
// When off, the account pages are not part of the build at all (no routes, no supabase-js chunk).
const accountsEnabled = process.env.PUBLIC_ACCOUNTS_ENABLED === 'true';

/** @type {import('astro').AstroIntegration} */
const accountRoutes = {
  name: 'account-routes',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (!accountsEnabled) return;
      injectRoute({ pattern: '/account', entrypoint: './src/account-pages/en.astro' });
      injectRoute({ pattern: '/de/account', entrypoint: './src/account-pages/de.astro' });
    },
  },
};

export default defineConfig({
  output: 'static',
  site: 'https://open-role-academy.pages.dev',
  trailingSlash: 'ignore',
  integrations: [preact(), mdx(), accountRoutes],
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  // `__ACCOUNTS_ENABLED__` lets the bundler drop the progress-sync code path entirely when accounts are off.
  vite: { plugins: [tailwindcss()], define: { __ACCOUNTS_ENABLED__: JSON.stringify(accountsEnabled) } },
});
