// src/components/AnimatedLesson.tsx
import { useState, useEffect } from 'react';
import type { Question } from '../types/questions';

interface AnimatedLessonProps {
  question: Question;
  onAnimationComplete?: () => void;
  showAnswer?: boolean;
}

/**
 * AnimatedLesson - Visual animation component for math problems
 * 
 * Features:
 * - Shows visual representations of numbers using emojis
 * - Animates addition (items appearing) and subtraction (items disappearing)
 * - Helps students understand the concept visually before answering
 * - Supports simple arithmetic operations with animations
 */
export function AnimatedLesson({ question, onAnimationComplete, showAnswer = false }: AnimatedLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'operation' | 'result'>('initial');

  // Extract numbers from question (for addition/subtraction)
  const extractNumbers = () => {
    const { topic, promptHe } = question;
    
    if (topic === 'addition' || topic === 'subtraction') {
      // Try to extract from prompt like "3 + 4 = ?" or "5 - 2 = ?"
      const match = promptHe.match(/(\d+)\s*[+\-]\s*(\d+)/);
      if (match) {
        const a = parseInt(match[1]);
        const b = parseInt(match[2]);
        const operation = promptHe.includes('+') ? 'add' : 'subtract';
        return { a, b, operation };
      }
    }
    
    return null;
  };

  const numbers = extractNumbers();

  // Choose emoji based on topic
  const getEmoji = () => {
    const { topic } = question;
    switch (topic) {
      case 'addition':
        return '🍎'; // Apples for addition
      case 'subtraction':
        return '⭐'; // Stars for subtraction
      default:
        return '🔵'; // Blue circles as default
    }
  };

  const emoji = getEmoji();

  // Animation sequence
  useEffect(() => {
    if (!numbers || animationPhase === 'result') return;

    const timer = setTimeout(() => {
      if (animationPhase === 'initial') {
        setAnimationPhase('operation');
      } else if (animationPhase === 'operation') {
        setAnimationPhase('result');
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, 2000); // 2 seconds per phase

    return () => clearTimeout(timer);
  }, [animationPhase, numbers, onAnimationComplete]);

  // Count-up animation for initial number
  useEffect(() => {
    if (!numbers || animationPhase !== 'initial') return;
    
    if (currentStep < numbers.a) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, numbers, animationPhase]);

  if (!numbers) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg text-slate-600">אין אנימציה זמינה לשאלה זו</p>
      </div>
    );
  }

  const { a, b, operation } = numbers;
  const answer = operation === 'add' ? a + b : a - b;

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-4 border-blue-200">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {operation === 'add' ? 'בוא נראה איך מחברים!' : 'בוא נראה איך מחסרים!'}
        </h3>
        <p className="text-lg text-slate-600">
          {operation === 'add' ? '➕ אנחנו מוסיפים דברים!' : '➖ אנחנו מוציאים דברים!'}
        </p>
      </div>

      {/* Visual Animation Area */}
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-6 w-full">
        
        {/* Phase 1: Show initial number */}
        {animationPhase === 'initial' && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl font-bold text-slate-700 ltr-numbers">
              מתחילים עם {a} {operation === 'add' ? 'פריטים' : 'פריטים'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md">
              {Array.from({ length: currentStep }).map((_, i) => (
                <span 
                  key={i} 
                  className="text-5xl animate-bounce-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Phase 2: Show operation */}
        {animationPhase === 'operation' && (
          <div className="flex flex-col items-center gap-6">
            {/* Initial amount */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-semibold text-slate-600 ltr-numbers">יש לנו {a}</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {Array.from({ length: a }).map((_, i) => (
                  <span key={i} className="text-4xl">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Operation indicator */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-slate-300" />
              <span className="text-5xl animate-pulse">
                {operation === 'add' ? '➕' : '➖'}
              </span>
              <div className="h-1 w-12 bg-slate-300" />
            </div>

            {/* Second amount */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-semibold text-slate-600 ltr-numbers">
                {operation === 'add' ? `מוסיפים ${b}` : `מוציאים ${b}`}
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {Array.from({ length: b }).map((_, i) => (
                  <span 
                    key={i} 
                    className={operation === 'add' ? 'text-4xl animate-slide-in' : 'text-4xl animate-fade-out opacity-50'}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Show result */}
        {animationPhase === 'result' && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl animate-bounce">🎉</span>
              <p className="text-2xl font-bold text-green-600">
                {operation === 'add' ? 'חיברנו ביחד!' : 'הוצאנו!'}
              </p>
              <span className="text-6xl animate-bounce">🎉</span>
            </div>

            {/* Show result visually */}
            <div className="flex flex-col items-center gap-4">
              {showAnswer && (
                <>
                  <p className="text-xl font-bold text-slate-700 ltr-numbers">
                    עכשיו יש לנו {answer}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 max-w-xl p-6 bg-white rounded-2xl shadow-lg border-4 border-green-300">
                    {Array.from({ length: answer }).map((_, i) => (
                      <span 
                        key={i} 
                        className="text-5xl animate-scale-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <div className="text-4xl font-bold text-green-600 ltr-numbers animate-pulse">
                    = {answer}
                  </div>
                </>
              )}
              {!showAnswer && (
                <div className="text-center space-y-3">
                  <p className="text-2xl font-bold text-slate-700">
                    עכשיו אתה יכול לענות!
                  </p>
                  <p className="text-lg text-slate-600">
                    כמה יש בסך הכל? 🤔
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2">
        <div className={`h-2 w-12 rounded-full ${animationPhase === 'initial' ? 'bg-blue-500' : 'bg-blue-200'}`} />
        <div className={`h-2 w-12 rounded-full ${animationPhase === 'operation' ? 'bg-blue-500' : 'bg-blue-200'}`} />
        <div className={`h-2 w-12 rounded-full ${animationPhase === 'result' ? 'bg-blue-500' : 'bg-blue-200'}`} />
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0) translateY(-20px);
          }
          50% {
            transform: scale(1.2) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
