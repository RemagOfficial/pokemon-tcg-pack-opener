/**
 * Economy mode pricing.
 *
 * Pack prices start at 100 coins for the oldest set (Base Set) and
 * increase by ×1.25 per set in release order, rounded to the nearest 10.
 *
 * Sell prices are a rarity-scaled fraction of the set's pack price.
 */

// Sets in release order — matches the order in sets.js
export const SET_ORDER = [
  'base1', 'base2', 'base3', 'base4', 'base5',
  'gym1',  'gym2',  'neo1',  'neo2',  'neo3',  'neo4',
  'lc',    'ecard1','ecard2','ecard3',
  'ex1',   'ex2',   'ex3',   'ex4',   'ex5',   'ex6',
  'ex7',   'ex8',   'ex9',   'ex10',  'ex11',
  'ex12',  'ex13',  'ex14',  'ex15',  'ex16',
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
// Holo cards earn a 50% bonus on top of their rarity base value.
const RARITY_SELL_FACTOR = {
  'Common':      0.05,
  'Uncommon':    0.10,
  'Rare':        0.25,
  'Rare ex':     0.60,
  'Secret Rare': 1.00,
};
const HOLO_SELL_MULTIPLIER = 1.5;

/**
 * Returns the coin value for selling a single duplicate card.
 * @param {object} card  - card object with `rarity` and `holo` fields
 * @param {string} setId - the set the card belongs to
 */
export function getSellPrice(card, setId) {
  const packPrice  = PACK_PRICES[setId] ?? PACK_PRICES['base1'];
  const baseFactor = RARITY_SELL_FACTOR[card.rarity] ?? 0.05;
  const factor     = card.holo ? baseFactor * HOLO_SELL_MULTIPLIER : baseFactor;
  return Math.max(1, Math.floor(packPrice * factor));
}
