// src/components/StudentGame.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { buildUnderstandingNarration, getQuestionPrompt } from '../utils/questionText';
import { QuestionCard } from './QuestionCard';
import { IntroScreen } from './IntroScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import { UnderstandingSection } from './UnderstandingSection';
import { InlineSpeaker } from './SpeakerButton';
import { HintDisplay } from './HintDisplay';
import { versionLabel } from '../version';
import { ensureLTRNumbers } from '../utils/textDirection';
import { getLessonContent } from '../utils/lessonContent';
import { AnimatedLesson } from './AnimatedLesson';

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

const HEBREW_NUMBER_WORDS: Record<number, string[]> = {
  0: ['אפס'],
  1: ['אחד', 'אחת'],
  2: ['שתיים', 'שניים', 'שתים', 'שתי'],
  3: ['שלוש', 'שלושה'],
  4: ['ארבע', 'ארבעה'],
  5: ['חמש', 'חמישה'],
  6: ['שש'],
  7: ['שבע'],
  8: ['שמונה'],
  9: ['תשע'],
  10: ['עשר'],
  11: ['אחת עשרה', 'אחד עשר'],
  12: ['שתים עשרה', 'שניים עשר'],
};

const EN_NUMBER_WORDS: Record<number, string[]> = {
  0: ['zero'],
  1: ['one'],
  2: ['two'],
  3: ['three'],
  4: ['four'],
  5: ['five'],
  6: ['six'],
  7: ['seven'],
  8: ['eight'],
  9: ['nine'],
  10: ['ten'],
  11: ['eleven'],
  12: ['twelve'],
  13: ['thirteen'],
  14: ['fourteen'],
  15: ['fifteen'],
  16: ['sixteen'],
  17: ['seventeen'],
  18: ['eighteen'],
  19: ['nineteen'],
  20: ['twenty'],
};

function normalizeAnswerValue(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '')
    .replace(/[־–—]/g, '-')
    .replace(/[,،]/g, ',')
    .toLowerCase();
}

