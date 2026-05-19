import { useState, useMemo, useRef, useEffect } from 'react';
import PokemonCard from './PokemonCard.jsx';
import CardModal from './CardModal.jsx';
import { SETS } from '../services/sets.js';
import './Collection.css';
import './SetSelector.css';

const ALL_SERIES = [...new Set(SETS.map((s) => s.series))];
const ALL_YEARS  = [...new Set(SETS.map((s) => s.year))].sort();
function toggleSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value); else next.add(value);
  return next;
}

const RARITIES = ['All', 'Holo', 'EX', 'Rare', 'Uncommon', 'Common'];
// Sort score: EX Pokemon first, then holo rares, non-holo rares, uncommons, commons
const sortScore = (card) => {
  if (card.rarity === 'Rare ex')                              return 0; // EX Pokemon
  if (card.holo  && card.rarity === 'Rare')                  return 1; // holo rare
  if (card.reverseHolo && card.rarity === 'Rare')            return 2; // reverse holo rare
  if (!card.holo && !card.reverseHolo && card.rarity === 'Rare') return 3; // non-holo rare
  if (card.reverseHolo)                                      return 4; // reverse holo (non-rare)
  if (card.holo)                                             return 5; // holo non-rare (edge case)
  if (card.rarity === 'Uncommon')                            return 6;
  if (card.rarity === 'Common')                              return 7;
  return 8;
};

