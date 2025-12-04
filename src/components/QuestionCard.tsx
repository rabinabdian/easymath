// src/components/QuestionCard.tsx
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { getQuestionPrompt } from '../utils/questionText';
import { getAssetUrl } from '../utils/assets';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import { InlineSpeaker, SpeakerButton } from './SpeakerButton';

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
  const questionText = getQuestionPrompt(question, locale);
  const speakerLabel = locale === 'he' ? 'הקרא את השאלה' : 'Read the question';

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

      {/* Visual Aids - for children with learning disabilities */}
      {question.visualAids && question.visualAids.length > 0 && (
        <VisualAidsDisplay visualAids={question.visualAids} />
      )}

      {/* Question Text */}
      <div className="flex flex-1 flex-col gap-3">
        {question.isReadingExercise ? (
          // Reading Exercise - Show speaker icon with supporting text
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <SpeakerButton
              text={questionText}
              size="large"
              variant="primary"
              label={speakerLabel}
            />
            <p className="text-lg font-semibold text-slate-900 text-center whitespace-pre-line">
              {questionText}
            </p>
          </div>
        ) : (
          // Regular question - Show text
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-semibold text-slate-900 whitespace-pre-line text-right flex-1">
              {questionText}
            </p>
            <InlineSpeaker text={questionText} className="shrink-0" />
          </div>
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
