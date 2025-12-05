// src/components/AnimatedMathExplanation.tsx
import { useState, useEffect } from 'react';
import type { Question } from '../types/questions';
import { CountingAnimation, NumberLineAnimation, FadeInSection } from './AnimatedLessonContent';

interface AnimatedMathExplanationProps {
  question: Question;
  explanation: string;
  delay?: number;
}

/**
 * AnimatedMathExplanation - Creates animated visual explanations for math concepts
 * Based on the question topic, shows appropriate animations
 */
export function AnimatedMathExplanation({ question, explanation, delay = 0 }: AnimatedMathExplanationProps) {
  const { topic, promptHe } = question;

  // Parse numbers from prompt
  const mathMatch = promptHe.match(/(\d+)\s*([+\-×x*])\s*(\d+)/);

  switch (topic) {
    case 'addition':
      return <AnimatedAdditionExplanation question={question} mathMatch={mathMatch} delay={delay} />;
    case 'subtraction':
      return <AnimatedSubtractionExplanation question={question} mathMatch={mathMatch} delay={delay} />;
    case 'multiplication':
      return <AnimatedMultiplicationExplanation question={question} mathMatch={mathMatch} delay={delay} />;
    case 'numbers':
      return <AnimatedNumbersExplanation question={question} delay={delay} />;
    default:
      return null;
  }
}

interface AnimatedAdditionExplanationProps {
  question: Question;
  mathMatch: RegExpMatchArray | null;
  delay?: number;
}

function AnimatedAdditionExplanation({ question, mathMatch, delay = 0 }: AnimatedAdditionExplanationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
      setTimeout(() => setStep(2), 1500);
      setTimeout(() => setStep(3), 3000);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!mathMatch) return null;

  const a = parseInt(mathMatch[1]);
  const b = parseInt(mathMatch[3]);
  const sum = a + b;

  if (a > 12 || b > 12) return null;

  return (
    <FadeInSection delay={delay} className="space-y-6">
      {/* Step 1: First group */}
      {step >= 1 && (
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-3 text-lg font-bold text-blue-700 animate-pulse">קבוצה ראשונה: {a}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: a }).map((_, i) => (
                <span
                  key={`a-${i}`}
                  className="text-5xl animate-bounce"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '0.8s',
                  }}
                >
                  🔵
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Plus sign with animation */}
      {step >= 1 && (
        <FadeInSection delay={200}>
          <div className="text-center">
            <span className="text-6xl font-bold text-green-600 animate-pulse">+</span>
          </div>
        </FadeInSection>
      )}

      {/* Step 2: Second group */}
      {step >= 2 && (
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-3 text-lg font-bold text-red-700 animate-pulse">קבוצה שנייה: {b}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: b }).map((_, i) => (
                <span
                  key={`b-${i}`}
                  className="text-5xl animate-bounce"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '0.8s',
                  }}
                >
                  🔴
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Arrow */}
      {step >= 2 && (
        <FadeInSection delay={300}>
          <div className="text-center">
            <span className="text-5xl animate-bounce">⬇️</span>
          </div>
        </FadeInSection>
      )}

      {/* Step 3: Combined result */}
      {step >= 3 && (
        <FadeInSection delay={0}>
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-6 text-center animate-pulse">
            <div className="mb-3 text-xl font-bold text-green-800">ביחד: {sum}</div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Array.from({ length: a }).map((_, i) => (
                <span
                  key={`sum-a-${i}`}
                  className="text-4xl animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  🔵
                </span>
              ))}
              {Array.from({ length: b }).map((_, i) => (
                <span
                  key={`sum-b-${i}`}
                  className="text-4xl animate-fade-in"
                  style={{ animationDelay: `${(a + i) * 50}ms` }}
                >
                  🔴
                </span>
              ))}
            </div>
            <div className="text-4xl font-bold text-green-700 animate-scale-in">
              {a} + {b} = {sum} ✅
            </div>
          </div>
        </FadeInSection>
      )}
    </FadeInSection>
  );
}

interface AnimatedSubtractionExplanationProps {
  question: Question;
  mathMatch: RegExpMatchArray | null;
  delay?: number;
}

