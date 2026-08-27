/**
 * MiniGameStrip.jsx
 * ═══════════════════════════════════════════════════════════════
 * Bottom-of-detail-page game strip (Light, sunny child-friendly).
 * Houses 5 interactive labs & arcade games:
 *  1. 🎯 Target Pop (Match target with stars)
 *  2. 🫗 Magic Pour (Cone/Pyramid ⅓ Proof Lab)
 *  3. ✂️ Laser Slicer (2D Cross-Sections)
 *  4. 🧩 Origami Net (Fold 2D pattern into 3D)
 *  5. 🤔 Prediction (Hypothesis testing)
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import MatchVolumeGame from './games/MatchVolumeGame';
import GuessBeforeDragGame from './games/GuessBeforeDragGame';
import NetMatchingGame from './games/NetMatchingGame';
import MagicPourLab from './labs/MagicPourLab';
import LaserSlicerLab from './labs/LaserSlicerLab';
import { shapeConfig } from '../../data/shapeConfig';
import sound from '../../utils/soundEffects';

const GAME_TABS = [
  { key: 'targetPop', label: '🎯 Target Pop', icon: '🎯' },
  { key: 'magicPour', label: '🫗 Magic Pour (⅓ Proof)', icon: '🫗' },
  { key: 'laserSlice', label: '✂️ Laser Slicer', icon: '✂️' },
  { key: 'origamiNet', label: '🧩 Origami Net', icon: '🧩' },
  { key: 'prediction', label: '🤔 Prediction', icon: '🤔' },
];

export default function MiniGameStrip({ shapeId, dimensions }) {
  const [activeTab, setActiveTab] = useState('targetPop');
  const [expanded, setExpanded] = useState(true);
  const config = shapeConfig[shapeId];

  const primaryKey = config?.is2D ? 'area' : 'volume';
  const formula = config?.formulas?.[primaryKey];

  const handleTabClick = (key) => {
    sound.playPop();
    setActiveTab(key);
    setExpanded(true);
  };

  return (
    <div className="game-strip">
      {/* Header controls & tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: expanded ? '0.6rem' : 0,
        gap: '0.4rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {GAME_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`btn btn-sm ${activeTab === tab.key && expanded ? 'btn-accent' : ''}`}
              onClick={() => handleTabClick(tab.key)}
              style={{
                fontSize: '0.76rem',
                padding: '0.3rem 0.75rem',
              }}
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
          style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
        >
          {expanded ? '▼ Minimize' : '▲ Open Lab'}
        </button>
      </div>

      {/* Active Lab Content */}
      {expanded && (
        <div style={{ marginTop: '0.4rem' }}>
          {activeTab === 'targetPop' && formula && (
            <MatchVolumeGame
              shapeId={shapeId}
              dimensions={dimensions}
              formulaKey={primaryKey}
            />
          )}
          {activeTab === 'magicPour' && (
            <MagicPourLab shapeId={shapeId} />
          )}
          {activeTab === 'laserSlice' && (
            <LaserSlicerLab shapeId={shapeId} />
          )}
          {activeTab === 'origamiNet' && (
            <NetMatchingGame shapeId={shapeId} />
          )}
          {activeTab === 'prediction' && (
            <GuessBeforeDragGame shapeId={shapeId} dimensions={dimensions} />
          )}
        </div>
      )}
    </div>
  );
}
