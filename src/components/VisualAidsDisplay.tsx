// src/components/VisualAidsDisplay.tsx
import type { VisualAid } from '../types/questions';

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
            {Array.from({ length: count }).map((_, i) => {
              const size = aid.size === 'large' ? '80px' : aid.size === 'small' ? '40px' : '60px';
              const getClipPath = () => {
                switch (aid.value) {
                  case 'triangle':
                    return 'polygon(50% 0%, 0% 100%, 100% 100%)';
                  case 'hexagon':
                    return 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)';
                  default:
                    return undefined;
                }
              };
              const getBorderRadius = () => {
                if (aid.value === 'circle') return '50%';
                if (aid.value === 'square') return '8px';
                return '0';
              };
              
              return (
                <div
                  key={i}
                  className="transition-transform hover:scale-110"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: aid.color || '#3b82f6',
                    borderRadius: getBorderRadius(),
                    clipPath: getClipPath(),
                  }}
                />
              );
            })}
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
      {visualAids.map((aid, index) => renderVisualAid(aid, index))}
    </div>
  );
}
