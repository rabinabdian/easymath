// src/components/AnimatedLesson.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Question } from '../types/questions';
import { InlineSpeaker } from './SpeakerButton';

interface AnimatedLessonProps {
  question: Question;
  locale: 'he' | 'en';
  className?: string;
}

/**
 * AnimatedLesson - Rich animated visual explanations for each topic
 * Designed for children with learning disabilities
 * Shows step-by-step animations to help understand math concepts
 */
export function AnimatedLesson({ question, locale, className = '' }: AnimatedLessonProps) {
  const { topic, subtopic } = question;
  
  // Render appropriate animation based on topic
  switch (topic) {
    case 'numbers':
      return <NumbersAnimation question={question} locale={locale} className={className} />;
    case 'addition':
      return <AdditionAnimation question={question} locale={locale} className={className} />;
    case 'subtraction':
      return <SubtractionAnimation question={question} locale={locale} className={className} />;
    case 'multiplication':
      return <MultiplicationAnimation question={question} locale={locale} className={className} />;
    case 'evenOdd':
      return <EvenOddAnimation question={question} locale={locale} className={className} />;
    case 'geometry':
      if (subtopic?.includes('סימטריה') || subtopic?.includes('שיקוף')) {
        return <SymmetryAnimation locale={locale} className={className} />;
      }
      return <GeometryAnimation locale={locale} className={className} />;
    default:
      return <GenericAnimation locale={locale} className={className} />;
  }
}

