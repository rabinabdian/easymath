# תכונת ברכה אוטומטית לתלמיד
## Automatic Student Greeting Feature

### סיכום השינויים / Summary

#### עברית
הוספתי תכונה חדשה שמקריאה אוטומטית את שם התלמיד והסבר על התרגילים והנושא בעת כניסה לתרגילים.

**מה שמתרחש כעת:**
1. כאשר תלמיד מתחיל סדרת תרגילים, במסך ההקדמה של התרגיל הראשון מופיעה כרטיסיה מיוחדת עם:
   - אייקון יד מנופפת (👋)
   - ברכה אישית: "שלום [שם התלמיד]!"
   - מידע על מספר התרגילים: "היום נעשה X תרגילים במתמטיקה"
   - הנושא הנלמד: "נושא: [שם הנושא]"

2. **הקראה אוטומטית:** אם הגדרת "השמעה אוטומטית" מופעלת, המערכת תקריא:
   - "שלום [שם התלמיד]!"
   - "היום נעשה [מספר] תרגילים במתמטיקה"
   - "הנושא שלנו היום הוא: [שם הנושא]"
   - ולאחר מכן את כל ההסבר והדוגמאות של השיעור

3. הברכה מופיעה **רק בתרגיל הראשון** של הסשן, כך שהתלמיד לא ישמע אותה שוב ושוב בכל תרגיל.

#### English
I added a new feature that automatically reads the student's name and explains the exercises and topic when entering the exercises section.

**What happens now:**
1. When a student starts a series of exercises, a special greeting card appears on the first question's intro screen with:
   - Waving hand icon (👋)
   - Personal greeting: "Hello [student name]!"
   - Exercise information: "Today we will do X math exercises"
   - Topic information: "Topic: [topic name]"

2. **Auto-play:** If "auto-play lesson audio" setting is enabled, the system will read:
   - "Hello [student name]!"
   - "Today we will do [number] math exercises"
   - "Our topic today is: [topic name]"
   - Followed by all the lesson explanation and examples

3. The greeting appears **only on the first exercise** of the session, so the student won't hear it repeatedly.

---

### קבצים ששונו / Modified Files

#### 1. `/workspace/src/components/StudentGame.tsx`
הוספתי פרופס חדשים ל-`IntroScreen`:
- `isFirstQuestion={index === 0}` - מציין האם זה התרגיל הראשון
- `totalQuestions={totalQuestions}` - מספר התרגילים הכולל בסשן

Added new props to `IntroScreen`:
- `isFirstQuestion={index === 0}` - indicates if this is the first question
- `totalQuestions={totalQuestions}` - total number of questions in session

#### 2. `/workspace/src/components/IntroScreen.tsx`
שינויים עיקריים:
1. הוספת פרופס חדשים: `isFirstQuestion` ו-`totalQuestions`
2. ייבוא `TOPICS` מ-`../data/topics` לקבלת שמות הנושאים
3. יצירת `topicLabel` - שם הנושא בעברית
4. כרטיסיית ברכה חדשה שמוצגת רק בתרגיל הראשון
5. הוספת הברכה להקראה האוטומטית בתחילת האודיו

Main changes:
1. Added new props: `isFirstQuestion` and `totalQuestions`
2. Imported `TOPICS` from `../data/topics` to get topic names
3. Created `topicLabel` - Hebrew topic name
4. New greeting card that displays only on first question
5. Added greeting to auto-play audio at the beginning

---

### דרישות מערכת / System Requirements

**הגדרות נדרשות:**
- ✅ "צליל / קריינות" מופעל
- ✅ "השמעה אוטומטית של הסבר לפני תרגיל" מופעל

**Required Settings:**
- ✅ "Sounds/Narration" enabled
- ✅ "Auto-play lesson audio before exercise" enabled

ניתן לשנות הגדרות אלו במסך "כניסת הורה" (Parent Mode).
These settings can be changed in the "Parent Mode" screen.

---

### בדיקות / Testing

הפיצ'ר נבדק והוכן ל:
- ✅ TypeScript compilation - הקוד עובר את כל בדיקות הטייפסקריפט
- ✅ Build successful - הבילד מצליח ללא שגיאות
- ✅ No new linting errors - אין שגיאות lint חדשות בקבצים ששונו

Feature tested and ready for:
- ✅ TypeScript compilation - code passes all TypeScript checks
- ✅ Build successful - build completes without errors
- ✅ No new linting errors - no new lint errors in modified files

---

### איך לבדוק / How to Test

1. הכנס ל-"כניסת הורה" (Parent Mode)
2. הזן שם תלמיד (למשל "יוסי")
3. וודא שהגדרות הקול מופעלות:
   - ✅ צליל / קריינות
   - ✅ השמעה אוטומטית של הסבר לפני תרגיל
4. חזור לדף הבית ולחץ על "התחל תרגול"
5. במסך הראשון תראה את הברכה: "שלום יוסי!"
6. המערכת תקריא אוטומטית את הברכה והנושא

How to test:
1. Enter "Parent Mode"
2. Enter student name (e.g., "Yossi")
3. Ensure sound settings are enabled:
   - ✅ Sounds/Narration
   - ✅ Auto-play lesson audio before exercise
4. Return to home and click "Start Practice"
5. On first screen you'll see the greeting: "Hello Yossi!"
6. System will automatically read the greeting and topic

---

### תאריך יצירה / Creation Date
7 דצמבר 2025 / December 7, 2025

---

### הערות נוספות / Additional Notes

- הברכה מתאימה לשפה של הממשק (עברית/אנגלית)
- הנושא מוצג בעברית מתוך מערך `TOPICS`
- הברכה כוללת אנימציות חלקות ועיצוב מושך
- ניתן לשמוע את הברכה שוב ע"י לחיצה על כפתור הרמקול (🔊)

- Greeting adapts to interface language (Hebrew/English)
- Topic is displayed in Hebrew from `TOPICS` array
- Greeting includes smooth animations and attractive design
- Greeting can be replayed by clicking the speaker button (🔊)
