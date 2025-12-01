// src/utils/assets.ts

/**
 * Get the URL for an asset image based on its ID
 * @param assetId - The asset identifier (e.g., "numbers/apples_5")
 * @returns The full URL path to the asset, or null if no assetId provided
 * @example
 * getAssetUrl("numbers/apples_5") // returns "/assets/numbers/apples_5.png"
 */
export function getAssetUrl(assetId?: string | null): string | null {
  if (!assetId) return null;
  return `/assets/${assetId}.png`;
}
