// src/utils/questionGenerator.ts
import type { Difficulty, TopicId, Question } from '../types/questions';

type AddTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxSum: number;      // למשל 10 או 20
  minA?: number;
  maxA?: number;
  minB?: number;
  maxB?: number;
};

/**
 * מייצר מערך של תרגילי חיבור לפי טמפלט נתון
 * @example
 * generateAdditionQuestions({
 *   idPrefix: 'auto_add_easy_',
 *   topic: 'addition',
 *   subtopic: 'חיבור עד 10',
 *   difficulty: 'easy',
 *   maxSum: 10
 * })
 */
export function generateAdditionQuestions(t: AddTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxSum,
    minA = 0,
    maxA = maxSum,
    minB = 0,
    maxB = maxSum,
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let a = minA; a <= maxA; a++) {
    for (let b = minB; b <= maxB; b++) {
      const sum = a + b;
      if (sum > maxSum) continue;
      if (b === 0 && a === 0) continue; // תרגיל לא מעניין

      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        prompt: `פתור: ${a} + ${b} = ?`,
        answer: sum,
      });

      counter++;
    }
  }

  return questions;
}

type SubTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxStart: number; // המספר שממנו מחסרים
  minStart?: number;
};

/**
 * מייצר מערך של תרגילי חיסור לפי טמפלט נתון
 * @example
 * generateSubtractionQuestions({
 *   idPrefix: 'auto_sub_easy_',
 *   topic: 'subtraction',
 *   subtopic: 'חיסור עד 10',
 *   difficulty: 'easy',
 *   maxStart: 10
 * })
 */
export function generateSubtractionQuestions(t: SubTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxStart,
    minStart = 1
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let start = minStart; start <= maxStart; start++) {
    for (let take = 0; take <= start; take++) {
      if (take === 0 && start === 0) continue; // תרגיל לא מעניין

      const result = start - take;
      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        prompt: `פתור: ${start} - ${take} = ?`,
        answer: result,
      });

      counter++;
    }
  }

  return questions;
}

type MultiplicationTemplate = {
  idPrefix: string;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  maxFactor: number; // הגורם המקסימלי
  minFactor?: number;
};

/**
 * מייצר מערך של תרגילי כפל לפי טמפלט נתון
 * @example
 * generateMultiplicationQuestions({
 *   idPrefix: 'auto_mul_easy_',
 *   topic: 'multiplication',
 *   subtopic: 'לוח הכפל עד 5',
 *   difficulty: 'easy',
 *   maxFactor: 5
 * })
 */
export function generateMultiplicationQuestions(t: MultiplicationTemplate): Question[] {
  const {
    idPrefix,
    topic,
    subtopic,
    difficulty,
    maxFactor,
    minFactor = 1
  } = t;

  const questions: Question[] = [];
  let counter = 1;

  for (let a = minFactor; a <= maxFactor; a++) {
    for (let b = minFactor; b <= maxFactor; b++) {
      const product = a * b;
      const id = `${idPrefix}${String(counter).padStart(3, '0')}`;

      questions.push({
        id,
        topic,
        subtopic,
        difficulty,
        prompt: `פתור: ${a} × ${b} = ?`,
        answer: product,
      });

      counter++;
    }
  }

  return questions;
}
