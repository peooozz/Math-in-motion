/**
 * ChallengePrompt.jsx
 * ═══════════════════════════════════════════════════════════════
 * Collapsible "Try this!" micro-challenge card (Light Theme).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';

export default function ChallengePrompt({ text }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      padding: '0.8rem 1rem',
      borderRadius: '16px',
      background: '#fffbeb',
      border: '2px solid #fde68a',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)',
      cursor: 'pointer',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <span style={{ fontSize: '1.1rem' }}>🎯</span>
        <strong style={{ fontSize: '0.84rem', color: '#92400e', fontWeight: 800 }}>Try this!</strong>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.72rem',
            color: '#b45309',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </div>
      {expanded && (
        <p
          style={{
            margin: '0.4rem 0 0',
            fontSize: '0.82rem',
            color: '#78350f',
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
