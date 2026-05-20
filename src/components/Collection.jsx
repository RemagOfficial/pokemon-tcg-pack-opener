import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import PokemonCard from './PokemonCard.jsx';
import CardModal from './CardModal.jsx';
import { SETS } from '../services/sets.js';
import { getFavourites } from '../services/favourites.js';
import './Collection.css';
import './SetSelector.css';

const ALL_SERIES = [...new Set(SETS.map((s) => s.series))];
const ALL_YEARS = [...new Set(SETS.map((s) => s.year))].sort();

function toggleSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

const RARITIES = ['All', 'Holo', 'EX', 'Rare', 'Uncommon', 'Common'];

const TYPE_COLORS = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Grass: '#22c55e',
  Lightning: '#eab308',
  Fighting: '#ea580c',
  Psychic: '#a855f7',
  Colorless: '#94a3b8',
  Darkness: '#475569',
  Metal: '#9ca3af',
  Dragon: '#0ea5e9',
  Fairy: '#ec4899',
};

const sortScore = (card) => {
  if (card.rarity === 'Rare Shiny') return -1;
  if (card.rarity === 'Secret Rare') return 0;
  if (card.rarity === 'Rare ex') return 1;
  if (card.rarity === 'Rare LV.X') return 1;
  if (card.holo && card.rarity === 'Rare') return 2;
  if (card.reverseHolo && card.rarity === 'Rare') return 3;
  if (!card.holo && !card.reverseHolo && card.rarity === 'Rare') return 4;
  if (card.reverseHolo) return 5;
  if (card.holo) return 6;
  if (card.rarity === 'Uncommon') return 7;
  if (card.rarity === 'Common') return 8;
  return 9;
};

