// src/types/printable.ts
import type { Difficulty, TopicId } from './questions';

export interface PrintableQuestion {
  id: string;
  number: number; // Question number in exam
  text: string; // Question text
  topic: TopicId;
  difficulty: Difficulty;
  linesForAnswer?: number; // How many blank lines for answer
}

export interface PrintableExam {
  id: string;
  title: string;
  grade: string; // e.g., "א׳1"
  subject: string; // e.g., "חשבון"
  schoolName?: string;
  teacherName?: string;
  date?: string; // ISO string
  instructions?: string; // Instructions for students
  questions: PrintableQuestion[];
}
