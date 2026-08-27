/**
 * MatchVolumeGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * "Match the Volume" Arcade Game (Light Theme & Child-Friendly).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect, useCallback } from 'react';
import { shapeConfig } from '../../../data/shapeConfig';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

function generateTarget(shapeId) {
  const config = shapeConfig[shapeId];
  if (!config) return 10;

  const dims = {};
  config.dimensions.forEach((dim) => {
    const range = dim.max - dim.min;
    const nice = dim.min + Math.floor(Math.random() * (range / dim.step)) * dim.step;
    dims[dim.key] = Math.max(dim.min, Math.min(dim.max, nice));
  });

  const primaryKey = config.is2D ? 'area' : 'volume';
  const formula = config.formulas[primaryKey];
  if (!formula) return 10;

  return Math.max(2, round(formula.compute(dims), 0));
}

export default function MatchVolumeGame({ shapeId, dimensions, formulaKey = 'volume' }) {
  const config = shapeConfig[shapeId];
  const earnBadge = useAppStore((s) => s.earnBadge);
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);
  const setShapeProgress = useAppStore((s) => s.setShapeProgress);
  const currentProgress = useAppStore((s) => s.progress.shapeProgress[shapeId] || 0);

  const [target, setTarget] = useState(() => generateTarget(shapeId));
  const [matched, setMatched] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const formula = config?.formulas?.[formulaKey];
  if (!formula) return null;

  const currentValue = round(formula.compute(dimensions), 1);
  const tolerance = Math.max(0.6, target * 0.05);
  const isClose = Math.abs(currentValue - target) <= tolerance;
  const diff = round(currentValue - target, 1);

  useEffect(() => {
    if (!timedMode || matched || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          sound.playError();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timedMode, matched, timeLeft]);

  useEffect(() => {
    if (isClose && !matched) {
      setMatched(true);
      setShowConfetti(true);
      sound.playSuccess();
      sound.playCoin();

      const nextStreak = streak + 1;
      setStreak(nextStreak);

      const xpBonus = 30 + nextStreak * 10;
      const gemBonus = nextStreak >= 3 ? 10 : 4;
      addXp(xpBonus);
      addGems(gemBonus);

      earnBadge(`master-${shapeId}`);
      setShapeProgress(shapeId, Math.min(100, currentProgress + 20));

      setTimeout(() => setShowConfetti(false), 2200);
    }
  }, [isClose, matched]);

  const handleNewTarget = useCallback(() => {
    sound.playPop();
    setTarget(generateTarget(shapeId));
    setMatched(false);
    setShowConfetti(false);
    setTimeLeft(30);
  }, [shapeId]);

  const label = config.is2D ? 'Area' : 'Volume';
  const unit = formula.unit;

  return (
    <div style={{ position: 'relative' }}>
      {/* Celebration Banner */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          border: '2px solid #86efac',
          backdropFilter: 'blur(4px)',
          animation: 'badge-pop 0.4s ease forwards',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>🎉 ⭐ 🎉</div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '1.3rem',
            color: '#15803d',
          }}>
            MATCHED! +{30 + streak * 10} XP
          </div>
          {streak > 1 && (
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#d97706',
              marginTop: '0.2rem',
            }}>
              🔥 {streak}x STREAK BONUS! +{streak >= 3 ? 10 : 4} 💎
            </div>
          )}
          <button
            className="btn btn-sm btn-accent"
            onClick={handleNewTarget}
            style={{ marginTop: '0.6rem' }}
          >
            Next Target →
          </button>
        </div>
      )}

      {/* Header controls & stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
        paddingBottom: '0.4rem',
        borderBottom: '1.5px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            color: streak > 0 ? '#d97706' : '#64748b',
          }}>
            🔥 Streak: {streak}
          </span>
          {timedMode && (
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: timeLeft <= 5 ? '#ef4444' : '#0284c7',
            }}>
              ⏳ {timeLeft}s
            </span>
          )}
        </div>

        <button
          className={`btn btn-sm ${timedMode ? 'btn-accent' : ''}`}
          onClick={() => {
            sound.playPop();
            setTimedMode(!timedMode);
            setTimeLeft(30);
          }}
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
        >
          {timedMode ? '⏱️ Timed [ON]' : '⏱️ Timed Mode'}
        </button>
      </div>

      {/* Target vs Current Readout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        {/* Target */}
        <div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            🎯 Target {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '1.5rem',
            color: '#d97706',
          }}>
            {target} <span style={{ fontSize: '0.7em', color: '#94a3b8' }}>{unit}</span>
          </div>
        </div>

        {/* Current value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Your {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '1.5rem',
            color: matched ? '#059669' : config.accentColor,
            transition: 'color 0.2s ease',
          }}>
            {currentValue} <span style={{ fontSize: '0.7em', color: '#94a3b8' }}>{unit}</span>
          </div>
        </div>

        {/* Status */}
        <div style={{ textAlign: 'right' }}>
          {matched ? (
            <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem' }}>
              ✅ Matched!
            </div>
          ) : (
            <div style={{
              color: diff > 0 ? '#ea580c' : '#0284c7',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}>
              {diff > 0 ? `${diff} too big ↓` : `${Math.abs(diff)} too small ↑`}
            </div>
          )}
          <button
            className="btn btn-sm"
            onClick={handleNewTarget}
            style={{ marginTop: '0.3rem', fontSize: '0.74rem' }}
          >
            🎲 New Target
          </button>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div style={{
        marginTop: '0.6rem',
        height: '7px',
        borderRadius: '4px',
        background: '#e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '4px',
          width: `${Math.min(100, (currentValue / target) * 100)}%`,
          background: matched
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : `linear-gradient(90deg, ${config.accentColor}, #818cf8)`,
          transition: 'width 0.1s ease',
        }} />
      </div>
    </div>
  );
}
