// src/data/topicLessons.ts
import type { TopicId } from '../types/questions';

/**
 * Short lessons for each topic and subtopic
 * These are shown before exercises to help students understand the concept
 * Each lesson includes:
 * - explanationHe/En: A simple explanation of the concept
 * - exampleHe/En: A concrete example to illustrate the concept
 * - emoji: An emoji to make it visually appealing
 */

export interface TopicLesson {
  explanationHe: string;
  explanationEn: string;
  exampleHe: string;
  exampleEn: string;
  emoji: string;
}

// Lessons organized by topic and optional subtopic
// Key format: "topic" or "topic:subtopic"
export const TOPIC_LESSONS: Record<string, TopicLesson> = {
  // ========================================
  // NUMBERS - הכרת המספרים
  // ========================================
  'numbers': {
    explanationHe: 'מספרים עוזרים לנו לספור דברים!\nכל מספר אומר לנו "כמה" יש מדבר מסוים.',
    explanationEn: 'Numbers help us count things!\nEach number tells us "how many" there are of something.',
    exampleHe: 'דוגמא: אם יש 3 תפוחים 🍎🍎🍎\nהמספר 3 אומר לנו כמה תפוחים יש!',
    exampleEn: 'Example: If there are 3 apples 🍎🍎🍎\nThe number 3 tells us how many apples there are!',
    emoji: '🔢',
  },

  'numbers:ספירה': {
    explanationHe: 'ספירה זה קל! 🎯\nאנחנו פשוט מצביעים על כל דבר וסופרים:\n1... 2... 3...',
    explanationEn: 'Counting is easy! 🎯\nWe simply point at each thing and count:\n1... 2... 3...',
    exampleHe: 'דוגמא: נספור כוכבים ⭐⭐⭐\nמצביע על כל אחד: 1, 2, 3\nיש 3 כוכבים!',
    exampleEn: 'Example: Let\'s count stars ⭐⭐⭐\nPoint at each one: 1, 2, 3\nThere are 3 stars!',
    emoji: '👆',
  },

  'numbers:התאם מספר לכמות': {
    explanationHe: 'כל מספר מתאים לכמות מסוימת! 🎯\nכשרואים קבוצה של דברים, סופרים כמה יש.',
    explanationEn: 'Each number matches a specific quantity! 🎯\nWhen we see a group of things, we count how many there are.',
    exampleHe: 'דוגמא: 🐱🐱🐱🐱 = 4 חתולים\n🌺🌺 = 2 פרחים',
    exampleEn: 'Example: 🐱🐱🐱🐱 = 4 cats\n🌺🌺 = 2 flowers',
    emoji: '🔗',
  },

  'numbers:כתיבה': {
    explanationHe: 'מספרים אפשר לכתוב בספרות או במילים! ✏️\nלמשל: 5 = חמש',
    explanationEn: 'Numbers can be written as digits or words! ✏️\nFor example: 5 = five',
    exampleHe: 'דוגמא:\n7 = שבע\n3 = שלוש\n9 = תשע',
    exampleEn: 'Example:\n7 = seven\n3 = three\n9 = nine',
    emoji: '✏️',
  },

  'numbers:שכנים': {
    explanationHe: 'לכל מספר יש שכנים! 🏠\nהשכן לפני הוא מספר אחד פחות.\nהשכן אחרי הוא מספר אחד יותר.',
    explanationEn: 'Every number has neighbors! 🏠\nThe neighbor before is one less.\nThe neighbor after is one more.',
    exampleHe: 'דוגמא: השכנים של 5 הם:\n4 ← 5 → 6\n4 לפני, 6 אחרי!',
    exampleEn: 'Example: The neighbors of 5 are:\n4 ← 5 → 6\n4 before, 6 after!',
    emoji: '🏘️',
  },

  'numbers:לוח 10': {
    explanationHe: 'לוח 10 עוזר לנו להבין את המספר 10! 🔟\nיש בו 10 משבצות - אפשר לראות כמה מלאות וכמה ריקות.',
    explanationEn: 'The 10-frame helps us understand the number 10! 🔟\nIt has 10 squares - we can see how many are full and how many are empty.',
    exampleHe: 'דוגמא: אם 7 משבצות מלאות ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜\nאז 3 ריקות! (10 - 7 = 3)',
    exampleEn: 'Example: If 7 squares are full ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜\nThen 3 are empty! (10 - 7 = 3)',
    emoji: '🔟',
  },

  'numbers:דילוגים': {
    explanationHe: 'דילוגים זה לספור בקפיצות! 🦘\nבמקום 1,2,3,4... אנחנו קופצים: 2,4,6,8...',
    explanationEn: 'Skip counting is counting in jumps! 🦘\nInstead of 1,2,3,4... we jump: 2,4,6,8...',
    exampleHe: 'דוגמא: דילוגים של 2:\n2, 4, 6, 8, 10...\nכל פעם מוסיפים 2!',
    exampleEn: 'Example: Skip counting by 2:\n2, 4, 6, 8, 10...\nEach time we add 2!',
    emoji: '🦘',
  },

  'numbers:סדרות': {
    explanationHe: 'סדרה זו שורת מספרים עם כלל קבוע! 📋\nצריך למצוא מה הכלל ולהמשיך.',
    explanationEn: 'A sequence is a row of numbers with a fixed rule! 📋\nWe need to find the rule and continue.',
    exampleHe: 'דוגמא: 1, 2, 3, ?, ?\nהכלל: כל פעם +1\nתשובה: 4, 5',
    exampleEn: 'Example: 1, 2, 3, ?, ?\nThe rule: each time +1\nAnswer: 4, 5',
    emoji: '📋',
  },

  'numbers:השוואה': {
    explanationHe: 'השוואה זה לבדוק מה גדול ומה קטן! ⚖️\nסימן > אומר "גדול מ"\nסימן < אומר "קטן מ"',
    explanationEn: 'Comparison is checking what is bigger and smaller! ⚖️\nThe > sign means "greater than"\nThe < sign means "less than"',
    exampleHe: 'דוגמא:\n8 > 5 (8 גדול מ-5) ✅\n3 < 7 (3 קטן מ-7) ✅',
    exampleEn: 'Example:\n8 > 5 (8 is greater than 5) ✅\n3 < 7 (3 is less than 7) ✅',
    emoji: '⚖️',
  },

  'numbers:מספרים עד 20': {
    explanationHe: 'מספרים עד 20 כוללים יחידות ועשרות! 🔢\nאחרי 10 ממשיכים: 11, 12, 13...',
    explanationEn: 'Numbers up to 20 include units and tens! 🔢\nAfter 10 we continue: 11, 12, 13...',
    exampleHe: 'דוגמא:\n11 = עשרה ואחת (10 + 1)\n15 = עשרה וחמש (10 + 5)',
    exampleEn: 'Example:\n11 = ten and one (10 + 1)\n15 = ten and five (10 + 5)',
    emoji: '🔢',
  },

  // ========================================
  // ADDITION - חיבור
  // ========================================
  'addition': {
    explanationHe: 'חיבור זה כשמוסיפים דברים ביחד! ➕\nכשיש לנו משהו ומקבלים עוד - סופרים הכל יחד.',
    explanationEn: 'Addition is when we put things together! ➕\nWhen we have something and get more - we count everything together.',
    exampleHe: 'דוגמא: 2 + 3 = ?\n🍎🍎 ועוד 🍎🍎🍎\nביחד: 🍎🍎🍎🍎🍎 = 5',
    exampleEn: 'Example: 2 + 3 = ?\n🍎🍎 plus 🍎🍎🍎\nTogether: 🍎🍎🍎🍎🍎 = 5',
    emoji: '➕',
  },

  'addition:חיבור עד 10': {
    explanationHe: 'חיבור עד 10 זה קל! ➕\nמחברים שני מספרים קטנים והתוצאה עד 10.',
    explanationEn: 'Addition up to 10 is easy! ➕\nWe add two small numbers and the result is up to 10.',
    exampleHe: 'דוגמא: 4 + 3 = ?\n🔵🔵🔵🔵 + 🔵🔵🔵 = 🔵🔵🔵🔵🔵🔵🔵\nסופרים: 7!',
    exampleEn: 'Example: 4 + 3 = ?\n🔵🔵🔵🔵 + 🔵🔵🔵 = 🔵🔵🔵🔵🔵🔵🔵\nCount: 7!',
    emoji: '🔵',
  },

  'addition:חיבור עד 20': {
    explanationHe: 'חיבור עד 20 דורש לחשוב על עשרות! 🧮\nלפעמים עוברים את ה-10.',
    explanationEn: 'Addition up to 20 requires thinking about tens! 🧮\nSometimes we pass 10.',
    exampleHe: 'דוגמא: 8 + 5 = ?\n8 + 2 = 10, נשאר 3\n10 + 3 = 13!',
    exampleEn: 'Example: 8 + 5 = ?\n8 + 2 = 10, 3 left\n10 + 3 = 13!',
    emoji: '🧮',
  },

  'addition:השלמה ל-10': {
    explanationHe: 'השלמה ל-10 זה למצוא כמה חסר עד 10! 🔟\nחשוב לזכור: כל זוג מספרים שנותן 10.',
    explanationEn: 'Completing to 10 is finding how much is missing to reach 10! 🔟\nRemember: every pair of numbers that makes 10.',
    exampleHe: 'דוגמא: 7 + ? = 10\nחסר 3 עד 10!\n7 + 3 = 10 ✅',
    exampleEn: 'Example: 7 + ? = 10\n3 is missing to reach 10!\n7 + 3 = 10 ✅',
    emoji: '🔟',
  },

  'addition:חיבור מילולי': {
    explanationHe: 'בעיות מילוליות מספרות סיפור! 📖\nצריך למצוא את המספרים ולחבר אותם.',
    explanationEn: 'Word problems tell a story! 📖\nWe need to find the numbers and add them.',
    exampleHe: 'דוגמא: בכיתה יש 5 בנים ו-3 בנות.\nכמה ילדים בכיתה?\n5 + 3 = 8 ילדים!',
    exampleEn: 'Example: In class there are 5 boys and 3 girls.\nHow many children in class?\n5 + 3 = 8 children!',
    emoji: '📖',
  },

  'addition:דומינו מספרים': {
    explanationHe: 'בדומינו סופרים נקודות משני הצדדים! 🎲\nמחברים את שני הצדדים לקבל את הסכום.',
    explanationEn: 'In dominoes we count dots on both sides! 🎲\nWe add both sides to get the sum.',
    exampleHe: 'דוגמא: בצד אחד 4 נקודות ⚫⚫⚫⚫\nבצד שני 2 נקודות ⚫⚫\n4 + 2 = 6!',
    exampleEn: 'Example: On one side 4 dots ⚫⚫⚫⚫\nOn other side 2 dots ⚫⚫\n4 + 2 = 6!',
    emoji: '🎲',
  },

  // ========================================
  // SUBTRACTION - חיסור
  // ========================================
  'subtraction': {
    explanationHe: 'חיסור זה כשמוציאים או מורידים דברים! ➖\nמתחילים ממספר גדול ומורידים.',
    explanationEn: 'Subtraction is when we take away things! ➖\nWe start from a big number and take away.',
    exampleHe: 'דוגמא: 5 - 2 = ?\n🍎🍎🍎🍎🍎 מוריד 🍎🍎\nנשאר: 🍎🍎🍎 = 3',
    exampleEn: 'Example: 5 - 2 = ?\n🍎🍎🍎🍎🍎 take away 🍎🍎\nLeft: 🍎🍎🍎 = 3',
    emoji: '➖',
  },

  'subtraction:חיסור עד 10': {
    explanationHe: 'חיסור עד 10 זה קל! ➖\nמתחילים ממספר קטן ומורידים עוד פחות.',
    explanationEn: 'Subtraction up to 10 is easy! ➖\nWe start from a small number and take away less.',
    exampleHe: 'דוגמא: 7 - 3 = ?\n🔵🔵🔵🔵🔵🔵🔵 מוריד 🔵🔵🔵\nנשאר: 🔵🔵🔵🔵 = 4',
    exampleEn: 'Example: 7 - 3 = ?\n🔵🔵🔵🔵🔵🔵🔵 take away 🔵🔵🔵\nLeft: 🔵🔵🔵🔵 = 4',
    emoji: '🔵',
  },

  'subtraction:חיסור עד 20': {
    explanationHe: 'חיסור עד 20 דורש לחשוב על עשרות! 🧮\nלפעמים צריך "לשבור" את ה-10.',
    explanationEn: 'Subtraction up to 20 requires thinking about tens! 🧮\nSometimes we need to "break" the 10.',
    exampleHe: 'דוגמא: 15 - 7 = ?\n15 - 5 = 10, עוד צריך להוריד 2\n10 - 2 = 8!',
    exampleEn: 'Example: 15 - 7 = ?\n15 - 5 = 10, still need to take 2\n10 - 2 = 8!',
    emoji: '🧮',
  },

  'subtraction:חיסור מילולי': {
    explanationHe: 'בעיות מילוליות מספרות סיפור! 📖\nמילים כמו "נשאר", "הלכו", "אכלו" = חיסור.',
    explanationEn: 'Word problems tell a story! 📖\nWords like "left", "went", "ate" = subtraction.',
    exampleHe: 'דוגמא: היו 8 עוגיות.\nאכלתי 3.\nכמה נשארו? 8 - 3 = 5 עוגיות!',
    exampleEn: 'Example: There were 8 cookies.\nI ate 3.\nHow many left? 8 - 3 = 5 cookies!',
    emoji: '🍪',
  },

  'subtraction:כמה נשאר': {
    explanationHe: '"כמה נשאר" זה שאלת חיסור! 🤔\nמתחילים ממה שהיה, מורידים מה שהלך.',
    explanationEn: '"How much left" is a subtraction question! 🤔\nStart from what we had, subtract what went away.',
    exampleHe: 'דוגמא: היו 10 בלונים. 4 התפוצצו.\nכמה נשארו? 10 - 4 = 6 בלונים!',
    exampleEn: 'Example: There were 10 balloons. 4 popped.\nHow many left? 10 - 4 = 6 balloons!',
    emoji: '🎈',
  },

  'subtraction:לוח 10': {
    explanationHe: 'לוח 10 עוזר גם בחיסור! 🔟\nרואים כמה צבוע, מוחקים, וסופרים כמה נשאר.',
    explanationEn: 'The 10-frame helps with subtraction too! 🔟\nSee how many are colored, erase some, count what\'s left.',
    exampleHe: 'דוגמא: 8 צבועים, מחקנו 3\n⬛⬛⬛⬛⬛⬛⬛⬛ → ⬛⬛⬛⬛⬛⬜⬜⬜\nנשארו 5!',
    exampleEn: 'Example: 8 colored, erased 3\n⬛⬛⬛⬛⬛⬛⬛⬛ → ⬛⬛⬛⬛⬛⬜⬜⬜\n5 left!',
    emoji: '🔟',
  },

  // ========================================
  // MULTIPLICATION - כפל
  // ========================================
  'multiplication': {
    explanationHe: 'כפל זה חיבור מהיר של קבוצות שוות! ✖️\nבמקום לחבר הרבה פעמים, כופלים!',
    explanationEn: 'Multiplication is quick addition of equal groups! ✖️\nInstead of adding many times, we multiply!',
    exampleHe: 'דוגמא: 3 × 4 = ?\nזה כמו: 3 + 3 + 3 + 3 = 12\n🍎🍎🍎 🍎🍎🍎 🍎🍎🍎 🍎🍎🍎',
    exampleEn: 'Example: 3 × 4 = ?\nThis is like: 3 + 3 + 3 + 3 = 12\n🍎🍎🍎 🍎🍎🍎 🍎🍎🍎 🍎🍎🍎',
    emoji: '✖️',
  },

  'multiplication:לוח הכפל עד 5': {
    explanationHe: 'לוח הכפל עד 5 הוא הבסיס! 🌟\nכדאי לשנן: 2×2=4, 3×3=9, 4×4=16, 5×5=25',
    explanationEn: 'The multiplication table up to 5 is the base! 🌟\nGood to memorize: 2×2=4, 3×3=9, 4×4=16, 5×5=25',
    exampleHe: 'דוגמא: 2 × 5 = ?\n5 קבוצות של 2:\n🔵🔵 🔵🔵 🔵🔵 🔵🔵 🔵🔵 = 10!',
    exampleEn: 'Example: 2 × 5 = ?\n5 groups of 2:\n🔵🔵 🔵🔵 🔵🔵 🔵🔵 🔵🔵 = 10!',
    emoji: '🌟',
  },

  'multiplication:לוח הכפל עד 10': {
    explanationHe: 'לוח הכפל עד 10 - בונים על מה שלמדנו! 📊\nטריקים: ×10 זה פשוט להוסיף 0!',
    explanationEn: 'Multiplication table up to 10 - build on what we learned! 📊\nTricks: ×10 is just adding 0!',
    exampleHe: 'דוגמא: 7 × 10 = 70\nפשוט מוסיפים 0 ל-7!',
    exampleEn: 'Example: 7 × 10 = 70\nJust add 0 to 7!',
    emoji: '📊',
  },

  'multiplication:לוח הכפל עד 12': {
    explanationHe: 'לוח הכפל עד 12 - אתגר! 💪\nטיפ: 11×? זה פשוט כפול ספרות: 11×3=33',
    explanationEn: 'Multiplication table up to 12 - challenge! 💪\nTip: 11×? is just double digits: 11×3=33',
    exampleHe: 'דוגמא: 12 × 5 = ?\n10×5=50, 2×5=10\n50+10=60!',
    exampleEn: 'Example: 12 × 5 = ?\n10×5=50, 2×5=10\n50+10=60!',
    emoji: '💪',
  },

  // ========================================
  // EVEN/ODD - זוגי/אי-זוגי
  // ========================================
  'evenOdd': {
    explanationHe: 'מספר זוגי אפשר לחלק ל-2 בלי שארית! ⚖️\nמספר אי-זוגי תמיד נשאר 1.',
    explanationEn: 'An even number can be divided by 2 with no remainder! ⚖️\nAn odd number always has 1 left.',
    exampleHe: 'דוגמא:\n6 = 🧦🧦🧦 (3 זוגות) = זוגי ✅\n7 = 🧦🧦🧦🧦 (3 זוגות + 1) = אי-זוגי ❌',
    exampleEn: 'Example:\n6 = 🧦🧦🧦 (3 pairs) = even ✅\n7 = 🧦🧦🧦🧦 (3 pairs + 1) = odd ❌',
    emoji: '⚖️',
  },

  // ========================================
  // GEOMETRY - צורות וסימטריה
  // ========================================
  'geometry': {
    explanationHe: 'גאומטריה עוסקת בצורות! 📐\nנלמד על צורות שונות, צלעות, פינות וסימטריה.',
    explanationEn: 'Geometry is about shapes! 📐\nWe learn about different shapes, sides, corners and symmetry.',
    exampleHe: 'דוגמא: ריבוע יש לו 4 צלעות שוות ⬜\nמשולש יש לו 3 צלעות 🔺',
    exampleEn: 'Example: A square has 4 equal sides ⬜\nA triangle has 3 sides 🔺',
    emoji: '📐',
  },

  'geometry:צורות': {
    explanationHe: 'צורות יש להן שמות לפי מספר הצלעות! 🔷\nמשולש=3, ריבוע=4, מחומש=5, משושה=6',
    explanationEn: 'Shapes are named by number of sides! 🔷\nTriangle=3, Square=4, Pentagon=5, Hexagon=6',
    exampleHe: 'דוגמא:\n🔺 משולש - 3 צלעות, 3 פינות\n⬜ ריבוע - 4 צלעות שוות, 4 פינות',
    exampleEn: 'Example:\n🔺 Triangle - 3 sides, 3 corners\n⬜ Square - 4 equal sides, 4 corners',
    emoji: '🔷',
  },

  'geometry:סימטריה': {
    explanationHe: 'סימטריה זה כששני צדדים זהים! 🦋\nאם נקפל על קו, שני הצדדים יתאימו.',
    explanationEn: 'Symmetry is when two sides are identical! 🦋\nIf we fold on a line, both sides will match.',
    exampleHe: 'דוגמא: פרפר סימטרי 🦋\nשני הכנפיים זהות!\nלב גם סימטרי ❤️',
    exampleEn: 'Example: A butterfly is symmetrical 🦋\nBoth wings are identical!\nA heart is also symmetrical ❤️',
    emoji: '🦋',
  },

  'geometry:שיקוף': {
    explanationHe: 'שיקוף זה כמו מראה! 🪞\nהצד השני הוא תמונת מראה של הראשון.',
    explanationEn: 'Reflection is like a mirror! 🪞\nThe other side is a mirror image of the first.',
    exampleHe: 'דוגמא: אם יד שמאל ליד המראה 🤚\nבמראה נראה יד ימין! ✋',
    exampleEn: 'Example: If left hand is near the mirror 🤚\nIn the mirror we see a right hand! ✋',
    emoji: '🪞',
  },

  'geometry:השלמת חצי צורה': {
    explanationHe: 'להשלים חצי צורה - מציירים את הצד השני! ✏️\nחושבים על מראה ומציירים את ההיפוך.',
    explanationEn: 'Completing half a shape - draw the other side! ✏️\nThink of a mirror and draw the reflection.',
    exampleHe: 'דוגמא: יש חצי לב 💔\nמשלימים את הצד השני ← ❤️\nעכשיו יש לב שלם!',
    exampleEn: 'Example: There is half a heart 💔\nComplete the other side ← ❤️\nNow there is a whole heart!',
    emoji: '✏️',
  },
};

/**
 * Get a lesson for a specific topic and optional subtopic
 * Falls back to the main topic lesson if no subtopic lesson exists
 */
export function getTopicLesson(topic: TopicId, subtopic?: string): TopicLesson | undefined {
  // Try to get specific subtopic lesson first
  if (subtopic) {
    const subtopicKey = `${topic}:${subtopic}`;
    if (TOPIC_LESSONS[subtopicKey]) {
      return TOPIC_LESSONS[subtopicKey];
    }
  }
  
  // Fall back to main topic lesson
  return TOPIC_LESSONS[topic];
}

/**
 * Check if a lesson exists for a topic/subtopic
 */
export function hasTopicLesson(topic: TopicId, subtopic?: string): boolean {
  return getTopicLesson(topic, subtopic) !== undefined;
}
