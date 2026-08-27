/**
 * App.jsx
 * ═══════════════════════════════════════════════════════════════
 * Ultra-simple root router.
 *  - currentShape !== null  → ShapeDetailPage (3D Interactive Playground)
 *  - default                → HomePage (Shape Gallery)
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
