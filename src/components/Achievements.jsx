import { useState, useMemo, useRef, useEffect } from 'react';
import { ACHIEVEMENT_SETS, computeProgress, getAchievementReward } from '../services/achievements.js';
import { SETS } from '../services/sets.js';
import './Achievements.css';
import './SetSelector.css';

const ALL_SERIES = [...new Set(SETS.map((s) => s.series))];
const ALL_YEARS  = [...new Set(SETS.map((s) => s.year))].sort();
function toggleSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value); else next.add(value);
  return next;
}

const RARITY_CLASS = {
  'Common':   'rarity--common',
  'Uncommon': 'rarity--uncommon',
  'Rare':     'rarity--rare',
  'Rare Holo':'rarity--rare-holo',
  'Rare LV.X':'rarity--rare-lvx',
  'Rare Shiny':'rarity--rare-shiny',
  null:       'rarity--master',
  'all-variants':'rarity--master',
};

export default function Achievements({ collection, allCards, economyMode = false }) {
  const [activeSet, setActiveSet] = useState(null);
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

  const progress = useMemo(
    () => (allCards ? computeProgress(allCards, collection) : new Map()),
    [allCards, collection],
  );

  // ── Set list view ────────────────────────────────────────────────────────
  if (!activeSet) {
    const activeFilterCount = selSeries.size + selYears.size;
    const clearAllFilters = () => { setSelSeries(new Set()); setSelYears(new Set()); };
    const setMeta = Object.fromEntries(SETS.map((s) => [s.id, s]));
    const visibleAchSets = ACHIEVEMENT_SETS.filter((set) => {
      const meta = setMeta[set.tcgdexId];
      if (!meta) return true;
      if (selSeries.size > 0 && !selSeries.has(meta.series)) return false;
      if (selYears.size  > 0 && !selYears.has(meta.year))   return false;
      return true;
    });

    return (
      <div className="ach-screen">
        <h2 className="ach-screen__title">Achievements</h2>

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

        <div className="ach-set-list">
          {visibleAchSets.map((set) => {
            const total    = set.achievements.length;
            const complete = set.achievements.filter((a) => progress.get(a.id)?.complete).length;
            const allDone  = complete === total;
            return (
              <button
                key={set.id}
                className={`ach-set-card${allDone ? ' ach-set-card--complete' : ''}`}
                onClick={() => setActiveSet(set.id)}
              >
                <div className="ach-set-card__body">
                  <span className="ach-set-card__name">{set.name}</span>
                  <span className="ach-set-card__year">{set.year}</span>
                </div>
                <div className="ach-set-card__meta">
                  <span className={`ach-set-card__count${allDone ? ' ach-set-card__count--done' : ''}`}>
                    {allDone ? '✓ ' : ''}{complete} / {total}
                  </span>
                  <div className="ach-set-card__bar">
                    <div
                      className={`ach-set-card__bar-fill${allDone ? ' ach-set-card__bar-fill--done' : ''}`}
                      style={{ width: `${(complete / total) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ach-set-card__arrow">›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Set detail view ──────────────────────────────────────────────────────
  const set = ACHIEVEMENT_SETS.find((s) => s.id === activeSet);

  return (
    <div className="ach-screen">
      <div className="ach-detail-header">
        <button className="ach-back-btn" onClick={() => setActiveSet(null)}>‹ Back</button>
        <h2 className="ach-screen__title">{set.name}</h2>
      </div>

      <div className="ach-list">
        {set.achievements.map((ach) => {
          const prog = progress.get(ach.id) ?? { total: 0, owned: 0, complete: false };
          const pct  = prog.total > 0 ? (prog.owned / prog.total) * 100 : 0;
          return (
            <div
              key={ach.id}
              className={`ach-item${prog.complete ? ' ach-item--complete' : ''}`}
            >
              <div className={`ach-item__icon ${RARITY_CLASS[ach.rarity]}`}>
                {prog.complete ? '✓' : ach.icon}
              </div>
              <div className="ach-item__body">
                <div className="ach-item__title">
                  {ach.title}
                  {economyMode && (
                    <span className="ach-item__reward">
                      🎁 {getAchievementReward(ach)}
                    </span>
                  )}
                </div>
                <div className="ach-item__desc">{ach.description}</div>
                <div className="ach-item__progress-row">
                  <div className="ach-item__bar">
                    <div
                      className={`ach-item__bar-fill${prog.complete ? ' ach-item__bar-fill--done' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="ach-item__fraction">
                    {prog.owned} / {prog.total}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
