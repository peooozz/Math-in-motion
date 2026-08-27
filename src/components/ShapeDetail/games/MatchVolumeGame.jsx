/**
 * MatchVolumeGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * "Match the Volume" Arcade Game.
 * Features: Target volume, live difference gauge, combo streaks,
 * timed rush option, sound synthesis, confetti, XP & Gem rewards.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const tolerance = Math.max(0.6, target * 0.05); // 5% tolerance or 0.6
  const isClose = Math.abs(currentValue - target) <= tolerance;
  const diff = round(currentValue - target, 1);

  // ─── Timer countdown ───────────────────────────────────────
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

  // ─── Match Detection ───────────────────────────────────────
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
      {/* Confetti & Streak Celebration Banner */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          background: 'rgba(15, 13, 26, 0.75)',
          borderRadius: '12px',
          backdropFilter: 'blur(4px)',
          animation: 'badge-pop 0.4s ease forwards',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>🎉 ⭐ 🎉</div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#10b981',
          }}>
            MATCHED! +{30 + streak * 10} XP
          </div>
          {streak > 1 && (
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fbbf24',
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
            Next Challenge →
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
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: streak > 0 ? '#fbbf24' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}>
            🔥 Streak: {streak}
          </span>
          {timedMode && (
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: timeLeft <= 5 ? '#ef4444' : '#06b6d4',
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
          style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
        >
          {timedMode ? '⏱️ Timed Mode [ON]' : '⏱️ Try Timed'}
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
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            🎯 Target {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#fbbf24',
          }}>
            {target} {unit}
          </div>
        </div>

        {/* Current value */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Your {label}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            color: matched ? '#10b981' : config.accentColor,
            transition: 'color 0.2s ease',
          }}>
            {currentValue} {unit}
          </div>
        </div>

        {/* Status indicator & new target button */}
        <div style={{ textAlign: 'right' }}>
          {matched ? (
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
              ✅ Perfect Match!
            </div>
          ) : (
            <div style={{
              color: diff > 0 ? '#f97316' : '#3b82f6',
              fontWeight: 600,
              fontSize: '0.78rem',
            }}>
              {diff > 0 ? `${diff} too high ↓` : `${Math.abs(diff)} too low ↑`}
            </div>
          )}
          <button
            className="btn btn-sm"
            onClick={handleNewTarget}
            style={{ marginTop: '0.3rem', fontSize: '0.72rem' }}
          >
            🎲 New Target
          </button>
        </div>
      </div>

      {/* Live target proximity gauge */}
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
          transition: 'width 0.1s ease',
        }} />
      </div>
    </div>
  );
}
