import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../src/validator/bundle';
import { countWords, validateContent } from '../src/validator/validate';
import { loadContent, splitFrontmatter } from '../src/validator/load';

const TODAY = '2026-01-10';
const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');
const L = (s: string) => ({ en: s, de: `${s} (de)` });

const levels = ['foundation', 'practitioner', 'advanced'] as const;
const centre = { foundation: 950, practitioner: 1250, advanced: 1550 };

function validBundle(): ContentBundle {
  const unit = (lang: 'en' | 'de', level: (typeof levels)[number]) => ({
    file: `src/content/units/${lang}/sec-${level}.mdx`,
    lang,
    name: `sec-${level}`,
    body: words(350),
    data: {
      id: `sec-${level}`,
      competency: 'sec',
      level,
      title: 'Security',
      objectives: ['Know things'],
      minutes: 15,
      resources: ['res-link'],
      status: 'ai-draft',
      sources: [],
    },
  });
  return {
    roles: [
      {
        file: 'src/content/roles/core-track.yaml',
        data: {
          id: 'core-track',
          kind: 'core',
          title: L('Core'),
          summary: L('Core track'),
          competencies: [
            { id: 'sec', priority: 1, targets: { foundation: 'foundation', practitioner: 'practitioner', advanced: 'advanced' } },
          ],
        },
      },
    ],
    competencies: [
      {
        file: 'src/content/competencies/sec.yaml',
        data: { id: 'sec', title: L('Sec'), description: L('Security'), prerequisites: [], track: 'core', frameworkRefs: [] },
      },
    ],
    units: levels.flatMap((l) => [unit('en', l), unit('de', l)]),
    items: [
      {
        file: 'src/content/items/sec.yaml',
        data: {
          competency: 'sec',
          items: levels.flatMap((l) =>
            [0, 1].map((n) => ({
              id: `sec-${l}-${n}`,
              level: l,
              difficulty: centre[l] + (n === 0 ? -50 : 50),
              type: 'single',
              stem: L('Question?'),
              options: [
                { en: 'Yes', de: 'Ja', correct: true },
                { en: 'No', de: 'Nein', correct: false },
              ],
              explanation: L('Because.'),
              source: 'https://example.org',
            })),
          ),
        },
      },
    ],
    resources: [
      {
        file: 'src/content/resources/res-link.yaml',
        data: {
          id: 'res-link',
          url: 'https://example.org/a',
          title: 'A',
          provider: 'Example',
          language: 'en',
          format: 'article',
          minutes: 10,
          license: 'free-access',
          licenseUrl: 'https://example.org/terms',
          licenseVerifiedOn: '2026-01-01',
          mode: 'link',
          competencies: ['sec'],
          levels: ['foundation'],
        },
      },
    ],
  };
}

const errors = (b: ContentBundle) => validateContent(b, { today: TODAY }).filter((i) => i.level === 'error');
const messages = (b: ContentBundle) => errors(b).map((e) => e.message).join('\n');
// Helper to mutate nested unknown data in tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d = (x: unknown) => x as any;

