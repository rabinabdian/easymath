#!/usr/bin/env node

/**
 * Download all image assets from imageAssets.json to public/assets
 * Usage: node scripts/downloadAssets.mjs
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the assets JSON
const assetsPath = path.join(__dirname, "..", "src", "imageAssets.json");
const assets = JSON.parse(fs.readFileSync(assetsPath, "utf-8"));

// Output directory
const outBase = path.join(__dirname, "..", "public", "assets");

/**
 * Download a file from URL to filepath
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

      fileStream.on("error", (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if error
        reject(err);
      });
    }).on("error", reject);
  });
}

/**
 * Download a single asset
 */
async function downloadAsset(asset) {
  const url = asset.downloadUrl || asset.sourcePageUrl;

  if (!url) {
    console.warn(`⚠️  No URL for asset: ${asset.assetId}`);
    return { success: false, assetId: asset.assetId, error: "No URL" };
  }

  // Skip if not a direct image URL
  if (!url.match(/\.(png|jpg|jpeg|svg|gif)(\?.*)?$/i)) {
    console.warn(`⚠️  Skipping (not direct image URL): ${asset.assetId}`);
    return { success: false, assetId: asset.assetId, error: "Not direct URL" };
  }

  // Determine file extension from URL
  const urlExt = url.match(/\.(png|jpg|jpeg|svg|gif)/i)?.[1] || "png";
  const targetPath = path.join(outBase, asset.assetId + "." + urlExt);

  // Create directory if needed
  await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });

  try {
    console.log(`📥 Downloading: ${asset.assetId}`);
    console.log(`   from: ${url}`);

    await downloadFile(url, targetPath);

    console.log(`✅ Saved to: ${targetPath}\n`);
    return { success: true, assetId: asset.assetId };
  } catch (err) {
    console.error(`❌ Error downloading ${asset.assetId}:`, err.message, "\n");
    return { success: false, assetId: asset.assetId, error: err.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🎨 Starting download of image assets...\n");
  console.log(`📁 Output directory: ${outBase}\n`);
  console.log(`📦 Total assets to download: ${assets.length}\n`);

  const results = [];

  for (const asset of assets) {
    const result = await downloadAsset(asset);
    results.push(result);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Download Summary:");
  console.log("=".repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\n❌ Failed downloads:");
    failed.forEach(f => {
      console.log(`   - ${f.assetId}: ${f.error}`);
    });
  }

  console.log("\n✨ Done!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
