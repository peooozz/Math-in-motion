/**
 * ShapeDetailPage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Ultra-simple, focused 3D Shape Playground.
 * Pure interaction: Spin shape, drag handles or sliders,
 * and watch the big colorful visual formula multiply in real time!
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import useAppStore from '../store/useAppStore';
import { shapeConfig, getDefaultDimensions, computeAllFormulas, getAdjacentShapes } from '../data/shapeConfig';
import ShapeStage3D from '../components/ShapeDetail/ShapeStage3D';
import sound from '../utils/soundEffects';

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export default function ShapeDetailPage({ shapeId }) {
  const config = shapeConfig[shapeId];
  const goHome = useAppStore((s) => s.goHome);
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const showBlocks = useAppStore((s) => s.showBlocks);
  const toggleBlocks = useAppStore((s) => s.toggleBlocks);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  const [dimensions, setDimensions] = useState(() => getDefaultDimensions(shapeId));

  useMemo(() => {
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  const handleDimensionChange = useCallback((key, value) => {
    setDimensions((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    sound.playSnap();
    setDimensions(getDefaultDimensions(shapeId));
  }, [shapeId]);

  const { prev, next } = getAdjacentShapes(shapeId);

  if (!config) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn" onClick={goHome}>
          ← Back to Shapes
        </button>
      </div>
    );
  }

  const results = computeAllFormulas(shapeId, dimensions);
  const primaryKey = config.is2D ? 'area' : 'volume';
  const primaryFormula = config.formulas[primaryKey];
  const primaryResult = results[primaryKey] || 0;

  return (
    <div
      className="page-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* ═══ TOP BAR ═══ */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.2rem',
          background: '#ffffff',
          borderBottom: '2px solid #e2e8f0',
          flexShrink: 0,
          gap: '0.6rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        {/* Back Button */}
        <button
          className="btn"
          onClick={goHome}
          style={{ fontWeight: 800, padding: '0.45rem 1rem' }}
        >
          ← All Shapes
        </button>

        {/* Shape Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '1.4rem',
            color: '#0f172a',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>{config.emoji}</span>
          <span>{config.name}</span>
        </div>

        {/* Controls: Reset, Toggle Blocks, Sound */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${showBlocks ? 'btn-accent' : ''}`}
            onClick={toggleBlocks}
            style={{ fontWeight: 800 }}
          >
            {showBlocks ? '🧱 Solid View' : '🧱 Show Blocks'}
          </button>

          <button
            className="btn btn-sm"
            onClick={handleReset}
            style={{ fontWeight: 700 }}
          >
            🔄 Reset
          </button>

          <button
            onClick={toggleSound}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0 0.2rem',
            }}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* ═══ 3D INTERACTIVE STAGE ═══ */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #e2e8f0 100%)',
          minHeight: 0,
        }}
      >
        <Canvas
          camera={{ position: [6, 4, 6], fov: 45 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <ShapeStage3D
            shapeId={shapeId}
            dimensions={dimensions}
            onDimensionChange={handleDimensionChange}
          />
        </Canvas>

        {/* Previous / Next Floating Arrows */}
        {prev && (
          <button
            className="btn"
            onClick={() => setCurrentShape(prev)}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '0.6rem 0.9rem',
              fontWeight: 800,
            }}
          >
            ← {shapeConfig[prev]?.name}
          </button>
        )}

        {next && (
          <button
            className="btn"
            onClick={() => setCurrentShape(next)}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              padding: '0.6rem 0.9rem',
              fontWeight: 800,
            }}
          >
            {shapeConfig[next]?.name} →
          </button>
        )}
      </main>

      {/* ═══ BOTTOM VISUAL FORMULA & SLIDERS BAR ═══ */}
      <footer
        style={{
          background: '#ffffff',
          borderTop: '2px solid #e2e8f0',
          padding: '1rem 1.5rem 1.25rem',
          flexShrink: 0,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* BIG LIVE FORMULA CHIPS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '0.85rem',
            }}
          >
            {config.dimensions.map((dim, idx) => (
              <React.Fragment key={dim.key}>
                {idx > 0 && (
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#94a3b8' }}>
                    ×
                  </span>
                )}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '14px',
                    background: `${dim.color}15`,
                    border: `2px solid ${dim.color}`,
                    color: dim.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '1.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{dim.label}:</span>
                  <span>{round(dimensions[dim.key])} cm</span>
                </div>
              </React.Fragment>
            ))}

            {config.id === 'cone' && (
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#d97706', background: '#fef3c7', padding: '0.3rem 0.6rem', borderRadius: '10px' }}>
                × ⅓
              </span>
            )}
            {config.id === 'pyramid' && (
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ea580c', background: '#ffedd5', padding: '0.3rem 0.6rem', borderRadius: '10px' }}>
                × ⅓
              </span>
            )}
            {config.id === 'triangle' && (
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0d9488', background: '#ccfbf1', padding: '0.3rem 0.6rem', borderRadius: '10px' }}>
                × ½
              </span>
            )}

            {/* Equals Result */}
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#64748b' }}>=</span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '0.3rem',
                padding: '0.4rem 1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)',
                border: '2px solid #818cf8',
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  fontSize: '1.45rem',
                  color: '#4f46e5',
                }}
              >
                {round(primaryResult, 1)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>
                {primaryFormula?.unit} 🌟
              </span>
            </div>
          </div>

          {/* TOUCH SLIDERS ROW */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.dimensions.length}, 1fr)`,
              gap: '1rem',
            }}
          >
            {config.dimensions.map((dim) => (
              <div key={dim.key} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: dim.color,
                  marginBottom: '0.2rem',
                }}>
                  {dim.label} ({round(dimensions[dim.key])} cm)
                </div>
                <input
                  type="range"
                  min={dim.min}
                  max={dim.max}
                  step={dim.step || 0.5}
                  value={dimensions[dim.key]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    sound.playMarimba(300 + val * 50);
                    handleDimensionChange(dim.key, val);
                  }}
                  style={{
                    width: '100%',
                    accentColor: dim.color,
                    cursor: 'pointer',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
