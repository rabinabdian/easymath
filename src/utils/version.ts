// src/utils/version.ts

/**
 * Application version information
 * This file manages the version number and build information
 */
export const APP_VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

/**
 * Get formatted version string for display
 */
export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

/**
 * Get full version info including build date
 */
export function getFullVersionInfo(): string {
  return `גרסה ${APP_VERSION} (${BUILD_DATE})`;
}
