import { useState, useMemo, useEffect, useRef } from 'react';
import { SETS } from '../services/sets.js';
import './SetSelector.css';

// Derive unique sorted series and years from SETS
const ALL_SERIES = [...new Set(SETS.map((s) => s.series))];
const ALL_YEARS  = [...new Set(SETS.map((s) => s.year))].sort();

function toggle(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value); else next.add(value);
  return next;
}

function loadStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredArray(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export default function SetSelector({ onSelect, setSymbols = {} }) {
  const [showFilter, setShowFilter] = useState(false);
  const [selSeries,  setSelSeries]  = useState(() => new Set(loadStoredArray('pkmon_set_selector_series')));
  const [selYears,   setSelYears]   = useState(() => new Set(loadStoredArray('pkmon_set_selector_years')));
  const [search, setSearch] = useState(() => {
    try { return localStorage.getItem('pkmon_set_selector_search') ?? ''; } catch { return ''; }
  });
  const popupRef = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    if (!showFilter) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [showFilter]);

  useEffect(() => { saveStoredArray('pkmon_set_selector_series', [...selSeries]); }, [selSeries]);
  useEffect(() => { saveStoredArray('pkmon_set_selector_years', [...selYears]); }, [selYears]);
  useEffect(() => {
    try { localStorage.setItem('pkmon_set_selector_search', search); } catch { /* ignore */ }
  }, [search]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SETS.filter((s) => {
      if (selSeries.size > 0 && !selSeries.has(s.series)) return false;
      if (selYears.size  > 0 && !selYears.has(s.year))   return false;
      if (q) {
        const hay = `${s.name} ${s.series} ${s.year}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [selSeries, selYears, search]);

  const activeCount = selSeries.size + selYears.size;
  const clearAll = () => { setSelSeries(new Set()); setSelYears(new Set()); };

  return (
    <div className="set-selector">
      <h2 className="set-selector__title">Choose a Set</h2>
      <p className="set-selector__sub">Select a booster pack to open</p>

      {/* Filter/search bar */}
      <div className="set-selector__bar-row">
        <div className="ss-filter-bar ss-filter-bar--fullwidth">
          <div className="ss-filter-bar__top">
            <button
              className={`ss-filter-btn${activeCount > 0 ? ' ss-filter-btn--active' : ''}`}
              onClick={() => setShowFilter((v) => !v)}
              aria-expanded={showFilter}
            >
              <span>Filter</span>
              {activeCount > 0 && <span className="ss-filter-badge">{activeCount}</span>}
            </button>
            <input
              className="ss-search-input"
              type="text"
              placeholder="Search sets by name, series, or year..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {activeCount > 0 && (
            <div className="ss-chips">
              {[...selSeries].map((s) => (
                <button key={s} className="ss-chip" onClick={() => setSelSeries(toggle(selSeries, s))}>
                  {s} &times;
                </button>
              ))}
              {[...selYears].map((y) => (
                <button key={y} className="ss-chip" onClick={() => setSelYears(toggle(selYears, y))}>
                  {y} &times;
                </button>
              ))}
              <button className="ss-chip ss-chip--clear" onClick={clearAll}>Clear all</button>
            </div>
          )}
        {showFilter && (
          <div className="ss-popup" ref={popupRef}>
            <div className="ss-popup__section">
              <span className="ss-popup__label">Series</span>
              <div className="ss-popup__options">
                {ALL_SERIES.map((s) => (
                  <button
                    key={s}
                    className={`ss-option${selSeries.has(s) ? ' ss-option--on' : ''}`}
                    onClick={() => setSelSeries(toggle(selSeries, s))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="ss-popup__divider" />
            <div className="ss-popup__section">
              <span className="ss-popup__label">Year</span>
              <div className="ss-popup__options ss-popup__options--years">
                {ALL_YEARS.map((y) => (
                  <button
                    key={y}
                    className={`ss-option${selYears.has(y) ? ' ss-option--on' : ''}`}
                    onClick={() => setSelYears(toggle(selYears, y))}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            {activeCount > 0 && (
              <>
                <div className="ss-popup__divider" />
                <button className="ss-popup__clear" onClick={() => { clearAll(); setShowFilter(false); }}>
                  Clear all filters
                </button>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Set grid */}
      <div className="set-selector__grid">
        {filtered.length === 0 ? (
          <p className="ss-no-results">No sets match the current filters.</p>
        ) : filtered.map((set) => (
          <button
            key={set.id}
            className="set-card"
            style={{ '--accent': set.accentColor }}
            onClick={() => onSelect(set.id)}
          >
            <div className="set-card__shine" />
            <div className="set-card__top">
              {setSymbols[set.id] ? (
                <img
                  className="set-card__symbol-img"
                  src={setSymbols[set.id]}
                  alt={`${set.name} symbol`}
                  draggable={false}
                />
              ) : (
                <span className={`set-card__symbol${set.symbol.length > 1 ? ' set-card__symbol--emoji' : ''}`}>
                  {set.symbol}
                </span>
              )}
            </div>
            <div className="set-card__body">
              <span className="set-card__name">{set.name}</span>
              <span className="set-card__year">{set.series} &middot; {set.year}</span>
            </div>
            <div className="set-card__footer">
              <span className="set-card__count">{set.totalCards} cards</span>
              <span className="set-card__arrow">&#x203a;</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}