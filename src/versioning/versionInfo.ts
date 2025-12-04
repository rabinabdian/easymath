// src/versioning/versionInfo.ts

export interface VersionMetadata {
  tag: string;
  releaseDate: string;
  summary: string;
  highlights: string[];
}

const CURRENT_VERSION_TAG = '0.5.0';

export const VERSION_HISTORY: VersionMetadata[] = [
  {
    tag: `v${CURRENT_VERSION_TAG}`,
    releaseDate: '2025-12-04',
    summary: 'ניהול גרסאות הופעל + תמונת תלמיד במסך הראשי',
    highlights: [
      'הצגת תמונת תלמיד מותאמת אישית בדף הבית',
      'תוית גרסה קבועה בכל המסכים',
    ],
  },
];

export const CURRENT_VERSION = VERSION_HISTORY[0];

export function formatVersionLabel(context?: string) {
  const baseLabel = `גרסה ${CURRENT_VERSION.tag}`;
  return context ? `${baseLabel} · ${context}` : baseLabel;
}
