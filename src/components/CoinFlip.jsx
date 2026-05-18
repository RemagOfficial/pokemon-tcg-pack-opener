import { useState } from 'react';
import { SETS } from '../services/sets.js';
import './CoinFlip.css';

export default function CoinFlip({ eligibleSets, onWin, onClose }) {
  const [flipState, setFlipState] = useState('ready'); // ready | flipping | result
  const [result,    setResult]    = useState(null);    // 'heads' | 'tails'
  const [wonSet,    setWonSet]    = useState(null);    // { setId, setName }

  const handleFlip = () => {
    setFlipState('flipping');
    setTimeout(() => {
      const heads = Math.random() < 0.5;
      if (heads) {
        const setId   = eligibleSets[Math.floor(Math.random() * eligibleSets.length)];
        const setName = SETS.find((s) => s.id === setId)?.name ?? setId;
        setWonSet({ setId, setName });
      }
      setResult(heads ? 'heads' : 'tails');
      setFlipState('result');
    }, 900);
  };

  const handleClaim = () => { onWin(wonSet.setId); onClose(); };
  const handleRetry = () => { setFlipState('ready'); setResult(null); setWonSet(null); };

  const coinClass = [
    'coin',
    flipState === 'flipping'               ? 'coin--spinning' : '',
    flipState === 'result' && result === 'tails' ? 'coin--tails'   : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="coin-flip-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Coin flip">
      <div className="coin-flip-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="coin-flip-title">Flip a Coin</h2>

        <p className="coin-flip-sub">
          {flipState === 'ready'  && "You're broke and have nothing to sell — flip for a free pack!"}
          {flipState === 'flipping' && 'Flipping…'}
          {flipState === 'result' && result === 'heads' && `Heads! You won a free ${wonSet.setName} pack!`}
          {flipState === 'result' && result === 'tails' && 'Tails! No pack this time.'}
        </p>

        <div className={coinClass}>
          <div className="coin__inner">
            <div className="coin__face coin__face--heads">🌕</div>
            <div className="coin__face coin__face--tails">🌑</div>
          </div>
        </div>

        {flipState === 'result' && result === 'heads' && wonSet && (
          <p className="coin-flip-won-label">
            Head to <strong>{wonSet.setName}</strong> to open your free pack!
          </p>
        )}

        <div className="coin-flip-actions">
          {flipState === 'ready' && (
            <button className="btn-coin-action" onClick={handleFlip}>Flip!</button>
          )}
          {flipState === 'result' && result === 'heads' && (
            <button className="btn-coin-action btn-coin-action--claim" onClick={handleClaim}>
              Claim Free Pack
            </button>
          )}
          {flipState === 'result' && result === 'tails' && (
            <>
              <button className="btn-coin-action" onClick={handleRetry}>Try Again</button>
              <button className="btn-coin-action btn-coin-action--cancel" onClick={onClose}>Close</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
