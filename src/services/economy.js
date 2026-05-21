/**
 * Economy mode pricing.
 *
 * Pack prices start at 100 coins for the oldest set (Base Set) and
 * increase by ×1.25 per set in release order, rounded to the nearest 10.
 *
 * Sell prices are a rarity-scaled fraction of the set's pack price.
 */

import { getGradeMultiplier } from './grading.js';

// Sets in release order — matches the order in sets.js
export const SET_ORDER = [
  'base1', 'base2', 'base3', 'base4', 'base5',
  'gym1',  'gym2',  'neo1',  'neo2',  'neo3',  'neo4',
  'lc',    'ecard1','ecard2','ecard3',
  'ex1',   'ex2',   'ex3',   'ex4',   'ex5',   'ex6',
  'ex7',   'ex8',   'ex9',   'ex10',  'ex11',
  'ex12',  'ex13',  'ex14',  'ex15',  'ex16',
  'dp1',
  'dp2', 'dp3', 'dp4', 'dp5', 'dp6', 'dp7',
  'pl1', 'pl2', 'pl3', 'pl4',
  'hgss1', 'hgss2', 'hgss3', 'hgss4',
  'col1',
  'bw1', 'bw2', 'bw3', 'bw4', 'bw5', 'bw6', 'bw7', 'bw8', 'bw9', 'bw10', 'bw11',
  'xy1', 'xy2', 'xy3', 'xy4', 'xy5', 'xy6', 'xy7', 'xy8', 'xy9', 'xy10', 'xy11', 'xy12', 'sm1', 'sm2', 'sm3', 'sm4', 'sm5', 'sm6', 'sm7', 'sm8', 'sm9', 'sm10', 'sm11', 'sm12', 'swsh1', 'swsh2', 'swsh3', 'swsh4', 'swsh5', 'swsh6', 'swsh7', 'swsh8', 'swsh9', 'swsh10', 'swsh11', 'swsh12', 'sv01', 'sv02', 'sv03', 'sv04', 'sv05', 'sv06', 'sv07', 'sv08', 'sv09', 'sv10', 'me01', 'me02', 'me03',
];

// Build the price table once at module load
export const PACK_PRICES = (() => {
  const prices = {};
  let price = 100;
  for (const id of SET_ORDER) {
    prices[id] = Math.round(price / 10) * 10;
    price *= 1.25;
  }
  return prices;
})();

// Starting balance = 3 × the cheapest pack (Base Set)
export const STARTING_BALANCE = PACK_PRICES['base1'] * 3; // 300 coins

// Fraction of pack price returned when selling a card.
//
// Designed so that selling ALL cards from a worst-case pack (non-holo rare)
// returns exactly the pack price — i.e. the player always breaks even.
//
// WotC-era pack: 6 commons + 3 uncommons + 1 rare (no RH slot)
//   6×0.06 + 3×0.12 + 0.28 = 0.36 + 0.36 + 0.28 = 1.00  ✓
//
// EX-era pack:  5 commons + 3 uncommons + 1 reverse holo + 1 rare (RH slot)
//   5×0.06 + 3×0.12 + 0.06×1.25 (min RH) + 0.28 ≈ 1.01  ✓
//
// Holo rares and above earn a bonus so the player profits on premium pulls.
const RARITY_SELL_FACTOR = {
  'Common':      0.06,
  'Uncommon':    0.12,
  'Rare':        0.28,
  'Rare BREAK':  0.35,
  'Rare ex':     0.60,
  'Ultra Rare':  0.80,
  'Rare LV.X':   0.60,
  'Rare Shiny':  1.50,
  'Radiant Rare': 1.50,
  'Secret Rare': 1.00,
};
const HOLO_SELL_MULTIPLIER         = 1.5;   // full holo treatment
const REVERSE_HOLO_SELL_MULTIPLIER = 1.25;  // reverse holo treatment

/**
 * Returns the coin value for selling a single duplicate card.
 * @param {object} card  - card object with `rarity`, `holo`, and `reverseHolo` fields
 * @param {string} setId - the set the card belongs to
 */
export function getSellPrice(card, setId) {
  const packPrice  = PACK_PRICES[setId] ?? PACK_PRICES['base1'];
  const baseFactor = RARITY_SELL_FACTOR[card.rarity] ?? 0.06;
  let factor = baseFactor;
  if (card.holo)             factor = baseFactor * HOLO_SELL_MULTIPLIER;
  else if (card.reverseHolo) factor = baseFactor * REVERSE_HOLO_SELL_MULTIPLIER;
  factor *= getGradeMultiplier(card.grade);
  // Math.ceil ensures that 6 commons + 3 uncommons + 1 non-holo rare always
  // sums to at least the pack price (verified across every set in SET_ORDER).
  return Math.max(1, Math.ceil(packPrice * factor));
}
