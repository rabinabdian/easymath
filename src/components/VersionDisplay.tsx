// src/components/VersionDisplay.tsx
import { getVersionString } from '../utils/version';

interface VersionDisplayProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * VersionDisplay - Displays the application version
 * Can be used on any page to show version information
 */
export function VersionDisplay({ className = '', showLabel = true }: VersionDisplayProps) {
  const versionString = getVersionString();

  return (
    <div className={`version-display ${className}`} style={{
      fontSize: '0.75rem',
      color: '#6b7280',
      textAlign: 'center',
      padding: '0.5rem',
      fontFamily: 'monospace',
    }}>
      {showLabel && <span>גרסה: </span>}
      <span>{versionString}</span>
    </div>
  );
}
