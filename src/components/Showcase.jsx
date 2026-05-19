import { useState, useMemo, useRef, useCallback } from 'react';
import { getFavourites } from '../services/favourites.js';
import { getCardImageUrl } from '../services/tcgdex.js';
import './Showcase.css';

const STORAGE_KEY = 'pkmon_showcase';
const MAX_SLOTS = 10;

function loadSlots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSlots(slots) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slots)); } catch { /* ignore */ }
}

export default function Showcase({ collection }) {
  const [slots, setSlots] = useState(() => loadSlots());
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef(null);

  const slotIds = useMemo(() => new Set(slots.map((c) => c.id)), [slots]);
  const favouriteIds = useMemo(() => getFavourites(), []);

  // All favourited owned cards not already in the showcase
  const favouritedCards = useMemo(() => {
    return collection.filter((c) => favouriteIds.has(c.id) && !slotIds.has(c.id));
  }, [collection, favouriteIds, slotIds]);

  const addCard = useCallback((card) => {
    if (slots.length >= MAX_SLOTS) return;
    const next = [...slots, card];
    setSlots(next);
    saveSlots(next);
  }, [slots]);

  const removeCard = useCallback((cardId) => {
    const next = slots.filter((c) => c.id !== cardId);
    setSlots(next);
    saveSlots(next);
  }, [slots]);

  const handleExport = useCallback(async () => {
    if (!exportRef.current || slots.length === 0) return;
    setExporting(true);
    // Hide remove buttons so they don't appear in the exported image
    const removeButtons = exportRef.current.querySelectorAll('.showcase-slot__remove');
    removeButtons.forEach((btn) => { btn.style.display = 'none'; });
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pokemon-showcase.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      removeButtons.forEach((btn) => { btn.style.display = ''; });
      setExporting(false);
    }
  }, [slots]);

  return (
    <div className="showcase-screen">
      <div className="showcase-screen__header">
        <h2 className="showcase-screen__title">Showcase</h2>
        <p className="showcase-screen__sub">
          Pick up to {MAX_SLOTS} favourited cards to display. Export a shareable image.
        </p>
      </div>

      <div className="showcase-layout">
        {/* ── Left: available favourites ── */}
        <section className="showcase-panel showcase-panel--pick">
          <h3 className="showcase-panel__heading">
            Favourites
            <span className="showcase-panel__count">{favouritedCards.length}</span>
          </h3>
          {favouritedCards.length === 0 ? (
            <div className="showcase-empty">
              {slots.length >= MAX_SLOTS
                ? 'Showcase is full. Remove a card to add another.'
                : 'No favourited cards available. Heart cards in the fullscreen view!'}
            </div>
          ) : (
            <div className="showcase-pick-grid">
              {favouritedCards.map((card) => (
                <button
                  key={card.id}
                  className={`showcase-pick-card${slots.length >= MAX_SLOTS ? ' showcase-pick-card--disabled' : ''}`}
                  onClick={() => addCard(card)}
                  disabled={slots.length >= MAX_SLOTS}
                  title={`Add ${card.name}`}
                >
                  <img
                    src={getCardImageUrl(card, 'low')}
                    alt={card.name}
                    className="showcase-pick-card__img"
                    loading="lazy"
                  />
                  <span className="showcase-pick-card__add">+</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Right: showcase slots ── */}
        <section className="showcase-panel showcase-panel--display">
          <div className="showcase-panel__heading-row">
            <h3 className="showcase-panel__heading">
              Showcase
              <span className="showcase-panel__count">{slots.length}/{MAX_SLOTS}</span>
            </h3>
            <button
              className={`showcase-export-btn${exporting ? ' showcase-export-btn--loading' : ''}`}
              onClick={handleExport}
              disabled={slots.length === 0 || exporting}
            >
              {exporting ? 'Exporting…' : '⤓ Export Image'}
            </button>
          </div>

          {slots.length === 0 ? (
            <div className="showcase-empty">Add cards from your favourites to build your showcase.</div>
          ) : null}

          {/* Exportable card grid */}
          <div className="showcase-export-wrap" ref={exportRef}>
            {slots.length > 0 && (
              <>
                <div className="showcase-export-header">
                  <span className="showcase-export-header__diamond">◆</span>
                  <span className="showcase-export-header__title">BoosterDex Showcase</span>
                  <span className="showcase-export-header__diamond">◆</span>
                </div>
                <div className="showcase-grid">
                  {slots.map((card) => (
                    <div key={card.id} className="showcase-slot">
                      <div className="showcase-slot__card-area">
                        <img
                          src={getCardImageUrl(card, 'high')}
                          alt={card.name}
                          className="showcase-slot__img"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="showcase-slot__neck" />
                      <div className="showcase-slot__base" />
                      <button
                        className="showcase-slot__remove"
                        onClick={() => removeCard(card.id)}
                        title={`Remove ${card.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
