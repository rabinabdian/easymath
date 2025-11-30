// src/utils/yearPlanGenerator.ts
import type { YearPlan, WeekPlan } from '../types/yearPlan';
import type { TopicId } from '../types/questions';

const HEB_MONTHS = [
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
];

type TopicSchedule = {
  monthRange: [number, number]; // אינדקסים בתוך HEB_MONTHS
  topic: TopicId;
  subtopics?: string[];
};

const DEFAULT_SCHEDULE: TopicSchedule[] = [
  { monthRange: [0, 1], topic: 'numbers', subtopics: ['ספירה', 'לוח 10', 'שכנים', 'דילוגים'] },
  { monthRange: [2, 3], topic: 'addition', subtopics: ['חיבור עד 10', 'השלמה ל-10', 'חיבור מילולי'] },
  { monthRange: [4, 5], topic: 'subtraction', subtopics: ['חיסור עד 10', 'חיסור מילולי', 'כמה נשאר'] },
  { monthRange: [6, 6], topic: 'evenOdd' },
  { monthRange: [7, 8], topic: 'geometry', subtopics: ['צורות', 'סימטריה', 'שיקוף'] },
  { monthRange: [9, 9], topic: 'numbers', subtopics: ['חזרה כללית'] },
];

export interface GenerateYearPlanOptions {
  grade: string;          // "א׳"
  yearLabel: string;      // "2025-2026"
  weeksPerMonth?: number; // ברירת מחדל 4
}

export function generateYearPlan(
  opts: GenerateYearPlanOptions
): YearPlan {
  const weeksPerMonth = opts.weeksPerMonth ?? 4;
  const weeks: WeekPlan[] = [];

  HEB_MONTHS.forEach((monthName, monthIndex) => {
    // איזה נושא שייך לחודש הזה
    const schedule = DEFAULT_SCHEDULE.find(
      (s) =>
        monthIndex >= s.monthRange[0] &&
        monthIndex <= s.monthRange[1]
    );
    if (!schedule) return;

    for (let week = 1; week <= weeksPerMonth; week++) {
      const activity: ('lesson' | 'practice' | 'quiz' | 'exam' | 'game')[] = [];

      // לוגיקה פשוטה:
      if (week === weeksPerMonth) {
        activity.push('quiz'); // בסוף חודש – חזרה/מבחן קצר
      } else {
        activity.push('lesson', 'practice');
      }

      // פעם בחודש – משחק
      if (week === 2) {
        activity.push('game');
      }

      const subtopic =
        schedule.subtopics &&
        schedule.subtopics[(week - 1) % schedule.subtopics.length];

      weeks.push({
        month: monthName,
        weekOfMonth: week,
        topic: schedule.topic,
        subtopic,
        focus: activity,
        notes: undefined,
      });
    }
  });

  return {
    grade: opts.grade,
    yearLabel: opts.yearLabel,
    weeks,
  };
}
