import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PackOpener from './components/PackOpener.jsx';
import Collection from './components/Collection.jsx';
import Achievements from './components/Achievements.jsx';
import SetSelector from './components/SetSelector.jsx';
import { useCollection } from './hooks/useCollection.js';
import { useEconomy } from './hooks/useEconomy.js';
import { loadSetCards, loadAllSetSymbols } from './services/tcgdex.js';
import { SETS } from './services/sets.js';
import { PACK_PRICES, getSellPrice, STARTING_BALANCE } from './services/economy.js';
import { ACHIEVEMENT_SETS, computeProgress, getAchievementReward } from './services/achievements.js';
import Settings from './components/Settings.jsx';
import CoinFlip from './components/CoinFlip.jsx';
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

  // ── Game mode ──────────────────────────────────────────────────────────────
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('pkmon_mode') ?? 'sandbox'; } catch { return 'sandbox'; }
  });
  const economyMode = mode === 'economy';

  // Separate collections per mode so economy players can't sell sandbox cards
  const sandboxCol = useCollection('pokemon_collection');
  const economyCol = useCollection('pkmon_eco_collection');
  const { collection, addCards, sellCard, resetCollection } = economyMode ? economyCol : sandboxCol;

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    try { localStorage.setItem('pkmon_mode', newMode); } catch { /* ignore */ }
  }, []);

  // ── Economy (coins) ──────────────────────────────────────────────────────
  const { coins, spend, earn, reset: resetCoins } = useEconomy();
  const [showCoinFlip, setShowCoinFlip] = useState(false);

  // Free pack tokens per set: { [setId]: count }
  const [freePacks, setFreePacks] = useState(() => {
    try {
      const raw = localStorage.getItem('pkmon_free_packs');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      // Migrate old global-number format back to per-set (put on base1 as fallback)
      if (typeof parsed === 'number') return parsed > 0 ? { base1: parsed } : {};
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch { return {}; }
  });

  const awardFreePack = useCallback((setId) => {
    setFreePacks((prev) => {
      const next = { ...prev, [setId]: (prev[setId] ?? 0) + 1 };
      try { localStorage.setItem('pkmon_free_packs', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const consumeFreePack = useCallback((setId) => {
    setFreePacks((prev) => {
      const count = (prev[setId] ?? 0) - 1;
      const next = { ...prev };
      if (count <= 0) delete next[setId]; else next[setId] = count;
      try { localStorage.setItem('pkmon_free_packs', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // All set IDs the player already has at least one card from (for random pack awards)
  const setsWithCards = useMemo(
    () => [...new Set(collection.map((c) => c.setId).filter(Boolean))],
    [collection],
  );

  // Sets the player already has cards from that are also currently loaded
  const eligibleFlipSets = useMemo(() => {
    if (!economyMode) return [];
    return Object.keys(loadedSets).filter((setId) => collection.some((c) => c.setId === setId));
  }, [economyMode, loadedSets, collection]);

  const hasDuplicates = useMemo(() => collection.some((c) => c.count > 1), [collection]);

  // "Truly broke": can't afford even the cheapest pack and nothing to sell
  const canCoinFlip = economyMode
    && eligibleFlipSets.length > 0
    && coins < PACK_PRICES['base1']
    && !hasDuplicates;

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

  // ── Achievement pack rewards (economy mode) ────────────────────────────────
  const [claimedAchievements, setClaimedAchievements] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pkmon_claimed_ach') ?? '[]')); }
    catch { return new Set(); }
  });
  const [achRewardNotif, setAchRewardNotif] = useState(null); // { title, packs }

  useEffect(() => {
    if (!economyMode || !allLoadedCards.length) return;
    const progress = computeProgress(allLoadedCards, collection);
    const newClaims = [];
    for (const set of ACHIEVEMENT_SETS) {
      for (const ach of set.achievements) {
        const prog = progress.get(ach.id);
        if (prog?.complete && !claimedAchievements.has(ach.id)) {
          newClaims.push(ach);
        }
      }
    }
    if (newClaims.length === 0) return;

    // Award packs randomly among sets the player already has cards from
    // (fall back to base1 if they somehow have no cards yet)
    const eligibleIds = setsWithCards.length > 0 ? setsWithCards : ['base1'];
    let totalPacks = 0;
    const notifTitle = newClaims[newClaims.length - 1].title;
    for (const ach of newClaims) {
      const reward = getAchievementReward(ach);
      totalPacks += reward;
      for (let i = 0; i < reward; i++) {
        const randomSetId = eligibleIds[Math.floor(Math.random() * eligibleIds.length)];
        awardFreePack(randomSetId);
      }
    }
    setAchRewardNotif({ title: notifTitle, packs: totalPacks });

    setClaimedAchievements((prev) => {
      const next = new Set([...prev, ...newClaims.map((a) => a.id)]);
      try { localStorage.setItem('pkmon_claimed_ach', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  // claimedAchievements intentionally omitted — we only re-run on collection/cards change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, allLoadedCards, economyMode]);

  // ── Reset progress ──────────────────────────────────────────────────────────
  const resetProgress = useCallback(() => {
    resetCollection();
    resetCoins();
    setFreePacks({});
    try { localStorage.removeItem('pkmon_free_packs'); } catch { /* ignore */ }
    setClaimedAchievements(new Set());
    try { localStorage.removeItem('pkmon_claimed_ach'); } catch { /* ignore */ }
    prevOwnedPerSet.current = {};
  }, [resetCollection, resetCoins]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);

  const showSetSelector = !selectedSetId || (!currentSetCards && !setLoading && !setError);

  return (
    <>
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">&#9670;</span>
          <h1>Booster<span>Dex</span></h1>
        </div>
        {economyMode && (
          <div className="header-economy">
            <div className="coin-display">
              <span className="coin-display__icon">🪙</span>
              <span className="coin-display__amount">{coins.toLocaleString()}</span>
            </div>
            {Object.values(freePacks).some((v) => v > 0) && (
              <div className="free-pack-display">
                <span className="free-pack-display__icon">🎁</span>
                <span className="free-pack-display__amount">{Object.values(freePacks).reduce((s, v) => s + v, 0)}</span>
              </div>
            )}
          </div>
        )}
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
          <button
            className="nav-btn nav-btn--icon"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            ⚙
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
                onChangeSet={() => {
                  setSelectedSetId(null);
                  try { localStorage.removeItem('pokemon_selected_set'); } catch { /* ignore */ }
                }}
                economyMode={economyMode}
                coins={coins}
                packPrice={PACK_PRICES[selectedSetId] ?? PACK_PRICES['base1']}
                onBuyPack={() => spend(PACK_PRICES[selectedSetId] ?? PACK_PRICES['base1'])}
                onSellCard={(card) => {
                  sellCard(card.id);
                  earn(getSellPrice(card, selectedSetId ?? 'base1'));
                }}
                getCardSellPrice={(card) => getSellPrice(card, selectedSetId ?? 'base1')}
                canCoinFlip={canCoinFlip}
                onCoinFlip={() => setShowCoinFlip(true)}
                freePacks={freePacks[selectedSetId] ?? 0}
                onUseFreePack={() => consumeFreePack(selectedSetId)}
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
            economyMode={economyMode}
            onSellCard={(card) => {
              sellCard(card.id);
              earn(getSellPrice(card, card.setId ?? 'base1'));
            }}
            getCardSellPrice={(card) => getSellPrice(card, card.setId ?? 'base1')}
          />
        )}

        {view === 'achievements' && (
          <Achievements
            collection={collection}
            allCards={allLoadedCards}
            economyMode={economyMode}
          />
        )}
      </main>
    </div>
    {showSettings && <Settings onClose={() => setShowSettings(false)} mode={mode} onModeChange={handleModeChange} onResetProgress={resetProgress} />}
    {showCoinFlip && (
      <CoinFlip
        eligibleSets={eligibleFlipSets}
        onWin={awardFreePack}
        onClose={() => setShowCoinFlip(false)}
      />
    )}
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
    {achRewardNotif && (
      <div className="ach-reward-overlay" onClick={() => setAchRewardNotif(null)}>
        <div className="ach-reward-modal" onClick={(e) => e.stopPropagation()}>
          <div className="ach-reward-icon">🏆</div>
          <h2 className="ach-reward-title">Achievement Complete!</h2>
          <p className="ach-reward-name">{achRewardNotif.title}</p>
          <p className="ach-reward-packs">
            🎁 +{achRewardNotif.packs} free pack{achRewardNotif.packs !== 1 ? 's' : ''} awarded!
          </p>
          <p className="ach-reward-hint">Check your pack opener — free packs are waiting.</p>
          <button className="ach-reward-btn" onClick={() => setAchRewardNotif(null)}>Claim</button>
        </div>
      </div>
    )}
    </>
  );
}
