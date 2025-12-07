// src/utils/studentStorage.ts
import type { StudentRecord, StudentProfile, AvatarType } from '../types/students';
import type { StudentProgress } from '../types/gamification';

const KEY = 'easymath_students_v1';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#e11d48', '#a855f7'];
const AVATARS: AvatarType[] = ['boy', 'girl', 'robot', 'star'];

/**
 * Load all student records from localStorage
 * Ensures backward compatibility by adding missing fields
 */
export function loadStudentRecords(): StudentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as StudentRecord[];

    // Ensure all records have exerciseHistory (for backward compatibility)
    return records.map((record) => ({
      ...record,
      progress: {
        monthBadges: record.progress.monthBadges || [],
        exerciseHistory: record.progress.exerciseHistory || [],
      },
    }));
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
  yearLabel: string,
  avatar?: AvatarType,
  color?: string
): StudentRecord {
  const id = `s_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
  const profile: StudentProfile = {
    id,
    name,
    grade,
    yearLabel,
    avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
  };
  const progress: StudentProgress = {
    monthBadges: [],
    exerciseHistory: [],
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
