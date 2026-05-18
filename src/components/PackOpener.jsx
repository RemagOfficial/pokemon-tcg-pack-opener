import { useState, useCallback, useEffect, useRef } from 'react';
import { openPack } from '../services/packLogic.js';
import { getCardImageUrl } from '../services/tcgdex.js';
import CardModal from './CardModal.jsx';
import PokemonCard from './PokemonCard.jsx';
import './PackOpener.css';
import cardBackImg from '../assets/back_of_card.webp';

// ── Card back ─────────────────────────────────────────────────────────────────
function CardBack() {
  return <img className="card-back" src={cardBackImg} alt="Card back" draggable={false} />;
}

// ── Pack graphic ──────────────────────────────────────────────────────────────
function PackGraphic({ state, setName }) {
  return (
    <div className={`pack-graphic pack-graphic--${state}`}>
      <div className="pack-graphic__inner">
        <div className="pack-graphic__foil" />
        <div className="pack-graphic__header"><span>{setName ? setName.toUpperCase() : 'BASE SET'}</span></div>
        <div className="pack-graphic__art">
          <div className="pack-graphic__diamond">&#9830;</div>
        </div>
        <div className="pack-graphic__footer">
          <span>Pokémon Trading Card Game</span>
        </div>
        <div className="pack-graphic__tear" />
      </div>
    </div>
  );
}

