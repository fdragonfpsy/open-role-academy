import { useCallback, useEffect, useState } from 'preact/hooks';
import type { LearnerState } from '../engine';
import { getProgressStore, type SyncStatus } from './progress-store';

/**
 * Progress for an island: `state` (null until loaded or when none exists), `loaded`, `save`, `clear`,
 * and the sync `status` ('local' for anonymous learners). All islands use this instead of storage.ts directly.
 */
export function useProgress(lang: 'en' | 'de') {
  const [state, setState] = useState<LearnerState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SyncStatus>('local');

  useEffect(() => {
    const store = getProgressStore();
    let live = true;
    const off = store.subscribe((snap) => {
      if (!live) return;
      setStatus(snap.status);
      if ('state' in snap) setState(snap.state ?? null);
    });
    void store.load(lang).then((s) => {
      if (!live) return;
      setState((cur) => cur ?? s);
      setLoaded(true);
    });
    return () => {
      live = false;
      off();
    };
  }, []);

  const save = useCallback((next: LearnerState) => {
    getProgressStore().save(next);
    setState(next);
  }, []);
  const clear = useCallback(() => {
    getProgressStore().clear();
    setState(null);
  }, []);
  const retry = useCallback(() => void getProgressStore().retry(), []);
  return { state, loaded, save, clear, retry, status };
}
