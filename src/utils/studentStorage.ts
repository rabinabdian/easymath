// src/utils/studentStorage.ts
import type { StudentRecord, StudentProfile } from '../types/students';
import type { StudentProgress } from '../types/gamification';

const KEY = 'easymath_students_v1';

/**
 * Load all student records from localStorage
 */
export function loadStudentRecords(): StudentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StudentRecord[];
  } catch {
    return [];
  }
}

/**
 * Save student records to localStorage
 */
export function saveStudentRecords(records: StudentRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(records));
}

/**
 * Create a new student record with default progress
 */
export function createStudent(
  name: string,
  grade: string,
  yearLabel: string
): StudentRecord {
  const id = `s_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
  const profile: StudentProfile = {
    id,
    name,
    grade,
    yearLabel,
  };
  const progress: StudentProgress = {
    monthBadges: [],
  };
  return { profile, progress };
}

/**
 * Update a specific student's progress
 */
export function updateStudentProgress(
  records: StudentRecord[],
  studentId: string,
  updater: (prev: StudentProgress) => StudentProgress
): StudentRecord[] {
  return records.map((rec) => {
    if (rec.profile.id !== studentId) return rec;
    return {
      ...rec,
      progress: updater(rec.progress),
    };
  });
}
