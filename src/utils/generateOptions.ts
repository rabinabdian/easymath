// src/utils/generateOptions.ts
import type { Question } from '../types/questions';

/**
 * Generates multiple choice options for a question if it doesn't have them
 * Creates distractors (wrong answers) that are close to the correct answer
 * to make the question meaningful
 */
export function generateOptionsForQuestion(question: Question): (number | string)[] {
  // If question already has options, return them
  if (question.options && question.options.length > 0) {
    return question.options;
  }

  const correctAnswer = question.answer;
  const answerNum = typeof correctAnswer === 'number' ? correctAnswer : parseInt(String(correctAnswer), 10);

  // If answer is not a number, return empty array (can't generate options)
  if (isNaN(answerNum)) {
    return [correctAnswer];
  }

  // Generate 3-4 distractors (wrong answers) + correct answer = 4-5 options total
  const options: number[] = [answerNum];
  const used = new Set([answerNum]);

  // Generate distractors based on difficulty and topic
  const difficulty = question.difficulty;
  const topic = question.topic;

  // Number of distractors to generate
  const numDistractors = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  const totalOptions = numDistractors + 1; // +1 for correct answer

  // Strategy for generating distractors based on topic
  let distractorRange: number;
  if (topic === 'numbers' || topic === 'addition' || topic === 'subtraction') {
    // For counting/addition/subtraction: distractors within ±3-5 range
    distractorRange = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  } else if (topic === 'multiplication') {
    // For multiplication: distractors can be further off
    distractorRange = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  } else {
    // Default: ±3 range
    distractorRange = 3;
  }

  // Generate distractors
  while (options.length < totalOptions && options.length < 5) {
    // Try different strategies to generate interesting distractors
    let distractor: number;
    const attempts = options.length - 1; // How many distractors we've already generated

    if (attempts === 0) {
      // First distractor: answer + 1 or -1 (very close)
      distractor = answerNum + (Math.random() > 0.5 ? 1 : -1);
    } else if (attempts === 1) {
      // Second distractor: answer + 2 or -2
      distractor = answerNum + (Math.random() > 0.5 ? 2 : -2);
    } else if (attempts === 2) {
      // Third distractor: answer + distractorRange or -distractorRange
      distractor = answerNum + (Math.random() > 0.5 ? distractorRange : -distractorRange);
    } else {
      // Additional distractors: random within range
      const offset = Math.floor(Math.random() * distractorRange * 2) - distractorRange;
      distractor = answerNum + offset;
    }

    // Ensure distractor is positive (for most math questions)
    if (distractor < 0) {
      distractor = Math.abs(distractor) || 1;
    }

    // Ensure distractor is different from correct answer and not already used
    if (distractor !== answerNum && !used.has(distractor)) {
      options.push(distractor);
      used.add(distractor);
    }
  }

  // Shuffle options so correct answer isn't always first
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}

/**
 * Ensures a question has options, generating them if needed
 * Returns a new question object with options added
 */
export function ensureQuestionHasOptions(question: Question): Question {
  if (question.options && question.options.length > 0) {
    return question;
  }

  return {
    ...question,
    options: generateOptionsForQuestion(question),
  };
}
