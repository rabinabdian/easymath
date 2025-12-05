// src/i18n.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ensureLTRNumbers } from './utils/textDirection';

export type Locale = 'he' | 'en';

// Translation keys - add more as needed
type TransKey =
  // Teacher Dashboard
  | 'teacher.title'
  | 'teacher.subtitle'
  | 'teacher.topic.title'
  | 'teacher.topic.select'
  | 'teacher.topic.subtopic'
  | 'teacher.topic.allSubtopics'
  | 'teacher.difficulty.title'
  | 'teacher.difficulty.all'
  | 'teacher.difficulty.easy'
  | 'teacher.difficulty.medium'
  | 'teacher.difficulty.hard'
  | 'teacher.difficulty.count'
  | 'teacher.save.title'
  | 'teacher.save.placeholder'
  | 'teacher.save.button'
  | 'teacher.year.title'
  | 'teacher.year.selectWeek'
  | 'teacher.year.weekOption'
  | 'teacher.year.help'
  | 'teacher.buttons.generate'
  | 'teacher.buttons.pdf'
  | 'teacher.buttons.json'
  | 'teacher.buttons.import'
  | 'teacher.buttons.studentMode'
  | 'teacher.buttons.yearPlan'
  | 'teacher.buttons.yearBooklet'
  | 'teacher.questions.title'
  | 'teacher.questions.empty'
  | 'teacher.questions.generated'
  | 'teacher.saved.title'
  | 'teacher.saved.empty'
  | 'teacher.saved.load'
  | 'teacher.saved.delete'
  | 'teacher.badges.title'
  | 'teacher.badges.empty'
  | 'teacher.badges.best'
  // Student Game
  | 'student.backToTeacher'
  | 'student.hearts'
  | 'student.timer'
  | 'student.score'
  | 'student.question'
  | 'student.of'
  | 'student.placeholder'
  | 'student.check'
  | 'student.correct'
  | 'student.wrong'
  | 'student.wrongAnswer'
  | 'student.timeUp'
  | 'student.finished.title'
  | 'student.finished.score'
  | 'student.finished.excellent'
  | 'student.finished.good'
  | 'student.finished.tryAgain'
  | 'student.finished.backButton'
  | 'student.gameOver.title'
  | 'student.gameOver.tried'
  | 'student.gameOver.score'
  | 'student.gameOver.hint'
  | 'student.gameOver.backButton'
  | 'student.badge.earned'
  // General
  | 'general.loading'
  ;

