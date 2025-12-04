// src/components/VersionDisplay.tsx
import { getVersionString } from '../utils/version';

interface VersionDisplayProps {
  className?: string;
}

/**
 * VersionDisplay - Shows application version
 * Can be used in footer or header of any page
 */
export function VersionDisplay({ className = '' }: VersionDisplayProps) {
  return (
    <div className={`text-xs text-slate-500 ${className}`}>
      {getVersionString()}
    </div>
  );
}
