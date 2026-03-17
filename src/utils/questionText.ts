// src/utils/questionText.ts
import type { Question } from '../types/questions';
import type { Locale } from '../i18n';
import { ensureLTRNumbers } from './textDirection';

export { wrapLTR } from './textDirection';

/**
 * Get question prompt text - always in Hebrew
 */
export function getQuestionPrompt(q: Question, _locale: Locale): string {
  // קריאות ושאלות תמיד בעברית בלבד
  const base = q.promptHe || q.promptEn;
  if (!base) return '';
  return ensureLTRNumbers(base);
}

/**
 * Get question explanation text - always in Hebrew
 */
export function getQuestionExplanation(
  q: Question,
  _locale: Locale
): string | undefined {
  // הסברים תמיד בעברית בלבד
  const base = q.explanationHe || q.explanationEn;
  if (!base) return base;
  return ensureLTRNumbers(base);
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
  _locale: Locale,
  options: UnderstandingOptions = {}
): string {
  // קריאה קולית תמיד בעברית בלבד
  const { includeAnswer = false } = options;

  const autoSolveExplanation = q.autoSolveExplanationHe;

  if (autoSolveExplanation) {
    if (includeAnswer) {
      return ensureLTRNumbers(`${autoSolveExplanation} התשובה היא ${q.answer}`);
    }
    return ensureLTRNumbers(autoSolveExplanation);
  }

  const answer = String(q.answer);

  if (includeAnswer) {
    return ensureLTRNumbers(`בוא נחשוב על זה ביחד. התשובה הנכונה היא ${answer}`);
  }

  return 'קרא את השאלה בעיון ונסה להבין מה מבקשים ממך';
}
