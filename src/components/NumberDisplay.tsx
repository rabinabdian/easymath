// src/components/NumberDisplay.tsx
import React from 'react';

interface NumberDisplayProps {
  value: number | string;
  className?: string;
}

/**
 * NumberDisplay - Component to display numbers in LTR direction
 * Ensures numbers are always displayed left-to-right regardless of parent RTL context
 */
export function NumberDisplay({ value, className = '' }: NumberDisplayProps) {
  return (
    <span className={`number-ltr ${className}`} dir="ltr">
      {value}
    </span>
  );
}

/**
 * Utility function to wrap numbers in LTR span
 * Use this for inline numbers in text
 */
export function wrapNumber(value: number | string): React.ReactNode {
  return <span className="number-ltr" dir="ltr">{value}</span>;
}
