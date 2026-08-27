/**
 * ShapeStage3D.jsx
 * ═══════════════════════════════════════════════════════════════
 * Renders the correct Three.js geometry for any shape, plus
 * dimension handles, measurement lines, and orbit controls.
 *
 * Driven entirely by shapeConfig — no shape-specific code here.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useRef, useMemo, useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import DimensionHandle from './DimensionHandle';
import { shapeConfig } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';

const round = (v) => Math.round(v * 10) / 10;

// ─── Shape Geometry Renderer ────────────────────────────────────
function ShapeGeometry({ shapeId, dims, seeInside }) {
  const config = shapeConfig[shapeId];
  const meshRef = useRef();
  const difficulty = useAppStore((s) => s.difficulty);

  // Gentle idle rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const opacity = seeInside ? 0.35 : 0.9;
  const transparent = seeInside;

  const materialProps = {
    color: config.accentColor,
    roughness: 0.35,
    metalness: 0.05,
    transparent,
    opacity,
    side: seeInside ? THREE.DoubleSide : THREE.FrontSide,
  };

  // ─── Geometry by type ────────────────────────────────
  switch (config.geometryType) {
    case 'box':
      return (
        <mesh ref={meshRef}>
          <boxGeometry args={config.getGeometryArgs(dims)} />
          <meshStandardMaterial {...materialProps} />
          {/* Wireframe overlay for "see inside" */}
          {seeInside && (
            <mesh>
              <boxGeometry args={config.getGeometryArgs(dims)} />
              <meshBasicMaterial color={config.accentColor} wireframe opacity={0.4} transparent />
            </mesh>
          )}
          {/* Unit cube grid for Explorer mode + seeInside */}
          {seeInside && difficulty === 'elementary' && (
            <UnitCubeGrid dims={dims} config={config} />
          )}
        </mesh>
      );

    case 'cylinder':
      return (
        <mesh ref={meshRef}>
          <cylinderGeometry args={config.getGeometryArgs(dims)} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );

    case 'sphere':
      return (
        <mesh ref={meshRef}>
          <sphereGeometry args={config.getGeometryArgs(dims)} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );

    case 'cone':
      return (
        <mesh ref={meshRef}>
          <coneGeometry args={config.getGeometryArgs(dims)} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );

    case 'triangle':
      return <TriangleGeometry ref={meshRef} dims={dims} materialProps={materialProps} />;

    case 'pyramid':
      return (
        <mesh ref={meshRef}>
          {/* ConeGeometry with 4 radial segments = square-based pyramid */}
          <coneGeometry args={[dims.baseSide * 0.707, dims.height, 4]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );

    case 'prism':
      return <PrismGeometry ref={meshRef} dims={dims} materialProps={materialProps} />;

    default:
      return (
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      );
  }
}

// ─── Triangle Geometry (flat 2D in XY plane) ────────────────────
const TriangleGeometry = React.forwardRef(({ dims, materialProps }, ref) => {
  const geometry = useMemo(() => {
    const { base, height } = dims;
    const verts = new Float32Array([
      -base / 2, 0, 0,
      base / 2, 0, 0,
      0, height, 0,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [dims.base, dims.height]);

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial {...materialProps} side={THREE.DoubleSide} />
    </mesh>
  );
});

// ─── Prism Geometry (triangular extrusion) ──────────────────────
const PrismGeometry = React.forwardRef(({ dims, materialProps }, ref) => {
  const geometry = useMemo(() => {
    const { base, triHeight, length } = dims;
    const shape = new THREE.Shape();
    shape.moveTo(-base / 2, -triHeight / 2);
    shape.lineTo(base / 2, -triHeight / 2);
    shape.lineTo(0, triHeight / 2);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: false,
    });
    // Center the extrusion
    geo.translate(0, 0, -length / 2);
    geo.computeVertexNormals();
    return geo;
  }, [dims.base, dims.triHeight, dims.length]);

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
});

