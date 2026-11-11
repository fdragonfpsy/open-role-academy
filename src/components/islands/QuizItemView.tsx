import { useState } from 'preact/hooks';
import type { Lang } from '../../config/site';
import { t } from '../../i18n';
import type { QuizItem } from '../../lib/types';

interface Props {
  lang: Lang;
  item: QuizItem;
  index: number;
  total: number;
  /** Called after the learner has seen the feedback and continues. */
  onDone: (correct: boolean) => void;
  isLast: boolean;
}

/** Shows one single/multiple-choice item with feedback and explanation. Keyboard accessible (native inputs). */
export function QuizItemView({ lang, item, index, total, onDone, isLast }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const multi = item.type === 'multi';
  const correctSet = item.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0);
  const isCorrect =
    selected.length === correctSet.length && correctSet.every((i) => selected.includes(i));

  const toggle = (i: number) => {
    if (checked) return;
    if (multi) setSelected(selected.includes(i) ? selected.filter((s) => s !== i) : [...selected, i]);
    else setSelected([i]);
  };

  const name = `q-${item.id}`;
  return (
    <form
      class="rounded-lg border border-slate-300 bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!checked) setChecked(true);
        else onDone(isCorrect);
      }}
    >
      <fieldset>
        <legend class="mb-1 text-sm text-slate-600">
          {t(lang, 'quiz.question')} {index + 1} {t(lang, 'quiz.of')} {total} ·{' '}
          {multi ? t(lang, 'quiz.selectAll') : t(lang, 'quiz.selectOne')}
        </legend>
        <p class="mb-4 text-lg font-medium">{item.stem}</p>
        <div class="space-y-2">
          {item.options.map((o, i) => {
            const id = `${name}-${i}`;
            const state = checked ? (o.correct ? 'border-green-700 bg-green-50' : selected.includes(i) ? 'border-red-700 bg-red-50' : 'border-slate-300') : 'border-slate-300';
            return (
              <label key={id} for={id} class={`flex cursor-pointer items-start gap-3 rounded border p-3 ${state}`}>
                <input
                  id={id}
                  type={multi ? 'checkbox' : 'radio'}
                  name={name}
                  class="mt-1"
                  checked={selected.includes(i)}
                  disabled={checked}
                  onChange={() => toggle(i)}
                />
                <span>{o.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {checked && (
        <div class="mt-4 rounded bg-slate-100 p-3" role="status" aria-live="polite">
          <p class={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? t(lang, 'quiz.correct') : t(lang, 'quiz.incorrect')}
          </p>
          <p class="mt-1">{item.explanation}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={selected.length === 0}
        class="mt-4 rounded bg-blue-800 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {!checked ? t(lang, 'quiz.check') : isLast ? t(lang, 'quiz.finish') : t(lang, 'quiz.next')}
      </button>
    </form>
  );
}
