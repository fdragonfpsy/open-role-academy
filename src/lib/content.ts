import { getCollection } from 'astro:content';
import type { Lang } from '../config/site';
import { seededShuffle } from './shuffle';
import type { CatalogData, CompetencyView, QuizItem, RoleView, UnitView } from './types';

export async function getRoles(lang: Lang): Promise<RoleView[]> {
  const roles = await getCollection('roles', (r) => r.data.status === 'published');
  return roles
    .map(({ data }) => ({
      id: data.id,
      title: data.title[lang],
      summary: data.summary[lang],
      competencies: data.competencies,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function getCompetencies(lang: Lang): Promise<CompetencyView[]> {
  const list = await getCollection('competencies');
  return list.map(({ data }) => ({ id: data.id, title: data.title[lang], prerequisites: data.prerequisites }));
}

export async function getUnitViews(lang: Lang): Promise<UnitView[]> {
  const units = await getCollection('units', (u) => u.id.startsWith(`${lang}/`));
  return units.map(({ data }) => ({
    id: data.id,
    competency: data.competency,
    level: data.level,
    title: data.title,
    minutes: data.minutes,
  }));
}

export async function getQuizItems(lang: Lang): Promise<QuizItem[]> {
  const files = await getCollection('items');
  return files.flatMap(({ data }) =>
    data.items.map((i) => ({
      id: i.id,
      competency: data.competency,
      level: i.level,
      difficulty: i.difficulty,
      type: i.type,
      stem: i.stem[lang],
      options: seededShuffle(i.options, i.id).map((o) => ({ text: o[lang], correct: o.correct })),
      explanation: i.explanation[lang],
    })),
  );
}

/** Published roles and the competencies and units they use (draft roles stay hidden). */
export async function getCatalog(lang: Lang): Promise<CatalogData> {
  const [roles, competencies, units] = await Promise.all([
    getRoles(lang),
    getCollection('competencies'),
    getCollection('units', (u) => u.id.startsWith(`${lang}/`)),
  ]);
  const rolesOf = (competency: string) =>
    roles.filter((r) => r.competencies.some((c) => c.id === competency)).map((r) => r.id);
  return {
    roles: roles.map((r) => ({ id: r.id, title: r.title, summary: r.summary })),
    competencies: competencies
      .map(({ data }) => ({
        id: data.id,
        title: data.title[lang],
        description: data.description[lang],
        track: data.track,
        roleIds: rolesOf(data.id),
      }))
      .filter((c) => c.roleIds.length > 0)
      .sort((a, b) => a.title.localeCompare(b.title, lang)),
    units: units
      .map(({ data }) => ({
        id: data.id,
        competency: data.competency,
        level: data.level,
        title: data.title,
        minutes: data.minutes,
        status: data.status,
        roleIds: rolesOf(data.competency),
      }))
      .filter((u) => u.roleIds.length > 0)
      .sort((a, b) => a.title.localeCompare(b.title, lang)),
  };
}
