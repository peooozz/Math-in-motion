/**
 * TodaysChallengeCard.jsx
 * ═══════════════════════════════════════════════════════════════
 * Random Daily Challenge for Kids (Light Theme).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useMemo } from 'react';
import { shapeConfig, SHAPES_ORDER } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';

export default function TodaysChallengeCard() {
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);

  const { shapeId, challenge, config } = useMemo(() => {
    const dayIdx = Math.floor(Date.now() / 86400000) % SHAPES_ORDER.length;
    const id = SHAPES_ORDER[dayIdx];
    const cfg = shapeConfig[id];
    const ch = cfg.challenges[Math.floor(Date.now() / 86400000) % cfg.challenges.length];
    return { shapeId: id, challenge: ch, config: cfg };
  }, []);

  return (
    <div
      style={{
        padding: '1.1rem 1.4rem',
        borderRadius: '20px',
        background: '#ffffff',
        border: `2.5px solid ${config.accentColor}40`,
        boxShadow: `0 10px 25px ${config.accentColor}15`,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onClick={() => setCurrentShape(shapeId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setCurrentShape(shapeId)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginBottom: '0.3rem',
      }}>
        <span style={{ fontSize: '1.2rem' }}>🎯</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: '0.92rem',
          color: config.accentColor,
        }}>
          Today's Fun Challenge
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '1.2rem',
        }}>
          {config.emoji}
        </span>
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.86rem',
        fontWeight: 600,
        color: '#334155',
        lineHeight: 1.4,
      }}>
        {challenge}
      </p>
      <div style={{
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        fontWeight: 800,
        color: config.accentColor,
      }}>
        Play with {config.name} →
      </div>
    </div>
  );
}
