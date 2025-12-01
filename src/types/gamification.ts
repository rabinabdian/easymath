// src/types/gamification.ts
export interface MonthBadge {
  month: string;        // "ספטמבר", "אוקטובר", etc.
  earnedAt: string;     // ISO date string
  bestScore: number;    // percentage (0-100)
}

export interface StudentProgress {
  monthBadges: MonthBadge[];
}
