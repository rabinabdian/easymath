// src/version.ts
// Centralized version management for EasyMath
// ─────────────────────────────────────────────────────────────────────────────
// When releasing a new version:
//   1. Bump CURRENT.version (semver: MAJOR.MINOR.PATCH)
//   2. Update CURRENT.date to today's date (YYYY-MM-DD)
//   3. Add a line to CHANGELOG
// ─────────────────────────────────────────────────────────────────────────────

export interface VersionEntry {
  version: string;
  date: string;       // ISO 8601 date: YYYY-MM-DD
  description: string;
}

/** Current application version */
export const CURRENT: VersionEntry = {
  version: '1.1.0',
  date: '2026-03-11',
  description: 'מודול הבנת לוח הכפל – 10 פרקים, גיליונות בונוס, לוח ריק למילוי',
};

/** Full changelog – newest first */
export const CHANGELOG: VersionEntry[] = [
  {
    version: '1.1.0',
    date: '2026-03-11',
    description: 'מודול הבנת לוח הכפל – 10 פרקים פדגוגיים לכיתות א׳–ג׳, גיליונות צביעה, פאזל ובינגו',
  },
  {
    version: '1.0.0',
    date: '2025-11-29',
    description: 'גרסה ראשונה – תרגול ספירה, לוח שנה, ממשק מורה, מצב תלמיד',
  },
];

/** Short display string, e.g. "v1.1.0 | 11.03.2026" */
export function versionLabel(): string {
  const [year, month, day] = CURRENT.date.split('-');
  return `v${CURRENT.version} | ${day}.${month}.${year}`;
}
