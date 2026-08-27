/**
 * HomePage.jsx
 * ═══════════════════════════════════════════════════════════════
 * The Shape Gallery & Game Hub.
 * Features: Player Profile Bar (Level, XP, Gems, Stars, Streak),
 * Adventure Quest vs. Free Play toggle, Grade Filters, 3D Previews,
 * Geo the Robot Mascot, and Trophy Room.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useMemo, useState } from 'react';
import useAppStore, { computePlayerLevel } from '../store/useAppStore';
import { shapeConfig, filterShapesByGrade } from '../data/shapeConfig';
import ShapeCard from '../components/Home/ShapeCard';
import GradeFilterBar from '../components/Home/GradeFilterBar';
import TodaysChallengeCard from '../components/Home/TodaysChallengeCard';
import TrophyModal from '../components/Home/TrophyModal';
import GeoCompanion from '../components/Mascot/GeoCompanion';
import sound from '../utils/soundEffects';

export default function HomePage() {
  const gradeFilter = useAppStore((s) => s.gradeFilter);
  const visited = useAppStore((s) => s.progress.visited);
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const player = useAppStore((s) => s.player);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  const [showTrophy, setShowTrophy] = useState(false);

  const visibleShapes = useMemo(
    () => filterShapesByGrade(gradeFilter),
    [gradeFilter]
  );

  const levelInfo = computePlayerLevel(player.xp);
  const lastVisited = visited.length > 0 ? visited[visited.length - 1] : null;

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, #0f0d1a 70%)',
      }}
    >
      {/* Trophy / Skin Shop Modal */}
      <TrophyModal isOpen={showTrophy} onClose={() => setShowTrophy(false)} />

      {/* ═══ TOP GAMIFICATION BAR ═══ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15, 13, 26, 0.6)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Player Level & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.78rem',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            LV.{levelInfo.level}
          </div>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: '0.82rem',
              color: 'var(--color-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {levelInfo.title}
            </div>
            {/* XP mini bar */}
            <div
              style={{
                width: '120px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
                marginTop: '2px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  width: `${levelInfo.progressPct}%`,
                  background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Currency, Streaks & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#fbbf24',
            }}
          >
            ⭐ {player.stars}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#34d399',
            }}
          >
            💎 {player.gems}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#f97316',
            }}
          >
            🔥 {player.streak}d
          </span>

          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              setShowTrophy(true);
            }}
            style={{
              background: 'rgba(251, 191, 36, 0.12)',
              borderColor: 'rgba(251, 191, 36, 0.25)',
              color: '#fbbf24',
              fontWeight: 700,
            }}
          >
            🏆 Shop
          </button>

          <button
            onClick={toggleSound}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0 0.2rem',
            }}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* ═══ HERO HEADER ═══ */}
      <header
        style={{
          padding: '2rem 1.5rem 1.2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            margin: '0 0 0.4rem',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Math in Motion 🎲
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'var(--color-text-secondary)',
            margin: '0 0 1.2rem',
            fontWeight: 500,
          }}
        >
          Touch it. Twist it. Understand it.
        </p>

        {/* Big Adventure Quest vs Free Play CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="btn btn-accent"
            onClick={() => setViewMode('map')}
            style={{
              padding: '0.65rem 1.4rem',
              fontSize: '0.92rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            🗺️ Play Adventure Quests ({player.stars}/36 ⭐)
          </button>
          <button
            className="btn"
            onClick={() => {
              sound.playPop();
              setShowTrophy(true);
            }}
            style={{ padding: '0.65rem 1.2rem', fontSize: '0.92rem' }}
          >
            🎨 3D Skin Shop
          </button>
        </div>

        {/* Grade Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GradeFilterBar />
        </div>
      </header>

      {/* ═══ GEO MASCOT SPEECH BUBBLE ═══ */}
      <div style={{ maxWidth: '640px', margin: '0 auto 1.2rem', padding: '0 1.5rem' }}>
        <GeoCompanion message="Welcome, Explorer! Choose an Adventure Quest to unlock stars, or pick any 3D shape below for hands-on free play!" />
      </div>

      {/* ═══ CONTINUE STRIP ═══ */}
      {lastVisited && shapeConfig[lastVisited] && (
        <div style={{ maxWidth: '640px', margin: '0 auto 1rem', padding: '0 1.5rem' }}>
          <div
            onClick={() => setCurrentShape(lastVisited)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.7rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            role="button"
            tabIndex={0}
          >
            <span style={{ fontSize: '1.3rem' }}>{shapeConfig[lastVisited].emoji}</span>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Continue where you left off
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                {shapeConfig[lastVisited].name}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>→</span>
          </div>
        </div>
      )}

      {/* ═══ SHAPE GALLERY GRID ═══ */}
      <main
        style={{
          padding: '0 1.5rem',
          maxWidth: '1200px',
          margin: '0 auto 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {visibleShapes.map((shapeId) => (
          <ShapeCard key={shapeId} shapeId={shapeId} />
        ))}
      </main>

      {/* ═══ TODAY'S CHALLENGE CARD ═══ */}
      <div style={{ maxWidth: '640px', margin: '0 auto 2rem', padding: '0 1.5rem' }}>
        <TodaysChallengeCard />
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Math in Motion — Interactive 3D Learning & Game Platform · CBSE Aligned
        </p>
      </footer>
    </div>
  );
}
