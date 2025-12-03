// src/components/SpeakerButton.tsx
import { useState, useCallback } from 'react';
import { speak, stopSpeaking } from '../utils/speech';

interface SpeakerButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'accent';
  label?: string;
  showLabel?: boolean;
  className?: string;
}

/**
 * SpeakerButton - Interactive button that plays text-to-speech
 * Designed for children - large, colorful, with visual feedback
 */
export function SpeakerButton({
  text,
  size = 'medium',
  variant = 'default',
  label,
  showLabel = true,
  className = ''
}: SpeakerButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speak(text, () => {
      setIsSpeaking(false);
    });
  }, [text, isSpeaking]);

  const sizeClasses = {
    small: 'p-2 text-2xl',
    medium: 'p-3 text-4xl',
    large: 'p-4 text-5xl'
  };

  const variantClasses = {
    default: 'bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-400',
    primary: 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg',
    accent: 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg'
  };

  const speakingLabel = 'מקריא...';
  const defaultLabel = label || 'לחץ לשמיעה';

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`
        flex flex-col items-center gap-2 rounded-2xl transition-all transform
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isSpeaking ? 'scale-105 ring-4 ring-blue-300 animate-pulse' : 'hover:scale-105'}
        ${className}
      `}
      aria-label={isSpeaking ? speakingLabel : defaultLabel}
    >
      <span className={`transition-transform ${isSpeaking ? 'animate-bounce' : ''}`}>
        {isSpeaking ? '🔊' : '🔈'}
      </span>
      {showLabel && (
        <span className={`text-sm font-medium ${variant === 'default' ? 'text-slate-700' : 'text-white'}`}>
          {isSpeaking ? speakingLabel : defaultLabel}
        </span>
      )}
    </button>
  );
}

/**
 * Inline speaker icon for use within text sections
 * Compact design for adding to cards/sections
 */
interface InlineSpeakerProps {
  text: string;
  className?: string;
}

export function InlineSpeaker({ text, className = '' }: InlineSpeakerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speak(text, () => {
      setIsSpeaking(false);
    });
  }, [text, isSpeaking]);

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`
        inline-flex items-center justify-center w-10 h-10 rounded-full
        bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200
        border-2 border-blue-300 hover:border-blue-400
        transition-all transform hover:scale-110
        ${isSpeaking ? 'ring-2 ring-blue-400 animate-pulse' : ''}
        ${className}
      `}
      aria-label={isSpeaking ? 'מקריא...' : 'לחץ לשמיעה'}
      title={isSpeaking ? 'מקריא...' : 'לחץ לשמיעה'}
    >
      <span className={`text-xl ${isSpeaking ? 'animate-bounce' : ''}`}>
        {isSpeaking ? '🔊' : '🔈'}
      </span>
    </button>
  );
}
