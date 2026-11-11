import { addDays } from './dates';
import type { LearnerState, ReviewCard } from './types';

/** Leitner intervals in days for boxes 0..3. */
export const LEITNER_INTERVALS = [1, 3, 7, 21] as const;
const MAX_BOX = LEITNER_INTERVALS.length - 1;

export function newCard(itemId: string, competency: string, today: string): ReviewCard {
  return { itemId, competency, box: 0, due: addDays(today, LEITNER_INTERVALS[0]) };
}

/** Correct → next box (capped), wrong → back to box 0. Due date from the new box. */
export function scheduleCard(card: ReviewCard, correct: boolean, today: string): ReviewCard {
  const box = correct ? Math.min(card.box + 1, MAX_BOX) : 0;
  return { ...card, box, due: addDays(today, LEITNER_INTERVALS[box] ?? 1) };
}

/** Cards due on or before today, oldest due first, then by item id. */
export function reviewQueue(state: LearnerState, today: string): ReviewCard[] {
  return Object.values(state.reviews)
    .filter((card) => card.due <= today)
    .sort((a, b) => (a.due === b.due ? a.itemId.localeCompare(b.itemId) : a.due.localeCompare(b.due)));
}
