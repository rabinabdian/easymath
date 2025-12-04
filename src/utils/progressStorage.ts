// src/utils/progressStorage.ts
import type { StudentProgress } from '../types/gamification';

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
  const existingIndex = progress.monthBadges.findIndex((b) => b.month === month);

  if (existingIndex === -1) {
    // Add new badge
    return {
      ...progress,
      monthBadges: [
        ...progress.monthBadges,
        {
          month,
          earnedAt: new Date().toISOString(),
          bestScore: scorePercent,
        },
      ],
    };
  }

  const existing = progress.monthBadges[existingIndex];
  if (scorePercent > existing.bestScore) {
    // Update existing badge with better score - create new badge object
    return {
      ...progress,
      monthBadges: progress.monthBadges.map((badge, idx) =>
        idx === existingIndex
          ? {
              ...badge,
              bestScore: scorePercent,
              earnedAt: new Date().toISOString(),
            }
          : badge
      ),
    };
  }

  // No change needed
  return progress;
}
