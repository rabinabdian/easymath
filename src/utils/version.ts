// src/utils/version.ts
/**
 * Application version information
 * This file is used to manage and display the application version
 */

// Import version from package.json at build time
// In a real app, this would be injected by the build process
// For now, we'll define it here and sync with package.json
export const APP_VERSION = '1.0.0';

/**
 * Get formatted version string
 */
export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

/**
 * Get version info object
 */
export function getVersionInfo() {
  return {
    version: APP_VERSION,
    versionString: getVersionString(),
    buildDate: new Date().toLocaleDateString('he-IL'),
  };
}
