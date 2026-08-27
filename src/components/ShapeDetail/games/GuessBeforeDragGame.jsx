/**
 * GuessBeforeDragGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * Prediction Arena (Light & Child-Friendly).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const PREDICTIONS = {
  cube: [
    {
      question: 'If you double the side from 2 cm to 4 cm, what happens to the Volume?',
      options: [
        { label: 'Doubles (2×)', correct: false, explanation: 'Linear growth is only for 1D single edges!' },
        { label: 'Quadruples (4×)', correct: false, explanation: '4× would be for 2D area (2² = 4).' },
        { label: 'Grows 8 times (8×)!', correct: true, explanation: 'Correct! 3D Volume multiplies 2³ = 8 times! (2³=8 → 4³=64)' },
      ],
      testInstruction: 'Drag the side from 2 to 4 to see volume jump from 8 to 64 cm³!',
    },
  ],
  cylinder: [
    {
      question: 'What increases volume more: doubling the radius (r) or doubling the height (h)?',
      options: [
        { label: 'Doubling radius (r)', correct: true, explanation: 'Correct! Radius is squared (r²), so doubling r gives 4× the volume!' },
        { label: 'Doubling height (h)', correct: false, explanation: 'Height only multiplies volume by 2×.' },
      ],
      testInstruction: 'Test both! Double radius to see a 4× jump in volume.',
    },
  ],
  cone: [
    {
      question: 'A cone and cylinder have the same radius and height. How much does the cone hold?',
      options: [
        { label: 'Exactly ½ (half)', correct: false, explanation: 'Half is too much because of the cone slope.' },
        { label: 'Exactly ⅓ (one-third)', correct: true, explanation: 'Bingo! A cone holds exactly ⅓ of a cylinder (V = ⅓πr²h)!' },
      ],
      testInstruction: 'Check out the Magic Pour Lab tab to see the 3 scoops pour!',
    },
  ],
  default: [
    {
      question: 'When doubling all sides of any 3D toy, how does its volume grow?',
      options: [
        { label: '2 times larger', correct: false, explanation: 'Only for 1D length.' },
        { label: '8 times larger (2³)', correct: true, explanation: 'Correct! 3D shapes grow cubically!' },
      ],
      testInstruction: 'Watch the numbers multiply in the formula chips!',
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
      addXp(15);
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
      <div style={{
        fontSize: '0.88rem',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#0f172a',
        marginBottom: '0.65rem',
        lineHeight: 1.35,
      }}>
        🤔 <span style={{ color: '#d97706' }}>Guess:</span> {currentQ.question}
      </div>

      {/* Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.45rem',
        marginBottom: '0.75rem',
      }}>
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let btnStyle = {
            padding: '0.6rem 0.85rem',
            textAlign: 'left',
            borderRadius: '14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            border: '2px solid #e2e8f0',
            background: '#ffffff',
            color: '#0f172a',
            cursor: revealed ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
          };

          if (isSelected) {
            btnStyle.background = '#eef2ff';
            btnStyle.borderColor = '#6366f1';
            btnStyle.color = '#4f46e5';
          }

          if (revealed) {
            if (opt.correct) {
              btnStyle.background = '#f0fdf4';
              btnStyle.borderColor = '#10b981';
              btnStyle.color = '#15803d';
            } else if (isSelected && !opt.correct) {
              btnStyle.background = '#fef2f2';
              btnStyle.borderColor = '#ef4444';
              btnStyle.color = '#b91c1c';
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

      {/* Action / Result */}
      {!revealed ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-sm btn-accent"
            onClick={handleConfirm}
            disabled={selectedIdx === null}
            style={selectedIdx === null ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            🔒 Lock in Guess!
          </button>
        </div>
      ) : (
        <div style={{
          padding: '0.75rem',
          borderRadius: '14px',
          background: currentQ.options[selectedIdx].correct ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${currentQ.options[selectedIdx].correct ? '#86efac' : '#fca5a5'}`,
          animation: 'page-in 0.2s ease',
        }}>
          <div style={{
            fontWeight: 800,
            fontSize: '0.88rem',
            color: currentQ.options[selectedIdx].correct ? '#15803d' : '#b91c1c',
            marginBottom: '0.2rem',
          }}>
            {currentQ.options[selectedIdx].correct ? '🎉 Great Job! (+60 XP, +8 💎)' : '💡 Almost! (+15 XP)'}
          </div>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.35 }}>
            {currentQ.options[selectedIdx].explanation}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={handleNext} style={{ background: '#ffffff' }}>
              Next Question →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
