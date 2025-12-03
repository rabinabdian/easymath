// src/components/TriangleDiagram.tsx
import type { Locale } from '../i18n';

interface TriangleDiagramProps {
  locale: Locale;
}

const SIDE_LABELS: Record<Locale, [string, string, string]> = {
  he: ['צלע 1', 'צלע 2', 'צלע 3'],
  en: ['Side 1', 'Side 2', 'Side 3']
};

const SIDE_COLORS = ['#f97316', '#10b981', '#3b82f6'];

/**
 * Simple instructional diagram that highlights the three sides of a triangle.
 * Used inside the "Let's understand why" auto-solve flow.
 */
export function TriangleDiagram({ locale }: TriangleDiagramProps) {
  const labels = SIDE_LABELS[locale] ?? SIDE_LABELS.he;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 220 180"
        role="img"
        aria-label={
          locale === 'he'
            ? 'איור של משולש עם שלוש צלעות מסומנות בצבעים שונים'
            : 'Triangle with three sides highlighted in different colors'
        }
        className="w-full max-w-xs drop-shadow-sm"
      >
        <defs>
          <linearGradient id="triangleFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
        </defs>
        <polygon
          points="40,150 180,150 110,35"
          fill="url(#triangleFill)"
          stroke="#78350f"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Bottom side */}
        <line
          x1="45"
          y1="155"
          x2="175"
          y2="155"
          stroke={SIDE_COLORS[0]}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text
          x="110"
          y="170"
          textAnchor="middle"
          fill={SIDE_COLORS[0]}
          fontSize="14"
          fontWeight="bold"
        >
          {labels[0]}
        </text>
        {/* Right side */}
        <line
          x1="175"
          y1="150"
          x2="110"
          y2="40"
          stroke={SIDE_COLORS[1]}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text
          x="168"
          y="95"
          transform="rotate(-58, 168, 95)"
          fill={SIDE_COLORS[1]}
          fontSize="14"
          fontWeight="bold"
        >
          {labels[1]}
        </text>
        {/* Left side */}
        <line
          x1="45"
          y1="150"
          x2="110"
          y2="40"
          stroke={SIDE_COLORS[2]}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text
          x="52"
          y="95"
          transform="rotate(58, 52, 95)"
          fill={SIDE_COLORS[2]}
          fontSize="14"
          fontWeight="bold"
        >
          {labels[2]}
        </text>
        {/* Vertices */}
        {[{ cx: 40, cy: 150 }, { cx: 180, cy: 150 }, { cx: 110, cy: 35 }].map((point, idx) => (
          <circle key={idx} cx={point.cx} cy={point.cy} r="5" fill="#78350f" />
        ))}
      </svg>
    </div>
  );
}
