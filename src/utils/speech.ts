// src/utils/speech.ts
let isSpeaking = false;

export function speak(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  if (isSpeaking) {
    synth.cancel();
    isSpeaking = false;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "he-IL"; // עברית
  utter.rate = 0.95; // קצת יותר איטי
  utter.onstart = () => {
    isSpeaking = true;
  };
  utter.onend = () => {
    isSpeaking = false;
  };

  synth.speak(utter);
}
