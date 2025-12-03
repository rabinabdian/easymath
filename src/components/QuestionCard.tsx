// src/components/QuestionCard.tsx
import { useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { getQuestionPrompt } from '../utils/questionText';
import { getAssetUrl } from '../utils/assets';
import { speak } from '../utils/speech';

interface QuestionCardProps {
  question: Question;
  showOptions?: boolean;
  onOptionClick?: (value: string) => void;
  className?: string;
}

/**
 * QuestionCard - Unified component for displaying questions with optional images
 *
 * Features:
 * - Bilingual support (Hebrew/English) via i18n context
 * - Optional image display from assetId
 * - Optional multiple choice options
 * - Reading exercises with speaker icon
 * - Responsive layout
 */
export function QuestionCard({
  question,
  showOptions = false,
  onOptionClick,
  className = ''
}: QuestionCardProps) {
  const { locale } = useI18n();
  const assetUrl = getAssetUrl(question.assetId);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    const textToSpeak = getQuestionPrompt(question, locale);
    speak(textToSpeak);

    // Reset after 3 seconds (approximate speech duration)
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Question Image (if exists) */}
      {assetUrl && (
        <div className="flex flex-none items-center justify-center rounded-2xl bg-sky-50 p-3">
          <img
            src={assetUrl}
            alt=""
            className="max-h-40 object-contain drop-shadow-sm rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Question Text */}
      <div className="flex flex-1 flex-col gap-3">
        {question.isReadingExercise ? (
          // Reading Exercise - Show speaker icon instead of text
          <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <button
              type="button"
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              aria-label="הקרא את השאלה"
            >
              <span className="text-5xl">🔊</span>
              <span className="text-sm font-medium text-slate-700">
                {isSpeaking ? 'מקריא...' : 'לחץ לשמיעה'}
              </span>
            </button>
          </div>
        ) : (
          // Regular question - Show text
          <p className="text-lg font-semibold text-slate-900 whitespace-pre-line">
            {getQuestionPrompt(question, locale)}
          </p>
        )}

        {/* Multiple Choice Options */}
        {showOptions && question.options && (
          <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {question.options.map((opt) => (
              <button
                key={opt.toString()}
                type="button"
                onClick={() => onOptionClick?.(String(opt))}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-base font-medium hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
