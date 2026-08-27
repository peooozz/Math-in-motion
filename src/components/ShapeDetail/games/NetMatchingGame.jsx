/**
 * NetMatchingGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * Origami Net Folding Simulator & Quiz (Light & Child-Friendly).
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const NET_QUIZZES = {
  cube: {
    question: 'How many square faces are in a cube net?',
    options: ['4 squares', '5 squares', '6 squares', '8 squares'],
    correctIdx: 2,
    explanation: 'A cube has 6 equal square faces that fold into a closed box!',
  },
  cylinder: {
    question: 'When you unroll the curved side of a can, what shape is it?',
    options: ['A circle', 'A rectangle', 'A triangle'],
    correctIdx: 1,
    explanation: 'The curved wall unwraps into a flat rectangle!',
  },
  cone: {
    question: 'What shapes make up a cone paper pattern?',
    options: ['1 circle + 1 pie slice fan', '2 triangles + 1 square'],
    correctIdx: 0,
    explanation: '1 circular base + 1 pie-slice curved fan!',
  },
  pyramid: {
    question: 'What shapes make up a pyramid net?',
    options: ['1 square base + 4 triangles', '6 triangles'],
    correctIdx: 0,
    explanation: '1 square base with 4 triangular flaps that meet at the top!',
  },
  default: {
    question: 'What is a 3D geometry net?',
    options: ['A flat 2D pattern that folds into a 3D toy', 'A fishing net'],
    correctIdx: 0,
    explanation: 'A flat pattern that folds into a 3D solid!',
  },
};

export default function NetMatchingGame({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const [foldProgress, setFoldProgress] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const quiz = NET_QUIZZES[shapeId] || NET_QUIZZES.default;

  const handleFoldChange = (e) => {
    const val = Number(e.target.value);
    setFoldProgress(val);
    if (val === 100 && foldProgress < 100) {
      sound.playSnap();
    }
  };

  const handleAnswerQuiz = (idx) => {
    if (quizAnswered) return;
    setSelectedOpt(idx);
    setQuizAnswered(true);

    if (idx === quiz.correctIdx) {
      sound.playSuccess();
      sound.playCoin();
      addXp(50);
      addGems(6);
    } else {
      sound.playError();
      addXp(10);
    }
  };

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {/* 2D Net Fold Controller */}
      <div style={{
        padding: '0.85rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #fdf4ff, #ffffff)',
        border: '2px solid #f0abfc',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem',
        }}>
          <span style={{
            fontSize: '0.84rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#a21caf',
          }}>
            🧩 Origami Net Folding Simulator
          </span>
          <span style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: foldProgress === 100 ? '#15803d' : '#a21caf',
          }}>
            {foldProgress === 0 ? '📄 Flat Pattern' : foldProgress === 100 ? '📦 Closed 3D Toy!' : `Folding: ${foldProgress}%`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={foldProgress}
          onChange={handleFoldChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#c026d3',
            marginBottom: '0.3rem',
          }}
        />

        <div style={{
          fontSize: '0.74rem',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 600,
        }}>
          <span>0% (Flat Paper)</span>
          <span>100% (Folded Solid)</span>
        </div>
      </div>

      {/* Spatial Quiz */}
      <div style={{
        fontSize: '0.84rem',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: '0.5rem',
        color: '#0f172a',
      }}>
        ❓ <span style={{ color: '#d97706' }}>Question:</span> {quiz.question}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.4rem',
        marginBottom: '0.6rem',
      }}>
        {quiz.options.map((opt, idx) => {
          let style = {
            padding: '0.55rem 0.8rem',
            textAlign: 'left',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '2px solid #e2e8f0',
            background: '#ffffff',
            color: '#0f172a',
            cursor: quizAnswered ? 'default' : 'pointer',
          };

          if (quizAnswered) {
            if (idx === quiz.correctIdx) {
              style.background = '#f0fdf4';
              style.borderColor = '#10b981';
              style.color = '#15803d';
            } else if (selectedOpt === idx) {
              style.background = '#fef2f2';
              style.borderColor = '#ef4444';
              style.color = '#b91c1c';
            }
          }

          return (
            <button
              key={idx}
              style={style}
              onClick={() => handleAnswerQuiz(idx)}
              disabled={quizAnswered}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {quizAnswered && (
        <div style={{
          padding: '0.65rem 0.85rem',
          borderRadius: '12px',
          background: selectedOpt === quiz.correctIdx ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${selectedOpt === quiz.correctIdx ? '#86efac' : '#fca5a5'}`,
          fontSize: '0.78rem',
          color: selectedOpt === quiz.correctIdx ? '#15803d' : '#b91c1c',
          fontWeight: 600,
        }}>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}
