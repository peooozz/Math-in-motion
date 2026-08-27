/**
 * HomePage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Ultra-simple, friendly 3D shape gallery.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import { SHAPES_ORDER } from '../data/shapeConfig';
import ShapeCard from '../components/Home/ShapeCard';
import useAppStore from '../store/useAppStore';

export default function HomePage() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 40%, #ffffff 100%)',
        overflowY: 'auto',
        padding: '1.5rem 1.5rem 3rem',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          maxWidth: '1100px',
          margin: '0 auto 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Sound Toggle (Top Right) */}
        <button
          onClick={toggleSound}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '0.4rem 0.8rem',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
          title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? '🔊 Sound' : '🔇 Muted'}
        </button>

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            margin: '0.5rem 0 0.3rem',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #4f46e5, #ec4899, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Math in Motion 🎈
        </h1>
        <p
          style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
            color: '#475569',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Touch a 3D toy shape to stretch it and discover formulas!
        </p>
      </header>

      {/* 8 Big 3D Shape Cards Grid */}
      <main
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {SHAPES_ORDER.map((shapeId) => (
          <ShapeCard key={shapeId} shapeId={shapeId} />
        ))}
      </main>
    </div>
  );
}
