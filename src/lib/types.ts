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

export interface CatalogCompetency {
  id: string;
  title: string;
  description: string;
  track: 'core' | 'role';
  roleIds: string[];
}

export interface CatalogUnit extends UnitView {
  status: 'ai-draft' | 'reviewed';
  roleIds: string[];
}

export interface CatalogData {
  roles: { id: string; title: string; summary: string }[];
  competencies: CatalogCompetency[];
  units: CatalogUnit[];
}
