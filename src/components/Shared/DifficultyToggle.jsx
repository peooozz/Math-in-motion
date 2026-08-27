/**
 * DifficultyToggle.jsx
 * Explorer 🧒 / Builder 🧑 / Mathematician 🎓 segmented control.
 */
import React from 'react';
import useAppStore from '../../store/useAppStore';

const LEVELS = [
  { key: 'elementary', label: 'Explorer 🧒' },
  { key: 'standard', label: 'Builder 🧑' },
  { key: 'advanced', label: 'Mathematician 🎓' },
];

export default function DifficultyToggle({ compact = false }) {
  const difficulty = useAppStore((s) => s.difficulty);
  const setDifficulty = useAppStore((s) => s.setDifficulty);

  return (
    <div className="difficulty-toggle" role="radiogroup" aria-label="Difficulty level">
      {LEVELS.map((l) => (
        <button
          key={l.key}
          className={difficulty === l.key ? 'active' : ''}
          onClick={() => setDifficulty(l.key)}
          role="radio"
          aria-checked={difficulty === l.key}
          style={compact ? { padding: '0.3rem 0.55rem', fontSize: '0.7rem' } : undefined}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
