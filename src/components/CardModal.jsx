import { useRef, useEffect, useState, useCallback } from 'react';
import { getCardImageUrl } from '../services/tcgdex.js';
import { isFavourited, toggleFavourite } from '../services/favourites.js';
import './CardModal.css';

const RARITY_COLOR = {
  'Common':    '#9ca3af',
  'Uncommon':  '#4ade80',
  'Rare':      '#60a5fa',
  'Rare ex':   '#f97316',
  'Rare LV.X': '#38bdf8',
  'Rare Shiny': '#facc15',
  'Rare Holo': '#e879f9',
};

const TILT_MAX = 34;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function CardModal({ card, onClose, onFavouriteChange }) {
  const imageWrapRef = useRef(null);
  const [favourited, setFavourited] = useState(() => card ? isFavourited(card.id) : false);
  // Track whether gyroscope is actively driving tilt so touch can act as fallback
  const gyroActiveRef = useRef(false);

  const handleFavourite = useCallback(() => {
    const nowFav = toggleFavourite(card.id);
    setFavourited(nowFav);
    onFavouriteChange?.();
  }, [card, onFavouriteChange]);

  const applyTilt = (rx, ry) => {
    const el = imageWrapRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', `${clamp(rx, -TILT_MAX, TILT_MAX)}deg`);
    el.style.setProperty('--tilt-y', `${clamp(ry, -TILT_MAX, TILT_MAX)}deg`);
  };

  const resetTilt = () => {
    const el = imageWrapRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  // ── Gyroscope ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') return;    if (localStorage.getItem('pkmon_gyro_disabled') === 'true') return;
    const handleOrientation = (e) => {
      if (e.gamma === null) return; // no real data
      gyroActiveRef.current = true;
      // gamma: left/right tilt (-90°..90°) → rotateY
      // beta: forward/back tilt; phone held upright ≈ 90° → centre there
      const ry = clamp((e.gamma ?? 0) * 0.8, -TILT_MAX, TILT_MAX);
      const rx = clamp(-((e.beta ?? 90) - 90) * 0.5, -TILT_MAX, TILT_MAX);
      applyTilt(rx, ry);
    };

    const register = () =>
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+: permission must be requested from a user gesture.
      // Piggyback on the next touchstart (the user is already interacting with the modal).
      const onGesture = () => {
        DeviceOrientationEvent.requestPermission()
          .then((state) => { if (state === 'granted') register(); })
          .catch(() => {});
      };
      document.addEventListener('touchstart', onGesture, { once: true });
      return () => {
        document.removeEventListener('touchstart', onGesture);
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } else {
      register();
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) return null;

  const imageUrl = getCardImageUrl(card, 'high');
  const isHolo = card.holo === true;
  const isReverseHolo = card.reverseHolo === true;
  const rarityColor = RARITY_COLOR[card.rarity] ?? '#9ca3af';

  // ── Mouse tilt (desktop) ─────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const x = e.clientX / (window.innerWidth  || 1);
    const y = e.clientY / (window.innerHeight || 1);
    applyTilt((0.5 - y) * TILT_MAX, (x - 0.5) * TILT_MAX);
  };

  // ── Touch tilt (mobile fallback when gyroscope unavailable) ─────────────
  const handleTouchMove = (e) => {
    if (gyroActiveRef.current) return; // gyro is driving — don't override
    const t = e.touches[0];
    if (!t) return;
    const x = t.clientX / (window.innerWidth  || 1);
    const y = t.clientY / (window.innerHeight || 1);
    applyTilt((0.5 - y) * TILT_MAX, (x - 0.5) * TILT_MAX);
  };

  return (
    <div
      className="card-modal-backdrop"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetTilt}
      role="dialog"
      aria-modal="true"
      aria-label={card.name}
    >
      <div
        className="card-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="card-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <button
          className={`card-modal-fav${favourited ? ' card-modal-fav--on' : ''}`}
          onClick={handleFavourite}
          aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
          title={favourited ? 'Remove from favourites' : 'Add to favourites'}
        >
          {favourited ? '♥' : '♡'}
        </button>

        <div
          ref={imageWrapRef}
          className={`card-modal-image-wrap${(isHolo || isReverseHolo) ? ' card-modal-image-wrap--holo' : ''}`}
        >
          <img
            src={imageUrl}
            alt={card.name}
            className="card-modal-image"
            draggable="false"
          />
          {(isHolo || isReverseHolo) && <div className="card-modal-holo" />}
        </div>

        <div className="card-modal-meta">
          <h2 className="card-modal-name">{card.name}</h2>
          <span className="card-modal-rarity" style={{ color: rarityColor }}>
            {card.rarity}{isHolo && <span style={{ color: '#c084fc' }}> ✦ Holo</span>}{isReverseHolo && <span style={{ color: '#22d3ee' }}> ✦ Reverse Holo</span>}
          </span>
          <span className="card-modal-set">Base Set · #{card.localId}</span>
        </div>
      </div>
    </div>
  );
}

