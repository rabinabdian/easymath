// src/components/IntroScreen.tsx
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';

interface IntroScreenProps {
  question: Question;
  onContinue: () => void;
}

/**
 * IntroScreen - Displays explanation and example before each exercise
 * For children with learning disabilities - uses large text, simple layout
 * Now includes interactive audio with speaker icons!
 */
export function IntroScreen({ question, onContinue }: IntroScreenProps) {
  const { locale } = useI18n();

  const explanation = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const example = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  // If no intro content, skip to question
  if (!explanation && !example) {
    onContinue();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-6xl">📚</div>
          <h2 className="text-3xl font-bold text-slate-800">
            {locale === 'he' ? 'בואו נבין למה!' : "Let's understand why!"}
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            {locale === 'he' ? 'לחץ על הרמקול כדי לשמוע 🔈' : 'Click the speaker to listen 🔈'}
          </p>
        </div>

        {/* Explanation Card with Speaker */}
        {explanation && (
          <div className="mb-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">
                  {locale === 'he' ? 'הסבר' : 'Explanation'}
                </h3>
              </div>
              <InlineSpeaker text={explanation} />
            </div>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
              {explanation}
            </p>
          </div>
        )}

        {/* Example Card with Speaker */}
        {example && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">✨</span>
                <h3 className="text-2xl font-bold text-slate-800">
                  {locale === 'he' ? 'דוגמא' : 'Example'}
                </h3>
              </div>
              <InlineSpeaker text={example} />
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
          {locale === 'he' ? 'הבנתי! בואו נתחיל' : "Got it! Let's start"}
        </button>
      </div>
    </div>
  );
}
