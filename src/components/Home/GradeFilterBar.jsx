/**
 * GradeFilterBar.jsx
 * Segmented control to filter shapes by grade range on the homepage.
 */
import React from 'react';
import useAppStore from '../../store/useAppStore';

const FILTERS = [
  { key: 'all', label: 'All Shapes' },
  { key: 'elementary', label: 'Grade 3–5' },
  { key: 'standard', label: 'Grade 6–8' },
  { key: 'advanced', label: 'Grade 9–10' },
];

export default function GradeFilterBar() {
  const gradeFilter = useAppStore((s) => s.gradeFilter);
  const setGradeFilter = useAppStore((s) => s.setGradeFilter);

  return (
    <div className="difficulty-toggle" style={{ display: 'inline-flex' }}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={gradeFilter === f.key ? 'active' : ''}
          onClick={() => setGradeFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
