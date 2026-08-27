/**
 * LiveDimensionsCard.jsx
 * ═══════════════════════════════════════════════════════════════
 * Clean, bright, child-friendly dimensions card.
 * Shows color-coded dimension badges with big readable numbers.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import { shapeConfig, computeDerived } from '../../data/shapeConfig';

const round = (v) => Math.round(v * 10) / 10;

export default function LiveDimensionsCard({ shapeId, dimensions }) {
  const config = shapeConfig[shapeId];
  if (!config) return null;

  const derived = computeDerived(shapeId, dimensions);

  return (
    <div className="glass" style={{ padding: '0.9rem 1.1rem' }}>
      <div style={{
        fontSize: '0.78rem',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#64748b',
        marginBottom: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}>
        <span>📐 Dimensions</span>
      </div>

      {/* Grid of Dimension Chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '0.5rem',
      }}>
        {config.dimensions.map((dim) => (
          <div
            key={dim.key}
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: '14px',
              background: `${dim.color}10`,
              border: `2px solid ${dim.color}30`,
              textAlign: 'center',
            }}
          >
            <div style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: dim.color,
              marginBottom: '0.1rem',
            }}>
              {dim.label} ({dim.symbol})
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '1.4rem',
                color: dim.color,
                lineHeight: 1.1,
              }}
            >
              {round(dimensions[dim.key])}
              <span style={{ fontSize: '0.65em', fontWeight: 600, opacity: 0.7, marginLeft: '2px' }}>
                cm
              </span>
            </div>
          </div>
        ))}

        {/* Derived values if any */}
        {Object.entries(config.derived || {}).map(([key, d]) => (
          <div
            key={key}
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: '14px',
              background: '#f1f5f9',
              border: '2px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '0.1rem' }}>
              {d.label} ({d.symbol})
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#334155',
                lineHeight: 1.1,
              }}
            >
              {round(derived[key])}
              <span style={{ fontSize: '0.65em', fontWeight: 600, opacity: 0.7, marginLeft: '2px' }}>
                cm
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
