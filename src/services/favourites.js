/**
 * Favourites — persist a set of favourited card IDs to localStorage.
 * Uses a stable base card ID as the key.
 */

const KEY = 'pkmon_favourites';

export function toFavouriteKey(cardId) {
  const id = String(cardId ?? '');
  if (!id) return '';
  const gradedMarker = '__graded_';
  const idx = id.indexOf(gradedMarker);
  return idx === -1 ? id : id.slice(0, idx);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const normalized = new Set((Array.isArray(parsed) ? parsed : []).map(toFavouriteKey).filter(Boolean));
    if (normalized.size !== (Array.isArray(parsed) ? parsed.length : 0)) {
      save(normalized);
    }
    return normalized;
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
  return load().has(toFavouriteKey(cardId));
}

export function toggleFavourite(cardId) {
  const key = toFavouriteKey(cardId);
  if (!key) return false;
  const favs = load();
  if (favs.has(key)) {
    favs.delete(key);
  } else {
    favs.add(key);
  }
  save(favs);
  return favs.has(key);
}

export function removeFavourite(cardId) {
  const favs = load();
  favs.delete(toFavouriteKey(cardId));
  save(favs);
}
