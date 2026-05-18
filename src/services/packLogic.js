/**
 * Base Set booster pack composition (10 cards):
 *   1 rare slot  – 33 % Rare Holo, 67 % Rare
 *   3 uncommons
 *   6 commons
 *
 * Real 1999 packs had 11 cards (+ 1 basic energy), but 10-card packs are
 * the modern convention and keep the UI clean. Adjust PACK_SIZE if desired.
 */

function pickRandom(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function openPack(allCards) {
  const holoRares    = allCards.filter((c) => c.rarity === 'Rare Holo');
  const rares        = allCards.filter((c) => c.rarity === 'Rare');
  const uncommons    = allCards.filter((c) => c.rarity === 'Uncommon');
  const commons      = allCards.filter((c) => c.rarity === 'Common');
  const secretRares  = allCards.filter((c) => c.rarity === 'Secret Rare');

  const uncommonCards = pickRandom(uncommons, 3);
  const commonCards   = pickRandom(commons,   6);

  // Secret rare: ~1-in-45 chance, replaces the rare slot
  if (secretRares.length > 0 && Math.random() < 1 / 45) {
    const secretCard = pickRandom(secretRares, 1);
    return [...commonCards, ...uncommonCards, ...secretCard];
  }

  // ~1-in-3 chance of a holo rare, otherwise a non-holo rare
  // If no plain rares exist (e.g. Gym Heroes), fall back to the holo pool
  const isHolo   = Math.random() < 1 / 3;
  const rarePool = isHolo ? holoRares : rares;
  const effectivePool = rarePool.length ? rarePool : holoRares;
  const rareCard = pickRandom(effectivePool, 1);

  // Order: commons at the bottom, uncommons in the middle, rare on top
  return [...commonCards, ...uncommonCards, ...rareCard];
}