// ── Main PackOpener ───────────────────────────────────────────────────────────
// phases: idle → opening → revealing → summary
//
// cardState (during revealing): facedown → flipping → faceup → hiding
export default function PackOpener({ cards, setName, onCardsAdded, collection, cheatVisible, forceHolo, onToggleForceHolo, onChangeSet }) {
  const [phase,        setPhase]        = useState('idle');
  const [packCards,    setPackCards]    = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // cardState drives the flip + dismiss animation for the active card
  const [cardState,    setCardState]    = useState('facedown');
  const [modalCard,    setModalCard]    = useState(null);

  // Keep a ref so timers can read up-to-date packCards.length without stale closure
  const packCardsRef = useRef([]);
  // Stable ref for onCardsAdded so the hiding timer never holds a stale closure
  const onCardsAddedRef = useRef(onCardsAdded);
  useEffect(() => { onCardsAddedRef.current = onCardsAdded; }, [onCardsAdded]);
  // Snapshot of owned card IDs at the moment the pack was opened
  const preOpenCollectionRef = useRef(new Set());
  const collectionRef = useRef(collection);
  useEffect(() => { collectionRef.current = collection; }, [collection]);
  const openingTimerRef = useRef(null);
  const revealTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const holoRevealTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearTimeout(openingTimerRef.current);
    clearTimeout(revealTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(holoRevealTimerRef.current);
    openingTimerRef.current = null;
    revealTimerRef.current = null;
    hideTimerRef.current = null;
    holoRevealTimerRef.current = null;
  }, []);

  // ── State-machine side-effects ────────────────────────────────────────────
  // When card reaches 'faceup', auto-dismiss after 2 s
  useEffect(() => {
    if (cardState !== 'faceup') return;
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setCardState('hiding'), 2000);
    return () => clearTimeout(hideTimerRef.current);
  }, [cardState]);

  // Holo rare: buildup animation plays for 1.1 s before the card flips
  useEffect(() => {
    if (cardState !== 'holoReveal') return;
    holoRevealTimerRef.current = setTimeout(() => setCardState('faceup'), 1100);
    return () => clearTimeout(holoRevealTimerRef.current);
  }, [cardState]);

  // When dismiss animation ends, advance to the next card (or summary)
  useEffect(() => {
    if (cardState !== 'hiding') return;
    clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= packCardsRef.current.length) {
        onCardsAddedRef.current(packCardsRef.current);
        requestAnimationFrame(() => setPhase('summary'));
        return;
      }

      // Batch both updates in the same rAF so there's no intermediate render
      // where the old card loses its hiding animation and flashes visible.
      requestAnimationFrame(() => {
        setCardState('facedown');
        setCurrentIndex(nextIndex);
      });
    }, 450); // matches CSS hide animation duration
    return () => clearTimeout(revealTimerRef.current);
  }, [cardState]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleOpenPack = useCallback(() => {
    clearTimers();
    preOpenCollectionRef.current = new Set(collectionRef.current.map((c) => c.id));
    const drawn = openPack(cards, { forceHolo });
    packCardsRef.current = drawn;
    setPackCards(drawn);
    setCurrentIndex(0);
    setCardState('facedown');
    setPhase('opening');
    openingTimerRef.current = setTimeout(() => setPhase('revealing'), 700);
  }, [cards, clearTimers, forceHolo]);

  const handleSkipToSummary = useCallback(() => {
    clearTimers();
    onCardsAddedRef.current(packCardsRef.current);
    setPhase('summary');
  }, [clearTimers]);

  const currentCard    = packCards[currentIndex];
  const isHolo         = currentCard?.rarity === 'Rare Holo' || currentCard?.rarity === 'Secret Rare';
  const isNewCard      = currentCard != null && !preOpenCollectionRef.current.has(currentCard.id);

  const handleCardClick = useCallback(() => {
    if (cardState === 'faceup') {
      clearTimeout(hideTimerRef.current);
      setCardState('hiding');
      return;
    }

    // Click during holo buildup: skip straight to the flip
    if (cardState === 'holoReveal') {
      clearTimeout(holoRevealTimerRef.current);
      setCardState('faceup');
      return;
    }

    if (cardState !== 'facedown') return;

    // Holo rares trigger the dramatic buildup first
    if (isHolo) {
      setCardState('holoReveal');
    } else {
      setCardState('faceup');
    }
  }, [cardState, isHolo]);

  const handleReset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setPackCards([]);
    packCardsRef.current = [];
    setCurrentIndex(0);
    setCardState('facedown');
    setModalCard(null);
  }, [clearTimers]);

  const remaining      = packCards.length - currentIndex;
  const isHoloReveal   = cardState === 'holoReveal';
  const isFlipped      = cardState === 'faceup' || cardState === 'hiding';
  const isHiding       = cardState === 'hiding';

  return (
    <div className="pack-opener">
      {/* ── IDLE ── */}
      {phase === 'idle' && (
        <div className="pack-opener__idle">
          <h2 className="pack-opener__subtitle">{setName} Booster Pack</h2>
          <PackGraphic state="idle" setName={setName} />
          <button className="btn-open" onClick={handleOpenPack}>
            Open Pack
          </button>
          {onChangeSet && (
            <button className="btn-change-set" onClick={onChangeSet}>
              Change Set
            </button>
          )}
        </div>
      )}

      {/* ── OPENING – shake animation ── */}
      {phase === 'opening' && (
        <div className="pack-opener__idle">
          <PackGraphic state="shaking" setName={setName} />
        </div>
      )}

      {/* ── REVEALING – one card at a time ── */}
      {phase === 'revealing' && currentCard && (
        <div className="pack-opener__reveal">
          {/* Counter */}
          <div className="reveal-counter">
            <span className="reveal-counter__current">{currentIndex + 1}</span>
            <span className="reveal-counter__sep"> / </span>
            <span className="reveal-counter__total">{packCards.length}</span>
          </div>

          {/* Card stack */}
          <div className="card-stack-wrapper">
            {/* God rays burst for holo rare reveal */}
            {isHolo && (isHoloReveal || isFlipped) && <div className="stack-holo-rays" />}
            {/* Ghost layers for depth */}
            {remaining > 2 && <div className="stack-ghost stack-ghost--2"><img src={cardBackImg} alt="" draggable={false} /></div>}
            {remaining > 1 && <div className="stack-ghost stack-ghost--1"><img src={cardBackImg} alt="" draggable={false} /></div>}

            {/* Active card */}
            <div
              key={currentIndex}
              className={[
                'stack-flip',
                isFlipped     ? 'stack-flip--flipped'    : '',
                isHiding      ? 'stack-flip--hiding'     : '',
                isHoloReveal  ? 'stack-flip--holo-event' : '',
                isHolo && isFlipped ? 'stack-flip--holo' : '',
              ].join(' ')}
              onClick={handleCardClick}
              title={!isFlipped ? 'Click to reveal' : undefined}
            >
              {/* Card front */}
              <div className="stack-face stack-face--front">
                <img
                  src={getCardImageUrl(currentCard, 'high')}
                  alt={currentCard.name}
                  draggable="false"
                />
                {isHolo && <div className="stack-holo" />}
                {isNewCard && isFlipped && <div className="new-badge">NEW</div>}
                <div className={`stack-rarity rarity--${currentCard.rarity.replace(/\s+/g, '-').toLowerCase()}`}>
                  {currentCard.rarity === 'Rare Holo'
                    ? '★ HOLO'
                    : currentCard.rarity === 'Rare'
                    ? '★ RARE'
                    : currentCard.rarity}
                </div>
              </div>
              {/* Card back */}
              <div className="stack-face stack-face--back">
                <CardBack />
              </div>
            </div>
          </div>

          {/* Info row beneath the card */}
          <div className="reveal-info">
            {isFlipped ? (
              <>
                <p className="reveal-name">{currentCard.name}</p>
                <p className={`reveal-rarity rarity--${currentCard.rarity.replace(/\s+/g, '-').toLowerCase()}`}>
                  {currentCard.rarity}
                </p>
              </>
            ) : (
              <p className={`reveal-prompt${isHoloReveal ? ' reveal-prompt--holo' : ''}`}>
                {isHoloReveal
                  ? '✦ Rare Holo!'
                  : remaining > 1
                  ? `Click to reveal · ${remaining} remaining`
                  : 'Click to reveal · Last card!'}
              </p>
            )}
          </div>

          <button className="btn-skip-summary" onClick={handleSkipToSummary}>
            Skip to summary
          </button>
        </div>
      )}

      {/* ── SUMMARY – 2×5 grid ── */}
      {phase === 'summary' && (
        <div className="pack-opener__summary">
          <h2 className="summary-title">Pack Results</h2>

          <div className="summary-grid">
            {packCards.map((card, i) => (
              <div
                key={card.id + i}
                className="summary-card"
                style={{ animationDelay: `${i * 55}ms` }}
                onClick={() => setModalCard(card)}
              >
                <div className="summary-card__inner">
                  <PokemonCard card={card} size="normal" />
                  {!preOpenCollectionRef.current.has(card.id) && (
                    <div className="new-badge new-badge--summary">NEW</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-actions">
            <span className="summary-added">✓ Added to collection</span>
            <button className="btn-open" onClick={handleReset}>
              Open Another Pack
            </button>
            {onChangeSet && (
              <button className="btn-change-set" onClick={onChangeSet}>
                Change Set
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Full-screen card modal ── */}
      {modalCard && (
        <CardModal card={modalCard} onClose={() => setModalCard(null)} />
      )}

      {/* ── Cheat toggle (revealed by typing "holo") ── */}
      {cheatVisible && (
        <button
          className={`cheat-toggle${forceHolo ? ' cheat-toggle--on' : ''}`}
          onClick={onToggleForceHolo}
          title='Type "holo" to hide'
        >
          ✦ {forceHolo ? '100% HOLO  ON' : '100% HOLO  OFF'}
        </button>
      )}
    </div>
  );
}
