import { useState, useCallback } from 'react';

const COLLECTION_KEY = 'pokemon_collection';

function loadCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(collection) {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

export function useCollection() {
  const [collection, setCollection] = useState(loadCollection);

  const addCards = useCallback((cards) => {
    setCollection((prev) => {
      const updated = prev.map((c) => ({ ...c })); // shallow clone each entry
      for (const card of cards) {
        const existing = updated.find((c) => c.id === card.id);
        if (existing) {
          existing.count = (existing.count ?? 1) + 1;
        } else {
          updated.push({ ...card, count: 1 });
        }
      }
      persist(updated);
      return updated;
    });
  }, []);

  return { collection, addCards };
}
