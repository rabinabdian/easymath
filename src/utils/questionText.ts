// src/utils/questionText.ts
import type { Question, TopicId } from '../types/questions';
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

interface UnderstandingOptions {
  includeAnswer?: boolean;
}

/**
 * Build a narration text to help children understand the question
 * This creates a friendly, step-by-step explanation of what the question is asking
 */
export function buildUnderstandingNarration(
  q: Question,
  locale: Locale,
  options: UnderstandingOptions = {}
): string {
  const { includeAnswer = false } = options;
  const isHebrew = locale === 'he';

  // Get the auto-solve explanation if available
  const autoSolveExplanation = isHebrew
    ? q.autoSolveExplanationHe
    : q.autoSolveExplanationEn;

  if (autoSolveExplanation) {
    if (includeAnswer) {
      const answerPrefix = isHebrew ? 'התשובה היא' : 'The answer is';
      return `${autoSolveExplanation} ${answerPrefix} ${q.answer}`;
    }
    return autoSolveExplanation;
  }

  // Fallback: Generate a simple explanation based on question type
  const answer = String(q.answer);

  if (includeAnswer) {
    if (isHebrew) {
      return `בוא נחשוב על זה ביחד. התשובה הנכונה היא ${answer}`;
    }
    return `Let's think about this together. The correct answer is ${answer}`;
  }

  if (isHebrew) {
    return 'קרא את השאלה בעיון ונסה להבין מה מבקשים ממך';
  }
  return 'Read the question carefully and try to understand what is being asked';
}

interface LessonContent {
  explanation: string;
  example: string;
}

const DEFAULT_LESSON_CONTENT: Partial<
  Record<TopicId, Record<Locale, LessonContent>>
> = {
  numbers: {
    he: {
      explanation: 'בספירה אנחנו עוברים פריט־פריט ומעלים מספרים לפי הסדר. נוגעים בכל דבר פעם אחת כדי לא לפספס.',
      example: 'לדוגמה: אם יש 3 כוכבים ⭐⭐⭐ נספור: 1, 2, 3 — וכך נבין שיש שלושה כוכבים.',
    },
    en: {
      explanation: 'When we count we move through each item slowly and say the numbers in order. Touch every item once so nothing is missed.',
      example: 'Example: with 3 stars ⭐⭐⭐ count 1, 2, 3 — that tells us there are three stars.',
    },
  },
  addition: {
    he: {
      explanation: 'בחיבור אנחנו מחברים שתי קבוצות או יותר ורוצים לדעת כמה יש ביחד בסוף.',
      example: 'לדוגמה: 2 תפוחים ועוד תפוח אחד נותנים 3 תפוחים. נספור הכול ביחד כדי למצוא את הסכום.',
    },
    en: {
      explanation: 'Addition means putting two or more groups together to find the total amount.',
      example: 'Example: 2 apples plus 1 more apple makes 3 apples. Count everything together to get the sum.',
    },
  },
  subtraction: {
    he: {
      explanation: 'בחיסור מתחילים ממספר גדול ומורידים ממנו חלק. נבדוק כמה נשאר אחרי שהוצאנו.',
      example: 'לדוגמה: אם היו לי 4 לבבות ונתתי אחד, נשארים לי 3. נסמן מה ירד ונספר את מה שנשאר.',
    },
    en: {
      explanation: 'Subtraction starts with a bigger number and takes some away. We look at what is left after removing items.',
      example: 'Example: start with 4 hearts, give 1 away, and you have 3 left. Cross out what is gone and count the rest.',
    },
  },
  multiplication: {
    he: {
      explanation: 'כפל הוא חיבור חוזר של אותה קבוצה. במקום לחבר שוב ושוב, בודקים כמה קבוצות שוות יש.',
      example: 'לדוגמה: 3 קבוצות של 2 עיגולים הן 6 עיגולים. נספר כמה יש בכל קבוצה ואז כמה קבוצות.',
    },
    en: {
      explanation: 'Multiplication is repeated addition of the same group. Instead of adding again and again we count equal groups.',
      example: 'Example: 3 groups of 2 circles make 6 circles. Count how many are in one group and how many groups you have.',
    },
  },
  evenOdd: {
    he: {
      explanation: 'מספר זוגי מתחלק לשתי קבוצות שוות בלי שארית. מספר אי־זוגי משאיר תמיד פריט בודד.',
      example: 'לדוגמה: 4 הוא זוגי כי אפשר לחלק ל-2 ו-2. אבל 5 ישאיר אחד בודד ולכן הוא אי־זוגי.',
    },
    en: {
      explanation: 'An even number splits into two equal groups with nothing left over. An odd number always leaves a lonely item.',
      example: 'Example: 4 is even because it becomes 2 and 2. But 5 leaves one extra, so it is odd.',
    },
  },
  geometry: {
    he: {
      explanation: 'בגיאומטריה מתבוננים בצורות: כמה צלעות, כמה פינות ואילו חלקים יש סביבנו.',
      example: 'לדוגמה: עיגול חלק בלי פינות, ריבוע עם 4 צלעות שוות, ומשולש עם 3 צלעות.',
    },
    en: {
      explanation: 'Geometry looks at shapes: how many sides, corners, and edges different figures have.',
      example: 'Example: a circle is smooth with no corners, a square has four equal sides, and a triangle has three sides.',
    },
  },
};

const GENERIC_LESSON_CONTENT: Record<Locale, LessonContent> = {
  he: {
    explanation: 'לפני שמתחילים נבין מה מבקשים: מה הנתונים, מה מחפשים, ואיך הדרך תעזור לפתור.',
    example: 'נסמן את הדברים החשובים בשאלה, נתקדם צעד־צעד ונבדוק אם התשובה הגיונית בסוף.',
  },
  en: {
    explanation: 'Before solving, understand what is given, what is missing, and which steps will help.',
    example: 'Highlight the important parts of the question, move step by step, and check that the answer makes sense.',
  },
};

export function buildLessonContent(q: Question, locale: Locale): LessonContent {
  const fromQuestion: LessonContent = {
    explanation:
      locale === 'he'
        ? q.introExplanationHe || ''
        : q.introExplanationEn || '',
    example:
      locale === 'he' ? q.introExampleHe || '' : q.introExampleEn || '',
  };

  if (fromQuestion.explanation || fromQuestion.example) {
    return fromQuestion;
  }

  const topicDefaults =
    DEFAULT_LESSON_CONTENT[q.topic]?.[locale] ||
    GENERIC_LESSON_CONTENT[locale];

  return { ...topicDefaults };
}
