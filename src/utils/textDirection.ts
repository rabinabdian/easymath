// src/utils/textDirection.ts
/**
 * Utilities for handling text direction inside RTL layouts.
 * Specifically focuses on making sure numeric/mathematical segments
 * always render left-to-right even when surrounded by Hebrew text.
 */

const LRE = '\u202A'; // Left-to-Right Embedding
const PDF = '\u202C'; // Pop Directional Formatting
const LRI = '\u2066'; // Left-to-Right Isolate
const PDI = '\u2069'; // Pop Directional Isolate

/**
 * Matches numeric or math-oriented segments so they can be isolated.
 * Starts with a digit to avoid capturing Hebrew words and then allows
 * common math characters, punctuation, whitespace and underscore placeholders.
 */
const LTR_SEGMENT_REGEX =
  /\d[\d\s.,+\-–—*/=×÷:;!?%()_{}\[\]<>|°•'"׳״₪\\/?…־]*\d*/gu;

/**
 * Wraps the provided text with explicit LTR embedding characters.
 */
export function wrapLTR(text: string): string {
  return `${LRE}${text}${PDF}`;
}

function isAlreadyIsolated(fullText: string, start: number, length: number): boolean {
  const prevChar = start > 0 ? fullText[start - 1] : undefined;
  const nextChar = fullText[start + length];
  return (
    (prevChar === LRE && nextChar === PDF) ||
    (prevChar === LRI && nextChar === PDI)
  );
}

/**
 * Ensures every numeric/mathematical segment inside the text is wrapped
 * with explicit LTR markers so that digits always flow left-to-right.
 *
 * Safe to call multiple times – already isolated segments are skipped.
 */
export function ensureLTRNumbers(text: string): string {
  if (!text) return text;

  return text.replace(
    LTR_SEGMENT_REGEX,
    (segment, ...args: (string | number)[]) => {
      const offset = args[args.length - 2] as number;
      const fullText = args[args.length - 1] as string;

      if (isAlreadyIsolated(fullText, offset, segment.length)) {
        return segment;
      }

      return wrapLTR(segment);
    }
  );
}
