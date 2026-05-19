import { useState, useCallback } from 'react';

function loadCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(key, collection) {
  localStorage.setItem(key, JSON.stringify(collection));
}

export function useCollection(storageKey = 'pokemon_collection') {
  const [collection, setCollection] = useState(() => loadCollection(storageKey));

  const addCards = useCallback((cards) => {
    setCollection((prev) => {
      const updated = prev.map((c) => ({ ...c }));
      for (const card of cards) {
        const existing = updated.find((c) => c.id === card.id);
        if (existing) {
          existing.count = (existing.count ?? 1) + 1;
        } else {
          updated.push({ ...card, count: 1 });
        }
      }
      persist(storageKey, updated);
      return updated;
    });
  }, [storageKey]);

  const sellCard = useCallback((cardId) => {
    setCollection((prev) => {
      const updated = prev
        .map((c) => (c.id === cardId ? { ...c, count: (c.count ?? 1) - 1 } : c))
        .filter((c) => (c.count ?? 0) > 0);
      persist(storageKey, updated);
      return updated;
    });
  }, [storageKey]);

  const resetCollection = useCallback(() => {
    localStorage.removeItem(storageKey);
    setCollection([]);
  }, [storageKey]);

  return { collection, addCards, sellCard, resetCollection };
}
