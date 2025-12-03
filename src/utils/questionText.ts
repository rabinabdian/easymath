// src/utils/questionText.ts
import type { Question } from '../types/questions';
import type { Locale } from '../i18n';

/**
 * Wraps text with Left-to-Right directional marks to ensure proper display in RTL contexts
 * This is essential for mathematical expressions which should always be read left-to-right
 *
 * Uses Unicode LTR Embedding (U+202A) and Pop Directional Formatting (U+202C) characters
 * to isolate the text and ensure it's displayed left-to-right even in RTL environments
 */
export function wrapLTR(text: string): string {
  const LRE = '\u202A'; // Left-to-Right Embedding
  const PDF = '\u202C'; // Pop Directional Formatting
  return `${LRE}${text}${PDF}`;
}

/**
 * Get question prompt text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionPrompt(q: Question, locale: Locale): string {
  if (locale === 'he') {
    return q.promptHe || q.promptEn;
  }
  return q.promptEn || q.promptHe;
}

/**
 * Get question explanation text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionExplanation(
  q: Question,
  locale: Locale
): string | undefined {
  if (locale === 'he') {
    return q.explanationHe || q.explanationEn;
  }
  return q.explanationEn || q.explanationHe;
}

interface NarrationOptions {
  includeAnswer?: boolean;
}

/**
 * Build a friendly narration string that helps children understand the question
 * When includeAnswer=true the message ends with the concrete solution.
 */
export function buildUnderstandingNarration(
  question: Question,
  locale: Locale,
  options: NarrationOptions = {}
): string {
  const prompt = getQuestionPrompt(question, locale).trim();
  const localizedExplanation =
    locale === 'he'
      ? question.autoSolveExplanationHe ||
        question.explanationHe ||
        question.introExplanationHe ||
        question.introExampleHe
      : question.autoSolveExplanationEn ||
        question.explanationEn ||
        question.introExplanationEn ||
        question.introExampleEn;
  const answerText = question.answer !== undefined ? String(question.answer) : '';
  const includeAnswer = options.includeAnswer ?? false;

  if (localizedExplanation) {
    if (includeAnswer && answerText && !localizedExplanation.includes(answerText)) {
      return `${localizedExplanation}\n\n${
        locale === 'he' ? 'התשובה היא' : 'The answer is'
      } ${answerText}`;
    }
    return localizedExplanation;
  }

  if (includeAnswer && answerText) {
    return locale === 'he'
      ? `${prompt ? `השאלה הייתה: ${prompt}\n` : ''}התשובה הנכונה היא ${answerText}`
      : `${prompt ? `The question was: ${prompt}\n` : ''}The correct answer is ${answerText}`;
  }

  if (prompt) {
    return locale === 'he'
      ? `נסה לחשוב כך: ${prompt}`
      : `Try thinking like this: ${prompt}`;
  }

  return locale === 'he'
    ? 'בוא נפרק את הבעיה לצעדים קטנים ונשתמש בעזרים הוויזואליים.'
    : 'Break the problem into small steps and use the visual aids to help.';
}
