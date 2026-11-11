import { LEVELS, LEVEL_LOWER_BOUND, levelRank, type Level } from './levels';
import { masteredLevel } from './mastery';
import type { EngineCompetency, EngineRole, EngineUnit, LearnerState } from './types';

export interface CompetencyGap {
  competency: string;
  target: Level;
  mastered: Level | null;
  /** Number of levels between mastered level and target. */
  levelGap: number;
  /** Rating points missing to the lower bound of the target band (≥ 0). */
  ratingGap: number;
  priority: 1 | 2 | 3;
  /** Sort score: (levelGap + ratingGap / 300) × (4 − priority). */
  score: number;
}

export interface PathStep {
  unit: EngineUnit;
  competency: string;
  level: Level;
}

/** Gap per role competency for the learner's role level. Competencies without a target are skipped. */
export function computeGaps(role: EngineRole, roleLevel: Level, state: LearnerState): CompetencyGap[] {
  const gaps: CompetencyGap[] = [];
  for (const rc of role.competencies) {
    const target = rc.targets[roleLevel];
    if (!target) continue;
    const cs = state.competencies[rc.id];
    const mastered = masteredLevel(cs);
    const levelGap = Math.max(0, levelRank(target) - levelRank(mastered));
    const rating = cs?.rating ?? 0;
    const ratingGap = Math.max(0, LEVEL_LOWER_BOUND[target] - rating);
    const weight = 4 - rc.priority;
    gaps.push({
      competency: rc.id,
      target,
      mastered,
      levelGap,
      ratingGap,
      priority: rc.priority,
      score: (levelGap + ratingGap / 300) * weight,
    });
  }
  return gaps;
}

/**
 * Ordered learning path (CLAUDE.md §7.1 step 3):
 * 1. only competencies with an open level gap;
 * 2. prerequisites first (topological order, prerequisites outside the open set are ignored);
 * 3. among available competencies: highest score first, ties broken by id;
 * 4. each competency contributes its units from the next level up to the target level.
 * Throws on prerequisite cycles.
 */
export function buildLearningPath(
  role: EngineRole,
  roleLevel: Level,
  state: LearnerState,
  competencies: EngineCompetency[],
  units: EngineUnit[],
): PathStep[] {
  const open = computeGaps(role, roleLevel, state).filter((g) => g.levelGap > 0);
  const openIds = new Set(open.map((g) => g.competency));
  const prereqs = new Map<string, string[]>();
  for (const g of open) {
    const def = competencies.find((c) => c.id === g.competency);
    prereqs.set(g.competency, (def?.prerequisites ?? []).filter((p) => openIds.has(p)));
  }

  const ordered: CompetencyGap[] = [];
  const done = new Set<string>();
  const remaining = [...open];
  while (remaining.length > 0) {
    const available = remaining.filter((g) =>
      (prereqs.get(g.competency) ?? []).every((p) => done.has(p)),
    );
    if (available.length === 0) {
      throw new Error(`Prerequisite cycle among: ${remaining.map((g) => g.competency).join(', ')}`);
    }
    available.sort((a, b) => b.score - a.score || a.competency.localeCompare(b.competency));
    const pick = available[0]!;
    ordered.push(pick);
    done.add(pick.competency);
    remaining.splice(remaining.indexOf(pick), 1);
  }

  const steps: PathStep[] = [];
  for (const g of ordered) {
    const from = levelRank(g.mastered); // index of next level in LEVELS
    const to = levelRank(g.target);
    for (let i = from; i < to; i++) {
      const level = LEVELS[i]!;
      const unit = units.find((u) => u.competency === g.competency && u.level === level);
      // Completed-but-not-mastered units stay in the path so the mastery check can be retaken.
      if (unit) steps.push({ unit, competency: g.competency, level });
    }
  }
  return steps;
}

/** Next recommended unit = first step of the path (or null when every target is mastered). */
export function nextUnit(...args: Parameters<typeof buildLearningPath>): PathStep | null {
  return buildLearningPath(...args)[0] ?? null;
}
