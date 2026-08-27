/**
 * RealWorldMatchGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * "Real-World Object Sorter" — Interactive Drag-and-Drop Matching.
 * Connects abstract 3D math concepts to tangible real-world objects
 * (dice, soup cans, planets, party hats, tents, pyramids).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const REAL_WORLD_ITEMS = [
  { id: 'dice', name: 'Board Game Dice', emoji: '🎲', shapeId: 'cube', funFact: 'Dice are cubes with 6 faces numbered 1 to 6!' },
  { id: 'soda', name: 'Soda Can', emoji: '🥫', shapeId: 'cylinder', funFact: 'Cylinders resist internal gas pressure evenly in all directions!' },
  { id: 'globe', name: 'Planet Earth Globe', emoji: '🌍', shapeId: 'sphere', funFact: 'Planets are spheres because gravity pulls equally from the center!' },
  { id: 'hat', name: 'Party Cone Hat', emoji: '🎉', shapeId: 'cone', funFact: 'A party hat is a hollow cone with no bottom circular face!' },
  { id: 'pyramid', name: 'Great Pyramid of Giza', emoji: '🔺', shapeId: 'pyramid', funFact: 'The Great Pyramid had an original volume of ~2.6 million m³!' },
  { id: 'box', name: 'Shoebox / Book', emoji: '📦', shapeId: 'cuboid', funFact: 'Books and boxes are cuboids so they stack without wasted space!' },
  { id: 'choc', name: 'Toblerone Bar', emoji: '🍫', shapeId: 'prism', funFact: 'Triangular prisms can pack tightly while giving unique breakable pieces!' },
  { id: 'pizza', name: 'Pizza Slice Frame', emoji: '🍕', shapeId: 'triangle', funFact: 'Triangles are the strongest 2D structural shape — they cannot deform!' },
];

export default function RealWorldMatchGame({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const [matchedItems, setMatchedItems] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const currentItem = REAL_WORLD_ITEMS[currentIdx % REAL_WORLD_ITEMS.length];

  const handleMatchAttempt = (isTargetShape) => {
    if (feedback) return;

    const correct = (currentItem.shapeId === shapeId) === isTargetShape;

    if (correct) {
      sound.playSuccess();
      sound.playCoin();
      addXp(30);
      addGems(4);
      setMatchedItems((m) => [...m, currentItem.id]);
      setFeedback({
        correct: true,
        text: `🎯 Correct! ${currentItem.funFact}`,
      });
    } else {
      sound.playError();
      addXp(5);
      setFeedback({
        correct: false,
        text: `💡 Not quite! A ${currentItem.name} is actually a ${currentItem.shapeId.toUpperCase()}!`,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx((i) => (i + 1) % REAL_WORLD_ITEMS.length);
    }, 2200);
  };

  return (
    <div style={{ padding: '0.2rem 0' }}>
      <div style={{
        fontSize: '0.82rem',
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: '0.5rem',
        color: '#f1f0f5',
      }}>
        🌍 <span style={{ color: '#fbbf24' }}>Object Classification:</span> Is this real-world object a <strong>{shapeId.toUpperCase()}</strong>?
      </div>

      {/* Target item showcase card */}
      <div style={{
        padding: '0.9rem',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        marginBottom: '0.75rem',
      }}>
        <div style={{ fontSize: '2.4rem', marginBottom: '0.2rem' }}>
          {currentItem.emoji}
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'var(--color-text-primary)',
        }}>
          {currentItem.name}
        </div>

        {/* Binary classification buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          marginTop: '0.8rem',
        }}>
          <button
            className="btn btn-sm btn-accent"
            onClick={() => handleMatchAttempt(true)}
            disabled={feedback !== null}
            style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}
          >
            ✅ YES, it's a {shapeId}
          </button>
          <button
            className="btn btn-sm"
            onClick={() => handleMatchAttempt(false)}
            disabled={feedback !== null}
            style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}
          >
            ❌ NO, different shape
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div style={{
          padding: '0.6rem 0.8rem',
          borderRadius: '8px',
          background: feedback.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.correct ? '#10b98144' : '#ef444444'}`,
          fontSize: '0.78rem',
          color: feedback.correct ? '#34d399' : '#f87171',
          fontWeight: 600,
          animation: 'page-in 0.2s ease',
        }}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
