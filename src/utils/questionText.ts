// src/utils/questionText.ts
import type { Question } from '../types/questions';
import type { Locale } from '../i18n';

/**
 * Wraps text with Left-to-Right directional marks to ensure proper display in RTL contexts
 * This is essential for mathematical expressions which should always be read left-to-right
 *
 * Uses Unicode LTR Embedding (U+202A) and Pop Directional Formatting (U+202C) characters
 * to isolate the text and ensure it's displayed left-to-right even in RTL environments
 */
export function wrapLTR(text: string): string {
  const LRE = '\u202A'; // Left-to-Right Embedding
  const PDF = '\u202C'; // Pop Directional Formatting
  return `${LRE}${text}${PDF}`;
}

/**
 * Get question prompt text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionPrompt(q: Question, locale: Locale): string {
  if (locale === 'he') {
    return q.promptHe || q.promptEn;
  }
  return q.promptEn || q.promptHe;
}

/**
 * Get question explanation text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionExplanation(
  q: Question,
  locale: Locale
): string | undefined {
  if (locale === 'he') {
    return q.explanationHe || q.explanationEn;
  }
  return q.explanationEn || q.explanationHe;
}

type TopicGuidance = Record<Question['topic'], { he: string; en: string }>;

const TOPIC_GUIDANCE: TopicGuidance = {
  addition: {
    he: 'מחברים את המספרים שבסיפור כדי לדעת מה קיבלנו בסך הכול.',
    en: 'Add the numbers from the story to know the total amount.',
  },
  subtraction: {
    he: 'מחסרים את מה שנלקח כדי להבין כמה נשאר לנו.',
    en: 'Subtract what was taken away to see what is left.',
  },
  multiplication: {
    he: 'מכפילים קבוצות שוות כדי לקבל את הכמות הכוללת.',
    en: 'Multiply equal groups to get the complete amount.',
  },
  numbers: {
    he: 'סופרים אחד-אחד ומוודאים שלא פספסנו אף פריט.',
    en: 'Count one by one and make sure nothing is skipped.',
  },
  evenOdd: {
    he: 'בודקים אם המספר מתחלק ב-2 בלי שארית כדי לדעת אם הוא זוגי.',
    en: 'Check whether the number divides by 2 with no remainder to know if it is even.',
  },
  geometry: {
    he: 'מתבוננים בתכונות של הצורה – צלעות, פינות וסימטריה – כדי להבין מה מתאים.',
    en: 'Look at the shape’s properties – sides, corners, symmetry – to see what matches.',
  },
};

function getTopicGuidance(topic: Question['topic'], locale: Locale): string {
  const fallback =
    locale === 'he'
      ? 'מסדרים את הנתונים ופועלים לפי מה שהשאלה מבקשת.'
      : 'Organize the information and follow what the question asks.';

  return TOPIC_GUIDANCE[topic]?.[locale] ?? fallback;
}

function pickLocalizedExplanation(
  q: Question,
  locale: Locale,
  includeAnswer: boolean
): string | undefined {
  if (includeAnswer) {
    if (locale === 'he') {
      return q.autoSolveExplanationHe || q.explanationHe || q.explanationEn;
    }
    return q.autoSolveExplanationEn || q.explanationEn || q.explanationHe;
  }

  return getQuestionExplanation(q, locale);
}

export function buildUnderstandingNarration(
  q: Question,
  locale: Locale,
  options: { includeAnswer?: boolean } = {}
): string {
  const includeAnswer = options.includeAnswer ?? false;
  const explanation = pickLocalizedExplanation(q, locale, includeAnswer)?.trim();

  if (explanation) {
    return explanation;
  }

  const prompt = getQuestionPrompt(q, locale);
  const topicGuidance = getTopicGuidance(q.topic, locale);

  const questionLine =
    locale === 'he' ? `השאלה אומרת: ${prompt}` : `The question says: ${prompt}`;
  const stepsTitle =
    locale === 'he' ? 'כך נחשוב צעד-צעד:' : 'Think step by step:';
  const stepOne =
    locale === 'he'
      ? '1. קוראים שוב את הנתונים ומדגישים את המספרים החשובים.'
      : '1. Read the information again and highlight the important numbers.';
  const stepTwo =
    locale === 'he'
      ? `2. ${topicGuidance}`
      : `2. ${topicGuidance}`;
  const stepThree = includeAnswer
    ? locale === 'he'
      ? `3. מבצעים את החישוב ומקבלים ${q.answer}, ואז בודקים שהוא מתאים לסיפור.`
      : `3. Perform the calculation to get ${q.answer} and verify it matches the story.`
    : locale === 'he'
    ? '3. מבצעים את הפעולה המתאימה ובודקים שהתוצאה נשמעת הגיונית.'
    : '3. Perform the relevant operation and check that the result makes sense.';
  const closing = includeAnswer
    ? locale === 'he'
      ? `לכן התשובה הסופית היא ${q.answer}.`
      : `That is why the final answer is ${q.answer}.`
    : locale === 'he'
      ? 'ככה אנחנו ודאים שהגענו לתשובה הנכונה גם בלי לראות את הפתרון מראש.'
      : 'Following these steps keeps us confident even before seeing the solution.';

  return `${questionLine}\n\n${stepsTitle}\n${stepOne}\n${stepTwo}\n${stepThree}\n\n${closing}`;
}
