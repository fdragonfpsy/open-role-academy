import { useEffect, useMemo, useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import {
  LEVELS,
  createLearnerState,
  finishPlacement,
  placementFinished,
  recordAnswer,
  selectPlacementItem,
  type LearnerState,
  type Level,
} from '../../engine';
import { localizePath, t } from '../../i18n';
import { loadState, saveState, todayIso } from '../../lib/storage';
import type { QuizItem, RoleView } from '../../lib/types';
import { QuizItemView } from './QuizItemView';

interface Props {
  lang: Lang;
  roles: RoleView[];
  items: QuizItem[];
}

type Phase = { kind: 'setup' } | { kind: 'placement' } | { kind: 'done' };

export default function Onboarding({ lang, roles, items }: Props) {
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');
  const [level, setLevel] = useState<Level>('foundation');
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' });
  const [state, setState] = useState<LearnerState | null>(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [compIndex, setCompIndex] = useState(0);
  const [inComp, setInComp] = useState(0);
  const [last, setLast] = useState<{ item: QuizItem; correct: boolean } | undefined>();
  const [asked, setAsked] = useState(0);

  useEffect(() => setHasExisting(loadState() !== null), []);

  const role = roles.find((r) => r.id === roleId);
  // Competencies that have a target at the chosen level and at least one item.
  const placementComps = useMemo(
    () =>
      (role?.competencies ?? [])
        .filter((c) => c.targets[level] !== null)
        .map((c) => c.id)
        .filter((id) => items.some((i) => i.competency === id)),
    [role, level, items],
  );
  const totalQuestions = placementComps.reduce(
    (n, c) => n + Math.min(4, items.filter((i) => i.competency === c).length),
    0,
  );

  const begin = (skip: boolean) => {
    if (!role) return;
    const fresh = createLearnerState(role, level, new Date());
    if (skip || placementComps.length === 0) {
      const done = finishPlacement(fresh);
      saveState(done);
      setState(done);
      setPhase({ kind: 'done' });
      return;
    }
    setState(fresh);
    setPhase({ kind: 'placement' });
  };

  if (phase.kind === 'setup') {
    return (
      <form
        class="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          begin(false);
        }}
      >
        {hasExisting && <p class="rounded border border-amber-600 bg-amber-50 p-3">{t(lang, 'start.existing')}</p>}
        <fieldset>
          <legend class="mb-2 font-semibold">{t(lang, 'start.role')}</legend>
          <div class="space-y-2">
            {roles.map((r) => (
              <label key={r.id} class="flex items-start gap-3 rounded border border-slate-300 p-3">
                <input type="radio" name="role" class="mt-1" checked={roleId === r.id} onChange={() => setRoleId(r.id)} />
                <span>
                  <span class="font-medium">{r.title}</span>
                  <span class="block text-sm text-slate-700">{r.summary}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend class="mb-2 font-semibold">{t(lang, 'start.level')}</legend>
          <div class="space-y-2">
            {LEVELS.map((l) => (
              <label key={l} class="flex items-start gap-3 rounded border border-slate-300 p-3">
                <input type="radio" name="level" class="mt-1" checked={level === l} onChange={() => setLevel(l)} />
                <span>
                  <span class="font-medium">{t(lang, `level.${l}`)}</span>
                  <span class="block text-sm text-slate-700">{t(lang, `level.${l}.hint`)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div class="flex flex-wrap gap-3">
          <button type="submit" class="rounded bg-blue-800 px-4 py-2 font-semibold text-white">
            {t(lang, 'start.begin')}
          </button>
          <button type="button" class="rounded border border-blue-800 px-4 py-2 font-semibold text-blue-800" onClick={() => begin(true)}>
            {t(lang, 'start.skip')}
          </button>
        </div>
      </form>
    );
  }

  if (phase.kind === 'done' || !state) {
    return (
      <div class="rounded-lg border border-green-700 bg-green-50 p-5" role="status">
        <p class="mb-3 font-semibold">{t(lang, 'placement.done')}</p>
        <a class="inline-block rounded bg-blue-800 px-4 py-2 font-semibold text-white" href={localizePath(lang, '/dashboard')}>
          {t(lang, 'placement.toDashboard')}
        </a>
      </div>
    );
  }

  const compId = placementComps[compIndex]!;
  const compItems = items.filter((i) => i.competency === compId);
  const compState = state.competencies[compId]!;
  const current = selectPlacementItem(compItems, compState, last) as QuizItem | null;

  const advance = (next: LearnerState, answeredInComp: number) => {
    const finishedComp = placementFinished(compItems, answeredInComp) || !selectPlacementItem(compItems, next.competencies[compId]!);
    if (!finishedComp) {
      setState(next);
      setInComp(answeredInComp);
      return;
    }
    if (compIndex + 1 < placementComps.length) {
      setState(next);
      setCompIndex(compIndex + 1);
      setInComp(0);
      setLast(undefined);
      return;
    }
    const done = finishPlacement(next);
    saveState(done);
    setState(done);
    setPhase({ kind: 'done' });
  };

  if (!current) {
    advance(state, Number.MAX_SAFE_INTEGER);
    return null;
  }

  return (
    <section aria-labelledby="placement-title">
      <h2 id="placement-title" class="mb-4 text-xl font-semibold">{t(lang, 'placement.title')}</h2>
      <QuizItemView
        key={current.id}
        lang={lang}
        item={current}
        index={asked}
        total={totalQuestions}
        isLast={asked + 1 >= totalQuestions}
        onDone={(correct) => {
          const next = recordAnswer(state, { item: current, correct, phase: 'placement', today: todayIso() });
          setLast({ item: current, correct });
          setAsked(asked + 1);
          advance(next, inComp + 1);
        }}
      />
    </section>
  );
}
