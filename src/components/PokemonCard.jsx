import { getCardImageUrl } from '../services/tcgdex.js';
import './PokemonCard.css';

const RARITY_LABEL = {
  'Common':      { label: '●',   color: '#9ca3af' },
  'Uncommon':    { label: '◆',   color: '#4ade80' },
  'Rare':        { label: '★',   color: '#60a5fa' },
  'Rare ex':     { label: 'EX',  color: '#f97316' },
  'Rare LV.X':    { label: 'LV.X',  color: '#38bdf8' },
  'Rare Shiny':   { label: 'SH',    color: '#facc15' },
  'Secret Rare': { label: '★★',  color: '#fbbf24' },
};
const HOLO_SUFFIX    = { label: ' ✦', color: '#c084fc' };
const REVERSE_SUFFIX = { label: ' ✦', color: '#22d3ee' };

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
  const isHolo = card.holo === true;
  const isReverseHolo = card.reverseHolo === true;
  const isSecretRare = card.rarity === 'Secret Rare';
  const base = RARITY_LABEL[card.rarity] ?? RARITY_LABEL['Common'];

  return (
    <div
      className={`pcard size-${size}${(isHolo || isReverseHolo) ? ' pcard--holo' : ''}${isSecretRare ? ' pcard--secret-rare' : ''}${onClick ? ' pcard--clickable' : ''}${unowned ? ' pcard--unowned' : ''}`}
      onClick={onClick ? () => onClick(card) : undefined}
    >
      <img
        className="pcard__img"
        src={imageUrl}
        alt={card.name}
        loading="lazy"
        draggable="false"
      />
      {(isHolo || isReverseHolo) && !unowned && <div className="pcard__holo-overlay" />}
      <div className="pcard__rarity">
        <span style={{ color: base.color }}>{base.label}</span>
        {isHolo && card.rarity !== 'Rare ex' && card.rarity !== 'Rare LV.X' && card.rarity !== 'Rare Shiny' && <span style={{ color: HOLO_SUFFIX.color }}>{HOLO_SUFFIX.label}</span>}
        {isReverseHolo && card.rarity !== 'Rare ex' && card.rarity !== 'Rare LV.X' && card.rarity !== 'Rare Shiny' && <span style={{ color: REVERSE_SUFFIX.color }}>{REVERSE_SUFFIX.label}</span>}
      </div>
      {showCount && card.count > 1 && (
        <div className="pcard__count">×{card.count}</div>
      )}
    </div>
  );
}
