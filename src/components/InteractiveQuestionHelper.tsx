// src/components/InteractiveQuestionHelper.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Question } from '../types/questions';
import { InlineSpeaker } from './SpeakerButton';

interface InteractiveQuestionHelperProps {
  question: Question;
  locale: 'he' | 'en';
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * InteractiveQuestionHelper - Shows animated step-by-step visual explanation
 * for solving the current question. Designed for children with learning disabilities.
 * 
 * Features:
 * - Animated visual breakdown of the problem
 * - Step-by-step counting with emojis
 * - Audio support via speaker button
 * - Collapsible to avoid overwhelming the student
 */
export function InteractiveQuestionHelper({
  question,
  locale,
  className = '',
  isExpanded = false,
  onToggle,
}: InteractiveQuestionHelperProps) {
  const { topic } = question;

  // Render appropriate animation based on topic
  switch (topic) {
    case 'numbers':
      return (
        <NumbersHelper
          question={question}
          locale={locale}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      );
    case 'addition':
      return (
        <AdditionHelper
          question={question}
          locale={locale}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      );
    case 'subtraction':
      return (
        <SubtractionHelper
          question={question}
          locale={locale}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      );
    case 'multiplication':
      return (
        <MultiplicationHelper
          question={question}
          locale={locale}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      );
    default:
      return (
        <GenericHelper
          question={question}
          locale={locale}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      );
  }
}

interface HelperProps {
  question: Question;
  locale: 'he' | 'en';
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

// ========================================
// NUMBERS HELPER - Step-by-step counting
// ========================================
function NumbersHelper({ question, locale, className, isExpanded, onToggle }: HelperProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const targetNumber = typeof question.answer === 'number' ? Math.min(question.answer, 12) : 5;
  const isHebrew = locale === 'he';

  // Stable emoji selection based on question id
  const emoji = useMemo(() => {
    const emojis = ['🍎', '⭐', '🔵', '🌸', '🐱', '🦋', '🎈', '🍪'];
    const hash = (question.id || '0').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length] || '⭐';
  }, [question.id]);

  const title = isHebrew ? '💡 עזרה בספירה' : '💡 Counting Help';
  const audioText = isHebrew
    ? `בואו נספור ביחד! אחת, שתיים, שלוש... עד ${targetNumber}`
    : `Let's count together! One, two, three... up to ${targetNumber}`;

  const startCounting = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setVisibleCount(0);
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating || !isExpanded) return;
    if (visibleCount >= targetNumber) {
      setIsAnimating(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [isAnimating, visibleCount, targetNumber, isExpanded]);

  // Reset when question changes
  useEffect(() => {
    setVisibleCount(0);
    setIsAnimating(false);
  }, [question.id]);

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-3 text-blue-800 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 ${className}`}
      >
        <span className="text-2xl">🔍</span>
        <span>{isHebrew ? 'צריך עזרה? לחץ כאן!' : 'Need help? Click here!'}</span>
      </button>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4 shadow-lg border-2 border-blue-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔢</span>
          <h4 className="text-lg font-bold text-blue-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <InlineSpeaker text={audioText} />
          <button
            onClick={onToggle}
            className="text-blue-500 hover:text-blue-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Counting display */}
      <div className="rounded-2xl bg-white p-4 shadow-inner mb-3">
        <div className="flex flex-wrap justify-center gap-2 min-h-[60px]">
          {Array.from({ length: targetNumber }).map((_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center transition-all duration-300 ${
                i < visibleCount
                  ? 'opacity-100 scale-100'
                  : 'opacity-20 scale-75'
              }`}
            >
              <span className={`text-3xl ${i === visibleCount - 1 ? 'animate-bounce' : ''}`}>
                {emoji}
              </span>
              <span className={`text-sm font-bold ${
                i < visibleCount ? 'text-blue-600' : 'text-gray-300'
              }`}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Counter and button */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-blue-800">
          {isHebrew ? `ספרנו: ${visibleCount}` : `Counted: ${visibleCount}`}
        </div>
        <button
          onClick={startCounting}
          disabled={isAnimating}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            isAnimating
              ? 'bg-gray-200 text-gray-400'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isAnimating
            ? (isHebrew ? '⏳ סופרים...' : '⏳ Counting...')
            : (isHebrew ? '▶️ התחל לספור' : '▶️ Start counting')}
        </button>
      </div>
    </div>
  );
}

