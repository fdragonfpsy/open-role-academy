import type { Lang } from '../../config/site';
import { t } from '../../i18n';
import type { SyncStatus as Status } from '../../lib/progress-store';

/** Non-blocking sync note. Renders nothing for anonymous learners (status "local"). */
export function SyncStatus({ lang, status, onRetry }: { lang: Lang; status: Status; onRetry?: () => void }) {
  if (status === 'local') return null;
  const text = t(lang, `sync.${status}`);
  return (
    <p role="status" data-testid="sync-status" data-status={status} class="text-sm text-slate-700">
      {text}
      {(status === 'pending' || status === 'failed') && onRetry && (
        <>
          {' '}
          <button type="button" class="min-h-11 px-2 font-semibold text-blue-800 underline" onClick={onRetry}>
            {t(lang, 'sync.retry')}
          </button>
        </>
      )}
    </p>
  );
}
