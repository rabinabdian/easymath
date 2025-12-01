// src/types/students.ts
import type { StudentProgress } from './gamification';

/**
 * Student profile information
 */
export interface StudentProfile {
  id: string; // unique identifier (e.g., "s_1733088123_1234")
  name: string; // student name
  grade: string; // e.g., "א׳", "ב׳"
  yearLabel: string; // e.g., "תשפ״ו"
  color?: string; // optional color for UI/avatar
}

/**
 * Complete student record with profile and progress
 */
export interface StudentRecord {
  profile: StudentProfile;
  progress: StudentProgress;
}