export default function Collection({ collection, loadedSets = {}, setSymbols = {}, onLoadSet, economyMode = false, onSellCard, getCardSellPrice }) {
  const [activeSetId, setActiveSetId] = useState(null);
  const [hideComplete, setHideComplete] = useState(false);
  const [filter, setFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [selSeries, setSelSeries] = useState(new Set());
  const [selYears,  setSelYears]  = useState(new Set());
  const filterPopupRef = useRef(null);

  useEffect(() => {
    if (!showFilter) return;
    const handler = (e) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showFilter]);
  const [sortBy, setSortBy] = useState('rarity'); // 'rarity' | 'count'
  const [viewMode, setViewMode] = useState('collection');
  const [modalCard, setModalCard] = useState(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);

  const ownedIds = useMemo(() => new Set(collection.map((c) => c.id)), [collection]);

  // Cards owned in the active set
  const setCards = useMemo(
    () => collection.filter((c) => (c.setId ?? 'base1') === activeSetId),
    [collection, activeSetId],
  );

  // Filtered + sorted cards for My Cards view
  const displayed = useMemo(() => {
    let base;
    if (filter === 'All')  base = setCards;
    else if (filter === 'Holo') base = setCards.filter((c) => c.holo === true || c.reverseHolo === true);
    else if (filter === 'EX')   base = setCards.filter((c) => c.rarity === 'Rare ex');
    else base = setCards.filter((c) => c.rarity === filter);
    return [...base].sort((a, b) => {
      if (sortBy === 'count') {
        return (b.count ?? 1) - (a.count ?? 1) || sortScore(a) - sortScore(b) || a.name.localeCompare(b.name);
      }
      return sortScore(a) - sortScore(b) || a.name.localeCompare(b.name);
    });
  }, [setCards, filter, sortBy]);

  // Full checklist cards for active set
  const checklistCards = useMemo(() => {
    const cards = loadedSets[activeSetId];
    if (!cards) return null;
    return [...cards].sort((a, b) => parseInt(a.localId, 10) - parseInt(b.localId, 10));
  }, [loadedSets, activeSetId]);

  // ── SET LIST VIEW ────────────────────────────────────────────────────────
  if (!activeSetId) {
    const ownedOfficialBySet = {}; // excludes Secret Rare — used for bar fill + completion
    const ownedTotalBySet = {};     // includes Secret Rare — used for the displayed count
    for (const card of collection) {
      const sid = card.setId ?? 'base1';
      ownedTotalBySet[sid] = (ownedTotalBySet[sid] ?? 0) + 1;
      if (card.rarity === 'Secret Rare') continue;
      ownedOfficialBySet[sid] = (ownedOfficialBySet[sid] ?? 0) + 1;
    }

    const activeFilterCount = selSeries.size + selYears.size;
    const clearAllFilters = () => { setSelSeries(new Set()); setSelYears(new Set()); };

    const visibleSets = SETS.filter((set) => {
      if (selSeries.size > 0 && !selSeries.has(set.series)) return false;
      if (selYears.size  > 0 && !selYears.has(set.year))   return false;
      if (!hideComplete) return true;
      const owned = ownedOfficialBySet[set.id] ?? 0;
      const total = (loadedSets[set.id]?.filter((c) => c.rarity !== 'Secret Rare').length) ?? set.totalCards;
      return !(owned > 0 && owned >= total);
    });

    return (
      <>
        <div className="coll-screen">
          <div className="coll-screen__header">
            <h2 className="coll-screen__title">Collection</h2>
            <label className="coll-hide-toggle">
              <input
                type="checkbox"
                checked={hideComplete}
                onChange={(e) => setHideComplete(e.target.checked)}
              />
              Hide completed
            </label>
          </div>

          <div className="ss-filter-bar">
            <button
              className={`ss-filter-btn${activeFilterCount > 0 ? ' ss-filter-btn--active' : ''}`}
              onClick={() => setShowFilter((v) => !v)}
              aria-expanded={showFilter}
            >
              <span>Filter</span>
              {activeFilterCount > 0 && <span className="ss-filter-badge">{activeFilterCount}</span>}
            </button>
            {activeFilterCount > 0 && (
              <div className="ss-chips">
                {[...selSeries].map((s) => (
                  <button key={s} className="ss-chip" onClick={() => setSelSeries(toggleSet(selSeries, s))}>{s} &times;</button>
                ))}
                {[...selYears].map((y) => (
                  <button key={y} className="ss-chip" onClick={() => setSelYears(toggleSet(selYears, y))}>{y} &times;</button>
                ))}
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
                {activeFilterCount > 0 && (
                  <>
                    <div className="ss-popup__divider" />
                    <button className="ss-popup__clear" onClick={() => { clearAllFilters(); setShowFilter(false); }}>Clear all filters</button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="coll-set-list">
            {visibleSets.map((set) => {
              const owned = ownedOfficialBySet[set.id] ?? 0;
              const total = (loadedSets[set.id]?.filter((c) => c.rarity !== 'Secret Rare').length) ?? set.totalCards;
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
                      {complete && '✓ '}{ownedTotalBySet[set.id] ?? 0} / {total}
                    </span>
                  </div>
                  <span className="coll-set-card__arrow">›</span>
                </button>
              );
            })}
          </div>
        </div>
        {modalCard && <CardModal card={modalCard} onClose={() => setModalCard(null)} />}
      </>
    );
  }

  // ── SET DETAIL VIEW ──────────────────────────────────────────────────────
  const setConfig = SETS.find((s) => s.id === activeSetId);
  // Exclude secret rares from the official total and completion count
  const setSize = checklistCards
    ? checklistCards.filter((c) => c.rarity !== 'Secret Rare').length
    : setConfig?.totalCards ?? 0;
  const officialSetCards = setCards.filter((c) => c.rarity !== 'Secret Rare');
  const totalCards = setCards.reduce((sum, c) => sum + (c.count ?? 1), 0);

  return (
    <>
    <div className="collection">
      {/* ── Header ── */}
      <div className="collection__header">
        <div className="collection__header-top">
          <button className="coll-back-btn" onClick={() => setActiveSetId(null)}>‹ Back</button>

          <div className="collection__stats">
            {viewMode === 'collection' ? (
              <>
                <span><strong>{setCards.length}</strong><em> unique</em></span>
                <span className="collection__divider">·</span>
                <span><strong>{totalCards}</strong><em> total</em></span>
              </>
            ) : (
              <span><strong>{officialSetCards.length}</strong><em> / {setSize} collected</em></span>
            )}
          </div>

          <div className="collection__view-toggle">
            <button
              className={`view-toggle-btn${viewMode === 'collection' ? ' view-toggle-btn--active' : ''}`}
              onClick={() => setViewMode('collection')}
            >
              My Cards
            </button>
            <button
              className={`view-toggle-btn${viewMode === 'checklist' ? ' view-toggle-btn--active' : ''}`}
              onClick={() => {
                if (checklistCards) {
                  setViewMode('checklist');
                } else if (onLoadSet && !isLoadingChecklist) {
                  setIsLoadingChecklist(true);
                  setViewMode('checklist');
                  onLoadSet(activeSetId).finally(() => setIsLoadingChecklist(false));
                }
              }}
            >
              {isLoadingChecklist ? 'Loading…' : 'Full Set'}
            </button>
          </div>
        </div>

        {/* Rarity filter tabs + sort toggle – My Cards mode only */}
        {viewMode === 'collection' && (
          <>
            <div className="collection__filters-row">
              <div className="collection__filters" role="group" aria-label="Filter by rarity">
                {RARITIES.map((r) => (
                  <button
                    key={r}
                    className={`filter-tab${filter === r ? ' filter-tab--active' : ''} filter-tab--${r.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setFilter(r)}
                  >
                    {r}
                    {r !== 'All' && (
                      <span className="filter-tab__count">
                        {r === 'Holo'
                          ? setCards.filter((c) => c.holo === true || c.reverseHolo === true).length
                          : r === 'EX'
                            ? setCards.filter((c) => c.rarity === 'Rare ex').length
                            : setCards.filter((c) => c.rarity === r).length}
                      </span>
                    )}
                  </button>
                ))}
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
            {economyMode && setCards.some((c) => (c.count ?? 1) > 1) && (
              <div className="collection__sell-all-row">
                <button
                  className="btn-coll-sell-all"
                  onClick={() => {
                    for (const card of setCards) {
                      const dupes = (card.count ?? 1) - 1;
                      for (let i = 0; i < dupes; i++) onSellCard?.(card);
                    }
                  }}
                >
                  Sell All Duplicates ({setCards.reduce((sum, c) => sum + Math.max((c.count ?? 1) - 1, 0), 0)})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Grid ── */}
      {viewMode === 'collection' ? (
        setCards.length === 0 ? (
          <div className="collection__empty-inner">
            <div className="collection__empty-icon">🃏</div>
            <h2>No {setConfig?.name} cards yet</h2>
            <p>Open a pack to start collecting!</p>
          </div>
        ) : displayed.length === 0 ? (
          <p className="collection__none">No {filter} cards yet.</p>
        ) : (
          <div className="collection__grid">
            {displayed.map((card) => (
              <div key={card.id} className="collection__card-wrap">
                <div className="collection__card-inner">
                  <PokemonCard card={card} size="normal" showCount={true} onClick={setModalCard} />
                  {economyMode && (card.count ?? 1) > 1 && (
                    <button
                      className="btn-sell-card btn-sell-card--coll"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSellCard?.(card);
                      }}
                    >
                      🪙 {getCardSellPrice?.(card) ?? 0}
                    </button>
                  )}
                </div>
                <p className="collection__card-name">{card.name}</p>
              </div>
            ))}
          </div>
        )
      ) : isLoadingChecklist ? (
        <div className="collection__empty-inner">
          <div className="pokeball-spinner">
            <div className="pokeball-spinner__top" />
            <div className="pokeball-spinner__band" />
            <div className="pokeball-spinner__bottom" />
            <div className="pokeball-spinner__center" />
          </div>
          <p>Loading {setConfig?.name ?? 'set'}…</p>
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
      <CardModal card={modalCard} onClose={() => setModalCard(null)} />
    )}
    </>
  );
}
