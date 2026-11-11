import { useEffect, useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import {
  LEVELS,
  buildLearningPath,
  computeGaps,
  exportProgress,
  importProgress,
  levelRank,
  recordAnswer,
  reviewQueue,
  type LearnerState,
  type Level,
} from '../../engine';
import { localizePath, t } from '../../i18n';
import { clearState, loadState, saveState, todayIso } from '../../lib/storage';
import type { CompetencyView, QuizItem, RoleView, UnitView } from '../../lib/types';
import { QuizItemView } from './QuizItemView';

interface Props {
  lang: Lang;
  roles: RoleView[];
  competencies: CompetencyView[];
  units: UnitView[];
  items: QuizItem[];
}

const levelLabel = (lang: Lang, level: Level | null) => (level ? t(lang, `level.${level}`) : t(lang, 'level.none'));

export default function Dashboard({ lang, roles, competencies, units, items }: Props) {
  const [state, setState] = useState<LearnerState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewing, setReviewing] = useState<QuizItem[] | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  const onImport = async (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const imported = importProgress(await file.text());
      saveState(imported);
      setState(imported);
      setMessage(t(lang, 'dashboard.importOk'));
    } catch (err) {
      setMessage(`${t(lang, 'dashboard.importError')}: ${(err as Error).message}`);
    }
  };

  const importControl = (
    <label class="inline-block cursor-pointer rounded border border-blue-800 px-4 py-2 font-semibold text-blue-800">
      {t(lang, 'dashboard.import')}
      <input type="file" accept="application/json,.json" class="sr-only" onChange={onImport} />
    </label>
  );

  if (!loaded) return null;
  if (!state) {
    return (
      <div class="space-y-4">
        <p>{t(lang, 'dashboard.empty')}</p>
        <div class="flex flex-wrap gap-3">
          <a class="rounded bg-blue-800 px-4 py-2 font-semibold text-white" href={localizePath(lang, '/start')}>
            {t(lang, 'nav.start')}
          </a>
          {importControl}
        </div>
        {message && <p role="status">{message}</p>}
      </div>
    );
  }

  const role = roles.find((r) => r.id === state.roleId);
  if (!role) return <p>{t(lang, 'dashboard.empty')}</p>;
  const roleLevel = state.selfLevel;
  const path = buildLearningPath(role, roleLevel, state, competencies, units);
  const gaps = computeGaps(role, roleLevel, state);
  const today = todayIso();
  const due = reviewQueue(state, today);
  const compTitle = (id: string) => competencies.find((c) => c.id === id)?.title ?? id;
  const unitView = (id: string) => units.find((u) => u.id === id);

  const download = () => {
    const blob = new Blob([exportProgress(state, new Date())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-role-academy-progress-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const next = path[0];
  return (
    <div class="space-y-8">
      <section aria-labelledby="next-title" class="rounded-lg border border-blue-800 bg-blue-50 p-5">
        <h2 id="next-title" class="mb-2 text-lg font-semibold">{t(lang, 'dashboard.next')}</h2>
        {next ? (
          <a class="text-lg text-blue-800 underline" href={localizePath(lang, `/units/${next.unit.id}`)}>
            {unitView(next.unit.id)?.title ?? next.unit.id} · {levelLabel(lang, next.level)}
          </a>
        ) : (
          <p>{t(lang, 'dashboard.allDone')}</p>
        )}
      </section>

      <section aria-labelledby="comp-title">
        <h2 id="comp-title" class="mb-3 text-lg font-semibold">{t(lang, 'dashboard.competencies')}</h2>
        <ul class="space-y-4">
          {gaps.map((g) => {
            const current = levelRank(g.mastered);
            const target = levelRank(g.target);
            return (
              <li key={g.competency}>
                <div class="flex flex-wrap justify-between gap-2">
                  <span class="font-medium">{compTitle(g.competency)}</span>
                  <span class="text-sm text-slate-700">
                    {t(lang, 'dashboard.current')}: {levelLabel(lang, g.mastered)} · {t(lang, 'dashboard.target')}:{' '}
                    {levelLabel(lang, g.target)} · {t(lang, 'dashboard.rating')}: {Math.round(state.competencies[g.competency]?.rating ?? 0)}
                  </span>
                </div>
                <div
                  class="mt-1 flex h-3 overflow-hidden rounded bg-slate-200"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={LEVELS.length}
                  aria-valuenow={current}
                  aria-label={`${compTitle(g.competency)}: ${levelLabel(lang, g.mastered)} / ${levelLabel(lang, g.target)}`}
                >
                  {LEVELS.map((l, i) => (
                    <div
                      key={l}
                      class={`flex-1 border-r border-white ${i < current ? 'bg-green-700' : i < target ? 'bg-amber-300' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="path-title">
        <h2 id="path-title" class="mb-3 text-lg font-semibold">{t(lang, 'dashboard.path')}</h2>
        {path.length === 0 ? (
          <p>{t(lang, 'dashboard.allDone')}</p>
        ) : (
          <ol class="list-decimal space-y-1 pl-6">
            {path.map((step) => (
              <li key={step.unit.id}>
                <a class="text-blue-800 underline" href={localizePath(lang, `/units/${step.unit.id}`)}>
                  {unitView(step.unit.id)?.title ?? step.unit.id}
                </a>{' '}
                <span class="text-sm text-slate-700">
                  ({levelLabel(lang, step.level)}, {unitView(step.unit.id)?.minutes} {t(lang, 'unit.minutes')})
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="review-title">
        <h2 id="review-title" class="mb-3 text-lg font-semibold">{t(lang, 'dashboard.reviews')}</h2>
        {reviewing && reviewing[reviewIndex] ? (
          <QuizItemView
            key={reviewing[reviewIndex]!.id}
            lang={lang}
            item={reviewing[reviewIndex]!}
            index={reviewIndex}
            total={reviewing.length}
            isLast={reviewIndex + 1 >= reviewing.length}
            onDone={(correct) => {
              const item = reviewing[reviewIndex]!;
              const nextState = recordAnswer(state, { item, correct, phase: 'review', today });
              saveState(nextState);
              setState(nextState);
              if (reviewIndex + 1 >= reviewing.length) setReviewing(null);
              else setReviewIndex(reviewIndex + 1);
            }}
          />
        ) : due.length === 0 ? (
          <p>{t(lang, 'dashboard.reviewsEmpty')}</p>
        ) : (
          <div class="space-y-3">
            <ul class="list-disc pl-6">
              {due.map((c) => (
                <li key={c.itemId}>
                  {compTitle(c.competency)} — {t(lang, 'dashboard.reviewDue')} {c.due}
                </li>
              ))}
            </ul>
            <button
              type="button"
              class="rounded bg-blue-800 px-4 py-2 font-semibold text-white"
              onClick={() => {
                setReviewing(due.map((c) => items.find((i) => i.id === c.itemId)).filter((i): i is QuizItem => !!i));
                setReviewIndex(0);
              }}
            >
              {t(lang, 'dashboard.reviewStart')}
            </button>
          </div>
        )}
      </section>

      <section class="space-y-3 border-t border-slate-300 pt-6">
        <p class="text-sm text-slate-700">{t(lang, 'dashboard.storage')}</p>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="rounded border border-blue-800 px-4 py-2 font-semibold text-blue-800" onClick={download}>
            {t(lang, 'dashboard.export')}
          </button>
          {importControl}
          <button
            type="button"
            class="rounded border border-red-800 px-4 py-2 font-semibold text-red-800"
            onClick={() => {
              if (window.confirm(t(lang, 'dashboard.resetConfirm'))) {
                clearState();
                setState(null);
              }
            }}
          >
            {t(lang, 'dashboard.reset')}
          </button>
        </div>
        {message && <p role="status">{message}</p>}
      </section>
    </div>
  );
}
