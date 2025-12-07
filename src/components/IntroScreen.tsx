// src/components/IntroScreen.tsx
import { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types/questions';
import { useI18n } from '../i18n';
import { InlineSpeaker } from './SpeakerButton';
import { getQuestionPrompt } from '../utils/questionText';
import { getLessonContent, type LocalizedLessonContent } from '../utils/lessonContent';
import { AnimatedLesson } from './AnimatedLesson';
import { useChildSettings } from '../context/ChildSettingsContext';
import { speak, stopSpeaking } from '../utils/speech';

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
 */
export function IntroScreen({ question, onContinue, lesson }: IntroScreenProps) {
  const { locale } = useI18n();
  const { settings } = useChildSettings();
  const navigate = useNavigate();
  const hasPlayedRef = useRef(false);
  const derivedLesson = lesson ?? getLessonContent(question, locale);

  const questionExplanation = locale === 'he' ? question.introExplanationHe : question.introExplanationEn;
  const questionExample = locale === 'he' ? question.introExampleHe : question.introExampleEn;

  const explanation = derivedLesson?.explanation ?? questionExplanation;
  const example = derivedLesson?.example ?? questionExample;
  // Memoize steps to prevent the useEffect dependency from changing on every render
  const steps = useMemo(() => derivedLesson?.steps ?? [], [derivedLesson?.steps]);
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
  const backButton = locale === 'he' ? 'חזרה' : 'Back';

  // Auto-play lesson audio when the setting is enabled
  useEffect(() => {
    // Only play once per intro screen mount
    if (hasPlayedRef.current) return;
    
    // Check if auto-play is enabled and sounds are enabled
    if (!settings.autoPlayLessonAudio || !settings.soundsEnabled) return;
    
    // Build comprehensive audio text for the lesson
    const audioIntro = locale === 'he' 
      ? 'שיעור קצר לפני התרגיל.'
      : 'Short lesson before the exercise.';
    
    const audioParts: string[] = [audioIntro];
    
    // Add explanation if available
    if (explanation) {
      audioParts.push(explanation);
    }
    
    // Add steps if available
    if (steps.length > 0) {
      const stepsIntro = locale === 'he' ? 'שלבי פתרון:' : 'Steps to solve:';
      audioParts.push(stepsIntro);
      steps.forEach((step, idx) => {
        audioParts.push(`${idx + 1}. ${step}`);
      });
    }
    
    // Add example if available
    if (example) {
      const exampleIntro = locale === 'he' ? 'דוגמא:' : 'Example:';
      audioParts.push(exampleIntro);
      audioParts.push(example);
    }
    
    // Add tip if available
    if (tip) {
      const tipIntro = locale === 'he' ? 'טיפ:' : 'Tip:';
      audioParts.push(tipIntro);
      audioParts.push(tip);
    }
    
    // Add the upcoming question
    const questionIntro = locale === 'he'
      ? 'והנה התרגיל שלך:'
      : 'And here is your exercise:';
    audioParts.push(questionIntro);
    audioParts.push(questionText);
    
    // Combine and speak
    const fullAudioText = audioParts.join(' ');
    
    // Mark as played and start speaking
    hasPlayedRef.current = true;
    speak(fullAudioText);
    
    // Cleanup: stop speaking when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [settings.autoPlayLessonAudio, settings.soundsEnabled, explanation, example, steps, tip, questionText, locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back to Home Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            style={{ direction: 'ltr' }}
            aria-label={locale === 'he' ? 'חזרה למסך הראשי' : 'Back to Home'}
          >
            <span className="text-lg">←</span>
            <span>{backButton}</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 text-center animate-fade-slide-down">
          <div className="mb-3 text-6xl animate-bounce-slow">{lessonEmoji}</div>
          <h2 className="text-3xl font-bold text-slate-800">{headerTitle}</h2>
          <p className="mt-2 text-lg text-slate-600">{headerSubtitle}</p>
        </div>

        {/* Animated Visual Lesson - Interactive animation for the topic */}
        <div className="mb-8 animate-fade-slide-up">
          <AnimatedLesson question={question} locale={locale} />
        </div>

        {/* Explanation Card with Speaker */}
        {explanation && (
          <div className="mb-6 rounded-3xl bg-white p-8 shadow-lg animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">{explanationLabel}</h3>
              </div>
              <InlineSpeaker text={explanation} />
            </div>
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line ltr-numbers">
              {explanation}
            </p>
          </div>
        )}

        {/* Step-by-step guidance */}
        {steps.length > 0 && (
          <div className="mb-8 rounded-3xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg animate-fade-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce-slow">📝</span>
                <h3 className="text-2xl font-bold text-blue-900">{stepsTitle}</h3>
              </div>
              <InlineSpeaker text={steps.join('. ')} />
            </div>
            <ol className="space-y-3 text-lg leading-relaxed text-slate-800 stagger-children">
              {steps.map((step, idx) => (
                <li key={`${idx}-${step.slice(0, 8)}`} className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-lg font-bold flex-shrink-0">{idx + 1}</span>
                  <span className="whitespace-pre-line pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Example Card with Speaker */}
        {example && (
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300 animate-fade-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-float">✨</span>
                <h3 className="text-2xl font-bold text-slate-800">{exampleLabel}</h3>
              </div>
              <InlineSpeaker text={example} />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line ltr-numbers">
                {example}
              </p>
            </div>
          </div>
        )}

        {/* Quick tip */}
        {tip && (
          <div className="mb-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 shadow-lg border-4 border-emerald-200 animate-fade-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-scale-pulse">🎯</span>
                <h3 className="text-2xl font-bold text-emerald-900">{tipTitle}</h3>
              </div>
              <InlineSpeaker text={tip} />
            </div>
            <p className="text-xl leading-relaxed text-slate-800 whitespace-pre-line">
              {tip}
            </p>
          </div>
        )}

        {/* Upcoming Question Preview */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg border-4 border-purple-300 animate-fade-slide-up animate-glow" style={{ animationDelay: '0.6s' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-heartbeat">📝</span>
              <h3 className="text-2xl font-bold text-slate-800">{upcomingQuestionLabel}</h3>
            </div>
            <InlineSpeaker text={questionText} />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xl leading-relaxed text-slate-700 whitespace-pre-line text-center">
              {questionText}
            </p>
          </div>
        </div>

        {/* Continue Button - Large and accessible with animation */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 animate-pulse-slow"
        >
          <span className="mr-2 inline-block animate-bounce-slow">✅</span>
          {continueButton}
        </button>
      </div>
    </div>
  );
}
