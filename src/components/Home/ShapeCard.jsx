/**
 * ShapeCard.jsx
 * A card for the homepage gallery with a live auto-rotating 3D preview,
 * shape name, teaser, grade badge, and progress ring.
 */
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shapeConfig } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';
import * as THREE from 'three';

// ─── Tiny auto-spinning shape preview ──────────────────────────
function MiniShape({ shapeId, accentColor }) {
  const meshRef = useRef();
  const config = shapeConfig[shapeId];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  if (!config) return null;

  const matProps = {
    color: accentColor,
    roughness: 0.4,
    metalness: 0.1,
    emissive: accentColor,
    emissiveIntensity: 0.15,
  };

  // Scale shapes to fit the preview uniformly
  const s = 0.7;

  switch (config.geometryType) {
    case 'box':
      return (
        <mesh ref={meshRef} scale={s}>
          <boxGeometry args={config.id === 'cube' ? [2, 2, 2] : [2.5, 1.8, 1.5]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    case 'cylinder':
      return (
        <mesh ref={meshRef} scale={s}>
          <cylinderGeometry args={[1, 1, 2.2, 24]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    case 'sphere':
      return (
        <mesh ref={meshRef} scale={s}>
          <sphereGeometry args={[1.3, 24, 24]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    case 'cone':
      return (
        <mesh ref={meshRef} scale={s}>
          <coneGeometry args={[1, 2.2, 24]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    case 'triangle': {
      const geo = useMemo(() => {
        const verts = new Float32Array([-1.2, -0.8, 0, 1.2, -0.8, 0, 0, 1.2, 0]);
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        g.computeVertexNormals();
        return g;
      }, []);
      return (
        <mesh ref={meshRef} geometry={geo} scale={s}>
          <meshStandardMaterial {...matProps} side={THREE.DoubleSide} />
        </mesh>
      );
    }
    case 'pyramid':
      return (
        <mesh ref={meshRef} scale={s}>
          <coneGeometry args={[1.3, 2, 4]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    case 'prism': {
      const geo = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-1, -0.7);
        shape.lineTo(1, -0.7);
        shape.lineTo(0, 0.9);
        shape.closePath();
        const g = new THREE.ExtrudeGeometry(shape, { depth: 1.8, bevelEnabled: false });
        g.translate(0, 0, -0.9);
        g.computeVertexNormals();
        return g;
      }, []);
      return (
        <mesh ref={meshRef} geometry={geo} scale={s}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
    }
    default:
      return (
        <mesh ref={meshRef} scale={s}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      );
  }
}

// ─── Progress Ring (SVG arc) ──────────────────────────────────
function ProgressRing({ progress = 0, color, size = 44 }) {
  const r = (size - 4) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 8, right: 8 }}
      className="progress-ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="10"
        fontWeight="700"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function ShapeCard({ shapeId }) {
  const config = shapeConfig[shapeId];
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const progress = useAppStore((s) => s.progress.shapeProgress[shapeId] || 0);

  if (!config) return null;

  return (
    <div
      className="shape-card"
      onClick={() => setCurrentShape(shapeId)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${config.name} — ${config.teaser}`}
      onKeyDown={(e) => e.key === 'Enter' && setCurrentShape(shapeId)}
      style={{
        borderColor: `${config.accentColor}22`,
      }}
    >
      {/* 3D Preview */}
      <div
        className="preview-canvas"
        style={{
          background: `radial-gradient(ellipse at center, ${config.accentColor}15 0%, transparent 70%)`,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          dpr={[1, 1.5]}
          frameloop="always"
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 3]} intensity={0.7} />
          <MiniShape shapeId={shapeId} accentColor={config.accentColor} />
        </Canvas>
      </div>

      {/* Progress ring */}
      <ProgressRing progress={progress} color={config.accentColor} />

      {/* Text content */}
      <div style={{ padding: '0.75rem 1rem 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '0.3rem',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{config.emoji}</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '1.05rem',
          }}>
            {config.name}
          </span>
        </div>

        <p style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.45,
          margin: '0 0 0.5rem',
        }}>
          {config.teaser}
        </p>

        {/* Grade badge */}
        <span style={{
          display: 'inline-block',
          fontSize: '0.68rem',
          fontWeight: 600,
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          background: `${config.accentColor}20`,
          color: config.accentColor,
          border: `1px solid ${config.accentColor}30`,
        }}>
          Grade {config.gradeRange[0]}–{config.gradeRange[1]}
        </span>
      </div>
    </div>
  );
}
