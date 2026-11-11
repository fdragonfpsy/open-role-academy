import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildLearningPath,
  computeGaps,
  createLearnerState,
  expectedScore,
  exportProgress,
  importProgress,
  isLevelMastered,
  masteredLevel,
  nextUnit,
  placementFinished,
  planPlacement,
  PLACEMENT_QUESTION_BUDGET,
  recordAnswer,
  reviewQueue,
  scheduleCard,
  selectMasteryItems,
  selectPlacementItem,
  updateRating,
  bandForRating,
  type EngineCompetency,
  type EngineItem,
  type EngineRole,
  type EngineUnit,
  type LearnerState,
} from '../src/engine';

const NOW = new Date('2026-01-10T09:00:00Z');
const TODAY = '2026-01-10';

const role: EngineRole = {
  id: 'demo',
  competencies: [
    { id: 'a', priority: 1, targets: { foundation: 'foundation', practitioner: 'practitioner', advanced: 'advanced' } },
    { id: 'b', priority: 3, targets: { foundation: 'foundation', practitioner: 'advanced', advanced: 'advanced' } },
    { id: 'c', priority: 2, targets: { foundation: null, practitioner: 'foundation', advanced: 'practitioner' } },
  ],
};
const competencies: EngineCompetency[] = [
  { id: 'a', prerequisites: ['b'] },
  { id: 'b', prerequisites: [] },
  { id: 'c', prerequisites: [] },
];
const units: EngineUnit[] = ['a', 'b', 'c'].flatMap((c) =>
  (['foundation', 'practitioner', 'advanced'] as const).map((level) => ({ id: `${c}-${level}`, competency: c, level })),
);
const item = (id: string, competency: string, level: EngineItem['level'], difficulty: number): EngineItem => ({
  id,
  competency,
  level,
  difficulty,
});
const itemsA: EngineItem[] = [
  item('a1', 'a', 'foundation', 900),
  item('a2', 'a', 'foundation', 1000),
  item('a3', 'a', 'practitioner', 1200),
  item('a4', 'a', 'practitioner', 1300),
  item('a5', 'a', 'advanced', 1500),
  item('a6', 'a', 'advanced', 1600),
];

describe('Elo model', () => {
  it('expected score is 0.5 for equal rating and difficulty', () => {
    expect(expectedScore(1000, 1000)).toBeCloseTo(0.5);
  });
  it('expected score follows the logistic formula', () => {
    expect(expectedScore(1000, 1400)).toBeCloseTo(1 / 11, 6);
  });
  it('updates by K·(score − p)', () => {
    expect(updateRating(1000, 1000, 1, 40)).toBeCloseTo(1020);
    expect(updateRating(1000, 1000, 0, 24)).toBeCloseTo(988);
  });
  it('maps ratings to level bands', () => {
    expect(bandForRating(799)).toBeNull();
    expect(bandForRating(800)).toBe('foundation');
    expect(bandForRating(1100)).toBe('practitioner');
    expect(bandForRating(1400)).toBe('advanced');
  });
});

describe('learner state', () => {
  it('uses the self-rating as prior', () => {
    expect(createLearnerState(role, 'foundation', NOW).competencies.a!.rating).toBe(950);
    expect(createLearnerState(role, 'practitioner', NOW).competencies.a!.rating).toBe(1250);
    expect(createLearnerState(role, 'advanced', NOW).competencies.a!.rating).toBe(1500);
  });
  it('uses K=40 in placement and K=24 afterwards', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    const i = item('x', 'a', 'foundation', 950);
    const p = recordAnswer(s, { item: i, correct: true, phase: 'placement', today: TODAY });
    const l = recordAnswer(s, { item: i, correct: true, phase: 'learning', today: TODAY });
    expect(p.competencies.a!.rating).toBeCloseTo(970);
    expect(l.competencies.a!.rating).toBeCloseTo(962);
  });
  it('does not mutate its input', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    const copy = JSON.stringify(s);
    recordAnswer(s, { item: itemsA[0]!, correct: true, phase: 'learning', today: TODAY });
    expect(JSON.stringify(s)).toBe(copy);
  });
});

describe('mastery', () => {
  it('requires both rating ≥ lower bound and ≥ 2 correct answers at that level', () => {
    let s = createLearnerState(role, 'foundation', NOW);
    s = recordAnswer(s, { item: itemsA[0]!, correct: true, phase: 'learning', today: TODAY });
    expect(isLevelMastered(s.competencies.a, 'foundation')).toBe(false);
    s = recordAnswer(s, { item: itemsA[1]!, correct: true, phase: 'learning', today: TODAY });
    expect(isLevelMastered(s.competencies.a, 'foundation')).toBe(true);
    expect(masteredLevel(s.competencies.a)).toBe('foundation');
  });
  it('is not reached with a low rating even with two correct answers', () => {
    const cs = {
      rating: 790,
      correctByLevel: { foundation: 2, practitioner: 0, advanced: 0 },
      answered: 5,
      answeredItems: [],
    };
    expect(isLevelMastered(cs, 'foundation')).toBe(false);
  });
  it('higher mastered level implies the lower ones for the path', () => {
    const cs = {
      rating: 1450,
      correctByLevel: { foundation: 0, practitioner: 0, advanced: 2 },
      answered: 2,
      answeredItems: [],
    };
    expect(masteredLevel(cs)).toBe('advanced');
  });
});

