/**
 * MagicPourLab.jsx
 * ═══════════════════════════════════════════════════════════════
 * Interactive 3D Magic Pour Lab.
 * Shows visually WHY a Cone is ⅓ of a Cylinder, and a Pyramid is ⅓ of a Prism.
 * Kids tap "Pour" to scoop liquid 3 times, watching the container fill
 * exactly 33% → 66% → 100%!
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

export default function MagicPourLab({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const [pours, setPours] = useState(0); // 0, 1, 2, 3
  const [isPouring, setIsPouring] = useState(false);

  const isCone = shapeId === 'cone' || shapeId === 'cylinder';
  const smallShape = isCone ? 'Cone 🍦' : 'Pyramid 🔺';
  const bigShape = isCone ? 'Cylinder 🥫' : 'Prism 🔷';

  const fillPercentage = Math.min(100, Math.round((pours / 3) * 100));

  const handlePour = () => {
    if (isPouring || pours >= 3) return;

    setIsPouring(true);
    sound.playPour();

    setTimeout(() => {
      const nextPours = pours + 1;
      setPours(nextPours);
      setIsPouring(false);

      if (nextPours === 3) {
        sound.playFanfare();
        sound.playCoin();
        addXp(80);
        addGems(10);
      } else {
        sound.playSuccess();
        addXp(20);
      }
    }, 600);
  };

  const handleReset = () => {
    sound.playSnap();
    setPours(0);
  };

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {/* Title */}
      <div style={{
        fontSize: '0.86rem',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#0f172a',
        marginBottom: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>🧪 The Magic ⅓ Pour Experiment!</span>
        <span style={{
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#4f46e5',
          background: '#e0e7ff',
          padding: '0.2rem 0.5rem',
          borderRadius: '9999px',
        }}>
          3 Scoops = 1 Container
        </span>
      </div>

      {/* Visual Simulation Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '1rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #f0fdf4, #f8fafc)',
        border: '2px dashed #cbd5e1',
        marginBottom: '0.75rem',
      }}>
        {/* Source small shape */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2.4rem',
            transform: isPouring ? 'rotate(-30deg) translateY(-5px)' : 'rotate(0)',
            transition: 'transform 0.3s ease',
          }}>
            {isCone ? '🍦' : '🔺'}
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a', marginTop: '0.2rem' }}>
            1 {smallShape}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Holds ⅓ liquid
          </div>
        </div>

        {/* Arrow / Pour stream */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.4rem',
            color: isPouring ? '#0284c7' : '#94a3b8',
            transform: isPouring ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.2s ease',
          }}>
            {isPouring ? '🌊 ➔' : '➔'}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5' }}>
            Pour #{pours + 1}
          </div>
        </div>

        {/* Target container with liquid level */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '75px',
            borderRadius: isCone ? '8px' : '6px',
            border: '3px solid #64748b',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
          }}>
            {/* Animated liquid */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${fillPercentage}%`,
              background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
              transition: 'height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 0 8px rgba(2, 132, 199, 0.4)',
            }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a', marginTop: '0.3rem' }}>
            {bigShape}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: fillPercentage === 100 ? '#10b981' : '#0284c7' }}>
            {fillPercentage}% Full
          </div>
        </div>
      </div>

      {/* Discovery Reveal */}
      {pours === 3 ? (
        <div style={{
          padding: '0.75rem',
          borderRadius: '14px',
          background: '#dcfce7',
          border: '2px solid #86efac',
          textAlign: 'center',
          animation: 'badge-pop 0.4s ease forwards',
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🎉 🌟 🎉</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#166534' }}>
            AHA! FORMULA DISCOVERED!
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#15803d', marginTop: '0.2rem' }}>
            {smallShape} Volume = ⅓ × {bigShape} Volume!
          </div>
          <button
            className="btn btn-sm"
            onClick={handleReset}
            style={{ marginTop: '0.5rem', background: '#ffffff' }}
          >
            🔄 Try Again
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-sm btn-accent"
            onClick={handlePour}
            disabled={isPouring}
            style={{ padding: '0.45rem 1.4rem', fontSize: '0.85rem' }}
          >
            🫗 Pour Scoop ({pours}/3)
          </button>
          {pours > 0 && (
            <button className="btn btn-sm" onClick={handleReset}>
              Empty 🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
}