// ========================================
// NUMBERS ANIMATION - Counting with visual items
// ========================================
function NumbersAnimation({ question, locale, className }: AnimatedLessonProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const targetNumber = typeof question.answer === 'number' ? question.answer : 5;
  const displayCount = Math.min(targetNumber, 12);
  
  // Use a stable selection based on question id instead of random
  const selectedItem = useMemo(() => {
    const items = ['🍎', '⭐', '🔵', '🌸', '🐱', '🦋', '🎈', '🍪'];
    const hash = (question.id || '0').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return items[hash % items.length] || '⭐';
  }, [question.id]);
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'בואו נלמד לספור!' : "Let's learn to count!";
  const instruction = isHebrew ? 'לחץ להתחלה' : 'Click to start';
  const countingText = isHebrew ? `ספרנו: ${visibleCount}` : `Counted: ${visibleCount}`;
  const audioText = isHebrew 
    ? `בואו נספור ביחד עד ${displayCount}. כל פעם מצביעים ואומרים את המספר. אחת, שתיים, שלוש...`
    : `Let's count together to ${displayCount}. Each time we point and say the number. One, two, three...`;

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setVisibleCount(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    if (visibleCount >= displayCount) {
      // Animation complete - stop playing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setVisibleCount(prev => prev + 1);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [isPlaying, visibleCount, displayCount]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-6 shadow-xl border-4 border-blue-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">🔢</span>
          <h3 className="text-2xl font-bold text-blue-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Counting Display */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4">
        <div className="flex flex-wrap justify-center gap-3 min-h-[80px]">
          {Array.from({ length: displayCount }).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                i < visibleCount 
                  ? 'opacity-100 scale-100 animate-pop-in' 
                  : 'opacity-0 scale-0'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl">{selectedItem}</span>
                <span className={`text-lg font-bold mt-1 ${
                  i === visibleCount - 1 ? 'text-green-600 animate-pulse' : 'text-blue-600'
                }`}>
                  {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Counter Display */}
      <div className="text-center mb-4">
        <div className="inline-block rounded-full bg-gradient-to-r from-green-400 to-emerald-500 px-8 py-3">
          <span className="text-2xl font-bold text-white">{countingText}</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'סופרים...' : 'Counting...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// ADDITION ANIMATION - Two groups combining
// ========================================
function AdditionAnimation({ question, locale, className }: AnimatedLessonProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract numbers from the question prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[+]\s*(\d+)/);
  const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 8) : 3;
  const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), 8) : 2;
  const sum = num1 + num2;
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'בואו נלמד חיבור!' : "Let's learn addition!";
  const instruction = isHebrew ? 'לחץ לראות איך מחברים' : 'Click to see how to add';
  const audioText = isHebrew
    ? `חיבור זה לחבר דברים ביחד. יש לנו ${num1} ועוד ${num2}. כשנחבר אותם ביחד נקבל ${sum}.`
    : `Addition is putting things together. We have ${num1} plus ${num2}. When we add them together we get ${sum}.`;

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    if (step >= 4) {
      // Animation complete - stop playing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setStep(prev => prev + 1);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 p-6 shadow-xl border-4 border-green-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">➕</span>
          <h3 className="text-2xl font-bold text-green-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[200px]">
        <div className="flex flex-col items-center gap-4">
          {/* First Group */}
          <div className={`flex gap-2 transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="rounded-xl border-3 border-dashed border-blue-400 bg-blue-50 p-3">
              <div className="flex gap-1">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={`a-${i}`} className="text-3xl animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>🔵</span>
                ))}
              </div>
              <div className="text-center text-lg font-bold text-blue-700 mt-1">{num1}</div>
            </div>
          </div>

          {/* Plus Sign */}
          <div className={`text-5xl font-bold text-green-600 transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            +
          </div>

          {/* Second Group */}
          <div className={`flex gap-2 transition-all duration-700 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="rounded-xl border-3 border-dashed border-red-400 bg-red-50 p-3">
              <div className="flex gap-1">
                {Array.from({ length: num2 }).map((_, i) => (
                  <span key={`b-${i}`} className="text-3xl animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>🔴</span>
                ))}
              </div>
              <div className="text-center text-lg font-bold text-red-700 mt-1">{num2}</div>
            </div>
          </div>

          {/* Equals and Result */}
          <div className={`flex items-center gap-4 transition-all duration-700 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <span className="text-4xl font-bold text-gray-600">=</span>
            <div className="rounded-xl border-4 border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 p-4 animate-celebrate">
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={`sum-a-${i}`} className="text-2xl">🔵</span>
                ))}
                {Array.from({ length: num2 }).map((_, i) => (
                  <span key={`sum-b-${i}`} className="text-2xl">🔴</span>
                ))}
              </div>
              <div className="text-center text-3xl font-bold text-green-700 mt-2">{sum}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Display */}
      <div className={`text-center mb-4 transition-all duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 px-8 py-3">
          <span className="text-2xl font-bold text-white">{num1} + {num2} = {sum} 🎉</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'מחברים...' : 'Adding...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// SUBTRACTION ANIMATION - Items being removed
// ========================================
function SubtractionAnimation({ question, locale, className }: AnimatedLessonProps) {
  const [step, setStep] = useState(0);
  const [removedCount, setRemovedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract numbers from the question prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[-−]\s*(\d+)/);
  const num1 = mathMatch ? Math.min(parseInt(mathMatch[1]), 10) : 5;
  const num2 = mathMatch ? Math.min(parseInt(mathMatch[2]), num1) : 2;
  const result = num1 - num2;
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'בואו נלמד חיסור!' : "Let's learn subtraction!";
  const instruction = isHebrew ? 'לחץ לראות איך מחסרים' : 'Click to see how to subtract';
  const audioText = isHebrew
    ? `חיסור זה להוריד דברים. יש לנו ${num1}. נוריד ${num2}. נשאר לנו ${result}.`
    : `Subtraction is taking things away. We have ${num1}. We take away ${num2}. We are left with ${result}.`;

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
    setRemovedCount(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (step === 1 && removedCount < num2) {
      const timer = setTimeout(() => {
        setRemovedCount(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (step === 1 && removedCount >= num2) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 800);
      return () => clearTimeout(timer);
    }
    
    if (step < 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (step >= 2) {
      // Animation complete - stop playing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }
  }, [isPlaying, step, removedCount, num2]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 p-6 shadow-xl border-4 border-orange-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">➖</span>
          <h3 className="text-2xl font-bold text-orange-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[180px]">
        <div className="flex flex-col items-center gap-4">
          {/* Starting Items */}
          <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-lg font-bold text-gray-600 mb-2 text-center">
              {isHebrew ? `התחלנו עם ${num1}` : `Started with ${num1}`}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: num1 }).map((_, i) => {
                // Items to remove are the last num2 items (indices num1-num2 to num1-1)
                // We remove them one by one, starting from the last item
                const itemIndexFromEnd = num1 - 1 - i; // 0 = last item, 1 = second to last, etc.
                const shouldBeRemoved = itemIndexFromEnd < removedCount;
                
                return (
                  <div
                    key={`item-${i}`}
                    className={`relative transition-all duration-500 ${
                      shouldBeRemoved
                        ? 'opacity-30 scale-75'
                        : 'opacity-100 scale-100'
                    }`}
                  >
                    <span className="text-4xl">🍎</span>
                    {shouldBeRemoved && (
                      <span className="absolute inset-0 flex items-center justify-center text-4xl animate-pop-in">❌</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minus Indicator */}
          <div className={`flex items-center gap-2 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-3xl font-bold text-red-600">−{num2}</span>
            <span className="text-2xl">👋</span>
          </div>

          {/* Result */}
          <div className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="rounded-xl border-4 border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 p-4 animate-celebrate">
              <div className="text-lg font-bold text-green-700 mb-2 text-center">
                {isHebrew ? 'נשאר:' : 'Left:'}
              </div>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: result }).map((_, i) => (
                  <span key={`result-${i}`} className="text-4xl animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>🍎</span>
                ))}
                {result === 0 && <span className="text-2xl text-gray-500">{isHebrew ? 'כלום!' : 'Nothing!'}</span>}
              </div>
              <div className="text-center text-3xl font-bold text-green-700 mt-2">{result}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Display */}
      <div className={`text-center mb-4 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="inline-block rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3">
          <span className="text-2xl font-bold text-white">{num1} − {num2} = {result} ✅</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'מחסרים...' : 'Subtracting...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// MULTIPLICATION ANIMATION - Groups of items
// ========================================
function MultiplicationAnimation({ question, locale, className }: AnimatedLessonProps) {
  const [visibleGroups, setVisibleGroups] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract numbers from the question prompt
  const mathMatch = question.promptHe?.match(/(\d+)\s*[×x*]\s*(\d+)/);
  const groups = mathMatch ? Math.min(parseInt(mathMatch[1]), 5) : 3;
  const itemsPerGroup = mathMatch ? Math.min(parseInt(mathMatch[2]), 5) : 2;
  const product = groups * itemsPerGroup;
  
  // Use a stable selection based on question id instead of random
  const selectedEmoji = useMemo(() => {
    const groupEmojis = ['⭐', '🍎', '🔵', '🌸', '🦋'];
    const hash = (question.id || '0').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return groupEmojis[hash % groupEmojis.length] || '⭐';
  }, [question.id]);
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'בואו נלמד כפל!' : "Let's learn multiplication!";
  const instruction = isHebrew ? 'לחץ לראות קבוצות' : 'Click to see groups';
  const audioText = isHebrew
    ? `כפל זה קבוצות שוות. יש לנו ${groups} קבוצות ובכל קבוצה ${itemsPerGroup} פריטים. ביחד יש ${product}.`
    : `Multiplication is equal groups. We have ${groups} groups with ${itemsPerGroup} items each. Together there are ${product}.`;

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setVisibleGroups(0);
    setShowResult(false);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (visibleGroups < groups) {
      const timer = setTimeout(() => {
        setVisibleGroups(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
    
    if (visibleGroups >= groups && !showResult) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setIsPlaying(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, visibleGroups, groups, showResult]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 shadow-xl border-4 border-purple-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">✖️</span>
          <h3 className="text-2xl font-bold text-purple-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[200px]">
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: groups }).map((_, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              className={`transition-all duration-700 ${
                groupIndex < visibleGroups
                  ? 'opacity-100 scale-100 animate-pop-in'
                  : 'opacity-0 scale-0'
              }`}
              style={{ animationDelay: `${groupIndex * 100}ms` }}
            >
              <div className="rounded-2xl border-4 border-dashed border-purple-400 bg-purple-50 p-3">
                <div className="text-center text-sm font-bold text-purple-600 mb-2">
                  {isHebrew ? `קבוצה ${groupIndex + 1}` : `Group ${groupIndex + 1}`}
                </div>
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
                    <span key={`item-${groupIndex}-${itemIndex}`} className="text-2xl">{selectedEmoji}</span>
                  ))}
                </div>
                <div className="text-center text-lg font-bold text-purple-700 mt-1">{itemsPerGroup}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className={`mt-6 transition-all duration-700 ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl">=</span>
            <div className="rounded-2xl border-4 border-green-500 bg-gradient-to-br from-green-100 to-emerald-100 p-4 animate-celebrate">
              <div className="text-3xl font-bold text-green-700">{product}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Display */}
      <div className={`text-center mb-4 transition-all duration-500 ${showResult ? 'opacity-100' : 'opacity-0'}`}>
        <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3">
          <span className="text-2xl font-bold text-white">{groups} × {itemsPerGroup} = {product} 🌟</span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'מראה קבוצות...' : 'Showing groups...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// EVEN/ODD ANIMATION - Pairing items
