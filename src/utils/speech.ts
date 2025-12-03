// src/utils/speech.ts
let isSpeaking = false;
let selectedVoice: SpeechSynthesisVoice | null = null;

function initVoice() {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  if (!voices || voices.length === 0) {
    // לפעמים הקולות נטענים קצת באיחור
    synth.onvoiceschanged = () => {
      const updatedVoices = synth.getVoices();
      selectedVoice =
        updatedVoices.find((v) => v.lang === "he-IL") || updatedVoices[0] || null;
    };
    return;
  }

  // ננסה למצוא קול עברית, מתאים לסיפור
  selectedVoice =
    voices.find((v) => v.lang === "he-IL") ||
    voices.find((v) => v.lang.startsWith("he")) ||
    voices[0] ||
    null;
}

/**
 * Speak text using the browser's speech synthesis
 * @param text - The text to speak
 * @param onEnd - Optional callback when speech ends
 */
export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  if (!selectedVoice) {
    initVoice();
  }

  if (isSpeaking) {
    synth.cancel();
    isSpeaking = false;
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.lang = "he-IL";
  utter.voice = selectedVoice || null;

  // קול יותר רך / מספר סיפורים:
  utter.rate = 0.9;   // קצת יותר לאט
  utter.pitch = 1.1;  // טון מעט גבוה
  utter.volume = 1.0; // ווליום מלא, ההורה תמיד יכול להנמיך מהרמקול

  utter.onstart = () => {
    isSpeaking = true;
  };
  utter.onend = () => {
    isSpeaking = false;
    onEnd?.();
  };
  utter.onerror = () => {
    isSpeaking = false;
    onEnd?.();
  };

  synth.speak(utter);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  isSpeaking = false;
}

/**
 * Check if currently speaking
 */
export function isCurrentlySpeaking(): boolean {
  return isSpeaking;
}
