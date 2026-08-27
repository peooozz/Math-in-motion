/**
 * App.jsx
 * ═══════════════════════════════════════════════════════════════
 * Root component — two-page router driven by Zustand store.
 * currentShape === null → HomePage
 * currentShape === 'cube' etc → ShapeDetailPage
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import useAppStore from './store/useAppStore';
import HomePage from './pages/HomePage';
import ShapeDetailPage from './pages/ShapeDetailPage';

export default function App() {
  const currentShape = useAppStore((s) => s.currentShape);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {currentShape ? (
        <ShapeDetailPage key={currentShape} shapeId={currentShape} />
      ) : (
        <HomePage />
      )}
    </div>
  );
}
