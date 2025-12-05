import type { TopicId } from '../types/questions';

export interface TopicLesson {
  topic: TopicId;
  subtopics?: string[];
  explanationHe: string;
  explanationEn: string;
  exampleHe: string;
  exampleEn: string;
  stepsHe?: string[];
  stepsEn?: string[];
  tipHe?: string;
  tipEn?: string;
}

export const TOPIC_LESSONS: TopicLesson[] = [
  {
    topic: 'numbers',
    explanationHe: 'בספירה מתקדמים פריט אחר פריט. חשוב לסמן עם העיניים או האצבע כל פריט כדי שלא נדלג עליו.',
    explanationEn: 'When counting we move item by item. Point with your eyes or finger so you will not skip anything.',
    exampleHe: 'אם יש לנו 🍓🍓🍓🍓 אנחנו אומרים בקול: 1, 2, 3, 4 ולכן יש 4 תותים.',
    exampleEn: 'If we see 🍓🍓🍓🍓 we say out loud: 1, 2, 3, 4 so there are 4 strawberries.',
    stepsHe: [
      'התבונן בקבוצה ומצא נקודת התחלה קלה למשל הפריט השמאלי.',
      'סמן כל פריט באצבע או בעיפרון וספור לאט: אחד... שתיים... שלוש...',
      'המספר האחרון שנאמר הוא התשובה – כתוב או בחר אותו.',
    ],
    stepsEn: [
      'Look at the group and choose an easy starting point, maybe the leftmost item.',
      'Point to every item and count slowly: one... two... three...',
      'The last number you say is the answer – write or select it.',
    ],
    tipHe: 'אם התבלבלת – מחק את הספירה והתחל שוב בקול רם. מותר לעבור על הפריטים יותר מפעם אחת.',
    tipEn: 'If you get confused, reset and start again out loud. It is fine to touch every item more than once.',
  },
  {
    topic: 'addition',
    explanationHe: 'חיבור מאחד שתי קבוצות לכמות אחת גדולה יותר. אנחנו מצרפים את הקבוצה החדשה לזו שכבר קיימת.',
    explanationEn: 'Addition joins two groups into one larger amount. We attach the new group to what we already have.',
    exampleHe: 'יש לי 2 פרחים וקיבלתי עוד 3. נספור: 🌸🌸 ואז מוסיפים 🌸🌸🌸 = ביחד 5.',
    exampleEn: 'I have 2 flowers and receive 3 more. Count: 🌸🌸 then add 🌸🌸🌸 = 5 altogether.',
    stepsHe: [
      'קרא את הסיפור והבן מה יש כבר – זה המספר הראשון.',
      'הוסף את הכמות החדשה באמצעות אצבעות, ציור או דמיון לאותה קבוצה.',
      'ספור את כל הפריטים יחד או השתמש בחישוב בראש כדי לקבל את הסכום.',
    ],
    stepsEn: [
      'Read the story and notice what you already have – that is the first number.',
      'Add the new amount with fingers, drawing, or mental dots to the same group.',
      'Count everything together or calculate mentally to get the sum.',
    ],
    tipHe: 'נסה לספר את החיבור במילים: "היו לי... קיבלתי עוד... עכשיו יש לי..." זה עוזר להבין מה מחברים.',
    tipEn: 'Tell the addition as a story: "I had..., I got more..., now I have..." – it clarifies what you are adding.',
  },
  {
    topic: 'subtraction',
    explanationHe: 'חיסור מספר כמה נשאר אחרי שמוציאים חלק מהקבוצה. מתחילים מהמספר הגדול ומסירים ממנו.',
    explanationEn: 'Subtraction tells us how much is left after taking some away. Start from the larger number and remove items.',
    exampleHe: 'אם היו 5 עוגיות ואכלתי 2, אני שם X על שתי עוגיות ונשאר עם 3.',
    exampleEn: 'If there were 5 cookies and I ate 2, cross out two cookies and see that 3 remain.',
    stepsHe: [
      'זהה את הכמות שממנה מתחילים – זה המספר הראשון.',
      'הסמן או הקף את הכמות שיורדת והסר אותה (באצבע, בשרטוט או בחפצים).',
      'ספר את מה שנשאר או חשב: המספר ההתחלתי פחות הכמות שהורדנו.',
    ],
    stepsEn: [
      'Identify the amount you start with – the first number.',
      'Mark or cover the amount that goes away (with a finger, drawing, or objects).',
      'Count what remains or compute: starting number minus removed number.',
    ],
    tipHe: 'אפשר להשתמש באצבעות: פרוס חמש אצבעות והורד שתיים – תראה כמה נשארו פתוחות.',
    tipEn: 'Use your fingers: show five fingers, fold down two, and see how many stay up.',
  },
  {
    topic: 'multiplication',
    explanationHe: 'כפל הוא חיבור חוזר של אותה כמות. אנחנו סופרים קבוצות שוות כמה פעמים.',
    explanationEn: 'Multiplication is repeated addition of the same amount. We count equal groups several times.',
    exampleHe: 'אם יש 3 שקיות ובכל אחת 4 סוכריות – זה 4+4+4 ולכן התשובה 12.',
    exampleEn: 'If there are 3 bags with 4 candies each, that is 4+4+4 so the answer is 12.',
    stepsHe: [
      'בדוק כמה פריטים יש בקבוצה אחת.',
      'בדוק כמה קבוצות כאלה יש.',
      'בצע חיבור חוזר (או בטבלה) של גודל הקבוצה לפי מספר הקבוצות.',
    ],
    stepsEn: [
      'See how many items are inside one group.',
      'Count how many identical groups you have.',
      'Add the group size repeatedly (or use the table) as many times as groups.',
    ],
    tipHe: 'צייר נקודות בקבוצות או השתמש בטבלה קטנה כדי לעקוב שאינך מדלג על קבוצה.',
    tipEn: 'Draw dots in groups or use a small table so you do not accidentally skip a group.',
  },
  {
    topic: 'evenOdd',
    explanationHe: 'מספר זוגי מתחלק לזוגות בלי שארית, ומספר אי-זוגי משאיר פריט בודד. אנחנו מחברים פריטים בזוגות שווים.',
    explanationEn: 'Even numbers break into pairs with no leftovers, odd numbers leave one item alone. We check by pairing things.',
    exampleHe: 'למספר 6 יש זוגות: (⚽⚽)(⚽⚽)(⚽⚽) ולכן הוא זוגי. ל-7 יישאר ⚽ אחד בודד ולכן הוא אי-זוגי.',
    exampleEn: 'Number 6 makes pairs (⚽⚽)(⚽⚽)(⚽⚽) so it is even. Number 7 leaves ⚽ alone so it is odd.',
    stepsHe: [
      'חלק את הפריטים לזוגות או השתמש באצבעות – שניים בכל קבוצה.',
      'אם כל הפריטים מצטוותים בלי שארית – המספר זוגי.',
      'אם נשאר פריט ללא זוג – המספר אי-זוגי.',
    ],
    stepsEn: [
      'Split the items into pairs or use fingers – two in each group.',
      'If everyone finds a partner, the number is even.',
      'If one item is left alone, the number is odd.',
    ],
    tipHe: 'תוכל גם לבדוק את הספרה האחרונה: 0,2,4,6,8 מסיימות מספר זוגי; 1,3,5,7,9 – אי-זוגי.',
    tipEn: 'You can also check the last digit: 0,2,4,6,8 mean even; 1,3,5,7,9 mean odd.',
  },
  {
    topic: 'geometry',
    explanationHe: 'בתרגילי צורות נזהה תכונות: מספר צלעות, פינות או סימטריה. נתבונן בכל צורה ונשווה למה שאנחנו יודעים.',
    explanationEn: 'In shape exercises we inspect properties: number of sides, corners, or symmetry. Look at each shape and compare to what you know.',
    exampleHe: 'לריבוע יש 4 צלעות שוות ו-4 פינות ישרות. אם אנו רואים צורה עם התכונות הללו – זו צורת ריבוע.',
    exampleEn: 'A square has 4 equal sides and 4 right angles. When we spot a shape with those traits we know it is a square.',
    stepsHe: [
      'בדוק כמה צלעות או פינות יש לצורה שמסתכלים עליה.',
      'שאל: האם כל הצלעות שוות? האם יש קו סימטריה שמחלק אותה?',
      'התאם את הממצאים למה שאתה יודע על צורות מוכרות (ריבוע, מעגל, משולש וכו").',
    ],
    stepsEn: [
      'Count how many sides or corners the presented shape has.',
      'Ask: are all sides equal? Does a symmetry line split it evenly?',
      'Match your findings with known shapes (square, circle, triangle, etc.).',
    ],
    tipHe: 'שימוש בציור עם צבעים שונים לכל צלע או סימון של קו הסימטריה עוזר לשמור על הריכוז.',
    tipEn: 'Coloring each side differently or sketching the symmetry line keeps you focused on the right feature.',
  },
];
