/**
 * GeoCompanion.jsx
 * ═══════════════════════════════════════════════════════════════
 * Geo the Math Robot — Interactive animated mascot guide.
 * Gives tips, encourages students, explains "Aha!" moments, and reacts
 * with joyful chirps and animations when students make discoveries.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import sound from '../../utils/soundEffects';

export default function GeoCompanion({
  message = "Hi! I'm Geo! Drag the handles to build and learn!",
  emotion = 'happy', // 'happy' | 'thinking' | 'cheering' | 'talking'
  onHintClick,
}) {
  const [minimized, setMinimized] = useState(false);
  const [bubbleText, setBubbleText] = useState(message);

  useEffect(() => {
    setBubbleText(message);
    if (!minimized) {
      sound.playRobotChirp();
    }
  }, [message]);

  const handleGeoClick = () => {
    sound.playRobotChirp();
    if (onHintClick) onHintClick();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.6rem',
      padding: '0.6rem 0.8rem',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
      border: '1px solid rgba(129, 140, 248, 0.25)',
      position: 'relative',
    }}>
      {/* Robot SVG Avatar */}
      <div
        onClick={handleGeoClick}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(129, 140, 248, 0.4)',
          transform: emotion === 'cheering' ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        title="Click Geo for a hint!"
      >
        <span style={{ fontSize: '1.4rem' }}>
          {emotion === 'thinking' ? '🤖' : emotion === 'cheering' ? '🥳' : '🤖'}
        </span>
      </div>

      {/* Speech Bubble */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.15rem',
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#818cf8',
            letterSpacing: '0.04em',
          }}>
            GEO THE MATH BOT
          </span>
          <button
            onClick={() => setMinimized(!minimized)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.65rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {minimized ? 'Expand' : 'Hide'}
          </button>
        </div>

        {!minimized && (
          <p style={{
            margin: 0,
            fontSize: '0.78rem',
            lineHeight: 1.35,
            color: 'var(--color-text-primary)',
          }}>
            {bubbleText}
          </p>
        )}
      </div>
    </div>
  );
}
