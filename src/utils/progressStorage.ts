// src/utils/progressStorage.ts
import type { StudentProgress, MonthBadge } from '../types/gamification';

const KEY = 'easymath_progress_v1';

/**
 * Load student progress from localStorage
 */
export function loadProgress(): StudentProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProgress;
  } catch {
    return null;
  }
}

/**
 * Save student progress to localStorage
 */
export function saveProgress(p: StudentProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

/**
 * Upsert a month badge - either add new or update existing if score is better
 */
export function upsertMonthBadge(
  progress: StudentProgress,
  month: string,
  scorePercent: number
): StudentProgress {
  const existing = progress.monthBadges.find((b) => b.month === month);

  if (!existing) {
    // Add new badge
    progress.monthBadges.push({
      month,
      earnedAt: new Date().toISOString(),
      bestScore: scorePercent,
    });
  } else if (scorePercent > existing.bestScore) {
    // Update existing badge with better score
    existing.bestScore = scorePercent;
    existing.earnedAt = new Date().toISOString();
  }

  return { ...progress, monthBadges: [...progress.monthBadges] };
}
