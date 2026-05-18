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
