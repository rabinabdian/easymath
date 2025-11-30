// src/utils/examsStorage.ts
import type { Question } from '../types/questions';

export interface SavedExam {
  id: string;            // uuid קטן או timestamp
  name: string;
  createdAt: string;     // ISO string
  questions: Question[];
}

const STORAGE_KEY = 'easymath_exams_v1';

/**
 * טוען את כל המבחנים השמורים מ-localStorage
 */
export function loadExams(): SavedExam[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedExam[];
  } catch (error) {
    console.error('Failed to load exams from localStorage:', error);
    return [];
  }
}

/**
 * שומר את רשימת המבחנים ל-localStorage
 */
export function saveExams(exams: SavedExam[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  } catch (error) {
    console.error('Failed to save exams to localStorage:', error);
  }
}

/**
 * מוחק מבחן לפי ID
 */
export function deleteExam(examId: string): void {
  const exams = loadExams();
  const filtered = exams.filter(e => e.id !== examId);
  saveExams(filtered);
}

/**
 * מוסיף מבחן חדש
 */
export function addExam(exam: SavedExam): void {
  const exams = loadExams();
  saveExams([exam, ...exams]);
}

/**
 * מוצא מבחן לפי ID
 */
export function getExamById(examId: string): SavedExam | undefined {
  const exams = loadExams();
  return exams.find(e => e.id === examId);
}
