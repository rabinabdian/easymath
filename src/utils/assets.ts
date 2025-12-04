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

  // Support absolute URLs (e.g. https://example.com/image.png)
  if (assetId.startsWith('http://') || assetId.startsWith('https://')) {
    return assetId;
  }

  // Allow callers to specify an explicit file extension (like ".svg")
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(assetId);
  const normalizedPath = hasExtension ? assetId : `${assetId}.png`;

  // Ensure exactly one leading slash
  return normalizedPath.startsWith('/')
    ? normalizedPath
    : `/assets/${normalizedPath}`;
}
