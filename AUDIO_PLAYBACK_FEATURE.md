# תכונת השמעת אודיו אוטומטית בשיעורים / Automatic Audio Playback Feature

## תיאור / Description

**עברית:**
תכונה חדשה המאפשרת השמעה אוטומטית של הסברים קוליים במהלך הרצת שיעורים ואנימציות לפני תרגילים. התכונה מיועדת לשפר את חוויית הלמידה לילדים עם לקויות למידה על ידי מתן הסבר קולי אוטומטי.

**English:**
A new feature that enables automatic audio playback of explanations during lesson animations and before exercises. This feature is designed to enhance the learning experience for children with learning disabilities by providing automatic audio explanations.

---

## שינויים שבוצעו / Changes Made

### 1. **AnimatedLesson Component** (`src/components/AnimatedLesson.tsx`)

#### תכונות חדשות / New Features:
- ✅ תמיכה ב-`autoPlay` prop להפעלת אודיו אוטומטית
- ✅ השמעה אוטומטית של הסברים כשהאנימציה מתחילה
- ✅ הפעלה אוטומטית של אנימציות כאשר `autoPlay` מופעל
- ✅ תמיכה בכל סוגי האנימציות: מספרים, חיבור, חיסור, כפל, זוגי/אי-זוגי, גיאומטריה

#### דוגמת שימוש / Usage Example:
```typescript
<AnimatedLesson 
  question={question} 
  locale="he" 
  autoPlay={true} // הפעל אודיו אוטומטית / Enable auto-play
/>
```

---

### 2. **IntroScreen Component** (`src/components/IntroScreen.tsx`)

#### תכונות חדשות / New Features:
- ✅ תמיכה ב-`autoPlay` prop
- ✅ השמעה רציפה של כל קטעי השיעור:
  - כותרת השיעור
  - הסבר
  - שלבי פתרון
  - דוגמה
  - טיפ
  - תצוגה מקדימה של השאלה
- ✅ כפתור עצירה להשמעה (למשתמש יש שליטה)
- ✅ עיכוב חכם - ההסברים מושמעים לאחר שהאנימציה מסיימת

#### דוגמת שימוש / Usage Example:
```typescript
<IntroScreen 
  question={question} 
  lesson={lessonContent}
  onContinue={handleContinue}
  autoPlay={true} // הפעל הקראה אוטומטית / Enable auto-play
/>
```

---

### 3. **StudentGame Component** (`src/components/StudentGame.tsx`)

#### שינויים / Changes:
- ✅ הוספת import ל-`getLessonContent`
- ✅ העברת `autoPlay={true}` ל-`IntroScreen`
- ✅ כל שיעור חדש מופעל עם הקראה אוטומטית

---

## זרימת העבודה / Workflow

### תרחיש שימוש טיפוסי / Typical Use Case:

1. **תלמיד נכנס לתרגיל חדש** / Student starts a new exercise
   ```
   ↓
   ```

2. **מסך הקדמה מוצג עם אנימציה** / Intro screen shows with animation
   ```
   ↓
   ```

3. **אנימציה מתחילה אוטומטית** / Animation starts automatically
   ```
   (לאחר 0.5 שניות) / (After 0.5 seconds)
   ↓
   ```

4. **הסבר אודיו של האנימציה מושמע** / Animation audio explanation plays
   ```
   דוגמה: "חיבור זה לחבר דברים ביחד..."
   Example: "Addition is putting things together..."
   ↓
   ```

5. **הסברים נוספים מושמעים ברצף** / Additional explanations play sequentially
   ```
   (לאחר 6 שניות) / (After 6 seconds)
   ↓
   ```

6. **השמעת כל קטעי השיעור** / All lesson sections are narrated:
   - 🎯 כותרת / Title
   - 💡 הסבר / Explanation
   - 📝 שלבי פתרון / Steps
   - ✨ דוגמה / Example
   - 🎯 טיפ / Tip
   - 📝 השאלה / Question

7. **תלמיד יכול לעצור בכל עת** / Student can stop anytime
   ```
   לחיצה על כפתור "עצור הקראה" / Click "Stop Audio" button
   ```

---

## שליטה למשתמש / User Control

### כפתור עצירה / Stop Button
- 📍 **מיקום**: פינה שמאלית עליונה של המסך
- 🎨 **עיצוב**: כפתור אדום בולט עם אנימציית דופק
- ⏸️ **פעולה**: עוצר את כל ההשמעות מיד
- 🌍 **תמיכה רב-לשונית**: עברית ואנגלית

```typescript
// כפתור מופיע רק כשיש אודיו / Button shows only when audio is playing
{autoPlay && isAudioPlaying && (
  <button onClick={handleStopAudio}>
    ⏸️ עצור הקראה / Stop Audio
  </button>
)}
```

---

## פרטי טכניים / Technical Details

### עיכובים / Delays:
- **התחלת אנימציה**: 500ms (חצי שנייה)
- **הסברים נוספים**: 6000ms (6 שניות) - זמן מספיק לאנימציה להשמיע את ההסבר שלה

### טכנולוגיות / Technologies:
- ✅ Web Speech API (`window.speechSynthesis`)
- ✅ Hebrew voice support (`he-IL`)
- ✅ React hooks: `useState`, `useEffect`, `useCallback`
- ✅ TypeScript for type safety

### תאימות דפדפנים / Browser Compatibility:
- ✅ Chrome/Edge (מומלץ / Recommended)
- ✅ Safari
- ✅ Firefox
- ⚠️ דורש תמיכה ב-Web Speech API

---

## בדיקות / Testing

### נושאים שנבדקו / Topics Tested:

| נושא / Topic | סוג אנימציה / Animation Type | סטטוס / Status |
|--------------|------------------------------|----------------|
| 🔢 מספרים / Numbers | ספירה ויזואלית / Visual counting | ✅ |
| ➕ חיבור / Addition | שילוב קבוצות / Group combination | ✅ |
| ➖ חיסור / Subtraction | הסרת פריטים / Item removal | ✅ |
| ✖️ כפל / Multiplication | קבוצות שוות / Equal groups | ✅ |
| ⚖️ זוגי/אי-זוגי / Even/Odd | יצירת זוגות / Pairing | ✅ |
| 📐 גיאומטריה / Geometry | צורות / Shapes | ✅ |
| 🦋 סימטריה / Symmetry | ראייה במראה / Mirror view | ✅ |

---

## יתרונות פדגוגיים / Educational Benefits

### לילדים עם לקויות למידה / For Children with Learning Disabilities:

1. **למידה רב-חושית** / Multi-sensory Learning
   - 👀 וויזואלי: אנימציות צבעוניות / Visual: Colorful animations
   - 👂 אודיטורי: הסברים קוליים / Auditory: Voice explanations
   - 🧠 קוגניטיבי: חיזוקים מרובים / Cognitive: Multiple reinforcements

2. **קצב למידה אישי** / Personal Learning Pace
   - ⏸️ שליטה על הקצב / Control over pace
   - 🔁 אפשרות להאזין שוב / Can listen again
   - 📊 בלי לחץ / No pressure

3. **נגישות משופרת** / Enhanced Accessibility
   - 🗣️ תמיכה בשפה עברית / Hebrew language support
   - 🔊 איכות קול מותאמת / Adjusted voice quality
   - 🎯 הסברים ממוקדים / Focused explanations

---

## דוגמאות קוד / Code Examples

### הפעלת אנימציה עם אודיו / Starting Animation with Audio:

```typescript
const startAnimation = useCallback(() => {
  if (isPlaying) return;
  setIsPlaying(true);
  setVisibleCount(0);
  
  // Auto-play audio when animation starts
  if (autoPlay) {
    speak(audioText);
  }
}, [isPlaying, autoPlay, audioText]);

// Auto-start animation if autoPlay is enabled
useEffect(() => {
  if (autoPlay && !isPlaying) {
    const timer = setTimeout(() => {
      startAnimation();
    }, 500);
    return () => clearTimeout(timer);
  }
}, [autoPlay, isPlaying, startAnimation]);
```

### הקראה רציפה של קטעים / Sequential Narration:

```typescript
useEffect(() => {
  if (!autoPlay || hasAutoPlayed) return;
  
  setHasAutoPlayed(true);
  
  // Build sequential audio narration
  const audioSegments: string[] = [];
  
  if (explanation) audioSegments.push(explanation);
  if (steps.length > 0) audioSegments.push(steps.join('. '));
  if (example) audioSegments.push(example);
  if (tip) audioSegments.push(tip);
  audioSegments.push(questionText);
  
  const fullNarration = audioSegments.join('. ');
  
  // Play after animation audio (6 seconds delay)
  const timer = setTimeout(() => {
    speak(fullNarration, () => {
      setIsAudioPlaying(false);
    });
  }, 6000);
  
  return () => {
    clearTimeout(timer);
    stopSpeaking();
  };
}, [autoPlay, hasAutoPlayed, explanation, steps, example, tip, questionText]);
```

---

## פיתוחים עתידיים / Future Enhancements

### רעיונות לשיפור / Enhancement Ideas:

1. **שליטה מתקדמת** / Advanced Controls
   - ⏯️ השהה/המשך / Pause/Resume
   - ⏭️ דלג קדימה/אחורה / Skip forward/backward
   - 🔊 עוצמת קול / Volume control
   - 🎚️ מהירות הקראה / Playback speed

2. **התאמה אישית** / Personalization
   - 🗣️ בחירת קול / Voice selection
   - 🎭 טון וגובה קול / Tone and pitch
   - 📖 בחירת קטעים להקראה / Select sections to read

3. **מעקב וניתוח** / Tracking and Analytics
   - 📊 מעקב אחר השמעות / Track playback events
   - ⏱️ זמן הקשבה / Listening time
   - 🎯 העדפות תלמיד / Student preferences

---

## תיעוד נוסף / Additional Documentation

### קבצים רלוונטיים / Related Files:
- `src/components/AnimatedLesson.tsx` - קומפוננט אנימציות
- `src/components/IntroScreen.tsx` - מסך הקדמה
- `src/components/StudentGame.tsx` - משחק התלמיד
- `src/utils/speech.ts` - כלי השמעת דיבור
- `src/data/topicLessons.ts` - תוכן שיעורים

### משאבים / Resources:
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## סיכום / Summary

תכונת ההשמעה האוטומטית משפרת משמעותית את חוויית הלמידה לילדים עם לקויות למידה על ידי:

- ✅ מתן תמיכה אודיטורית אוטומטית
- ✅ חיזוק למידה רב-חושית
- ✅ אפשרות שליטה ובחירה
- ✅ התאמה לקצב אישי
- ✅ נגישות משופרת

The automatic playback feature significantly enhances the learning experience for children with learning disabilities by:

- ✅ Providing automatic auditory support
- ✅ Reinforcing multi-sensory learning
- ✅ Offering control and choice
- ✅ Adapting to personal pace
- ✅ Improving accessibility

---

**תאריך יצירה / Created:** December 7, 2025
**גרסה / Version:** 1.0.0
**מחבר / Author:** AI Assistant (Claude Sonnet 4.5)