// ========================================
function EvenOddAnimation({ question, locale, className }: AnimatedLessonProps) {
  const [step, setStep] = useState(0);
  const [pairsFormed, setPairsFormed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract number from the question
  const numMatch = question.promptHe?.match(/(\d+)/);
  const number = numMatch ? Math.min(parseInt(numMatch[1]), 12) : 7;
  const isEven = number % 2 === 0;
  const pairs = Math.floor(number / 2);
  const hasLeftover = !isEven;
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'זוגי או אי-זוגי?' : 'Even or Odd?';
  const instruction = isHebrew ? 'לחץ לראות את הבדיקה' : 'Click to check';
  const audioText = isHebrew
    ? `בואו נבדוק אם ${number} הוא זוגי או אי-זוגי. נסדר בזוגות. ${isEven ? 'כולם בזוגות! זה זוגי.' : 'נשאר אחד לבד! זה אי-זוגי.'}`
    : `Let's check if ${number} is even or odd. We'll pair them up. ${isEven ? 'Everyone has a partner! It is even.' : 'One is left alone! It is odd.'}`;

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
    setPairsFormed(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 800);
      return () => clearTimeout(timer);
    }
    
    if (step === 1 && pairsFormed < pairs) {
      const timer = setTimeout(() => {
        setPairsFormed(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
    
    if (step === 1 && pairsFormed >= pairs) {
      const timer = setTimeout(() => {
        setStep(2);
        setIsPlaying(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, step, pairsFormed, pairs]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 p-6 shadow-xl border-4 border-amber-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">⚖️</span>
          <h3 className="text-2xl font-bold text-amber-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[180px]">
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-amber-700">{number}</span>
          <span className="text-lg text-gray-600 ml-2">{isHebrew ? 'פריטים' : 'items'}</span>
        </div>

        {/* Pairing Animation */}
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: pairs }).map((_, pairIndex) => (
            <div
              key={`pair-${pairIndex}`}
              className={`transition-all duration-500 ${
                pairIndex < pairsFormed
                  ? 'opacity-100 scale-100'
                  : 'opacity-30 scale-90'
              }`}
            >
              <div className={`rounded-xl border-4 ${
                pairIndex < pairsFormed 
                  ? 'border-green-400 bg-green-50 animate-pop-in' 
                  : 'border-dashed border-gray-300 bg-gray-50'
              } p-2 flex gap-1`}>
                <span className="text-3xl">🧑</span>
                <span className="text-3xl">🧑</span>
              </div>
            </div>
          ))}
          
          {/* Leftover if odd */}
          {hasLeftover && (
            <div className={`transition-all duration-500 ${
              step >= 2 ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
            }`}>
              <div className={`rounded-xl border-4 ${
                step >= 2 
                  ? 'border-red-400 bg-red-50 animate-wiggle' 
                  : 'border-dashed border-gray-300 bg-gray-50'
              } p-2`}>
                <span className="text-3xl">🧑</span>
                {step >= 2 && (
                  <div className="text-xs font-bold text-red-600 text-center">
                    {isHebrew ? 'לבד!' : 'Alone!'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Result */}
        <div className={`mt-6 transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className={`rounded-2xl p-4 text-center ${isEven ? 'bg-green-100 border-4 border-green-400' : 'bg-orange-100 border-4 border-orange-400'} animate-celebrate`}>
            <div className="text-2xl font-bold">
              {isEven ? (
                <span className="text-green-700">✅ {number} {isHebrew ? 'זוגי!' : 'is Even!'}</span>
              ) : (
                <span className="text-orange-700">❌ {number} {isHebrew ? 'אי-זוגי!' : 'is Odd!'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'בודקים...' : 'Checking...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// GEOMETRY ANIMATION - Shapes intro
// ========================================
function GeometryAnimation({ locale, className }: Omit<AnimatedLessonProps, 'question'>) {
  const [currentShape, setCurrentShape] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const shapes = [
    { name: locale === 'he' ? 'משולש' : 'Triangle', sides: 3, emoji: '🔺', color: 'from-red-100 to-red-200' },
    { name: locale === 'he' ? 'ריבוע' : 'Square', sides: 4, emoji: '🟦', color: 'from-blue-100 to-blue-200' },
    { name: locale === 'he' ? 'מחומש' : 'Pentagon', sides: 5, emoji: '⬠', color: 'from-purple-100 to-purple-200' },
    { name: locale === 'he' ? 'משושה' : 'Hexagon', sides: 6, emoji: '⬡', color: 'from-yellow-100 to-yellow-200' },
  ];
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'צורות גיאומטריות!' : 'Geometric Shapes!';
  const instruction = isHebrew ? 'לחץ לראות צורות' : 'Click to see shapes';
  const audioText = isHebrew
    ? 'צורות שונות במספר הצלעות שלהן. משולש יש 3 צלעות, ריבוע 4, מחומש 5, ומשושה 6 צלעות.'
    : 'Shapes differ in the number of sides. Triangle has 3 sides, square has 4, pentagon has 5, and hexagon has 6 sides.';

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentShape(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentShape >= shapes.length) {
      // Animation complete - stop playing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setCurrentShape(prev => prev + 1);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentShape, shapes.length]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 p-6 shadow-xl border-4 border-teal-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-spin-slow">📐</span>
          <h3 className="text-2xl font-bold text-teal-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[200px]">
        <div className="flex flex-wrap justify-center gap-4">
          {shapes.map((shape, index) => (
            <div
              key={shape.name}
              className={`transition-all duration-700 ${
                index <= currentShape - 1
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-0'
              }`}
            >
              <div className={`rounded-2xl bg-gradient-to-br ${shape.color} p-4 border-4 border-white shadow-lg ${
                index === currentShape - 1 ? 'animate-pop-in ring-4 ring-yellow-400' : ''
              }`}>
                <div className="text-center">
                  <span className="text-5xl block mb-2 animate-float">{shape.emoji}</span>
                  <div className="text-lg font-bold text-gray-800">{shape.name}</div>
                  <div className="text-sm text-gray-600">
                    {shape.sides} {isHebrew ? 'צלעות' : 'sides'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className={`text-center mb-4 transition-all duration-500 ${currentShape >= shapes.length ? 'opacity-100' : 'opacity-50'}`}>
        <div className="inline-block rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-2">
          <span className="text-lg font-bold text-white">
            {isHebrew ? 'ספרו את הצלעות! 📏' : 'Count the sides! 📏'}
          </span>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'מציג צורות...' : 'Showing shapes...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// SYMMETRY ANIMATION - Mirror effect
// ========================================
function SymmetryAnimation({ locale, className }: Omit<AnimatedLessonProps, 'question'>) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const symmetricItems = ['🦋', '❤️', '⭐', '🌸'];
  
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'מה זה סימטריה?' : 'What is Symmetry?';
  const instruction = isHebrew ? 'לחץ לראות סימטריה' : 'Click to see symmetry';
  const audioText = isHebrew
    ? 'סימטריה זה כששני צדדים של צורה נראים אותו דבר. כמו פרפר או לב. אם נקפל על קו האמצע, הצדדים יתאימו.'
    : 'Symmetry is when both sides of a shape look the same. Like a butterfly or heart. If we fold on the middle line, the sides match.';

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (step >= 4) {
      // Animation complete - stop playing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setStep(prev => prev + 1);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 p-6 shadow-xl border-4 border-pink-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">🪞</span>
          <h3 className="text-2xl font-bold text-pink-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {/* Animation Area */}
      <div className="rounded-2xl bg-white p-6 shadow-inner mb-4 min-h-[200px]">
        {/* Symmetry Demo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {/* Left Side */}
          <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="text-6xl">{symmetricItems[0]}</span>
          </div>
          
          {/* Mirror Line */}
          <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-2 h-24 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full animate-pulse" />
            <div className="text-center text-sm font-bold text-pink-600 mt-1">
              {isHebrew ? 'קו סימטריה' : 'Symmetry line'}
            </div>
          </div>
          
          {/* Right Side (Mirror) */}
          <div className={`transition-all duration-700 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <span className="text-6xl transform scale-x-[-1]">{symmetricItems[0]}</span>
          </div>
        </div>

        {/* More Examples */}
        <div className={`transition-all duration-700 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center mb-4 text-lg font-bold text-gray-700">
            {isHebrew ? 'עוד דוגמאות סימטריות:' : 'More symmetric examples:'}
          </div>
          <div className="flex justify-center gap-6">
            {symmetricItems.slice(1).map((item, i) => (
              <div key={item} className="flex items-center animate-pop-in" style={{ animationDelay: `${i * 200}ms` }}>
                <span className="text-4xl">{item}</span>
                <div className="w-1 h-12 bg-pink-300 mx-1 rounded" />
                <span className="text-4xl transform scale-x-[-1]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startAnimation}
        disabled={isPlaying}
        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all ${
          isPlaying 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:scale-105 animate-pulse-slow'
        }`}
      >
        <span className="mr-2">{isPlaying ? '⏳' : '▶️'}</span>
        {isPlaying ? (isHebrew ? 'מראה סימטריה...' : 'Showing symmetry...') : instruction}
      </button>
    </div>
  );
}

// ========================================
// GENERIC ANIMATION - Default fallback
// ========================================
function GenericAnimation({ locale, className }: Omit<AnimatedLessonProps, 'question'>) {
  const isHebrew = locale === 'he';
  const title = isHebrew ? 'בואו ללמוד!' : "Let's learn!";
  const audioText = isHebrew
    ? 'קראו את השאלה בעיון ונסו להבין מה מבקשים. אתם יכולים!'
    : 'Read the question carefully and try to understand what is being asked. You can do it!';

  return (
    <div className={`animated-lesson rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 p-6 shadow-xl border-4 border-indigo-300 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce-slow">💡</span>
          <h3 className="text-2xl font-bold text-indigo-900">{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-inner text-center">
        <div className="text-6xl mb-4 animate-float">🎯</div>
        <p className="text-xl text-gray-700">
          {isHebrew 
            ? 'קראו את השאלה בעיון והשתמשו במה שלמדתם!'
            : 'Read the question carefully and use what you learned!'}
        </p>
      </div>
    </div>
  );
}
