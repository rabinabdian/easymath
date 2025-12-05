// src/components/NumberDisplay.tsx
import React from 'react';

interface NumberDisplayProps {
  value: number | string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * NumberDisplay - Ensures numbers are always displayed left-to-right
 * even in RTL contexts (Hebrew)
 * 
 * This component wraps numbers with proper LTR direction to prevent
 * them from being affected by surrounding RTL text.
 */
export function NumberDisplay({ value, className = '', children }: NumberDisplayProps) {
  const displayValue = children !== undefined ? children : value;
  
  return (
    <span 
      className={`number-ltr ${className}`}
      style={{ 
        direction: 'ltr',
        unicodeBidi: 'isolate',
        display: 'inline-block'
      }}
    >
      {displayValue}
    </span>
  );
}

/**
 * Helper function to wrap numbers in LTR direction
 * Useful for inline text where numbers appear
 */
export function formatNumber(value: number | string): string {
  const LRE = '\u202A'; // Left-to-Right Embedding
  const PDF = '\u202C'; // Pop Directional Formatting
  return `${LRE}${value}${PDF}`;
}
