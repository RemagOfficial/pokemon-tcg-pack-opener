import { useState, useMemo } from 'react';
import { ACHIEVEMENT_SETS, computeProgress } from '../services/achievements.js';
import './Achievements.css';

const RARITY_CLASS = {
  'Common':   'rarity--common',
  'Uncommon': 'rarity--uncommon',
  'Rare':     'rarity--rare',
  'Rare Holo':'rarity--rare-holo',
  null:       'rarity--master',
};

export default function Achievements({ collection, allCards }) {
  const [activeSet, setActiveSet] = useState(null);

  const progress = useMemo(
    () => (allCards ? computeProgress(allCards, collection) : new Map()),
    [allCards, collection],
  );

  // ── Set list view ────────────────────────────────────────────────────────
  if (!activeSet) {
    return (
      <div className="ach-screen">
        <h2 className="ach-screen__title">Achievements</h2>
        <div className="ach-set-list">
          {ACHIEVEMENT_SETS.map((set) => {
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
                <div className="ach-item__title">{ach.title}</div>
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
