// src/components/TeacherDashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import type { Difficulty, TopicId, Question } from '../types/questions';
import StudentGame from './StudentGame';
import jsPDF from 'jspdf';
import { loadExams, saveExams } from '../utils/examsStorage';
import type { SavedExam } from '../utils/examsStorage';

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

export default function TeacherDashboard() {
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('numbers');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('easy');
  const [count, setCount] = useState(10);
  const [generated, setGenerated] = useState<Question[]>([]);

  const [examName, setExamName] = useState('');
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);

  useEffect(() => {
    setSavedExams(loadExams());
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

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    const marginTop = 40;
    const lineHeight = 20;
    const maxWidth = 500;
    let y = marginTop;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('מבחן חשבון – Easymath', marginLeft, y);
    y += lineHeight * 2;

    generated.forEach((q, index) => {
      const text = `${index + 1}. ${q.prompt}`;
      const lines = doc.splitTextToSize(text, maxWidth);

      if (y + lines.length * lineHeight > 800) {
        doc.addPage();
        y = marginTop;
      }

      doc.text(lines, marginLeft, y);
      y += lines.length * lineHeight + lineHeight;
    });

    doc.save('exam.pdf');
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
              </div>
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
