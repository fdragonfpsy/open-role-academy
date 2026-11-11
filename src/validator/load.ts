import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { ContentBundle, RawFile, RawUnit } from './bundle';

/** Split an MDX/Markdown file into YAML frontmatter and body. */
export function splitFrontmatter(source: string): { data: unknown; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { data: undefined, body: source };
  return { data: parseYaml(match[1] ?? ''), body: match[2] ?? '' };
}

function listFiles(dir: string, ext: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => join(dir, f));
}

function loadYamlDir(root: string, contentDir: string, sub: string): RawFile[] {
  return listFiles(join(contentDir, sub), '.yaml').map((path) => {
    const file = relative(root, path);
    try {
      return { file, data: parseYaml(readFileSync(path, 'utf8')) as unknown };
    } catch (e) {
      return { file, data: { __parseError: String(e) } };
    }
  });
}

/** Load all content from `<root>/src/content`. */
export function loadContent(root: string): ContentBundle {
  const contentDir = join(root, 'src', 'content');
  const units: RawUnit[] = [];
  for (const lang of ['en', 'de'] as const) {
    for (const path of listFiles(join(contentDir, 'units', lang), '.mdx')) {
      const { data, body } = splitFrontmatter(readFileSync(path, 'utf8'));
      units.push({ file: relative(root, path), lang, name: basename(path, '.mdx'), data, body });
    }
  }
  return {
    roles: loadYamlDir(root, contentDir, 'roles'),
    competencies: loadYamlDir(root, contentDir, 'competencies'),
    units,
    items: loadYamlDir(root, contentDir, 'items'),
    resources: loadYamlDir(root, contentDir, 'resources'),
  };
}
