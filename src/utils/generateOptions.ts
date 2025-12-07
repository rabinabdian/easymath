// src/utils/generateOptions.ts
import type { Question } from '../types/questions';

/**
 * Generates multiple choice options for a question.
 * If the question already has options, returns them as-is.
 * Otherwise, generates plausible wrong answers near the correct answer.
 * 
 * @param question The question to generate options for
 * @param numOptions Number of options to generate (default: 4)
 * @returns Array of options including the correct answer
 */
export function generateOptionsForQuestion(
  question: Question,
  numOptions: number = 4
): (number | string)[] {
  // If options already exist, return them
  if (question.options && question.options.length > 0) {
    return question.options;
  }

  const answer = question.answer;

  // Handle numeric answers
  if (typeof answer === 'number') {
    return generateNumericOptions(answer, numOptions, question);
  }

  // Handle string answers
  if (typeof answer === 'string') {
    return generateStringOptions(answer, numOptions, question);
  }

  // Fallback - return just the answer
  return [answer];
}

/**
 * Generates numeric options based on the topic and answer
 */
function generateNumericOptions(
  answer: number,
  numOptions: number,
  question: Question
): number[] {
  const options = new Set<number>();
  options.add(answer);

  // Determine the range for wrong answers based on the topic and answer
  const { minOffset, maxOffset } = getOffsetRange(answer, question);

  // Generate wrong answers
  let attempts = 0;
  const maxAttempts = 100;

  while (options.size < numOptions && attempts < maxAttempts) {
    attempts++;
    
    // Generate a wrong answer within a reasonable range
    const offset = randomInt(minOffset, maxOffset);
    const wrongAnswer = answer + offset;

    // Ensure wrong answer is valid (non-negative for most topics)
    if (wrongAnswer >= 0 && wrongAnswer !== answer) {
      // Additional validation based on topic
      if (isValidWrongAnswer(wrongAnswer, answer, question)) {
        options.add(wrongAnswer);
      }
    }
  }

  // If we couldn't generate enough unique options, add more
  let fallbackOffset = 1;
  while (options.size < numOptions) {
    if (answer + fallbackOffset >= 0) {
      options.add(answer + fallbackOffset);
    }
    if (options.size < numOptions && answer - fallbackOffset >= 0) {
      options.add(answer - fallbackOffset);
    }
    fallbackOffset++;
  }

  // Convert to array and shuffle
  return shuffleArray([...options]);
}

/**
 * Determines the offset range based on the answer and question type
 */
function getOffsetRange(answer: number, _question: Question): { minOffset: number; maxOffset: number } {
  // For small answers (0-10), use smaller offsets
  if (answer <= 10) {
    return { minOffset: -3, maxOffset: 3 };
  }

  // For medium answers (11-20), use medium offsets
  if (answer <= 20) {
    return { minOffset: -5, maxOffset: 5 };
  }

  // For larger answers, scale the offset
  const range = Math.max(5, Math.ceil(answer * 0.2));
  return { minOffset: -range, maxOffset: range };
}

/**
 * Validates that a wrong answer is plausible and not too easy to spot
 */
function isValidWrongAnswer(wrongAnswer: number, correctAnswer: number, question: Question): boolean {
  // Don't allow negative numbers for counting/basic arithmetic
  if (wrongAnswer < 0) {
    return false;
  }

  // For multiplication, ensure wrong answers are reasonable multiples
  if (question.topic === 'multiplication') {
    // Multiplication answers should be reasonable (not too far off)
    const ratio = wrongAnswer / correctAnswer;
    if (ratio < 0.5 || ratio > 2) {
      return false;
    }
  }

  return true;
}

/**
 * Generates string options for non-numeric answers
 */
function generateStringOptions(
  answer: string,
  _numOptions: number,
  question: Question
): string[] {
  // For evenOdd questions
  if (question.topic === 'evenOdd') {
    // Common responses for even/odd questions
    if (answer === 'זוגי' || answer === 'אי-זוגי') {
      return shuffleArray(['זוגי', 'אי-זוגי']);
    }
    if (answer === 'כן' || answer === 'לא') {
      return shuffleArray(['כן', 'לא']);
    }
  }

  // For geometry/symmetry questions  
  if (question.topic === 'geometry') {
    if (answer === 'כן' || answer === 'לא') {
      return shuffleArray(['כן', 'לא']);
    }
    if (answer === 'מעגל') {
      return shuffleArray(['מעגל', 'ריבוע', 'משולש', 'משושה']);
    }
  }

  // For Hebrew number words
  const hebrewNumbers: Record<string, string[]> = {
    'תשע': ['שמונה', 'תשע', 'עשר', 'שבע'],
    'שמונה': ['שבע', 'שמונה', 'תשע', 'שש'],
    'שבע': ['שש', 'שבע', 'שמונה', 'חמש'],
  };

  if (hebrewNumbers[answer]) {
    return shuffleArray(hebrewNumbers[answer]);
  }

  // Default: return just the answer (user can still select it)
  return [answer];
}

/**
 * Generates a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  // Exclude 0 to ensure we don't accidentally add the correct answer
  let result: number;
  do {
    result = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (result === 0);
  return result;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Ensures a question has options, generating them if needed
 */
export function ensureQuestionHasOptions(question: Question): Question {
  // If already has numeric answer type and no options, generate them
  if (typeof question.answer === 'number' && (!question.options || question.options.length === 0)) {
    return {
      ...question,
      options: generateOptionsForQuestion(question),
    };
  }
  
  // If has string answer and is a yes/no or even/odd type, generate options
  if (typeof question.answer === 'string') {
    const newOptions = generateOptionsForQuestion(question);
    if (newOptions.length > 1) {
      return {
        ...question,
        options: newOptions,
      };
    }
  }
  
  return question;
}
