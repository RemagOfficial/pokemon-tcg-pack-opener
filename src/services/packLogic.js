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

const PREMIUM_COOLDOWN_PACKS = 3;
const PREMIUM_COOLDOWN_BASE_MULTIPLIER = 0.75;
const PREMIUM_COOLDOWN_STEP = 0.15;

const premiumCooldownBySet = new Map();

function getPackSetId(allCards, explicitSetId = null) {
  return explicitSetId ?? allCards.find((card) => card?.setId)?.setId ?? null;
}

function hasPlainRares(allCards) {
  return allCards.some((card) => card.rarity === 'Rare' && card.holo !== true && card.reverseHolo !== true);
}

function getCooldownState(setId, eligible) {
  if (!setId || !eligible) return null;
  if (!premiumCooldownBySet.has(setId)) {
    premiumCooldownBySet.set(setId, { packsLeft: 0, tier: 0 });
  }
  return premiumCooldownBySet.get(setId);
}

function getCooldownMultiplier(state) {
  if (!state || state.packsLeft <= 0 || state.tier <= 0) return 1;
  return Math.max(0.4, PREMIUM_COOLDOWN_BASE_MULTIPLIER - ((state.tier - 1) * PREMIUM_COOLDOWN_STEP));
}

function advanceCooldown(state) {
  if (!state) return;
  if (state.packsLeft > 0) {
    state.packsLeft -= 1;
    if (state.packsLeft <= 0) {
      state.packsLeft = 0;
      state.tier = 0;
    }
  }
}

function notePremiumHit(state, wasActive) {
  if (!state) return;
  if (!wasActive) {
    state.packsLeft = PREMIUM_COOLDOWN_PACKS;
    state.tier = 1;
    return;
  }
  state.tier = Math.min(state.tier + 1, 4);
}

function isCooldownPremiumHit(card) {
  return card?.rarity === 'Secret Rare'
    || card?.rarity === 'Ultra Rare'
    || card?.rarity === 'Rare BREAK'
    || card?.rarity === 'Rare ex'
    || card?.rarity === 'Rare LV.X'
    || card?.rarity === 'Rare Shiny';
}

function rollWithMultiplier(probability, multiplier) {
  return Math.random() < (probability * multiplier);
}

