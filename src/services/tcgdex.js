import TCGdex from '@tcgdex/sdk';
import { cacheGet, cacheSet } from './cache.js';
import { getSetConfig, inferRarity } from './sets.js';

const sdk = new TCGdex('en');

const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days - WotC sets never change
const CACHE_VERSION = 'v9'; // bump when card shape changes to invalidate old caches

/**
 * Normalise a TCGdex rarity string to one of: Common | Uncommon | Rare | Secret Rare
 * Holo status is tracked separately via the `holo` boolean field.
 */
function normalizeRarity(r) {
  if (!r) return null;
  if (r === 'Rare Holo')        return 'Rare';
  if (r === 'Rare Holo LV.X')  return 'Rare LV.X';
  return r;
}

/**
 * Fetch the variant flags and API rarity for a single card, cached per card.
 * Returns { holo: bool, normal: bool, apiRarity: string|null, types: string[]|null } or null on failure.
 */
async function fetchCardVariants(cardId) {
  const cacheKey = `cv2_${cardId}`;
  const cached = cacheGet(cacheKey);
  if (cached !== null) return cached === false ? null : cached;

  try {
    const detail = await sdk.card.get(cardId);
    const v = detail?.variants ?? null;
    const result = {
      holo:      v ? !!v.holo    : false,
      normal:    v ? !!v.normal  : true,
      reverse:   v ? !!v.reverse : false,
      apiRarity: detail?.rarity ?? null,
      types:     detail?.types  ?? null,
    };
    cacheSet(cacheKey, result, CACHE_TTL);
    return result;
  } catch {
    cacheSet(cacheKey, false, CACHE_TTL);
    return null;
  }
}

/**
 * Loads all cards for any registered set by its id (e.g. 'base1', 'jungle1').
 * Returns cached data immediately on subsequent calls.
 *
 * Card shape: { id, localId, name, rarity, holo, image, setId }
 *   rarity  - 'Common' | 'Uncommon' | 'Rare' | 'Secret Rare'
 *   holo    - boolean; true for cards printed with a holo treatment
 *
 * First call for a set:
 *   1. Fetches the set summary (card list) -- 1 API request
 *   2. Batch-fetches each card individually (max 20 concurrent) for
 *      variant + rarity info -- N requests, all cached per-card
 */
