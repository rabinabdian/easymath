// src/components/TeacherDashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import type { Difficulty, TopicId, Question } from '../types/questions';
import StudentGame from './StudentGame';
import { buildPrintableExam } from '../utils/printableMapper';
import { createExamPdf } from '../utils/createExamPdf';
import { loadExams, saveExams } from '../utils/examsStorage';
import type { SavedExam } from '../utils/examsStorage';
import { generateYearPlan } from '../utils/yearPlanGenerator';
import { createYearBookletPdf } from '../utils/createYearBookletPdf';
import type { YearPlan, WeekPlan } from '../types/yearPlan';

function getRandomSubset<T>(items: T[], count: number): T[] {
  if (count >= items.length) return [...items];
  const copy = [...items];
  const result: T[] = [];
  while (result.length < count && copy.length > 0) {
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

  useEffect(() => {
    setSavedExams(loadExams());

    // תכנית שנה ברירת מחדל – כיתה א׳
    const plan = generateYearPlan({
      grade: 'א׳',
      yearLabel: 'תשפ״ו',
    });
    setYearPlan(plan);
  }, []);

  useEffect(() => {
    saveExams(savedExams);
  }, [savedExams]);

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
          (q) => q && typeof q.id === 'string' && q.prompt
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
    return (
      <StudentGame
        questions={generated.length ? generated : QUESTIONS.slice(0, 10)}
        onExit={() => setMode('teacher')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Easymath – ממשק מורה
            </h1>
            <p className="text-sm text-slate-600">
              בחר נושא, רמת קושי וכמות תרגילים – ואחר כך תוכל לשמור מבחן,
              להוריד כ־PDF או לשחק במצב תלמיד.
            </p>
          </div>
        </header>

        {/* layout: טאבלט – שני טורים */}
        <div className="grid gap-4 md:grid-cols-5">
          {/* צד שמאל – הגדרות */}
          <div className="md:col-span-2 space-y-4">
            {/* נושא ותת־נושא */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                נושא
              </h2>
              <label className="mb-3 block text-sm text-slate-700">
                בחר נושא:
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
                  תת־נושא:
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                  >
                    <option value="">כל התת־נושאים</option>
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
                רמת קושי וכמות
              </h2>

              <div className="mb-4 flex flex-wrap gap-2 text-sm">
                {[
                  { val: 'all', label: 'הכול' },
                  { val: 'easy', label: 'קל' },
                  { val: 'medium', label: 'בינוני' },
                  { val: 'hard', label: 'קשה' },
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
                כמות תרגילים:
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
                שמירת מבחן
              </h2>
              <div className="flex flex-col gap-2 md:flex-row">
                <input
                  type="text"
                  placeholder="שם המבחן (למשל: חיבור עד 10)"
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
                  שמור מבחן
                </button>
              </div>
            </section>

            {/* תכנית שנה – בחירת שבוע */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                תכנית שנה – בחירת שבוע
              </h2>

              {!yearPlan ? (
                <p className="text-sm text-slate-500">טוען תכנית שנה...</p>
              ) : (
                <>
                  <label className="block text-sm text-slate-700">
                    בחר שבוע:
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
                      <option value="">--- בחר שבוע ---</option>
                      {yearPlan.weeks.map((w, idx) => (
                        <option key={idx} value={idx}>
                          {w.month} – שבוע {w.weekOfMonth} – {w.topic}
                          {w.subtopic ? ` (${w.subtopic})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="mt-2 text-xs text-slate-500">
                    בחירת שבוע תייצר אוטומטית תרגול מתאים לנושא ולפעילות
                    (שיעור, תרגול, חידון).
                  </p>
                </>
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
                  צור רשימת תרגילים
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
                  הורד כ-PDF
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
                  הורד כ-JSON
                </button>
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  ייבוא מבחן (JSON)
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
                  מצב תלמיד
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/year-plan')}
                  className="rounded-lg border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  תכנית שנתית
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
                  הורד חוברת שנה
                </button>
              </div>
              {jsonImportError && (
                <p className="mt-2 text-xs text-rose-600">
                  {jsonImportError}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                כרגע נוצרו {generated.length} תרגילים.
              </p>
            </section>

            {/* רשימת תרגילים */}
            <section className="max-h-[420px] overflow-y-auto rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                תצוגת תרגילים
              </h2>
              {generated.length === 0 ? (
                <p className="text-sm text-slate-500">
                  עדיין אין תרגילים. בחר הגדרות ולחץ על ״צור רשימת תרגילים״.
                </p>
              ) : (
                <ol className="space-y-3 text-sm">
                  {generated.map((q, idx) => (
                    <li
                      key={q.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {idx + 1}. {q.prompt}
                        </span>
                        <span className="text-xs text-slate-500">
                          {q.difficulty === 'easy'
                            ? 'קל'
                            : q.difficulty === 'medium'
                            ? 'בינוני'
                            : 'קשה'}
                        </span>
                      </div>

                      {q.assetId && (
                        <div className="mt-2">
                          <img
                            src={`/assets/${q.assetId}.png`}
                            alt=""
                            className="max-h-40 rounded-lg border border-slate-200 object-contain"
                          />
                        </div>
                      )}

                      {q.options && (
                        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                          {q.options.map((opt) => (
                            <li
                              key={String(opt)}
                              className="rounded-full bg-white px-2 py-1"
                            >
                              {String(opt)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {/* מבחנים שמורים */}
            <section className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                מבחנים שמורים
              </h2>
              {savedExams.length === 0 ? (
                <p className="text-sm text-slate-500">
                  עוד לא שמרת מבחנים. אחרי שתיצור תרגילים ותיתן שם – תוכל לשמור.
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
                          טען
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="rounded-lg border border-rose-500 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          מחק
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
