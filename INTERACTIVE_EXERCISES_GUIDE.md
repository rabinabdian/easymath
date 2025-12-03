# מערכת תרגילים אינטראקטיביים לילדים עם לקויות למידה

## סקירה כללית

מערכת זו מיועדת במיוחד לילדים עם לקויות למידה, המתקשים בקריאה וכתיבה. המערכת מספקת:

- 📚 **הסבר ודוגמא** לפני כל תרגיל
- 🎨 **אלמנטים ויזואליים** (אימוג'י, צורות, אייקונים) לעזרה בפתרון
- 💪 **3 ניסיונות** לכל שאלה עם עידוד
- 🎓 **פתרון אוטומטי עם הסבר** אחרי 3 ניסיונות כושלים
- ✨ **ממשק נגיש וידידותי** עם טקסט גדול וצבעוני

## מבנה המערכת

### 1. Types המורחבים (`src/types/questions.ts`)

```typescript
interface VisualAid {
  type: 'emoji' | 'icon' | 'shape' | 'image';
  value: string;
  count?: number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

interface Question {
  // ... שדות קיימים

  // שדות חדשים למערכת אינטראקטיבית:
  introExplanationHe?: string;    // הסבר כללי לפני התרגיל
  introExplanationEn?: string;
  introExampleHe?: string;         // דוגמא לפני התרגיל
  introExampleEn?: string;
  visualAids?: VisualAid[];        // אלמנטים ויזואליים בשאלה
  autoSolveExplanationHe?: string; // הסבר לאחר 3 ניסיונות
  autoSolveExplanationEn?: string;
  autoSolveVisualAid?: VisualAid;  // אלמנט ויזואלי להסבר
}
```

### 2. רכיבים חדשים

#### `IntroScreen` - מסך הסבר לפני השאלה
- מציג הסבר כללי
- מציג דוגמא
- כפתור גדול "הבנתי! בואו נתחיל"

#### `VisualAidsDisplay` - תצוגת אלמנטים ויזואליים
- תומך באימוג'י (🍎, ⭐, ❤️)
- תומך בצורות גיאומטריות (עיגול, ריבוע, משולש)
- תומך באייקונים מוכנים מראש
- תומך בתמונות

#### `StudentGame` - מעודכן עם התכונות החדשות
- מעקב אחר מספר ניסיונות (0-3)
- הצגת intro screen
- הצגת auto-solve screen
- מערכת נקודות משופרת (יותר נקודות = פחות ניסיונות)

## איך ליצור תרגיל חדש

### דוגמא מלאה

```typescript
const countingApplesExercise: Question = {
  id: 'count-apples-1',
  topic: 'numbers',
  difficulty: 'easy',

  // השאלה עצמה
  promptHe: 'כמה תפוחים יש?',
  promptEn: 'How many apples are there?',
  answer: 3,

  // הסבר ודוגמא לפני השאלה
  introExplanationHe: 'ספירה זה קל!\nאנחנו פשוט סופרים כל דבר בנפרד:\n1... 2... 3...',
  introExampleHe: 'דוגמא: אם יש לנו 🍌🍌\nאנחנו סופרים: 1, 2\nיש לנו 2 בננות!',

  // אלמנטים ויזואליים בשאלה
  visualAids: [
    {
      type: 'emoji',
      value: '🍎',
      count: 3,
      size: 'large'
    }
  ],

  // הסבר אחרי 3 ניסיונות כושלים
  autoSolveExplanationHe: 'בוא נספור ביחד!\n\n🍎 ← זה תפוח אחד (1)\n🍎 ← עוד תפוח אחד (2)\n🍎 ← ועוד תפוח אחד (3)\n\nסך הכל יש לנו 3 תפוחים!',
  autoSolveVisualAid: {
    type: 'emoji',
    value: '🍎',
    count: 3,
    size: 'large'
  }
};
```

## סוגי Visual Aids

### 1. Emoji
```typescript
{
  type: 'emoji',
  value: '🍎',  // כל אימוג'י
  count: 3,      // כמה פעמים להציג
  size: 'large'  // 'small' | 'medium' | 'large'
}
```

### 2. Shape (צורה גיאומטרית)
```typescript
{
  type: 'shape',
  value: 'circle',  // 'circle' | 'square' | 'triangle'
  count: 4,
  size: 'large',
  color: '#3b82f6'  // כל צבע CSS
}
```

### 3. Icon (אייקונים מוכנים)
```typescript
{
  type: 'icon',
  value: 'star',  // star, heart, apple, ball, book, pencil, flower, tree, sun, moon, check, cross
  count: 5,
  size: 'large'
}
```

### 4. Image (תמונה)
```typescript
{
  type: 'image',
  value: '/path/to/image.png',
  count: 2,
  size: 'medium'
}
```

## תרגילים לדוגמא

הקובץ `src/data/interactiveExercises.tsx` מכיל 6 תרגילים לדוגמא:

1. **ספירת תפוחים** - ספירה בסיסית עם אימוג'י
2. **ספירת כוכבים** - ספירה עם אייקונים
3. **חיבור פרחים** - חיבור פשוט עם ויזואליזציה
4. **ספירת עיגולים** - זיהוי צורות
5. **חיסור לבבות** - חיסור פשוט
6. **ספירת שמשות** - ספירה סלקטיבית

## איך המערכת עובדת

### תהליך התרגיל

1. **Intro Screen** (אם קיים)
   - מוצג אוטומטית לפני כל שאלה
   - מציג הסבר ודוגמא
   - התלמיד לוחץ "הבנתי" כדי להמשיך

2. **מסך השאלה**
   - תצוגת השאלה עם אלמנטים ויזואליים
   - שעון עצר (30 שניות)
   - מונה ניסיונות (0-3)
   - התלמיד מזין תשובה

3. **פידבק על תשובה**
   - ✅ **נכון** - מעבר מיידי לשאלה הבאה
   - ❌ **לא נכון**:
     - ניסיון 1: "נסה שוב! אתה יכול! 💪"
     - ניסיון 2: "כמעט! עוד ניסיון אחד! 🌟"
     - ניסיון 3: מעבר למסך Auto-Solve

4. **Auto-Solve Screen** (אחרי 3 ניסיונות)
   - מציג את התשובה הנכונה בגדול
   - מציג אלמנט ויזואלי
   - מציג הסבר מפורט
   - כפתור "הבנתי! בואו נמשיך"

### מערכת הנקודות

- תשובה נכונה בניסיון ראשון: **1 נקודה**
- תשובה נכונה בניסיון שני: **0.7 נקודה**
- תשובה נכונה בניסיון שלישי: **0.5 נקודה**
- Auto-solve: **0 נקודות** (אבל ממשיכים למשחק)

## עצות לכתיבת תרגילים

### עבור ילדים עם לקויות למידה

1. **טקסט פשוט וברור**
   - משפטים קצרים
   - מילים פשוטות
   - הרבה רווחים בין שורות

2. **הרבה ויזואליזציה**
   - השתמש באלמנטים ויזואליים בכל שאלה
   - העדף אימוג'י מוכרים (🍎, ⭐, ❤️)
   - השתמש בצבעים בהירים

3. **הסברים מפורטים**
   - הסבר את התהליך צעד אחר צעד
   - השתמש בדוגמאות פשוטות
   - חזור על הרעיון במילים שונות

4. **עידוד חיובי**
   - תן פידבק חיובי תמיד
   - עודד גם אחרי טעויות
   - חגוג הצלחות קטנות

### דוגמא להסבר טוב

```
❌ לא טוב:
"חיבור זה פעולה מתמטית בינארית"

✅ טוב:
"חיבור זה כשאנחנו מוסיפים דברים!
אם יש לנו משהו, ומוסיפים עוד - זה חיבור!

דוגמא: יש לי 1 כדור ⚽
קיבלתי עוד כדור אחד ⚽
עכשיו יש לי 2 כדורים! ⚽⚽"
```

## שימוש במערכת

### לשימוש בתרגילים האינטראקטיביים

```typescript
import { interactiveExercises } from './data/interactiveExercises';

// שימוש בכל התרגילים
<StudentGame questions={interactiveExercises} onExit={handleExit} />

// שימוש בתרגילים לפי נושא
import { getInteractiveExercisesByTopic } from './data/interactiveExercises';
const countingExercises = getInteractiveExercisesByTopic('numbers');

// שימוש בתרגילים לפי רמת קושי
import { getInteractiveExercisesByDifficulty } from './data/interactiveExercises';
const easyExercises = getInteractiveExercisesByDifficulty('easy');
```

## תכונות עתידיות (אופציונלי)

רעיונות להרחבה:

1. **סאונד** - קריינות של ההסברים
2. **אנימציות** - אלמנטים נעים ואינטראקטיביים
3. **משחקיות** - תגמולים, badges, achievements
4. **התאמה אישית** - התאמת רמת הקושי לפי ביצועים
5. **דוחות להורים** - מעקב אחר התקדמות

---

## תמיכה טכנית

לשאלות ובעיות, פנה למפתח הראשי או פתח issue ב-GitHub.

**נוצר במיוחד לילדים עם לקויות למידה ❤️**
