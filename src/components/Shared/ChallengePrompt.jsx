/**
 * ChallengePrompt.jsx
 * Collapsible "Try this!" micro-challenge card.
 */
import React, { useState } from 'react';

export default function ChallengePrompt({ text }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="challenge-card" style={{ cursor: 'pointer' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
      >
        <span className="icon">🎯</span>
        <strong style={{ fontSize: '0.8rem' }}>Try this!</strong>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.7rem',
            opacity: 0.6,
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
            margin: '0.5rem 0 0',
            fontSize: '0.82rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
