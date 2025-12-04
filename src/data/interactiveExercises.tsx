// src/data/interactiveExercises.tsx
import type { Question } from '../types/questions';

/**
 * Interactive exercises for children with learning disabilities
 * Features:
 * - Intro explanations and examples before each exercise
 * - Visual aids (emojis, shapes, icons) to help understanding
 * - Auto-solve with explanation after 3 failed attempts
 * - Large, clear, accessible design
 */

export const interactiveExercises: Question[] = [
  // Exercise 1: Counting apples
  {
    id: 'count-apples-1',
    topic: 'numbers',
    subtopic: 'counting',
    difficulty: 'easy',
    promptHe: 'כמה תפוחים יש?',
    promptEn: 'How many apples are there?',
    answer: 3,

    // Intro explanation and example
    introExplanationHe: 'ספירה זה קל!\nאנחנו פשוט סופרים כל דבר בנפרד:\n1... 2... 3...',
    introExplanationEn: 'Counting is easy!\nWe just count each item separately:\n1... 2... 3...',
    introExampleHe: 'דוגמא: אם יש לנו 🍌🍌\nאנחנו סופרים: 1, 2\nיש לנו 2 בננות!',
    introExampleEn: 'Example: If we have 🍌🍌\nWe count: 1, 2\nWe have 2 bananas!',

    // Visual aids - show 3 apples
    visualAids: [
      {
        type: 'emoji',
        value: '🍎',
        count: 3,
        size: 'large'
      }
    ],

    // Auto-solve explanation
    autoSolveExplanationHe: 'בוא נספור ביחד!\n\n🍎 ← זה תפוח אחד (1)\n🍎 ← עוד תפוח אחד (2)\n🍎 ← ועוד תפוח אחד (3)\n\nסך הכל יש לנו 3 תפוחים!',
    autoSolveExplanationEn: "Let's count together!\n\n🍎 ← This is one apple (1)\n🍎 ← Another apple (2)\n🍎 ← And one more apple (3)\n\nIn total we have 3 apples!",
    autoSolveVisualAid: {
      type: 'emoji',
      value: '🍎',
      count: 3,
      size: 'large'
    }
  },

  // Exercise 2: Counting stars
  {
    id: 'count-stars-1',
    topic: 'numbers',
    subtopic: 'counting',
    difficulty: 'easy',
    promptHe: 'כמה כוכבים אתה רואה?',
    promptEn: 'How many stars do you see?',
    answer: 5,

    introExplanationHe: 'כשאנחנו סופרים, חשוב לספור לאט\nולוודא שלא פספסנו שום דבר!',
    introExplanationEn: 'When counting, it is important to count slowly\nand make sure we don\'t miss anything!',
    introExampleHe: 'דוגמא: ⭐⭐⭐⭐\nנספור: 1, 2, 3, 4\nיש 4 כוכבים!',
    introExampleEn: 'Example: ⭐⭐⭐⭐\nCount: 1, 2, 3, 4\nThere are 4 stars!',

    visualAids: [
      {
        type: 'icon',
        value: 'star',
        count: 5,
        size: 'large'
      }
    ],

    autoSolveExplanationHe: 'בוא נספור את הכוכבים ביחד!\n\n⭐ = 1\n⭐⭐ = 2\n⭐⭐⭐ = 3\n⭐⭐⭐⭐ = 4\n⭐⭐⭐⭐⭐ = 5\n\nיש לנו 5 כוכבים יפים!',
    autoSolveExplanationEn: "Let's count the stars together!\n\n⭐ = 1\n⭐⭐ = 2\n⭐⭐⭐ = 3\n⭐⭐⭐⭐ = 4\n⭐⭐⭐⭐⭐ = 5\n\nWe have 5 beautiful stars!",
    autoSolveVisualAid: {
      type: 'icon',
      value: 'star',
      count: 5,
      size: 'large'
    }
  },

  // Exercise 3: Simple addition with flowers
  {
    id: 'add-flowers-1',
    topic: 'addition',
    subtopic: 'simple-addition',
    difficulty: 'easy',
    promptHe: 'יש לי 2 פרחים, קיבלתי עוד 1 פרח.\nכמה פרחים יש לי עכשיו?',
    promptEn: 'I have 2 flowers, I got 1 more flower.\nHow many flowers do I have now?',
    answer: 3,

    introExplanationHe: 'חיבור זה כשאנחנו מוסיפים דברים!\nאם יש לנו משהו, ומוסיפים עוד - זה חיבור!',
    introExplanationEn: 'Addition is when we add things together!\nIf we have something and add more - that is addition!',
    introExampleHe: 'דוגמא: יש לי 1 כדור ⚽\nקיבלתי עוד כדור אחד ⚽\nעכשיו יש לי 2 כדורים! ⚽⚽',
    introExampleEn: 'Example: I have 1 ball ⚽\nI got one more ball ⚽\nNow I have 2 balls! ⚽⚽',

    visualAids: [
      {
        type: 'icon',
        value: 'flower',
        count: 2,
        size: 'large'
      },
      {
        type: 'emoji',
        value: '➕',
        count: 1,
        size: 'medium'
      },
      {
        type: 'icon',
        value: 'flower',
        count: 1,
        size: 'large'
      }
    ],

    autoSolveExplanationHe: 'בוא נבין ביחד!\n\nהיה לי בהתחלה: 🌸🌸 (2 פרחים)\nקיבלתי עוד: 🌸 (1 פרח)\n\nעכשיו יש לי: 🌸🌸🌸 (3 פרחים)\n\n2 + 1 = 3',
    autoSolveExplanationEn: "Let's understand together!\n\nI had at start: 🌸🌸 (2 flowers)\nI got more: 🌸 (1 flower)\n\nNow I have: 🌸🌸🌸 (3 flowers)\n\n2 + 1 = 3",
    autoSolveVisualAid: {
      type: 'icon',
      value: 'flower',
      count: 3,
      size: 'large'
    }
  },

  // Exercise 4: Shapes - counting circles
  {
    id: 'count-circles-1',
    topic: 'geometry',
    subtopic: 'shapes',
    difficulty: 'easy',
    promptHe: 'כמה עיגולים כחולים יש?',
    promptEn: 'How many blue circles are there?',
    answer: 4,

    introExplanationHe: 'עיגול זה צורה עגולה ⭕\nהוא לא קצה ולא פינות - הוא חלק ועגול!\n\nבציור תראו עיגולים כחולים - כל עיגול הוא צורה עגולה וחלקה.',
    introExplanationEn: 'A circle is a round shape ⭕\nIt has no edges or corners - it is smooth and round!\n\nIn the drawing you will see blue circles - each circle is a round and smooth shape.',
    introExampleHe: 'דוגמא: הכדור שלנו הוא עיגול ⚽\nהשמש היא עיגול ☀️\n\nעיגול נראה כמו גלגל או כדור - עגול מכל הכיוונים!',
    introExampleEn: 'Example: Our ball is a circle ⚽\nThe sun is a circle ☀️\n\nA circle looks like a wheel or a ball - round from all directions!',

    visualAids: [
      {
        type: 'shape',
        value: 'circle',
        count: 4,
        size: 'large',
        color: '#3b82f6'
      }
    ],

    autoSolveExplanationHe: 'בוא נספור את העיגולים הכחולים!\n\n🔵 = 1 עיגול\n🔵🔵 = 2 עיגולים\n🔵🔵🔵 = 3 עיגולים\n🔵🔵🔵🔵 = 4 עיגולים\n\nיש 4 עיגולים כחולים יפים!\n\nכל עיגול הוא צורה עגולה וחלקה - אין לו פינות או קווים ישרים, הוא עגול לחלוטין מכל הכיוונים.',
    autoSolveExplanationEn: "Let's count the blue circles!\n\n🔵 = 1 circle\n🔵🔵 = 2 circles\n🔵🔵🔵 = 3 circles\n🔵🔵🔵🔵 = 4 circles\n\nThere are 4 beautiful blue circles!\n\nEach circle is a round and smooth shape - it has no corners or straight lines, it is completely round from all directions.",
    autoSolveVisualAid: {
      type: 'shape',
      value: 'circle',
      count: 4,
      size: 'large',
      color: '#3b82f6'
    }
  },

  // Exercise 5: Simple subtraction with hearts
  {
    id: 'subtract-hearts-1',
    topic: 'subtraction',
    subtopic: 'simple-subtraction',
    difficulty: 'easy',
    promptHe: 'היו לי 4 לבבות, נתתי 1 לב לחבר שלי.\nכמה לבבות נשארו לי?',
    promptEn: 'I had 4 hearts, I gave 1 heart to my friend.\nHow many hearts do I have left?',
    answer: 3,

    introExplanationHe: 'חיסור זה כשאנחנו מוציאים דברים!\nאם היה לנו משהו, והוצאנו ממנו - זה חיסור!',
    introExplanationEn: 'Subtraction is when we take things away!\nIf we had something and took some away - that is subtraction!',
    introExampleHe: 'דוגמא: היו לי 3 עוגיות 🍪🍪🍪\nאכלתי 1 עוגיה 🍪\nנשארו לי 2 עוגיות! 🍪🍪',
    introExampleEn: 'Example: I had 3 cookies 🍪🍪🍪\nI ate 1 cookie 🍪\nI have 2 cookies left! 🍪🍪',

    visualAids: [
      {
        type: 'icon',
        value: 'heart',
        count: 4,
        size: 'large'
      },
      {
        type: 'emoji',
        value: '➖',
        count: 1,
        size: 'medium'
      },
      {
        type: 'icon',
        value: 'heart',
        count: 1,
        size: 'large'
      }
    ],

    autoSolveExplanationHe: 'בוא נבין ביחד!\n\nהיו לי בהתחלה: ❤️❤️❤️❤️ (4 לבבות)\nנתתי: ❤️ (1 לב לחבר שלי)\n\nנשארו לי: ❤️❤️❤️ (3 לבבות)\n\n4 - 1 = 3',
    autoSolveExplanationEn: "Let's understand together!\n\nI had at start: ❤️❤️❤️❤️ (4 hearts)\nI gave: ❤️ (1 heart to my friend)\n\nI have left: ❤️❤️❤️ (3 hearts)\n\n4 - 1 = 3",
    autoSolveVisualAid: {
      type: 'icon',
      value: 'heart',
      count: 3,
      size: 'large'
    }
  },

  // Exercise 6: Counting with mixed emojis
  {
    id: 'count-suns-1',
    topic: 'numbers',
    subtopic: 'counting',
    difficulty: 'easy',
    promptHe: 'כמה שמשות יש בשמיים?',
    promptEn: 'How many suns are in the sky?',
    answer: 2,

    introExplanationHe: 'לפעמים נראה דברים שונים\nאבל אנחנו צריכים לספור רק דבר אחד!\nבתרגיל הזה - רק שמשות!',
    introExplanationEn: 'Sometimes we see different things\nbut we need to count only one thing!\nIn this exercise - only suns!',
    introExampleHe: 'דוגמא: יש 🍎🍎🍌\nכמה תפוחים? רק 2! (לא סופרים את הבננה)',
    introExampleEn: 'Example: There are 🍎🍎🍌\nHow many apples? Only 2! (we don\'t count the banana)',

    visualAids: [
      {
        type: 'icon',
        value: 'sun',
        count: 2,
        size: 'large'
      }
    ],

    autoSolveExplanationHe: 'בוא נספור רק את השמשות!\n\n☀️ = 1 שמש\n☀️☀️ = 2 שמשות\n\nיש 2 שמשות בשמיים!',
    autoSolveExplanationEn: "Let's count only the suns!\n\n☀️ = 1 sun\n☀️☀️ = 2 suns\n\nThere are 2 suns in the sky!",
    autoSolveVisualAid: {
      type: 'icon',
      value: 'sun',
      count: 2,
      size: 'large'
    }
  },
];

/**
 * Helper function to get interactive exercises by topic
 */
export function getInteractiveExercisesByTopic(topic: string): Question[] {
  return interactiveExercises.filter(q => q.topic === topic);
}

/**
 * Helper function to get interactive exercises by difficulty
 */
export function getInteractiveExercisesByDifficulty(difficulty: string): Question[] {
  return interactiveExercises.filter(q => q.difficulty === difficulty);
}