describe('learning path', () => {
  it('puts prerequisites first, then orders by weighted gap', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    const path = buildLearningPath(role, 'practitioner', s, competencies, units);
    const order = [...new Set(path.map((p) => p.competency))];
    // b is a prerequisite of a → b before a. c has a smaller weighted gap than a.
    expect(order).toEqual(['b', 'a', 'c']);
  });
  it('lists units from the next level up to the target level', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    const path = buildLearningPath(role, 'practitioner', s, competencies, units);
    expect(path.filter((p) => p.competency === 'b').map((p) => p.level)).toEqual([
      'foundation',
      'practitioner',
      'advanced',
    ]);
  });
  it('skips competencies without a target at the role level', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    const gaps = computeGaps(role, 'foundation', s);
    expect(gaps.map((g) => g.competency)).toEqual(['a', 'b']);
  });
  it('removes mastered levels and recomputes', () => {
    let s = createLearnerState(role, 'foundation', NOW);
    s = recordAnswer(s, { item: item('b1', 'b', 'foundation', 950), correct: true, phase: 'learning', today: TODAY });
    s = recordAnswer(s, { item: item('b2', 'b', 'foundation', 1000), correct: true, phase: 'learning', today: TODAY });
    const path = buildLearningPath(role, 'foundation', s, competencies, units);
    expect(path.map((p) => p.unit.id)).toEqual(['a-foundation']);
    expect(nextUnit(role, 'foundation', s, competencies, units)?.unit.id).toBe('a-foundation');
  });
  it('returns an empty path when every target is mastered', () => {
    const s: LearnerState = createLearnerState(role, 'advanced', NOW);
    for (const id of ['a', 'b']) {
      s.competencies[id] = { rating: 1500, correctByLevel: { foundation: 0, practitioner: 0, advanced: 2 }, answered: 2, answeredItems: [] };
    }
    expect(buildLearningPath(role, 'foundation', s, competencies, units)).toEqual([]);
    expect(nextUnit(role, 'foundation', s, competencies, units)).toBeNull();
  });
  it('throws on prerequisite cycles', () => {
    const cyclic: EngineCompetency[] = [
      { id: 'a', prerequisites: ['b'] },
      { id: 'b', prerequisites: ['a'] },
    ];
    const s = createLearnerState(role, 'foundation', NOW);
    expect(() => buildLearningPath(role, 'foundation', s, cyclic, units)).toThrow(/cycle/);
  });
  it('is deterministic', () => {
    const s = createLearnerState(role, 'practitioner', NOW);
    const a = buildLearningPath(role, 'advanced', s, competencies, units);
    const b = buildLearningPath(role, 'advanced', s, competencies, units);
    expect(a).toEqual(b);
  });
});

describe('item selection', () => {
  it('picks a harder item after a correct answer and an easier one after a wrong answer', () => {
    const s = createLearnerState(role, 'practitioner', NOW);
    const first = selectPlacementItem(itemsA, s.competencies.a!)!;
    expect(first.id).toBe('a3'); // a3 and a4 are both 50 away from 1250 → tie broken by id
    const afterCorrect = recordAnswer(s, { item: first, correct: true, phase: 'placement', today: TODAY });
    const harder = selectPlacementItem(itemsA, afterCorrect.competencies.a!, { item: first, correct: true })!;
    expect(harder.difficulty).toBeGreaterThan(first.difficulty);
    const afterWrong = recordAnswer(s, { item: first, correct: false, phase: 'placement', today: TODAY });
    const easier = selectPlacementItem(itemsA, afterWrong.competencies.a!, { item: first, correct: false })!;
    expect(easier.difficulty).toBeLessThan(first.difficulty);
  });
  it('returns null when all items are answered', () => {
    const cs = { rating: 1000, correctByLevel: { foundation: 0, practitioner: 0, advanced: 0 }, answered: 6, answeredItems: itemsA.map((i) => i.id) };
    expect(selectPlacementItem(itemsA, cs)).toBeNull();
  });
  it('limits placement to 3–5 items per competency', () => {
    expect(placementFinished(itemsA, 3, 3)).toBe(true);
    expect(placementFinished(itemsA, 3)).toBe(false);
    expect(placementFinished(itemsA, 4)).toBe(true);
    expect(placementFinished(itemsA, 5, 10)).toBe(true);
    expect(placementFinished(itemsA.slice(0, 2), 2)).toBe(true);
  });
  it('selects mastery items at the level, unanswered first', () => {
    const cs = { rating: 1000, correctByLevel: { foundation: 0, practitioner: 0, advanced: 0 }, answered: 1, answeredItems: ['a1'] };
    expect(selectMasteryItems(itemsA, 'foundation', cs).map((i) => i.id)).toEqual(['a2', 'a1']);
  });
});

