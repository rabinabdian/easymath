// src/components/StudentGame.tsx
import { useEffect, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';

interface GameContext {
  month?: string;      // "ספטמבר"
  weekIndex?: number;  // Week index in year plan
}

export interface GameResult {
  score: number;
  total: number;
  month?: string;
  weekIndex?: number;
}

interface Props {
  questions: Question[];
  onExit: () => void;
  context?: GameContext;
  onFinished?: (result: GameResult) => void;
}

const MAX_LIVES = 3;
const TIME_PER_QUESTION = 30; // seconds

export default function StudentGame({ questions, onExit, context, onFinished }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = questions[index];

  // Initialize timer for each new question
  useEffect(() => {
    if (!current || finished || gameOver) return;
    setTimeLeft(TIME_PER_QUESTION);
  }, [index, finished, gameOver, !!current]);

  // Timer countdown
  useEffect(() => {
    if (!current || finished || gameOver) return;
    if (timeLeft <= 0) {
      // Time's up - count as wrong
      handleWrong(t('student.timeUp'));
      return;
    }

    const id = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, current, finished, gameOver]);

  // Call onFinished when game is completed successfully
  useEffect(() => {
    if (!finished || !onFinished) return;

    onFinished({
      score,
      total: totalQuestions,
      month: context?.month,
      weekIndex: context?.weekIndex,
    });
  }, [finished, onFinished, score, context]);

  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (index / totalQuestions) * 100 : 0;
  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => i < lives);

  function handleWrong(customMessage?: string) {
    setFeedback(
      customMessage ??
        t('student.wrongAnswer', { answer: String(current?.answer ?? '') })
    );

    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
        setTimeout(() => {
          setFeedback(null);
        }, 1000);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setInput('');
          setIndex((i) => i + 1);
        }, 1000);
      }
      return next;
    });
  }

  function handleCorrect() {
    setFeedback(t('student.correct'));
    setScore((s) => s + 1);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      const nextIndex = index + 1;
      if (nextIndex >= totalQuestions) {
        setFinished(true);
      } else {
        setIndex(nextIndex);
      }
    }, 800);
  }

  function checkAnswer(valueFromClick?: string) {
    if (!current || finished || gameOver) return;

    const correctStr = String(current.answer).trim();
    const userStr = (valueFromClick ?? input).trim();

    const isCorrect =
      userStr === correctStr ||
      (Array.isArray(current.options) &&
        current.options.some((o) => String(o) === userStr));

    if (isCorrect) handleCorrect();
    else handleWrong();
  }

  const handleOptionClick = (val: string) => {
    checkAnswer(val);
  };

  // Finished successfully screen
  if (finished) {
    const percent = Math.round((score / totalQuestions) * 100);
    let stars = 1;
    if (percent >= 80) stars = 3;
    else if (percent >= 50) stars = 2;

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              {t('student.finished.title')}
            </h2>
            <p className="mb-3 text-slate-700">
              {t('student.finished.score')}{' '}
              <span className="font-semibold">{score}</span> {t('student.of')}{' '}
              <span className="font-semibold">{totalQuestions}</span> (
              {percent}%)
            </p>

            <div className="mb-2 flex items-center gap-1 text-2xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i}>{i < stars ? '⭐' : '☆'}</span>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              {stars === 3
                ? t('student.finished.excellent')
                : stars === 2
                ? t('student.finished.good')
                : t('student.finished.tryAgain')}
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t('student.finished.backButton')}
          </button>
        </div>
      </div>
    );
  }

  // Game Over screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              {t('student.gameOver.title')}
            </h2>
            <p className="mb-3 text-slate-700">
              {t('student.gameOver.tried')} {index + 1} · {t('student.gameOver.score')} {score}
            </p>
            <p className="text-sm text-slate-600">
              {t('student.gameOver.hint')}
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t('student.gameOver.backButton')}
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-6 md:py-8">
        {/* Top bar: Exit, Hearts, Timer */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('student.backToTeacher')}
          </button>

          <div className="flex flex-col items-end gap-1 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span>{t('student.hearts')}</span>
              <div className="flex gap-0.5 text-lg">
                {hearts.map((full, i) => (
                  <span key={i}>{full ? '❤️' : '🤍'}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('student.timer')}</span>
              <span
                className={
                  timeLeft <= 5 ? 'font-bold text-rose-600' : 'font-medium'
                }
              >
                {timeLeft}s
              </span>
            </div>
            <div>
              {t('student.score')}{' '}
              <span className="font-semibold text-emerald-600">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
            <span>
              {t('student.question')} {index + 1} {t('student.of')} {totalQuestions}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Question card */}
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

          {current.options && (
            <div className="mb-4 flex flex-wrap gap-2">
              {current.options.map((opt) => (
                <button
                  key={String(opt)}
                  type="button"
                  onClick={() => handleOptionClick(String(opt))}
                  className="rounded-xl border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  {String(opt)}
                </button>
              ))}
            </div>
          )}

          {!current.options && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') checkAnswer();
                }}
                placeholder={t('student.placeholder')}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => checkAnswer()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                {t('student.check')}
              </button>
            </div>
          )}

          {feedback && (
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
