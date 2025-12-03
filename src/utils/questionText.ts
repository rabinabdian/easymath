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

interface UnderstandingNarrationOptions {
  includeAnswer?: boolean;
}

/**
 * Build a friendly narration that guides the student through the question.
 * Can optionally include the final answer when we need to auto-solve.
 */
export function buildUnderstandingNarration(
  question: Question,
  locale: Locale,
  options: UnderstandingNarrationOptions = {}
): string {
  const { includeAnswer = false } = options;
  const explanation =
    locale === 'he'
      ? question.autoSolveExplanationHe || question.explanationHe
      : question.autoSolveExplanationEn || question.explanationEn;

  const fallbackText =
    locale === 'he'
      ? 'נחשוב על הבעיה שלב אחרי שלב, ונשתמש בציור או בספירה כדי להבין.'
      : 'Let’s think through the problem step by step and use a drawing or counting to help.';

  const narrationParts: string[] = [];
  narrationParts.push((explanation && explanation.trim()) || fallbackText);

  if (includeAnswer) {
    const answerStr = String(question.answer);
    narrationParts.push(
      locale === 'he'
        ? `לכן התשובה הנכונה היא ${answerStr}.`
        : `Therefore, the correct answer is ${answerStr}.`
    );
  }

  return narrationParts.join('\n\n');
}
