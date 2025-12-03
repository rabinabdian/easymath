// src/types/questions.ts

export type TopicId =
  | 'numbers'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'evenOdd'
  | 'geometry';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: TopicId;
  label: string;
  subtopics?: string[];
  icon?: string; // תמונה/אייקון של הנושא
}

// Visual aid types for interactive exercises
export interface VisualAid {
  type: 'emoji' | 'icon' | 'shape' | 'image';
  value: string; // emoji character, icon name, or image path
  count?: number; // for displaying multiple instances
  color?: string; // for shapes
  size?: 'small' | 'medium' | 'large';
}

export interface Question {
  id: string;
  topic: TopicId;
  subtopic?: string;
  difficulty: Difficulty;

  // טקסט התרגיל - דו-לשוני
  promptHe: string;
  promptEn: string;

  // תשובה "ראשית" (בד"כ מספר)
  answer: number | string;

  // למבחנים אמריקאיים
  options?: (number | string)[];

  // לפעמים תרצה להציג תמונה / איור
  assetId?: string; // למשל "page_7_butterflies"

  // הסבר לפידבק למורה / לתלמיד - דו-לשוני
  explanationHe?: string;
  explanationEn?: string;

  // האם זה תרגיל הקראה (המספר נקרא בקול במקום להציג אותו)
  isReadingExercise?: boolean;

  // ===== מערכת תרגילים אינטראקטיביים לילדים עם לקויות למידה =====

  // הסבר כללי ודוגמא לפני התרגיל
  introExplanationHe?: string;
  introExplanationEn?: string;
  introExampleHe?: string;
  introExampleEn?: string;

  // אלמנטים ויזואליים לעזרה בפתרון (אימוג'י, צורות, אייקונים)
  visualAids?: VisualAid[];

  // הסבר שמוצג אחרי 3 ניסיונות כושלים (פתרון אוטומטי)
  autoSolveExplanationHe?: string;
  autoSolveExplanationEn?: string;

  // אימוג'י או אייקון להצגה בהסבר האוטומטי
  autoSolveVisualAid?: VisualAid;
}
