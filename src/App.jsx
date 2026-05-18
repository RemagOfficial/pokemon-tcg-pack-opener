import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PackOpener from './components/PackOpener.jsx';
import Collection from './components/Collection.jsx';
import Achievements from './components/Achievements.jsx';
import SetSelector from './components/SetSelector.jsx';
import { useCollection } from './hooks/useCollection.js';
import { loadSetCards, loadAllSetSymbols } from './services/tcgdex.js';
import { SETS } from './services/sets.js';
import './App.css';

// Persist + restore the last-selected set id
function loadSavedSetId() {
  try { return localStorage.getItem('pokemon_selected_set') ?? null; } catch { return null; }
}

export default function App() {
  const [view, setView] = useState('pack');

  // ── Per-set card cache ─────────────────────────────────────────────────────
  // loadedSets: { [setId]: cards[] }  — stored in state so re-renders fire
  const [loadedSets, setLoadedSets] = useState({});
  const [setSymbols, setSetSymbols] = useState({});
  const [selectedSetId, setSelectedSetId] = useState(loadSavedSetId);
  const [setLoading, setSetLoading] = useState(false);
  const [setError, setSetError] = useState(null);
  // Tracks whether we've already triggered the auto-load on mount
  const didInitialLoad = useRef(false);

  // All cards from every loaded set combined — fed to Achievements
  const allLoadedCards = useMemo(
    () => Object.values(loadedSets).flat(),
    [loadedSets],
  );

  // Cards for the currently-selected set (null if none / loading)
  const currentSetCards = selectedSetId ? (loadedSets[selectedSetId] ?? null) : null;
  const currentSetConfig = SETS.find((s) => s.id === selectedSetId) ?? null;

  const loadSet = useCallback(async (setId) => {
    // Already cached — nothing to fetch
    if (loadedSets[setId]) return;
    setSetLoading(true);
    setSetError(null);
    try {
      const cards = await loadSetCards(setId);
      setLoadedSets((prev) => ({ ...prev, [setId]: cards }));
    } catch (err) {
      setSetError(err.message ?? 'Failed to load set');
    } finally {
      setSetLoading(false);
    }
  }, [loadedSets]);

  // Auto-load the saved set on first mount
  useEffect(() => {
    if (!didInitialLoad.current && selectedSetId) {
      didInitialLoad.current = true;
      loadSet(selectedSetId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load set symbol URLs in the background on first mount
  useEffect(() => {
    loadAllSetSymbols().then(setSetSymbols).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectSet = useCallback(async (setId) => {
    setSelectedSetId(setId);
    try { localStorage.setItem('pokemon_selected_set', setId); } catch { /* ignore */ }
    await loadSet(setId);
  }, [loadSet]);

  // ── Cheat toggle ───────────────────────────────────────────────────────────
  const [cheatVisible, setCheatVisible] = useState(false);
  const [forceHolo,    setForceHolo]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const konamiRef = useRef('');
  useEffect(() => {
    const SECRET = 'holo';
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      konamiRef.current = (konamiRef.current + e.key.toLowerCase()).slice(-SECRET.length);
      if (konamiRef.current === SECRET) {
        setCheatVisible((v) => {
          showToast(v ? 'Cheat panel hidden' : '✦ Holo luck toggle unlocked');
          return !v;
        });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showToast]);

  const { collection, addCards } = useCollection();

  // ── Set completion reward ──────────────────────────────────────────────────
  // Tracks per-set owned counts so the modal fires only on the transition
  const [setComplete,     setSetComplete]     = useState(false);
  const [setCompleteName, setSetCompleteName] = useState('');
  const [setCompleteTotal, setSetCompleteTotal] = useState(0);
  const prevOwnedPerSet = useRef({});

  useEffect(() => {
    const ownedIds = new Set(collection.map((c) => c.id));
    for (const [setId, setCards] of Object.entries(loadedSets)) {
      const currentOwned = setCards.filter((c) => ownedIds.has(c.id)).length;
      const prevOwned = prevOwnedPerSet.current[setId] ?? 0;
      if (prevOwned < setCards.length && currentOwned >= setCards.length) {
        const cfg = SETS.find((s) => s.id === setId);
        setSetCompleteName(cfg?.name ?? setId);
        setSetCompleteTotal(setCards.length);
        setSetComplete(true);
      }
      prevOwnedPerSet.current[setId] = currentOwned;
    }
  }, [collection, loadedSets]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const showSetSelector = !selectedSetId || (!currentSetCards && !setLoading && !setError);

  return (
    <>
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">&#9670;</span>
          <h1>Pokémon TCG <span>Pack Opener</span></h1>
        </div>
        <nav className="app-header__nav">
          <button
            className={`nav-btn${view === 'pack' ? ' nav-btn--active' : ''}`}
            onClick={() => setView('pack')}
          >
            Open Packs
          </button>
          <button
            className={`nav-btn${view === 'collection' ? ' nav-btn--active' : ''}`}
            onClick={() => setView('collection')}
          >
            Collection
            {collection.length > 0 && (
              <span className="nav-btn__badge">{collection.length}</span>
            )}
          </button>
          <button
            className={`nav-btn${view === 'achievements' ? ' nav-btn--active' : ''}`}
            onClick={() => setView('achievements')}
          >
            Achievements
          </button>
        </nav>
      </header>

      {/* ── Main content ── */}
      <main className="app-main">
        {view === 'pack' && (
          <>
            {/* Loading a set */}
            {setLoading && (
              <div className="app-loading">
                <div className="pokeball-spinner">
                  <div className="pokeball-spinner__top" />
                  <div className="pokeball-spinner__band" />
                  <div className="pokeball-spinner__bottom" />
                  <div className="pokeball-spinner__center" />
                </div>
                <p>Loading {currentSetConfig?.name ?? 'set'}…</p>
              </div>
            )}

            {/* Set load error */}
            {setError && !setLoading && (
              <div className="app-error">
                <p>⚠ Could not load card data</p>
                <p className="app-error__detail">{setError}</p>
                <button
                  className="btn-retry"
                  onClick={() => selectedSetId && loadSet(selectedSetId)}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Set selector grid */}
            {!setLoading && !setError && showSetSelector && (
              <SetSelector onSelect={handleSelectSet} setSymbols={setSymbols} />
            )}

            {/* Pack opener — shown when a set is selected and its cards are loaded */}
            {!setLoading && !setError && currentSetCards && (
              <PackOpener
                key={selectedSetId}
                cards={currentSetCards}
                setName={currentSetConfig?.name ?? ''}
                onCardsAdded={addCards}
                collection={collection}
                cheatVisible={cheatVisible}
                forceHolo={forceHolo}
                onToggleForceHolo={() => setForceHolo((v) => !v)}
                onChangeSet={() => {
                  setSelectedSetId(null);
                  try { localStorage.removeItem('pokemon_selected_set'); } catch { /* ignore */ }
                }}
              />
            )}
          </>
        )}

        {view === 'collection' && (
          <Collection
            collection={collection}
            loadedSets={loadedSets}
            setSymbols={setSymbols}
            onLoadSet={loadSet}
          />
        )}

        {view === 'achievements' && (
          <Achievements
            collection={collection}
            allCards={allLoadedCards}
          />
        )}
      </main>
    </div>
    {toast && <div className="app-toast">{toast}</div>}
    {setComplete && (
      <div className="set-complete-overlay" onClick={() => setSetComplete(false)}>
        <div className="set-complete-modal" onClick={(e) => e.stopPropagation()}>
          <div className="set-complete-rays" />
          <div className="set-complete-badge">&#9670;</div>
          <h2 className="set-complete-title">{setCompleteName} Complete!</h2>
          <p className="set-complete-sub">You've collected all {setCompleteTotal} cards.</p>
          <p className="set-complete-flavor">A true Pokémon Master.</p>
          <button className="set-complete-btn" onClick={() => setSetComplete(false)}>Continue</button>
        </div>
      </div>
    )}
    </>
  );
}
