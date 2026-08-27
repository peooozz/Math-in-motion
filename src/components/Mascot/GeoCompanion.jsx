/**
 * GeoCompanion.jsx
 * ═══════════════════════════════════════════════════════════════
 * Geo the Robot Tutor (Child-Friendly & Light).
 * Delivers punchy 1-sentence tips and reacts with playful sound chirps!
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useEffect } from 'react';
import sound from '../../utils/soundEffects';

export default function GeoCompanion({
  message = "Hi! I'm Geo! Drag the colored dots to stretch the shape!",
  onHintClick,
}) {
  useEffect(() => {
    sound.playRobotChirp();
  }, [message]);

  const handleGeoClick = () => {
    sound.playRobotChirp();
    if (onHintClick) onHintClick();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      padding: '0.6rem 0.9rem',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #eef2ff, #fdf2f8)',
      border: '2px solid #c7d2fe',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.08)',
    }}>
      {/* Robot Mascot Avatar */}
      <div
        onClick={handleGeoClick}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
          transition: 'transform 0.2s ease',
        }}
        title="Tap Geo for a chirp!"
      >
        <span style={{ fontSize: '1.3rem' }}>🤖</span>
      </div>

      {/* 1-Line Cheerful Message */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          fontWeight: 600,
          lineHeight: 1.35,
          color: '#1e1b4b',
        }}>
          {message}
        </p>
      </div>
    </div>
  );
}