const gradedCount = (card) => {
  if (card?.graded) {
    return Object.values(card.graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
  }
  if (typeof card?.grade === 'number') return card.count ?? 1;
  return 0;
};

const FILTER_CLASS = {
  All: 'filter-tab--all',
  Holo: 'filter-tab--rare-holo',
  EX: 'filter-tab--rare',
  Rare: 'filter-tab--rare',
  Uncommon: 'filter-tab--uncommon',
  Common: 'filter-tab--common',
  'Secret Rare': 'filter-tab--secret-rare',
  'Rare LV.X': 'filter-tab--rare-lvx',
  'Rare Shiny': 'filter-tab--rare-shiny',
  Graded: 'filter-tab--graded',
};

export default function Collection({
  collection,
  loadedSets = {},
  setSymbols = {},
  onLoadSet,
  economyMode = false,
  onSellCard,
  onGradeCard,
  getCardSellPrice,
}) {
  const [activeSetId, setActiveSetId] = useState(null);
  const [hideComplete, setHideComplete] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rarity');
  const [filterType, setFilterType] = useState(null);
  const [viewMode, setViewMode] = useState('collection');
  const [modalCard, setModalCard] = useState(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [selSeries, setSelSeries] = useState(new Set());
  const [selYears, setSelYears] = useState(new Set());
  const [setSearch, setSetSearch] = useState('');

  const [favouriteIds, setFavouriteIds] = useState(() => getFavourites());

  const filterPopupRef = useRef(null);

  const refreshFavourites = useCallback(() => setFavouriteIds(getFavourites()), []);
  const activeFilterCount = selSeries.size + selYears.size + (hideComplete ? 1 : 0);
  const clearAllFilters = () => {
    setSelSeries(new Set());
    setSelYears(new Set());
    setHideComplete(false);
  };

  useEffect(() => {
    if (!showFilter) return;
    const handler = (e) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showFilter]);

  const ownedIds = useMemo(() => new Set(collection.map((c) => c.id)), [collection]);
  const isFavouritesView = activeSetId === '__favourites__';

  const setCards = useMemo(
    () => (isFavouritesView ? [] : collection.filter((c) => (c.setId ?? 'base1') === activeSetId)),
    [collection, activeSetId, isFavouritesView],
  );

  const activeFavCards = useMemo(
    () => (isFavouritesView ? collection.filter((c) => favouriteIds.has(c.id)) : []),
    [isFavouritesView, collection, favouriteIds],
  );

  const activeSetCards = isFavouritesView ? activeFavCards : setCards;

  useEffect(() => {
    if (!modalCard) return;
    const fresh = activeSetCards.find((c) => c.id === modalCard.id);
    if (fresh && fresh !== modalCard) setModalCard(fresh);
  }, [modalCard, activeSetCards]);

  useEffect(() => {
    if (!activeSetId || isFavouritesView || viewMode !== 'checklist') {
      setIsLoadingChecklist(false);
      return;
    }
    if (loadedSets[activeSetId]) {
      setIsLoadingChecklist(false);
      return;
    }
    if (!onLoadSet) return;

    let cancelled = false;
    setIsLoadingChecklist(true);
    Promise.resolve(onLoadSet(activeSetId)).finally(() => {
      if (!cancelled) setIsLoadingChecklist(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeSetId, isFavouritesView, viewMode, loadedSets, onLoadSet]);

  const availableTypes = useMemo(() => {
    const typeSet = new Set();
    for (const card of activeSetCards) {
      if (card.types?.length) card.types.forEach((t) => typeSet.add(t));
    }
    return [...typeSet].sort();
  }, [activeSetCards]);

  const displayed = useMemo(() => {
    let base;
    if (filter === 'All') base = activeSetCards;
    else if (filter === 'Holo') base = activeSetCards.filter((c) => c.holo === true || c.reverseHolo === true);
    else if (filter === 'EX') base = activeSetCards.filter((c) => c.rarity === 'Rare ex');
    else if (filter === 'Graded') {
      base = activeSetCards.flatMap((c) => {
        if (!c.graded && typeof c.grade === 'number') {
          const totalGraded = c.count ?? 1;
          const totalUngraded = Math.max(0, (c.count ?? 1) - totalGraded);
          return [{
            ...c,
            id: `${c.id}__graded_${c.grade}`,
            baseCardId: c.id,
            grade: Number(c.grade),
            count: c.count ?? 1,
            totalGraded,
            totalUngraded,
          }];
        }
        if (!c.graded) return [];
        const totalGraded = Object.values(c.graded).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        const totalUngraded = Math.max(0, (c.count ?? 1) - totalGraded);
        return Object.entries(c.graded)
          .filter(([, qty]) => (Number(qty) || 0) > 0)
          .map(([grade, qty]) => ({
            ...c,
            id: `${c.id}__graded_${grade}`,
            baseCardId: c.id,
            grade: Number(grade),
            count: Number(qty),
            totalGraded,
            totalUngraded,
          }));
      });
    } else {
      base = activeSetCards.filter((c) => c.rarity === filter);
    }

    if (filter !== 'Graded') {
      base = base.map((c) => {
        const totalGraded = Object.values(c.graded ?? {}).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
        const totalUngraded = Math.max(0, (c.count ?? 1) - totalGraded);
        return { ...c, totalGraded, totalUngraded };
      });
    }

    if (filterType !== null) {
      base = base.filter((c) => c.types?.includes(filterType));
    }

    return [...base].sort((a, b) => {
      if (sortBy === 'count') {
        return (b.count ?? 1) - (a.count ?? 1) || sortScore(a) - sortScore(b) || a.name.localeCompare(b.name);
      }
      if (filter === 'Graded') {
        return (b.grade ?? 0) - (a.grade ?? 0) || a.name.localeCompare(b.name);
      }
      return sortScore(a) - sortScore(b) || a.name.localeCompare(b.name);
    });
  }, [activeSetCards, filter, sortBy, filterType]);

  const checklistCards = useMemo(() => {
    const cards = loadedSets[activeSetId];
    if (!cards) return null;
    return [...cards].sort((a, b) => parseInt(a.localId, 10) - parseInt(b.localId, 10));
  }, [loadedSets, activeSetId]);

  const ownedOfficialBySet = useMemo(() => {
    const result = {};
    for (const card of collection) {
      const sid = card.setId ?? 'base1';
      if (card.rarity === 'Secret Rare' || card.rarity === 'Rare Shiny') continue;
      result[sid] = (result[sid] ?? 0) + 1;
    }
    return result;
  }, [collection]);

  const ownedTotalBySet = useMemo(() => {
    const result = {};
    for (const card of collection) {
      const sid = card.setId ?? 'base1';
      result[sid] = (result[sid] ?? 0) + 1;
    }
    return result;
  }, [collection]);

  const visibleSets = useMemo(() => {
    return SETS.filter((set) => {
      if (selSeries.size > 0 && !selSeries.has(set.series)) return false;
      if (selYears.size > 0 && !selYears.has(set.year)) return false;
      if (setSearch.trim()) {
        const q = setSearch.trim().toLowerCase();
        const hay = `${set.name} ${set.series} ${set.year}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (!hideComplete) return true;
      const owned = ownedOfficialBySet[set.id] ?? 0;
      const total = (loadedSets[set.id]?.filter((c) => c.rarity !== 'Secret Rare' && c.rarity !== 'Rare Shiny').length) ?? set.totalCards;
      return !(owned > 0 && owned >= total);
    });
  }, [selSeries, selYears, setSearch, hideComplete, ownedOfficialBySet, loadedSets]);

  if (!activeSetId) {
    return (
      <>
        <div className="coll-screen">
          <div className="coll-screen__header">
            <h2 className="coll-screen__title">Collection</h2>
            <div className="coll-bar-row">
              <div className="ss-filter-bar ss-filter-bar--fullwidth">
                <button
                  className={`ss-filter-btn${activeFilterCount > 0 ? ' ss-filter-btn--active' : ''}`}
                  onClick={() => setShowFilter((v) => !v)}
                  aria-expanded={showFilter}
                >
                  <span>Filter</span>
                  {activeFilterCount > 0 && <span className="ss-filter-badge">{activeFilterCount}</span>}
                </button>
                <input
                  className="ss-search-input"
                  type="text"
                  placeholder="Search sets by name, series, or year..."
                  value={setSearch}
                  onChange={(e) => setSetSearch(e.target.value)}
                />
                {activeFilterCount > 0 && (
                  <div className="ss-chips">
                    {[...selSeries].map((s) => (
                      <button key={s} className="ss-chip" onClick={() => setSelSeries(toggleSet(selSeries, s))}>{s} &times;</button>
                    ))}
                    {[...selYears].map((y) => (
                      <button key={y} className="ss-chip" onClick={() => setSelYears(toggleSet(selYears, y))}>{y} &times;</button>
                    ))}
                    {hideComplete && (
                      <button className="ss-chip" onClick={() => setHideComplete(false)}>Hide completed &times;</button>
                    )}
                    <button className="ss-chip ss-chip--clear" onClick={clearAllFilters}>Clear all</button>
                  </div>
                )}
                {showFilter && (
                  <div className="ss-popup" ref={filterPopupRef}>
                    <div className="ss-popup__section">
                      <span className="ss-popup__label">Series</span>
                      <div className="ss-popup__options">
                        {ALL_SERIES.map((s) => (
                          <button key={s} className={`ss-option${selSeries.has(s) ? ' ss-option--on' : ''}`} onClick={() => setSelSeries(toggleSet(selSeries, s))}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="ss-popup__divider" />
                    <div className="ss-popup__section">
                      <span className="ss-popup__label">Year</span>
                      <div className="ss-popup__options ss-popup__options--years">
                        {ALL_YEARS.map((y) => (
                          <button key={y} className={`ss-option${selYears.has(y) ? ' ss-option--on' : ''}`} onClick={() => setSelYears(toggleSet(selYears, y))}>{y}</button>
                        ))}
                      </div>
                    </div>
                    <div className="ss-popup__divider" />
                    <div className="ss-popup__section">
                      <span className="ss-popup__label">Set Progress</span>
                      <div className="ss-popup__options">
                        <button
                          className={`ss-option${hideComplete ? ' ss-option--on' : ''}`}
                          onClick={() => setHideComplete((v) => !v)}
                        >
                          Hide completed sets
                        </button>
                      </div>
                    </div>
                    {activeFilterCount > 0 && (
                      <>
                        <div className="ss-popup__divider" />
                        <button className="ss-popup__clear" onClick={() => { clearAllFilters(); setShowFilter(false); }}>Clear all filters</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="coll-set-list">
            {favouriteIds.size > 0 && (
              <button
                className="coll-set-card coll-set-card--favourites"
                style={{ '--accent': '#f43f5e' }}
                onClick={() => {
                  setActiveSetId('__favourites__');
                  setFilter('All');
                  setFilterType(null);
                  setViewMode('collection');
                }}
              >
                <div className="coll-set-card__symbol-wrap">
                  <span className="coll-set-card__symbol">&#x2665;</span>
                </div>
                <div className="coll-set-card__body">
                  <span className="coll-set-card__name">Favourites</span>
                  <span className="coll-set-card__year">Your favourited cards</span>
                  <div className="coll-set-card__bar">
                    <div className="coll-set-card__bar-fill" style={{ width: '100%', background: '#f43f5e' }} />
                  </div>
                </div>
                <div className="coll-set-card__meta">
                  <span className="coll-set-card__count">{favouriteIds.size} card{favouriteIds.size !== 1 ? 's' : ''}</span>
                </div>
                <span className="coll-set-card__arrow">&#8250;</span>
              </button>
            )}

            {visibleSets.map((set) => {
              const owned = ownedOfficialBySet[set.id] ?? 0;
              const total = (loadedSets[set.id]?.filter((c) => c.rarity !== 'Secret Rare' && c.rarity !== 'Rare Shiny').length) ?? set.totalCards;
              const complete = owned > 0 && owned >= total;
              const pct = total > 0 ? Math.min((owned / total) * 100, 100) : 0;
              return (
                <button
                  key={set.id}
                  className={`coll-set-card${complete ? ' coll-set-card--complete' : ''}`}
                  style={{ '--accent': set.accentColor }}
                  onClick={() => {
                    setActiveSetId(set.id);
                    setFilter('All');
                    setFilterType(null);
                    setViewMode('collection');
                  }}
                >
                  <div className="coll-set-card__symbol-wrap">
                    {setSymbols[set.id]
                      ? <img className="coll-set-card__symbol-img" src={setSymbols[set.id]} alt="" />
                      : <span className="coll-set-card__symbol">{set.symbol}</span>}
                  </div>
                  <div className="coll-set-card__body">
                    <span className="coll-set-card__name">{set.name}</span>
                    <span className="coll-set-card__year">{set.year}</span>
                    <div className="coll-set-card__bar">
                      <div
                        className={`coll-set-card__bar-fill${complete ? ' coll-set-card__bar-fill--done' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="coll-set-card__meta">
                    <span className={`coll-set-card__count${complete ? ' coll-set-card__count--done' : ''}`}>
                      {complete ? '✓ ' : ''}{ownedTotalBySet[set.id] ?? 0} / {total}
                    </span>
                  </div>
                  <span className="coll-set-card__arrow">&#8250;</span>
                </button>
              );
            })}
          </div>
        </div>

        {modalCard && (
          <CardModal
            card={modalCard}
            onClose={() => setModalCard(null)}
            onFavouriteChange={refreshFavourites}
            onGradeCard={onGradeCard}
          />
        )}
      </>
    );
  }

  const setConfig = isFavouritesView ? null : SETS.find((s) => s.id === activeSetId);
  const checklistOfficialCount = checklistCards
    ? checklistCards.filter((c) => c.rarity !== 'Secret Rare' && c.rarity !== 'Rare Shiny').length
    : setConfig?.totalCards ?? 0;
  const officialOwnedCount = activeSetCards.filter((c) => c.rarity !== 'Secret Rare' && c.rarity !== 'Rare Shiny').length;
  const totalCards = activeSetCards.reduce((sum, c) => sum + (c.count ?? 1), 0);

  const hasSecretRare = activeSetCards.some((c) => c.rarity === 'Secret Rare');
  const hasLvx = activeSetCards.some((c) => c.rarity === 'Rare LV.X');
  const hasShiny = activeSetCards.some((c) => c.rarity === 'Rare Shiny');
  const hasGraded = activeSetCards.some((c) => gradedCount(c) > 0);

  return (
    <>
      <div className="collection">
        <div className="collection__header">
          <div className="collection__header-top">
            <button className="coll-back-btn" onClick={() => { setActiveSetId(null); setFilterType(null); }}>‹ Back</button>

            <div className="collection__stats">
              <span><strong>{activeSetCards.length}</strong><em> unique</em></span>
              <span className="collection__divider">•</span>
              <span><strong>{totalCards}</strong><em> total</em></span>
              {!isFavouritesView && (
                <>
                  <span className="collection__divider">•</span>
                  <span><strong>{officialOwnedCount} / {checklistOfficialCount}</strong><em> set progress</em></span>
                </>
              )}
            </div>

            {!isFavouritesView && (
              <div className="collection__view-toggle" role="group" aria-label="Collection view mode">
                <button
                  className={`view-toggle-btn${viewMode === 'collection' ? ' view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('collection')}
                >
                  My Cards
                </button>
                <button
                  className={`view-toggle-btn${viewMode === 'checklist' ? ' view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('checklist')}
                >
                  Checklist
                </button>
              </div>
            )}
          </div>

          {viewMode === 'collection' && (
            <>
              <div className="collection__filters-row">
                <div className="collection__filters">
                  {RARITIES.map((rarityKey) => (
                    <button
                      key={rarityKey}
                      className={`filter-tab ${FILTER_CLASS[rarityKey]}${filter === rarityKey ? ' filter-tab--active' : ''}`}
                      onClick={() => setFilter(rarityKey)}
                    >
                      {rarityKey}
                      <span className="filter-tab__count">
                        {rarityKey === 'All'
                          ? activeSetCards.length
                          : rarityKey === 'Holo'
                            ? activeSetCards.filter((c) => c.holo === true || c.reverseHolo === true).length
                            : rarityKey === 'EX'
                              ? activeSetCards.filter((c) => c.rarity === 'Rare ex').length
                              : activeSetCards.filter((c) => c.rarity === rarityKey).length}
                      </span>
                    </button>
                  ))}

                  {hasSecretRare && (
                    <button
                      className={`filter-tab ${FILTER_CLASS['Secret Rare']}${filter === 'Secret Rare' ? ' filter-tab--active' : ''}`}
                      onClick={() => setFilter('Secret Rare')}
                    >
                      Secret Rare
                      <span className="filter-tab__count">{activeSetCards.filter((c) => c.rarity === 'Secret Rare').length}</span>
                    </button>
                  )}

                  {hasLvx && (
                    <button
                      className={`filter-tab ${FILTER_CLASS['Rare LV.X']}${filter === 'Rare LV.X' ? ' filter-tab--active' : ''}`}
                      onClick={() => setFilter('Rare LV.X')}
                    >
                      LV.X
                      <span className="filter-tab__count">{activeSetCards.filter((c) => c.rarity === 'Rare LV.X').length}</span>
                    </button>
                  )}

                  {hasShiny && (
                    <button
                      className={`filter-tab ${FILTER_CLASS['Rare Shiny']}${filter === 'Rare Shiny' ? ' filter-tab--active' : ''}`}
                      onClick={() => setFilter('Rare Shiny')}
                    >
                      Shiny
                      <span className="filter-tab__count">{activeSetCards.filter((c) => c.rarity === 'Rare Shiny').length}</span>
                    </button>
                  )}

                  {hasGraded && (
                    <button
                      className={`filter-tab ${FILTER_CLASS.Graded}${filter === 'Graded' ? ' filter-tab--active' : ''}`}
                      onClick={() => setFilter('Graded')}
                    >
                      Graded
                      <span className="filter-tab__count">{activeSetCards.reduce((sum, c) => sum + gradedCount(c), 0)}</span>
                    </button>
                  )}
                </div>

                <div className="collection__sort-toggle" role="group" aria-label="Sort order">
                  <button
                    className={`sort-btn${sortBy === 'rarity' ? ' sort-btn--active' : ''}`}
                    onClick={() => setSortBy('rarity')}
                  >
                    Rarity
                  </button>
                  <button
                    className={`sort-btn${sortBy === 'count' ? ' sort-btn--active' : ''}`}
                    onClick={() => setSortBy('count')}
                  >
                    Count
                  </button>
                </div>
              </div>

              {economyMode && !isFavouritesView && activeSetCards.some((c) => {
                const totalCount = c.count ?? 1;
                const totalGraded = gradedCount(c);
                const totalUngraded = totalCount - totalGraded;
                const ungradedDupes = Math.max(totalUngraded - 1, 0);
                const gradedDupes = Math.max(totalGraded - 1, 0);
                return (ungradedDupes + gradedDupes) > 0;
              }) && (
                <div className="collection__sell-all-row">
                  <button
                    className="btn-coll-sell-all"
                    onClick={() => {
                      for (const card of activeSetCards) {
                        const totalCount = card.count ?? 1;
                        const totalGraded = gradedCount(card);
                        const totalUngraded = totalCount - totalGraded;
                        const ungradedDupes = Math.max(totalUngraded - 1, 0);
                        const gradedDupes = Math.max(totalGraded - 1, 0);
                        for (let i = 0; i < ungradedDupes; i += 1) onSellCard?.(card);
                        for (let i = 0; i < gradedDupes; i += 1) onSellCard?.(card);
                      }
                    }}
                  >
                    Sell All Duplicates ({activeSetCards.reduce((sum, c) => {
                      const totalCount = c.count ?? 1;
                      const totalGraded = gradedCount(c);
                      const totalUngraded = totalCount - totalGraded;
                      const ungradedDupes = Math.max(totalUngraded - 1, 0);
                      const gradedDupes = Math.max(totalGraded - 1, 0);
                      return sum + ungradedDupes + gradedDupes;
                    }, 0)})
                  </button>
                </div>
              )}

              {availableTypes.length > 0 && (
                <div className="collection__type-filter" role="group" aria-label="Filter by type">
                  <button
                    className={`type-chip${filterType === null ? ' type-chip--active' : ''}`}
                    onClick={() => setFilterType(null)}
                  >
                    All Types
                  </button>
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      className={`type-chip${filterType === type ? ' type-chip--active' : ''}`}
                      style={{ '--type-color': TYPE_COLORS[type] ?? '#94a3b8' }}
                      onClick={() => setFilterType(filterType === type ? null : type)}
                    >
                      <span className="type-chip__dot" />
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {viewMode === 'collection' ? (
          activeSetCards.length === 0 ? (
            <div className="collection__empty-inner">
              <div className="collection__empty-icon">{isFavouritesView ? '♥' : '🃏'}</div>
              <h2>{isFavouritesView ? 'No favourites yet' : `No ${setConfig?.name} cards yet`}</h2>
              <p>{isFavouritesView ? 'Open a card and tap ♡ to favourite it.' : 'Open a pack to start collecting!'}</p>
            </div>
          ) : displayed.length === 0 ? (
            <p className="collection__none">No {filterType ? `${filterType}-type` : filter} cards yet.</p>
          ) : (
            <div className="collection__grid">
              {displayed.map((card) => (
                <div key={card.id} className="collection__card-wrap">
                  <div className="collection__card-inner">
                    <PokemonCard
                      card={card}
                      size="normal"
                      showCount={true}
                      onClick={setModalCard}
                      showGraded={filter === 'Graded'}
                    />
                    {favouriteIds.has(card.id) && <span className="coll-fav-badge" aria-label="Favourited">♥</span>}
                    {economyMode && (
                      (filter === 'Graded'
                        ? (card.totalGraded ?? 1) > 1 || (card.totalUngraded ?? 0) > 0
                        : (card.count ?? 1) > 1 && (card.totalUngraded ?? 0) > 0) && (
                        <button
                          className="btn-sell-card btn-sell-card--coll"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSellCard?.(card);
                          }}
                        >
                          🪙 {getCardSellPrice?.(card) ?? 0}
                        </button>
                      )
                    )}
                  </div>
                  <p className="collection__card-name">{card.name}</p>
                </div>
              ))}
            </div>
          )
        ) : isFavouritesView ? (
          <p className="collection__none">Checklist view is unavailable for favourites.</p>
        ) : isLoadingChecklist ? (
          <div className="collection__empty-inner">
            <div className="pokeball-spinner">
              <div className="pokeball-spinner__top" />
              <div className="pokeball-spinner__band" />
              <div className="pokeball-spinner__bottom" />
              <div className="pokeball-spinner__center" />
            </div>
            <p>Loading {setConfig?.name ?? 'set'}...</p>
          </div>
        ) : checklistCards ? (
          <div className="collection__grid">
            {checklistCards.map((card) => {
              const isOwned = ownedIds.has(card.id);
              const isSecretRare = card.rarity === 'Secret Rare';
              return (
                <div key={card.id} className="collection__card-wrap">
                  <PokemonCard
                    card={card}
                    size="normal"
                    showCount={false}
                    onClick={isOwned ? setModalCard : undefined}
                    unowned={!isOwned && !isSecretRare}
                    secretUnowned={isSecretRare && !isOwned}
                    showGraded={false}
                  />
                  <p className={`collection__card-name${isOwned ? '' : (isSecretRare ? ' collection__card-name--mystery' : ' collection__card-name--unowned')}`}>
                    {isOwned ? card.name : '???'}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="collection__none">Open a pack from this set to load the full checklist.</p>
        )}
      </div>

      {modalCard && (
        <CardModal
          card={modalCard}
          onClose={() => setModalCard(null)}
          onFavouriteChange={refreshFavourites}
          onGradeCard={onGradeCard}
        />
      )}
    </>
  );
}
