import { learnerStateSchema, type LearnerState } from '../engine';

export const STORAGE_KEY = 'open-role-academy.progress.v1';

/** Load progress from localStorage (browser only). Invalid data is ignored. */
export function loadState(): LearnerState | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = learnerStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveState(state: LearnerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
