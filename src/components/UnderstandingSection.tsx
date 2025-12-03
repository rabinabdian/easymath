// src/components/UnderstandingSection.tsx
import { useMemo, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { getQuestionPrompt } from '../utils/questionText';
import { speak } from '../utils/speech';

type SectionVariant = 'exercise' | 'solution';

interface UnderstandingSectionProps {
  question: Question;
  variant?: SectionVariant;
  explanationText?: string;
}

/**
 * UnderstandingSection
 * --------------------
 * Shared section that replays the question with guidance about "empty" parts.
 * Adds an accessible speaker icon so that children can listen during the exercise
 * and again on the solution page with the final explanation.
 */
export function UnderstandingSection({
  question,
  variant = 'exercise',
  explanationText,
}: UnderstandingSectionProps) {
  const { locale, t } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const questionPrompt = useMemo(
    () => getQuestionPrompt(question, locale),
    [question, locale]
  );

  const fallbackExplanation =
    locale === 'he'
      ? 'נקשיב להסבר קצר שיעזור לנו למלא את החלקים הריקים צעד צעד.'
      : 'Listen to a short guide that helps us fill the empty parts step by step.';

  const resolvedExplanation = (explanationText?.trim() || fallbackExplanation).trim();

  const playLabel =
    variant === 'solution' ? t('student.solution.play') : t('student.understand.play');

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    const parts: string[] = [
      t('student.understand.title'),
      questionPrompt,
    ];

    if (variant === 'solution') {
      parts.push(`${t('student.solution.answerTitle')}: ${String(question.answer)}`);
    }

    parts.push(resolvedExplanation);
    speak(parts.filter(Boolean).join('. '));

    const duration = Math.min(10000, 2500 + resolvedExplanation.length * 20);
    setTimeout(() => setIsSpeaking(false), duration);
  };

  return (
    <section
      className={`rounded-2xl border border-slate-200 p-4 shadow-sm transition-shadow hover:shadow-md ${
        variant === 'exercise'
          ? 'bg-gradient-to-br from-indigo-50 via-white to-slate-50'
          : 'bg-gradient-to-br from-white via-emerald-50 to-white'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {variant === 'solution'
              ? t('student.solution.explanationTitle')
              : t('student.understand.title')}
          </p>
          <p className="text-sm text-slate-600">
            {t('student.understand.description')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
          aria-label={playLabel}
        >
          <span className="text-2xl" aria-hidden="true">
            🔊
          </span>
          {isSpeaking ? t('student.understand.playing') : playLabel}
        </button>
      </div>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-800">
        {resolvedExplanation}
      </p>
    </section>
  );
}
