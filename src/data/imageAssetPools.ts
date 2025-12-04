// src/data/imageAssetPools.ts

/**
 * Asset pools for automatic image assignment to questions.
 * Each assetId corresponds to a file in public/assets/ (with .png extension).
 *
 * When adding new images to public/assets, add their IDs here so they can be
 * automatically assigned to relevant questions based on topic/subtopic.
 */

export const ASSET_POOLS = {
  // Numbers - generic counting exercises
  numbers_generic: [
    'numbers/apples_5',
    'numbers/apples_10',
    'numbers/balloons_7',
    'numbers/butterflies_9',
    'numbers/balls_colorful',
    'numbers/toys_block_set',
  ],

  // Numbers - matching quantity to number
  numbers_match: [
    'numbers/cookies_plates',
    'numbers/pencils_groups',
    'match/stars_7',
    'match/hearts_4',
    'match/clouds_9',
  ],

  // Numbers - ten frame exercises
  numbers_tenframe: [
    'numbers/tenframe_7',
    'numbers/tenframe_4_blue_3_green',
    'numbers/tenframe_9',
  ],

  // School items
  school_items: [
    'school/pencils_cup',
    'school/crayons_box',
    'school/notebook',
    'school/bag',
    'school/scissors',
  ],

  // Addition - general
  addition_generic: [
    'addition/balloons_group_7',
    'addition/balloons_group_10',
    'kids/kids_with_balloons',
  ],

  // Addition - ten frame
  addition_tenframe: [
    'addition/tenframe_2',
  ],

  // Addition - dominoes
  addition_domino: [
    'addition/domino_3_5',
    'addition/domino_4_4',
  ],

  // Money and shopping
  money_shop: [
    'money/coins_stack',
    'money/shop_shelf',
    'school/bag',
    'school/scissors',
  ],

  // Subtraction - ten frame
  subtraction_tenframe: [
    'subtraction/tenframe_9_minus_4',
    'subtraction/tenframe_6_minus_2',
  ],

  // Even and odd numbers
  even_odd: [
    'even_odd/socks_pairs',
    'even_odd/dots_grid',
  ],

  // Geometry - basic shapes
  geometry_shapes: [
    'geometry/mix_shapes_1.svg',
    'geometry/triangles_4.svg',
    'geometry/basic_shapes.svg',
    'geometry/shape_patterns.svg',
  ],

  // Geometry - symmetry
  geometry_symmetry: [
    'geometry/heart_midline.svg',
    'geometry/arrow_right.svg',
    'geometry/half_star.svg',
    'geometry/symmetry_choices.svg',
    'geometry/half_menorah.svg',
  ],

  // Holiday - Hanukkah
  holiday_hanukkah: [
    'holiday/dreidel',
    'holiday/dreidel_candles',
    'holiday/menorah_candles',
  ],
} as const;

export type AssetPoolKey = keyof typeof ASSET_POOLS;
