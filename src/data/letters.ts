// src/data/letters.ts
// All 22 Hebrew letters with names and example words for the letter study section

export interface HebrewLetter {
  letter: string;       // primary printed form
  finalForm?: string;   // sofit (final) form if exists
  nameHe: string;       // letter name in Hebrew (with nikud)
  examples: { word: string; emoji: string }[];
  color: string;        // accent color for this letter's card
}

export const HEBREW_LETTERS: HebrewLetter[] = [
  {
    letter: 'א',
    nameHe: 'אָלֶף',
    examples: [
      { word: 'אֲרִיָה', emoji: '🦁' },
      { word: 'אֲבַטִּיחַ', emoji: '🍉' },
    ],
    color: '#4F8EF7',
  },
  {
    letter: 'ב',
    nameHe: 'בֵּית',
    examples: [
      { word: 'בַּלּוֹן', emoji: '🎈' },
      { word: 'בַּיִת', emoji: '🏠' },
    ],
    color: '#FF6B6B',
  },
  {
    letter: 'ג',
    nameHe: 'גִּימֶל',
    examples: [
      { word: 'גָּמָל', emoji: '🐪' },
      { word: 'גְּלִידָה', emoji: '🍦' },
    ],
    color: '#48BB78',
  },
  {
    letter: 'ד',
    nameHe: 'דָּלֶת',
    examples: [
      { word: 'דָּג', emoji: '🐟' },
      { word: 'דֶּגֶל', emoji: '🏳️' },
    ],
    color: '#ED8936',
  },
  {
    letter: 'ה',
    nameHe: 'הֵא',
    examples: [
      { word: 'הַר', emoji: '⛰️' },
      { word: 'הֶלִיקוֹפְּטֶר', emoji: '🚁' },
    ],
    color: '#9F7AEA',
  },
  {
    letter: 'ו',
    nameHe: 'וָו',
    examples: [
      { word: 'וֶרֶד', emoji: '🌹' },
      { word: 'וִילוֹן', emoji: '🪟' },
    ],
    color: '#F687B3',
  },
  {
    letter: 'ז',
    nameHe: 'זַיִן',
    examples: [
      { word: 'זַיִת', emoji: '🫒' },
      { word: 'זֶבְּרָה', emoji: '🦓' },
    ],
    color: '#38B2AC',
  },
  {
    letter: 'ח',
    nameHe: 'חֵית',
    examples: [
      { word: 'חָלָב', emoji: '🥛' },
      { word: 'חָתוּל', emoji: '🐱' },
    ],
    color: '#667EEA',
  },
  {
    letter: 'ט',
    nameHe: 'טֵית',
    examples: [
      { word: 'טֶלֶפוֹן', emoji: '📞' },
      { word: 'טַבָּח', emoji: '👨‍🍳' },
    ],
    color: '#F6AD55',
  },
  {
    letter: 'י',
    nameHe: 'יוֹד',
    examples: [
      { word: 'יַד', emoji: '✋' },
      { word: 'יַלְדָּה', emoji: '👧' },
    ],
    color: '#68D391',
  },
  {
    letter: 'כ',
    finalForm: 'ך',
    nameHe: 'כַּף',
    examples: [
      { word: 'כֶּלֶב', emoji: '🐕' },
      { word: 'כּוֹכָב', emoji: '⭐' },
    ],
    color: '#FC8181',
  },
  {
    letter: 'ל',
    nameHe: 'לָמֶד',
    examples: [
      { word: 'לֶחֶם', emoji: '🍞' },
      { word: 'לִימוֹן', emoji: '🍋' },
    ],
    color: '#4299E1',
  },
  {
    letter: 'מ',
    finalForm: 'ם',
    nameHe: 'מֵם',
    examples: [
      { word: 'מַחְשֵׁב', emoji: '💻' },
      { word: 'מַיִם', emoji: '💧' },
    ],
    color: '#B794F4',
  },
  {
    letter: 'נ',
    finalForm: 'ן',
    nameHe: 'נוּן',
    examples: [
      { word: 'נַעַל', emoji: '👟' },
      { word: 'נֵר', emoji: '🕯️' },
    ],
    color: '#F6E05E',
  },
  {
    letter: 'ס',
    nameHe: 'סָמֶך',
    examples: [
      { word: 'סֵפֶר', emoji: '📕' },
      { word: 'סַנְדָּל', emoji: '🩴' },
    ],
    color: '#76E4F7',
  },
  {
    letter: 'ע',
    nameHe: 'עַיִן',
    examples: [
      { word: 'עֻגָּה', emoji: '🎂' },
      { word: 'עַגְבָנִיָּה', emoji: '🍅' },
    ],
    color: '#F56565',
  },
  {
    letter: 'פ',
    finalForm: 'ף',
    nameHe: 'פֵּא',
    examples: [
      { word: 'פִּיל', emoji: '🐘' },
      { word: 'פֶּרַח', emoji: '🌸' },
    ],
    color: '#68D391',
  },
  {
    letter: 'צ',
    finalForm: 'ץ',
    nameHe: 'צָדִי',
    examples: [
      { word: 'צָב', emoji: '🐢' },
      { word: 'צִפּוֹר', emoji: '🐦' },
    ],
    color: '#F6AD55',
  },
  {
    letter: 'ק',
    nameHe: 'קוֹף',
    examples: [
      { word: 'קוֹף', emoji: '🐒' },
      { word: 'קִיפּוֹד', emoji: '🦔' },
    ],
    color: '#9F7AEA',
  },
  {
    letter: 'ר',
    nameHe: 'רֵישׁ',
    examples: [
      { word: 'רַכֶּבֶת', emoji: '🚂' },
      { word: 'רַמְזוֹר', emoji: '🚦' },
    ],
    color: '#FC8181',
  },
  {
    letter: 'ש',
    nameHe: 'שִׁין',
    examples: [
      { word: 'שֶׁמֶשׁ', emoji: '☀️' },
      { word: 'שִׂמְלָה', emoji: '👗' },
    ],
    color: '#4FD1C5',
  },
  {
    letter: 'ת',
    nameHe: 'תָּו',
    examples: [
      { word: 'תַּפּוּחַ', emoji: '🍎' },
      { word: 'תּוּת', emoji: '🍓' },
    ],
    color: '#667EEA',
  },
];

// All basic letter characters (no finals) for grid/scan generation
export const ALL_BASIC_LETTERS = HEBREW_LETTERS.map((l) => l.letter);
