import { K_LEARNING, K_PLACEMENT, updateRating } from './elo';
import { PRIOR_RATING, type Level } from './levels';
import { isLevelMastered } from './mastery';
import { newCard, scheduleCard } from './review';
import type { AnswerPhase, CompetencyState, EngineItem, EngineRole, LearnerState } from './types';

export function emptyCompetencyState(rating: number): CompetencyState {
  return {
    rating,
    correctByLevel: { foundation: 0, practitioner: 0, advanced: 0 },
    answered: 0,
    answeredItems: [],
  };
}

/** Create a learner state. The self-rating sets the prior for every competency of the role. */
export function createLearnerState(role: EngineRole, selfLevel: Level, now: Date): LearnerState {
  const prior = PRIOR_RATING[selfLevel];
  const competencies: Record<string, CompetencyState> = {};
  for (const c of role.competencies) competencies[c.id] = emptyCompetencyState(prior);
  return {
    version: 1,
    roleId: role.id,
    selfLevel,
    createdAt: now.toISOString(),
    placementDone: false,
    competencies,
    reviews: {},
    completedUnits: [],
  };
}

export interface AnswerInput {
  item: EngineItem;
  correct: boolean;
  phase: AnswerPhase;
  /** ISO date (YYYY-MM-DD) of the answer, used for review scheduling. */
  today: string;
}

/**
 * Apply one answer: Elo update (K = 40 in placement, 24 otherwise), count correct answers per level,
 * and maintain Leitner review cards. Returns a new state; the input is not mutated.
 */
export function recordAnswer(state: LearnerState, input: AnswerInput): LearnerState {
  const { item, correct, phase, today } = input;
  const prev =
    state.competencies[item.competency] ?? emptyCompetencyState(PRIOR_RATING[state.selfLevel]);
  const k = phase === 'placement' ? K_PLACEMENT : K_LEARNING;
  const next: CompetencyState = {
    rating: updateRating(prev.rating, item.difficulty, correct ? 1 : 0, k),
    correctByLevel: {
      ...prev.correctByLevel,
      [item.level]: prev.correctByLevel[item.level] + (correct ? 1 : 0),
    },
    answered: prev.answered + 1,
    answeredItems: prev.answeredItems.includes(item.id)
      ? prev.answeredItems
      : [...prev.answeredItems, item.id],
  };

  const reviews = { ...state.reviews };
  const existing = reviews[item.id];
  if (existing) {
    // Any later answer to a card's item counts as a review of that card.
    reviews[item.id] = scheduleCard(existing, correct, today);
  } else if (correct && isLevelMastered(next, item.level)) {
    reviews[item.id] = newCard(item.id, item.competency, today);
  }

  return {
    ...state,
    competencies: { ...state.competencies, [item.competency]: next },
    reviews,
  };
}

export function markUnitCompleted(state: LearnerState, unitId: string): LearnerState {
  if (state.completedUnits.includes(unitId)) return state;
  return { ...state, completedUnits: [...state.completedUnits, unitId] };
}

export function finishPlacement(state: LearnerState): LearnerState {
  return { ...state, placementDone: true };
}
