import { useEffect, useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import { isLevelMastered, markUnitCompleted, recordAnswer, selectMasteryItems, type LearnerState, type Level } from '../../engine';
import { localizePath, t } from '../../i18n';
import { loadState, saveState, todayIso } from '../../lib/storage';
import type { QuizItem } from '../../lib/types';
import { QuizItemView } from './QuizItemView';

interface Props {
  lang: Lang;
  unitId: string;
  competency: string;
  level: Level;
  items: QuizItem[];
}

export default function MasteryCheck({ lang, unitId, competency, level, items }: Props) {
  const [state, setState] = useState<LearnerState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [queue, setQueue] = useState<QuizItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (!state) {
    return (
      <p class="rounded border border-slate-300 bg-slate-50 p-4">
        {t(lang, 'mastery.needStart')}{' '}
        <a class="text-blue-800 underline" href={localizePath(lang, '/start')}>
          {t(lang, 'nav.start')}
        </a>
      </p>
    );
  }

  if (result !== null) {
    return (
      <div role="status" class={`rounded-lg border p-5 ${result ? 'border-green-700 bg-green-50' : 'border-amber-600 bg-amber-50'}`}>
        <p class="mb-3 font-semibold">{result ? t(lang, 'mastery.passed') : t(lang, 'mastery.failed')}</p>
        <a class="inline-block rounded bg-blue-800 px-4 py-2 font-semibold text-white" href={localizePath(lang, '/dashboard')}>
          {t(lang, 'placement.toDashboard')}
        </a>
      </div>
    );
  }

  if (!queue) {
    return (
      <button
        type="button"
        class="rounded bg-blue-800 px-4 py-2 font-semibold text-white"
        onClick={() => {
          const selected = selectMasteryItems(items, level, state.competencies[competency]) as QuizItem[];
          setQueue(selected);
          setIndex(0);
        }}
      >
        {t(lang, 'mastery.start')}
      </button>
    );
  }

  const item = queue[index];
  if (!item) return null;
  return (
    <QuizItemView
      key={item.id}
      lang={lang}
      item={item}
      index={index}
      total={queue.length}
      isLast={index + 1 >= queue.length}
      onDone={(correct) => {
        let next = recordAnswer(state, { item, correct, phase: 'learning', today: todayIso() });
        if (index + 1 >= queue.length) {
          next = markUnitCompleted(next, unitId);
          setResult(isLevelMastered(next.competencies[competency], level));
        } else {
          setIndex(index + 1);
        }
        saveState(next);
        setState(next);
      }}
    />
  );
}
