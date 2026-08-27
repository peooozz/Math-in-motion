/**
 * HomePage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Sunny & Playful 3D Geometry Game Hub.
 * Features: Player Profile Bar (Level, Stars, Gems, Streaks),
 * Adventure Quest vs. Free Play CTA, Grade Filters, 3D Previews,
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
        background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 40%, #ffffff 100%)',
      }}
    >
      {/* Trophy / Skin Shop Modal */}
      <TrophyModal isOpen={showTrophy} onClose={() => setShowTrophy(false)} />

      {/* ═══ TOP GAMIFICATION BAR (LIGHT & SUNNY) ═══ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.5rem',
          borderBottom: '1.5px solid #e2e8f0',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          gap: '0.5rem',
          flexWrap: 'wrap',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left: Player Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.82rem',
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            }}
          >
            LV.{levelInfo.level}
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#0f172a',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {levelInfo.title}
            </div>
            {/* XP mini bar */}
            <div
              style={{
                width: '120px',
                height: '5px',
                borderRadius: '3px',
                background: '#e2e8f0',
                overflow: 'hidden',
                marginTop: '2px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  width: `${levelInfo.progressPct}%`,
                  background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Currency & Sound Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '9999px',
            background: '#f1f5f9',
            border: '1.5px solid #e2e8f0',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706' }}>
              ⭐ {player.stars}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
              💎 {player.gems}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c' }}>
              🔥 {player.streak}d
            </span>
          </div>

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
            🏆 Shop
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
        </div>
      </div>

      {/* ═══ HERO HEADER (SUNNY & PLAYFUL) ═══ */}
      <header
        style={{
          padding: '2.5rem 1.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 6vw, 3.4rem)',
            margin: '0 0 0.4rem',
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
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: '#475569',
            margin: '0 0 1.5rem',
            fontWeight: 600,
          }}
        >
          Touch it. Twist it. Understand it.
        </p>

        {/* Big Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            className="btn btn-accent"
            onClick={() => setViewMode('map')}
            style={{
              padding: '0.75rem 1.8rem',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
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
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 800,
            }}
          >
            🎨 3D Toy Skins
          </button>
        </div>

        {/* Grade Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GradeFilterBar />
        </div>
      </header>

      {/* ═══ GEO MASCOT ═══ */}
      <div style={{ maxWidth: '640px', margin: '0 auto 1.5rem', padding: '0 1.5rem' }}>
        <GeoCompanion message="Pick any 3D toy shape below to stretch it, or click Adventure Quests for fun missions!" />
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
              padding: '0.75rem 1.1rem',
              borderRadius: '16px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
            role="button"
            tabIndex={0}
          >
            <span style={{ fontSize: '1.4rem' }}>{shapeConfig[lastVisited].emoji}</span>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                Continue where you left off
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>
                {shapeConfig[lastVisited].name}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#4f46e5' }}>Play →</span>
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
          gap: '1.1rem',
        }}
      >
        {visibleShapes.map((shapeId) => (
          <ShapeCard key={shapeId} shapeId={shapeId} />
        ))}
      </main>

      {/* ═══ TODAY'S CHALLENGE CARD ═══ */}
      <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem', padding: '0 1.5rem' }}>
        <TodaysChallengeCard />
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          borderTop: '1.5px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
          Math in Motion — Interactive 3D Learning & Game Platform for Kids
        </p>
      </footer>
    </div>
  );
}
