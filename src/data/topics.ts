// src/data/topics.ts
import type { Topic } from '../types/questions';

export const TOPICS: Topic[] = [
  {
    id: 'numbers',
    label: 'הכרת המספרים עד 20',
    subtopics: ['ספירה', 'התאם מספר לכמות', 'כתיבה', 'לוח 10', 'שכנים', 'דילוגים'],
  },
  {
    id: 'addition',
    label: 'חיבור',
    subtopics: ['חיבור עד 10', 'השלמה ל-10', 'חיבור מילולי', 'דומינו מספרים'],
  },
  {
    id: 'subtraction',
    label: 'חיסור',
    subtopics: ['חיסור עד 10', 'חיסור מילולי', 'כמה נשאר'],
  },
  {
    id: 'evenOdd',
    label: 'מספרים זוגיים ואי-זוגיים',
  },
  {
    id: 'geometry',
    label: 'צורות, סימטריה ושיקוף',
    subtopics: ['צורות', 'סימטריה', 'שיקוף', 'השלמת חצי צורה'],
  },
];
