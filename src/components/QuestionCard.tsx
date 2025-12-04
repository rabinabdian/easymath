// src/components/QuestionCard.tsx
import { useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { getQuestionPrompt } from '../utils/questionText';
import { getAssetUrl } from '../utils/assets';
import { speak } from '../utils/speech';
import { VisualAidsDisplay } from './VisualAidsDisplay';

/**
 * Parses sequence from prompt text (e.g., "השלם את הסדרה: 2, 4, 6, __, __")
 * Returns array of numbers and blanks
 */
function parseSequence(prompt: string): (number | null)[] {
  // Find the sequence part - look for pattern like "2, 4, 6, __, __" 
  // Sequences typically appear after a colon and contain numbers separated by commas
  // Match pattern: digits, commas, spaces, and underscores (for blanks)
  const sequencePattern = /[:]\s*([\d\s,__]+)|([\d]+(?:\s*,\s*[\d__]+)+)/;
  const match = prompt.match(sequencePattern);
  
  if (!match) return [];
  
  // Use the first capturing group if available, otherwise use the second
  const sequenceStr = match[1] || match[2] || match[0];
  if (!sequenceStr) return [];
  
  // Split by comma and clean up
  const parts = sequenceStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  
  if (parts.length === 0) return [];
  
  return parts.map(part => {
    // Check for blank indicators (__ or ___)
    if (part === '__' || part === '___' || part.trim().startsWith('_')) return null;
    
    // Try to extract number (remove spaces)
    const numStr = part.replace(/\s/g, '');
    const num = parseInt(numStr, 10);
    return isNaN(num) ? null : num;
  });
}

/**
 * Component to display sequence visually for jump sequence questions
 */
function SequenceDisplay({ sequence }: { sequence: (number | null)[] }) {
  if (sequence.length === 0) return null;
  
  return (
    <div className="my-4 flex flex-wrap items-center justify-center gap-3">
      {sequence.map((item, index) => (
        <div
          key={index}
          className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold shadow-md transition-all ${
            item === null
              ? 'border-2 border-dashed border-slate-400 bg-slate-100 text-slate-500'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
          }`}
        >
          {item === null ? '?' : item}
        </div>
      ))}
    </div>
  );
}

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
  
  const promptText = getQuestionPrompt(question, locale);
  const isSequenceQuestion = question.subtopic?.includes('דילוגים') || 
                             question.subtopic?.includes('סדרות') || 
                             promptText.includes('השלם') ||
                             promptText.includes('סדרה');
  const sequence = isSequenceQuestion ? parseSequence(promptText) : [];

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

      {/* Visual Aids - for children with learning disabilities */}
      {question.visualAids && question.visualAids.length > 0 && (
        <VisualAidsDisplay visualAids={question.visualAids} />
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
          <div>
            <p className="text-lg font-semibold text-slate-900 whitespace-pre-line">
              {promptText}
            </p>
            {/* Display sequence visually for jump sequence questions */}
            {isSequenceQuestion && sequence.length > 0 && (
              <SequenceDisplay sequence={sequence} />
            )}
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