export async function loadSetCards(setId) {
  const setConfig = getSetConfig(setId);
  if (!setConfig) throw new Error(`Unknown set id: "${setId}"`);

  const cacheKey = `set_${setId}_cards_${CACHE_VERSION}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Step 1: set summary
  const set = await sdk.set.get(setId);
  if (!set || !set.cards) throw new Error(`Failed to load set "${setId}" from tcgdex.`);

  const rawCards = set.cards.map((resume) => ({
    id:      resume.id,
    localId: resume.localId,
    name:    resume.name,
    rarity:  inferRarity(setConfig, resume.localId), // preliminary; overridden in Step 5
    image:   resume.image ?? null,
    setId,
  }));

  // Derive CDN base path from the first card that has an image URL.
  const setBasePath = rawCards.find((c) => c.image)?.image.replace(/\/[^/]+$/, '') ?? null;
  const buildUrl = (n) => setBasePath ? `${setBasePath}/${n}` : null;

  // Dedup a/b letter-suffix cards (same art, different e-reader data).
  const seenBase = new Set();
  const deduped = rawCards.filter((card) => {
    const isLetterSuffix = /^\d+[a-z]$/i.test(card.localId);
    if (!isLetterSuffix) return true;
    const base = card.localId.replace(/[a-z]+$/i, '');
    if (seenBase.has(base)) return false;
    seenBase.add(base);
    return true;
  });

  // Step 2: batch-fetch per-card data (20 concurrent, each result cached individually)
  const BATCH = 20;
  const variantMap = new Map(); // cardId -> { holo, normal, apiRarity } | null
  for (let i = 0; i < deduped.length; i += BATCH) {
    const slice   = deduped.slice(i, i + BATCH);
    const results = await Promise.all(slice.map((c) => fetchCardVariants(c.id)));
    slice.forEach((c, j) => variantMap.set(c.id, results[j]));
  }

  // Step 3: group cards by name to detect holo+normal pairs
  // (e.g. neo2 has Yanma #17 holo-only AND Yanma #36 normal-only)
  const nameGroups = new Map();
  for (const card of deduped) {
    const key = card.name.toLowerCase();
    if (!nameGroups.has(key)) nameGroups.set(key, []);
    nameGroups.get(key).push(card);
  }

  // Step 4: image lookup maps
  const imageByLocalId = new Map(
    deduped.filter((c) => c.image).map((c) => [c.localId, c.image])
  );
  // Index the "normal" print image so holo cards can borrow the clean art
  // for the CSS holo overlay to render correctly.
  const imageByName = new Map();
  for (const card of deduped) {
    if (!card.image) continue;
    const vd = variantMap.get(card.id);
    // Skip holo-only cards (normal flag absent) so they don't overwrite the real normal art
    if (!vd?.holo || vd?.normal) {
      imageByName.set(card.name.toLowerCase(), card.image);
    }
  }

  // Step 5: assign final rarity, holo flag, and resolve missing images
  const cards = deduped.map((card) => {
    const vd      = variantMap.get(card.id); // { holo, normal, apiRarity } | null
    const nameKey = card.name.toLowerCase();
    const group   = nameGroups.get(nameKey) ?? [];

    // --- Rarity (normalised, holo stripped out) ---
    let rarity;
    if (vd?.apiRarity) {
      rarity = normalizeRarity(vd.apiRarity) ?? card.rarity;
    } else {
      // inferRarity fallback: map holo-specific strings to 'Rare'
      const inf = card.rarity;
      rarity = (inf === 'Rare Holo' || inf === 'Holo Variant') ? 'Rare' : (inf ?? 'Common');
    }
    // Pokemon-ex detection: names containing ' ex' at end or followed by space/δ (e.g. 'Blaziken ex', 'Altaria ex δ')
    if (/\sex(\s|$)/i.test(card.name)) rarity = 'Rare ex';

    // Cards numbered above the set's official total are secret rares regardless of API data
    const numericId = parseInt(card.localId, 10);
    if (!isNaN(numericId) && setConfig?.totalCards && numericId > setConfig.totalCards) {
      rarity = 'Secret Rare';
    }

    // Stormfront Shiny cards (localId 'SH1', 'SH2', etc.) share TCGdex rarity
    // "Rare Holo LV.X" with actual LV.X cards but are a distinct rarity tier.
    if (/^SH\d/i.test(card.localId)) rarity = 'Rare Shiny';

    // --- Holo flag ---
    // LV.X and Shiny cards are always holofoil; force holo even for the API-less
    // fallback path where vd is null.
    const isHolo = (rarity === 'Rare LV.X' || rarity === 'Rare Shiny')
      ? true
      : vd !== null
        ? vd.holo === true
        : /^H/i.test(card.localId) || card.rarity === 'Rare Holo' || card.rarity === 'Holo Variant';

    // --- Image ---
    // Holo cards that have a separate normal-print partner share that card's image
    // so the CSS holo overlay sits on top of a clean, unfoiled version of the art.
    let image = card.image;
    if (isHolo) {
      const hasNormalPair = group.some((other) => {
        const ov = variantMap.get(other.id);
        return other.id !== card.id && ov?.normal;
      });
      const normalImage = imageByName.get(nameKey)
        ?? imageByLocalId.get(card.localId)
        ?? buildUrl(card.localId);
      image = hasNormalPair ? normalImage : (card.image ?? normalImage);
    } else if (!image) {
      if (/^H/i.test(card.localId)) {
        const byName = imageByName.get(nameKey);
        if (byName) image = byName;
        else {
          const num = card.localId.replace(/^H0*/i, '') || '0';
          image = imageByLocalId.get(num) ?? buildUrl(num);
        }
      } else if (/^\d+[a-z]$/i.test(card.localId)) {
        const base = card.localId.replace(/[a-z]+$/i, '');
        image = buildUrl(base);
      } else {
        image = buildUrl(card.localId);
      }
    }

    return { ...card, rarity, holo: isHolo, image, types: vd?.types ?? null };
  });

  // Step 6: generate reverse holo entries for cards that have a reverse variant.
  // Each gets id '<originalId>_rh', reverseHolo: true, holo: false.
  // EX Pokemon (Rare ex) never appear in the reverse holo slot.
  const reverseHoloCards = cards
    .filter((card) => {
      const vd = variantMap.get(card.id);
      return vd?.reverse === true && card.rarity !== 'Rare ex' && card.rarity !== 'Rare LV.X' && card.rarity !== 'Rare Shiny' && card.rarity !== 'Secret Rare';
    })
    .map((card) => ({ ...card, id: card.id + '_rh', reverseHolo: true, holo: false }));

  let allCards = reverseHoloCards.length > 0 ? [...cards, ...reverseHoloCards] : [...cards];

  // Merge additional TCGdex sets into this one (e.g. exu Unown into ex10)
  if (setConfig.mergeSets?.length) {
    for (const mergeSetId of setConfig.mergeSets) {
      try {
        const mergeSet = await sdk.set.get(mergeSetId);
        if (!mergeSet?.cards) continue;

        const mergeRaw = mergeSet.cards.map((resume) => ({
          id:      resume.id,
          localId: resume.localId,
          name:    resume.name,
          rarity:  'Common',       // placeholder; overridden below
          image:   resume.image ?? null,
          setId,                   // treat as belonging to the main set
        }));

        // Batch-fetch variants for merge cards
        const mergeVariantMap = new Map();
        for (let i = 0; i < mergeRaw.length; i += BATCH) {
          const slice   = mergeRaw.slice(i, i + BATCH);
          const results = await Promise.all(slice.map((c) => fetchCardVariants(c.id)));
          slice.forEach((c, j) => mergeVariantMap.set(c.id, results[j]));
        }

        // Assign rarity, holo — same rules as main pipeline
        const mergeCards = mergeRaw.map((card) => {
          const vd = mergeVariantMap.get(card.id);
          let rarity;
          if (vd?.apiRarity) {
            rarity = normalizeRarity(vd.apiRarity) ?? 'Common';
          } else {
            rarity = 'Common';
          }
          if (/\sex(\s|$)/i.test(card.name)) rarity = 'Rare ex';
          const numericId = parseInt(card.localId, 10);
          if (!isNaN(numericId) && setConfig?.totalCards && numericId > setConfig.totalCards) {
            rarity = 'Secret Rare';
          }
          const isHolo = vd !== null ? vd.holo === true : false;
          return { ...card, rarity, holo: isHolo, types: vd?.types ?? null };
        });

        // Reverse holos for merge cards
        const mergeRH = mergeCards
          .filter((card) => {
            const vd = mergeVariantMap.get(card.id);
            return vd?.reverse === true && card.rarity !== 'Rare ex' && card.rarity !== 'Rare LV.X' && card.rarity !== 'Rare Shiny' && card.rarity !== 'Secret Rare';
          })
          .map((card) => ({ ...card, id: card.id + '_rh', reverseHolo: true, holo: false }));

        allCards.push(...mergeCards, ...mergeRH);
      } catch (e) {
        console.warn(`Failed to merge set ${mergeSetId} into ${setId}:`, e);
      }
    }
  }

  cacheSet(cacheKey, allCards, CACHE_TTL);
  return allCards;
}

/** Keep compatibility alias. */
export async function loadBaseSetCards() {
  return loadSetCards('base1');
}

/**
 * Fetches symbol image URLs for every set in one lightweight list call.
 * Returns a plain object { [setId]: symbolUrl }
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