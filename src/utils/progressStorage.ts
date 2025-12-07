// src/utils/progressStorage.ts
import type { StudentProgress, ExerciseAttempt } from '../types/gamification';

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
 * Returns a new immutable progress object (does not mutate the original)
 */
export function upsertMonthBadge(
  progress: StudentProgress,
  month: string,
  scorePercent: number
): StudentProgress {
  const existingIndex = progress.monthBadges.findIndex((b) => b.month === month);

  if (existingIndex === -1) {
    // Add new badge - create new array with new badge
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
    // Update existing badge with better score - create new array with updated badge
    return {
      ...progress,
      monthBadges: progress.monthBadges.map((b, idx) =>
        idx === existingIndex
          ? { ...b, bestScore: scorePercent, earnedAt: new Date().toISOString() }
          : b
      ),
    };
  }

  // No change needed - return original progress
  return progress;
}

/**
 * Add an exercise attempt to history
 * Returns a new immutable progress object (does not mutate the original)
 */
export function addExerciseAttempt(
  progress: StudentProgress,
  score: number,
  total: number,
  month?: string,
  weekIndex?: number
): StudentProgress {
  const percent = Math.round((score / total) * 100);
  const attempt: ExerciseAttempt = {
    id: `attempt_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
    timestamp: new Date().toISOString(),
    score,
    total,
    percent,
    month,
    weekIndex,
  };

  // Keep only last 50 attempts to prevent unbounded growth
  const updatedHistory = [attempt, ...progress.exerciseHistory].slice(0, 50);

  return {
    ...progress,
    exerciseHistory: updatedHistory,
  };
}