function deterministicShuffle<T>(values: T[], seed: string): T[] {
  const result = [...values];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = result.length - 1; i > 0; i -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildNumericChoiceNumbers(answer: number, seed: string): number[] {
  const set = new Set<number>();
  set.add(answer);
  const offsets = [-3, -2, -1, 1, 2, 3, -4, 4, 5, -5, 6, -6];
  for (const delta of offsets) {
    if (set.size >= 4) break;
    const candidate = answer + delta;
    if (candidate >= 0) {
      set.add(candidate);
    }
  }
  while (set.size < 4) {
    set.add(answer + set.size);
  }
  return deterministicShuffle(Array.from(set), `${seed}-numeric`);
}

function formatUsingSegments(template: string, numbers: number[]): string {
  const segments = template.split(/-?\d+/);
  let result = segments[0] ?? '';
  numbers.forEach((num, idx) => {
    result += String(num);
    if (segments[idx + 1] !== undefined) {
      result += segments[idx + 1];
    }
  });
  return result.trim();
}

function buildSequenceCandidates(answerStr: string, seed: string): string[] {
  const matches = answerStr.match(/-?\d+/g);
  if (!matches || matches.length < 2) return [];
  const numbers = matches.map(Number);
  const variants: number[][] = [numbers];
  const deltas = [1, -1, 2, -2];
  deltas.forEach((delta) => {
    const candidate = numbers.map((num) => num + delta);
    if (candidate.some((num) => num < 0)) return;
    variants.push(candidate);
  });
  const tweakLast = numbers.map((num, idx) =>
    idx === numbers.length - 1 ? num + 2 : num
  );
  if (!tweakLast.some((num) => num < 0)) {
    variants.push(tweakLast);
  }

  const seen = new Set<string>();
  const formatted: string[] = [];
  variants.forEach((variant) => {
    const value = formatUsingSegments(answerStr, variant);
    const key = normalizeAnswerValue(value);
    if (!seen.has(key)) {
      seen.add(key);
      formatted.push(value);
    }
  });

  return deterministicShuffle(formatted, `${seed}-sequence`);
}

function buildSingleNumberCandidates(answerStr: string, value: number, seed: string): string[] {
  const numbers = buildNumericChoiceNumbers(value, `${seed}-single`);
  const seen = new Set<string>();
  const formatted = numbers.map((num) => {
    const candidate = formatUsingSegments(answerStr, [num]);
    const key = normalizeAnswerValue(candidate);
    if (seen.has(key)) return null;
    seen.add(key);
    return candidate;
  }).filter(Boolean) as string[];

  if (!formatted.some((opt) => normalizeAnswerValue(opt) === normalizeAnswerValue(answerStr))) {
    formatted.unshift(answerStr);
  }

  return deterministicShuffle(formatted, `${seed}-single-options`);
}

function detectNumberWord(answerStr: string): { value: number; language: 'he' | 'en' } | null {
  const normalized = answerStr
    .trim()
    .toLowerCase()
    .replace(/[״"׳',.?]/g, '')
    .replace(/\s+/g, ' ');

  for (const [value, variants] of Object.entries(HEBREW_NUMBER_WORDS)) {
    if (variants.some((variant) => variant === normalized)) {
      return { value: Number(value), language: 'he' };
    }
  }

  for (const [value, variants] of Object.entries(EN_NUMBER_WORDS)) {
    if (variants.some((variant) => variant === normalized)) {
      return { value: Number(value), language: 'en' };
    }
  }

  return null;
}

function numberToWord(value: number, language: 'he' | 'en'): string | null {
  const map = language === 'he' ? HEBREW_NUMBER_WORDS : EN_NUMBER_WORDS;
  const variants = map[value];
  if (!variants || !variants.length) return null;
  return variants[0];
}

function buildWordCandidates(answerStr: string, value: number, language: 'he' | 'en', seed: string): string[] {
  const numbers = buildNumericChoiceNumbers(value, `${seed}-word`);
  const seen = new Set<string>();
  const formatted = numbers.map((num) => {
    const word = numberToWord(num, language) ?? String(num);
    const key = normalizeAnswerValue(word);
    if (seen.has(key)) return null;
    seen.add(key);
    return word;
  }).filter(Boolean) as string[];

  const answerKey = normalizeAnswerValue(answerStr);
  if (!seen.has(answerKey)) {
    formatted.unshift(answerStr);
  } else {
    const idx = formatted.findIndex((opt) => normalizeAnswerValue(opt) === answerKey);
    if (idx >= 0) formatted[idx] = answerStr;
  }

  return deterministicShuffle(formatted, `${seed}-word-options`);
}

function buildFallbackCandidates(answerStr: string, locale: 'he' | 'en'): string[] {
  const fallbackPool =
    locale === 'he'
      ? ['אני צריך רמז', 'אולי תשובה אחרת', 'אני לא בטוח']
      : ['I need a hint', 'Maybe another answer', "I'm not sure"];
  return [answerStr, ...fallbackPool];
}

function finalizeOptions(baseAnswer: string, candidates: string[], locale: 'he' | 'en', seed: string): string[] {
  const baseKey = normalizeAnswerValue(baseAnswer);
  const store = new Map<string, string>();

  const addCandidate = (value: string) => {
    if (!value) return;
    const key = normalizeAnswerValue(value);
    if (!store.has(key)) {
      store.set(key, value.trim());
    }
  };

  addCandidate(baseAnswer);
  candidates.forEach(addCandidate);

  if (!store.has(baseKey)) {
    store.set(baseKey, baseAnswer.trim());
  }

  let distractors = Array.from(store.entries())
    .filter(([key]) => key !== baseKey)
    .map(([, value]) => value);

  if (distractors.length < 1) {
    const fallbackPool =
      locale === 'he'
        ? ['זה לא נראה נכון', 'תשובה אחרת']
        : ['This looks wrong', 'Another choice'];
    fallbackPool.forEach(addCandidate);
    distractors = Array.from(store.entries())
      .filter(([key]) => key !== baseKey)
      .map(([, value]) => value);
  }

  const shuffledDistractors = deterministicShuffle(distractors, `${seed}-distractors`);
  const limitedDistractors = shuffledDistractors.slice(0, Math.min(3, shuffledDistractors.length));

  const merged = [store.get(baseKey) ?? baseAnswer.trim(), ...limitedDistractors];
  if (merged.length < 2) {
    merged.push(locale === 'he' ? 'לא בטוח' : "I'm not sure");
  }

  return deterministicShuffle(merged, `${seed}-final`);
}

function generateChoiceOptions(question: Question, locale: 'he' | 'en'): string[] {
  const answerStr = String(question.answer).trim();
  const seed = question.id || answerStr || 'question';

  if (question.options && question.options.length > 0) {
    return finalizeOptions(answerStr, question.options.map((opt) => String(opt)), locale, seed);
  }

  if (typeof question.answer === 'number') {
    return finalizeOptions(
      answerStr,
      buildNumericChoiceNumbers(question.answer, seed).map((num) => String(num)),
      locale,
      seed
    );
  }

  if (/^-?\d+(\.\d+)?$/.test(answerStr)) {
    return finalizeOptions(
      answerStr,
      buildNumericChoiceNumbers(Number(answerStr), seed).map((num) => String(num)),
      locale,
      seed
    );
  }

  const multiNumbers = answerStr.match(/-?\d+/g);
  if (multiNumbers && multiNumbers.length >= 2) {
    return finalizeOptions(answerStr, buildSequenceCandidates(answerStr, seed), locale, seed);
  }

  const wordMatch = detectNumberWord(answerStr);
  if (wordMatch) {
    return finalizeOptions(
      answerStr,
      buildWordCandidates(answerStr, wordMatch.value, wordMatch.language, seed),
      locale,
      seed
    );
  }

  const singleNumberMatch = answerStr.match(/-?\d+/);
  if (singleNumberMatch) {
    return finalizeOptions(
      answerStr,
      buildSingleNumberCandidates(answerStr, Number(singleNumberMatch[0]), seed),
      locale,
      seed
    );
  }

  return finalizeOptions(answerStr, buildFallbackCandidates(answerStr, locale), locale, seed);
}

function answersMatch(userValue: string, correctValue: string): boolean {
  return normalizeAnswerValue(userValue) === normalizeAnswerValue(correctValue);
}

export default function StudentGame({ questions, onExit, context, onFinished }: Props) {
  const { t, locale } = useI18n();
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);

  // Welcome screen - shows greeting and topic explanation before starting
  const [showWelcome, setShowWelcome] = useState(true);

  // New state for interactive exercise system
  const [showIntro, setShowIntro] = useState(true); // Show intro before each question
  const [attempts, setAttempts] = useState(0); // Track attempts for current question
  const [showAutoSolve, setShowAutoSolve] = useState(false); // Show auto-solve explanation
  const [showHint, setShowHint] = useState<1 | 2 | null>(null); // Show progressive hints (1 or 2)
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected answer
  const [showLearningAid, setShowLearningAid] = useState(false);

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
  const derivedOptions = useMemo(
    () => (current ? generateChoiceOptions(current, locale) : []),
    [current, locale]
  );

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
        setSelectedOption(null);
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
          setSelectedOption(null);
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
      setSelectedOption(null);
    }, 2000);
  }

  function handleHintDismiss() {
    setShowHint(null);
    setSelectedOption(null);
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
      setSelectedOption(null);
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
    setSelectedOption(null);
    setShowLearningAid(false);
    const nextIndex = index + 1;
    if (nextIndex >= totalQuestions) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
    }
  }

  function checkAnswer(selectedValue: string) {
    if (!current || finished) return;

    const correctStr = String(current.answer).trim();
    const fromQuestionOptions = Array.isArray(current.options)
      ? current.options.map((opt) => String(opt))
      : [];

    const isCorrect =
      answersMatch(selectedValue, correctStr) ||
      fromQuestionOptions.some((opt) => answersMatch(selectedValue, opt));

    if (isCorrect) handleCorrect();
    else handleWrong();
  }

  const handleOptionClick = (val: string) => {
    if (finished) return;
    setSelectedOption(val);
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
    setSelectedOption(null);
    setShowLearningAid(false);
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
          {ensureLTRNumbers(versionLabel())}
        </div>
      </div>
    );
  }


  if (!current) {
    return null;
  }

  // Show welcome screen with greeting and topic explanation first
  if (showWelcome) {
    return (
      <WelcomeScreen
        questions={questions}
        onContinue={() => setShowWelcome(false)}
      />
    );
  }

  // Always show intro screen with a short lesson/context before each question
  if (showIntro) {
    return (
      <IntroScreen
        question={current}
        lesson={lessonContent}
        onContinue={() => setShowIntro(false)}
        onBack={onExit}
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
            showOptions={derivedOptions.length > 0}
            options={derivedOptions}
            selectedOption={selectedOption}
            onOptionClick={handleOptionClick}
          />

          {feedback && (
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">
              {feedback}
            </div>
          )}
        </div>

        {/* Animated helper panel */}
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <span className="text-xl" aria-hidden="true">🎬</span>
              <span>
                {locale === 'he' ? 'צריך לראות איך פותרים עם אנימציה?' : 'Need to see an animated help?'}
              </span>
            </div>
            <button
              type="button"
              className="rounded-xl bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-white"
              onClick={() => setShowLearningAid((prev) => !prev)}
            >
              {showLearningAid
                ? (locale === 'he' ? 'סגור אנימציה' : 'Hide animation')
                : (locale === 'he' ? 'הפעל אנימציה' : 'Play animation')}
            </button>
          </div>

          {showLearningAid && (
            <div className="mt-4">
              <AnimatedLesson
                question={current}
                locale={locale}
                className="border border-blue-100 shadow-none"
              />
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
        {ensureLTRNumbers(versionLabel())}
      </div>
    </div>
  );
}
