import { useEffect } from 'react';
import './AchToast.css';

// Visual tier per rarity — escalates as cards get harder to collect
const TIER = {
  'Common':       1,
  'Uncommon':     2,
  'Rare':         3,
  'Rare ex':      3,
  'Ultra Rare':   4,
  'Rare LV.X':    3,
  'Rare Shiny':   5,
  'Radiant Rare': 5,
  'Secret Rare':  5,
  'Rare Holo':    4,
  'all-variants': 4,
};

const CONFETTI_COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];

export default function AchToast({ id, title, icon, rarity, setName, packs, onDismiss }) {
  const tier = TIER[rarity] ?? 1;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`ach-toast ach-toast--t${tier}`} role="alert">
      {tier >= 4 && (
        <div className="ach-toast__confetti" aria-hidden="true">
          {CONFETTI_COLORS.map((c, i) => (
            <span
              key={i}
              className="ach-toast__confetti-piece"
              style={{ '--c': c, '--d': `${i * 0.12}s`, '--x': `${(i * 37 + 10) % 90}%` }}
            />
          ))}
        </div>
      )}
      <div className="ach-toast__body">
        <span className="ach-toast__icon">{icon}</span>
        <div className="ach-toast__text">
          <span className="ach-toast__label">Achievement Unlocked</span>
          <span className="ach-toast__title">{title}</span>
          {setName && <span className="ach-toast__set">{setName}</span>}
          {packs > 0 && (
            <span className="ach-toast__packs">
              🎁 +{packs} free pack{packs !== 1 ? 's' : ''} awarded
            </span>
          )}
        </div>
        <button className="ach-toast__close" onClick={onDismiss} aria-label="Dismiss">×</button>
      </div>
    </div>
  );
}
