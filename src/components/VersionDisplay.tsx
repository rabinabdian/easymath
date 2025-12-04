// src/components/VersionDisplay.tsx
import packageJson from '../../package.json';

interface VersionDisplayProps {
  className?: string;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

/**
 * VersionDisplay - Shows the current app version on all pages
 * Can be positioned in different corners of the screen
 */
export function VersionDisplay({ className = '', position = 'bottom-left' }: VersionDisplayProps) {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-left': 'fixed top-4 left-4',
  };

  return (
    <div 
      className={`${positionClasses[position]} ${className} px-3 py-1.5 bg-slate-800/70 text-white text-xs rounded-lg backdrop-blur-sm z-50`}
      style={{ direction: 'ltr' }}
    >
      v{packageJson.version}
    </div>
  );
}
