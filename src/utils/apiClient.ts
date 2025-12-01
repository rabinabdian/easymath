// src/utils/apiClient.ts
/**
 * API Client for backend communication
 *
 * This module provides a centralized interface for all backend API calls.
 * Currently prepared for future backend integration while localStorage is still in use.
 *
 * Usage:
 * - Import apiClient and use methods like apiClient.getStudents()
 * - All methods return Promises
 * - Handles authentication via Authorization header (when implemented)
 */

import type { StudentRecord, AvatarType } from '../types/students';

const API_BASE = '/api';

/**
 * Generic API call wrapper with error handling
 */
async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // For cookie-based auth
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * API Client - all backend endpoints
 */
export const apiClient = {
  // ============ Students ============

  /**
   * Get all students for the authenticated teacher
   */
  getStudents: () => api<StudentRecord[]>('/students'),

  /**
   * Create a new student
   */
  createStudent: (payload: {
    name: string;
    grade: string;
    yearLabel: string;
    avatar: AvatarType;
    color: string;
  }) =>
    api<StudentRecord>('/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Update student profile
   */
  updateStudent: (
    id: string,
    payload: Partial<{
      name: string;
      grade: string;
      avatar: AvatarType;
      color: string;
    }>
  ) =>
    api<StudentRecord>(`/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  /**
   * Delete a student
   */
  deleteStudent: (id: string) =>
    api<{ success: boolean }>(`/students/${id}`, {
      method: 'DELETE',
    }),

  // ============ Progress & Attempts ============

  /**
   * Record a student attempt (game or exam)
   */
  saveAttempt: (
    studentId: string,
    payload: {
      score: number;
      total: number;
      sourceType: 'game' | 'exam' | 'ad-hoc';
      examId?: string | null;
      context?: Record<string, any>;
    }
  ) =>
    api(`/students/${studentId}/attempts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get student progress (badges and recent attempts)
   */
  getProgress: (studentId: string) => api(`/students/${studentId}/progress`),

  // ============ Exams ============

  /**
   * Get all exams for the authenticated teacher
   */
  getExams: () => api('/exams'),

  /**
   * Create a new exam
   */
  saveExam: (payload: {
    title: string;
    grade: string;
    subject: string;
    questions: string[];
    meta?: Record<string, any>;
  }) =>
    api('/exams', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get a specific exam
   */
  getExam: (id: string) => api(`/exams/${id}`),

  /**
   * Delete an exam
   */
  deleteExam: (id: string) =>
    api<{ success: boolean }>(`/exams/${id}`, {
      method: 'DELETE',
    }),

  // ============ Authentication (future) ============

  /**
   * Login with email and password
   */
  login: (email: string, password: string) =>
    api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Register a new teacher account
   */
  register: (name: string, email: string, password: string) =>
    api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  /**
   * Logout (clear session)
   */
  logout: () =>
    api('/auth/logout', {
      method: 'POST',
    }),
};
