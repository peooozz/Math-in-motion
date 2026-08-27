/**
 * LiveFormulaCard.jsx
 * ═══════════════════════════════════════════════════════════════
 * THE EMOTIONAL CORE of Math in Motion.
 *
 * Shows the formula with live number substitution, updating
 * instantly as the student drags dimension handles.
 *
 * Three difficulty tiers:
 *  - Explorer (Grade 3–5): Friendly text, no algebra
 *  - Builder (Grade 6–8):  Formula + substitution + result
 *  - Mathematician (9–10): Formula + substitution + derivation
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
  const [flashKeys, setFlashKeys] = useState({});

  if (!config) return null;

  const results = computeAllFormulas(shapeId, dimensions);

  // Flash animation when values change
  useEffect(() => {
    const newFlash = {};
    Object.keys(results).forEach((key) => {
      const prev = prevResultsRef.current[key];
      if (prev !== undefined && Math.abs(prev - results[key]) > 0.01) {
        newFlash[key] = true;
      }
    });
    prevResultsRef.current = { ...results };

    if (Object.keys(newFlash).length > 0) {
      setFlashKeys(newFlash);
      const timer = setTimeout(() => setFlashKeys({}), 300);
      return () => clearTimeout(timer);
    }
  }, [results]);

  return (
    <div
      className="glass"
      style={{ padding: '0.85rem 1rem' }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {Object.entries(config.formulas).map(([key, formula]) => {
        const result = results[key];
        const isFlashing = flashKeys[key];

        return (
          <div key={key} style={{ marginBottom: '0.75rem' }}>
            {/* Label */}
            <div className="hud-label" style={{ marginBottom: '0.35rem' }}>
              {formula.label === 'Volume' ? '📦' : formula.label === 'Area' ? '📐' : '🔲'}{' '}
              {formula.label}
            </div>

            {/* ─── EXPLORER MODE ──────────────────────────── */}
            {difficulty === 'elementary' && (
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: config.accentColor,
                  lineHeight: 1.4,
                }}
              >
                {formula.explorer(result)}
              </div>
            )}

            {/* ─── BUILDER MODE ───────────────────────────── */}
            {difficulty === 'standard' && (
              <div className="formula-card">
                {/* Worded formula */}
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.15rem' }}>
                  {formula.worded}
                </div>
                {/* Substituted formula */}
                <div style={{ fontSize: '1.2rem' }}>
                  {formula.label} = {formula.substitute(dimensions)}
                </div>
                {/* Result */}
                <div
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: config.accentColor,
                    transition: 'transform 0.15s ease',
                    transform: isFlashing ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  = {round(result, 1)} {formula.unit}
                </div>
              </div>
            )}

            {/* ─── MATHEMATICIAN MODE ────────────────────── */}
            {difficulty === 'advanced' && (
              <div>
                {/* Symbolic formula */}
                <div className="formula-symbolic" style={{ marginBottom: '0.2rem' }}>
                  {formula.symbolic}
                </div>
                {/* Substituted */}
                <div className="formula-card" style={{ marginBottom: '0.15rem' }}>
                  {formula.label} = {formula.substitute(dimensions)}
                </div>
                {/* Result */}
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: config.accentColor,
                    transition: 'transform 0.15s ease',
                    transform: isFlashing ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  = {round(result, 2)} {formula.unit}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Aria-hidden summary for screen readers */}
      <div className="sr-only" aria-live="polite">
        {Object.entries(config.formulas).map(([key, formula]) => (
          <span key={key}>
            {formula.label}: {round(results[key], 2)} {formula.unit}.{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
