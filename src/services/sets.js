/**
 * Central set registry.
 * Add new sets here — both tcgdex.js and achievements.js consume this list.
 *
 * rarityRanges: { [rarityName]: [minLocalId, maxLocalId] } (inclusive)
 * rarityTotals: card count per rarity (used as fallback when set isn't loaded yet)
 */
export const SETS = [
  {
    id: 'base1',
    name: 'Base Set',
    series: 'Base',
    year: '1999',
    totalCards: 102,
    symbol: '◆',
    accentColor: '#e63946',
    rarityRanges: {
      'Rare Holo': [1, 16],
      'Rare':      [17, 32],
      'Uncommon':  [33, 64],
      'Common':    [65, 102],
    },
    rarityTotals: {
      'Rare Holo': 16,
      'Rare':      16,
      'Uncommon':  32,
      'Common':    38,
    },
  },
  {
    id: 'base2',
    name: 'Jungle',
    series: 'Base',
    year: '1999',
    totalCards: 64,
    symbol: '🌴',
    accentColor: '#2d6a4f',
    rarityRanges: {
      'Rare Holo': [1, 16],
      'Rare':      [17, 32],
      'Uncommon':  [33, 48],
      'Common':    [49, 64],
    },
    rarityTotals: {
      'Rare Holo': 16,
      'Rare':      16,
      'Uncommon':  16,
      'Common':    16,
    },
  },
  {
    id: 'base3',
    name: 'Fossil',
    series: 'Base',
    year: '1999',
    totalCards: 62,
    symbol: '◈',
    accentColor: '#78716c',
    rarityRanges: {
      'Rare Holo': [1, 16],
      'Rare':      [17, 32],
      'Uncommon':  [33, 48],
      'Common':    [49, 62],
    },
    rarityTotals: {
      'Rare Holo': 16,
      'Rare':      16,
      'Uncommon':  16,
      'Common':    14,
    },
  },
  {
    id: 'base4',
    name: 'Base Set 2',
    series: 'Base',
    year: '2000',
    totalCards: 130,
    symbol: '◉',
    accentColor: '#7c3aed',
    rarityRanges: {
      'Rare Holo': [1, 28],
      'Rare':      [29, 56],
      'Uncommon':  [57, 90],
      'Common':    [91, 130],
    },
    rarityTotals: {
      'Rare Holo': 28,
      'Rare':      28,
      'Uncommon':  34,
      'Common':    40,
    },
  },
  {
    id: 'base5',
    name: 'Team Rocket',
    series: 'Base',
    year: '2000',
    totalCards: 82, // card 83 (Dark Raichu) is a secret rare – not in official count
    symbol: 'R',
    accentColor: '#dc2626',
    rarityRanges: {
      'Rare Holo':   [1,  16],
      'Rare':        [17, 32],
      'Uncommon':    [33, 56],
      'Common':      [57, 82],
      'Secret Rare': [83, 83],
    },
    rarityTotals: {
      'Rare Holo':   16,
      'Rare':        16,
      'Uncommon':    24,
      'Common':      26,
      'Secret Rare': 1,
    },
  },
  // ─── Gym Series ──────────────────────────────────────────────────────────
  {
    id: 'gym1',
    name: 'Gym Heroes',
    series: 'Base',
    year: '2000',
    totalCards: 132,
    symbol: '⊙',
    accentColor: '#f59e0b',
    rarityRanges: {
      // tcgdex labels cards 1-34 as Rare Holo; no separate Rare section
      'Rare Holo': [1, 34],
      'Uncommon':  [35, 88],
      'Common':    [89, 132],
    },
    rarityTotals: { 'Rare Holo': 34, 'Uncommon': 54, 'Common': 44 },
  },
  {
    id: 'gym2',
    name: 'Gym Challenge',
    series: 'Base',
    year: '2000',
    totalCards: 132,
    symbol: '⊕',
    accentColor: '#16a34a',
    rarityRanges: {
      'Rare Holo': [1, 20],
      'Rare':      [21, 30],
      'Uncommon':  [31, 59],
      'Common':    [60, 132],
    },
    rarityTotals: { 'Rare Holo': 20, 'Rare': 10, 'Uncommon': 29, 'Common': 73 },
  },
  // ─── Neo Series ──────────────────────────────────────────────────────────
  {
    id: 'neo1',
    name: 'Neo Genesis',
    series: 'Neo',
    year: '2000',
    totalCards: 111,
    symbol: '◈',
    accentColor: '#0ea5e9',
    // Physical holos: 1-16; tcgdex labels all as 'Rare' but we split for pack variety
    rarityRanges: {
      'Rare Holo': [1,  16],
      'Rare':      [17, 25],
      'Uncommon':  [26, 54],
      'Common':    [55, 111],
    },
    rarityTotals: { 'Rare Holo': 16, 'Rare': 9, 'Uncommon': 29, 'Common': 57 },
  },
  {
    id: 'neo2',
    name: 'Neo Discovery',
    series: 'Neo',
    year: '2001',
    totalCards: 75,
    symbol: '✦',
    accentColor: '#8b5cf6',
    rarityRanges: {
      'Rare Holo': [1,  10],
      'Rare':      [11, 39],
      'Uncommon':  [40, 54],
      'Common':    [55, 75],
    },
    rarityTotals: { 'Rare Holo': 10, 'Rare': 29, 'Uncommon': 15, 'Common': 21 },
  },
  {
    id: 'neo3',
    name: 'Neo Revelation',
    series: 'Neo',
    year: '2001',
    totalCards: 64, // cards 65–66 (Shining Gyarados & Magikarp) are secret rares
    symbol: '✺',
    accentColor: '#be123c',
    rarityRanges: {
      'Rare Holo':   [1, 8],
      'Rare':        [9, 29],
      'Uncommon':    [[30, 40], [60, 63]],
      'Common':      [[41, 59], [64, 64]],
      'Secret Rare': [65, 66],
    },
    rarityTotals: { 'Rare Holo': 8, 'Rare': 21, 'Uncommon': 15, 'Common': 20, 'Secret Rare': 2 },
  },
  {
    id: 'neo4',
    name: 'Neo Destiny',
    series: 'Neo',
    year: '2002',
    totalCards: 105, // cards 106–113 (Shining Pokémon) are secret rares
    symbol: '⬡',
    accentColor: '#1d4ed8',
    rarityRanges: {
      'Rare Holo':   [1,   28],
      'Rare':        [29,  49],
      'Uncommon':    [50,  81],
      'Common':      [82,  105],
      'Secret Rare': [106, 113],
    },
    rarityTotals: { 'Rare Holo': 28, 'Rare': 21, 'Uncommon': 32, 'Common': 24, 'Secret Rare': 8 },
  },
  // ─── Legendary Collection ────────────────────────────────────────────────
  {
    id: 'lc',
    name: 'Legendary Collection',
    series: 'Legendary Collection',
    year: '2002',
    totalCards: 110,
    symbol: 'LC',
    accentColor: '#b45309',
    rarityRanges: {
      'Rare Holo': [1,  16],
      'Rare':      [17, 38],
      'Uncommon':  [39, 60],
      'Common':    [61, 110],
    },
    rarityTotals: { 'Rare Holo': 16, 'Rare': 22, 'Uncommon': 22, 'Common': 50 },
  },
  // ─── e-Card Series ───────────────────────────────────────────────────────
  {
    id: 'ecard1',
    name: 'Expedition Base Set',
    series: 'e-Card',
    year: '2002',
    totalCards: 165,
    symbol: 'EX',
    accentColor: '#047857',
    rarityRanges: {
      // Physical holos 1-17; tcgdex labels all as 'Rare'
      'Rare Holo': [1,  17],
      'Rare':      [18, 74],
      'Uncommon':  [[75, 94], [140, 164]],
      'Common':    [[95, 139], [165, 165]],
    },
    rarityTotals: { 'Rare Holo': 17, 'Rare': 57, 'Uncommon': 45, 'Common': 46 },
  },
  {
    id: 'ecard2',
    name: 'Aquapolis',
    series: 'e-Card',
    year: '2003',
    totalCards: 185,
    symbol: 'AQ',
    accentColor: '#1e40af',
    // H-prefix cards (H01–H32) are the holographic cards for this set
    rarityPrefixMap: { 'H': 'Rare Holo' },
    rarityRanges: {
      'Rare':     [[1, 46], [150, 150]],
      'Uncommon': [[47, 69], [120, 149]],
      'Common':   [70, 119],
    },
    rarityTotals: { 'Rare Holo': 32, 'Rare': 47, 'Uncommon': 57, 'Common': 49 },
  },
  {
    id: 'ecard3',
    name: 'Skyridge',
    series: 'e-Card',
    year: '2003',
    totalCards: 182,
    symbol: 'SK',
    accentColor: '#6d28d9',
    // H-prefix cards (H01–H32) are the holographic cards for this set
    rarityPrefixMap: { 'H': 'Rare Holo' },
    rarityRanges: {
      'Rare':     [[1, 39], [150, 150]],
      'Uncommon': [[40, 46], [120, 149]],
      'Common':   [47, 119],
    },
    rarityTotals: { 'Rare Holo': 32, 'Rare': 40, 'Uncommon': 37, 'Common': 73 },
  },
  // --- EX Series ---
  {
    id: 'ex1',
    name: 'EX Ruby & Sapphire',
    series: 'EX',
    year: '2003',
    totalCards: 109,
    symbol: 'ex',
    accentColor: '#dc2626',
    rarityRanges: {
      'Rare':     [1,  35],
      'Uncommon': [36, 69],
      'Common':   [70, 109],
    },
    rarityTotals: { 'Rare ex': 11, 'Rare': 24, 'Uncommon': 34, 'Common': 40 },
  },
  {
    id: 'ex2',
    name: 'EX Sandstorm',
    series: 'EX',
    year: '2003',
    totalCards: 100,
    symbol: 'ex',
    accentColor: '#d97706',
    rarityRanges: {
      'Rare':     [1,  25],
      'Uncommon': [26, 53],
      'Common':   [54, 100],
    },
    rarityTotals: { 'Rare ex': 8, 'Rare': 17, 'Uncommon': 28, 'Common': 47 },
  },
  {
    id: 'ex3',
    name: 'EX Dragon',
    series: 'EX',
    year: '2003',
    totalCards: 97,
    symbol: 'ex',
    accentColor: '#7c3aed',
    rarityRanges: {
      'Rare':        [1,  25],
      'Uncommon':    [26, 53],
      'Common':      [54, 97],
      'Secret Rare': [98, 100],
    },
    rarityTotals: { 'Rare ex': 9, 'Rare': 16, 'Uncommon': 28, 'Common': 44, 'Secret Rare': 3 },
  },
  {
    id: 'ex4',
    name: 'EX Team Magma vs Team Aqua',
    series: 'EX',
    year: '2004',
    totalCards: 95,
    symbol: 'ex',
    accentColor: '#3b82f6',
    rarityRanges: {
      'Rare':        [1,  21],
      'Uncommon':    [22, 47],
      'Common':      [48, 95],
      'Secret Rare': [96, 97],
    },
    rarityTotals: { 'Rare ex': 11, 'Rare': 10, 'Uncommon': 26, 'Common': 48, 'Secret Rare': 2 },
  },
  {
    id: 'ex5',
    name: 'EX Hidden Legends',
    series: 'EX',
    year: '2004',
    totalCards: 101,
    symbol: 'ex',
    accentColor: '#059669',
    rarityRanges: {
      'Rare':        [1,  26],
      'Uncommon':    [27, 55],
      'Common':      [56, 101],
      'Secret Rare': [102, 102],
    },
    rarityTotals: { 'Rare ex': 10, 'Rare': 16, 'Uncommon': 29, 'Common': 46, 'Secret Rare': 1 },
  },
  {
    id: 'ex6',
    name: 'EX FireRed & LeafGreen',
    series: 'EX',
    year: '2004',
    totalCards: 112,
    symbol: 'ex',
    accentColor: '#f97316',
    rarityRanges: {
      'Rare':        [1,  27],
      'Uncommon':    [28, 57],
      'Common':      [58, 112],
      'Secret Rare': [113, 116],
    },
    rarityTotals: { 'Rare ex': 12, 'Rare': 15, 'Uncommon': 30, 'Common': 55, 'Secret Rare': 4 },
  },
  {
    id: 'ex7',
    name: 'EX Team Rocket Returns',
    series: 'EX',
    year: '2004',
    totalCards: 109,
    symbol: 'ex',
    accentColor: '#9333ea',
    rarityRanges: {
      'Rare':        [1,  28],
      'Uncommon':    [29, 58],
      'Common':      [59, 109],
      'Secret Rare': [110, 111],
    },
    rarityTotals: { 'Rare ex': 15, 'Rare': 13, 'Uncommon': 30, 'Common': 51, 'Secret Rare': 2 },
  },
  {
    id: 'ex8',
    name: 'EX Deoxys',
    series: 'EX',
    year: '2005',
    totalCards: 107,
    symbol: 'ex',
    accentColor: '#06b6d4',
    rarityRanges: {
      'Rare':        [1,  24],
      'Uncommon':    [25, 54],
      'Common':      [55, 107],
      'Secret Rare': [108, 108],
    },
    rarityTotals: { 'Rare ex': 12, 'Rare': 12, 'Uncommon': 30, 'Common': 53, 'Secret Rare': 1 },
  },
  {
    id: 'ex9',
    name: 'EX Emerald',
    series: 'EX',
    year: '2005',
    totalCards: 106,
    symbol: 'ex',
    accentColor: '#22c55e',
    rarityRanges: {
      'Rare':        [1,  22],
      'Uncommon':    [23, 51],
      'Common':      [52, 106],
      'Secret Rare': [107, 107],
    },
    rarityTotals: { 'Rare ex': 10, 'Rare': 12, 'Uncommon': 29, 'Common': 55, 'Secret Rare': 1 },
  },
  {
    id: 'ex10',
    name: 'EX Unseen Forces',
    series: 'EX',
    year: '2005',
    totalCards: 115,
    symbol: 'ex',
    accentColor: '#f59e0b',
    rarityRanges: {
      'Rare':        [1,  30],
      'Uncommon':    [31, 65],
      'Common':      [66, 115],
      'Secret Rare': [116, 117],
    },
    rarityTotals: { 'Rare ex': 17, 'Rare': 13, 'Uncommon': 35, 'Common': 50, 'Secret Rare': 2 },
    // mergeSets: ['exu'], // re-enable when TCGdex adds Unown card images
  },
  {
    id: 'ex11',
    name: 'EX Delta Species',
    series: 'EX',
    year: '2005',
    totalCards: 113,
    symbol: 'ex',
    accentColor: '#8b5cf6',
    rarityRanges: {
      'Rare':        [1,  26],
      'Uncommon':    [27, 57],
      'Common':      [58, 113],
      'Secret Rare': [114, 114],
    },
    rarityTotals: { 'Rare ex': 11, 'Rare': 15, 'Uncommon': 31, 'Common': 56, 'Secret Rare': 1 },
  },
  {
    id: 'ex12',
    name: 'EX Legend Maker',
    series: 'EX',
    year: '2006',
    totalCards: 92,
    symbol: 'ex',
    accentColor: '#0284c7',
    rarityRanges: {
      'Rare':        [1,  15],
      'Uncommon':    [16, 37],
      'Common':      [38, 92],
      'Secret Rare': [93, 93],
    },
    rarityTotals: { 'Rare ex': 7, 'Rare': 18, 'Uncommon': 22, 'Common': 45, 'Secret Rare': 1 },
  },
  {
    id: 'ex13',
    name: 'EX Holon Phantoms',
    series: 'EX',
    year: '2006',
    totalCards: 110,
    symbol: 'ex',
    accentColor: '#7c3aed',
    rarityRanges: {
      'Rare':        [1,   17],
      'Uncommon':    [18,  51],
      'Common':      [52,  110],
      'Secret Rare': [111, 111],
    },
    rarityTotals: { 'Rare ex': 3, 'Rare': 20, 'Uncommon': 34, 'Common': 53, 'Secret Rare': 1 },
  },
  {
    id: 'ex14',
    name: 'EX Crystal Guardians',
    series: 'EX',
    year: '2006',
    totalCards: 100,
    symbol: 'ex',
    accentColor: '#06b6d4',
    rarityRanges: {
      'Rare':     [1,  13],
      'Uncommon': [14, 41],
      'Common':   [42, 100],
    },
    rarityTotals: { 'Rare ex': 10, 'Rare': 15, 'Uncommon': 28, 'Common': 47 },
  },
  {
    id: 'ex15',
    name: 'EX Dragon Frontiers',
    series: 'EX',
    year: '2006',
    totalCards: 101,
    symbol: 'ex',
    accentColor: '#dc2626',
    rarityRanges: {
      'Rare':     [1,  12],
      'Uncommon': [13, 37],
      'Common':   [38, 101],
    },
    rarityTotals: { 'Rare ex': 10, 'Rare': 14, 'Uncommon': 25, 'Common': 52 },
  },
  {
    id: 'ex16',
    name: 'EX Power Keepers',
    series: 'EX',
    year: '2007',
    totalCards: 108,
    symbol: 'ex',
    accentColor: '#f59e0b',
    rarityRanges: {
      'Rare':     [1,  13],
      'Uncommon': [14, 35],
      'Common':   [36, 108],
    },
    rarityTotals: { 'Rare ex': 8, 'Rare': 16, 'Uncommon': 22, 'Common': 62 },
  },
  // --- Diamond & Pearl Series ---
  {
    id: 'dp1',
    name: 'Diamond & Pearl',
    series: 'Diamond & Pearl',
    year: '2007',
    totalCards: 130,
    symbol: '◇',
    accentColor: '#6366f1',
    rarityRanges: {
      'Rare Holo': [1,  29],
      'Rare':      [30, 63],
      'Uncommon':  [64, 68],
      'Rare LV.X': [120, 122],
      'Common':    [69, 119], // trainers; energies 123-130 fall through to inferRarity's 'Common' default
    },
    rarityTotals: { 'Rare LV.X': 3, 'Rare Holo': 29, 'Rare': 34, 'Uncommon': 5, 'Common': 59 },
  },
  {
    id: 'dp2',
    name: 'Mysterious Treasures',
    series: 'Diamond & Pearl',
    year: '2007',
    totalCards: 123,
    symbol: '◇',
    accentColor: '#0891b2',
    rarityRanges: {
      'Rare Holo': [1,  17],
      'Rare':      [18, 40],
      'Uncommon':  [41, 68],
      'Rare LV.X': [121, 123],
      'Common':    [69, 120],
    },
    rarityTotals: { 'Rare LV.X': 3, 'Rare Holo': 17, 'Rare': 23, 'Uncommon': 28, 'Common': 52 },
  },
  {
    id: 'dp3',
    name: 'Secret Wonders',
    series: 'Diamond & Pearl',
    year: '2007',
    totalCards: 132,
    symbol: '◇',
    accentColor: '#7c3aed',
    rarityRanges: {
      'Rare Holo': [1,  20],
      'Rare':      [21, 44],
      'Uncommon':  [45, 75],
      'Rare LV.X': [131, 132],
      'Common':    [76, 130],
    },
    rarityTotals: { 'Rare LV.X': 2, 'Rare Holo': 20, 'Rare': 24, 'Uncommon': 31, 'Common': 55 },
  },
  {
    id: 'dp4',
    name: 'Great Encounters',
    series: 'Diamond & Pearl',
    year: '2008',
    totalCards: 106,
    symbol: '◇',
    accentColor: '#16a34a',
    rarityRanges: {
      'Rare Holo': [1,  19],
      'Rare':      [20, 32],
      'Uncommon':  [33, 59],
      'Rare LV.X': [103, 106],
      'Common':    [60, 102],
    },
    rarityTotals: { 'Rare LV.X': 4, 'Rare Holo': 19, 'Rare': 13, 'Uncommon': 27, 'Common': 43 },
  },
  {
    id: 'dp5',
    name: 'Majestic Dawn',
    series: 'Diamond & Pearl',
    year: '2008',
    totalCards: 100,
    symbol: '◇',
    accentColor: '#f97316',
    rarityRanges: {
      'Rare Holo': [1,  16],
      'Rare':      [17, 34],
      'Uncommon':  [35, 49],
      'Rare LV.X': [97, 100],
      'Common':    [50, 96],
    },
    rarityTotals: { 'Rare LV.X': 4, 'Rare Holo': 16, 'Rare': 18, 'Uncommon': 15, 'Common': 47 },
  },
  {
    id: 'dp6',
    name: 'Legends Awakened',
    series: 'Diamond & Pearl',
    year: '2008',
    totalCards: 146,
    symbol: '◇',
    accentColor: '#dc2626',
    rarityRanges: {
      'Rare Holo': [1,  17],
      'Rare':      [18, 45],
      'Uncommon':  [46, 82],
      'Rare LV.X': [140, 146],
      'Common':    [83, 139],
    },
    rarityTotals: { 'Rare LV.X': 7, 'Rare Holo': 17, 'Rare': 28, 'Uncommon': 37, 'Common': 57 },
  },
  {
    id: 'dp7',
    name: 'Stormfront',
    series: 'Diamond & Pearl',
    year: '2008',
    totalCards: 100,
    symbol: '◇',
    accentColor: '#334155',
    rarityPrefixMap: { 'SH': 'Rare Shiny' }, // SH1-SH3 shiny sub-set
    rarityRanges: {
      'Rare Holo': [1,  16],
      'Rare':      [17, 25],
      'Uncommon':  [26, 45],
      'Rare LV.X': [96, 100],
      'Common':    [46, 95],
    },
    rarityTotals: { 'Rare Shiny': 3, 'Rare LV.X': 5, 'Rare Holo': 16, 'Rare': 9, 'Uncommon': 20, 'Common': 50 },
  },
];

