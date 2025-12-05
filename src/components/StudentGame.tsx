// src/components/StudentGame.tsx
import { useEffect, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { buildUnderstandingNarration, getQuestionPrompt } from '../utils/questionText';
import { QuestionCard } from './QuestionCard';
import { IntroScreen } from './IntroScreen';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import { UnderstandingSection } from './UnderstandingSection';
import { InlineSpeaker } from './SpeakerButton';
import { HintDisplay } from './HintDisplay';
import { APP_VERSION } from '../App';
import { ensureLTRNumbers } from '../utils/textDirection';

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
  const [showHint, setShowHint] = useState<1 | 2 | null>(null); // Show progressive hints (1 or 2)

  const current = questions[index];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (index / totalQuestions) * 100 : 0;
  
  const questionPrompt = current ? getQuestionPrompt(current, locale) : '';
  const understandingHint = current
    ? buildUnderstandingNarration(current, locale, { includeAnswer: false })
    : '';
  const understandingSolution = current
    ? buildUnderstandingNarration(current, locale, { includeAnswer: true })
    : '';
  const lessonContent = current ? getLessonContent(current, locale) : undefined;

  // Helper function to get hint text based on attempt and locale
  function getHintText(hintNumber: 1 | 2): string | undefined {
    if (!current) return undefined;
    
    if (hintNumber === 1) {
      return locale === 'he' ? current.hint1He : current.hint1En;
    } else {
      return locale === 'he' ? current.hint2He : current.hint2En;
    }
  }

  // Helper function to generate default hint based on question type
  function generateDefaultHint(hintNumber: 1 | 2): string {
    if (!current) return '';
    
    const answer = current.answer;
    const topic = current.topic;
    
    if (hintNumber === 1) {
      // רמז ראשון - עדין ומעודד
      switch (topic) {
        case 'numbers':
          return 'נסה לספור שוב לאט לאט...\nכל אחד בנפרד! 👆';
        case 'addition':
          return 'חיבור = לחבר ביחד! ➕\nנסה לספור את כל מה שיש...';
        case 'subtraction':
          return 'חיסור = להוציא! ➖\nתחשוב: כמה נשאר אחרי שמוציאים?';
        case 'multiplication':
          return 'כפל = קבוצות של אותו דבר! ✖️\nכמה יש בכל קבוצה?';
        case 'geometry':
          return 'הסתכל טוב על הצורות...\nספור רק את מה שביקשו! 🔍';
        default:
          return 'קרא שוב את השאלה לאט...\nאתה יכול! 💪';
      }
    } else {
      // רמז שני - יותר ישיר
      switch (topic) {
        case 'numbers':
          return ensureLTRNumbers(
            `הגענו ל... כמעט שם!\nהתשובה קרובה ל-${Number(answer) - 1} או ${Number(answer) + 1}...`
          );
        case 'addition':
          return `בוא נספור ביחד:\nקודם את הראשון, ואז מוסיפים את השני!`;
        case 'subtraction':
          return `התחל מהמספר הגדול...\nואז תסתכל כמה צריך להוריד!`;
        case 'multiplication':
          return `תחשוב על זה כך:\nכמה פעמים יש את אותו הדבר?`;
        case 'geometry':
          return `תראה כל צורה...\nוספור רק את הצורה הנכונה!`;
        default:
          return `התשובה קרובה מאוד!\nתסתכל שוב על מה שרואים... 🔍`;
      }
    }
  }

  function handleWrong(customMessage?: string) {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if reached max attempts - trigger auto-solve with full explanation
    if (newAttempts >= MAX_ATTEMPTS_PER_QUESTION) {
      setFeedback('אופס! בוא נראה איך פותרים את זה ביחד 🤔');
      setTimeout(() => {
        setFeedback(null);
        setShowAutoSolve(true);
      }, 1500);
      return;
    }

    // Show progressive hints based on attempt number
    if (newAttempts === 1 || newAttempts === 2) {
      const hintNumber = newAttempts as 1 | 2;
      const hintText = getHintText(hintNumber);
      
      // If there's a custom hint, show the hint display popup
      if (hintText || current) {
        setFeedback(customMessage ?? (newAttempts === 1 
          ? 'לא נכון... הנה רמז! 💡' 
          : 'עדיין לא... הנה עוד רמז! 🔍'));
        setTimeout(() => {
          setFeedback(null);
          setShowHint(hintNumber);
        }, 1000);
        return;
      }
    }

    // Fallback: Show encouraging feedback without hint popup
    const encouragement =
      newAttempts === 1 ? 'נסה שוב! אתה יכול! 💪' :
      newAttempts === 2 ? 'כמעט! עוד ניסיון אחד! 🌟' :
      'לא נורא, בוא ננסה שוב';

    setFeedback(customMessage ?? encouragement);

    setTimeout(() => {
      setFeedback(null);
      setInput('');
    }, 2000);
  }

  function handleHintDismiss() {
    setShowHint(null);
    setInput('');
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
    const nextIndex = index + 1;
    if (nextIndex >= totalQuestions) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
    }
  }

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

  // Initialize timer and reset state for each new question
  useEffect(() => {
    if (!current || finished) return;
    setTimeLeft(TIME_PER_QUESTION);
    setAttempts(0); // Reset attempts for new question
    setShowIntro(true); // Show intro for new question
    setShowAutoSolve(false); // Reset auto-solve
    setShowHint(null); // Reset hint display
  }, [index, finished, current]);

  // Timer countdown (only when not showing intro, auto-solve, or hints)
  useEffect(() => {
    if (!current || finished || showIntro || showAutoSolve || showHint) return;
    if (timeLeft <= 0) {
      // Time's up - count as wrong attempt
      handleWrong(t('student.timeUp'));
      return;
    }

    const id = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, current, finished, showIntro, showAutoSolve, showHint, t]);

  // Call onFinished when game is completed successfully
  useEffect(() => {
    if (!finished || !onFinished) return;

    onFinished({
      score,
      total: totalQuestions,
      month: context?.month,
      weekIndex: context?.weekIndex,
    });
  }, [finished, onFinished, score, totalQuestions, context]);

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
            <p className="mb-3 text-slate-700 ltr-numbers">
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

        {/* Version Badge */}
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "16px",
            fontSize: "0.75rem",
            color: "#94a3b8",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "4px 10px",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
          }}
        >
          {ensureLTRNumbers(`גרסה ${APP_VERSION}`)}
        </div>
      </div>
    );
  }


  if (!current) {
    return null;
  }

  // Always show intro screen with a short lesson/context before each question
  if (showIntro) {
    return (
      <IntroScreen
        question={current}
        lesson={lessonContent}
        onContinue={() => setShowIntro(false)}
      />
    );
  }

  // Show progressive hint after failed attempt (1 or 2)
  const currentHintText = showHint 
    ? (getHintText(showHint) || generateDefaultHint(showHint))
    : undefined;
  
  const currentHintVisualAid = showHint && current
    ? (showHint === 1 ? current.hint1VisualAid : current.hint2VisualAid)
    : undefined;

  // Show auto-solve explanation after 3 failed attempts
  if (showAutoSolve) {
    const autoSolveExplanation = locale === 'he' ? current.autoSolveExplanationHe : current.autoSolveExplanationEn;
    const questionText = getQuestionPrompt(current, locale);
    const answerText = String(current.answer);
    const fullExplanation = autoSolveExplanation || `בוא נבין למה התשובה היא ${answerText}`;

    // Build full audio text for combined speaker
    const fullAudioText = `השאלה הייתה: ${questionText}. התשובה הנכונה היא ${answerText}. ${fullExplanation}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-3 text-6xl">🎓</div>
            <h2 className="text-3xl font-bold text-slate-800">בואו נבין למה!</h2>
            <p className="mt-2 text-lg text-slate-600">לחץ על הרמקול כדי לשמוע 🔈</p>
          </div>

          {/* Question Repeat Card - Show the question again */}
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8 shadow-lg border-4 border-blue-300">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">❓</span>
                <h3 className="text-2xl font-bold text-slate-800">השאלה הייתה</h3>
              </div>
              <InlineSpeaker text={`השאלה הייתה: ${questionText}`} />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line text-center ltr-numbers">
                {questionText}
              </p>
            </div>
            {/* Show visual aids from the question */}
            {current.visualAids && current.visualAids.length > 0 && (
              <div className="mt-4">
                <VisualAidsDisplay visualAids={current.visualAids} />
              </div>
            )}
          </div>

          {/* Answer Card */}
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 p-8 shadow-lg border-4 border-green-400">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-5xl">✅</span>
                <h3 className="text-2xl font-bold text-slate-800">התשובה הנכונה</h3>
              </div>
              <InlineSpeaker text={`התשובה הנכונה היא ${answerText}`} />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-4xl font-bold text-center text-green-600 ltr-numbers">
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

          {/* Explanation Card using UnderstandingSection with Visual */}
          <UnderstandingSection
            locale={locale}
            prompt={questionPrompt}
            explanation={understandingSolution}
            variant="solution"
            showPrompt={false}
            className="mb-6"
            question={current}
          />

          {/* Full Audio Button - Listen to everything together */}
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 shadow-lg border-2 border-purple-300">
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl">🎧</span>
              <span className="text-xl font-bold text-slate-800">שמע הכל ביחד</span>
              <InlineSpeaker text={fullAudioText} />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleAutoSolveContinue}
            className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
          >
            <span className="mr-2">➡️</span>
            הבנתי! בואו נמשיך
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Progressive Hint Display Overlay */}
      {showHint && currentHintText && (
        <HintDisplay
          hintNumber={showHint}
          hintText={currentHintText}
          visualAid={currentHintVisualAid}
          onDismiss={handleHintDismiss}
        />
      )}
      
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
                className={`ltr-inline ${
                  timeLeft <= 5 ? 'font-bold text-rose-600' : 'font-medium'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="ltr-numbers">
              {t('student.score')}{' '}
              <span className="font-semibold text-emerald-600">{Math.round(score)}</span>
            </div>
            {/* Attempts indicator */}
            {attempts > 0 && (
              <div className="flex items-center gap-1 text-amber-600 ltr-numbers">
                <span>ניסיונות:</span>
                <span className="font-bold">{attempts}/3</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
            <span className="ltr-numbers">
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

        {/* Understanding hint section */}
        <div className="mt-4">
          <UnderstandingSection
            locale={locale}
            prompt={questionPrompt}
            explanation={understandingHint}
            variant="hint"
            showPrompt={false}
            question={current}
          />
        </div>
      </div>

      {/* Version Badge */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          left: "16px",
          fontSize: "0.75rem",
          color: "#94a3b8",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "4px 10px",
          borderRadius: "12px",
          backdropFilter: "blur(4px)",
        }}
      >
        {ensureLTRNumbers(`גרסה ${APP_VERSION}`)}
      </div>
    </div>
  );
}
