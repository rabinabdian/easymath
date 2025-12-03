// src/types/students.ts
import type { StudentProgress } from './gamification';

/**
 * Avatar type for student profiles
 */
export type AvatarType = 'boy' | 'girl' | 'robot' | 'star';

/**
 * Student profile information
 */
export interface StudentProfile {
  id: string; // unique identifier (e.g., "s_1733088123_1234")
  name: string; // student name
  grade: string; // e.g., "א׳", "ב׳"
  yearLabel: string; // e.g., "תשפ״ו"
  avatar: AvatarType; // avatar icon type
  color: string; // hex color for UI (e.g., "#f97316")
  photoUrl?: string; // optional student photo (base64 or URL)
}

/**
 * Complete student record with profile and progress
 */
export interface StudentRecord {
  profile: StudentProfile;
  progress: StudentProgress;
}