describe('placement plan', () => {
  const comps = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `c${String(i).padStart(2, '0')}`, priority: ((i % 3) + 1) as 1 | 2 | 3 }));
  const counts = (n: number, k = 12) => Object.fromEntries(comps(n).map((c) => [c.id, k]));

  it('never exceeds the question budget', () => {
    for (const n of [1, 2, 3, 4, 5, 6, 10, 16]) {
      const plan = planPlacement(comps(n), counts(n));
      expect(plan.reduce((s, p) => s + p.items, 0)).toBeLessThanOrEqual(PLACEMENT_QUESTION_BUDGET);
      for (const p of plan) {
        expect(p.items).toBeGreaterThanOrEqual(3);
        expect(p.items).toBeLessThanOrEqual(5);
      }
    }
  });
  it('places high-priority competencies first when not all fit', () => {
    const plan = planPlacement(comps(16), counts(16));
    expect(plan).toHaveLength(5);
    expect(plan.slice(0, 5).every((p) => comps(16).find((c) => c.id === p.competency)!.priority <= 2)).toBe(true);
    expect(plan[0]!.competency).toBe('c00');
  });
  it('uses up to 5 items for a single competency and respects available items', () => {
    expect(planPlacement([{ id: 'a', priority: 1 }], { a: 12 })).toEqual([{ competency: 'a', items: 5 }]);
    expect(planPlacement([{ id: 'a', priority: 1 }], { a: 2 })).toEqual([{ competency: 'a', items: 2 }]);
    expect(planPlacement([{ id: 'a', priority: 1 }], { a: 0 })).toEqual([]);
  });
  it('splits the budget evenly for a few competencies', () => {
    expect(planPlacement(comps(3), counts(3)).map((p) => p.items)).toEqual([5, 5, 5]);
    expect(planPlacement(comps(4), counts(4)).map((p) => p.items)).toEqual([3, 3, 3, 3]);
  });
});

describe('Leitner review', () => {
  it('creates a card when an item level is mastered', () => {
    let s = createLearnerState(role, 'foundation', NOW);
    s = recordAnswer(s, { item: itemsA[0]!, correct: true, phase: 'learning', today: TODAY });
    expect(Object.keys(s.reviews)).toEqual([]);
    s = recordAnswer(s, { item: itemsA[1]!, correct: true, phase: 'learning', today: TODAY });
    expect(s.reviews.a2).toEqual({ itemId: 'a2', competency: 'a', box: 0, due: '2026-01-11' });
  });
  it('moves through boxes 1, 3, 7, 21 days and resets on a wrong answer', () => {
    let card = { itemId: 'x', competency: 'a', box: 0, due: TODAY };
    card = scheduleCard(card, true, TODAY);
    expect(card).toMatchObject({ box: 1, due: addDays(TODAY, 3) });
    card = scheduleCard(card, true, TODAY);
    expect(card).toMatchObject({ box: 2, due: addDays(TODAY, 7) });
    card = scheduleCard(card, true, TODAY);
    expect(card).toMatchObject({ box: 3, due: addDays(TODAY, 21) });
    card = scheduleCard(card, true, TODAY);
    expect(card).toMatchObject({ box: 3, due: addDays(TODAY, 21) });
    card = scheduleCard(card, false, TODAY);
    expect(card).toMatchObject({ box: 0, due: addDays(TODAY, 1) });
  });
  it('lists due cards in order', () => {
    const s = createLearnerState(role, 'foundation', NOW);
    s.reviews = {
      z: { itemId: 'z', competency: 'a', box: 0, due: '2026-01-09' },
      y: { itemId: 'y', competency: 'a', box: 0, due: '2026-01-10' },
      x: { itemId: 'x', competency: 'a', box: 0, due: '2026-01-09' },
      w: { itemId: 'w', competency: 'a', box: 0, due: '2026-01-11' },
    };
    expect(reviewQueue(s, TODAY).map((c) => c.itemId)).toEqual(['x', 'z', 'y']);
  });
});

describe('export / import', () => {
  it('round-trips the learner state', () => {
    let s = createLearnerState(role, 'practitioner', NOW);
    s = recordAnswer(s, { item: itemsA[2]!, correct: true, phase: 'placement', today: TODAY });
    s = recordAnswer(s, { item: itemsA[3]!, correct: true, phase: 'placement', today: TODAY });
    expect(importProgress(exportProgress(s, NOW))).toEqual(s);
  });
  it('rejects invalid files', () => {
    expect(() => importProgress('not json')).toThrow(/JSON/);
    expect(() => importProgress('{"format":"other"}')).toThrow(/Invalid progress file/);
  });
});
