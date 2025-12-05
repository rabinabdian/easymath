/**
 * Utility helpers for handling bidirectional (BiDi) text.
 * Wraps numeric or Latin text with LTR isolate markers so it isn't reordered
 * when rendered inside RTL paragraphs.
 */
const LTR_ISOLATE = '\u2066'; // Unicode: Left-to-Right Isolate
const PDI = '\u2069'; // Unicode: Pop Directional Isolate
const HEBREW_RANGE = /[\u0590-\u05FF]/;

export function ensureLtr(value: string | number): string {
  const str = typeof value === 'number' ? String(value) : value;
  return `${LTR_ISOLATE}${str}${PDI}`;
}

export function ensureLtrIfNoHebrew(value: string | number): string {
  const str = typeof value === 'number' ? String(value) : value;
  return HEBREW_RANGE.test(str) ? str : ensureLtr(str);
}