// ========================================
// ADDITION HELPER - Visual combining
// ========================================
function AdditionHelper({ question, locale, className, isExpanded, onToggle }: HelperProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Extract numbers from prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[+]\s*(\d+)/);
  const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 8) : 3;
  const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), 8) : 2;
  const sum = num1 + num2;

  const isHebrew = locale === 'he';
  const title = isHebrew ? '💡 עזרה בחיבור' : '💡 Addition Help';
  const audioText = isHebrew
    ? `חיבור זה לחבר ביחד! יש לנו ${num1} ועוד ${num2}. ביחד זה ${sum}.`
    : `Addition means putting together! We have ${num1} plus ${num2}. Together that's ${sum}.`;

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(0);
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating || !isExpanded) return;
    if (step >= 3) {
      setIsAnimating(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAnimating, step, isExpanded]);

  // Reset when question changes
  useEffect(() => {
    setStep(0);
    setIsAnimating(false);
  }, [question.id]);

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 text-green-800 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 ${className}`}
      >
        <span className="text-2xl">🔍</span>
        <span>{isHebrew ? 'צריך עזרה? לחץ כאן!' : 'Need help? Click here!'}</span>
      </button>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 p-4 shadow-lg border-2 border-green-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">➕</span>
          <h4 className="text-lg font-bold text-green-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <InlineSpeaker text={audioText} />
          <button
            onClick={onToggle}
            className="text-green-500 hover:text-green-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Visual addition */}
      <div className="rounded-2xl bg-white p-4 shadow-inner mb-3">
        <div className="flex flex-col items-center gap-3">
          {/* First group */}
          <div className={`flex items-center gap-1 transition-all duration-500 ${
            step >= 1 ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className="rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 p-2 flex gap-1">
              {Array.from({ length: num1 }).map((_, i) => (
                <span key={`a-${i}`} className="text-2xl">🔵</span>
              ))}
            </div>
            <span className="text-lg font-bold text-blue-600">{num1}</span>
          </div>

          {/* Plus sign */}
          <div className={`text-3xl font-bold text-green-600 transition-all duration-500 ${
            step >= 1 ? 'opacity-100' : 'opacity-30'
          }`}>
            +
          </div>

          {/* Second group */}
          <div className={`flex items-center gap-1 transition-all duration-500 ${
            step >= 2 ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className="rounded-xl border-2 border-dashed border-red-400 bg-red-50 p-2 flex gap-1">
              {Array.from({ length: num2 }).map((_, i) => (
                <span key={`b-${i}`} className="text-2xl">🔴</span>
              ))}
            </div>
            <span className="text-lg font-bold text-red-600">{num2}</span>
          </div>

          {/* Equals and result */}
          <div className={`flex items-center gap-2 transition-all duration-500 ${
            step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <span className="text-2xl font-bold text-gray-600">=</span>
            <div className="rounded-xl border-3 border-green-500 bg-green-100 p-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={`sum-a-${i}`} className="text-xl">🔵</span>
                ))}
                {Array.from({ length: num2 }).map((_, i) => (
                  <span key={`sum-b-${i}`} className="text-xl">🔴</span>
                ))}
              </div>
              <div className="text-center text-2xl font-bold text-green-700 mt-1">{sum}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            isAnimating
              ? 'bg-gray-200 text-gray-400'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isAnimating
            ? (isHebrew ? '⏳ מחברים...' : '⏳ Adding...')
            : (isHebrew ? '▶️ הראה לי איך!' : '▶️ Show me how!')}
        </button>
      </div>
    </div>
  );
}

