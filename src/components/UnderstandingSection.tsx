// src/components/UnderstandingSection.tsx
import type { Locale } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';

interface UnderstandingSectionProps {
  locale: Locale;
  prompt?: string;
  explanation?: string;
  variant?: 'hint' | 'solution';
  showPrompt?: boolean;
  className?: string;
  speakerText?: string;
}

const variantConfig = {
  hint: {
    icon: '💡',
    container: 'bg-amber-50 border-2 border-amber-200',
    title: {
      he: 'רמז קטן שיעזור לכם',
      en: 'A little hint to help',
    },
    subtitle: {
      he: 'נחשוב ביחד על דרך לפתרון',
      en: 'Let’s think together about a way to solve it',
    },
  },
  solution: {
    icon: '✨',
    container: 'bg-emerald-50 border-2 border-emerald-200',
    title: {
      he: 'פתרון מודרך שלב אחר שלב',
      en: 'Guided solution step by step',
    },
    subtitle: {
      he: 'כך אנחנו פותרים את זה בהדרגה',
      en: 'This is how we solve it gradually',
    },
  },
};

export function UnderstandingSection({
  locale,
  prompt,
  explanation,
  variant = 'hint',
  showPrompt = true,
  className = '',
  speakerText,
}: UnderstandingSectionProps) {
  if (!prompt && !explanation) {
    return null;
  }

  const config = variantConfig[variant];

  return (
    <section
      className={`
        rounded-3xl p-6 shadow-sm ${config.container}
        ${className}
      `}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {config.title[locale]}
            </h3>
            <p className="text-sm text-slate-600">
              {config.subtitle[locale]}
            </p>
          </div>
        </div>
        {speakerText && <InlineSpeaker text={speakerText} />}
      </div>

      {showPrompt && prompt && (
        <p className="mb-4 rounded-2xl bg-white/70 p-4 text-base font-medium text-slate-800 whitespace-pre-line">
          {prompt}
        </p>
      )}

      {explanation && (
        <p className="rounded-2xl bg-white p-4 text-lg leading-relaxed text-slate-700 whitespace-pre-line">
          {explanation}
        </p>
      )}
    </section>
  );
}
