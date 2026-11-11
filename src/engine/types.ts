import type { Level } from './levels';

/** Minimal views of content that the engine needs. Content collections map onto these. */
export interface EngineItem {
  id: string;
  competency: string;
  level: Level;
  difficulty: number;
}

export interface EngineUnit {
  id: string;
  competency: string;
  level: Level;
}

export interface EngineCompetency {
  id: string;
  prerequisites: string[];
}

export interface RoleCompetency {
  id: string;
  /** 1 = most important, 3 = least important. */
  priority: 1 | 2 | 3;
  /** Target level per role level; null = not required at that role level. */
  targets: Record<Level, Level | null>;
}

export interface EngineRole {
  id: string;
  competencies: RoleCompetency[];
}

export interface CompetencyState {
  rating: number;
  /** Number of correct answers on items of each level. */
  correctByLevel: Record<Level, number>;
  answered: number;
  /** Item ids already answered (for item selection). */
  answeredItems: string[];
}

export interface ReviewCard {
  itemId: string;
  competency: string;
  /** Leitner box 0..3 → intervals 1, 3, 7, 21 days. */
  box: number;
  /** ISO date (YYYY-MM-DD) when the card is due. */
  due: string;
}

export interface LearnerState {
  version: 1;
  roleId: string;
  selfLevel: Level;
  createdAt: string;
  placementDone: boolean;
  competencies: Record<string, CompetencyState>;
  reviews: Record<string, ReviewCard>;
  completedUnits: string[];
}

export type AnswerPhase = 'placement' | 'learning' | 'review';
