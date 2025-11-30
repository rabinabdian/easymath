// src/types/gamification.ts
export interface MonthBadge {
  month: string;        // "ספטמבר", "אוקטובר", etc.
  earnedAt: string;     // ISO date string
  bestScore: number;    // percentage (0-100)
}

export interface StudentProgress {
  id: string;           // e.g., "default_student"
  yearLabel: string;    // e.g., "תשפ״ו"
  grade: string;        // e.g., "א׳"
  monthBadges: MonthBadge[];
}
