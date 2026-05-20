/**
 * Pity system for Economy mode.
 *
 * Tracks how many consecutive packs have been opened without a "hit"
 * (holo, EX Pokémon, or Secret Rare) per set. When the counter reaches
 * PITY_THRESHOLD the next pack is guaranteed to contain at least a holo.
 */

export const PITY_THRESHOLD = 10;

const KEY = 'pkmon_pity';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

/** Returns current pity count for the given set. */
export function getPityCount(setId) {
  return load()[setId] ?? 0;
}

/** Returns true when pity is triggered (guaranteed holo on next pack). */
export function isPityTriggered(setId) {
  return getPityCount(setId) >= PITY_THRESHOLD;
}

/**
 * Call after each pack open with whether the pack contained a hit.
 * Resets to 0 on a hit, increments by 1 on a miss.
 * Returns the new counter value.
 */
export function updatePity(setId, hasHit) {
  const data = load();
  data[setId] = hasHit ? 0 : (data[setId] ?? 0) + 1;
  save(data);
  return data[setId];
}

/** Load the full counter map (for initialising React state). */
export function loadPityCounters() {
  return load();
}

/** Save the full counter map (for React state → localStorage sync). */
export function savePityCounters(counters) {
  save(counters);
}
