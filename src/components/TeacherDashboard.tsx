// src/components/TeacherDashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import type { Difficulty, TopicId, Question } from '../types/questions';
import StudentGame, { type GameResult } from './StudentGame';
import { buildPrintableExam } from '../utils/printableMapper';
import { createExamPdf } from '../utils/createExamPdf';
import { loadExams, saveExams } from '../utils/examsStorage';
import type { SavedExam } from '../utils/examsStorage';
import { generateYearPlan } from '../utils/yearPlanGenerator';
import { createYearBookletPdf } from '../utils/createYearBookletPdf';
import type { YearPlan, WeekPlan } from '../types/yearPlan';
import { useI18n } from '../i18n';
import { upsertMonthBadge } from '../utils/progressStorage';
import {
  loadStudentRecords,
  saveStudentRecords,
  createStudent,
  updateStudentProgress,
} from '../utils/studentStorage';
import type { StudentRecord, AvatarType } from '../types/students';
import { QuestionCard } from './QuestionCard';
import { avatarEmoji } from '../utils/avatar';

function getRandomSubset<T>(items: T[], count: number): T[] {
  const copy = [...items];
  const result: T[] = [];
  const maxCount = Math.min(count, items.length);

  while (result.length < maxCount) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }

  return result;
}

function buildQuestionsForWeek(
  week: WeekPlan,
  allQuestions: Question[],
  defaultCount = 10
): Question[] {
  // מסנן לפי נושא, ואם יש – גם תת־נושא
  let filtered = allQuestions.filter((q) => q.topic === week.topic);

  if (week.subtopic) {
    filtered = filtered.filter((q) => q.subtopic === week.subtopic);
  }

  // קובע קושי לפי סוג הפעילויות
  // lesson/practice → קל/בינוני, quiz/exam → בינוני/קשה
  const focusSet = new Set(week.focus);
  let difficulties: Difficulty[] = ['easy'];

  if (focusSet.has('quiz') || focusSet.has('exam')) {
    difficulties = ['medium', 'hard'];
  } else if (focusSet.has('practice')) {
    difficulties = ['easy', 'medium'];
  }

  filtered = filtered.filter((q) =>
    difficulties.includes(q.difficulty as Difficulty)
  );

  if (!filtered.length) {
    // fallback – כל השאלות של הנושא
    filtered = allQuestions.filter((q) => q.topic === week.topic);
  }

  // אם עדיין אין – מחזיר ריק
  if (!filtered.length) return [];

  // משתמש בפונקציית הבחירה הרנדומלית
  return getRandomSubset(filtered, defaultCount);
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('numbers');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('easy');
  const [count, setCount] = useState(10);
  const [generated, setGenerated] = useState<Question[]>([]);

  const [examName, setExamName] = useState('');
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [jsonImportError, setJsonImportError] = useState<string | null>(null);

  // תכנית שנה
  const [yearPlan, setYearPlan] = useState<YearPlan | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');

  // Students & Progress
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState<AvatarType>('boy');
  const [newStudentColor, setNewStudentColor] = useState('#f97316');

  useEffect(() => {
    setSavedExams(loadExams());

    // תכנית שנה ברירת מחדל – כיתה א׳
    const plan = generateYearPlan({
      grade: 'א׳',
      yearLabel: 'תשפ״ו',
    });
    setYearPlan(plan);

    // Load or initialize students
    const loadedStudents = loadStudentRecords();
    if (loadedStudents.length === 0) {
      // Create default student
      const defaultStudent = createStudent('תלמיד/ה 1', 'א׳', plan.yearLabel);
      setStudents([defaultStudent]);
      setSelectedStudentId(defaultStudent.profile.id);
      saveStudentRecords([defaultStudent]);
    } else {
      setStudents(loadedStudents);
      setSelectedStudentId(loadedStudents[0].profile.id);
    }
  }, []);

  useEffect(() => {
    saveExams(savedExams);
  }, [savedExams]);

  // Save students whenever they change
  useEffect(() => {
    if (students.length) {
      saveStudentRecords(students);
    }
  }, [students]);

  const topic = useMemo(
    () => TOPICS.find((t) => t.id === selectedTopic),
    [selectedTopic]
  );
  const subtopics = topic?.subtopics ?? [];

  const handleGenerate = () => {
    let filtered = QUESTIONS.filter((q) => q.topic === selectedTopic);

    if (selectedSubtopic) {
      filtered = filtered.filter((q) => q.subtopic === selectedSubtopic);
    }
    if (difficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }

    const chosen = getRandomSubset(filtered, count);
    setGenerated(chosen);
  };

  const handleDownloadPdf = () => {
    if (!generated.length) return;

    const exam = buildPrintableExam(generated, {
      title: examName || 'מבחן חשבון',
      grade: 'א׳',
      subject: 'חשבון',
      schoolName: 'בית ספר לדוגמה',
      teacherName: 'המורה',
    });

    const doc = createExamPdf(exam);
    doc.save('exam.pdf');
  };

  const handleDownloadJson = () => {
    if (!generated.length) return;

    const blob = new Blob(
      [JSON.stringify(generated, null, 2)],
      { type: 'application/json' },
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveExam = () => {
    if (!generated.length || !examName.trim()) return;
    const newExam: SavedExam = {
      id: `${Date.now()}`,
      name: examName.trim(),
      createdAt: new Date().toISOString(),
      questions: generated,
    };
    setSavedExams((prev) => [newExam, ...prev]);
    setExamName('');
  };

  const handleLoadExam = (id: string) => {
    const exam = savedExams.find((e) => e.id === id);
    if (!exam) return;
    setGenerated(exam.questions);
  };

  const handleDeleteExam = (id: string) => {
    setSavedExams((prev) => prev.filter((e) => e.id !== id));
  };

  const handleImportJson: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        const text = String(ev.target?.result || '');
        const parsed = JSON.parse(text);

        // Support both [...] and { questions: [...] }
        const arr = Array.isArray(parsed) ? parsed : parsed.questions;
        if (!Array.isArray(arr)) {
          throw new Error('Invalid JSON format: no questions array');
        }

        // Basic validation
        const cleaned = arr.filter(
          (q) => q && typeof q.id === 'string' && (q.promptHe || q.promptEn)
        );

        if (!cleaned.length) {
          throw new Error('No valid questions found');
        }

        setGenerated(cleaned);
        setJsonImportError(null);

        // Optionally auto-save as a saved exam
        const importedExamName = file.name.replace(/\.json$/i, '');
        const newExam: SavedExam = {
          id: `${Date.now()}_import`,
          name: `ייבוא: ${importedExamName}`,
          createdAt: new Date().toISOString(),
          questions: cleaned,
        };
        setSavedExams((prev) => [newExam, ...prev]);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'שגיאה בקריאת הקובץ';
        setJsonImportError(errorMessage);
      }
    };

    reader.readAsText(file, 'utf-8');
  };

  const handleDownloadYearBooklet = () => {
    if (!yearPlan) return;

    const doc = createYearBookletPdf(yearPlan, QUESTIONS, {
      grade: 'א׳',
      subject: 'חשבון',
      schoolName: 'בית ספר לדוגמה',
      teacherName: 'המורה',
      title: 'חוברת תרגול חשבון – כיתה א׳',
      questionsPerMonth: 10,
    });

    doc.save('year_booklet.pdf');
  };

  if (mode === 'student') {
    const week =
      yearPlan && selectedWeekId
        ? yearPlan.weeks[Number(selectedWeekId)]
        : undefined;

    const activeStudent = students.find((s) => s.profile.id === selectedStudentId);

    const handleFinished = (result: GameResult) => {
      if (!activeStudent || !result.month) return;
      const percent = Math.round((result.score / result.total) * 100);

      // Award badge if score is 60% or higher
      if (percent >= 60) {
        setStudents((prev) =>
          updateStudentProgress(prev, activeStudent.profile.id, (prevProg) =>
            upsertMonthBadge(prevProg, result.month!, percent)
          )
        );
      }
    };

    return (
      <StudentGame
        questions={generated.length ? generated : QUESTIONS.slice(0, 10)}
        onExit={() => setMode('teacher')}
        context={
          week
            ? { month: week.month, weekIndex: Number(selectedWeekId) }
            : undefined
        }
        onFinished={handleFinished}
      />
    );
  }

  const activeStudent = students.find((s) => s.profile.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* Back to Home Button */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label={locale === 'he' ? 'חזרה למסך הראשי' : 'Back to Home'}
            >
              <span className="text-lg">←</span>
              <span>{locale === 'he' ? 'חזרה' : 'Back'}</span>
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {t('teacher.title')}
              </h1>
              <p className="text-sm text-slate-600">
                {t('teacher.subtitle')}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setLocale('he')}
              className={`rounded-full px-3 py-1 transition-colors ${
                locale === 'he'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              עברית
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`rounded-full px-3 py-1 transition-colors ${
                locale === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              English
            </button>
          </div>
        </header>

        {/* Student Profile Selection */}
        <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {locale === 'he' ? 'פרופיל תלמיד' : 'Student Profile'}
              </h2>
              <p className="text-xs text-slate-600">
                {locale === 'he'
                  ? 'בחר תלמיד כדי שההתקדמות והתגים יישמרו רק עבורו.'
                  : 'Select a student to track their progress and badges.'}
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
              <select
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.profile.id} value={s.profile.id}>
                    {avatarEmoji(s.profile.avatar)} {s.profile.name} ({s.profile.grade})
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="text"
                  placeholder={locale === 'he' ? 'שם תלמיד חדש' : 'New student name'}
                  className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                />

                {/* Avatar selection */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-600">
                    {locale === 'he' ? 'אייקון:' : 'Icon:'}
                  </span>
                  {(['boy', 'girl', 'robot', 'star'] as AvatarType[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setNewStudentAvatar(a)}
                      className={[
                        'flex h-7 w-7 items-center justify-center rounded-full border text-base',
                        newStudentAvatar === a
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-300 bg-white',
                      ].join(' ')}
                    >
                      {avatarEmoji(a)}
                    </button>
                  ))}
                </div>

                {/* Color selection */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-600">
                    {locale === 'he' ? 'צבע:' : 'Color:'}
                  </span>
                  <input
                    type="color"
                    value={newStudentColor}
                    onChange={(e) => setNewStudentColor(e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border border-slate-300 p-0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!yearPlan || !newStudentName.trim()) return;
                    const rec = createStudent(
                      newStudentName.trim(),
                      'א׳',
                      yearPlan.yearLabel,
                      newStudentAvatar,
                      newStudentColor
                    );
                    setStudents((prev) => [...prev, rec]);
                    setSelectedStudentId(rec.profile.id);
                    setNewStudentName('');
                  }}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  {locale === 'he' ? 'הוסף' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* layout: טאבלט – שני טורים */}
        <div className="grid gap-4 md:grid-cols-5">
          {/* צד שמאל – הגדרות */}
          <div className="md:col-span-2 space-y-4">
            {/* נושא ותת־נושא */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.topic.title')}
              </h2>
              <label className="mb-3 block text-sm text-slate-700">
                {t('teacher.topic.select')}
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                  value={selectedTopic}
                  onChange={(e) => {
                    const value = e.target.value as TopicId;
                    setSelectedTopic(value);
                    setSelectedSubtopic('');
                  }}
                >
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              {subtopics.length > 0 && (
                <label className="block text-sm text-slate-700">
                  {t('teacher.topic.subtopic')}
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                  >
                    <option value="">{t('teacher.topic.allSubtopics')}</option>
                    {subtopics.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </section>

            {/* רמת קושי וכמות */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.difficulty.title')}
              </h2>

              <div className="mb-4 flex flex-wrap gap-2 text-sm">
                {[
                  { val: 'all', label: t('teacher.difficulty.all') },
                  { val: 'easy', label: t('teacher.difficulty.easy') },
                  { val: 'medium', label: t('teacher.difficulty.medium') },
                  { val: 'hard', label: t('teacher.difficulty.hard') },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDifficulty(opt.val as Difficulty | 'all')}
                    className={[
                      'rounded-full border px-3 py-1 transition-colors',
                      difficulty === opt.val
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center justify-between text-sm text-slate-700">
                {t('teacher.difficulty.count')}
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) =>
                    setCount(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 rounded-lg border border-slate-300 p-1 text-center"
                />
              </label>
            </section>

            {/* שמירת מבחן */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.save.title')}
              </h2>
              <div className="flex flex-col gap-2 md:flex-row">
                <input
                  type="text"
                  placeholder={t('teacher.save.placeholder')}
                  className="flex-1 rounded-lg border border-slate-300 p-2 text-sm"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSaveExam}
                  disabled={!generated.length || !examName.trim()}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    generated.length && examName.trim()
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-500'
                  }`}
                >
                  {t('teacher.save.button')}
                </button>
              </div>
            </section>

            {/* תכנית שנה – בחירת שבוע */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.year.title')}
              </h2>

              {!yearPlan ? (
                <p className="text-sm text-slate-500">{t('general.loading')}</p>
              ) : (
                <>
                  <label className="block text-sm text-slate-700">
                    {t('teacher.year.selectWeek')}
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                      value={selectedWeekId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedWeekId(val);
                        if (!val) return;
                        const week = yearPlan.weeks[Number(val)];
                        if (!week) return;

                        // מעדכן גם את הפילטרים על המסך (שלא ירגיש מנותק)
                        setSelectedTopic(week.topic);
                        setSelectedSubtopic(week.subtopic || '');
                        setDifficulty('all');

                        const qs = buildQuestionsForWeek(week, QUESTIONS, 12);
                        setGenerated(qs);
                      }}
                    >
                      <option value="">{t('teacher.year.weekOption')}</option>
                      {yearPlan.weeks.map((w, idx) => (
                        <option key={idx} value={idx}>
                          {w.month} – שבוע {w.weekOfMonth} – {w.topic}
                          {w.subtopic ? ` (${w.subtopic})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="mt-2 text-xs text-slate-500">
                    {t('teacher.year.help')}
                  </p>
                </>
              )}
            </section>

            {/* Progress Badges */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.badges.title')}
              </h2>

              {activeStudent && (
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: activeStudent.profile.color }}
                  >
                    {avatarEmoji(activeStudent.profile.avatar)}
                  </span>
                  <span className="font-medium">{activeStudent.profile.name}</span>
                </div>
              )}

              {!activeStudent || activeStudent.progress.monthBadges.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {t('teacher.badges.empty')}
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2 text-sm">
                  {activeStudent.progress.monthBadges.map((b) => (
                    <li
                      key={b.month}
                      className="flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                      style={{ backgroundColor: activeStudent.profile.color + '20' }}
                    >
                      <span>🏅</span>
                      <div>
                        <div className="font-medium">{b.month}</div>
                        <div className="text-[0.7rem] text-slate-600">
                          {t('teacher.badges.best', { score: b.bestScore })}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* צד ימין – תרגילים + מבחנים שמורים */}
          <div className="md:col-span-3 space-y-4">
            {/* כפתורים ראשיים */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {t('teacher.buttons.generate')}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!generated.length}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    generated.length
                      ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'cursor-not-allowed border border-slate-300 text-slate-400'
                  }`}
                >
                  {t('teacher.buttons.pdf')}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  disabled={!generated.length}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    generated.length
                      ? 'border border-slate-400 text-slate-700 hover:bg-slate-50'
                      : 'cursor-not-allowed border border-slate-300 text-slate-400'
                  }`}
                >
                  {t('teacher.buttons.json')}
                </button>
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {t('teacher.buttons.import')}
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImportJson}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setMode('student')}
                  disabled={!generated.length}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    generated.length
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-500'
                  }`}
                >
                  {t('teacher.buttons.studentMode')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/year-plan')}
                  className="rounded-lg border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  {t('teacher.buttons.yearPlan')}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadYearBooklet}
                  disabled={!yearPlan}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    yearPlan
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-500'
                  }`}
                >
                  {t('teacher.buttons.yearBooklet')}
                </button>
              </div>
              {jsonImportError && (
                <p className="mt-2 text-xs text-rose-600">
                  {jsonImportError}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {t('teacher.questions.generated', { count: generated.length })}
              </p>
            </section>

            {/* רשימת תרגילים */}
            <section className="max-h-[420px] overflow-y-auto rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.questions.title')}
              </h2>
              {generated.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {t('teacher.questions.empty')}
                </p>
              ) : (
                <ol className="space-y-3 text-sm">
                  {generated.map((q, idx) => (
                    <li
                      key={q.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-slate-700">
                          #{idx + 1}
                        </span>
                        <span className="text-xs text-slate-500">
                          {q.difficulty === 'easy'
                            ? t('teacher.difficulty.easy')
                            : q.difficulty === 'medium'
                            ? t('teacher.difficulty.medium')
                            : t('teacher.difficulty.hard')}
                        </span>
                      </div>
                      <QuestionCard question={q} showOptions={!!q.options} />
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {/* מבחנים שמורים */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                {t('teacher.saved.title')}
              </h2>
              {savedExams.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {t('teacher.saved.empty')}
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {savedExams.map((exam) => (
                    <li
                      key={exam.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <div className="font-medium">{exam.name}</div>
                        <div className="text-xs text-slate-500">
                          {exam.questions.length} תרגילים ·{' '}
                          {new Date(exam.createdAt).toLocaleString('he-IL')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadExam(exam.id)}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          {t('teacher.saved.load')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="rounded-lg border border-rose-500 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          {t('teacher.saved.delete')}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
