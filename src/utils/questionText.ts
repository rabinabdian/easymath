// src/utils/questionText.ts
import type { Question } from '../types/questions';
import type { Locale } from '../i18n';
import { ensureLTRNumbers } from './textDirection';

export { wrapLTR } from './textDirection';

/**
 * Get question prompt text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionPrompt(q: Question, locale: Locale): string {
  const base =
    locale === 'he' ? q.promptHe || q.promptEn : q.promptEn || q.promptHe;
  if (!base) return '';
  return locale === 'he' ? ensureLTRNumbers(base) : base;
}

/**
 * Get question explanation text based on current locale
 * Falls back to the other language if the requested locale is not available
 */
export function getQuestionExplanation(
  q: Question,
  locale: Locale
): string | undefined {
  const base =
    locale === 'he' ? q.explanationHe || q.explanationEn : q.explanationEn || q.explanationHe;
  if (!base) return base;
  return locale === 'he' ? ensureLTRNumbers(base) : base;
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
  const format = (text: string): string =>
    isHebrew ? ensureLTRNumbers(text) : text;

  // Get the auto-solve explanation if available
  const autoSolveExplanation = isHebrew
    ? q.autoSolveExplanationHe
    : q.autoSolveExplanationEn;

  if (autoSolveExplanation) {
    if (includeAnswer) {
      const answerPrefix = isHebrew ? 'התשובה היא' : 'The answer is';
      return format(`${autoSolveExplanation} ${answerPrefix} ${q.answer}`);
    }
    return format(autoSolveExplanation);
  }

  // Fallback: Generate a simple explanation based on question type
  const answer = String(q.answer);

  if (includeAnswer) {
    if (isHebrew) {
      return format(`בוא נחשוב על זה ביחד. התשובה הנכונה היא ${answer}`);
    }
    return `Let's think about this together. The correct answer is ${answer}`;
  }

  if (isHebrew) {
    return 'קרא את השאלה בעיון ונסה להבין מה מבקשים ממך';
  }
  return 'Read the question carefully and try to understand what is being asked';
}
