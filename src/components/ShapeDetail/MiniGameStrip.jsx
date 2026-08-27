/**
 * MiniGameStrip.jsx
 * Bottom-of-detail-page game strip. Shows the active mini-game for the current shape.
 */
import React, { useState } from 'react';
import MatchVolumeGame from './games/MatchVolumeGame';
import { shapeConfig } from '../../data/shapeConfig';

const GAME_TABS = [
  { key: 'matchVolume', label: '🎯 Match Volume', available: true },
  { key: 'guessBeforeDrag', label: '🤔 Guess First', available: false },
  { key: 'netMatching', label: '🧩 Net Match', available: false },
  { key: 'realWorldMatch', label: '🌍 Real World', available: false },
];

export default function MiniGameStrip({ shapeId, dimensions }) {
  const [activeGame, setActiveGame] = useState('matchVolume');
  const [expanded, setExpanded] = useState(false);
  const config = shapeConfig[shapeId];

  // Determine the primary formula key (volume for 3D, area for 2D)
  const primaryKey = config?.is2D ? 'area' : 'volume';
  const formula = config?.formulas?.[primaryKey];

  return (
    <div className="game-strip">
      {/* Game tab header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: expanded ? '0.6rem' : 0,
      }}>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {GAME_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`btn btn-sm ${activeGame === tab.key ? 'btn-accent' : ''}`}
              onClick={() => {
                setActiveGame(tab.key);
                setExpanded(true);
              }}
              disabled={!tab.available}
              style={!tab.available ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-sm"
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '0.7rem' }}
        >
          {expanded ? '▼ Hide' : '▲ Play'}
        </button>
      </div>

      {/* Active game */}
      {expanded && (
        <div style={{ marginTop: '0.4rem' }}>
          {activeGame === 'matchVolume' && formula && (
            <MatchVolumeGame
              shapeId={shapeId}
              dimensions={dimensions}
              formulaKey={primaryKey}
            />
          )}
          {activeGame === 'guessBeforeDrag' && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              🤔 Guess Before You Drag — Coming Soon!
            </div>
          )}
          {activeGame === 'netMatching' && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              🧩 Net Matching — Coming Soon!
            </div>
          )}
          {activeGame === 'realWorldMatch' && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
              🌍 Real World Match — Coming Soon!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
