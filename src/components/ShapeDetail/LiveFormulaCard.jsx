/**
 * LiveFormulaCard.jsx
 * ═══════════════════════════════════════════════════════════════
 * Visual Formula Discovery Card (Child-Friendly & Light).
 * Replaces dense text with large, interactive, color-coded
 * formula chips that highlight and multiply live as kids drag handles!
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useRef, useEffect, useState } from 'react';
import { shapeConfig, computeAllFormulas } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export default function LiveFormulaCard({ shapeId, dimensions }) {
  const config = shapeConfig[shapeId];
  const difficulty = useAppStore((s) => s.difficulty);
  const prevResultsRef = useRef({});
  const [flash, setFlash] = useState(false);

  if (!config) return null;

  const results = computeAllFormulas(shapeId, dimensions);
  const primaryKey = config.is2D ? 'area' : 'volume';
  const primaryFormula = config.formulas[primaryKey];
  const primaryResult = results[primaryKey] || 0;

  useEffect(() => {
    const prev = prevResultsRef.current[primaryKey];
    if (prev !== undefined && Math.abs(prev - primaryResult) > 0.05) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 250);
      return () => clearTimeout(t);
    }
    prevResultsRef.current = { ...results };
  }, [primaryResult, primaryKey, results]);

  return (
    <div
      className="glass"
      style={{ padding: '1rem 1.25rem' }}
      role="status"
      aria-live="polite"
    >
      {/* Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          {config.is2D ? '📐 2D AREA' : '📦 3D VOLUME'}
        </span>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#4f46e5',
          background: '#e0e7ff',
          padding: '0.2rem 0.5rem',
          borderRadius: '9999px',
        }}>
          Live Multiplier
        </span>
      </div>

      {/* ─── EXPLORER MODE (Grade 3–5: Counting cubes / Friendly) ─── */}
      {difficulty === 'elementary' ? (
        <div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#0f172a',
            lineHeight: 1.3,
            marginBottom: '0.4rem',
          }}>
            Holds <span style={{ color: config.accentColor, fontSize: '1.45rem' }}>{Math.round(primaryResult)}</span> toy blocks! 🧱
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {primaryFormula?.worded}
          </div>
        </div>
      ) : (
        /* ─── BUILDER & MATHEMATICIAN (Visual Interactive Formula Chips) ─── */
        <div>
          {/* Visual Formula Chips Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginBottom: '0.6rem',
          }}>
            {config.dimensions.map((dim, idx) => (
              <React.Fragment key={dim.key}>
                {idx > 0 && <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#94a3b8' }}>×</span>}
                <div
                  className="formula-chip"
                  style={{
                    background: `${dim.color}15`,
                    border: `2px solid ${dim.color}40`,
                    color: dim.color,
                  }}
                >
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{dim.label}:</span>
                  <span>{round(dimensions[dim.key])}</span>
                </div>
              </React.Fragment>
            ))}

            {config.id === 'cone' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', background: '#fef3c7', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                × ⅓
              </span>
            )}
            {config.id === 'pyramid' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ea580c', background: '#ffedd5', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                × ⅓
              </span>
            )}
            {config.id === 'triangle' && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0d9488', background: '#ccfbf1', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                × ½
              </span>
            )}
          </div>

          {/* Big Result Display */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.4rem',
            marginTop: '0.2rem',
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64748b' }}>=</span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '2rem',
                color: config.accentColor,
                transform: flash ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
            >
              {round(primaryResult, 1)}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>
              {primaryFormula?.unit}
            </span>
          </div>

          {/* Worded formula subtitle */}
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.3rem' }}>
            {primaryFormula?.worded}
          </div>
        </div>
      )}
    </div>
  );
}
