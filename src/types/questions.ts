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
}
