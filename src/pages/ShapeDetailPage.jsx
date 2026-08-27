/**
 * ShapeDetailPage.jsx
 * ═══════════════════════════════════════════════════════════════
 * THE single reusable detail page template.
 * Driven entirely by shapeConfig[shapeId] — no per-shape code.
 *
 * Layout:
 *  - Top bar (back, title, difficulty toggle)
 *  - Split view (3D stage | sidebar with dims + formula)
 *  - Bottom bar (mini-game + navigation)
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import useAppStore from '../store/useAppStore';
import { shapeConfig, getDefaultDimensions, getAdjacentShapes } from '../data/shapeConfig';
import ShapeStage3D from '../components/ShapeDetail/ShapeStage3D';
import LiveDimensionsCard from '../components/ShapeDetail/LiveDimensionsCard';
import LiveFormulaCard from '../components/ShapeDetail/LiveFormulaCard';
import DifficultyToggle from '../components/Shared/DifficultyToggle';
import ChallengePrompt from '../components/Shared/ChallengePrompt';
import MiniGameStrip from '../components/ShapeDetail/MiniGameStrip';

export default function ShapeDetailPage({ shapeId }) {
  const config = shapeConfig[shapeId];
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const goHome = useAppStore((s) => s.goHome);
  const seeInside = useAppStore((s) => s.seeInside);
  const toggleSeeInside = useAppStore((s) => s.toggleSeeInside);

  // ─── Dimension state (component-level for 60fps drag perf) ──
  const [dimensions, setDimensions] = useState(() => getDefaultDimensions(shapeId));

  // Reset dimensions when shape changes
  useMemo(() => {
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  const handleDimensionChange = useCallback((key, value) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  // ─── Navigation ──────────────────────────────────────────────
  const { prev, next } = getAdjacentShapes(shapeId);

  // Pick a random challenge
  const challenge = useMemo(() => {
    if (!config?.challenges?.length) return null;
    return config.challenges[Math.floor(Math.random() * config.challenges.length)];
  }, [shapeId]);

  if (!config) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Shape not found.</p>
        <button className="btn" onClick={goHome}>Back to Gallery</button>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* ═══ TOP BAR ═══ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {/* Left: Back button */}
        <button className="btn btn-sm" onClick={goHome}>
          ← Gallery
        </button>

        {/* Center: Shape name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '1.1rem',
        }}>
          <span style={{ fontSize: '1.4rem' }}>{config.emoji}</span>
          <span>{config.name}</span>
        </div>

        {/* Right: Difficulty toggle */}
        <DifficultyToggle compact />
      </div>

      {/* ═══ MAIN SPLIT VIEW ═══ */}
      <div className="detail-split" style={{ padding: '0.5rem 0.75rem', flex: 1, minHeight: 0 }}>
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

          {/* Stage overlay controls */}
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 10,
          }}>
            <button
              className={`btn btn-sm ${seeInside ? 'btn-accent' : ''}`}
              onClick={toggleSeeInside}
            >
              {seeInside ? '👁️ Solid' : '👁️ See Inside'}
            </button>
            <button className="btn btn-sm" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="detail-sidebar">
          {/* Live Dimensions */}
          <LiveDimensionsCard shapeId={shapeId} dimensions={dimensions} />

          {/* Live Formula — THE STAR */}
          <LiveFormulaCard shapeId={shapeId} dimensions={dimensions} />

          {/* Challenge prompt */}
          {challenge && <ChallengePrompt text={challenge} />}
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div style={{
        padding: '0.5rem 0.75rem 0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* Mini-game strip */}
        <MiniGameStrip shapeId={shapeId} dimensions={dimensions} />

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          gap: '0.5rem',
        }}>
          <button
            className="btn btn-sm"
            disabled={!prev}
            onClick={() => prev && setCurrentShape(prev)}
            style={!prev ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
          >
            ← {prev ? shapeConfig[prev]?.name : 'Prev'}
          </button>

          <button className="btn btn-sm" onClick={goHome}>
            🏠 Gallery
          </button>

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
