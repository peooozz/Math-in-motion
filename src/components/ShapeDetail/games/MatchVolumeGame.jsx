/**
 * MatchVolumeGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * "Match the Volume" mini-game.
 * Given a target value, the student drags dimension handles to hit it.
 * Confetti + badge on success (within tolerance).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { shapeConfig, computeAllFormulas } from '../../../data/shapeConfig';
import useAppStore from '../../../store/useAppStore';

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

// Generate a "nice" target volume for the shape
function generateTarget(shapeId) {
  const config = shapeConfig[shapeId];
  if (!config) return 10;

  // Create random "nice" dimensions and compute the target
  const dims = {};
  config.dimensions.forEach((dim) => {
    const range = dim.max - dim.min;
    const nice = dim.min + Math.floor(Math.random() * (range / dim.step)) * dim.step;
    dims[dim.key] = Math.max(dim.min, Math.min(dim.max, nice));
  });

  const primaryKey = config.is2D ? 'area' : 'volume';
  const formula = config.formulas[primaryKey];
  if (!formula) return 10;

  return round(formula.compute(dims), 0);
}

export default function MatchVolumeGame({ shapeId, dimensions, formulaKey = 'volume' }) {
  const config = shapeConfig[shapeId];
  const earnBadge = useAppStore((s) => s.earnBadge);
  const setShapeProgress = useAppStore((s) => s.setShapeProgress);
  const currentProgress = useAppStore((s) => s.progress.shapeProgress[shapeId] || 0);

  const [target, setTarget] = useState(() => generateTarget(shapeId));
  const [matched, setMatched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const formula = config?.formulas?.[formulaKey];
  if (!formula) return null;

  const currentValue = round(formula.compute(dimensions), 1);
  const tolerance = Math.max(0.5, target * 0.05); // 5% tolerance or 0.5
  const isClose = Math.abs(currentValue - target) <= tolerance;
  const diff = round(currentValue - target, 1);

  // Check for match
  useEffect(() => {
    if (isClose && !matched) {
      setMatched(true);
      setShowConfetti(true);
      earnBadge(`match-${shapeId}-${formulaKey}`);
      setShapeProgress(shapeId, Math.min(100, currentProgress + 25));
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [isClose, matched]);

  const handleNewTarget = useCallback(() => {
    setTarget(generateTarget(shapeId));
    setMatched(false);
    setShowConfetti(false);
  }, [shapeId]);

  const label = config.is2D ? 'Area' : 'Volume';
  const unit = formula.unit;

  return (
    <div style={{ position: 'relative' }}>
      {/* Confetti overlay */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div className="badge-pop" style={{
            fontSize: '2rem',
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            🎉
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {/* Target */}
        <div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.15rem',
          }}>
            Target {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.5rem',
            color: '#fbbf24',
          }}>
            {target} {unit}
          </div>
        </div>

        {/* Current value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.15rem',
          }}>
            Your {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.5rem',
            color: matched ? '#10b981' : config.accentColor,
            transition: 'color 0.3s ease',
          }}>
            {currentValue} {unit}
          </div>
        </div>

        {/* Difference / status */}
        <div style={{ textAlign: 'right' }}>
          {matched ? (
            <div style={{
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}>
              ✅ Matched!
            </div>
          ) : (
            <div style={{
              color: diff > 0 ? '#f97316' : '#3b82f6',
              fontWeight: 600,
              fontSize: '0.82rem',
            }}>
              {diff > 0 ? `${diff} too high ↓` : `${Math.abs(diff)} too low ↑`}
            </div>
          )}
          <button
            className="btn btn-sm"
            onClick={handleNewTarget}
            style={{ marginTop: '0.3rem' }}
          >
            🎲 New Target
          </button>
        </div>
      </div>

      {/* Progress bar toward target */}
      <div style={{
        marginTop: '0.6rem',
        height: '6px',
        borderRadius: '3px',
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '3px',
          width: `${Math.min(100, (currentValue / target) * 100)}%`,
          background: matched
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : `linear-gradient(90deg, ${config.accentColor}, ${config.accentColor}88)`,
          transition: 'width 0.15s ease, background 0.3s ease',
        }} />
      </div>
    </div>
  );
}
