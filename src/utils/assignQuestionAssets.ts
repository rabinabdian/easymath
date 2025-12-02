// src/utils/assignQuestionAssets.ts
import type { Question } from '../types/questions';
import { ASSET_POOLS, type AssetPoolKey } from '../data/imageAssetPools';

/**
 * Creates a deterministic hash from a string to consistently pick the same
 * asset from a pool for a given question ID.
 */
function hashStringToIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

/**
 * Determines which asset pool should be used for a given question based on
 * its topic and subtopic.
 *
 * @param q - The question to analyze
 * @returns The asset pool key, or null if no suitable pool exists or if the question already has an assetId
 */
function poolForQuestion(q: Question): AssetPoolKey | null {
  // If the question already has a manually assigned assetId, don't override it
  if (q.assetId) return null;

  // NUMBERS topic
  if (q.topic === 'numbers') {
    // Ten frame exercises
    if (q.subtopic && /לוח 10/.test(q.subtopic)) {
      return 'numbers_tenframe';
    }
    // Matching exercises
    if (q.subtopic && /התאמ|התאם|קשר/.test(q.subtopic)) {
      return 'numbers_match';
    }
    // Generic counting
    if (q.subtopic && /ספירה/.test(q.subtopic)) {
      return 'numbers_generic';
    }
    // Default for numbers
    return 'numbers_generic';
  }

  // ADDITION topic
  if (q.topic === 'addition') {
    // Money/shopping problems
    if (q.subtopic && /כסף|חנות|קנייה/.test(q.subtopic)) {
      return 'money_shop';
    }
    // Ten frame exercises
    if (q.subtopic && /לוח 10|השלמה ל-10/.test(q.subtopic)) {
      return 'addition_tenframe';
    }
    // Domino exercises
    if (q.subtopic && /דומינו/.test(q.subtopic)) {
      return 'addition_domino';
    }
    // Default for addition - balloons/kids
    return 'addition_generic';
  }

  // SUBTRACTION topic
  if (q.topic === 'subtraction') {
    // Money/shopping problems
    if (q.subtopic && /כסף|חנות|קנייה/.test(q.subtopic)) {
      return 'money_shop';
    }
    // Ten frame exercises
    if (q.subtopic && /לוח 10/.test(q.subtopic)) {
      return 'subtraction_tenframe';
    }
    // Default for subtraction - can use addition balloons (disappearing balloons)
    return 'addition_generic';
  }

  // EVEN/ODD topic
  if (q.topic === 'evenOdd') {
    return 'even_odd';
  }

  // GEOMETRY topic
  if (q.topic === 'geometry') {
    // Symmetry/reflection exercises
    if (q.subtopic && /סימטריה|שיקוף/.test(q.subtopic)) {
      return 'geometry_symmetry';
    }
    // Default for geometry - basic shapes
    return 'geometry_shapes';
  }

  // No suitable pool found
  return null;
}

/**
 * Takes an array of questions and returns a new array where each question
 * without an assetId gets automatically assigned one from the appropriate pool.
 *
 * Questions with existing assetId values are left unchanged.
 * The assignment is deterministic based on the question ID.
 *
 * @param baseQuestions - Array of questions to process
 * @returns New array with assetIds assigned
 */
export function assignAssetsToQuestions(baseQuestions: Question[]): Question[] {
  return baseQuestions.map((q) => {
    // If question already has an asset, keep it
    if (q.assetId) {
      return q;
    }

    // Determine which pool to use
    const poolKey = poolForQuestion(q);
    if (!poolKey) return q;

    const pool = ASSET_POOLS[poolKey];
    if (!pool) return q;

    // Pick an asset deterministically based on question ID
    const idx = hashStringToIndex(q.id, pool.length);

    return {
      ...q,
      assetId: pool[idx],
    };
  });
}
