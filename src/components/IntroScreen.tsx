// src/components/IntroScreen.tsx
import { useEffect, useState } from 'react';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';
import { getQuestionPrompt } from '../utils/questionText';
import { getLessonContent, type LocalizedLessonContent } from '../utils/lessonContent';

interface IntroScreenProps {
  question: Question;
  onContinue: () => void;
  lesson?: LocalizedLessonContent;
}

/**
 * IntroScreen - Displays a short lesson before each exercise
 * For children with learning disabilities - uses large text, simple layout
 * 
 * Content priority:
 * 1. Question-specific intro content (if available)
 * 2. Topic/subtopic-based lesson (fallback)
 * 
 * Features:
 * - Shows explanation and example related to the topic
 * - Displays the upcoming question to prepare the student
 * - Interactive audio with speaker icons
 * - Animated sections for maximum engagement and explanation
 */
export function IntroScreen({ question, onContinue, lesson }: IntroScreenProps) {
  const { locale } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const derivedLesson = lesson ?? getLessonContent(question, locale);

  const questionExplanation = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const questionExample = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  const explanation = derivedLesson?.explanation ?? questionExplanation;
  const example = derivedLesson?.example ?? questionExample;
  const steps = derivedLesson?.steps ?? [];
  const tip = derivedLesson?.tip;
  const lessonEmoji = derivedLesson?.emoji || '📚';

  // Get the question text to show a preview
  const questionText = getQuestionPrompt(question, locale);

  // Header text based on locale
  const headerTitle = locale === 'he' ? 'שיעור קצר לפני התרגיל' : 'Short Lesson Before Exercise';
  const headerSubtitle = locale === 'he' ? 'לחץ על הרמקול כדי לשמוע 🔈' : 'Click the speaker to listen 🔈';
  const explanationLabel = locale === 'he' ? 'הסבר' : 'Explanation';
  const exampleLabel = locale === 'he' ? 'דוגמא' : 'Example';
  const upcomingQuestionLabel = locale === 'he' ? 'התרגיל שלך' : 'Your Exercise';
  const continueButton = locale === 'he' ? 'הבנתי! בואו נתחיל' : "Got it! Let's start";
  const stepsTitle = locale === 'he' ? 'שלבי פתרון' : 'Steps to solve';
  const tipTitle = locale === 'he' ? 'טיפ קצר' : 'Quick tip';

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate animation delays for staggered effect
  // Each section appears 200ms after the previous one
  let currentDelay = 300; // Start after header
  const getNextDelay = () => {
    const delay = currentDelay;
    currentDelay += 200;
    return delay;
  };

  // Pre-calculate delays for each section
  const explanationDelay = explanation ? getNextDelay() : 0;
  const stepsDelay = steps.length > 0 ? getNextDelay() : 0;
  const exampleDelay = example ? getNextDelay() : 0;
  const tipDelay = tip ? getNextDelay() : 0;
  const questionDelay = getNextDelay();
  const buttonDelay = getNextDelay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header with animated emoji */}
        <div className={`mb-6 text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div 
            className="mb-3 text-6xl animate-bounce-gentle inline-block"
            style={{ animationDelay: '0.3s' }}
          >
            {lessonEmoji}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {headerTitle}
          </h2>
          <p className="mt-2 text-lg text-slate-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {headerSubtitle}
          </p>
        </div>

        {/* Explanation Card with Speaker */}
        {explanation && (
          <div 
            className={`mb-6 rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${explanationDelay}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-wiggle inline-block" style={{ animationDelay: `${explanationDelay + 300}ms` }}>
                  💡
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{explanationLabel}</h3>
              </div>
              <InlineSpeaker text={explanation} />
            </div>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line animate-fade-in" style={{ animationDelay: `${explanationDelay + 200}ms` }}>
              {explanation}
            </p>
          </div>
        )}

        {/* Step-by-step guidance */}
        {steps.length > 0 && (
          <div 
            className={`mb-8 rounded-3xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg transition-all duration-500 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${stepsDelay}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce-gentle inline-block" style={{ animationDelay: `${stepsDelay + 300}ms` }}>
                  📝
                </span>
                <h3 className="text-2xl font-bold text-blue-900">{stepsTitle}</h3>
              </div>
              <InlineSpeaker text={steps.join('. ')} />
            </div>
            <ol className="space-y-3 text-lg leading-relaxed text-slate-800">
              {steps.map((step, idx) => (
                <li 
                  key={`${idx}-${step.slice(0, 8)}`} 
                  className={`flex gap-3 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: `${stepsDelay + 400 + idx * 150}ms` }}
                >
                  <span className="text-xl font-bold text-blue-700 animate-scale-in inline-block" style={{ animationDelay: `${stepsDelay + 500 + idx * 150}ms` }}>
                    {idx + 1}.
                  </span>
                  <span className="whitespace-pre-line">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Example Card with Speaker */}
        {example && (
          <div 
            className={`mb-6 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300 transition-all duration-500 hover:shadow-xl hover:border-yellow-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${exampleDelay}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce-gentle inline-block" style={{ animationDelay: `${exampleDelay + 300}ms` }}>
                  ✨
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{exampleLabel}</h3>
              </div>
              <InlineSpeaker text={example} />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm animate-scale-in" style={{ animationDelay: `${exampleDelay + 200}ms` }}>
              <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line">
                {example}
              </p>
            </div>
          </div>
        )}

        {/* Quick tip */}
        {tip && (
          <div 
            className={`mb-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 shadow-lg border-4 border-emerald-200 transition-all duration-500 hover:shadow-xl hover:border-emerald-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${tipDelay}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-wiggle inline-block" style={{ animationDelay: `${tipDelay + 300}ms` }}>
                  🎯
                </span>
                <h3 className="text-2xl font-bold text-emerald-900">{tipTitle}</h3>
              </div>
              <InlineSpeaker text={tip} />
            </div>
            <p className="text-xl leading-relaxed text-slate-800 whitespace-pre-line animate-fade-in" style={{ animationDelay: `${tipDelay + 200}ms` }}>
              {tip}
            </p>
          </div>
        )}

        {/* Upcoming Question Preview */}
        <div 
          className={`mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg border-4 border-purple-300 transition-all duration-500 hover:shadow-xl hover:border-purple-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: `${questionDelay}ms` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-gentle inline-block" style={{ animationDelay: `${questionDelay + 300}ms` }}>
                📝
              </span>
              <h3 className="text-2xl font-bold text-slate-800">{upcomingQuestionLabel}</h3>
            </div>
            <InlineSpeaker text={questionText} />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm animate-scale-in" style={{ animationDelay: `${questionDelay + 200}ms` }}>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line text-center">
              {questionText}
            </p>
          </div>
        </div>

        {/* Continue Button - Large and accessible with enhanced animations */}
        <button
          type="button"
          onClick={onContinue}
          className={`w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 hover:shadow-xl ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: `${buttonDelay}ms` }}
        >
          <span className="mr-2 inline-block animate-bounce-gentle" style={{ animationDelay: `${buttonDelay + 200}ms` }}>✅</span>
          {continueButton}
        </button>
      </div>
    </div>
  );
}
