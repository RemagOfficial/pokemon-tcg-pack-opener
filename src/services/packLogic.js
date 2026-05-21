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
  const holoRares    = allCards.filter((c) => c.holo === true && !c.reverseHolo);
  const rares        = allCards.filter((c) => c.rarity === 'Rare' && !c.holo && !c.reverseHolo);
  const uncommons    = allCards.filter((c) => c.rarity === 'Uncommon' && !c.reverseHolo);
  const commons      = allCards.filter((c) => c.rarity === 'Common' && !c.reverseHolo);
  const secretRares  = allCards.filter((c) => c.rarity === 'Secret Rare' && !c.reverseHolo);
  const ultraRares   = allCards.filter((c) => c.rarity === 'Ultra Rare' && !c.reverseHolo);
  const breakCards   = allCards.filter((c) => c.rarity === 'Rare BREAK' && !c.reverseHolo);
  const exCards      = allCards.filter((c) => c.rarity === 'Rare ex' || c.rarity === 'Rare LV.X');
  const shinyCards   = allCards.filter((c) => c.rarity === 'Rare Shiny');
  const reverseHolos = allCards.filter((c) => c.reverseHolo === true);

  // Sets with reverse holo cards (EX era+) get a dedicated reverse holo slot,
  // replacing one common slot so the pack stays at 10 cards total.
  const hasRH     = reverseHolos.length > 0;
  const rhSlot    = hasRH ? pickRandom(reverseHolos, 1) : [];

  const uncommonCards = pickRandom(uncommons, 3);
  const commonCards   = pickRandom(commons, hasRH ? 5 : 6);

  // Shiny Pokémon: ~1-in-90 chance, rarer than Secret Rare, replaces the rare slot
  if (shinyCards.length > 0 && Math.random() < 1 / 90) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(shinyCards, 1)];
  }

  // Secret rare: ~1-in-45 chance, replaces the rare slot
  if (secretRares.length > 0 && Math.random() < 1 / 45) {
    const secretCard = pickRandom(secretRares, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...secretCard];
  }

  // Ultra Rare: ~1-in-18 chance, replaces the rare slot
  // (rarer than EX, less rare than Secret Rare)
  if (ultraRares.length > 0 && Math.random() < 1 / 18) {
    const ultraCard = pickRandom(ultraRares, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...ultraCard];
  }

  // BREAK cards: ~1-in-5 chance, replaces the rare slot.
  // Less rare than EX, more rare than holo rare.
  if (breakCards.length > 0 && Math.random() < 1 / 5) {
    const breakCard = pickRandom(breakCards, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...breakCard];
  }

  // EX Pokemon: ~1-in-9 chance, replaces the rare slot
  if (exCards.length > 0 && Math.random() < 1 / 9) {
    const exCard = pickRandom(exCards, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...exCard];
  }

  // ~1-in-3 chance of a holo rare, otherwise a non-holo rare
  // If no plain rares exist (e.g. Gym Heroes), fall back to the holo pool
  const isHolo   = Math.random() < 1 / 3;
  const rarePool = isHolo ? holoRares : rares;
  const effectivePool = rarePool.length ? rarePool : holoRares;
  const rareCard = pickRandom(effectivePool, 1);

  // Order: commons at the bottom, uncommons in the middle, [reverse holo], rare on top
  return [...commonCards, ...uncommonCards, ...rhSlot, ...rareCard];
}

/**
 * Pity pack — identical to openPack except the rare slot is guaranteed to be
 * at minimum a holo rare. EX Pokémon and Secret Rare still use their normal
 * probabilities so they can still appear (and because holos are now the floor
 * rather than one option among rares, effective pull rates feel higher).
 */
export function openPityPack(allCards) {
  const holoRares    = allCards.filter((c) => c.holo === true && !c.reverseHolo);
  const rares        = allCards.filter((c) => c.rarity === 'Rare' && !c.holo && !c.reverseHolo);
  const uncommons    = allCards.filter((c) => c.rarity === 'Uncommon' && !c.reverseHolo);
  const commons      = allCards.filter((c) => c.rarity === 'Common' && !c.reverseHolo);
  const secretRares  = allCards.filter((c) => c.rarity === 'Secret Rare' && !c.reverseHolo);
  const ultraRares   = allCards.filter((c) => c.rarity === 'Ultra Rare' && !c.reverseHolo);
  const breakCards   = allCards.filter((c) => c.rarity === 'Rare BREAK' && !c.reverseHolo);
  const exCards      = allCards.filter((c) => c.rarity === 'Rare ex' || c.rarity === 'Rare LV.X');
  const shinyCards   = allCards.filter((c) => c.rarity === 'Rare Shiny');
  const reverseHolos = allCards.filter((c) => c.reverseHolo === true);

  const hasRH     = reverseHolos.length > 0;
  const rhSlot    = hasRH ? pickRandom(reverseHolos, 1) : [];
  const uncommonCards = pickRandom(uncommons, 3);
  const commonCards   = pickRandom(commons, hasRH ? 5 : 6);

  // Shiny Pokémon: same 1-in-90 chance
  if (shinyCards.length > 0 && Math.random() < 1 / 90) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(shinyCards, 1)];
  }

  // Secret Rare: same 1-in-45 chance
  if (secretRares.length > 0 && Math.random() < 1 / 45) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(secretRares, 1)];
  }

  // Ultra Rare: same 1-in-18 chance
  if (ultraRares.length > 0 && Math.random() < 1 / 18) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(ultraRares, 1)];
  }

  // BREAK cards: same 1-in-5 chance in pity packs.
  if (breakCards.length > 0 && Math.random() < 1 / 5) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(breakCards, 1)];
  }

  // EX Pokémon: same 1-in-9 chance
  if (exCards.length > 0 && Math.random() < 1 / 9) {
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(exCards, 1)];
  }

  // Guaranteed holo (fall back to non-holo rares only if the set has none)
  const pool = holoRares.length > 0 ? holoRares : rares;
  return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(pool, 1)];
}
