// src/components/VisualAidsDisplay.tsx
import type { VisualAid } from '../types/questions';
import { InlineSpeaker } from './SpeakerButton';

interface VisualAidsDisplayProps {
  visualAids: VisualAid[];
  className?: string;
}

/**
 * VisualAidsDisplay - Shows visual aids (emojis, shapes, icons) to help children understand
 * Designed for children with learning disabilities - large, clear, colorful
 * Now includes audio explanation with speaker icon!
 */
export function VisualAidsDisplay({ visualAids, className = '' }: VisualAidsDisplayProps) {
  if (!visualAids || visualAids.length === 0) {
    return null;
  }

  // Generate audio text for visual aids
  const generateAudioText = (): string => {
    const parts: string[] = [];
    
    visualAids.forEach((aid, index) => {
      const count = aid.count || 1;
      
      switch (aid.type) {
        case 'emoji':
          // For emojis, describe what we see
          const emojiDesc = count === 1 ? 'פריט אחד' : `${count} פריטים`;
          parts.push(`יש לנו ${emojiDesc}`);
          break;
        case 'shape':
          const shapeNames: Record<string, { singular: string; plural: string }> = {
            circle: { singular: 'עיגול אחד', plural: 'עיגולים' },
            square: { singular: 'ריבוע אחד', plural: 'ריבועים' },
            triangle: { singular: 'משולש אחד', plural: 'משולשים' },
            rectangle: { singular: 'מלבן אחד', plural: 'מלבנים' }
          };
          const shapeInfo = shapeNames[aid.value] || { singular: 'צורה אחת', plural: 'צורות' };
          const shapeName = count === 1 ? shapeInfo.singular : `${count} ${shapeInfo.plural}`;
          parts.push(`יש לנו ${shapeName}`);
          break;
        case 'icon':
          const iconNames: Record<string, { singular: string; plural: string }> = {
            star: { singular: 'כוכב אחד', plural: 'כוכבים' },
            heart: { singular: 'לב אחד', plural: 'לבבות' },
            apple: { singular: 'תפוח אחד', plural: 'תפוחים' },
            ball: { singular: 'כדור אחד', plural: 'כדורים' },
            book: { singular: 'ספר אחד', plural: 'ספרים' },
            pencil: { singular: 'עפרון אחד', plural: 'עפרונות' },
            flower: { singular: 'פרח אחד', plural: 'פרחים' },
            tree: { singular: 'עץ אחד', plural: 'עצים' },
            sun: { singular: 'שמש אחת', plural: 'שמשות' },
            moon: { singular: 'ירח אחד', plural: 'ירחים' }
          };
          const iconInfo = iconNames[aid.value] || { singular: 'פריט אחד', plural: 'פריטים' };
          const iconName = count === 1 ? iconInfo.singular : `${count} ${iconInfo.plural}`;
          parts.push(`יש לנו ${iconName}`);
          break;
        case 'image':
          const imageDesc = count === 1 ? 'תמונה אחת' : `${count} תמונות`;
          parts.push(`יש לנו ${imageDesc}`);
          break;
      }
    });
    
    return parts.length > 0 
      ? `בואו נסתכל על האלמנטים הויזואליים. ${parts.join('. ')}.`
      : 'בואו נסתכל על האלמנטים הויזואליים.';
  };

  const audioText = generateAudioText();

  const getSizeClass = (size?: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'text-3xl';
      case 'large':
        return 'text-7xl';
      case 'medium':
      default:
        return 'text-5xl';
    }
  };

  const renderVisualAid = (aid: VisualAid, index: number) => {
    const sizeClass = getSizeClass(aid.size);
    const count = aid.count || 1;

    switch (aid.type) {
      case 'emoji':
        return (
          <div key={index} className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} className={`${sizeClass} transition-transform hover:scale-110`}>
                {aid.value}
              </span>
            ))}
          </div>
        );

      case 'shape':
        return (
          <div key={index} className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="transition-transform hover:scale-110"
                style={{
                  width: aid.size === 'large' ? '80px' : aid.size === 'small' ? '40px' : '60px',
                  height: aid.size === 'large' ? '80px' : aid.size === 'small' ? '40px' : '60px',
                  backgroundColor: aid.color || '#3b82f6',
                  borderRadius: aid.value === 'circle' ? '50%' : aid.value === 'triangle' ? '0' : '8px',
                  clipPath: aid.value === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                }}
              />
            ))}
          </div>
        );

      case 'icon':
        // Icon mapping - you can extend this
        const iconMap: Record<string, string> = {
          star: '⭐',
          heart: '❤️',
          apple: '🍎',
          ball: '⚽',
          book: '📚',
          pencil: '✏️',
          flower: '🌸',
          tree: '🌳',
          sun: '☀️',
          moon: '🌙',
          check: '✅',
          cross: '❌',
        };
        const icon = iconMap[aid.value] || aid.value;
        return (
          <div key={index} className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <span key={i} className={`${sizeClass} transition-transform hover:scale-110`}>
                {icon}
              </span>
            ))}
          </div>
        );

      case 'image':
        return (
          <div key={index} className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: count }).map((_, i) => (
              <img
                key={i}
                src={aid.value}
                alt=""
                className={`object-contain transition-transform hover:scale-110 ${
                  aid.size === 'large' ? 'h-24' : aid.size === 'small' ? 'h-12' : 'h-16'
                }`}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👁️</span>
          <h4 className="text-lg font-bold text-slate-700">אלמנטים ויזואליים</h4>
        </div>
        <InlineSpeaker text={audioText} />
      </div>
      {visualAids.map((aid, index) => renderVisualAid(aid, index))}
    </div>
  );
}
