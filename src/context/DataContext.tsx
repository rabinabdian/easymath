// src/context/DataContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { StudentRecord, AvatarType } from '../types/students';
import type { StudentProgress } from '../types/gamification';
import type { SavedExam } from '../utils/examsStorage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { createStudent as makeStudent } from '../utils/studentStorage';

interface DataContextType {
  students: StudentRecord[];
  exams: SavedExam[];
  loading: boolean;
  // Students
  addStudent: (
    name: string,
    grade: string,
    yearLabel: string,
    avatar?: AvatarType,
    color?: string,
  ) => Promise<StudentRecord>;
  saveStudents: (records: StudentRecord[]) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  // Progress
  saveProgress: (studentId: string, progress: StudentProgress) => Promise<void>;
  // Exams
  addExam: (exam: SavedExam) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  getExamById: (id: string) => SavedExam | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [exams, setExams] = useState<SavedExam[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data when user logs in
  useEffect(() => {
    if (!user) {
      setStudents([]);
      setExams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase
        .from('students')
        .select('*, badges(*), attempts(*)')
        .order('created_at', { ascending: true }),
      supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false }),
    ]).then(([studentsRes, examsRes]) => {
      if (studentsRes.data) setStudents(studentsRes.data.map(rowToStudentRecord));
      if (examsRes.data) setExams(examsRes.data.map(rowToSavedExam));
    }).finally(() => setLoading(false));
  }, [user]);

  const addStudent = useCallback(
    async (
      name: string,
      grade: string,
      yearLabel: string,
      avatar?: AvatarType,
      color?: string,
    ): Promise<StudentRecord> => {
      const record = makeStudent(name, grade, yearLabel, avatar, color);
      const { error } = await supabase.from('students').insert({
        id: record.profile.id,
        teacher_id: user!.id,
        name: record.profile.name,
        grade: record.profile.grade,
        year_label: record.profile.yearLabel,
        avatar: record.profile.avatar,
        color: record.profile.color,
      });
      if (error) throw error;
      setStudents(prev => [...prev, record]);
      return record;
    },
    [user],
  );

  const saveStudents = useCallback(
    async (records: StudentRecord[]) => {
      setStudents(records);
      const rows = records.map(r => ({
        id: r.profile.id,
        teacher_id: user!.id,
        name: r.profile.name,
        grade: r.profile.grade,
        year_label: r.profile.yearLabel,
        avatar: r.profile.avatar,
        color: r.profile.color,
        photo_url: r.profile.photoUrl ?? null,
      }));
      const { error } = await supabase.from('students').upsert(rows);
      if (error) console.error('Error saving students:', error);
    },
    [user],
  );

  const deleteStudent = useCallback(async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
    setStudents(prev => prev.filter(s => s.profile.id !== id));
  }, []);

  const saveProgress = useCallback(
    async (studentId: string, progress: StudentProgress) => {
      // Update local state immediately for responsive UI
      setStudents(prev =>
        prev.map(s => (s.profile.id === studentId ? { ...s, progress } : s)),
      );

      // Upsert badges
      if (progress.monthBadges.length > 0) {
        const badgeRows = progress.monthBadges.map(b => ({
          student_id: studentId,
          month: b.month,
          best_score: b.bestScore,
          earned_at: b.earnedAt,
        }));
        await supabase
          .from('badges')
          .upsert(badgeRows, { onConflict: 'student_id,month' });
      }

      // Insert only new attempts
      setStudents(prev => {
        const current = prev.find(s => s.profile.id === studentId);
        const currentIds = new Set(
          current?.progress.exerciseHistory.map(a => a.id) ?? [],
        );
        const newAttempts = progress.exerciseHistory.filter(
          a => !currentIds.has(a.id),
        );
        if (newAttempts.length > 0) {
          const attemptRows = newAttempts.map(a => ({
            id: a.id,
            student_id: studentId,
            score: a.score,
            total: a.total,
            percent: a.percent,
            month: a.month ?? null,
            week_index: a.weekIndex ?? null,
            timestamp: a.timestamp,
          }));
          supabase.from('attempts').insert(attemptRows);
        }
        return prev;
      });
    },
    [],
  );

  const addExam = useCallback(
    async (exam: SavedExam) => {
      const { error } = await supabase.from('exams').insert({
        id: exam.id,
        teacher_id: user!.id,
        name: exam.name,
        questions: exam.questions,
      });
      if (error) throw error;
      setExams(prev => [exam, ...prev]);
    },
    [user],
  );

  const deleteExam = useCallback(async (id: string) => {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) throw error;
    setExams(prev => prev.filter(e => e.id !== id));
  }, []);

  const getExamById = useCallback(
    (id: string): SavedExam | undefined => exams.find(e => e.id === id),
    [exams],
  );

  return (
    <DataContext.Provider
      value={{
        students,
        exams,
        loading,
        addStudent,
        saveStudents,
        deleteStudent,
        saveProgress,
        addExam,
        deleteExam,
        getExamById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

// ---- Transform helpers ----

function rowToStudentRecord(row: Record<string, unknown>): StudentRecord {
  const badges = (row.badges as Record<string, unknown>[]) ?? [];
  const attempts = (row.attempts as Record<string, unknown>[]) ?? [];
  return {
    profile: {
      id: row.id as string,
      name: row.name as string,
      grade: row.grade as string,
      yearLabel: row.year_label as string,
      avatar: row.avatar as AvatarType,
      color: row.color as string,
      photoUrl: (row.photo_url as string | null) ?? undefined,
    },
    progress: {
      monthBadges: badges.map(b => ({
        month: b.month as string,
        earnedAt: b.earned_at as string,
        bestScore: b.best_score as number,
      })),
      exerciseHistory: attempts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.timestamp as string).getTime() -
            new Date(a.timestamp as string).getTime(),
        )
        .slice(0, 50)
        .map(a => ({
          id: a.id as string,
          timestamp: a.timestamp as string,
          score: a.score as number,
          total: a.total as number,
          percent: a.percent as number,
          month: (a.month as string | null) ?? undefined,
          weekIndex: (a.week_index as number | null) ?? undefined,
        })),
    },
  };
}

function rowToSavedExam(row: Record<string, unknown>): SavedExam {
  return {
    id: row.id as string,
    name: row.name as string,
    createdAt: row.created_at as string,
    questions: row.questions as SavedExam['questions'],
  };
}
