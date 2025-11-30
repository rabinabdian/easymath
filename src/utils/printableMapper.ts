// src/utils/printableMapper.ts
import type { Question } from '../types/questions';
import type { PrintableExam } from '../types/printable';

interface BuildExamOptions {
  title: string;
  grade: string;
  subject?: string;
  schoolName?: string;
  teacherName?: string;
}

export function buildPrintableExam(
  questions: Question[],
  opts: BuildExamOptions
): PrintableExam {
  return {
    id: `exam_${Date.now()}`,
    title: opts.title,
    grade: opts.grade,
    subject: opts.subject ?? 'חשבון',
    schoolName: opts.schoolName,
    teacherName: opts.teacherName,
    date: new Date().toISOString(),
    instructions: 'ענה על כל התרגילים. ניתן להשתמש במחברת טיוטה.',
    questions: questions.map((q, idx) => ({
      id: q.id,
      number: idx + 1,
      text: q.prompt,
      topic: q.topic,
      difficulty: q.difficulty,
      linesForAnswer: q.options ? 1 : 3,
    })),
  };
}