describe('content validator', () => {
  it('accepts a valid bundle', () => {
    expect(errors(validBundle())).toEqual([]);
  });

  it('reports schema errors, including missing translations of strings', () => {
    const b = validBundle();
    d(b.competencies[0]!.data).title = { en: 'Only English' };
    expect(messages(b)).toMatch(/schema: title.de/);
  });

  it('enforces en/de unit parity', () => {
    const b = validBundle();
    b.units = b.units.filter((u) => !(u.lang === 'de' && u.name === 'sec-advanced'));
    expect(messages(b)).toMatch(/missing de translation for unit sec\/advanced/);
  });

  it('rejects mode: embed for non-whitelisted licenses', () => {
    const b = validBundle();
    d(b.resources[0]!.data).mode = 'embed';
    d(b.resources[0]!.data).license = 'CC-BY-NC-4.0';
    expect(messages(b)).toMatch(/does not allow mode: embed/);
  });

  it('requires attribution for embedded resources and adapted sources', () => {
    const b = validBundle();
    d(b.resources[0]!.data).mode = 'embed';
    d(b.resources[0]!.data).license = 'CC-BY-4.0';
    expect(messages(b)).toMatch(/needs a source entry with usage: embedded/);

    const b2 = validBundle();
    d(b2.units[0]!.data).sources = [{ title: 'X', url: 'https://example.org/x', usage: 'adapted' }];
    const m = messages(b2);
    expect(m).toMatch(/attribution needs title, author/);
    expect(m).toMatch(/must describe changes made/);
  });

  it('forbids adapting non-open sources', () => {
    const b = validBundle();
    d(b.units[0]!.data).sources = [
      { title: 'X', author: 'Y', url: 'https://example.org/x', license: 'CC-BY-ND-4.0', licenseUrl: 'https://example.org/l', usage: 'adapted', changes: 'translated' },
    ];
    expect(messages(b)).toMatch(/may not be adapted/);
  });

  it('requires units for every required level and ≥ 6 items', () => {
    const b = validBundle();
    b.units = b.units.filter((u) => u.name !== 'sec-practitioner');
    d(b.items[0]!.data).items = d(b.items[0]!.data).items.slice(0, 4);
    const m = messages(b);
    expect(m).toMatch(/no en unit for level practitioner/);
    expect(m).toMatch(/has 4 items/);
    expect(m).toMatch(/has 0 advanced items/);
  });

  it('detects dead internal references', () => {
    const b = validBundle();
    d(b.units[0]!.data).resources = ['does-not-exist'];
    d(b.competencies[0]!.data).prerequisites = ['ghost'];
    d(b.roles[0]!.data).competencies.push({ id: 'nope', priority: 2, targets: { foundation: null, practitioner: null, advanced: null } });
    const m = messages(b);
    expect(m).toMatch(/unknown resource "does-not-exist"/);
    expect(m).toMatch(/unknown prerequisite "ghost"/);
    expect(m).toMatch(/unknown competency "nope"/);
  });

  it('checks item correctness rules and difficulty ranges', () => {
    const b = validBundle();
    const items = d(b.items[0]!.data).items;
    items[0].options[1].correct = true;
    items[1].difficulty = 1500;
    const m = messages(b);
    expect(m).toMatch(/exactly 1 correct option/);
    expect(m).toMatch(/outside the foundation range/);
  });

  it('enforces 8–12 role-specific competencies for role families', () => {
    const b = validBundle();
    d(b.roles[0]!.data).kind = 'role';
    expect(messages(b)).toMatch(/role needs 8–12 role-specific competencies \(has 0\)/);
  });

  it('enforces unit length', () => {
    const b = validBundle();
    b.units[0]!.body = words(100);
    expect(messages(b)).toMatch(/100 words/);
  });

  it('warns about stale license verification and errors on future dates', () => {
    const b = validBundle();
    d(b.resources[0]!.data).licenseVerifiedOn = '2025-01-01';
    expect(validateContent(b, { today: TODAY }).some((i) => i.level === 'warning')).toBe(true);
    d(b.resources[0]!.data).licenseVerifiedOn = '2027-01-01';
    expect(messages(b)).toMatch(/in the future/);
  });

  it('warns when a competency has no framework reference', () => {
    const b = validBundle();
    const warnings = validateContent(b, { today: TODAY }).filter((i) => i.level === 'warning');
    expect(warnings.map((w) => w.message).join()).toMatch(/frameworkRefs/);
  });

  it('detects prerequisite cycles', () => {
    const b = validBundle();
    b.competencies.push({
      file: 'src/content/competencies/other.yaml',
      data: { id: 'other', title: L('O'), description: L('O'), prerequisites: ['sec'], track: 'core' },
    });
    d(b.competencies[0]!.data).prerequisites = ['other'];
    expect(messages(b)).toMatch(/prerequisite cycle/);
  });
});

describe('helpers', () => {
  it('counts words without markup', () => {
    expect(countWords('## Title\n\nSome **bold** [link](https://x.y) text.\nimport X from "y";')).toBe(5);
  });
  it('splits frontmatter', () => {
    expect(splitFrontmatter('---\na: 1\n---\nbody')).toEqual({ data: { a: 1 }, body: 'body' });
  });
});

describe('repository content', () => {
  it('passes validation without errors', () => {
    const bundle = loadContent(process.cwd());
    const today = new Date().toISOString().slice(0, 10);
    expect(validateContent(bundle, { today }).filter((i) => i.level === 'error')).toEqual([]);
  });
});
