# Adaptive engine

Source: `src/engine/` (pure TypeScript, no I/O, no randomness, no LLM). Tests: `tests/engine.test.ts`.
All functions are **deterministic**: the same inputs (including the date passed in) give the same outputs. State updates return new objects; inputs are never mutated.

## 1. Levels and bands (`levels.ts`)

| Level | Rating band | Prior (self-rating) | Item difficulty at authoring |
|---|---|---|---|
| foundation | 800–1099 | 950 | 950 ± 100 |
| practitioner | 1100–1399 | 1250 | 1250 ± 100 |
| advanced | ≥ 1400 | 1500 | 1550 ± 100 |

## 2. Ability model (`elo.ts`, `state.ts`)

- One Elo-style rating θ per competency. Item difficulty *b* is on the same scale.
- Expected score: `p = 1 / (1 + 10^((b − θ) / 400))`
- Update after an answer: `θ ← θ + K · (score − p)`, score ∈ {0, 1}; **K = 40** in placement, **K = 24** afterwards (learning and review).
- `createLearnerState(role, selfLevel, now)` sets θ = prior of the self-rated level for every competency of the role.
- `recordAnswer(state, { item, correct, phase, today })` updates θ, counts correct answers per item level, records the answered item and maintains review cards (§5).

## 3. Mastery (`mastery.ts`)

A level is **mastered** when θ ≥ the lower bound of that level's band **and** the learner has answered **≥ 2 items of that level correctly**.
`masteredLevel()` returns the highest mastered level. Mastering a higher level implies the lower ones (the learner is not sent back to easier units).

## 4. Learning path (`path.ts`)

The learner's self-rated level is also the **role level** whose targets apply (role YAML: `targets.foundation|practitioner|advanced`). Competencies with a `null` target at that role level are skipped.

For each competency:
- `levelGap = rank(target) − rank(mastered)` (ranks: none 0, foundation 1, practitioner 2, advanced 3)
- `ratingGap = max(0, lowerBound(target) − θ)`
- `score = (levelGap + ratingGap / 300) × (4 − priority)` (priority 1 → weight 3, 2 → 2, 3 → 1)

Ordering (`buildLearningPath`):
1. Keep competencies with `levelGap > 0`.
2. Topological order over prerequisites (only prerequisites that are themselves open count; satisfied or out-of-role prerequisites are ignored).
3. Among competencies whose open prerequisites are already placed: highest score first, ties broken by id.
4. Each competency contributes its units from the level after the mastered level up to the target level, in level order. A completed but not yet mastered unit stays in the path so the mastery check can be retaken.
5. A prerequisite cycle throws an error (the content validator also rejects cycles).

`nextUnit()` = first step of the path, or `null` when every target is mastered.

## 5. Item selection (`selection.ts`)

- **Placement** (`selectPlacementItem`): after a correct answer choose among unanswered items *harder* than the last item, after a wrong answer among *easier* ones; within that set pick the item whose difficulty is closest to the current θ (ties by id). Without a previous answer, or if no item exists in the required direction, pick the closest unanswered item.
- **Placement plan** (`planPlacement`): the whole placement check has a budget of **15 questions** (≈ 1 minute each, so ≤ 15 minutes). Competencies that have a target at the learner's level and at least one item are ordered by priority (1 first), then id. At most ⌊15 / 3⌋ = 5 competencies are placed; each gets ⌊15 / n⌋ items, clamped to 3–5 and to the available items. Competencies left out keep their prior rating and are assessed through mastery checks later.
- **Placement length per competency** (`placementFinished`): stops at the planned number of items (clamped to 3–5) or when the competency has no more items. Placement can be skipped entirely (prior only).
- **Mastery check** (`selectMasteryItems`): up to 4 items of the unit's level, unanswered items first, each group ordered by difficulty then id.

## 6. Reviews (`review.ts`)

Simple Leitner boxes with intervals **1, 3, 7, 21 days** (boxes 0–3).
- A card is created for an item when it is answered correctly and the item's level is mastered at that moment (due in 1 day, box 0).
- Any later answer to a carded item reschedules it: correct → next box (max box 3), wrong → box 0. Due date = today + interval of the new box.
- `reviewQueue(state, today)` lists cards with `due ≤ today`, oldest first, then by item id.
- Dates are ISO calendar dates (`YYYY-MM-DD`, UTC).

## 7. Export / import (`persistence.ts`)

`exportProgress(state, now)` produces JSON `{ format: "open-role-academy-progress", exportedAt, state }`.
`importProgress(json)` validates it with Zod and returns the state or throws a descriptive error. Round-trip is tested.
In the browser the state is stored in `localStorage` under `open-role-academy.progress.v1` (`src/lib/storage.ts`).

## 8. UI integration

- Answer options are shown in a deterministic shuffled order seeded by the item id (`src/lib/shuffle.ts`), because authors tend to write the correct option first.
- Islands: `Onboarding` (role, level, placement), `MasteryCheck` (unit page), `Dashboard` (levels vs. targets, path, review queue, export/import/reset).
