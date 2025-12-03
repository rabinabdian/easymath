// src/components/StudentGame.tsx
import { useEffect, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { QuestionCard } from './QuestionCard';
import { IntroScreen } from './IntroScreen';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import { speak } from '../utils/speech';
import { getQuestionPrompt } from '../utils/questionText';
import { useChildSettings } from '../context/ChildSettingsContext';

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

const TIME_PER_QUESTION = 30; // seconds
const MAX_ATTEMPTS_PER_QUESTION = 3; // Maximum attempts before auto-solve

export default function StudentGame({ questions, onExit, context, onFinished }: Props) {
  const { t, locale } = useI18n();
  const { settings } = useChildSettings();
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);

  // New state for interactive exercise system
  const [showIntro, setShowIntro] = useState(true); // Show intro before each question
  const [attempts, setAttempts] = useState(0); // Track attempts for current question
  const [showAutoSolve, setShowAutoSolve] = useState(false); // Show auto-solve explanation
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false); // Track speech playback

  const current = questions[index];

  // Initialize timer and reset state for each new question
  useEffect(() => {
    if (!current || finished) return;
    setTimeLeft(TIME_PER_QUESTION);
    setAttempts(0); // Reset attempts for new question
    setShowIntro(true); // Show intro for new question
    setShowAutoSolve(false); // Reset auto-solve
  }, [index, finished, !!current]);

  // Timer countdown (only when not showing intro or auto-solve)
  useEffect(() => {
    if (!current || finished || showIntro || showAutoSolve) return;
    if (timeLeft <= 0) {
      // Time's up - count as wrong attempt
      handleWrong(t('student.timeUp'));
      return;
    }

    const id = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, current, finished, showIntro, showAutoSolve]);

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

  function handleWrong(customMessage?: string) {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if reached max attempts - trigger auto-solve
    if (newAttempts >= MAX_ATTEMPTS_PER_QUESTION) {
      setFeedback('אופס! בוא נראה איך פותרים את זה ביחד 🤔');
      setTimeout(() => {
        setFeedback(null);
        setShowAutoSolve(true);
      }, 1500);
      return;
    }

    // Show encouraging feedback based on attempt number
    const encouragement =
      newAttempts === 1 ? 'נסה שוב! אתה יכול! 💪' :
      newAttempts === 2 ? 'כמעט! עוד ניסיון אחד! 🌟' :
      'לא נורא, בוא ננסה שוב';

    setFeedback(
      customMessage ?? `${encouragement}\nהתשובה הנכונה היא: ${String(current?.answer ?? '')}`
    );

    // Don't lose a life on wrong attempt - only after auto-solve
    setTimeout(() => {
      setFeedback(null);
      setInput('');
    }, 2000);
  }

  function handleCorrect() {
    // Award points based on attempts (fewer attempts = more points)
    const points = attempts === 0 ? 1 : attempts === 1 ? 0.7 : 0.5;

    const successMessages = [
      'כל הכבוד! 🎉',
      'מעולה! ⭐',
      'נכון מאוד! 👏',
      'יפה! 🌟',
      'אלוף! 💪'
    ];
    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];

    setFeedback(randomMessage);
    setScore((s) => s + points);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      const nextIndex = index + 1;
      if (nextIndex >= totalQuestions) {
        setFinished(true);
      } else {
        setIndex(nextIndex);
      }
    }, 1200);
  }

  function handleAutoSolveContinue() {
    // After auto-solve, move to next question (no points awarded)
    setShowAutoSolve(false);
    setInput('');
    setIsSpeakingExplanation(false);
    const nextIndex = index + 1;
    if (nextIndex >= totalQuestions) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
    }
  }

  // Function to speak question and explanation
  function speakQuestionAndExplanation() {
    if (!current || isSpeakingExplanation || !settings.soundsEnabled) return;
    
    setIsSpeakingExplanation(true);
    const questionText = getQuestionPrompt(current, locale);
    const autoSolveExplanation = locale === 'he' 
      ? current.autoSolveExplanationHe 
      : current.autoSolveExplanationEn;
    const defaultExplanation = locale === 'he'
      ? `התשובה הנכונה היא: ${current.answer}\n\nבוא נבין למה:`
      : `The correct answer is: ${current.answer}\n\nLet's understand why:`;
    
    const explanation = autoSolveExplanation || defaultExplanation;
    const answerText = locale === 'he'
      ? `התשובה היא: ${current.answer}`
      : `The answer is: ${current.answer}`;
    
    // Speak question first
    speak(questionText);
    
    // Then speak answer and explanation after a delay
    setTimeout(() => {
      const fullExplanation = `${answerText}. ${explanation}`;
      speak(fullExplanation);
      
      // Reset speaking state after speech completes (approximate duration)
      setTimeout(() => {
        setIsSpeakingExplanation(false);
      }, 5000);
    }, 3000);
  }

  // Auto-play sound when auto-solve screen appears
  useEffect(() => {
    if (showAutoSolve && settings.soundsEnabled && current && !isSpeakingExplanation) {
      // Small delay to ensure screen is rendered
      const timer = setTimeout(() => {
        speakQuestionAndExplanation();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAutoSolve, settings.soundsEnabled, current?.id]);

  function checkAnswer(valueFromClick?: string) {
    if (!current || finished) return;

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


  if (!current) {
    return null;
  }

  // Show intro screen before each question (if has intro content)
  if (showIntro && (current.introExplanationHe || current.introExampleHe)) {
    return <IntroScreen question={current} onContinue={() => setShowIntro(false)} />;
  }

  // Show auto-solve explanation after 3 failed attempts
  if (showAutoSolve) {
    const autoSolveExplanation = locale === 'he' ? current.autoSolveExplanationHe : current.autoSolveExplanationEn;
    const defaultExplanation = locale === 'he'
      ? `התשובה הנכונה היא: ${current.answer}\n\nבוא נבין למה:`
      : `The correct answer is: ${current.answer}\n\nLet's understand why:`;
    const questionText = getQuestionPrompt(current, locale);
    const answerText = locale === 'he'
      ? `התשובה היא: ${current.answer}`
      : `The answer is: ${current.answer}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-3 text-6xl">🎓</div>
            <h2 className="text-3xl font-bold text-slate-800">
              {locale === 'he' ? 'בוא נפתור ביחד!' : "Let's solve together!"}
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              {locale === 'he' ? 'אחרי 3 ניסיונות, אני אעזור לך' : 'After 3 attempts, I will help you'}
            </p>
          </div>

          {/* Question Card */}
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8 shadow-lg border-4 border-blue-400">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">❓</span>
                <h3 className="text-2xl font-bold text-slate-800">
                  {locale === 'he' ? 'השאלה' : 'Question'}
                </h3>
              </div>
              {settings.soundsEnabled && (
                <button
                  type="button"
                  onClick={speakQuestionAndExplanation}
                  disabled={isSpeakingExplanation}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  aria-label={locale === 'he' ? 'הקרא את השאלה וההסבר' : 'Read question and explanation'}
                >
                  <span className="text-3xl">🔊</span>
                  <span className="text-sm font-medium text-slate-700">
                    {isSpeakingExplanation 
                      ? (locale === 'he' ? 'מקריא...' : 'Speaking...')
                      : (locale === 'he' ? 'לחץ לשמיעה' : 'Click to hear')}
                  </span>
                </button>
              )}
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-2xl font-semibold text-center text-slate-800 whitespace-pre-line">
                {questionText}
              </p>
            </div>
          </div>

          {/* Answer Card */}
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 p-8 shadow-lg border-4 border-green-400">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-5xl">✅</span>
              <h3 className="text-2xl font-bold text-slate-800">
                {locale === 'he' ? 'התשובה הנכונה' : 'Correct Answer'}
              </h3>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-4xl font-bold text-center text-green-600">
                {current.answer}
              </p>
            </div>
          </div>

          {/* Visual Aid for Auto-Solve */}
          {current.autoSolveVisualAid && (
            <div className="mb-6">
              <VisualAidsDisplay visualAids={[current.autoSolveVisualAid]} />
            </div>
          )}

          {/* Explanation Card */}
          <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">
                  {locale === 'he' ? 'בוא נבין למה' : "Let's Understand Why"}
                </h3>
              </div>
              {settings.soundsEnabled && (
                <button
                  type="button"
                  onClick={speakQuestionAndExplanation}
                  disabled={isSpeakingExplanation}
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  aria-label={locale === 'he' ? 'הקרא את ההסבר' : 'Read explanation'}
                >
                  <span className="text-2xl">🔊</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-lg font-semibold text-slate-800 mb-2">
                  {answerText}
                </p>
              </div>
              <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
                {autoSolveExplanation || defaultExplanation}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleAutoSolveContinue}
            className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            <span className="mr-2">➡️</span>
            {locale === 'he' ? 'הבנתי! בואו נמשיך' : "I understand! Let's continue"}
          </button>
        </div>
      </div>
    );
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
              <span className="font-semibold text-emerald-600">{Math.round(score)}</span>
            </div>
            {/* Attempts indicator */}
            {attempts > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <span>ניסיונות:</span>
                <span className="font-bold">{attempts}/3</span>
              </div>
            )}
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
          <QuestionCard
            question={current}
            showOptions={!!current.options}
            onOptionClick={handleOptionClick}
          />

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
