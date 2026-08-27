/**
 * ShapeCard.jsx
 * ═══════════════════════════════════════════════════════════════
 * Ultra-simple, playful 3D shape card for the home gallery.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shapeConfig } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';
import * as THREE from 'three';

function MiniShape({ shapeId, accentColor }) {
  const meshRef = useRef();
  const config = shapeConfig[shapeId];

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.9;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  if (!config) return null;

  const matProps = {
    color: accentColor,
    roughness: 0.25,
    metalness: 0.1,
  };

  const s = 0.75;

  switch (config.geometryType) {
    case 'box':
      return (
        <mesh ref={meshRef} scale={s}>
          <boxGeometry args={config.id === 'cube' ? [2, 2, 2] : [2.6, 1.8, 1.5]} />
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

export default function ShapeCard({ shapeId }) {
  const config = shapeConfig[shapeId];
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);

  if (!config) return null;

  return (
    <div
      className="shape-card"
      onClick={() => setCurrentShape(shapeId)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${config.name}`}
      onKeyDown={(e) => e.key === 'Enter' && setCurrentShape(shapeId)}
      style={{
        borderColor: `${config.accentColor}30`,
        textAlign: 'center',
        padding: '0.5rem 0.5rem 1.2rem',
      }}
    >
      {/* 3D Toy Preview Canvas */}
      <div
        className="preview-canvas"
        style={{
          background: `radial-gradient(circle at center, ${config.accentColor}18 0%, #ffffff 75%)`,
          height: '160px',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          dpr={[1, 1.5]}
          frameloop="always"
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 3]} intensity={0.8} />
          <MiniShape shapeId={shapeId} accentColor={config.accentColor} />
        </Canvas>
      </div>

      {/* Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        marginTop: '0.4rem',
      }}>
        <span style={{ fontSize: '1.4rem' }}>{config.emoji}</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          fontSize: '1.25rem',
          color: '#0f172a',
        }}>
          {config.name}
        </span>
      </div>

      <div style={{
        marginTop: '0.4rem',
        fontSize: '0.8rem',
        fontWeight: 800,
        color: config.accentColor,
      }}>
        Touch to Play ➔
      </div>
    </div>
  );
}
