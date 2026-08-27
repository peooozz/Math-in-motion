/**
 * TodaysChallengeCard.jsx
 * A random daily challenge from any shape to entice exploration.
 */
import React, { useMemo } from 'react';
import { shapeConfig, SHAPES_ORDER } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';

export default function TodaysChallengeCard() {
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);

  // Pick a random shape + challenge (seeded by day for consistency)
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
        padding: '1rem 1.25rem',
        borderRadius: '16px',
        background: `linear-gradient(135deg, ${config.accentColor}12, ${config.accentColor}06)`,
        border: `1px solid ${config.accentColor}25`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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
        marginBottom: '0.4rem',
      }}>
        <span style={{ fontSize: '1.1rem' }}>🎯</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '0.85rem',
          color: config.accentColor,
        }}>
          Today's Challenge
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '1rem',
        }}>
          {config.emoji}
        </span>
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5,
      }}>
        {challenge}
      </p>
      <div style={{
        marginTop: '0.6rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: config.accentColor,
      }}>
        Try it with {config.name} →
      </div>
    </div>
  );
}
