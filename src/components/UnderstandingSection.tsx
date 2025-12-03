// src/components/UnderstandingSection.tsx
import { InlineSpeaker } from './SpeakerButton';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import type { VisualAid } from '../types/questions';

interface UnderstandingSectionProps {
  locale: 'he' | 'en';
  prompt: string;
  explanation: string;
  variant?: 'hint' | 'solution';
  showPrompt?: boolean;
  className?: string;
  visualAids?: VisualAid[]; // תמיכה בעזרים ויזואליים להסבר
}

/**
 * UnderstandingSection - A component that displays educational explanations
 * with text-to-speech support for children with learning disabilities
 * Now supports visual aids (images, drawings, sketches) to enhance understanding
 */
export function UnderstandingSection({
  locale,
  prompt,
  explanation,
  variant = 'hint',
  showPrompt = false,
  className = '',
  visualAids
}: UnderstandingSectionProps) {
  const isHebrew = locale === 'he';
  const isSolution = variant === 'solution';

  // Labels based on locale and variant
  const title = isSolution
    ? (isHebrew ? 'בוא נבין למה' : 'Let\'s understand why')
    : (isHebrew ? 'רמז להבנה' : 'Hint for understanding');

  const icon = isSolution ? '💡' : '🤔';

  // Build audio text
  const audioText = showPrompt
    ? `${prompt}. ${explanation}`
    : explanation;

  // Style variants
  const variantStyles = isSolution
    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';

  const headerStyles = isSolution
    ? 'text-amber-800'
    : 'text-blue-800';

  return (
    <div className={`rounded-2xl border-2 p-6 shadow-sm ${variantStyles} ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className={`text-xl font-bold ${headerStyles}`}>{title}</h3>
        </div>
        <InlineSpeaker text={audioText} />
      </div>

      {showPrompt && prompt && (
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
            {prompt}
          </p>
        </div>
      )}

      {/* Visual Aids - תמונות, שרטוטים, סקיצות להבנה מירבית */}
      {visualAids && visualAids.length > 0 && (
        <div className="mb-4">
          <VisualAidsDisplay visualAids={visualAids} />
        </div>
      )}

      <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
        {explanation}
      </p>
    </div>
  );
}
