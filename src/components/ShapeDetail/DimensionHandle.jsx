/**
 * DimensionHandle.jsx
 * ═══════════════════════════════════════════════════════════════
 * Reusable 3D draggable sphere that sits on a shape's edge/face.
 * Drag is constrained to a single world axis (x, y, or z).
 *
 * Uses window-level pointer events for stable dragging even when
 * the pointer leaves the sphere. Projects screen-space deltas onto
 * the world-space axis direction for correct behavior at any camera angle.
 *
 * Touch + mouse compatible. Keyboard arrow-key fallback for a11y.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const AXIS_VECTORS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

export default function DimensionHandle({
  axis = 'x',
  color = '#ef4444',
  value,
  min = 0.5,
  max = 10,
  step = 0.5,
  label = '',
  position = [0, 0, 0],
  onDrag,
  onDragStart,
  onDragEnd,
}) {
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const meshRef = useRef();

  const axisVec = useMemo(() => AXIS_VECTORS[axis], [axis]);

  // ─── Compute screen-space axis direction & scale ──────────
  const computeScreenAxis = useCallback(() => {
    const p0 = new THREE.Vector3(...position);
    const p1 = p0.clone().add(axisVec);

    p0.project(camera);
    p1.project(camera);

    const s0 = new THREE.Vector2(
      (p0.x + 1) * size.width / 2,
      (-p0.y + 1) * size.height / 2
    );
    const s1 = new THREE.Vector2(
      (p1.x + 1) * size.width / 2,
      (-p1.y + 1) * size.height / 2
    );

    const screenDir = s1.clone().sub(s0);
    const pixelsPerUnit = screenDir.length();
    const normalizedDir = pixelsPerUnit > 0.001
      ? screenDir.clone().normalize()
      : new THREE.Vector2(1, 0);

    return { pixelsPerUnit, normalizedDir };
  }, [position, axisVec, camera, size]);

  // ─── Pointer handlers ────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    const { pixelsPerUnit, normalizedDir } = computeScreenAxis();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startValue: value,
      pixelsPerUnit,
      normalizedDir,
    };
    setDragging(true);
    onDragStart?.();
  }, [value, computeScreenAxis, onDragStart]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      if (!dragRef.current) return;
      const { startX, startY, startValue, pixelsPerUnit, normalizedDir } = dragRef.current;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const screenDelta = new THREE.Vector2(dx, dy);
      const projectedPixels = screenDelta.dot(normalizedDir);

      const worldDelta = pixelsPerUnit > 0.001 ? projectedPixels / pixelsPerUnit : 0;
      let newValue = startValue + worldDelta;

      // Snap to step
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));

      onDrag?.(newValue);
    };

    const handleUp = () => {
      dragRef.current = null;
      setDragging(false);
      onDragEnd?.();
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging, min, max, step, onDrag, onDragEnd]);

  // ─── Keyboard a11y fallback ──────────────────────────────
  const handleKeyDown = useCallback((e) => {
    let delta = 0;
    if (axis === 'x' && e.key === 'ArrowRight') delta = step;
    if (axis === 'x' && e.key === 'ArrowLeft') delta = -step;
    if (axis === 'y' && e.key === 'ArrowUp') delta = step;
    if (axis === 'y' && e.key === 'ArrowDown') delta = -step;
    if (axis === 'z' && e.key === 'ArrowRight') delta = step;
    if (axis === 'z' && e.key === 'ArrowLeft') delta = -step;

    if (delta !== 0) {
      e.preventDefault();
      const newValue = Math.max(min, Math.min(max, value + delta));
      onDrag?.(newValue);
    }
  }, [axis, step, value, min, max, onDrag]);

  const handleColor = hovered || dragging ? '#ffffff' : color;
  const emissiveIntensity = dragging ? 0.8 : hovered ? 0.5 : 0.25;
  const handleScale = dragging ? 1.3 : hovered ? 1.15 : 1;

  return (
    <group position={position}>
      {/* Draggable sphere handle */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          setHovered(false);
          if (!dragging) document.body.style.cursor = 'auto';
        }}
        scale={handleScale}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={handleColor}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Floating label */}
      {label && (
        <Html
          position={[0, 0.4, 0]}
          center
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            color: color,
            background: 'rgba(15, 13, 26, 0.85)',
            padding: '2px 8px',
            borderRadius: '6px',
            border: `1px solid ${color}33`,
            userSelect: 'none',
          }}
        >
          {label}
        </Html>
      )}
    </group>
  );
}
