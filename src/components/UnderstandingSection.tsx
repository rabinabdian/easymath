// src/components/UnderstandingSection.tsx
import type { Locale } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';

interface UnderstandingSectionProps {
  locale: Locale;
  prompt: string;
  explanation: string;
  variant?: 'hint' | 'solution';
  showPrompt?: boolean;
  className?: string;
}

const variantStyles = {
  hint: {
    icon: '🤔',
    titleHe: 'עזרה בהבנה',
    titleEn: 'Understanding hint',
    container: 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200'
  },
  solution: {
    icon: '💡',
    titleHe: 'בואו נבין את הפתרון',
    titleEn: "Let's understand the solution",
    container: 'bg-gradient-to-br from-green-50 to-emerald-100 border-emerald-200'
  }
} as const;

export function UnderstandingSection({
  locale,
  prompt,
  explanation,
  variant = 'hint',
  showPrompt = true,
  className = '',
}: UnderstandingSectionProps) {
  const trimmedExplanation = explanation.trim();
  if (!trimmedExplanation) {
    return null;
  }

  const styles = variantStyles[variant];
  const title = locale === 'he' ? styles.titleHe : styles.titleEn;
  const promptLabel = locale === 'he' ? 'השאלה:' : 'Question:';

  return (
    <div
      className={`
        rounded-3xl border-2 p-6 shadow-lg
        ${styles.container}
        ${className}
      `}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{styles.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            {showPrompt && prompt.trim() && (
              <p className="text-sm text-slate-600 whitespace-pre-line">
                <span className="font-semibold">{promptLabel}</span> {prompt}
              </p>
            )}
          </div>
        </div>
        <InlineSpeaker text={trimmedExplanation} />
      </div>

      <p className="mt-4 text-lg leading-relaxed text-slate-700 whitespace-pre-line">
        {trimmedExplanation}
      </p>
    </div>
  );
}
