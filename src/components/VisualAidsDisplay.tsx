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
 */
export function VisualAidsDisplay({ visualAids, className = '' }: VisualAidsDisplayProps) {
  if (!visualAids || visualAids.length === 0) {
    return null;
  }

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

  // Icon name mapping for audio descriptions
  const iconNameMap: Record<string, string> = {
    star: 'כוכב',
    heart: 'לב',
    apple: 'תפוח',
    ball: 'כדור',
    book: 'ספר',
    pencil: 'עיפרון',
    flower: 'פרח',
    tree: 'עץ',
    sun: 'שמש',
    moon: 'ירח',
    check: 'סימן וי',
    cross: 'סימן איקס',
  };

  // Icon emoji mapping for display
  const iconEmojiMap: Record<string, string> = {
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

  // Shape name mapping
  const shapeNameMap: Record<string, string> = {
    circle: 'עיגול',
    triangle: 'משולש',
    square: 'ריבוע',
    rectangle: 'מלבן',
  };

  // Helper function to pluralize Hebrew nouns
  const pluralize = (word: string, count: number): string => {
    if (count === 1) return word;
    const pluralMap: Record<string, string> = {
      'כוכב': 'כוכבים',
      'לב': 'לבבות',
      'תפוח': 'תפוחים',
      'כדור': 'כדורים',
      'ספר': 'ספרים',
      'עיפרון': 'עפרונות',
      'פרח': 'פרחים',
      'עץ': 'עצים',
      'שמש': 'שמשות',
      'ירח': 'ירחים',
      'עיגול': 'עיגולים',
      'משולש': 'משולשים',
      'ריבוע': 'ריבועים',
      'מלבן': 'מלבנים',
    };
    return pluralMap[word] || word + 'ים';
  };

  // Generate audio description for visual aids
  const generateAudioDescription = (aid: VisualAid): string => {
    const count = aid.count || 1;
    
    switch (aid.type) {
      case 'emoji':
        if (count === 1) {
          return `יש כאן ${aid.value}`;
        }
        return `יש כאן ${count} פריטים של ${aid.value}`;
      
      case 'icon':
        const iconName = iconNameMap[aid.value] || aid.value;
        const pluralIconName = pluralize(iconName, count);
        return `יש כאן ${count === 1 ? iconName : count + ' ' + pluralIconName}`;
      
      case 'shape':
        const shapeName = shapeNameMap[aid.value] || aid.value;
        const pluralShapeName = pluralize(shapeName, count);
        return `יש כאן ${count === 1 ? shapeName : count + ' ' + pluralShapeName}`;
      
      case 'image':
        return `יש כאן תמונה`;
      
      default:
        return '';
    }
  };

  const getAllAudioDescription = (): string => {
    const descriptions = visualAids.map(aid => generateAudioDescription(aid));
    return descriptions.filter(d => d).join('. ');
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
        const icon = iconEmojiMap[aid.value] || aid.value;
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

  const audioDescription = getAllAudioDescription();

  return (
    <div className={`flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 ${className}`}>
      {audioDescription && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-slate-700">עזרים ויזואליים</span>
          <InlineSpeaker text={audioDescription} />
        </div>
      )}
      {visualAids.map((aid, index) => renderVisualAid(aid, index))}
    </div>
  );
}
