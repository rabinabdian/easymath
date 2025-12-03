// src/components/IntroScreen.tsx
import { useState, useEffect } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { speak } from '../utils/speech';
import { useChildSettings } from '../context/ChildSettingsContext';
import { getQuestionPrompt } from '../utils/questionText';

interface IntroScreenProps {
  question: Question;
  onContinue: () => void;
}

/**
 * IntroScreen - Displays explanation and example before each exercise
 * For children with learning disabilities - uses large text, simple layout
 * Now with interactive sound support
 */
export function IntroScreen({ question, onContinue }: IntroScreenProps) {
  const { locale } = useI18n();
  const { settings } = useChildSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const explanation = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const example = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  // Auto-speak explanation when screen loads (if sounds enabled)
  useEffect(() => {
    if (!settings.soundsEnabled || !explanation) return;

    // Small delay to ensure screen is rendered
    const timer = setTimeout(() => {
      setIsSpeaking(true);
      speak(explanation);
      // Reset speaking state after speech completes (approximate duration)
      setTimeout(() => {
        setIsSpeaking(false);
      }, explanation.length * 100 + 2000); // Rough estimate: 100ms per character + 2s buffer
    }, 500);

    return () => clearTimeout(timer);
  }, [explanation, settings.soundsEnabled]);

  // If no intro content, skip to question
  if (!explanation && !example) {
    onContinue();
    return null;
  }

  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    let textToSpeak = '';
    if (explanation) {
      textToSpeak += explanation;
    }
    if (example) {
      if (textToSpeak) textToSpeak += '\n\n';
      textToSpeak += example;
    }

    if (textToSpeak) {
      speak(textToSpeak);
      // Reset after speech completes
      setTimeout(() => {
        setIsSpeaking(false);
      }, textToSpeak.length * 100 + 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-6xl">📚</div>
          <h2 className="text-3xl font-bold text-slate-800">בואו נלמד!</h2>
          <p className="mt-2 text-lg text-slate-600">קודם נבין איך זה עובד</p>
        </div>

        {/* Explanation Card */}
        {explanation && (
          <div className="mb-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">הסבר</h3>
              </div>
              <button
                type="button"
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="flex items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="הקרא את ההסבר"
              >
                <span className="text-2xl">{isSpeaking ? '🔊' : '🔇'}</span>
              </button>
            </div>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
              {explanation}
            </p>
          </div>
        )}

        {/* Example Card */}
        {example && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">✨</span>
                <h3 className="text-2xl font-bold text-slate-800">דוגמא</h3>
              </div>
              {!explanation && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="flex items-center justify-center p-3 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="הקרא את הדוגמא"
                >
                  <span className="text-2xl">{isSpeaking ? '🔊' : '🔇'}</span>
                </button>
              )}
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
                {example}
              </p>
            </div>
          </div>
        )}

        {/* Continue Button - Large and accessible */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
        >
          <span className="mr-2">✅</span>
          הבנתי! בואו נתחיל
        </button>
      </div>
    </div>
  );
}