// ─── Unit Cube Grid (Explorer mode "see inside") ────────────────
function UnitCubeGrid({ dims, config }) {
  const cubes = useMemo(() => {
    // Get the shape's box dimensions
    let lx, ly, lz;
    if (config.id === 'cube') {
      lx = ly = lz = Math.floor(dims.side);
    } else if (config.id === 'cuboid') {
      lx = Math.floor(dims.length);
      ly = Math.floor(dims.height);
      lz = Math.floor(dims.width);
    } else return [];

    // Cap at 8³ = 512 for performance
    if (lx * ly * lz > 512) return [];

    const positions = [];
    for (let x = 0; x < lx; x++) {
      for (let y = 0; y < ly; y++) {
        for (let z = 0; z < lz; z++) {
          positions.push([
            x - (lx - 1) / 2,
            y - (ly - 1) / 2,
            z - (lz - 1) / 2,
          ]);
        }
      }
    }
    return positions;
  }, [dims, config.id]);

  if (cubes.length === 0) return null;

  return (
    <group>
      {cubes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          <meshBasicMaterial
            color={config.accentColor}
            wireframe
            opacity={0.3}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Measurement Lines ──────────────────────────────────────────
function MeasurementLines({ shapeId, dims }) {
  const config = shapeConfig[shapeId];
  if (!config) return null;

  // Generate measurement lines for each dimension
  return (
    <group>
      {config.dimensions.map((dim) => {
        const handlePos = dim.getHandlePos(dims);
        const value = dims[dim.key];

        // Create a measurement line along the axis
        let start, end, labelPos;
        const offset = 0.15;

        if (dim.axis === 'x') {
          const y = handlePos[1];
          const z = handlePos[2];
          start = [-value / (dim.valueFromAxisPos ? 1 / dim.valueFromAxisPos(1) : 2), y + offset, z];
          end = [handlePos[0], y + offset, z];
          // For radius-type (multiplier=1), line from center
          if (Math.abs(dim.valueFromAxisPos(1) - 1) < 0.01) {
            start = [0, y + offset, z];
          }
          labelPos = [(start[0] + end[0]) / 2, y + offset + 0.3, z];
        } else if (dim.axis === 'y') {
          const x = handlePos[0];
          const z = handlePos[2];
          start = [x + offset, -handlePos[1], z];
          end = [x + offset, handlePos[1], z];
          labelPos = [x + offset + 0.3, 0, z];
        } else {
          const x = handlePos[0];
          const y = handlePos[1];
          start = [x, y + offset, -handlePos[2]];
          end = [x, y + offset, handlePos[2]];
          labelPos = [x, y + offset + 0.3, 0];
        }

        return (
          <group key={dim.key}>
            <Line
              points={[start, end]}
              color={dim.color}
              lineWidth={1.5}
              dashed
              dashSize={0.15}
              gapSize={0.1}
            />
            <Html position={labelPos} center>
              <div
                style={{
                  pointerEvents: 'none',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  color: dim.color,
                  background: 'rgba(15, 13, 26, 0.8)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {dim.symbol} = {round(value)}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function ShapeStage3D({ shapeId, dimensions, onDimensionChange }) {
  const config = shapeConfig[shapeId];
  const controlsRef = useRef();
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const seeInside = useAppStore((s) => s.seeInside);

  if (!config) return null;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />
      <Environment preset="studio" environmentIntensity={0.3} />

      {/* The shape */}
      <ShapeGeometry shapeId={shapeId} dims={dimensions} seeInside={seeInside} />

      {/* Measurement lines */}
      <MeasurementLines shapeId={shapeId} dims={dimensions} />

      {/* Dimension drag handles */}
      {config.dimensions.map((dim) => {
        const handlePos = dim.getHandlePos(dimensions);
        const label = `${dim.symbol} = ${round(dimensions[dim.key])} cm`;

        return (
          <DimensionHandle
            key={dim.key}
            axis={dim.axis}
            color={dim.color}
            value={dimensions[dim.key]}
            min={dim.min}
            max={dim.max}
            step={dim.step || 0.5}
            position={handlePos}
            label={label}
            onDrag={(newVal) => onDimensionChange(dim.key, newVal)}
            onDragStart={() => {
              setIsDraggingHandle(true);
              if (controlsRef.current) controlsRef.current.enabled = false;
            }}
            onDragEnd={() => {
              setIsDraggingHandle(false);
              if (controlsRef.current) controlsRef.current.enabled = true;
            }}
          />
        );
      })}

      {/* Orbit controls — disabled while dragging a handle */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={20}
        enabled={!isDraggingHandle}
      />

      {/* Ground plane hint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f0d1a" transparent opacity={0} />
      </mesh>
    </>
  );
}
