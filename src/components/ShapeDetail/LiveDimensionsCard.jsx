/**
 * LiveDimensionsCard.jsx
 * Shows the current dimension values in a clean, bold card.
 * Auto-generates rows from the shape config's dimensions array.
 */
import React from 'react';
import { shapeConfig, computeDerived } from '../../data/shapeConfig';

const round = (v) => Math.round(v * 10) / 10;

export default function LiveDimensionsCard({ shapeId, dimensions }) {
  const config = shapeConfig[shapeId];
  if (!config) return null;

  const derived = computeDerived(shapeId, dimensions);

  return (
    <div className="glass" style={{ padding: '0.85rem 1rem' }}>
      <div className="hud-label" style={{ marginBottom: '0.6rem' }}>
        📐 Dimensions
      </div>

      {/* Draggable dimensions */}
      {config.dimensions.map((dim) => (
        <div
          key={dim.key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.4rem',
          }}
        >
          <span style={{ color: dim.color, fontWeight: 600, fontSize: '0.85rem' }}>
            {dim.label} ({dim.symbol})
          </span>
          <span
            className="hud-value"
            style={{ fontSize: '1.3rem', color: dim.color }}
            aria-label={`${dim.label}: ${round(dimensions[dim.key])} centimeters`}
          >
            {round(dimensions[dim.key])} <span style={{ fontSize: '0.7em', opacity: 0.6 }}>cm</span>
          </span>
        </div>
      ))}

      {/* Derived dimensions (non-draggable) */}
      {Object.entries(config.derived || {}).map(([key, d]) => (
        <div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.4rem',
            opacity: 0.75,
          }}
        >
          <span style={{ fontWeight: 500, fontSize: '0.82rem', color: d.color || 'var(--color-text-secondary)' }}>
            {d.label} ({d.symbol})
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1rem' }}>
            {round(derived[key])} <span style={{ fontSize: '0.7em', opacity: 0.6 }}>cm</span>
          </span>
        </div>
      ))}
    </div>
  );
}
