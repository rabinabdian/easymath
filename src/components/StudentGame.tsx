// src/components/StudentGame.tsx
import { useState } from 'react';
import type { Question } from '../types/questions';

interface Props {
  questions: Question[];
  onExit: () => void;
}

export default function StudentGame({ questions, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = questions[index];

  if (!current) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              סיימת את כל התרגילים! 🎉
            </h2>
            <p className="text-slate-700">
              ניקוד: <span className="font-semibold">{score}</span> מתוך{' '}
              <span className="font-semibold">{questions.length}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            חזרה למצב מורה
          </button>
        </div>
      </div>
    );
  }

  const checkAnswer = () => {
    const correctStr = String(current.answer).trim();
    const userStr = input.trim();

    const isCorrect =
      userStr === correctStr ||
      (Array.isArray(current.options) &&
        current.options.some((o) => String(o) === userStr));

    if (isCorrect) {
      setFeedback('כל הכבוד! תשובה נכונה ✅');
      setScore((s) => s + 1);
    } else {
      setFeedback(`לא מדויק... התשובה הנכונה היא: ${correctStr}`);
    }

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setIndex((i) => i + 1);
    }, 1200);
  };

  const handleOptionClick = (val: string) => {
    setInput(val);
    setTimeout(() => checkAnswer(), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-6 md:py-10">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            ← חזרה למורה
          </button>
          <div className="text-right text-sm text-slate-700">
            <div>
              שאלה{' '}
              <span className="font-semibold">{index + 1}</span> מתוך{' '}
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div>
              ניקוד:{' '}
              <span className="font-semibold text-emerald-600">{score}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            {current.prompt}
          </h2>

          {current.assetId && (
            <div className="mb-3 flex justify-center">
              <img
                src={`/assets/${current.assetId}.png`}
                alt=""
                className="max-h-48 rounded-xl border border-slate-200 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* אם יש אופציות – כפתורי בחירה */}
          {current.options && (
            <div className="mb-4 flex flex-wrap gap-2">
              {current.options.map((opt) => (
                <button
                  key={String(opt)}
                  type="button"
                  onClick={() => handleOptionClick(String(opt))}
                  disabled={feedback !== null}
                  className={`rounded-xl border-2 px-3 py-1.5 text-sm font-medium transition-all ${
                    feedback !== null
                      ? 'cursor-not-allowed opacity-50'
                      : 'border-blue-600 bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {String(opt)}
                </button>
              ))}
            </div>
          )}

          {/* אין אופציות – תשובה חופשית */}
          {!current.options && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && feedback === null) checkAnswer();
                }}
                disabled={feedback !== null}
                placeholder="כתוב כאן את התשובה"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={checkAnswer}
                disabled={feedback !== null}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  feedback !== null
                    ? 'cursor-not-allowed bg-slate-400 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                בדיקה
              </button>
            </div>
          )}

          {feedback && (
            <div
              className={`rounded-xl px-3 py-2 text-sm font-medium ${
                feedback.includes('נכונה')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
            >
              {feedback}
            </div>
          )}

          {current.explanation && feedback && (
            <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <strong>הסבר:</strong> {current.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
