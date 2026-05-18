import { getCardImageUrl } from '../services/tcgdex.js';
import './PokemonCard.css';

const RARITY_LABEL = {
  'Common':      { label: '●',    color: '#9ca3af' },
  'Uncommon':    { label: '◆◆',  color: '#4ade80' },
  'Rare':        { label: '★',    color: '#60a5fa' },
  'Rare Holo':   { label: '★ H', color: '#c084fc' },
  'Secret Rare': { label: '★★',  color: '#fbbf24' },
};

export default function PokemonCard({ card, size = 'normal', showCount = false, onClick, unowned = false, secretUnowned = false }) {
  // Secret rare not yet found – render a fully blacked-out mystery card
  if (secretUnowned) {
    return (
      <div
        className={`pcard size-${size} pcard--secret-unowned`}
        style={{ aspectRatio: '2.5 / 3.5' }}
      >
        <span className="pcard__mystery-q">?</span>
      </div>
    );
  }

  const imageUrl = getCardImageUrl(card, 'high');
  const isHolo = card.rarity === 'Rare Holo';
  const isSecretRare = card.rarity === 'Secret Rare';
  const { label, color } = RARITY_LABEL[card.rarity] ?? RARITY_LABEL['Common'];

  return (
    <div
      className={`pcard size-${size}${isHolo ? ' pcard--holo' : ''}${isSecretRare ? ' pcard--secret-rare' : ''}${onClick ? ' pcard--clickable' : ''}${unowned ? ' pcard--unowned' : ''}`}
      onClick={onClick ? () => onClick(card) : undefined}
    >
      <img
        className="pcard__img"
        src={imageUrl}
        alt={card.name}
        loading="lazy"
        draggable="false"
      />
      {isHolo && !unowned && <div className="pcard__holo-overlay" />}
      <div className="pcard__rarity" style={{ color }}>
        {label}
      </div>
      {showCount && card.count > 1 && (
        <div className="pcard__count">×{card.count}</div>
      )}
    </div>
  );
}
