// src/types/yearPlan.ts
import type { TopicId } from './questions';

export type ActivityType = 'lesson' | 'practice' | 'quiz' | 'exam' | 'game';

export interface WeekPlan {
  month: string;          // "ספטמבר" וכו׳
  weekOfMonth: number;    // 1–4
  topic: TopicId;
  subtopic?: string;
  focus: ActivityType[];
  notes?: string;
}

export interface YearPlan {
  grade: string;          // "א׳"
  yearLabel: string;      // "תשפ״ו" או "2025-2026"
  weeks: WeekPlan[];
}
