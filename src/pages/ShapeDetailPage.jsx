/**
 * ShapeDetailPage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Sunny & Light-Themed 3D Detail Page Template.
 * Integrates: 3D Stage + Draggable Handles, Visual Formula Chips,
 * Geo the Robot Mascot, and the 5 Interactive Labs / Arcade Games.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import useAppStore, { computePlayerLevel } from '../store/useAppStore';
import { shapeConfig, getDefaultDimensions, getAdjacentShapes } from '../data/shapeConfig';
import ShapeStage3D from '../components/ShapeDetail/ShapeStage3D';
import LiveDimensionsCard from '../components/ShapeDetail/LiveDimensionsCard';
import LiveFormulaCard from '../components/ShapeDetail/LiveFormulaCard';
import DifficultyToggle from '../components/Shared/DifficultyToggle';
import ChallengePrompt from '../components/Shared/ChallengePrompt';
import MiniGameStrip from '../components/ShapeDetail/MiniGameStrip';
import GeoCompanion from '../components/Mascot/GeoCompanion';
import QuestModal from '../components/Quests/QuestModal';
import TrophyModal from '../components/Home/TrophyModal';
import sound from '../utils/soundEffects';

export default function ShapeDetailPage({ shapeId }) {
  const config = shapeConfig[shapeId];
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const goHome = useAppStore((s) => s.goHome);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const seeInside = useAppStore((s) => s.seeInside);
  const toggleSeeInside = useAppStore((s) => s.toggleSeeInside);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const activeQuestId = useAppStore((s) => s.activeQuestId);
  const player = useAppStore((s) => s.player);
  const earnBadge = useAppStore((s) => s.earnBadge);

  const [dimensions, setDimensions] = useState(() => getDefaultDimensions(shapeId));
  const [showTrophy, setShowTrophy] = useState(false);

  useMemo(() => {
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  const handleDimensionChange = useCallback(
    (key, value) => {
      earnBadge('first_drag');
      setDimensions((prev) => ({ ...prev, [key]: value }));
    },
    [earnBadge]
  );

  const handleReset = useCallback(() => {
    sound.playSnap();
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  const { prev, next } = getAdjacentShapes(shapeId);
  const levelInfo = computePlayerLevel(player.xp);

  const challenge = useMemo(() => {
    if (!config?.challenges?.length) return null;
    return config.challenges[Math.floor(Math.random() * config.challenges.length)];
  }, [shapeId, config]);

  if (!config) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Shape not found.</p>
        <button className="btn" onClick={goHome}>
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div
      className="page-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#f8fafc',
      }}
    >
      {/* Active Quest Modal HUD */}
      {activeQuestId && (
        <QuestModal questId={activeQuestId} dimensions={dimensions} />
      )}

      {/* Trophy & Skin Shop Modal */}
      <TrophyModal isOpen={showTrophy} onClose={() => setShowTrophy(false)} />

      {/* ═══ TOP BAR (LIGHT & SUNNY) ═══ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1.2rem',
          borderBottom: '1.5px solid #e2e8f0',
          flexShrink: 0,
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button className="btn btn-sm" onClick={goHome}>
            ← Gallery
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setViewMode('map')}
          >
            🗺️ Quests
          </button>
        </div>

        {/* Shape Name Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '1.2rem',
            color: '#0f172a',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{config.emoji}</span>
          <span>{config.name}</span>
        </div>

        {/* Right: Gamification Chips & Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              setShowTrophy(true);
            }}
            style={{
              background: '#fef3c7',
              borderColor: '#fde68a',
              color: '#b45309',
              fontWeight: 800,
            }}
          >
            🏆 {player.gems} 💎
          </button>

          <button
            onClick={toggleSound}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '0 0.2rem',
            }}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          <DifficultyToggle compact />
        </div>
      </div>

      {/* ═══ MAIN SPLIT VIEW ═══ */}
      <div
        className="detail-split"
        style={{ padding: '0.6rem 0.8rem', flex: 1, minHeight: 0 }}
      >
        {/* ─── 3D STAGE ─── */}
        <div className="detail-stage">
          <Canvas
            camera={{ position: [6, 4, 6], fov: 45 }}
            gl={{ localClippingEnabled: true, antialias: true }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
          >
            <ShapeStage3D
              shapeId={shapeId}
              dimensions={dimensions}
              onDimensionChange={handleDimensionChange}
            />
          </Canvas>

          {/* Stage Overlay Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.8rem',
              left: '0.8rem',
              display: 'flex',
              gap: '0.4rem',
              zIndex: 10,
            }}
          >
            <button
              className={`btn btn-sm ${seeInside ? 'btn-accent' : ''}`}
              onClick={toggleSeeInside}
            >
              {seeInside ? '👁️ Solid Toy' : '🧱 Block Grid (Inside)'}
            </button>
            <button className="btn btn-sm" onClick={handleReset}>
              🔄 Reset Size
            </button>
          </div>
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="detail-sidebar">
          {/* Geo Robot Companion */}
          <GeoCompanion
            message={`Drag the colored dots on the ${config.name} to see the formula chips multiply in real time!`}
          />

          {/* Live Dimensions */}
          <LiveDimensionsCard shapeId={shapeId} dimensions={dimensions} />

          {/* Visual Formula Discovery Card */}
          <LiveFormulaCard shapeId={shapeId} dimensions={dimensions} />

          {/* Challenge Prompt */}
          {challenge && <ChallengePrompt text={challenge} />}
        </div>
      </div>

      {/* ═══ BOTTOM BAR (MINI-GAMES & LABS) ═══ */}
      <div
        style={{
          padding: '0.4rem 0.8rem 0.6rem',
          borderTop: '1.5px solid #e2e8f0',
          background: '#ffffff',
          flexShrink: 0,
        }}
      >
        <MiniGameStrip shapeId={shapeId} dimensions={dimensions} />

        {/* Navigation row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.4rem',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <button
            className="btn btn-sm"
            disabled={!prev}
            onClick={() => prev && setCurrentShape(prev)}
            style={!prev ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
          >
            ← {prev ? shapeConfig[prev]?.name : 'Prev'}
          </button>

          <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
            {levelInfo.title}
          </div>

          <button
            className="btn btn-sm"
            disabled={!next}
            onClick={() => next && setCurrentShape(next)}
            style={!next ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
          >
            {next ? shapeConfig[next]?.name : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
}