/** Look up a set definition by its id (e.g. 'base1'). */
export function getSetConfig(id) {
  return SETS.find((s) => s.id === id) ?? null;
}

/**
 * Infer the rarity of a card given its set config and localId.
 *
 * Supports:
 *  - rarityPrefixMap: { 'H': 'Rare Holo' } for non-numeric localIds (e-card H-variants)
 *  - Single range:    [min, max]
 *  - Multi-range:     [[min1, max1], [min2, max2]]  (same rarity in multiple blocks)
 */
export function inferRarity(setConfig, localId) {
  const n = parseInt(localId, 10);
  if (isNaN(n)) {
    // Check prefix map for non-numeric localIds (e.g. H01 in Aquapolis/Skyridge)
    if (setConfig.rarityPrefixMap) {
      for (const [prefix, rarity] of Object.entries(setConfig.rarityPrefixMap)) {
        if (String(localId).startsWith(prefix)) return rarity;
      }
    }
    // H-prefix cards with no explicit mapping are holo variants of regular cards
    // (same art, but with holographic treatment — tracked separately)
    if (/^H/i.test(String(localId))) return 'Holo Variant';
    return 'Common';
  }

  for (const [rarity, ranges] of Object.entries(setConfig.rarityRanges)) {
    // Support both a single [min, max] and an array of ranges [[min,max], ...]
    const rangeList = Array.isArray(ranges[0]) ? ranges : [ranges];
    for (const [min, max] of rangeList) {
      if (n >= min && n <= max) return rarity;
    }
  }
  return 'Common';
}
