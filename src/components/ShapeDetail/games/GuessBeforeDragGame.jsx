/**
 * GuessBeforeDragGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * "Guess Before You Drag" — Interactive Math Prediction Arena.
 * Students formulate mathematical hypotheses (e.g. scaling laws,
 * doubling dimensions, surface-area-to-volume effects), pick a guess,
 * test live in 3D, and receive visual proofs and rewards.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const PREDICTIONS = {
  cube: [
    {
      question: 'If you double the side length of a cube from 2 cm to 4 cm, what happens to the Volume?',
      options: [
        { label: 'Doubles (2×)', correct: false, explanation: 'Linear growth only happens with single-dimension scaling!' },
        { label: 'Quadruples (4×)', correct: false, explanation: '4× would be for 2D Area (2² = 4).' },
        { label: 'Grows 8-fold (8×)', correct: true, explanation: 'Correct! Volume scales cubically: 2³ = 8 times! (2³=8 → 4³=64, 64/8 = 8×)' },
        { label: 'Stays the same', correct: false, explanation: 'Bigger dimensions always increase volume.' },
      ],
      testInstruction: 'Drag the red handle from 2 cm to 4 cm to verify: Volume jumps from 8 cm³ to 64 cm³ (8×)!',
    },
    {
      question: 'What happens to the Surface-Area-to-Volume ratio as a cube gets bigger?',
      options: [
        { label: 'Ratio increases', correct: false, explanation: 'Volume actually grows much faster than surface area!' },
        { label: 'Ratio decreases', correct: true, explanation: 'Correct! Large objects have much less surface area per unit volume (Square-Cube Law)!' },
        { label: 'Ratio stays identical', correct: false, explanation: 'Area scales with s², while Volume scales with s³.' },
      ],
      testInstruction: 'Switch to Mathematician mode and watch the SA/V ratio drop as you enlarge the cube!',
    },
  ],
  cylinder: [
    {
      question: 'Which has a BIGGER impact on a cylinder’s volume: doubling the radius or doubling the height?',
      options: [
        { label: 'Doubling radius (r)', correct: true, explanation: 'Correct! Radius is squared (r²), so doubling r multiplies volume by 4×! Doubling height only multiplies by 2×.' },
        { label: 'Doubling height (h)', correct: false, explanation: 'Height only scales volume linearly (1×).' },
        { label: 'Both have equal impact', correct: false, explanation: 'Remember the formula: V = π × r² × h! The exponent on r makes all the difference.' },
      ],
      testInstruction: 'Test it! Double radius from 2 to 4 (Volume 4×), then reset and double height from 2 to 4 (Volume only 2×)!',
    },
  ],
  cone: [
    {
      question: 'If a cone and a cylinder have the EXACT same radius and height, what fraction of the cylinder’s volume is the cone?',
      options: [
        { label: 'Exactly ½ (half)', correct: false, explanation: 'Half is too much because of the cone’s sharp slope.' },
        { label: 'Exactly ⅓ (one-third)', correct: true, explanation: 'Bingo! A cone holds exactly ⅓ of a cylinder with identical base and height (V = ⅓πr²h)!' },
        { label: 'Exactly ¼ (one-fourth)', correct: false, explanation: '¼ is too small.' },
      ],
      testInstruction: 'Compare the cone formula (⅓πr²h) to the cylinder formula (πr²h)!',
    },
  ],
  sphere: [
    {
      question: 'If you double the radius of a sphere, how many times larger does its Surface Area become?',
      options: [
        { label: '2 times larger', correct: false, explanation: 'Area scales with radius squared (r²).' },
        { label: '4 times larger', correct: true, explanation: 'Spot on! Surface Area = 4πr², so (2r)² = 4r² (4× larger)!' },
        { label: '8 times larger', correct: false, explanation: '8× is for 3D volume, not 2D surface area.' },
      ],
      testInstruction: 'Check the Surface Area card as you increase radius from 1 to 2!',
    },
  ],
  default: [
    {
      question: 'When scaling any 3D solid uniformly by a factor of k, how does its volume scale?',
      options: [
        { label: 'Scales by k', correct: false, explanation: 'Linear growth applies only to single 1D edge lengths.' },
        { label: 'Scales by k²', correct: false, explanation: 'k² is for 2D surface area.' },
        { label: 'Scales by k³', correct: true, explanation: 'Exact! 3D space scales cubically (length × width × height).' },
      ],
      testInstruction: 'Drag dimensions and watch the cubic growth in the formula card!',
    },
  ],
};

export default function GuessBeforeDragGame({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const questList = PREDICTIONS[shapeId] || PREDICTIONS.default;
  const [qIndex, setQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const currentQ = questList[qIndex % questList.length];

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelectedIdx(idx);
  };

  const handleConfirm = () => {
    if (selectedIdx === null || revealed) return;
    setRevealed(true);

    const isCorrect = currentQ.options[selectedIdx].correct;
    if (isCorrect) {
      sound.playSuccess();
      sound.playCoin();
      addXp(60);
      addGems(8);
    } else {
      sound.playError();
      addXp(15); // participation XP
    }
  };

  const handleNext = () => {
    sound.playPop();
    setQIndex((i) => (i + 1) % questList.length);
    setSelectedIdx(null);
    setRevealed(false);
  };

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {/* Question header */}
      <div style={{
        fontSize: '0.88rem',
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#f1f0f5',
        marginBottom: '0.75rem',
        lineHeight: 1.4,
      }}>
        🤔 <span style={{ color: '#fbbf24' }}>Hypothesis:</span> {currentQ.question}
      </div>

      {/* Options grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let btnStyle = {
            padding: '0.55rem 0.8rem',
            textAlign: 'left',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--color-text-primary)',
            cursor: revealed ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
          };

          if (isSelected) {
            btnStyle.background = 'rgba(129, 140, 248, 0.25)';
            btnStyle.borderColor = '#818cf8';
          }

          if (revealed) {
            if (opt.correct) {
              btnStyle.background = 'rgba(16, 185, 129, 0.25)';
              btnStyle.borderColor = '#10b981';
              btnStyle.color = '#34d399';
            } else if (isSelected && !opt.correct) {
              btnStyle.background = 'rgba(239, 68, 68, 0.25)';
              btnStyle.borderColor = '#ef4444';
              btnStyle.color = '#f87171';
            }
          }

          return (
            <button
              key={idx}
              style={btnStyle}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Action / Result banner */}
      {!revealed ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-sm btn-accent"
            onClick={handleConfirm}
            disabled={selectedIdx === null}
            style={selectedIdx === null ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            🔒 Lock in Prediction!
          </button>
        </div>
      ) : (
        <div style={{
          padding: '0.75rem',
          borderRadius: '10px',
          background: currentQ.options[selectedIdx].correct
            ? 'rgba(16, 185, 129, 0.12)'
            : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${currentQ.options[selectedIdx].correct ? '#10b98144' : '#ef444444'}`,
          animation: 'page-in 0.3s ease',
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '0.85rem',
            color: currentQ.options[selectedIdx].correct ? '#34d399' : '#f87171',
            marginBottom: '0.25rem',
          }}>
            {currentQ.options[selectedIdx].correct ? '🎉 Brilliant Hypothesis! (+60 XP, +8 💎)' : '💡 Almost there! (+15 XP)'}
          </div>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {currentQ.options[selectedIdx].explanation}
          </p>
          <div style={{
            fontSize: '0.75rem',
            color: '#fbbf24',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}>
            🔬 Live 3D Test: {currentQ.testInstruction}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={handleNext}>
              Next Question →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
