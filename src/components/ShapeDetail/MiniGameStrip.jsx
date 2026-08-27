/**
 * MiniGameStrip.jsx
 * ═══════════════════════════════════════════════════════════════
 * Bottom-of-detail-page game strip.
 * Integrates all 4 interactive educational mini-games:
 *  1. 🎯 Match Volume (Target Rush & Streak)
 *  2. 🤔 Guess Before Drag (Prediction Arena)
 *  3. 🧩 Net Folding Lab (3D Folding & Spatial Quiz)
 *  4. 🌍 Real World Sorter (Everyday Object Classification)
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import MatchVolumeGame from './games/MatchVolumeGame';
import GuessBeforeDragGame from './games/GuessBeforeDragGame';
import NetMatchingGame from './games/NetMatchingGame';
import RealWorldMatchGame from './games/RealWorldMatchGame';
import { shapeConfig } from '../../data/shapeConfig';
import sound from '../../utils/soundEffects';

const GAME_TABS = [
  { key: 'matchVolume', label: '🎯 Match Target', icon: '🎯' },
  { key: 'guessBeforeDrag', label: '🤔 Prediction', icon: '🤔' },
  { key: 'netMatching', label: '🧩 Net Lab', icon: '🧩' },
  { key: 'realWorldMatch', label: '🌍 Real World', icon: '🌍' },
];

export default function MiniGameStrip({ shapeId, dimensions }) {
  const [activeGame, setActiveGame] = useState('matchVolume');
  const [expanded, setExpanded] = useState(true);
  const config = shapeConfig[shapeId];

  const primaryKey = config?.is2D ? 'area' : 'volume';
  const formula = config?.formulas?.[primaryKey];

  const handleTabClick = (key) => {
    sound.playPop();
    setActiveGame(key);
    setExpanded(true);
  };

  return (
    <div className="game-strip">
      {/* Game tab header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: expanded ? '0.6rem' : 0,
        gap: '0.4rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {GAME_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`btn btn-sm ${activeGame === tab.key && expanded ? 'btn-accent' : ''}`}
              onClick={() => handleTabClick(tab.key)}
              style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-sm"
          onClick={() => {
            sound.playPop();
            setExpanded(!expanded);
          }}
          style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
        >
          {expanded ? '▼ Minimize' : '▲ Play Arcade'}
        </button>
      </div>

      {/* Active game view */}
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
            <GuessBeforeDragGame shapeId={shapeId} dimensions={dimensions} />
          )}
          {activeGame === 'netMatching' && (
            <NetMatchingGame shapeId={shapeId} />
          )}
          {activeGame === 'realWorldMatch' && (
            <RealWorldMatchGame shapeId={shapeId} />
          )}
        </div>
      )}
    </div>
  );
}
