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

interface UnderstandingOptions {
  includeAnswer?: boolean;
}

/**
 * Build a narration text to help children understand the question
 * This creates a friendly, step-by-step explanation of what the question is asking
 */
export function buildUnderstandingNarration(
  q: Question,
  locale: Locale,
  options: UnderstandingOptions = {}
): string {
  const { includeAnswer = false } = options;
  const isHebrew = locale === 'he';

  // Get the auto-solve explanation if available
  const autoSolveExplanation = isHebrew
    ? q.autoSolveExplanationHe
    : q.autoSolveExplanationEn;

  if (autoSolveExplanation) {
    if (includeAnswer) {
      const answerPrefix = isHebrew ? 'התשובה היא' : 'The answer is';
      return `${autoSolveExplanation} ${answerPrefix} ${q.answer}`;
    }
    return autoSolveExplanation;
  }

  // Fallback: Generate a simple explanation based on question type
  const answer = String(q.answer);

  if (includeAnswer) {
    if (isHebrew) {
      return `בוא נחשוב על זה ביחד. התשובה הנכונה היא ${answer}`;
    }
    return `Let's think about this together. The correct answer is ${answer}`;
  }

  if (isHebrew) {
    return 'קרא את השאלה בעיון ונסה להבין מה מבקשים ממך';
  }
  return 'Read the question carefully and try to understand what is being asked';
}
