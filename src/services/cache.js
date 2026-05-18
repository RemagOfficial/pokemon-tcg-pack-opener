const CACHE_PREFIX = 'pkmon_cache_';
const DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheSet(key, data, ttl = DEFAULT_TTL) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, expires: Date.now() + ttl })
    );
  } catch (e) {
    // Storage may be full; silently skip caching
    console.warn('Cache write failed:', e.message);
  }
}

export function cacheClear(key) {
  localStorage.removeItem(CACHE_PREFIX + key);
}
