import { useState, useMemo } from 'react';
import './DevPanel.css';

const SAMPLE_TOASTS = [
  { id: '__dev-common__',    rarity: 'Common',    icon: '○', title: 'Common Ground',  setName: 'Dev Test', packs: 0 },
  { id: '__dev-uncommon__',  rarity: 'Uncommon',  icon: '◇', title: 'Uncommon Find',  setName: 'Dev Test', packs: 0 },
  { id: '__dev-rare__',      rarity: 'Rare',      icon: '★', title: 'Rare Treasure',  setName: 'Dev Test', packs: 0 },
  { id: '__dev-holo__',      rarity: 'Rare Holo', icon: '✦', title: 'Holo Hunter',    setName: 'Dev Test', packs: 0 },
];

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Rare ex', 'Rare Holo', 'Secret Rare', 'Reverse Holo'];

export default function DevPanel({
  onClose,
  onFireToast,
  onFireSetComplete,
  forcedPack,
  onSetForcedPack,
  onClearForcedPack,
  currentSetCards,
  currentSetName,
  onClearAchievements,
  onAwardFreePacks,
}) {
  const [tab, setTab]           = useState('toasts');
  const [cardFilter, setCardFilter] = useState('');
  const [draftPack, setDraftPack]   = useState([]);

  // Sort and filter cards for the picker
  const filteredCards = useMemo(() => {
    if (!currentSetCards) return [];
    const q = cardFilter.toLowerCase().trim();
    const pool = q
      ? currentSetCards.filter(
          (c) => c.name?.toLowerCase().includes(q) || c.rarity?.toLowerCase().includes(q)
        )
      : currentSetCards;
    // Sort by rarity tier then name
    return [...pool]
      .sort((a, b) => {
        const ri = (r) => RARITY_ORDER.indexOf(r) === -1 ? 99 : RARITY_ORDER.indexOf(r);
        return ri(a.rarity) - ri(b.rarity) || (a.name ?? '').localeCompare(b.name ?? '');
      })
      .slice(0, 80);
  }, [currentSetCards, cardFilter]);

  const addToDraft = (card) => {
    if (draftPack.length >= 10) return;
    setDraftPack((prev) => [...prev, card]);
  };

  const removeFromDraft = (idx) => {
    setDraftPack((prev) => prev.filter((_, i) => i !== idx));
  };

  const queuePack = () => {
    if (draftPack.length === 0) return;
    onSetForcedPack([...draftPack]);
    setDraftPack([]);
  };

  const RARITY_COLORS = {
    'Common': '#94a3b8', 'Uncommon': '#10b981', 'Rare': '#f59e0b',
    'Rare ex': '#f97316', 'Rare Holo': '#a855f7', 'Secret Rare': '#f43f5e',
  };

  return (
    <div className="dev-panel">
      <div className="dev-panel__header">
        <span className="dev-panel__badge">DEV</span>
        <span className="dev-panel__title">Developer Panel</span>
        <button className="dev-panel__close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="dev-panel__tabs">
        {[['toasts', '🔔', 'Toasts'], ['pack', '📦', 'Pack'], ['misc', '🔧', 'Misc']].map(([id, icon, label]) => (
          <button
            key={id}
            className={`dev-tab${tab === id ? ' dev-tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="dev-panel__content">

        {/* ── Toasts tab ── */}
        {tab === 'toasts' && (
          <div className="dev-section">
            <p className="dev-label">Fire achievement toast by tier</p>
            <div className="dev-toast-grid">
              {SAMPLE_TOASTS.map((t) => (
                <button
                  key={t.rarity}
                  className="dev-btn"
                  style={{ '--accent': RARITY_COLORS[t.rarity] }}
                  onClick={() => onFireToast({ ...t, id: `__dev-${Date.now()}__` })}
                >
                  <span>{t.icon}</span>
                  <span>{t.rarity}</span>
                </button>
              ))}
            </div>
            <div className="dev-divider" />
            <p className="dev-label">Modal events</p>
            <button className="dev-btn dev-btn--wide" onClick={onFireSetComplete}>
              ◆ Set Complete Modal
            </button>
          </div>
        )}

        {/* ── Pack tab ── */}
        {tab === 'pack' && (
          <div className="dev-section">
            {forcedPack ? (
              <>
                <p className="dev-label">📦 Queued pack — {forcedPack.length} card{forcedPack.length !== 1 ? 's' : ''}</p>
                <p className="dev-hint">Will be used on next pack open, then cleared.</p>
                <div className="dev-chip-list">
                  {forcedPack.map((c, i) => (
                    <span key={i} className="dev-chip" style={{ '--accent': RARITY_COLORS[c.rarity] ?? '#64748b' }}>
                      {c.name}
                    </span>
                  ))}
                </div>
                <button className="dev-btn dev-btn--danger dev-btn--wide" onClick={onClearForcedPack}>
                  Clear Queue
                </button>
              </>
            ) : (
              <>
                <p className="dev-label">
                  Draft pack{currentSetName ? ` — ${currentSetName}` : ''}&nbsp;
                  <span className="dev-count">{draftPack.length}/10</span>
                </p>
                {!currentSetCards && (
                  <p className="dev-hint">Load a set first to pick cards.</p>
                )}
                {draftPack.length > 0 && (
                  <div className="dev-chip-list dev-chip-list--draft">
                    {draftPack.map((c, i) => (
                      <span key={i} className="dev-chip" style={{ '--accent': RARITY_COLORS[c.rarity] ?? '#64748b' }}>
                        {c.name}
                        <button className="dev-chip__remove" onClick={() => removeFromDraft(i)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  className="dev-input"
                  placeholder="Filter by name or rarity…"
                  value={cardFilter}
                  onChange={(e) => setCardFilter(e.target.value)}
                  disabled={!currentSetCards}
                />
                <div className="dev-card-list">
                  {filteredCards.map((c) => (
                    <button
                      key={c.id}
                      className="dev-card-row"
                      disabled={draftPack.length >= 10}
                      onClick={() => addToDraft(c)}
                    >
                      <span className="dev-card-row__name">{c.name}</span>
                      <span
                        className="dev-card-row__rarity"
                        style={{ color: RARITY_COLORS[c.rarity] ?? '#64748b' }}
                      >
                        {c.rarity ?? '?'}
                      </span>
                    </button>
                  ))}
                  {currentSetCards && filteredCards.length === 0 && (
                    <p className="dev-hint dev-hint--center">No cards match</p>
                  )}
                </div>
                <button
                  className="dev-btn dev-btn--primary dev-btn--wide"
                  onClick={queuePack}
                  disabled={draftPack.length === 0}
                >
                  Queue This Pack
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Misc tab ── */}
        {tab === 'misc' && (
          <div className="dev-section">
            <p className="dev-label">Achievements</p>
            <button className="dev-btn dev-btn--danger dev-btn--wide" onClick={onClearAchievements}>
              Reset Claimed Achievements
            </button>
            <div className="dev-divider" />
            <p className="dev-label">Economy</p>
            {[1, 5, 10].map((n) => (
              <button key={n} className="dev-btn dev-btn--wide" onClick={() => onAwardFreePacks(n)}>
                🎁 Award {n} free pack{n !== 1 ? 's' : ''}
              </button>
            ))}
          </div>
        )}

      </div>

      <div className="dev-panel__footer">
        Ctrl+Shift+D to toggle · not for production
      </div>
    </div>
  );
}
