import { SETS } from '../services/sets.js';
import './SetSelector.css';

export default function SetSelector({ onSelect, setSymbols = {} }) {
  return (
    <div className="set-selector">
      <h2 className="set-selector__title">Choose a Set</h2>
      <p className="set-selector__sub">Select a booster pack to open</p>
      <div className="set-selector__grid">
        {SETS.map((set) => (
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
              <span className="set-card__year">{set.year}</span>
            </div>
            <div className="set-card__footer">
              <span className="set-card__count">{set.totalCards} cards</span>
              <span className="set-card__arrow">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
