/** CLI: `npm run docs:framework` — regenerates docs/FRAMEWORK.md from the YAML content. */
import { writeFileSync } from 'node:fs';
import { loadContent } from '../src/validator/load';
import { renderFramework } from '../src/validator/framework';

writeFileSync('docs/FRAMEWORK.md', renderFramework(loadContent(process.cwd())));
console.log('docs/FRAMEWORK.md written.');
