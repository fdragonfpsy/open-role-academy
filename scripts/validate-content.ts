/** CLI: `npm run validate:content`. Exits 1 on any error; warnings are printed but do not fail. */
import { loadContent } from '../src/validator/load';
import { validateContent } from '../src/validator/validate';

const bundle = loadContent(process.cwd());
const today = new Date().toISOString().slice(0, 10);
const issues = validateContent(bundle, { today });
const errors = issues.filter((i) => i.level === 'error');
const warnings = issues.filter((i) => i.level === 'warning');

for (const i of issues) console.log(`${i.level === 'error' ? 'ERROR' : 'warn '}  ${i.file}: ${i.message}`);
console.log(
  `\nContent: ${bundle.roles.length} roles, ${bundle.competencies.length} competencies, ` +
    `${bundle.units.length} units, ${bundle.items.reduce((n, f) => n + (((f.data as { items?: unknown[] })?.items?.length) ?? 0), 0)} items, ` +
    `${bundle.resources.length} resources`,
);
console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
