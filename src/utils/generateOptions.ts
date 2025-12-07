// src/utils/generateOptions.ts
import type { Question } from '../types/questions';

/**
 * Generates multiple choice options for questions that don't have them
 * Creates distractors (wrong answers) that are close to the correct answer
 */
export function generateOptionsForQuestion(question: Question): (number | string)[] {
  // If question already has options, return them
  if (question.options && question.options.length > 0) {
    return question.options;
  }

  const answer = question.answer;
  const options: (number | string)[] = [];

  // Handle numeric answers
  if (typeof answer === 'number') {
    const correctAnswer = answer;
    const optionsSet = new Set<number>([correctAnswer]);

    // Generate distractors based on difficulty and answer value
    const generateDistractors = (correct: number, count: number): number[] => {
      const distractors: number[] = [];
      const range = question.difficulty === 'easy' ? 3 : question.difficulty === 'medium' ? 5 : 8;

      // Add close numbers (one more, one less)
      if (correct > 0 && !optionsSet.has(correct - 1)) {
        distractors.push(correct - 1);
        optionsSet.add(correct - 1);
      }
      if (!optionsSet.has(correct + 1)) {
        distractors.push(correct + 1);
        optionsSet.add(correct + 1);
      }

      // Add numbers with small differences
      for (let diff = 2; diff <= range && distractors.length < count; diff++) {
        if (correct - diff > 0 && !optionsSet.has(correct - diff)) {
          distractors.push(correct - diff);
          optionsSet.add(correct - diff);
        }
        if (distractors.length < count && !optionsSet.has(correct + diff)) {
          distractors.push(correct + diff);
          optionsSet.add(correct + diff);
        }
      }

      // Fill remaining slots with random numbers in range
      const min = Math.max(0, correct - range);
      const max = correct + range;
      while (distractors.length < count) {
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (random >= 0 && random !== correct && !optionsSet.has(random)) {
          distractors.push(random);
          optionsSet.add(random);
        }
        // Safety break to avoid infinite loop
        if (optionsSet.size > 20) break;
      }

      return distractors;
    };

    // Generate 3-4 distractors (total 4-5 options including correct answer)
    const numDistractors = question.difficulty === 'easy' ? 2 : question.difficulty === 'medium' ? 3 : 4;
    const distractors = generateDistractors(correctAnswer, numDistractors);

    // Combine correct answer with distractors
    options.push(...distractors, correctAnswer);

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
  }

  // Handle string answers
  if (typeof answer === 'string') {
    // For string answers, try to extract common alternatives
    // This is more complex and may need topic-specific logic
    const commonAlternatives: Record<string, string[]> = {
      'כן': ['לא', 'אולי', 'תלוי'],
      'לא': ['כן', 'אולי', 'תלוי'],
      'זוגי': ['אי-זוגי', 'אפס', 'שלילי'],
      'אי-זוגי': ['זוגי', 'אפס', 'שלילי'],
    };

    const alternatives = commonAlternatives[answer] || ['אפשרות א', 'אפשרות ב', 'אפשרות ג'];
    options.push(...alternatives.slice(0, 3), answer);

    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
  }

  // Fallback: return empty array (shouldn't happen)
  return [];
}

/**
 * Ensures a question has options, generating them if needed
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
