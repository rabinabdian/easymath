// src/components/IntroScreen.tsx
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';
import type { LocalizedLessonContent } from '../utils/lessonContent';

interface IntroScreenProps {
  question: Question;
  onContinue: () => void;
  lesson?: LocalizedLessonContent;
}

/**
 * IntroScreen - Displays explanation and example before each exercise
 * For children with learning disabilities - uses large text, simple layout
 * Now includes interactive audio with speaker icons!
 */
export function IntroScreen({ question, onContinue, lesson }: IntroScreenProps) {
  const { locale } = useI18n();
  const isHebrew = locale === 'he';

  const fallbackExplanation = isHebrew ? question.introExplanationHe : question.introExplanationEn;
  const fallbackExample = isHebrew ? question.introExampleHe : question.introExampleEn;

  const explanation = lesson?.explanation ?? fallbackExplanation;
  const example = lesson?.example ?? fallbackExample;
  const steps = lesson?.steps?.filter(Boolean) ?? [];
  const tip = lesson?.tip;

  const hasContent = Boolean(
    (explanation && explanation.trim().length > 0) ||
    (example && example.trim().length > 0) ||
    steps.length > 0 ||
    (tip && tip.trim().length > 0)
  );

  // If no intro content, skip to question
  if (!hasContent) {
    onContinue();
    return null;
  }

  const stepsTitle = isHebrew ? 'שלבי פתרון' : 'Steps to solve';
  const tipTitle = isHebrew ? 'טיפ קצר' : 'Quick tip';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-6xl">📚</div>
          <h2 className="text-3xl font-bold text-slate-800">בואו נבין למה!</h2>
          <p className="mt-2 text-lg text-slate-600">לחץ על הרמקול כדי לשמוע 🔈</p>
        </div>

        {/* Explanation Card with Speaker */}
        {explanation && (
          <div className="mb-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">הסבר</h3>
              </div>
              <InlineSpeaker text={explanation} />
            </div>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
              {explanation}
            </p>
          </div>
        )}

        {/* Step-by-step guidance */}
        {steps.length > 0 && (
          <div className="mb-8 rounded-3xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📝</span>
                <h3 className="text-2xl font-bold text-blue-900">{stepsTitle}</h3>
              </div>
              <InlineSpeaker text={steps.join('. ')} />
            </div>
            <ol className="space-y-3 text-lg leading-relaxed text-slate-800">
              {steps.map((step, idx) => (
                <li key={`${idx}-${step.slice(0, 8)}`} className="flex gap-3">
                  <span className="text-xl font-bold text-blue-700">{idx + 1}.</span>
                  <span className="whitespace-pre-line">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Example Card with Speaker */}
        {example && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">✨</span>
                <h3 className="text-2xl font-bold text-slate-800">דוגמא</h3>
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

        {/* Quick tip */}
        {tip && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 shadow-lg border-4 border-emerald-200">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎯</span>
                <h3 className="text-2xl font-bold text-emerald-900">{tipTitle}</h3>
              </div>
              <InlineSpeaker text={tip} />
            </div>
            <p className="text-xl leading-relaxed text-slate-800 whitespace-pre-line">
              {tip}
            </p>
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
