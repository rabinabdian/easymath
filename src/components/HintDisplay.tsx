// src/components/HintDisplay.tsx
import type { VisualAid } from '../types/questions';
import { VisualAidsDisplay } from './VisualAidsDisplay';
import { InlineSpeaker } from './SpeakerButton';

interface HintDisplayProps {
  hintNumber: 1 | 2;
  hintText: string;
  visualAid?: VisualAid;
  onDismiss: () => void;
}

/**
 * HintDisplay - מציג רמזים הדרגתיים לתלמיד
 * רמז 1 - עדין ומעודד
 * רמז 2 - יותר ישיר עם הכוונה ברורה יותר
 */
export function HintDisplay({ hintNumber, hintText, visualAid, onDismiss }: HintDisplayProps) {
  // סגנון שונה לכל רמז
  const isFirstHint = hintNumber === 1;
  
  const containerClasses = isFirstHint
    ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-400';
  
  const iconContainerClasses = isFirstHint
    ? 'bg-amber-100'
    : 'bg-blue-100';
  
  const titleColor = isFirstHint
    ? 'text-amber-800'
    : 'text-blue-800';
  
  const hintEmoji = isFirstHint ? '💡' : '🔍';
  const title = isFirstHint ? 'רמז קטן!' : 'בוא נחשוב ביחד!';
  const subtitle = isFirstHint 
    ? 'אל תוותר! הנה משהו שיעזור לך...' 
    : 'אני פה לעזור! בוא נפתור את זה יחד...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className={`w-full max-w-lg rounded-3xl border-4 p-6 shadow-2xl ${containerClasses} animate-bounce-in`}>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconContainerClasses}`}>
              <span className="text-4xl">{hintEmoji}</span>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${titleColor}`}>{title}</h3>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>
          </div>
          <InlineSpeaker text={`${title}. ${hintText}`} />
        </div>

        {/* Hint Text */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="whitespace-pre-line text-xl leading-relaxed text-slate-700 text-right">
            {hintText}
          </p>
        </div>

        {/* Visual Aid */}
        {visualAid && (
          <div className="mb-4">
            <VisualAidsDisplay visualAids={[visualAid]} />
          </div>
        )}

        {/* Attempt Counter */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-slate-600">ניסיון</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-3 w-8 rounded-full ${
                  num <= hintNumber 
                    ? (isFirstHint ? 'bg-amber-400' : 'bg-blue-400')
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-600">מתוך 3</span>
        </div>

        {/* Encouragement Message */}
        <div className={`mb-4 rounded-xl p-3 text-center ${isFirstHint ? 'bg-amber-100' : 'bg-blue-100'}`}>
          <p className={`text-lg font-medium ${isFirstHint ? 'text-amber-800' : 'text-blue-800'}`}>
            {isFirstHint 
              ? '💪 אתה יכול! נסה שוב עם הרמז!' 
              : '🌟 כמעט הגעת! עוד ניסיון אחד!'}
          </p>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onDismiss}
          className={`w-full rounded-2xl px-6 py-4 text-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 ${
            isFirstHint 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
          }`}
        >
          <span className="mr-2">✨</span>
          הבנתי! בוא ננסה שוב!
        </button>
      </div>
    </div>
  );
}
