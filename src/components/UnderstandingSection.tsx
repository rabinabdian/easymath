// src/components/UnderstandingSection.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../i18n';
import { speak } from '../utils/speech';

interface UnderstandingSectionProps {
  locale: Locale;
  explanation: string;
  prompt?: string;
  variant?: 'hint' | 'solution';
  showPrompt?: boolean;
  className?: string;
}

export function UnderstandingSection({
  locale,
  explanation,
  prompt,
  variant = 'hint',
  showPrompt,
  className = '',
}: UnderstandingSectionProps) {
  const trimmedExplanation = explanation?.trim();
  const shouldShowPrompt = (showPrompt ?? variant === 'solution') && !!prompt;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const speechText = useMemo(() => {
    if (!trimmedExplanation) return '';

    const parts = [];
    if (shouldShowPrompt && prompt) {
      parts.push(locale === 'he' ? `השאלה: ${prompt}` : `Question: ${prompt}`);
    }
    parts.push(trimmedExplanation);
    return parts.join('\n\n');
  }, [locale, prompt, shouldShowPrompt, trimmedExplanation]);

  if (!trimmedExplanation) {
    return null;
  }

  const title = locale === 'he' ? 'בוא נבין למה' : "Let's understand why";
  const subtitle =
    variant === 'solution'
      ? locale === 'he'
        ? 'הנה הפתרון בקול רגוע וברור.'
        : 'Here is the solution explained calmly.'
      : locale === 'he'
      ? 'רמז תומך שמכוון את החשיבה.'
      : 'A supportive hint to guide your thinking.';
  const buttonLabel = locale === 'he'
    ? isSpeaking
      ? 'מקריא...'
      : 'השמע'
    : isSpeaking
    ? 'Reading...'
    : 'Play audio';

  const gradientClass =
    variant === 'solution'
      ? 'from-emerald-50 via-green-50 to-teal-50 border-emerald-100'
      : 'from-sky-50 via-indigo-50 to-purple-50 border-blue-100';

  const wordCount = speechText ? speechText.split(/\s+/).filter(Boolean).length : 0;
  const estimate = Math.min(15000, Math.max(3500, wordCount * 320));

  const handleSpeak = () => {
    if (!speechText || isSpeaking) return;
    setIsSpeaking(true);
    speak(speechText);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
      timeoutRef.current = null;
    }, estimate);
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-5 shadow-sm ${gradientClass} ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{variant === 'solution' ? '🧠' : '💬'}</span>
          <div>
            <p className="text-lg font-bold text-slate-900">{title}</p>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSpeak}
          disabled={!speechText}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={locale === 'he' ? 'השמע את ההסבר' : 'Play the explanation audio'}
        >
          <span className="text-2xl">{isSpeaking ? '🔈' : '🔊'}</span>
          <span>{buttonLabel}</span>
        </button>
      </div>

      {shouldShowPrompt && prompt && (
        <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-medium text-slate-800 whitespace-pre-line">
          {prompt}
        </div>
      )}

      <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-900">
        {trimmedExplanation}
      </p>
    </div>
  );
}
