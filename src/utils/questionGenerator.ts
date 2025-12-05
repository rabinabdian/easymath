// src/utils/questionGenerator.ts
import type { Difficulty, TopicId, Question } from '../types/questions';
import { wrapLTR } from './questionText';

/**
 * מחזיר הסבר ודוגמא כלליים לפי נושא ורמת קושי
 */
function getIntroContent(topic: TopicId, difficulty: Difficulty): {
  introExplanationHe: string;
  introExplanationEn: string;
  introExampleHe: string;
  introExampleEn: string;
} {
  const content = {
    addition: {
      easy: {
        introExplanationHe: 'חיבור זה כשאנחנו מחברים דברים ביחד! ➕\nאם יש לנו משהו ומוסיפים עוד - זה חיבור!',
        introExplanationEn: 'Addition is when we put things together! ➕\nIf we have something and add more - that is addition!',
        introExampleHe: 'דוגמא: יש לי 2 כדורים ⚽⚽\nקיבלתי עוד 1 כדור ⚽\nעכשיו יש לי 3 כדורים! ⚽⚽⚽\n2 + 1 = 3',
        introExampleEn: 'Example: I have 2 balls ⚽⚽\nI got 1 more ball ⚽\nNow I have 3 balls! ⚽⚽⚽\n2 + 1 = 3',
      },
      medium: {
        introExplanationHe: 'חיבור עד 20 דורש תכנון!\nלפעמים כדאי לחבר ראשון ל-10 ואז להוסיף את השאר.',
        introExplanationEn: 'Addition up to 20 requires planning!\nSometimes it helps to add to 10 first, then add the rest.',
        introExampleHe: 'דוגמא: 7 + 5 = ?\nחושבים: 7 + 3 = 10\nאז 10 + 2 = 12\n7 + 5 = 12 ✅',
        introExampleEn: 'Example: 7 + 5 = ?\nThink: 7 + 3 = 10\nThen 10 + 2 = 12\n7 + 5 = 12 ✅',
      },
      hard: {
        introExplanationHe: 'חיבור מספרים גדולים קל יותר אם נחשוב על עשרות ויחידות!\nהעשרות מצד אחד והיחידות מצד שני.',
        introExplanationEn: 'Adding larger numbers is easier if we think about tens and ones!\nTens on one side and ones on the other.',
        introExampleHe: 'דוגמא: 23 + 15 = ?\nעשרות: 20 + 10 = 30\nיחידות: 3 + 5 = 8\nביחד: 30 + 8 = 38',
        introExampleEn: 'Example: 23 + 15 = ?\nTens: 20 + 10 = 30\nOnes: 3 + 5 = 8\nTogether: 30 + 8 = 38',
      },
    },
    subtraction: {
      easy: {
        introExplanationHe: 'חיסור זה כשאנחנו מוציאים דברים! ➖\nאם היה לנו משהו והוצאנו ממנו - זה חיסור!',
        introExplanationEn: 'Subtraction is when we take things away! ➖\nIf we had something and took some away - that is subtraction!',
        introExampleHe: 'דוגמא: היו לי 5 עוגיות 🍪🍪🍪🍪🍪\nאכלתי 2 עוגיות 🍪🍪\nנשארו לי 3 עוגיות! 🍪🍪🍪\n5 - 2 = 3',
        introExampleEn: 'Example: I had 5 cookies 🍪🍪🍪🍪🍪\nI ate 2 cookies 🍪🍪\nI have 3 cookies left! 🍪🍪🍪\n5 - 2 = 3',
      },
      medium: {
        introExplanationHe: 'חיסור דורש תכנון!\nחשוב לזכור: תמיד מחסירים מהמספר הגדול.',
        introExplanationEn: 'Subtraction requires planning!\nRemember: always subtract from the larger number.',
        introExampleHe: 'דוגמא: 15 - 7 = ?\nחושבים: 15 - 5 = 10\nאז 10 - 2 = 8\n15 - 7 = 8 ✅',
        introExampleEn: 'Example: 15 - 7 = ?\nThink: 15 - 5 = 10\nThen 10 - 2 = 8\n15 - 7 = 8 ✅',
      },
      hard: {
        introExplanationHe: 'חיסור מספרים גדולים קל יותר אם נחשוב על עשרות ויחידות!\nמחסירים בנפרד ומחברים.',
        introExplanationEn: 'Subtracting larger numbers is easier if we think about tens and ones!\nSubtract separately and combine.',
        introExampleHe: 'דוגמא: 48 - 23 = ?\nעשרות: 40 - 20 = 20\nיחידות: 8 - 3 = 5\nביחד: 20 + 5 = 25',
        introExampleEn: 'Example: 48 - 23 = ?\nTens: 40 - 20 = 20\nOnes: 8 - 3 = 5\nTogether: 20 + 5 = 25',
      },
    },
    multiplication: {
      easy: {
        introExplanationHe: 'כפל זה קיצור דרך לחיבור חוזר! ✖️\nבמקום לחבר אותו מספר הרבה פעמים, אנחנו מכפילים.',
        introExplanationEn: 'Multiplication is a shortcut for repeated addition! ✖️\nInstead of adding the same number many times, we multiply.',
        introExampleHe: 'דוגמא: 3 × 2 = ?\nזה כמו 2 + 2 + 2 = 6\nאו 3 קבוצות של 2: 👫👫👫 = 6',
        introExampleEn: 'Example: 3 × 2 = ?\nThis is like 2 + 2 + 2 = 6\nOr 3 groups of 2: 👫👫👫 = 6',
      },
      medium: {
        introExplanationHe: 'לוח הכפל הוא כלי חשוב!\nכדאי לזכור שכפל הוא קומוטטיבי: 3×4 = 4×3',
        introExplanationEn: 'The multiplication table is an important tool!\nRemember that multiplication is commutative: 3×4 = 4×3',
        introExampleHe: 'דוגמא: 6 × 7 = ?\nאפשר לחשוב: 6 × 5 = 30\nועוד 6 × 2 = 12\nביחד: 30 + 12 = 42',
        introExampleEn: 'Example: 6 × 7 = ?\nCan think: 6 × 5 = 30\nPlus 6 × 2 = 12\nTogether: 30 + 12 = 42',
      },
      hard: {
        introExplanationHe: 'לוח הכפל עד 12 דורש תרגול!\nטיפ: השתמש בכפולות שאתה כבר יודע.',
        introExplanationEn: 'The multiplication table up to 12 requires practice!\nTip: Use multiples you already know.',
        introExampleHe: 'דוגמא: 9 × 12 = ?\n9 × 10 = 90\n9 × 2 = 18\nביחד: 90 + 18 = 108',
        introExampleEn: 'Example: 9 × 12 = ?\n9 × 10 = 90\n9 × 2 = 18\nTogether: 90 + 18 = 108',
      },
    },
  };

  return content[topic as keyof typeof content]?.[difficulty] || {
    introExplanationHe: 'בואו נפתור את התרגיל יחד!',
    introExplanationEn: 'Let\'s solve this exercise together!',
    introExampleHe: 'נתחיל לאט לאט ונבין את השאלה.',
    introExampleEn: 'We\'ll start slowly and understand the question.',
  };
}

type AddTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxSum: number;      // למשל 10 או 20
  minA?: number;
  maxA?: number;
  minB?: number;
  maxB?: number;
};

/**
 * מייצר מערך של תרגילי חיבור לפי טמפלט נתון
 * @example
 * generateAdditionQuestions({
 *   idPrefix: 'auto_add_easy_',
 *   topic: 'addition',
 *   subtopic: 'חיבור עד 10',
 *   difficulty: 'easy',
 *   maxSum: 10
 * })
 */
export function generateAdditionQuestions(t: AddTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxSum,
    minA = 0,
    maxA = maxSum,
    minB = 0,
    maxB = maxSum,
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let a = minA; a <= maxA; a++) {
    for (let b = minB; b <= maxB; b++) {
      const sum = a + b;
      if (sum > maxSum) continue;
      if (b === 0 && a === 0) continue; // תרגיל לא מעניין

      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;
      const mathExpr = `${a} + ${b} = ?`;
      const intro = getIntroContent(topic, difficulty);

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        promptHe: `פתור: ${wrapLTR(mathExpr)}`,
        promptEn: `Solve: ${mathExpr}`,
        answer: sum,
        ...intro,
      });

      counter++;
    }
  }

  return questions;
}

type SubTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxStart: number; // המספר שממנו מחסרים
  minStart?: number;
};

/**
 * מייצר מערך של תרגילי חיסור לפי טמפלט נתון
 * @example
 * generateSubtractionQuestions({
 *   idPrefix: 'auto_sub_easy_',
 *   topic: 'subtraction',
 *   subtopic: 'חיסור עד 10',
 *   difficulty: 'easy',
 *   maxStart: 10
 * })
 */
export function generateSubtractionQuestions(t: SubTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxStart,
    minStart = 1
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let start = minStart; start <= maxStart; start++) {
    for (let take = 0; take <= start; take++) {
      if (take === 0 && start === 0) continue; // תרגיל לא מעניין

      const result = start - take;
      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;
      const mathExpr = `${start} - ${take} = ?`;
      const intro = getIntroContent(topic, difficulty);

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        promptHe: `פתור: ${wrapLTR(mathExpr)}`,
        promptEn: `Solve: ${mathExpr}`,
        answer: result,
        ...intro,
      });

      counter++;
    }
  }

  return questions;
}

type MultiplicationTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxFactor: number; // הגורם המקסימלי
  minFactor?: number;
};