function AnimatedSubtractionExplanation({ question, mathMatch, delay = 0 }: AnimatedSubtractionExplanationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
      setTimeout(() => setStep(2), 1500);
      setTimeout(() => setStep(3), 3000);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!mathMatch) return null;

  const a = parseInt(mathMatch[1]);
  const b = parseInt(mathMatch[3]);
  const result = a - b;

  if (a > 15 || b > 15 || result < 0) return null;

  return (
    <FadeInSection delay={delay} className="space-y-6">
      {/* Step 1: Start with all */}
      {step >= 1 && (
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-3 text-lg font-bold text-blue-700">התחלנו עם: {a}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: a }).map((_, i) => (
                <span
                  key={`start-${i}`}
                  className="text-5xl animate-bounce"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  🍎
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Minus sign */}
      {step >= 1 && (
        <FadeInSection delay={200}>
          <div className="text-center">
            <span className="text-6xl font-bold text-red-600 animate-pulse">−</span>
          </div>
        </FadeInSection>
      )}

      {/* Step 2: Items being removed */}
      {step >= 2 && (
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-3 text-lg font-bold text-red-700">הורדנו: {b}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: b }).map((_, i) => (
                <div
                  key={`remove-${i}`}
                  className="relative animate-fade-out"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-5xl opacity-50">🍎</span>
                  <span className="absolute inset-0 flex items-center justify-center text-5xl animate-pulse">
                    ❌
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Arrow */}
      {step >= 2 && (
        <FadeInSection delay={300}>
          <div className="text-center">
            <span className="text-5xl animate-bounce">⬇️</span>
          </div>
        </FadeInSection>
      )}

      {/* Step 3: Result */}
      {step >= 3 && (
        <FadeInSection delay={0}>
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-6 text-center">
            <div className="mb-3 text-xl font-bold text-green-800">נשאר: {result}</div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Array.from({ length: result }).map((_, i) => (
                <span
                  key={`result-${i}`}
                  className="text-5xl animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  🍎
                </span>
              ))}
              {result === 0 && (
                <span className="text-2xl text-gray-500 animate-pulse">כלום לא נשאר</span>
              )}
            </div>
            <div className="text-4xl font-bold text-green-700 animate-scale-in">
              {a} − {b} = {result} ✅
            </div>
          </div>
        </FadeInSection>
      )}
    </FadeInSection>
  );
}

interface AnimatedMultiplicationExplanationProps {
  question: Question;
  mathMatch: RegExpMatchArray | null;
  delay?: number;
}

function AnimatedMultiplicationExplanation({ question, mathMatch, delay = 0 }: AnimatedMultiplicationExplanationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
      setTimeout(() => setStep(2), 2000);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!mathMatch) return null;

  const a = parseInt(mathMatch[1]);
  const b = parseInt(mathMatch[3]);
  const product = a * b;

  if (a > 6 || b > 6) return null;

  return (
    <FadeInSection delay={delay} className="space-y-6">
      {/* Groups visualization */}
      {step >= 1 && (
        <FadeInSection delay={0}>
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-purple-700 mb-4 animate-pulse">
              {a} × {b} = {a} קבוצות של {b}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: a }).map((_, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className="rounded-2xl border-4 border-dashed border-purple-300 bg-purple-50 p-4 animate-fade-in"
                style={{ animationDelay: `${groupIndex * 200}ms` }}
              >
                <div className="text-center text-sm font-bold text-purple-600 mb-2">
                  קבוצה {groupIndex + 1}
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {Array.from({ length: b }).map((_, itemIndex) => (
                    <span
                      key={`item-${groupIndex}-${itemIndex}`}
                      className="text-4xl animate-bounce"
                      style={{ animationDelay: `${(groupIndex * b + itemIndex) * 50}ms` }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="text-center text-sm font-bold text-purple-600 mt-2">= {b}</div>
              </div>
            ))}
          </div>
        </FadeInSection>
      )}

      {/* Result */}
      {step >= 2 && (
        <FadeInSection delay={0}>
          <div className="text-center">
            <span className="text-5xl animate-bounce mb-4 block">⬇️</span>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 p-6 text-center animate-pulse">
            <div className="mb-3 text-xl font-bold text-green-800">
              {a} קבוצות × {b} בכל קבוצה = {product}
            </div>
            <div className="text-4xl font-bold text-green-700 animate-scale-in">
              {a} × {b} = {product} ✅
            </div>
          </div>
        </FadeInSection>
      )}
    </FadeInSection>
  );
}

interface AnimatedNumbersExplanationProps {
  question: Question;
  delay?: number;
}

function AnimatedNumbersExplanation({ question, delay = 0 }: AnimatedNumbersExplanationProps) {
  const { promptHe, answer, subtopic } = question;

  // Counting question
  if (subtopic?.includes('ספירה') || promptHe.includes('ספור') || promptHe.includes('כמה')) {
    const count = typeof answer === 'number' ? answer : 0;
    if (count > 0 && count <= 15) {
      return (
        <FadeInSection delay={delay}>
          <CountingAnimation count={count} emoji="🌟" label="בואו נספור ביחד!" delay={300} />
        </FadeInSection>
      );
    }
  }

  // Neighbors question
  if (subtopic?.includes('שכנים') || promptHe.includes('שכן')) {
    const numMatch = promptHe.match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0]) : 0;
    if (num > 0 && num <= 20) {
      return (
        <FadeInSection delay={delay}>
          <NumberLineAnimation
            from={num - 1}
            to={num + 1}
            delay={300}
            label={`השכנים של ${num}`}
          />
        </FadeInSection>
      );
    }
  }

  return null;
}