// ========================================
// SUBTRACTION HELPER - Visual removing
// ========================================
function SubtractionHelper({ question, locale, className, isExpanded, onToggle }: HelperProps) {
  const [step, setStep] = useState(0);
  const [removedCount, setRemovedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Extract numbers from prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[-−]\s*(\d+)/);
  const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 10) : 5;
  const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), num1) : 2;
  const result = num1 - num2;

  const isHebrew = locale === 'he';
  const title = isHebrew ? '💡 עזרה בחיסור' : '💡 Subtraction Help';
  const audioText = isHebrew
    ? `חיסור זה להוציא! יש לנו ${num1}, מורידים ${num2}, נשאר ${result}.`
    : `Subtraction means taking away! We have ${num1}, take away ${num2}, we get ${result}.`;

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(0);
    setRemovedCount(0);
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating || !isExpanded) return;

    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 800);
      return () => clearTimeout(timer);
    }

    if (step === 1 && removedCount < num2) {
      const timer = setTimeout(() => {
        setRemovedCount((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (step === 1 && removedCount >= num2) {
      const timer = setTimeout(() => {
        setStep(2);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, step, removedCount, num2, isExpanded]);

  // Reset when question changes
  useEffect(() => {
    setStep(0);
    setRemovedCount(0);
    setIsAnimating(false);
  }, [question.id]);

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 px-4 py-3 text-orange-800 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 ${className}`}
      >
        <span className="text-2xl">🔍</span>
        <span>{isHebrew ? 'צריך עזרה? לחץ כאן!' : 'Need help? Click here!'}</span>
      </button>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 p-4 shadow-lg border-2 border-orange-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">➖</span>
          <h4 className="text-lg font-bold text-orange-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <InlineSpeaker text={audioText} />
          <button
            onClick={onToggle}
            className="text-orange-500 hover:text-orange-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Visual subtraction */}
      <div className="rounded-2xl bg-white p-4 shadow-inner mb-3">
        <div className="flex flex-col items-center gap-3">
          {/* Starting items */}
          <div className={`text-center transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-sm font-bold text-gray-600 mb-1">
              {isHebrew ? `התחלנו עם ${num1}` : `Started with ${num1}`}
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {Array.from({ length: num1 }).map((_, i) => (
                <div
                  key={`item-${i}`}
                  className={`relative transition-all duration-300 ${
                    i >= result && removedCount > (i - result)
                      ? 'opacity-30 scale-75'
                      : 'opacity-100 scale-100'
                  }`}
                >
                  <span className="text-3xl">🍎</span>
                  {i >= result && removedCount > (i - result) && (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl">❌</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Minus indicator */}
          <div className={`flex items-center gap-2 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-2xl font-bold text-red-600">−{num2}</span>
            <span className="text-xl">👋</span>
          </div>

          {/* Result */}
          <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="rounded-xl border-3 border-green-500 bg-green-100 p-2">
              <div className="text-sm font-bold text-green-700 mb-1 text-center">
                {isHebrew ? 'נשאר:' : 'Left:'}
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: result }).map((_, i) => (
                  <span key={`result-${i}`} className="text-3xl">🍎</span>
                ))}
                {result === 0 && (
                  <span className="text-lg text-gray-500">{isHebrew ? 'כלום!' : 'Nothing!'}</span>
                )}
              </div>
              <div className="text-center text-2xl font-bold text-green-700 mt-1">{result}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            isAnimating
              ? 'bg-gray-200 text-gray-400'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isAnimating
            ? (isHebrew ? '⏳ מחסרים...' : '⏳ Subtracting...')
            : (isHebrew ? '▶️ הראה לי איך!' : '▶️ Show me how!')}
        </button>
      </div>
    </div>
  );
}

// ========================================
// MULTIPLICATION HELPER - Groups visual
// ========================================
function MultiplicationHelper({ question, locale, className, isExpanded, onToggle }: HelperProps) {
  const [visibleGroups, setVisibleGroups] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Extract numbers from prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[×x*]\s*(\d+)/);
  const groups = mathMatch ? Math.min(parseInt(mathMatch[1]), 5) : 3;
  const itemsPerGroup = mathMatch ? Math.min(parseInt(mathMatch[2]), 5) : 2;
  const product = groups * itemsPerGroup;

  // Stable emoji selection
  const emoji = useMemo(() => {
    const emojis = ['⭐', '🍎', '🔵', '🌸', '🦋'];
    const hash = (question.id || '0').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length] || '⭐';
  }, [question.id]);

  const isHebrew = locale === 'he';
  const title = isHebrew ? '💡 עזרה בכפל' : '💡 Multiplication Help';
  const audioText = isHebrew
    ? `כפל זה קבוצות שוות! ${groups} קבוצות, בכל אחת ${itemsPerGroup}. ביחד ${product}.`
    : `Multiplication is equal groups! ${groups} groups, ${itemsPerGroup} in each. Together ${product}.`;

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setVisibleGroups(0);
    setShowResult(false);
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating || !isExpanded) return;

    if (visibleGroups < groups) {
      const timer = setTimeout(() => {
        setVisibleGroups((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (visibleGroups >= groups && !showResult) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, visibleGroups, groups, showResult, isExpanded]);

  // Reset when question changes
  useEffect(() => {
    setVisibleGroups(0);
    setShowResult(false);
    setIsAnimating(false);
  }, [question.id]);

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3 text-purple-800 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 ${className}`}
      >
        <span className="text-2xl">🔍</span>
        <span>{isHebrew ? 'צריך עזרה? לחץ כאן!' : 'Need help? Click here!'}</span>
      </button>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-4 shadow-lg border-2 border-purple-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✖️</span>
          <h4 className="text-lg font-bold text-purple-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <InlineSpeaker text={audioText} />
          <button
            onClick={onToggle}
            className="text-purple-500 hover:text-purple-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Visual multiplication */}
      <div className="rounded-2xl bg-white p-4 shadow-inner mb-3">
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {Array.from({ length: groups }).map((_, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className={`transition-all duration-500 ${
                groupIndex < visibleGroups
                  ? 'opacity-100 scale-100'
                  : 'opacity-20 scale-75'
              }`}
            >
              <div className="rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 p-2">
                <div className="text-xs font-bold text-purple-600 text-center mb-1">
                  {isHebrew ? `קב׳ ${groupIndex + 1}` : `G${groupIndex + 1}`}
                </div>
                <div className="flex gap-0.5 justify-center">
                  {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
                    <span key={`item-${groupIndex}-${itemIndex}`} className="text-xl">
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className={`flex items-center justify-center gap-2 transition-all duration-500 ${
          showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <span className="text-xl">=</span>
          <div className="rounded-xl border-3 border-green-500 bg-green-100 px-4 py-2">
            <span className="text-2xl font-bold text-green-700">{product}</span>
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="flex justify-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            isAnimating
              ? 'bg-gray-200 text-gray-400'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {isAnimating
            ? (isHebrew ? '⏳ מראה קבוצות...' : '⏳ Showing groups...')
            : (isHebrew ? '▶️ הראה לי איך!' : '▶️ Show me how!')}
        </button>
      </div>
    </div>
  );
}

// ========================================
// GENERIC HELPER - General encouragement
// ========================================
function GenericHelper({ locale, className, isExpanded, onToggle }: HelperProps) {
  const isHebrew = locale === 'he';
  const title = isHebrew ? '💡 טיפ' : '💡 Tip';
  const audioText = isHebrew
    ? 'קראו את השאלה בעיון. חשבו לאט ובזהירות. אתם יכולים!'
    : 'Read the question carefully. Think slowly and carefully. You can do it!';

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-100 to-violet-100 px-4 py-3 text-indigo-800 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 ${className}`}
      >
        <span className="text-2xl">🔍</span>
        <span>{isHebrew ? 'צריך עזרה? לחץ כאן!' : 'Need help? Click here!'}</span>
      </button>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 p-4 shadow-lg border-2 border-indigo-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <h4 className="text-lg font-bold text-indigo-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <InlineSpeaker text={audioText} />
          <button
            onClick={onToggle}
            className="text-indigo-500 hover:text-indigo-700 text-xl"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-inner text-center">
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-lg text-gray-700">
          {isHebrew
            ? 'קראו את השאלה בעיון והשתמשו במה שלמדתם!'
            : 'Read the question carefully and use what you learned!'}
        </p>
      </div>
    </div>
  );
}
