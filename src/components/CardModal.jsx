import { useRef } from 'react';
import { getCardImageUrl } from '../services/tcgdex.js';
import './CardModal.css';

const RARITY_COLOR = {
  'Common':    '#9ca3af',
  'Uncommon':  '#4ade80',
  'Rare':      '#60a5fa',
  'Rare Holo': '#e879f9',
};

export default function CardModal({ card, onClose }) {
  const imageWrapRef = useRef(null);

  if (!card) return null;

  const imageUrl = getCardImageUrl(card, 'high');
  const isHolo = card.rarity === 'Rare Holo';
  const rarityColor = RARITY_COLOR[card.rarity] ?? '#9ca3af';

  const handleBackdropMouseMove = (event) => {
    const element = imageWrapRef.current;
    if (!element) return;

    const viewportWidth = window.innerWidth || 1;
    const viewportHeight = window.innerHeight || 1;
    const x = event.clientX / viewportWidth;
    const y = event.clientY / viewportHeight;

    const rotateX = Math.max(-34, Math.min(34, (0.5 - y) * 34));
    const rotateY = Math.max(-34, Math.min(34, (x - 0.5) * 34));

    element.style.setProperty('--tilt-x', `${rotateX}deg`);
    element.style.setProperty('--tilt-y', `${rotateY}deg`);
  };

  const resetTilt = () => {
    const element = imageWrapRef.current;
    if (!element) return;

    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      className="card-modal-backdrop"
      onClick={onClose}
      onMouseMove={handleBackdropMouseMove}
      onMouseLeave={resetTilt}
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

        <div
          ref={imageWrapRef}
          className={`card-modal-image-wrap${isHolo ? ' card-modal-image-wrap--holo' : ''}`}
        >
          <img
            src={imageUrl}
            alt={card.name}
            className="card-modal-image"
            draggable="false"
          />
          {isHolo && <div className="card-modal-holo" />}
        </div>

        <div className="card-modal-meta">
          <h2 className="card-modal-name">{card.name}</h2>
          <span className="card-modal-rarity" style={{ color: rarityColor }}>
            {card.rarity === 'Rare Holo' ? '★ Holo Rare' : card.rarity}
          </span>
          <span className="card-modal-set">Base Set · #{card.localId}</span>
        </div>
      </div>
    </div>
  );
}
