// src/components/IntroScreen.tsx
import type { Question, TopicId } from '../types/questions';
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
 */
export function IntroScreen({ question, onContinue, lesson }: IntroScreenProps) {
  const { locale } = useI18n();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-6xl">{lessonEmoji}</div>
          <h2 className="text-3xl font-bold text-slate-800">{headerTitle}</h2>
          <p className="mt-2 text-lg text-slate-600">{headerSubtitle}</p>
        </div>

        <AnimatedLessonPreview
          locale={locale}
          question={question}
          explanation={explanation}
          example={example}
          steps={steps}
          tip={tip}
          questionText={questionText}
        />

        {/* Explanation Card with Speaker */}
        {explanation && (
          <div className="mb-6 rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💡</span>
                <h3 className="text-2xl font-bold text-slate-800">{explanationLabel}</h3>
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
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 shadow-lg border-4 border-yellow-300">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">✨</span>
                <h3 className="text-2xl font-bold text-slate-800">{exampleLabel}</h3>
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

        {/* Upcoming Question Preview */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg border-4 border-purple-300">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📝</span>
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

        {/* Continue Button - Large and accessible */}
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-2xl font-bold text-white shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
        >
          <span className="mr-2">✅</span>
          {continueButton}
        </button>
      </div>
    </div>
  );
}

interface AnimatedLessonPreviewProps {
  locale: 'he' | 'en';
  question: Question;
  explanation?: string;
  example?: string;
  steps: string[];
  tip?: string;
  questionText: string;
}

interface LessonAnimationScene {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight?: string;
  gradient: string;
  badge: string;
}

function AnimatedLessonPreview({
  locale,
  question,
  explanation,
  example,
  steps,
  tip,
  questionText,
}: AnimatedLessonPreviewProps) {
  const scenes = buildLessonScenes({
    locale,
    question,
    explanation,
    example,
    steps,
    tip,
    questionText,
  });

  if (scenes.length === 0) {
    return null;
  }

  const copy = locale === 'he'
    ? {
        stripTitle: 'אנימציה מהירה לפני שמתחילים',
        stripSubtitle: 'הילד עוקב אחרי שלושת השלבים שבאנימציה ומוכן לענות 😊',
      }
    : {
        stripTitle: 'Animated warm-up before we start',
        stripSubtitle: 'Follow the three animated beats and get ready to solve 😊',
      };

  return (
    <div className="mb-8">
      <div className="lesson-animated-strip relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur">
        <div className="lesson-orb lesson-orb-left" />
        <div className="lesson-orb lesson-orb-right" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {copy.stripSubtitle}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{copy.stripTitle}</h3>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`animated-lesson-card relative overflow-hidden rounded-2xl bg-gradient-to-br ${scene.gradient} p-5 shadow-lg`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span className="rounded-full bg-white/50 px-2 py-0.5 text-slate-700 shadow-sm">
                    {scene.badge}
                  </span>
                  <span className="lesson-floating-icon text-3xl">{scene.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{scene.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                  {scene.description}
                </p>
                {scene.highlight && (
                  <div className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 shadow-inner">
                    {scene.highlight}
                  </div>
                )}
                <div className="lesson-card-glow" />
              </div>
            ))}
          </div>

          <div className="lesson-progress-line mt-6">
            <div className="lesson-progress" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface BuildLessonScenesInput {
  locale: 'he' | 'en';
  question: Question;
  explanation?: string;
  example?: string;
  steps: string[];
  tip?: string;
  questionText: string;
}

function buildLessonScenes({
  locale,
  question,
  explanation,
  example,
  steps,
  tip,
  questionText,
}: BuildLessonScenesInput): LessonAnimationScene[] {
  const copy = locale === 'he'
    ? {
        stage1Title: 'שלב 1: מבינים את הסיפור',
        stage2Title: 'שלב 2: רואים דוגמה חיה',
        stage3Title: 'שלב 3: אנחנו נכנסים למשחק',
        stage1Fallback: 'בואו נזהה מה ידוע ומה מחפשים. מציירים או מדמיינים את הסיטואציה.',
        stage2Fallback: 'נעקוב אחרי דוגמה מסודרת. כל שלב קורן בצבע אנימציה שמזכיר מה לעשות.',
        stage3Fallback: 'עכשיו עושים זאת בעצמנו, בדיוק באותה דרך. אין למה לחשוש!',
        stage1Highlight: 'עוצרים, נושמים ומקשיבים להסבר בקול.',
        stage2Highlight: 'מציירים/מסדרים לפי השלבים: קטן → בינוני → גדול.',
        stage3HighlightPrefix: 'בתרגיל שלנו נעשה:',
        badges: ['צעד 1', 'צעד 2', 'צעד 3'],
        questionFallback: 'קוראים לאט את התרגיל הבא ומחפשים מילות מפתח.',
      }
    : {
        stage1Title: 'Step 1: Understand the story',
        stage2Title: 'Step 2: Watch a living example',
        stage3Title: 'Step 3: It is our turn now',
        stage1Fallback: 'Spot what is known, what is missing, and sketch the situation in your mind.',
        stage2Fallback: 'Follow a calm example. Each phase glows so the child can mirror it.',
        stage3Fallback: 'Now we solve it the exact same way. Nice and easy!',
        stage1Highlight: 'Pause, breathe, and listen to the explanation.',
        stage2Highlight: 'Arrange the steps: start small, then grow.',
        stage3HighlightPrefix: 'For this question we will:',
        badges: ['Step 1', 'Step 2', 'Step 3'],
        questionFallback: 'Read the next exercise slowly and hunt the key words.',
      };

  const safeExplanation = truncateText(explanation, 160) ?? copy.stage1Fallback;
  const firstStepsChunk = steps.length > 0 ? steps.slice(0, 2).join(locale === 'he' ? ' → ' : ' → ') : undefined;
  const safeExample = truncateText(example, 130) ?? firstStepsChunk ?? copy.stage2Fallback;
  const safeQuestion = truncateText(questionText, 150) ?? copy.questionFallback;
  const topicIcon = TOPIC_ICONS[question.topic] ?? '🎯';
  const topicAction = (TOPIC_ACTIONS[locale][question.topic] ?? (locale === 'he' ? 'ניישם את הכלל שכרגע למדנו' : 'Apply the rule we just learned'));

  return [
    {
      id: 'concept',
      icon: '🧠',
      title: copy.stage1Title,
      description: safeExplanation,
      highlight: truncateText(tip, 120) ?? copy.stage1Highlight,
      gradient: 'from-sky-50/80 via-white to-indigo-50/70',
      badge: copy.badges[0],
    },
    {
      id: 'example',
      icon: '✨',
      title: copy.stage2Title,
      description: safeExample,
      highlight: firstStepsChunk ?? copy.stage2Highlight,
      gradient: 'from-amber-50/80 via-white to-orange-50/60',
      badge: copy.badges[1],
    },
    {
      id: 'practice',
      icon: topicIcon,
      title: copy.stage3Title,
      description: safeQuestion,
      highlight: `${copy.stage3HighlightPrefix} ${topicAction}`,
      gradient: 'from-emerald-50/80 via-white to-green-50/70',
      badge: copy.badges[2],
    },
  ];
}

const TOPIC_ICONS: Record<TopicId, string> = {
  numbers: '🔢',
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  evenOdd: '⚖️',
  geometry: '📐',
};

const TOPIC_ACTIONS: Record<'he' | 'en', Record<TopicId, string>> = {
  he: {
    numbers: 'נספור בקול ונסמן כל מספר על הציר.',
    addition: 'נחבר קבוצות בצבעים שונים ונראה כמה יש ביחד.',
    subtraction: 'נוריד בעדינות ונבדוק מה נשאר.',
    multiplication: 'ניצור קבוצות שוות ואז נספור את כולן.',
    evenOdd: 'נחלק לזוגות ונראה אם מישהו נשאר לבד.',
    geometry: 'נספור צלעות, קודקודים ונעבור עם האצבע על הצורה.',
  },
  en: {
    numbers: 'Count aloud and track the number line.',
    addition: 'Combine color groups and see the total.',
    subtraction: 'Remove gently and observe what remains.',
    multiplication: 'Build equal groups and count every item.',
    evenOdd: 'Pair up items and see if anyone is left alone.',
    geometry: 'Count sides, corners, and trace the shape.',
  },
};

function truncateText(text?: string, maxLength = 160): string | undefined {
  if (!text) return undefined;
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trim()}…`;
}
