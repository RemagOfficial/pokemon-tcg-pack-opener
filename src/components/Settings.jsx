import { useState } from 'react';
import './Settings.css';

const CHANGELOG = [
  {
    version: '1.1.0',
    date: '2026-05-18',
    entries: [
      'Mobile card tilt — gyroscope support on Android and iOS, touch drag as fallback',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-18',
    entries: [
      'All 14 WotC-era sets available — Base Set through Skyridge',
      'Open packs, collect cards, and track your full collection per set',
      'Achievement system with milestones for each rarity tier and full set completion',
      'Secret Rares in Neo Revelation, Neo Destiny, and Team Rocket',
    ],
  },
];

export default function Settings({ onClose }) {
  const [gyroDisabled, setGyroDisabled] = useState(
    () => localStorage.getItem('pkmon_gyro_disabled') === 'true'
  );

  const toggleGyro = () => {
    const next = !gyroDisabled;
    setGyroDisabled(next);
    if (next) {
      localStorage.setItem('pkmon_gyro_disabled', 'true');
    } else {
      localStorage.removeItem('pkmon_gyro_disabled');
    }
  };
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settings-body">
          <section className="settings-section">
            <h3 className="settings-section__title">Preferences</h3>
            <div className="settings-toggle-row">
              <span className="settings-toggle-label">Gyroscope card tilt (when available)</span>
              <label className="settings-toggle">
                <input type="checkbox" checked={!gyroDisabled} onChange={toggleGyro} />
                <span className="settings-toggle-track" />
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3 className="settings-section__title">Changelog</h3>
            <div className="changelog">
              {CHANGELOG.map((release) => (
                <div key={release.version} className="changelog-entry">
                  <div className="changelog-entry__header">
                    <span className="changelog-entry__version">v{release.version}</span>
                    <span className="changelog-entry__date">{release.date}</span>
                  </div>
                  <ul className="changelog-entry__list">
                    {release.entries.map((entry, i) => (
                      <li key={i}>{entry}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
