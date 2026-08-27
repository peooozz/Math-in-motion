/**
 * App.jsx
 * ═══════════════════════════════════════════════════════════════
 * Root Game Component.
 * Routes dynamically based on Zustand store:
 *  - currentShape !== null  → ShapeDetailPage (Interactive 3D Stage)
 *  - viewMode === 'map'     → QuestMapPage (Adventure Quest Level Map)
 *  - default                → HomePage (Shape Gallery & Hub)
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import useAppStore from './store/useAppStore';
import HomePage from './pages/HomePage';
import QuestMapPage from './pages/QuestMapPage';
import ShapeDetailPage from './pages/ShapeDetailPage';

export default function App() {
  const currentShape = useAppStore((s) => s.currentShape);
  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {currentShape ? (
        <ShapeDetailPage key={currentShape} shapeId={currentShape} />
      ) : viewMode === 'map' ? (
        <QuestMapPage />
      ) : (
        <HomePage />
      )}
    </div>
  );
}
