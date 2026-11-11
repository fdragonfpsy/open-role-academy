import type { EngineItem, EngineRole, Level } from '../engine';

/** Serializable data passed from Astro pages to Preact islands (already localized). */
export interface QuizItem extends EngineItem {
  type: 'single' | 'multi';
  stem: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
}

export interface RoleView extends EngineRole {
  title: string;
  summary: string;
}

export interface CompetencyView {
  id: string;
  title: string;
  prerequisites: string[];
}

export interface UnitView {
  id: string;
  competency: string;
  level: Level;
  title: string;
  minutes: number;
}