const translations: Record<Locale, Record<TransKey, string>> = {
  he: {
    // Teacher Dashboard
    'teacher.title': 'Easymath – ממשק מורה',
    'teacher.subtitle':
      'בחר נושא, רמת קושי וכמות תרגילים – ואחר כך תוכל לשמור מבחן, להוריד כ־PDF או לשחק במצב תלמיד.',
    'teacher.topic.title': 'נושא',
    'teacher.topic.select': 'בחר נושא:',
    'teacher.topic.subtopic': 'תת־נושא:',
    'teacher.topic.allSubtopics': 'כל התת־נושאים',
    'teacher.difficulty.title': 'רמת קושי וכמות',
    'teacher.difficulty.all': 'הכול',
    'teacher.difficulty.easy': 'קל',
    'teacher.difficulty.medium': 'בינוני',
    'teacher.difficulty.hard': 'קשה',
    'teacher.difficulty.count': 'כמות תרגילים:',
    'teacher.save.title': 'שמירת מבחן',
    'teacher.save.placeholder': 'שם המבחן (למשל: חיבור עד 10)',
    'teacher.save.button': 'שמור מבחן',
    'teacher.year.title': 'תכנית שנה – בחירת שבוע',
    'teacher.year.selectWeek': 'בחר שבוע:',
    'teacher.year.weekOption': '--- בחר שבוע ---',
    'teacher.year.help':
      'בחירת שבוע תייצר אוטומטית תרגול מתאים לנושא ולפעילות (שיעור, תרגול, חידון).',
    'teacher.buttons.generate': 'צור רשימת תרגילים',
    'teacher.buttons.pdf': 'הורד כ-PDF',
    'teacher.buttons.json': 'הורד כ-JSON',
    'teacher.buttons.import': 'ייבוא מבחן (JSON)',
    'teacher.buttons.studentMode': 'מצב תלמיד',
    'teacher.buttons.yearPlan': 'תכנית שנתית',
    'teacher.buttons.yearBooklet': 'הורד חוברת שנה',
    'teacher.questions.title': 'תצוגת תרגילים',
    'teacher.questions.empty':
      'עדיין אין תרגילים. בחר הגדרות ולחץ על ״צור רשימת תרגילים״.',
    'teacher.questions.generated': 'כרגע נוצרו {count} תרגילים.',
    'teacher.saved.title': 'מבחנים שמורים',
    'teacher.saved.empty':
      'עוד לא שמרת מבחנים. אחרי שתיצור תרגילים ותיתן שם – תוכל לשמור.',
    'teacher.saved.load': 'טען',
    'teacher.saved.delete': 'מחק',
    'teacher.badges.title': 'תגי התקדמות (Badges)',
    'teacher.badges.empty':
      'עדיין אין תגי חודש. כשילד יסיים תרגול עם ציון טוב – יופיעו כאן.',
    'teacher.badges.best': 'שיא: {score}%',
    // Student Game
    'student.backToTeacher': '← חזרה למורה',
    'student.hearts': 'לבבות:',
    'student.timer': 'טיימר:',
    'student.score': 'ניקוד:',
    'student.question': 'שאלה',
    'student.of': 'מתוך',
    'student.placeholder': 'כתוב כאן את התשובה',
    'student.check': 'בדיקה',
    'student.correct': 'כל הכבוד! תשובה נכונה ✅',
    'student.wrong': 'לא מדויק... נסה שוב 🙂',
    'student.wrongAnswer': 'לא מדויק... התשובה הנכונה היא: {answer}',
    'student.timeUp': 'נגמר הזמן ⏱️',
    'student.finished.title': 'כל הכבוד! סיימת את כל התרגילים 🎉',
    'student.finished.score': 'ניקוד:',
    'student.finished.excellent': 'תלמיד על חלל!',
    'student.finished.good': 'יפה מאוד, יש עוד קצת מה לשפר 🙂',
    'student.finished.tryAgain':
      'כל התחלה היא מצוינת, תנסה שוב ותראה שיפור.',
    'student.finished.backButton': 'חזרה למצב מורה',
    'student.gameOver.title': 'נגמרו כל הלבבות 💔',
    'student.gameOver.tried': 'ניסו/ה:',
    'student.gameOver.score': 'ניקוד:',
    'student.gameOver.hint':
      'אפשר לנסות שוב, לבחור פחות תרגילים או רמת קושי אחרת.',
    'student.gameOver.backButton': 'חזרה למצב מורה',
    'student.badge.earned': 'קיבלת תג חודש {month}! 🎉',
    // General
    'general.loading': 'טוען...',
  },
  en: {
    // Teacher Dashboard
    'teacher.title': 'Easymath – Teacher Dashboard',
    'teacher.subtitle':
      'Choose topic, difficulty and number of questions – then build tests or practice.',
    'teacher.topic.title': 'Topic',
    'teacher.topic.select': 'Select topic:',
    'teacher.topic.subtopic': 'Subtopic:',
    'teacher.topic.allSubtopics': 'All subtopics',
    'teacher.difficulty.title': 'Difficulty & Count',
    'teacher.difficulty.all': 'All',
    'teacher.difficulty.easy': 'Easy',
    'teacher.difficulty.medium': 'Medium',
    'teacher.difficulty.hard': 'Hard',
    'teacher.difficulty.count': 'Number of questions:',
    'teacher.save.title': 'Save Exam',
    'teacher.save.placeholder': 'Exam name (e.g., Addition up to 10)',
    'teacher.save.button': 'Save exam',
    'teacher.year.title': 'Year Plan – Select Week',
    'teacher.year.selectWeek': 'Select week:',
    'teacher.year.weekOption': '--- Select week ---',
    'teacher.year.help':
      'Selecting a week will automatically generate practice suitable for the topic and activity (lesson, practice, quiz).',
    'teacher.buttons.generate': 'Generate questions',
    'teacher.buttons.pdf': 'Download as PDF',
    'teacher.buttons.json': 'Download as JSON',
    'teacher.buttons.import': 'Import exam (JSON)',
    'teacher.buttons.studentMode': 'Student mode',
    'teacher.buttons.yearPlan': 'Yearly plan',
    'teacher.buttons.yearBooklet': 'Download yearly booklet',
    'teacher.questions.title': 'Questions Preview',
    'teacher.questions.empty':
      'No questions yet. Choose settings and click "Generate questions".',
    'teacher.questions.generated': 'Currently generated {count} questions.',
    'teacher.saved.title': 'Saved Exams',
    'teacher.saved.empty':
      "Haven't saved any exams yet. After creating questions and naming them – you can save.",
    'teacher.saved.load': 'Load',
    'teacher.saved.delete': 'Delete',
    'teacher.badges.title': 'Progress Badges',
    'teacher.badges.empty':
      'No month badges yet. When a student completes practice with a good score – they will appear here.',
    'teacher.badges.best': 'Best: {score}%',
    // Student Game
    'student.backToTeacher': '← Back to teacher',
    'student.hearts': 'Hearts:',
    'student.timer': 'Timer:',
    'student.score': 'Score:',
    'student.question': 'Question',
    'student.of': 'of',
    'student.placeholder': 'Type your answer here',
    'student.check': 'Check',
    'student.correct': 'Great job! Correct answer ✅',
    'student.wrong': 'Not quite... try again 🙂',
    'student.wrongAnswer': 'Not quite... the correct answer is: {answer}',
    'student.timeUp': "Time's up ⏱️",
    'student.finished.title': 'Great job! You completed all exercises 🎉',
    'student.finished.score': 'Score:',
    'student.finished.excellent': 'Outstanding student!',
    'student.finished.good': 'Very good, there is a bit more to improve 🙂',
    'student.finished.tryAgain':
      'Every beginning is excellent, try again and see improvement.',
    'student.finished.backButton': 'Back to teacher mode',
    'student.gameOver.title': 'No hearts left 💔',
    'student.gameOver.tried': 'Attempted:',
    'student.gameOver.score': 'Score:',
    'student.gameOver.hint':
      'You can try again, choose fewer questions or a different difficulty level.',
    'student.gameOver.backButton': 'Back to teacher mode',
    'student.badge.earned': 'You earned a {month} badge! 🎉',
    // General
    'general.loading': 'Loading...',
  },
};

interface I18nContextValue {
  locale: Locale;
  t: (key: TransKey, params?: Record<string, string | number>) => string;
  setLocale: (loc: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = 'easymath_locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>('he');

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'he' || saved === 'en') {
      setLocaleState(saved);
    }
  }, []);

  // Save locale and update document direction
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === 'he' ? 'he' : 'en';
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = (key: TransKey, params?: Record<string, string | number>) => {
    const table = translations[locale];
    let text = table[key] ?? key;

    // Simple parameter replacement: {param} -> value
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    if (locale === 'he') {
      text = ensureLTRNumbers(text);
    }

    return text;
  };

  const setLocale = (loc: Locale) => setLocaleState(loc);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
};
