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

/**
 * Generate default intro lesson content based on topic and subtopic
 * This ensures every exercise has a helpful lesson before it
 */
export function generateDefaultIntroLesson(
  question: Question,
  locale: Locale
): { explanation: string; example: string } {
  const isHebrew = locale === 'he';
  const topic = question.topic;
  const subtopic = question.subtopic;

  // Topic-based lessons
  const lessons: Record<string, { explanation: { he: string; en: string }; example: { he: string; en: string } }> = {
    numbers: {
      explanation: {
        he: 'ספירה זה קל!\nאנחנו פשוט סופרים כל דבר בנפרד:\n1... 2... 3...',
        en: 'Counting is easy!\nWe just count each item separately:\n1... 2... 3...'
      },
      example: {
        he: 'דוגמא: אם יש לנו 🍌🍌\nאנחנו סופרים: 1, 2\nיש לנו 2 בננות!',
        en: 'Example: If we have 🍌🍌\nWe count: 1, 2\nWe have 2 bananas!'
      }
    },
    addition: {
      explanation: {
        he: 'חיבור זה כשאנחנו מוסיפים דברים!\nאם יש לנו משהו, ומוסיפים עוד - זה חיבור!',
        en: 'Addition is when we add things together!\nIf we have something and add more - that is addition!'
      },
      example: {
        he: 'דוגמא: יש לי 1 כדור ⚽\nקיבלתי עוד כדור אחד ⚽\nעכשיו יש לי 2 כדורים! ⚽⚽',
        en: 'Example: I have 1 ball ⚽\nI got one more ball ⚽\nNow I have 2 balls! ⚽⚽'
      }
    },
    subtraction: {
      explanation: {
        he: 'חיסור זה כשאנחנו מוציאים דברים!\nאם היה לנו משהו, והוצאנו ממנו - זה חיסור!',
        en: 'Subtraction is when we take things away!\nIf we had something and took some away - that is subtraction!'
      },
      example: {
        he: 'דוגמא: היו לי 3 עוגיות 🍪🍪🍪\nאכלתי 1 עוגיה 🍪\nנשארו לי 2 עוגיות! 🍪🍪',
        en: 'Example: I had 3 cookies 🍪🍪🍪\nI ate 1 cookie 🍪\nI have 2 cookies left! 🍪🍪'
      }
    },
    multiplication: {
      explanation: {
        he: 'כפל זה קבוצות של אותו דבר!\nאם יש לנו כמה קבוצות שוות - זה כפל!',
        en: 'Multiplication is groups of the same thing!\nIf we have several equal groups - that is multiplication!'
      },
      example: {
        he: 'דוגמא: יש לי 3 קבוצות של 2 כדורים ⚽⚽\nכל קבוצה = 2 כדורים\n3 × 2 = 6 כדורים! ⚽⚽⚽⚽⚽⚽',
        en: 'Example: I have 3 groups of 2 balls ⚽⚽\nEach group = 2 balls\n3 × 2 = 6 balls! ⚽⚽⚽⚽⚽⚽'
      }
    },
    geometry: {
      explanation: {
        he: 'גיאומטריה זה לימוד צורות!\nצורות שונות יש להן תכונות שונות - מספר צלעות, פינות ועוד.',
        en: 'Geometry is the study of shapes!\nDifferent shapes have different properties - number of sides, corners, and more.'
      },
      example: {
        he: 'דוגמא: ריבוע ⬜ יש לו 4 צלעות שוות\nמשולש 🔺 יש לו 3 צלעות',
        en: 'Example: A square ⬜ has 4 equal sides\nA triangle 🔺 has 3 sides'
      }
    },
    evenOdd: {
      explanation: {
        he: 'מספרים זוגיים ואי-זוגיים!\nמספר זוגי מתחלק ב-2 ללא שארית\nמספר אי-זוגי לא מתחלק ב-2 בדיוק',
        en: 'Even and odd numbers!\nAn even number divides by 2 without remainder\nAn odd number does not divide by 2 exactly'
      },
      example: {
        he: 'דוגמא: 2, 4, 6 הם זוגיים (מתחלקים ב-2)\n1, 3, 5 הם אי-זוגיים (לא מתחלקים ב-2)',
        en: 'Example: 2, 4, 6 are even (divide by 2)\n1, 3, 5 are odd (do not divide by 2)'
      }
    }
  };

  // Subtopic-specific lessons (override topic lessons if available)
  const subtopicLessons: Record<string, { explanation: { he: string; en: string }; example: { he: string; en: string } }> = {
    'ספירה': {
      explanation: {
        he: 'כשאנחנו סופרים, חשוב לספור לאט\nולוודא שלא פספסנו שום דבר!',
        en: 'When counting, it is important to count slowly\nand make sure we don\'t miss anything!'
      },
      example: {
        he: 'דוגמא: ⭐⭐⭐⭐\nנספור: 1, 2, 3, 4\nיש 4 כוכבים!',
        en: 'Example: ⭐⭐⭐⭐\nCount: 1, 2, 3, 4\nThere are 4 stars!'
      }
    },
    'השלמה ל-10': {
      explanation: {
        he: 'השלמה ל-10 זה למצוא כמה חסר כדי להגיע ל-10!\n10 זה מספר מיוחד - קל לעבוד איתו!',
        en: 'Completing to 10 means finding how much is missing to reach 10!\n10 is a special number - easy to work with!'
      },
      example: {
        he: 'דוגמא: יש לי 7 🍎\nכמה חסר ל-10?\n10 - 7 = 3\nצריך עוד 3!',
        en: 'Example: I have 7 🍎\nHow much is missing to 10?\n10 - 7 = 3\nNeed 3 more!'
      }
    },
    'חיבור מילולי': {
      explanation: {
        he: 'חיבור מילולי זה סיפור עם מספרים!\nקרא את הסיפור וזהה את המספרים שצריך לחבר.',
        en: 'Word addition is a story with numbers!\nRead the story and identify the numbers to add.'
      },
      example: {
        he: 'דוגמא: "יש לי 3 תפוחים, קיבלתי עוד 2"\nהמספרים: 3 ו-2\n3 + 2 = 5 תפוחים!',
        en: 'Example: "I have 3 apples, I got 2 more"\nThe numbers: 3 and 2\n3 + 2 = 5 apples!'
      }
    },
    'חיסור מילולי': {
      explanation: {
        he: 'חיסור מילולי זה סיפור על הוצאת דברים!\nקרא את הסיפור וזהה כמה היה וכמה הוציאו.',
        en: 'Word subtraction is a story about taking things away!\nRead the story and identify how much there was and how much was taken.'
      },
      example: {
        he: 'דוגמא: "היו לי 8 ממתקים, אכלתי 3"\nהיה: 8, הוצאתי: 3\n8 - 3 = 5 נשארו!',
        en: 'Example: "I had 8 candies, I ate 3"\nHad: 8, Took: 3\n8 - 3 = 5 left!'
      }
    },
    'צורות': {
      explanation: {
        he: 'צורות שונות יש להן תכונות שונות!\nריבוע, משולש, עיגול - כל אחד מיוחד!',
        en: 'Different shapes have different properties!\nSquare, triangle, circle - each is special!'
      },
      example: {
        he: 'דוגמא: ריבוע ⬜ = 4 צלעות שוות\nמשולש 🔺 = 3 צלעות\nעיגול ⭕ = אין פינות!',
        en: 'Example: Square ⬜ = 4 equal sides\nTriangle 🔺 = 3 sides\nCircle ⭕ = no corners!'
      }
    },
    'סימטריה': {
      explanation: {
        he: 'סימטריה זה כשצורה נראית אותו דבר משני הצדדים! 🦋\nאם נקפל את הצורה על קו באמצע, שני הצדדים יתאימו בדיוק.',
        en: 'Symmetry is when a shape looks the same on both sides! 🦋\nIf we fold the shape on a middle line, both sides match exactly.'
      },
      example: {
        he: 'דוגמא: פרפר 🦋 הוא סימטרי\nיש לו אותו דבר בכל צד!',
        en: 'Example: A butterfly 🦋 is symmetrical\nIt has the same thing on each side!'
      }
    }
  };

  // Try subtopic first, then topic, then default
  let lesson = subtopic && subtopicLessons[subtopic]
    ? subtopicLessons[subtopic]
    : lessons[topic] || lessons.numbers;

  return {
    explanation: isHebrew ? lesson.explanation.he : lesson.explanation.en,
    example: isHebrew ? lesson.example.he : lesson.example.en
  };
}
