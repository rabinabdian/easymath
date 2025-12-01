import { Request } from 'express';

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  created_at: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  user_agent?: string;
  ip_address?: string;
  expires_at: Date;
  created_at: Date;
  revoked_at?: Date | null;
}

// ============================================
// JWT PAYLOAD TYPES
// ============================================

export interface AccessTokenPayload {
  sub: string; // user ID
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string; // user ID
  type: 'refresh';
  jti: string; // refresh token ID
  iat?: number;
  exp?: number;
}

// ============================================
// AUTH REQUEST TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserPublic;
}

export interface RefreshResponse {
  accessToken: string;
}

// ============================================
// EXPRESS REQUEST WITH AUTH
// ============================================

export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
}

// ============================================
// STUDENT TYPES
// ============================================

export type AvatarType = 'boy' | 'girl' | 'robot' | 'star';

export interface Student {
  id: string;
  teacher_id: string;
  name: string;
  grade: string;
  year_label: string;
  avatar: AvatarType;
  color: string;
  created_at: Date;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  yearLabel: string;
  avatar: AvatarType;
  color: string;
}

export interface MonthBadge {
  month: string;
  bestScore: number;
  earnedAt?: string;
}

export interface StudentProgress {
  monthBadges: MonthBadge[];
}

export interface StudentRecord {
  profile: StudentProfile;
  progress: StudentProgress;
}

export interface CreateStudentRequest {
  name: string;
  grade: string;
  yearLabel: string;
  avatar: AvatarType;
  color: string;
}

export interface UpdateStudentRequest {
  name?: string;
  grade?: string;
  avatar?: AvatarType;
  color?: string;
}

// ============================================
// EXAM TYPES
// ============================================

export interface Exam {
  id: string;
  teacher_id: string;
  title: string;
  grade: string;
  subject: string;
  meta_json?: Record<string, any>;
  created_at: Date;
}

export interface ExamWithQuestions extends Exam {
  questions: string[];
}

export interface CreateExamRequest {
  title: string;
  grade: string;
  subject: string;
  questions: string[];
  meta?: Record<string, any>;
}

// ============================================
// ATTEMPT & PROGRESS TYPES
// ============================================

export type SourceType = 'exam' | 'game' | 'ad-hoc';

export interface StudentAttempt {
  id: string;
  student_id: string;
  exam_id?: string | null;
  source_type: SourceType;
  score: number;
  total: number;
  context_json?: Record<string, any>;
  created_at: Date;
}

export interface CreateAttemptRequest {
  score: number;
  total: number;
  sourceType: SourceType;
  examId?: string | null;
  context?: Record<string, any>;
}

export interface AttemptResponse {
  attempt: {
    id: string;
    score: number;
    total: number;
    sourceType: SourceType;
    createdAt: string;
  };
  badgeAwarded?: MonthBadge;
}

export interface ProgressResponse {
  monthBadges: MonthBadge[];
  recentAttempts: Array<{
    id: string;
    score: number;
    total: number;
    sourceType: SourceType;
    createdAt: string;
  }>;
  stats: {
    totalAttempts: number;
    averageScore: number;
  };
}
