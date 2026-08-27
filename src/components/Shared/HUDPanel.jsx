/**
 * HUDPanel.jsx
 * Glassmorphic overlay panel for live numeric readouts.
 * Uses aria-live for screen readers. Positioned right on desktop, bottom on mobile.
 */
import React from 'react';

export default function HUDPanel({ children, className = '' }) {
  return (
    <div
      className={`glass pointer-events-auto ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: '1rem 1.25rem',
        minWidth: 220,
        maxWidth: 340,
      }}
    >
      {children}
    </div>
  );
}

/**
 * A single labeled numeric readout row.
 */
export function HUDReadout({ label, value, unit = '', color }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div className="hud-label">{label}</div>
      <div className="hud-value" style={color ? { color } : undefined}>
        {value}
        {unit && (
          <span
            style={{
              fontSize: '0.85em',
              fontWeight: 500,
              opacity: 0.7,
              marginLeft: '0.2em',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Formula display — revealed via "Show Formula" toggle.
 */
export function HUDFormula({ formula, visible }) {
  if (!visible) return null;
  return (
    <div
      className="hud-formula"
      style={{
        marginTop: '0.75rem',
        padding: '0.6rem 0.8rem',
        borderRadius: 8,
        background: 'rgba(129, 140, 248, 0.08)',
        border: '1px solid rgba(129, 140, 248, 0.15)',
        transition: 'opacity 0.3s ease',
      }}
    >
      {formula}
    </div>
  );
}
