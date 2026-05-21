import { useState, useCallback } from 'react';
import { rollGrade } from '../services/grading.js';

function isMegaExName(name) {
  if (!name) return false;
  return /^M[\s-].*(?:\s|-)ex(?:\s|$)/i.test(name);
}

function isExFamilyCard(card) {
  if (!card) return false;
  return card.rarity === 'Rare ex'
    || card.megaEx === true
    || /(?:\s|-)ex(?:\s|$)/i.test(String(card.name ?? ''));
}

function getExVariantKey(card) {
  const setId = String(card.setId ?? '');
  const name = String(card.name ?? '').trim().toLowerCase();
  const localId = String(card.localId ?? '').replace(/[a-z]+$/i, '');
  const mega = card.megaEx ? '1' : '0';
  return `${setId}|${name}|${localId}|${mega}`;
}

function normalizeCollection(rawCollection) {
  const list = Array.isArray(rawCollection) ? rawCollection : [];
  const normalized = list.map((card) => {
    const count = Math.max(1, card.count ?? 1);
    const next = { ...card, count };

    // Backfill modern EX semantics for legacy saved cards.
    if (next.rarity === 'Rare ex') {
      next.holo = true;
      if (typeof next.megaEx !== 'boolean') {
        next.megaEx = isMegaExName(next.name);
      }
    }

    // Migrate legacy single-grade format to per-grade counts.
    if (!next.graded && typeof next.grade === 'number') {
      next.graded = { [next.grade]: count };
      delete next.grade;
      delete next.gradedAt;
    }

    if (next.graded && typeof next.graded === 'object') {
      const cleaned = {};
      for (const [g, qty] of Object.entries(next.graded)) {
        const grade = Number(g);
        const q = Number(qty) || 0;
        if (grade >= 1 && grade <= 10 && q > 0) cleaned[grade] = q;
      }
      next.graded = cleaned;
    }

    return next;
  });

  // Reverse EX/MEGA EX variants are not supported in-game. Merge them into base cards.
  const mergedById = new Map();
  const canonicalExIdByKey = new Map();
  for (const card of normalized) {
    const next = { ...card };
    if (next.reverseHolo === true && isExFamilyCard(next)) {
      const idText = String(next.id ?? '');
      next.id = idText.endsWith('_rh') ? idText.slice(0, -3) : idText;
      next.reverseHolo = false;
      next.holo = true;
      if (typeof next.megaEx !== 'boolean') next.megaEx = isMegaExName(next.name);
    }

    if (isExFamilyCard(next)) {
      const key = getExVariantKey(next);
      const canonicalId = canonicalExIdByKey.get(key);
      if (canonicalId) {
        next.id = canonicalId;
      } else {
        canonicalExIdByKey.set(key, next.id);
      }
    }

    const existing = mergedById.get(next.id);
    if (!existing) {
      mergedById.set(next.id, next);
      continue;
    }

    existing.count = (existing.count ?? 1) + (next.count ?? 1);
    if (next.holo) existing.holo = true;
    if (next.megaEx) existing.megaEx = true;

    const mergedGrades = { ...(existing.graded ?? {}) };
    for (const [grade, qty] of Object.entries(next.graded ?? {})) {
      mergedGrades[grade] = (mergedGrades[grade] ?? 0) + (Number(qty) || 0);
    }
    if (Object.keys(mergedGrades).length > 0) existing.graded = mergedGrades;
  }

  return [...mergedById.values()];
}

function loadCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const normalized = normalizeCollection(parsed);
    // Persist one-time migrations so UI and filters use updated card flags immediately.
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(key, JSON.stringify(normalized));
    }
    return normalized;
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

  const sellCard = useCallback((cardId, opts = {}) => {
    const card = collection.find((c) => c.id === cardId);
    if (!card) return false;

    const count = (card.count ?? 1);
    const graded = { ...(card.graded ?? {}) };
    const gradedTotal = Object.values(graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    const ungradedCount = Math.max(0, count - gradedTotal);

    let willSell = false;
    if (opts?.grade != null) {
      // Allow selling graded if: multiple graded copies exist OR ungraded copies exist to preserve card
      willSell = (graded[String(opts.grade)] ?? 0) > 0 && (gradedTotal > 1 || ungradedCount > 0);
    } else if (ungradedCount > 0) {
      willSell = true;
    } else if (gradedTotal > 1) {
      // All copies graded: can sell from the lowest grade bucket only if multiple graded copies exist
      willSell = true;
    }

    if (!willSell) return false;

    setCollection((prev) => {
      const updated = prev
        .map((c) => {
          if (c.id !== cardId) return c;

          const count = (c.count ?? 1);
          const graded = { ...(c.graded ?? {}) };
          const gradedTotal = Object.values(graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
          const ungradedCount = Math.max(0, count - gradedTotal);
          let nextCount = count;

          if (opts?.grade != null) {
            const key = String(opts.grade);
            if ((graded[key] ?? 0) > 0 && (gradedTotal > 1 || ungradedCount > 0)) {
              graded[key] -= 1;
              if (graded[key] <= 0) delete graded[key];
              nextCount -= 1;
            }
          } else if (ungradedCount > 0) {
            nextCount -= 1;
          } else {
            const keys = Object.keys(graded).map(Number).sort((a, b) => a - b);
            if (keys.length > 0 && gradedTotal > 1) {
              const key = String(keys[0]);
              graded[key] -= 1;
              if (graded[key] <= 0) delete graded[key];
              nextCount -= 1;
            }
          }

          const next = { ...c, count: nextCount };
          if (Object.keys(graded).length > 0) next.graded = graded;
          else delete next.graded;
          return next;
        })
        .filter((c) => (c.count ?? 0) > 0);
      persist(storageKey, updated);
      return updated;
    });
    return true;
  }, [collection, storageKey]);

  const gradeCard = useCallback((cardId, forcedGrade) => {
    const current = collection.find((c) => c.id === cardId);
    if (!current) return null;
    const graded = { ...(current.graded ?? {}) };
    const gradedTotal = Object.values(graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    const count = current.count ?? 1;
    const ungradedCount = Math.max(0, count - gradedTotal);
    if (ungradedCount <= 0) return null;

    const grade = Number(forcedGrade) >= 1 && Number(forcedGrade) <= 10
      ? Number(forcedGrade)
      : rollGrade(current);

    setCollection((prev) => {
      const updated = prev.map((c) => (
        c.id === cardId
          ? {
              ...c,
              graded: {
                ...(c.graded ?? {}),
                [grade]: ((c.graded?.[grade] ?? 0) + 1),
              },
            }
          : c
      ));
      persist(storageKey, updated);
      return updated;
    });
    return grade;
  }, [collection, storageKey]);

  const devSetCardGrade = useCallback((cardId, forcedGrade) => {
    const grade = Number(forcedGrade);
    if (!Number.isInteger(grade) || grade < 1 || grade > 10) return false;

    const current = collection.find((c) => c.id === cardId);
    if (!current) return false;
    if ((current.count ?? 0) <= 0) return false;

    setCollection((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== cardId) return c;

        const count = c.count ?? 1;
        const graded = { ...(c.graded ?? {}) };
        const gradedTotal = Object.values(graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        const ungradedCount = Math.max(0, count - gradedTotal);

        if (ungradedCount <= 0) {
          const sourceGrades = Object.keys(graded).map(Number).sort((a, b) => a - b);
          if (sourceGrades.length === 0) return c;
          const source = String(sourceGrades[0]);
          graded[source] -= 1;
          if (graded[source] <= 0) delete graded[source];
        }

        graded[grade] = (graded[grade] ?? 0) + 1;
        return { ...c, graded };
      });

      persist(storageKey, updated);
      return updated;
    });

    return true;
  }, [collection, storageKey]);

  const resetCollection = useCallback(() => {
    localStorage.removeItem(storageKey);
    setCollection([]);
  }, [storageKey]);

  return { collection, addCards, sellCard, gradeCard, devSetCardGrade, resetCollection };
}
