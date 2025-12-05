// src/components/AnimatedLessonContent.tsx
import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

/**
 * AnimatedText - Displays text with a typewriter/fade-in effect
 * Useful for progressive disclosure of lesson content
 */
export function AnimatedText({ text, delay = 0, className = '', onComplete }: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete]);

  return (
    <p
      className={`text-xl leading-relaxed text-slate-700 whitespace-pre-line transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {text}
    </p>
  );
}

interface AnimatedStepProps {
  step: string;
  index: number;
  delay?: number;
}

/**
 * AnimatedStep - Displays a step with a numbered animation
 */
export function AnimatedStep({ step, index, delay = 0 }: AnimatedStepProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay + index * 200);

    return () => clearTimeout(timer);
  }, [delay, index]);

  return (
    <li
      className={`flex gap-3 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-4'
      }`}
    >
      <span
        className={`text-xl font-bold text-blue-700 transition-all duration-500 ${
          isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}
        style={{ transitionDelay: `${delay + index * 200}ms` }}
      >
        {index + 1}.
      </span>
      <span className="whitespace-pre-line">{step}</span>
    </li>
  );
}

interface CountingAnimationProps {
  count: number;
  emoji?: string;
  label?: string;
  delay?: number;
}

/**
 * CountingAnimation - Animated counting visualization
 * Shows items appearing one by one with a counting effect
 */
export function CountingAnimation({ count, emoji = '⭐', label, delay = 0 }: CountingAnimationProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (count === 0) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < count) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 300);

    const startTimer = setTimeout(() => {
      setVisibleCount(1);
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(startTimer);
    };
  }, [count, delay]);

  return (
    <div className="space-y-4">
      {label && (
        <div className="text-center text-lg font-bold text-blue-700">{label}</div>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={`text-5xl transition-all duration-300 ${
              i < visibleCount
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-0 rotate-180'
            }`}
            style={{
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
      {visibleCount > 0 && (
        <div className="text-center">
          <span
            className={`text-3xl font-bold text-green-600 transition-all duration-500 ${
              visibleCount === count ? 'scale-125' : 'scale-100'
            }`}
          >
            {visibleCount} {visibleCount === count ? '✅' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

interface NumberLineAnimationProps {
  from: number;
  to: number;
  delay?: number;
  label?: string;
}

/**
 * NumberLineAnimation - Animated number line showing progression
 */
export function NumberLineAnimation({ from, to, delay = 0, label }: NumberLineAnimationProps) {
  const [currentValue, setCurrentValue] = useState(from);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setCurrentValue((prev) => {
          if (prev < to) {
            return prev + 1;
          }
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        });
      }, 200);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [from, to, delay]);

  const numbers = Array.from({ length: Math.abs(to - from) + 3 }, (_, i) => {
    const start = Math.max(0, from - 1);
    return start + i;
  });

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-center text-sm font-bold text-purple-700">{label}</div>
      )}
      <div className="relative px-4 py-4">
        <div className="h-2 bg-slate-300 rounded-full relative">
          {numbers.map((n) => {
            const position = ((n - numbers[0]) / (numbers[numbers.length - 1] - numbers[0])) * 100;
            const isHighlighted = n === currentValue;
            const isPast = n < currentValue;
            const isFuture = n > currentValue;

            return (
              <div
                key={n}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className={`w-2 h-6 -mt-2 rounded transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-yellow-500 w-3 h-8 scale-125'
                      : isPast
                      ? 'bg-green-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`text-sm font-bold mt-1 transition-all duration-300 ${
                    isHighlighted
                      ? 'text-yellow-600 text-lg scale-125'
                      : isPast
                      ? 'text-green-600'
                      : 'text-slate-500'
                  }`}
                >
                  {n}
                </span>
              </div>
            );
          })}
        </div>
        {isAnimating && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-yellow-600 animate-pulse">
              {currentValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FadeInSection - Wrapper for fade-in animations
 */
export function FadeInSection({ children, delay = 0, className = '' }: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface PulseHighlightProps {
  children: React.ReactNode;
  delay?: number;
}

/**
 * PulseHighlight - Adds a pulsing highlight effect
 */
export function PulseHighlight({ children, delay = 0 }: PulseHighlightProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`inline-block transition-all duration-500 ${
        isPulsing ? 'animate-pulse scale-110' : ''
      }`}
    >
      {children}
    </span>
  );
}
