import packageJson from "../package.json";

/**
 * Current application version, sourced from package.json.
 * Falls back to "0.0.0" if no version is defined.
 */
export const APP_VERSION: string = packageJson.version ?? "0.0.0";
