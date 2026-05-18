import TCGdex from '@tcgdex/sdk';
import { cacheGet, cacheSet } from './cache.js';
import { getSetConfig, inferRarity } from './sets.js';

const sdk = new TCGdex('en');

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days – WotC sets never change

/**
 * Loads all cards for any registered set by its id (e.g. 'base1', 'jungle1').
 * Returns cached data immediately on subsequent calls.
 * First call for a set makes a single API request.
 */
export async function loadSetCards(setId) {
  const setConfig = getSetConfig(setId);
  if (!setConfig) throw new Error(`Unknown set id: "${setId}"`);

  const cacheKey = `set_${setId}_cards`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const set = await sdk.set.get(setId);
  if (!set || !set.cards) throw new Error(`Failed to load set "${setId}" from tcgdex.`);

  const rawCards = set.cards.map((resume) => ({
    id: resume.id,
    localId: resume.localId,
    name: resume.name,
    rarity: inferRarity(setConfig, resume.localId),
    image: resume.image ?? null,
    setId,
  }));

  // Derive the CDN base path (e.g. "https://assets.tcgdex.net/en/ecard/ecard2")
  // from the first card that actually has an image URL.
  const setBasePath = rawCards.find((c) => c.image)?.image.replace(/\/[^/]+$/, '') ?? null;

  // Helper: build a fallback image URL using the numeric part of a localId.
  const buildUrl = (numericPart) =>
    setBasePath ? `${setBasePath}/${numericPart}` : null;

  // --- Pass 1: deduplicate a/b variant cards (same art, different e-reader data).
  // Keep the first variant encountered for each base number; drop subsequent ones.
  const seenBase = new Set();
  const deduped = rawCards.filter((card) => {
    const isLetterSuffix = /^\d+[a-z]$/i.test(card.localId);
    if (!isLetterSuffix) return true;
    const base = card.localId.replace(/[a-z]+$/i, '');
    if (seenBase.has(base)) return false;
    seenBase.add(base);
    return true;
  });

  // --- Pass 2: fill in missing images.
  // H-prefix holos reuse the artwork of the same-numbered regular card.
  // a/b variants use the artwork of their base number.
  const imageByLocalId = new Map(
    deduped.filter((c) => c.image).map((c) => [c.localId, c.image])
  );
  const cards = deduped.map((card) => {
    if (card.image) return card;
    if (/^H/i.test(card.localId)) {
      // H01 → look up "1"
      const num = card.localId.replace(/^H0*/i, '') || '0';
      return { ...card, image: imageByLocalId.get(num) ?? buildUrl(num) };
    }
    if (/^\d+[a-z]$/i.test(card.localId)) {
      // 50a → use artwork for "50"
      const base = card.localId.replace(/[a-z]+$/i, '');
      return { ...card, image: buildUrl(base) };
    }
    return { ...card, image: buildUrl(card.localId) };
  });

  cacheSet(cacheKey, cards, CACHE_TTL);
  return cards;
}

/** Keep compatibility alias. */
export async function loadBaseSetCards() {
  return loadSetCards('base1');
}

/**
 * Fetches symbol image URLs for every set in one lightweight list call.
 * Returns a plain object { [setId]: symbolUrl }.
 * Cached for 30 days.
 */
export async function loadAllSetSymbols() {
  const cacheKey = 'all_set_symbols_v2';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const list = await sdk.set.list();
  const symbols = {};
  for (const s of list ?? []) {
    if (s.id && s.symbol) {
      symbols[s.id] = `${s.symbol}.webp`;
    }
  }
  cacheSet(cacheKey, symbols, CACHE_TTL);
  return symbols;
}

/**
 * Returns the full image URL for a card.
 * Falls back to the known tcgdex CDN pattern using the card's setId.
 */
export function getCardImageUrl(card, quality = 'high') {
  const base = card.image
    ?? `https://assets.tcgdex.net/en/base/${card.setId ?? 'base1'}/${card.localId}`;
  return `${base}/${quality}.webp`;
}