export function openPack(allCards, setId = null) {
  const packSetId = getPackSetId(allCards, setId);
  const cooldownState = getCooldownState(packSetId, !hasPlainRares(allCards));
  const cooldownWasActive = cooldownState?.packsLeft > 0;
  const cooldownMultiplier = getCooldownMultiplier(cooldownState);
  advanceCooldown(cooldownState);
  const holoRares    = allCards.filter((c) => c.rarity === 'Rare' && c.holo === true && !c.reverseHolo);
  const rares        = allCards.filter((c) => c.rarity === 'Rare' && !c.holo && !c.reverseHolo);
  const uncommons    = allCards.filter((c) => c.rarity === 'Uncommon' && !c.reverseHolo);
  const commons      = allCards.filter((c) => c.rarity === 'Common' && !c.reverseHolo);
  const secretRares  = allCards.filter((c) => c.rarity === 'Secret Rare' && !c.reverseHolo);
  const ultraRares   = allCards.filter((c) => c.rarity === 'Ultra Rare' && !c.reverseHolo);
  const breakCards   = allCards.filter((c) => c.rarity === 'Rare BREAK' && !c.reverseHolo);
  const radiantCards = allCards.filter((c) => c.rarity === 'Radiant Rare' && !c.reverseHolo);
  const exCards      = allCards.filter((c) => c.rarity === 'Rare ex' || c.rarity === 'Rare LV.X');
  const shinyCards   = allCards.filter((c) => c.rarity === 'Rare Shiny');
  const reverseHolos = allCards.filter((c) => c.reverseHolo === true);

  // Sets with reverse holo cards (EX era+) get a dedicated reverse holo slot,
  // replacing one common slot so the pack stays at 10 cards total.
  const hasRH     = reverseHolos.length > 0;
  let rhSlot      = hasRH ? pickRandom(reverseHolos, 1) : [];

  // Radiant cards are reverse-slot hits and use shiny-tier odds.
  if (radiantCards.length > 0 && Math.random() < 1 / 90) {
    rhSlot = pickRandom(radiantCards, 1);
  }

  const uncommonCards = pickRandom(uncommons, 3);
  const commonCards   = pickRandom(commons, hasRH ? 5 : 6);

  // Shiny Pokémon: ~1-in-90 chance, rarer than Secret Rare, replaces the rare slot
  if (shinyCards.length > 0 && rollWithMultiplier(1 / 90, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(shinyCards, 1)];
  }

  // Secret rare: ~1-in-45 chance, replaces the rare slot
  if (secretRares.length > 0 && rollWithMultiplier(1 / 45, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    const secretCard = pickRandom(secretRares, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...secretCard];
  }

  // Ultra Rare: ~1-in-18 chance, replaces the rare slot
  // (rarer than EX, less rare than Secret Rare)
  if (ultraRares.length > 0 && rollWithMultiplier(1 / 18, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    const ultraCard = pickRandom(ultraRares, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...ultraCard];
  }

  // BREAK cards: ~1-in-5 chance, replaces the rare slot.
  // Less rare than EX, more rare than holo rare.
  if (breakCards.length > 0 && rollWithMultiplier(1 / 5, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    const breakCard = pickRandom(breakCards, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...breakCard];
  }

  // EX Pokemon: ~1-in-9 chance, replaces the rare slot
  if (exCards.length > 0 && rollWithMultiplier(1 / 9, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    const exCard = pickRandom(exCards, 1);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...exCard];
  }

  // ~1-in-3 chance of a holo rare, otherwise a non-holo rare
  // If no plain rares exist (e.g. Gym Heroes), fall back to the holo pool
  const rareCard = hasPlainRares(allCards)
    ? pickRandom(Math.random() < 1 / 3 ? holoRares : rares, 1)
    : pickRandom(holoRares.length ? holoRares : rares, 1);

  // Order: commons at the bottom, uncommons in the middle, [reverse holo], rare on top
  return [...commonCards, ...uncommonCards, ...rhSlot, ...rareCard];
}

/**
 * Pity pack — identical to openPack except the rare slot is guaranteed to be
 * at minimum a holo rare. EX Pokémon and Secret Rare still use their normal
 * probabilities so they can still appear (and because holos are now the floor
 * rather than one option among rares, effective pull rates feel higher).
 */
export function openPityPack(allCards, setId = null) {
  const packSetId = getPackSetId(allCards, setId);
  const cooldownState = getCooldownState(packSetId, !hasPlainRares(allCards));
  const cooldownWasActive = cooldownState?.packsLeft > 0;
  const cooldownMultiplier = getCooldownMultiplier(cooldownState);
  advanceCooldown(cooldownState);
  const holoRares    = allCards.filter((c) => c.rarity === 'Rare' && c.holo === true && !c.reverseHolo);
  const rares        = allCards.filter((c) => c.rarity === 'Rare' && !c.holo && !c.reverseHolo);
  const uncommons    = allCards.filter((c) => c.rarity === 'Uncommon' && !c.reverseHolo);
  const commons      = allCards.filter((c) => c.rarity === 'Common' && !c.reverseHolo);
  const secretRares  = allCards.filter((c) => c.rarity === 'Secret Rare' && !c.reverseHolo);
  const ultraRares   = allCards.filter((c) => c.rarity === 'Ultra Rare' && !c.reverseHolo);
  const breakCards   = allCards.filter((c) => c.rarity === 'Rare BREAK' && !c.reverseHolo);
  const radiantCards = allCards.filter((c) => c.rarity === 'Radiant Rare' && !c.reverseHolo);
  const exCards      = allCards.filter((c) => c.rarity === 'Rare ex' || c.rarity === 'Rare LV.X');
  const shinyCards   = allCards.filter((c) => c.rarity === 'Rare Shiny');
  const reverseHolos = allCards.filter((c) => c.reverseHolo === true);

  const hasRH     = reverseHolos.length > 0;
  let rhSlot      = hasRH ? pickRandom(reverseHolos, 1) : [];
  if (radiantCards.length > 0 && Math.random() < 1 / 90) {
    rhSlot = pickRandom(radiantCards, 1);
  }
  const uncommonCards = pickRandom(uncommons, 3);
  const commonCards   = pickRandom(commons, hasRH ? 5 : 6);

  // Shiny Pokémon: same 1-in-90 chance
  if (shinyCards.length > 0 && rollWithMultiplier(1 / 90, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(shinyCards, 1)];
  }

  // Secret Rare: same 1-in-45 chance
  if (secretRares.length > 0 && rollWithMultiplier(1 / 45, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(secretRares, 1)];
  }

  // Ultra Rare: same 1-in-18 chance
  if (ultraRares.length > 0 && rollWithMultiplier(1 / 18, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(ultraRares, 1)];
  }

  // BREAK cards: same 1-in-5 chance in pity packs.
  if (breakCards.length > 0 && rollWithMultiplier(1 / 5, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(breakCards, 1)];
  }

  // EX Pokémon: same 1-in-9 chance
  if (exCards.length > 0 && rollWithMultiplier(1 / 9, cooldownMultiplier)) {
    notePremiumHit(cooldownState, cooldownWasActive);
    return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(exCards, 1)];
  }

  // Guaranteed holo (fall back to non-holo rares only if the set has none)
  const pool = hasPlainRares(allCards)
    ? holoRares
    : (holoRares.length > 0 ? holoRares : rares);
  return [...commonCards, ...uncommonCards, ...rhSlot, ...pickRandom(pool, 1)];
}
