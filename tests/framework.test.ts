import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderFramework } from '../src/validator/framework';
import { loadContent } from '../src/validator/load';

describe('docs/FRAMEWORK.md', () => {
  it('is up to date with the YAML (run `npm run docs:framework`)', () => {
    const expected = renderFramework(loadContent(process.cwd()));
    expect(readFileSync('docs/FRAMEWORK.md', 'utf8')).toBe(expected);
  });
  it('lists every role and the target notation', () => {
    const md = renderFramework(loadContent(process.cwd()));
    expect(md).toMatch(/## Core skills for every role/);
    expect(md).toMatch(/\| Information security basics \| core \| 1 \|/);
  });
});
