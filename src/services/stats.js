/**
 * Pack stats — tracks per-set pack opening history and card pull counts.
 *
 * Stored in localStorage under 'pkmon_stats':
 * {
 *   [setId]: {
 *     packsOpened: number,          // total packs opened for this set
 *     cardPulls: { [cardId]: number } // how many times each card was pulled
 *   }
 * }
 */

const KEY = 'pkmon_stats';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

/** Record a full pack being opened for a set, with the cards that were pulled. */
export function recordPackOpened(setId, cards) {
  const data = load();
  if (!data[setId]) data[setId] = { packsOpened: 0, cardPulls: {} };
  data[setId].packsOpened += 1;
  for (const card of cards) {
    data[setId].cardPulls[card.id] = (data[setId].cardPulls[card.id] ?? 0) + 1;
  }
  save(data);
}

/** Get raw stats for a specific set. Returns null if no packs opened yet. */
export function getSetStats(setId) {
  return load()[setId] ?? null;
}

/** Get all stats. */
export function getAllStats() {
  return load();
}

/** Reset all stats (called from reset progress). */
export function resetStats() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

/**
 * Record the first time a set is fully completed.
 * Snapshots the current packsOpened count so it can be shown as
 * "packs to complete". Only written once — won't overwrite a previous completion.
 */
export function recordSetCompletion(setId) {
  const data = load();
  if (!data[setId]) data[setId] = { packsOpened: 0, cardPulls: {} };
  if (data[setId].packsAtCompletion == null) {
    data[setId].packsAtCompletion = data[setId].packsOpened;
    save(data);
  }
}
