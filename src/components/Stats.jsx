import { useMemo, useState, useEffect } from 'react';
import { getAllStats } from '../services/stats.js';
import { SETS } from '../services/sets.js';
import { SET_ORDER } from '../services/economy.js';
import './Stats.css';

// Build a lookup of set meta by id
const SET_META = Object.fromEntries(SETS.map((s) => [s.id, s]));

/** Find the most-pulled card in a pull map. Returns { name, count } or null. */
function getMostPulled(cardPulls, loadedSets, setId) {
  if (!cardPulls || Object.keys(cardPulls).length === 0) return null;
  let bestId = null;
  let bestCount = 0;
  for (const [id, count] of Object.entries(cardPulls)) {
    if (count > bestCount) { bestCount = count; bestId = id; }
  }
  if (!bestId) return null;
  // Try to resolve card name from loaded set data
  const setCards = loadedSets?.[setId];
  const card = setCards?.find((c) => c.id === bestId);
  const name = card?.name ?? bestId.split('-').slice(1).join('-') ?? bestId;
  return { name, count: bestCount };
}

export default function Stats({ loadedSets = {} }) {
  const [stats, setStats] = useState(() => getAllStats());
  const [tick, setTick] = useState(0);

  // Refresh stats when the component mounts or gains focus
  useEffect(() => {
    const refresh = () => { setStats(getAllStats()); setTick((t) => t + 1); };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const rows = useMemo(() => {
    return SET_ORDER.map((setId) => {
      const meta = SET_META[setId];
      if (!meta) return null;
      const setStats = stats[setId];
      const packsOpened = setStats?.packsOpened ?? 0;
      const packsToComplete = setStats?.packsAtCompletion ?? null;
      const mostPulled = packsOpened > 0
        ? getMostPulled(setStats?.cardPulls, loadedSets, setId)
        : null;
      return { setId, meta, packsOpened, packsToComplete, mostPulled };
    }).filter(Boolean);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, tick, loadedSets]);

  const totalPacks = useMemo(
    () => rows.reduce((sum, r) => sum + r.packsOpened, 0),
    [rows],
  );

  return (
    <div className="stats-screen">
      <div className="stats-screen__header">
        <h2 className="stats-screen__title">Stats</h2>
        <p className="stats-screen__sub">
          {totalPacks.toLocaleString()} pack{totalPacks !== 1 ? 's' : ''} opened in total
        </p>
      </div>

      <div className="stats-table-wrap">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="stats-th stats-th--set">Set</th>
              <th className="stats-th stats-th--num">Packs Opened</th>
              <th className="stats-th stats-th--num">Packs to Complete</th>
              <th className="stats-th stats-th--pull">Most Pulled</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ setId, meta, packsOpened, packsToComplete, mostPulled }) => (
              <tr key={setId} className={`stats-row${packsOpened === 0 ? ' stats-row--zero' : ''}`}>
                <td className="stats-td stats-td--set">
                  <span className="stats-set-dot" style={{ background: meta.accentColor }} />
                  <span className="stats-set-name">{meta.name}</span>
                  <span className="stats-set-year">{meta.year}</span>
                </td>
                <td className="stats-td stats-td--num">
                  {packsOpened === 0 ? (
                    <span className="stats-zero">—</span>
                  ) : (
                    <span className="stats-packs">{packsOpened.toLocaleString()}</span>
                  )}
                </td>
                <td className="stats-td stats-td--num">
                  {packsToComplete != null ? (
                    <span className="stats-packs">{packsToComplete.toLocaleString()}</span>
                  ) : (
                    <span className="stats-zero">—</span>
                  )}
                </td>
                <td className="stats-td stats-td--pull">
                  {mostPulled ? (
                    <span className="stats-pull">
                      <span className="stats-pull__name">{mostPulled.name}</span>
                      <span className="stats-pull__count">×{mostPulled.count}</span>
                    </span>
                  ) : (
                    <span className="stats-zero">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
