import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const dir = join(root, 'supabase', 'migrations');
const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
const sql = (f: string) => readFileSync(join(dir, f), 'utf8');
/** Strip `--` and `comment on` text so checks look at statements only. */
const code = (f: string) =>
  sql(f)
    .replace(/--.*$/gm, '')
    .replace(/comment on [^;]*;/gi, '');

describe('supabase migrations', () => {
  it('exist and are timestamp-named', () => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(f).toMatch(/^\d{14}_[a-z0-9_]+\.sql$/);
  });

  for (const f of files) {
    describe(f, () => {
      it('enables RLS on every created table', () => {
        const c = code(f);
        const tables = [...c.matchAll(/create table\s+(?:if not exists\s+)?(public\.\w+)/gi)].map((m) => m[1] ?? '');
        expect(tables.length).toBeGreaterThan(0);
        for (const t of tables) {
          const re = new RegExp(`alter table\\s+${t.replace('.', '\\.')}\\s+enable row level security`, 'i');
          expect(c, `RLS missing for ${t}`).toMatch(re);
        }
      });

      it('never grants table access to anon or public', () => {
        for (const m of code(f).matchAll(/grant\s[^;]*?\sto\s+([^;]*);/gi)) {
          expect(m[1], m[0]).not.toMatch(/\b(anon|public)\b/i);
        }
      });

      it('has no employer, company or birth-date columns', () => {
        expect(code(f)).not.toMatch(/\b\w*(employer|company|birth|dob|firstname|lastname|full_name)\w*\b/i);
      });

      it('scopes policies to authenticated', () => {
        for (const m of code(f).matchAll(/create policy[^;]*;/gi)) {
          expect(m[0]).toMatch(/to authenticated/i);
          expect(m[0]).toMatch(/\(select auth\.uid\(\)\)/i);
        }
      });

      it('sets an empty search_path on security definer functions', () => {
        for (const m of code(f).matchAll(/create or replace function[\s\S]*?\$\$;/gi)) {
          if (/security definer/i.test(m[0])) expect(m[0]).toMatch(/set search_path = ''/i);
        }
      });
    });
  }

  it('contains no service-role key or secret in the repo text files', () => {
    const skip = new Set(['node_modules', 'dist', '.git', '.astro']);
    const hits: string[] = [];
    const walk = (d: string) => {
      for (const n of readdirSync(d)) {
        if (skip.has(n)) continue;
        const p = join(d, n);
        const s = statSync(p);
        if (s.isDirectory()) walk(p);
        else if (/\.(ts|tsx|astro|mjs|js|json|ya?ml|sql|md|mdx|env.*)$/.test(n) && s.size < 2_000_000) {
          if (p.endsWith('supabase-migrations.test.ts')) continue;
          const t = readFileSync(p, 'utf8');
          if (/service_role\s*[:=]\s*['"]?eyJ|sb_secret_[A-Za-z0-9_-]{10,}|eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\./.test(t)) hits.push(p);
        }
      }
    };
    walk(root);
    expect(hits).toEqual([]);
  });
});
