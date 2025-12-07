// src/types/gamification.ts
export interface MonthBadge {
  month: string;        // "ספטמבר", "אוקטובר", etc.
  earnedAt: string;     // ISO date string
  bestScore: number;    // percentage (0-100)
}

export interface ExerciseAttempt {
  id: string;           // unique attempt ID
  timestamp: string;    // ISO date string
  score: number;        // points earned (can be decimal)
  total: number;        // total questions
  percent: number;      // percentage (0-100)
  month?: string;       // optional month context
  weekIndex?: number;   // optional week index
}

export interface StudentProgress {
  monthBadges: MonthBadge[];
  exerciseHistory: ExerciseAttempt[];
}
