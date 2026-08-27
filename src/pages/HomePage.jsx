/**
 * HomePage.jsx
 * ═══════════════════════════════════════════════════════════════
 * The Shape Gallery — colorful grid of shape cards with 3D previews,
 * grade filter, and today's challenge.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { shapeConfig, SHAPES_ORDER, filterShapesByGrade } from '../data/shapeConfig';
import ShapeCard from '../components/Home/ShapeCard';
import GradeFilterBar from '../components/Home/GradeFilterBar';
import TodaysChallengeCard from '../components/Home/TodaysChallengeCard';

export default function HomePage() {
  const gradeFilter = useAppStore((s) => s.gradeFilter);
  const visited = useAppStore((s) => s.progress.visited);
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);

  const visibleShapes = useMemo(
    () => filterShapesByGrade(gradeFilter),
    [gradeFilter]
  );

  // Last visited shape
  const lastVisited = visited.length > 0 ? visited[visited.length - 1] : null;

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* ═══ HERO HEADER ═══ */}
      <header style={{
        padding: '2.5rem 1.5rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.1) 0%, transparent 60%)',
      }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          margin: '0 0 0.4rem',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Math in Motion 🎲
        </h1>
        <p style={{
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          color: 'var(--color-text-secondary)',
          margin: '0 0 1.5rem',
          fontWeight: 500,
        }}>
          Touch it. Twist it. Understand it.
        </p>

        {/* Grade filter */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GradeFilterBar />
        </div>
      </header>

      {/* ═══ CONTINUE WHERE YOU LEFT OFF ═══ */}
      {lastVisited && shapeConfig[lastVisited] && (
        <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
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
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}>
                Continue where you left off
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {shapeConfig[lastVisited].name}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>→</span>
          </div>
        </div>
      )}

      {/* ═══ SHAPE CARDS GRID ═══ */}
      <main style={{
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {visibleShapes.map((shapeId) => (
          <ShapeCard key={shapeId} shapeId={shapeId} />
        ))}
      </main>

      {/* ═══ TODAY'S CHALLENGE ═══ */}
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <TodaysChallengeCard />
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: '1rem 1.5rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          margin: 0,
        }}>
          Math in Motion — Interactive 3D Learning · CBSE Curriculum Aligned
        </p>
      </footer>
    </div>
  );
}
