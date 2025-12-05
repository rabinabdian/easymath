import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Question } from '../types/questions';
import { InlineSpeaker } from './SpeakerButton';

interface LessonAnimationProps {
  question: Question;
  locale: 'he' | 'en';
  explanation?: string;
  example?: string;
  questionText: string;
  emoji?: string;
}

interface LessonPhase {
  id: string;
  label: string;
  text?: string;
}

type LessonScene =
  | { type: 'addition'; first: number; second: number; result: number }
  | { type: 'subtraction'; first: number; second: number; result: number }
  | { type: 'multiplication'; first: number; second: number; result: number }
  | { type: 'counting'; count: number }
  | { type: 'evenOdd'; number: number; isEven: boolean }
  | { type: 'geometry'; shape: GeometryShape };

type GeometryShape = 'triangle' | 'square' | 'circle' | 'generic';

/**
 * LessonAnimation - Animated helper shown before exercises
 * Highlights the concept visually and cycles through explanation/example/practice steps
 */
export function LessonAnimation({
  question,
  locale,
  explanation,
  example,
  questionText,
  emoji,
}: LessonAnimationProps) {
  const isHebrew = locale === 'he';

  const phases = useMemo<LessonPhase[]>(() => {
    const base: LessonPhase[] = [];

    if (explanation?.trim()) {
      base.push({
        id: 'concept',
        label: isHebrew ? 'רעיון מרכזי' : 'Core idea',
        text: explanation,
      });
    }

    if (example?.trim()) {
      base.push({
        id: 'example',
        label: isHebrew ? 'דוגמה מצוירת' : 'Guided example',
        text: example,
      });
    }

    if (questionText.trim()) {
      base.push({
        id: 'practice',
        label: isHebrew ? 'עכשיו תורך' : 'Your turn now',
        text: questionText,
      });
    }

    return base;
  }, [example, explanation, isHebrew, questionText]);

  const scene = useMemo(() => buildScene(question), [question]);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    setActivePhase(0);
  }, [phases.length]);

  useEffect(() => {
    if (phases.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActivePhase((index) => (index + 1) % phases.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [phases.length]);

  if (!scene && phases.length === 0) {
    return null;
  }

  const currentPhase = phases[activePhase] ?? phases[0];
  const progress = phases.length > 1 ? (activePhase / (phases.length - 1)) * 100 : 100;

  const badge = isHebrew ? 'אנימציית שיעור' : 'Lesson animation';
  const subtitle = isHebrew
    ? 'צפה בחיבור בין ההסבר לתרגול לפני שמתחילים'
    : 'Watch how the concept flows into your exercise';

  return (
    <div className="lesson-animation-card">
      <div className="lesson-animation-heading">
        <div>
          <p className="lesson-animation-badge">{badge}</p>
          <p className="lesson-animation-title">{subtitle}</p>
        </div>
        <div className="lesson-animation-orb" aria-hidden="true" />
      </div>

      <div className="lesson-animation-stage" aria-live="polite">
        {scene ? renderScene(scene, locale) : <GenericScene emoji={emoji} />}
      </div>

      {currentPhase && (
        <div className="lesson-phase-carousel">
          <div className="lesson-phase-pill">
            <div>
              <p className="lesson-phase-label">{currentPhase.label}</p>
              {currentPhase.text && (
                <p className="lesson-phase-text">{currentPhase.text}</p>
              )}
            </div>
            {currentPhase.text && <InlineSpeaker text={currentPhase.text} />}
          </div>
          {phases.length > 1 && (
            <div
              className="lesson-phase-progress"
              style={{ '--lesson-progress': `${progress}%` } as CSSProperties}
            />
          )}
        </div>
      )}
    </div>
  );
}

function renderScene(scene: LessonScene, locale: 'he' | 'en') {
  switch (scene.type) {
    case 'addition':
      return <AdditionScene {...scene} />;
    case 'subtraction':
      return <SubtractionScene {...scene} />;
    case 'multiplication':
      return <MultiplicationScene {...scene} />;
    case 'counting':
      return <CountingScene count={scene.count} locale={locale} />;
    case 'evenOdd':
      return <EvenOddScene number={scene.number} isEven={scene.isEven} locale={locale} />;
    case 'geometry':
      return <GeometryScene shape={scene.shape} locale={locale} />;
    default:
      return null;
  }
}

function AdditionScene({ first, second, result }: { first: number; second: number; result: number }) {
  const safeFirst = Math.min(first, 8);
  const safeSecond = Math.min(second, 8);
  const safeResult = Math.min(result, 12);

  const resultTokens = Array.from({ length: safeResult }).map((_, idx) =>
    idx < Math.min(safeFirst, safeResult) ? 'blue' : 'pink'
  );

  return (
    <div className="lesson-anim-stack" aria-label="addition visual explanation">
      <div className="lesson-anim-groups-row">
        <div className="lesson-anim-group lesson-anim-group-left">
          {Array.from({ length: safeFirst }).map((_, idx) => (
            <span
              key={`add-left-${idx}`}
              className="lesson-token lesson-token-blue"
              style={{ animationDelay: `${idx * 0.12}s` }}
            />
          ))}
        </div>
        <span className="lesson-anim-operator">+</span>
        <div className="lesson-anim-group lesson-anim-group-right">
          {Array.from({ length: safeSecond }).map((_, idx) => (
            <span
              key={`add-right-${idx}`}
              className="lesson-token lesson-token-pink"
              style={{ animationDelay: `${idx * 0.12}s` }}
            />
          ))}
        </div>
      </div>
      <div className="lesson-anim-arrow" aria-hidden="true">⬇️</div>
      <div className="lesson-anim-result-cloud">
        <div className="lesson-anim-equation">
          {first} + {second} = <strong>{result}</strong>
        </div>
        <div className="lesson-anim-result-stream">
          {resultTokens.map((color, idx) => (
            <span
              key={`add-result-${idx}`}
              className={`lesson-token lesson-token-${color}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubtractionScene({
  first,
  second,
  result,
}: {
  first: number;
  second: number;
  result: number;
}) {
  const safeFirst = Math.min(first, 12);
  const safeResult = Math.max(Math.min(result, 12), 0);

  return (
    <div className="lesson-anim-stack" aria-label="subtraction visual explanation">
      <div className="lesson-anim-group lesson-anim-group-left">
        {Array.from({ length: safeFirst }).map((_, idx) => {
          const isRemaining = idx < safeResult;
          return (
            <span
              key={`sub-${idx}`}
              className={`lesson-token ${
                isRemaining ? 'lesson-token-green' : 'lesson-token-faded'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            />
          );
        })}
      </div>
      <div className="lesson-anim-arrow" aria-hidden="true">⬇️</div>
      <div className="lesson-anim-result-cloud">
        <div className="lesson-anim-equation">
          {first} − {second} = <strong>{result}</strong>
        </div>
        <div className="lesson-anim-result-stream">
          {Array.from({ length: safeResult }).map((_, idx) => (
            <span
              key={`sub-result-${idx}`}
              className="lesson-token lesson-token-green"
              style={{ animationDelay: `${idx * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MultiplicationScene({
  first,
  second,
  result,
}: {
  first: number;
  second: number;
  result: number;
}) {
  const safeRows = Math.min(first, 5);
  const safeCols = Math.min(second, 5);
  const total = safeRows * safeCols;

  return (
    <div className="lesson-anim-stack" aria-label="multiplication visual explanation">
      <div
        className="lesson-anim-grid"
        style={{ gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }).map((_, idx) => (
          <span
            key={`multi-${idx}`}
            className="lesson-token lesson-token-gold"
            style={{ animationDelay: `${idx * 0.05}s` }}
          />
        ))}
      </div>
      <div className="lesson-anim-result-cloud">
        <div className="lesson-anim-equation">
          {first} × {second} = <strong>{result}</strong>
        </div>
      </div>
    </div>
  );
}

function CountingScene({ count, locale }: { count: number; locale: 'he' | 'en' }) {
  const safeCount = Math.max(1, Math.min(count, 12));
  const title = locale === 'he' ? 'נספור בקצב' : 'Let’s count together';

  return (
    <div className="lesson-anim-stack" aria-label="counting visual explanation">
      <p className="lesson-counting-title">{title}</p>
      <div className="lesson-counting-line">
        {Array.from({ length: safeCount }).map((_, idx) => (
          <div
            key={`count-${idx}`}
            className="lesson-counting-node"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            <span>{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvenOddScene({
  number,
  isEven,
  locale,
}: {
  number: number;
  isEven: boolean;
  locale: 'he' | 'en';
}) {
  const pairs = Math.min(Math.floor(number / 2), 6);
  const hasLeftover = number % 2 !== 0;
  const title = locale === 'he' ? 'זוגות' : 'Pairs';
  const evenLabel = locale === 'he' ? 'מספר זוגי' : 'Even number';
  const oddLabel = locale === 'he' ? 'מספר אי-זוגי' : 'Odd number';

  return (
    <div className="lesson-anim-stack" aria-label="even odd visual explanation">
      <p className="lesson-counting-title">{title}</p>
      <div className="lesson-evenodd-pairs">
        {Array.from({ length: pairs }).map((_, idx) => (
          <div
            key={`pair-${idx}`}
            className="lesson-evenodd-pair"
            style={{ animationDelay: `${idx * 0.25}s` }}
          >
            <span role="img" aria-label="pair">
              🧦
            </span>
            <span role="img" aria-label="pair">
              🧦
            </span>
          </div>
        ))}
        {hasLeftover && (
          <div className="lesson-evenodd-leftover">
            <span role="img" aria-label="single sock">
              🧦
            </span>
            <small>{locale === 'he' ? 'לבד' : 'alone'}</small>
          </div>
        )}
      </div>
      <div className={`lesson-evenodd-result ${isEven ? 'even' : 'odd'}`}>
        <span>{number}</span>
        <p>{isEven ? evenLabel : oddLabel}</p>
      </div>
    </div>
  );
}

function GeometryScene({ shape, locale }: { shape: GeometryShape; locale: 'he' | 'en' }) {
  const labels: Record<GeometryShape, string> = {
    triangle: locale === 'he' ? 'משולש' : 'Triangle',
    square: locale === 'he' ? 'ריבוע' : 'Square',
    circle: locale === 'he' ? 'מעגל' : 'Circle',
    generic: locale === 'he' ? 'צורה גאומטרית' : 'Geometric shape',
  };

  return (
    <div className="lesson-anim-stack" aria-label="geometry visual explanation">
      <p className="lesson-counting-title">{labels[shape]}</p>
      <div className="lesson-geometry-stage">
        {shape === 'triangle' && (
          <svg viewBox="0 0 120 110" className="lesson-geometry-svg">
            <polygon points="10,100 110,100 60,15" />
          </svg>
        )}
        {shape === 'square' && (
          <svg viewBox="0 0 120 110" className="lesson-geometry-svg">
            <rect x="20" y="20" width="80" height="80" rx="10" />
          </svg>
        )}
        {shape === 'circle' && (
          <svg viewBox="0 0 120 110" className="lesson-geometry-svg">
            <circle cx="60" cy="55" r="40" />
          </svg>
        )}
        {shape === 'generic' && (
          <div className="lesson-generic-stage">
            <span className="lesson-generic-emoji">📐</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GenericScene({ emoji }: { emoji?: string }) {
  return (
    <div className="lesson-generic-stage">
      <span className="lesson-generic-emoji">{emoji ?? '📚'}</span>
      <div className="lesson-generic-pulse" />
    </div>
  );
}

function buildScene(question: Question): LessonScene | null {
  const prompt = question.promptHe || question.promptEn || '';
  const mathMatch = prompt.match(/(\d+)\s*([+\-−×x*])\s*(\d+)/);

  if (mathMatch) {
    const first = parseInt(mathMatch[1], 10);
    const operator = mathMatch[2];
    const second = parseInt(mathMatch[3], 10);

    if (!Number.isNaN(first) && !Number.isNaN(second)) {
      if (operator === '+') {
        return { type: 'addition', first, second, result: first + second };
      }

      if (operator === '-' || operator === '−') {
        return { type: 'subtraction', first, second, result: first - second };
      }

      if (['×', 'x', '*'].includes(operator)) {
        return { type: 'multiplication', first, second, result: first * second };
      }
    }
  }

  if (question.topic === 'numbers') {
    const answer = toNumber(question.answer);
    if (answer !== null) {
      return { type: 'counting', count: answer };
    }
  }

  if (question.topic === 'evenOdd') {
    const numeric = toNumber(question.answer) ?? extractFirstNumber(prompt);
    if (numeric !== null) {
      return { type: 'evenOdd', number: numeric, isEven: numeric % 2 === 0 };
    }
  }

  if (question.topic === 'geometry') {
    return { type: 'geometry', shape: detectShape(prompt) };
  }

  return null;
}

function toNumber(value: Question['answer']): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function extractFirstNumber(text: string): number | null {
  const match = text.match(/(\d+)/);
  if (!match) {
    return null;
  }
  const value = parseInt(match[1], 10);
  return Number.isNaN(value) ? null : value;
}

function detectShape(prompt: string): GeometryShape {
  const normalized = prompt.toLowerCase();
  if (prompt.includes('משולש') || normalized.includes('triangle')) {
    return 'triangle';
  }
  if (prompt.includes('ריבוע') || normalized.includes('square')) {
    return 'square';
  }
  if (prompt.includes('מעגל') || prompt.includes('עיגול') || normalized.includes('circle')) {
    return 'circle';
  }
  return 'generic';
}