/**
 * מייצר מערך של תרגילי כפל לפי טמפלט נתון
 * @example
 * generateMultiplicationQuestions({
 *   idPrefix: 'auto_mul_easy_',
 *   topic: 'multiplication',
 *   subtopic: 'לוח הכפל עד 5',
 *   difficulty: 'easy',
 *   maxFactor: 5
 * })
 */
export function generateMultiplicationQuestions(t: MultiplicationTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxFactor,
    minFactor = 1
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let a = minFactor; a <= maxFactor; a++) {
    for (let b = minFactor; b <= maxFactor; b++) {
      const product = a * b;
      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;
      const mathExpr = `${a} × ${b} = ?`;
      const intro = getIntroContent(topic, difficulty);

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        promptHe: `פתור: ${wrapLTR(mathExpr)}`,
        promptEn: `Solve: ${mathExpr}`,
        answer: product,
        ...intro,
      });

      counter++;
    }
  }

  return questions;
}

// -------- מחולל שאלות מילוליות --------

type WordContext = 'fruits' | 'kids' | 'candies';

interface WordTemplateConfig {
  idPrefix: string;
  topic: TopicId;           // בדרך כלל 'addition' או 'subtraction'
  difficulty: Difficulty;
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
  operation: 'add' | 'sub';
  count: number;            // כמה שאלות לייצר
  context: WordContext;
}

const NAMES_HE = ['נועה', 'יואב', 'דני', 'מיה', 'תמר', 'איתי'];
const NAMES_EN = ['Noah', 'Yoav', 'Danny', 'Mia', 'Tamar', 'Itai'];

const CONTEXT_ITEMS: Record<
  WordContext,
  { singularHe: string; pluralHe: string; singularEn: string; pluralEn: string }
> = {
  fruits: { singularHe: 'פרי', pluralHe: 'פירות', singularEn: 'fruit', pluralEn: 'fruits' },
  kids: { singularHe: 'ילד', pluralHe: 'ילדים', singularEn: 'kid', pluralEn: 'kids' },
  candies: { singularHe: 'מסטיק', pluralHe: 'מסטיקים', singularEn: 'candy', pluralEn: 'candies' },
};

/**
 * מייצר שאלות מילוליות באופן אוטומטי
 * @example
 * generateWordProblems({
 *   idPrefix: 'auto_add_word_',
 *   topic: 'addition',
 *   difficulty: 'medium',
 *   minA: 2,
 *   maxA: 8,
 *   minB: 1,
 *   maxB: 5,
 *   operation: 'add',
 *   count: 15,
 *   context: 'fruits'
 * })
 */
export function generateWordProblems(cfg: WordTemplateConfig): Question[] {
  const {
    idPrefix,
    topic,
    difficulty,
    minA,
    maxA,
    minB,
    maxB,
    operation,
    count,
    context,
  } = cfg;

  const questions: Question[] = [];
  const ctx = CONTEXT_ITEMS[context];
  let counter = 1;

  while (questions.length < count) {
    const a =
      minA + Math.floor(Math.random() * (maxA - minA + 1));
    const b =
      minB + Math.floor(Math.random() * (maxB - minB + 1));

    if (operation === 'sub' && b > a) continue; // שלא יצא שלילי

    const nameIndex = Math.floor(Math.random() * NAMES_HE.length);
    const nameHe = NAMES_HE[nameIndex];
    const nameEn = NAMES_EN[nameIndex];

    let promptHe: string;
    let promptEn: string;
    let answer: number;

    if (operation === 'add') {
      answer = a + b;
      promptHe = `${nameHe} קיבל/ה ${a} ${ctx.pluralHe}. אחר כך קיבל/ה עוד ${b} ${ctx.pluralHe}. כמה ${ctx.pluralHe} יש ל${nameHe} בסך הכל?`;
      promptEn = `${nameEn} got ${a} ${ctx.pluralEn}. Then got ${b} more ${ctx.pluralEn}. How many ${ctx.pluralEn} does ${nameEn} have in total?`;
    } else {
      answer = a - b;
      promptHe = `${nameHe} קיבל/ה ${a} ${ctx.pluralHe}. ${b} ${ctx.pluralHe} ניתנו לחבר. כמה ${ctx.pluralHe} נשארו ל${nameHe}?`;
      promptEn = `${nameEn} had ${a} ${ctx.pluralEn}. ${b} ${ctx.pluralEn} were given to a friend. How many ${ctx.pluralEn} are left for ${nameEn}?`;
    }

    const id = `${idPrefix}${String(counter).padStart(3, '0')}`;
    const intro = getIntroContent(topic, difficulty);

    questions.push({
      id,
      topic,
      difficulty,
      subtopic: operation === 'add' ? 'חיבור מילולי' : 'חיסור מילולי',
      promptHe,
      promptEn,
      answer,
      ...intro,
    });

    counter++;
  }

  return questions;
}
