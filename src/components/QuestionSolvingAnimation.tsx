// src/components/QuestionSolvingAnimation.tsx
import { useState, useEffect, useCallback } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';

interface QuestionSolvingAnimationProps {
  question: Question;
  className?: string;
}

/**
 * QuestionSolvingAnimation - Shows animated visual help while solving a question
 * Helps students understand how to solve the question step by step
 */
export function QuestionSolvingAnimation({ question, className = '' }: QuestionSolvingAnimationProps) {
  const { locale } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  const isHebrew = locale === 'he';
  const topic = question.topic;
  const answer = typeof question.answer === 'number' ? question.answer : parseInt(String(question.answer), 10);

  const startAnimation = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setStep(0);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    // Different animation steps based on topic
    const maxSteps = topic === 'addition' || topic === 'subtraction' ? 4 : 
                     topic === 'multiplication' ? 3 : 
                     topic === 'numbers' ? 2 : 2;
    
    if (step >= maxSteps) {
      setIsPlaying(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setStep(prev => prev + 1);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [isPlaying, step, topic]);

  // Render different animations based on topic
  switch (topic) {
    case 'numbers':
      return <CountingAnimation 
        answer={answer} 
        isHebrew={isHebrew} 
        isPlaying={isPlaying} 
        step={step}
        onStart={startAnimation}
        className={className}
      />;
    case 'addition':
      return <AdditionSolvingAnimation 
        question={question} 
        isHebrew={isHebrew} 
        isPlaying={isPlaying} 
        step={step}
        onStart={startAnimation}
        className={className}
      />;
    case 'subtraction':
      return <SubtractionSolvingAnimation 
        question={question} 
        isHebrew={isHebrew} 
        isPlaying={isPlaying} 
        step={step}
        onStart={startAnimation}
        className={className}
      />;
    case 'multiplication':
      return <MultiplicationSolvingAnimation 
        question={question} 
        isHebrew={isHebrew} 
        isPlaying={isPlaying} 
        step={step}
        onStart={startAnimation}
        className={className}
      />;
    default:
      return null;
  }
}

// Counting Animation Helper
function CountingAnimation({ 
  answer, 
  isHebrew, 
  isPlaying, 
  step, 
  onStart, 
  className 
}: {
  answer: number;
  isHebrew: boolean;
  isPlaying: boolean;
  step: number;
  onStart: () => void;
  className: string;
}) {
  const visibleCount = Math.min(step, answer);
  const emoji = '🍎';

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border-2 border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-blue-800">
          {isHebrew ? 'בואו נספור ביחד!' : "Let's count together!"}
        </span>
        {!isPlaying && (
          <button
            onClick={onStart}
            className="text-xs px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            {isHebrew ? '▶️ התחל' : '▶️ Start'}
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
          {Array.from({ length: answer }).map((_, i) => (
            <span
              key={i}
              className={`text-3xl transition-all duration-500 ${
                i < visibleCount 
                  ? 'opacity-100 scale-100 animate-pop-in' 
                  : 'opacity-0 scale-0'
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
      
      {step >= answer && (
        <div className="mt-2 text-center">
          <span className="text-lg font-bold text-green-600">
            {isHebrew ? `סך הכל: ${answer}` : `Total: ${answer}`}
          </span>
        </div>
      )}
    </div>
  );
}

// Addition Solving Animation
function AdditionSolvingAnimation({ 
  question, 
  isHebrew, 
  isPlaying, 
  step, 
  onStart, 
  className 
}: {
  question: Question;
  isHebrew: boolean;
  isPlaying: boolean;
  step: number;
  onStart: () => void;
  className: string;
}) {
  const mathMatch = question.promptHe?.match(/(\d+)\s*[+]\s*(\d+)/);
  const num1 = mathMatch ? parseInt(mathMatch[1]) : 3;
  const num2 = mathMatch ? parseInt(mathMatch[2]) : 2;
  const sum = num1 + num2;

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 border-2 border-green-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-green-800">
          {isHebrew ? 'בואו נחבר ביחד!' : "Let's add together!"}
        </span>
        {!isPlaying && (
          <button
            onClick={onStart}
            className="text-xs px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            {isHebrew ? '▶️ התחל' : '▶️ Start'}
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="space-y-3">
          {step >= 1 && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={i} className="text-2xl animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>🔵</span>
                ))}
              </div>
              <span className="text-xl font-bold text-gray-600 mx-2">+</span>
              <div className="flex gap-1">
                {Array.from({ length: num2 }).map((_, i) => (
                  <span key={i} className="text-2xl animate-pop-in" style={{ animationDelay: `${(num1 + i) * 100}ms` }}>🔴</span>
                ))}
              </div>
            </div>
          )}
          
          {step >= 2 && (
            <div className="text-center text-sm text-gray-600">
              {isHebrew ? `יש לנו ${num1} ועוד ${num2}` : `We have ${num1} plus ${num2}`}
            </div>
          )}
          
          {step >= 3 && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1 flex-wrap justify-center max-w-xs">
                {Array.from({ length: sum }).map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < num1 ? '🔵' : '🔴'}
                  </span>
                ))}
              </div>
              <span className="text-xl font-bold text-gray-600 mx-2">=</span>
              <span className="text-2xl font-bold text-green-600">{sum}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Subtraction Solving Animation
function SubtractionSolvingAnimation({ 
  question, 
  isHebrew, 
  isPlaying, 
  step, 
  onStart, 
  className 
}: {
  question: Question;
  isHebrew: boolean;
  isPlaying: boolean;
  step: number;
  onStart: () => void;
  className: string;
}) {
  const mathMatch = question.promptHe?.match(/(\d+)\s*[-−]\s*(\d+)/);
  const num1 = mathMatch ? parseInt(mathMatch[1]) : 5;
  const num2 = mathMatch ? parseInt(mathMatch[2]) : 2;
  const result = num1 - num2;

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-4 border-2 border-orange-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-orange-800">
          {isHebrew ? 'בואו נחסר ביחד!' : "Let's subtract together!"}
        </span>
        {!isPlaying && (
          <button
            onClick={onStart}
            className="text-xs px-3 py-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            {isHebrew ? '▶️ התחל' : '▶️ Start'}
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="space-y-3">
          {step >= 1 && (
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                {isHebrew ? `התחלנו עם ${num1}` : `Started with ${num1}`}
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span key={i} className="text-2xl">🍎</span>
                ))}
              </div>
            </div>
          )}
          
          {step >= 2 && (
            <div className="text-center">
              <div className="text-sm text-red-600 mb-2">
                {isHebrew ? `מוציאים ${num2}` : `Taking away ${num2}`}
              </div>
              <div className="flex gap-1 justify-center flex-wrap">
                {Array.from({ length: num1 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-2xl transition-all ${
                      i >= result ? 'opacity-30 line-through' : 'opacity-100'
                    }`}
                  >
                    🍎
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {step >= 3 && (
            <div className="text-center">
              <div className="text-sm text-green-600 mb-2">
                {isHebrew ? `נשאר:` : `Left:`}
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: result }).map((_, i) => (
                  <span key={i} className="text-2xl animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>🍎</span>
                ))}
                {result === 0 && <span className="text-lg text-gray-500">{isHebrew ? 'כלום!' : 'Nothing!'}</span>}
              </div>
              <div className="text-xl font-bold text-green-600 mt-2">= {result}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Multiplication Solving Animation
function MultiplicationSolvingAnimation({ 
  question, 
  isHebrew, 
  isPlaying, 
  step, 
  onStart, 
  className 
}: {
  question: Question;
  isHebrew: boolean;
  isPlaying: boolean;
  step: number;
  onStart: () => void;
  className: string;
}) {
  const mathMatch = question.promptHe?.match(/(\d+)\s*[×x*]\s*(\d+)/);
  const groups = mathMatch ? parseInt(mathMatch[1]) : 3;
  const itemsPerGroup = mathMatch ? parseInt(mathMatch[2]) : 2;
  const product = groups * itemsPerGroup;

  return (
    <div className={`rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border-2 border-purple-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-purple-800">
          {isHebrew ? 'בואו נכפול ביחד!' : "Let's multiply together!"}
        </span>
        {!isPlaying && (
          <button
            onClick={onStart}
            className="text-xs px-3 py-1 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            {isHebrew ? '▶️ התחל' : '▶️ Start'}
          </button>
        )}
      </div>
      
      {isPlaying && (
        <div className="space-y-3">
          {step >= 1 && (
            <div className="text-center text-sm text-gray-600">
              {isHebrew ? `${groups} קבוצות, בכל קבוצה ${itemsPerGroup}` : `${groups} groups, ${itemsPerGroup} in each`}
            </div>
          )}
          
          {step >= 2 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: groups }).map((_, groupIndex) => (
                <div
                  key={groupIndex}
                  className={`rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-2 transition-all ${
                    groupIndex < step - 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
                      <span key={itemIndex} className="text-xl">⭐</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {step >= 3 && (
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {isHebrew ? `סך הכל: ${product}` : `Total: ${product}`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
