/**
 * Favourites — persist a set of favourited card IDs to localStorage.
 * Uses the card's full ID (e.g. 'ex1-4', 'ex1-4_rh') as the key.
 */

const KEY = 'pkmon_favourites';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function save(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch { /* ignore */ }
}

export function getFavourites() {
  return load();
}

export function isFavourited(cardId) {
  return load().has(cardId);
}

export function toggleFavourite(cardId) {
  const favs = load();
  if (favs.has(cardId)) {
    favs.delete(cardId);
  } else {
    favs.add(cardId);
  }
  save(favs);
  return favs.has(cardId);
}

export function removeFavourite(cardId) {
  const favs = load();
  favs.delete(cardId);
  save(favs);
}
