/**
 * Checks every resource URL (and license URL). Prints a Markdown report.
 * Exit code 1 if any link is broken. Used by .github/workflows/link-check.yml.
 */
import { loadContent } from '../src/validator/load';

interface Result {
  file: string;
  url: string;
  status: string;
}

const UA = 'OpenRoleAcademy-LinkCheck/1.0 (+https://github.com/fdragonfpsy/open-role-academy)';

async function check(url: string): Promise<string | null> {
  for (const method of ['HEAD', 'GET'] as const) {
    try {
      const res = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20_000) });
      if (res.ok) return null;
      if (method === 'GET') return `HTTP ${res.status}`;
    } catch (e) {
      if (method === 'GET') return (e as Error).message;
    }
  }
  return 'unknown error';
}

const bundle = loadContent(process.cwd());
const targets: { file: string; url: string }[] = [];
for (const r of bundle.resources) {
  const d = r.data as { url?: string; licenseUrl?: string };
  if (d.url) targets.push({ file: r.file, url: d.url });
  if (d.licenseUrl) targets.push({ file: r.file, url: d.licenseUrl });
}
const unique = [...new Map(targets.map((t) => [t.url, t])).values()];
// 401/403/429 usually mean bot protection, not a dead page: report them for a manual check, don't fail.
const BLOCKED = /^HTTP (401|403|429)$/;
const broken: Result[] = [];
const unverifiable: Result[] = [];
for (const t of unique) {
  const status = await check(t.url);
  if (status && BLOCKED.test(status)) unverifiable.push({ ...t, status });
  else if (status) broken.push({ ...t, status });
}
console.log(`# Link check ${new Date().toISOString().slice(0, 10)}\n`);
console.log(`Checked ${unique.length} unique URLs from ${bundle.resources.length} resources.\n`);
if (broken.length === 0) {
  console.log('No broken links.');
} else {
  console.log('| File | URL | Problem |\n|---|---|---|');
  for (const b of broken) console.log(`| \`${b.file}\` | ${b.url} | ${b.status} |`);
}
if (unverifiable.length > 0) {
  console.log('\n## Needs a manual check (access blocked for automated clients)\n');
  console.log('| File | URL | Response |\n|---|---|---|');
  for (const b of unverifiable) console.log(`| \`${b.file}\` | ${b.url} | ${b.status} |`);
}
process.exit(broken.length > 0 ? 1 : 0);
