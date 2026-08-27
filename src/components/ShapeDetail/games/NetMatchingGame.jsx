/**
 * NetMatchingGame.jsx
 * ═══════════════════════════════════════════════════════════════
 * 3D Net Folding & Pattern Matching Lab.
 * Shows flat 2D nets that fold into 3D solids, with an interactive
 * fold-slider and a "Will it fold?" quiz to train spatial intuition.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

const NET_QUIZZES = {
  cube: {
    question: 'How many identical square faces are in a complete cube net?',
    options: ['4 faces', '5 faces', '6 faces', '8 faces'],
    correctIdx: 2,
    explanation: 'A cube has exactly 6 equal square faces that fold together into a closed box!',
    netDesc: 'Standard Latin Cross (T-shape): 1 top, 1 bottom, and 4 perimeter squares.',
  },
  cylinder: {
    question: 'When you unroll the curved surface of a cylinder, what 2D shape does it form?',
    options: ['A circle', 'A rectangle', 'A triangle', 'An oval'],
    correctIdx: 1,
    explanation: 'Unrolling the curved wall gives a rectangle with width = 2πr (circumference) and height = h!',
    netDesc: '2 identical circular lids + 1 rectangular wrap.',
  },
  cone: {
    question: 'What shapes make up the flat net of a solid cone with a base?',
    options: [
      '1 circle + 1 circular sector (pie slice)',
      '2 triangles + 1 square',
      '2 circles + 1 rectangle',
      '1 rectangle + 1 triangle',
    ],
    correctIdx: 0,
    explanation: 'The curved side unwraps into a circular sector (pie slice), and the base is a flat circle!',
    netDesc: '1 circular base + 1 curved fan sector.',
  },
  pyramid: {
    question: 'What shapes make up the net of a square-based pyramid?',
    options: [
      '4 squares + 1 triangle',
      '1 square base + 4 identical triangles',
      '6 triangles',
      '2 squares + 2 triangles',
    ],
    correctIdx: 1,
    explanation: 'A central square base with 4 triangular flaps that fold up to meet at the apex!',
    netDesc: '1 central square + 4 surrounding triangle petals.',
  },
  default: {
    question: 'What is a 3D geometry "net"?',
    options: [
      'A fishing net for catching shapes',
      'A 2D flat pattern that can be folded into a 3D solid',
      'The wireframe grid of a 3D model',
    ],
    correctIdx: 1,
    explanation: 'A net is a 2D pattern that folds seamlessly into a 3D solid without overlapping faces!',
    netDesc: 'Flat 2D arrangement of connected polygon faces.',
  },
};

export default function NetMatchingGame({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const [foldProgress, setFoldProgress] = useState(0); // 0 = flat net, 100 = folded 3D
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
      {/* 2D Net Visualizer / Fold Controller */}
      <div style={{
        padding: '0.8rem',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem',
        }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#818cf8',
          }}>
            🧩 Interactive Net Folding Simulator
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: foldProgress === 100 ? '#10b981' : foldProgress === 0 ? '#fbbf24' : '#06b6d4',
          }}>
            {foldProgress === 0 ? '📄 Flat 2D Net' : foldProgress === 100 ? '📦 Fully Folded 3D' : `🔄 Folding: ${foldProgress}%`}
          </span>
        </div>

        {/* Fold slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={foldProgress}
          onChange={handleFoldChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#818cf8',
            marginBottom: '0.4rem',
          }}
        />

        <div style={{
          fontSize: '0.74rem',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>0% (Unfolded Paper Pattern)</span>
          <span>100% (Closed 3D Solid)</span>
        </div>

        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
          background: 'rgba(0,0,0,0.2)',
          padding: '0.4rem 0.6rem',
          borderRadius: '6px',
        }}>
          📐 <strong>Net Topology:</strong> {quiz.netDesc}
        </div>
      </div>

      {/* Spatial Quiz */}
      <div style={{
        fontSize: '0.82rem',
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: '0.5rem',
      }}>
        ❓ <span style={{ color: '#fbbf24' }}>Spatial Challenge:</span> {quiz.question}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.4rem',
        marginBottom: '0.6rem',
      }}>
        {quiz.options.map((opt, idx) => {
          let style = {
            padding: '0.45rem 0.65rem',
            textAlign: 'left',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--color-text-primary)',
            cursor: quizAnswered ? 'default' : 'pointer',
          };

          if (quizAnswered) {
            if (idx === quiz.correctIdx) {
              style.background = 'rgba(16, 185, 129, 0.2)';
              style.borderColor = '#10b981';
              style.color = '#34d399';
            } else if (selectedOpt === idx) {
              style.background = 'rgba(239, 68, 68, 0.2)';
              style.borderColor = '#ef4444';
              style.color = '#f87171';
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
          padding: '0.6rem 0.8rem',
          borderRadius: '8px',
          background: selectedOpt === quiz.correctIdx ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${selectedOpt === quiz.correctIdx ? '#10b98133' : '#ef444433'}`,
          fontSize: '0.76rem',
          lineHeight: 1.4,
          color: 'var(--color-text-secondary)',
        }}>
          <strong style={{ color: selectedOpt === quiz.correctIdx ? '#34d399' : '#f87171' }}>
            {selectedOpt === quiz.correctIdx ? '✨ Spot On! (+50 XP, +6 💎)' : '💡 Explanation:'}
          </strong>{' '}
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}
