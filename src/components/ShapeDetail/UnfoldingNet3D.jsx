/**
 * UnfoldingNet3D.jsx
 * ═══════════════════════════════════════════════════════════════
 * 3D Unfolding & Reassembly Net Rig for ALL 8 Shapes.
 * Controlled by `openFactor` (0.0 = closed solid, 1.0 = flat 2D net).
 * Features hierarchical hinges, double-sided materials,
 * and smooth geometric interpolation.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';

// ─── 1. CUBE & CUBOID BOX NET ──────────────────────────────────
export function BoxNet({ dims, openFactor, color }) {
  const L = dims.length || dims.side || 2;
  const W = dims.width || dims.side || 2;
  const H = dims.height || dims.side || 2;

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const angle = (Math.PI / 2) * openFactor;

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - openFactor), 0]}>
      {/* ── Base / Bottom Face (stays flat) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* ── Front Face Hinge (at z = +W/2) ── */}
      <group position={[0, 0, W / 2]} rotation={[angle, 0, 0]}>
        <mesh position={[0, H / 2, 0]}>
          <planeGeometry args={[L, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* ── Back Face Hinge (at z = -W/2) ── */}
      <group position={[0, 0, -W / 2]} rotation={[-angle, 0, 0]}>
        <mesh position={[0, H / 2, 0]}>
          <planeGeometry args={[L, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>

        {/* ── Top Lid attached to far edge of Back Face (at y = H) ── */}
        <group position={[0, H, 0]} rotation={[-angle, 0, 0]}>
          <mesh position={[0, W / 2, 0]}>
            <planeGeometry args={[L, W]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        </group>
      </group>

      {/* ── Left Face Hinge (at x = -L/2) ── */}
      <group position={[-L / 2, 0, 0]} rotation={[0, 0, angle]}>
        <mesh position={[-H / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* ── Right Face Hinge (at x = +L/2) ── */}
      <group position={[L / 2, 0, 0]} rotation={[0, 0, -angle]}>
        <mesh position={[H / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 2. PYRAMID NET ───────────────────────────────────────────
export function PyramidNet({ dims, openFactor, color }) {
  const S = dims.baseSide || 2.5;
  const H = dims.height || 3;
  const slant = Math.sqrt((S / 2) ** 2 + H ** 2);
  const closedAngle = Math.atan2(H, S / 2); // angle from horizontal
  const foldAngle = closedAngle * (1 - openFactor); // 0 = flat, closedAngle = standing

  const triGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -S / 2, 0, 0,
      S / 2, 0, 0,
      0, slant, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [S, slant]);

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - openFactor), 0]}>
      {/* Base square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[S, S]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* South Triangle flap */}
      <group position={[0, 0, S / 2]} rotation={[Math.PI / 2 - foldAngle, 0, 0]}>
        <mesh geometry={triGeo}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* North Triangle flap */}
      <group position={[0, 0, -S / 2]} rotation={[-(Math.PI / 2 - foldAngle), 0, 0]}>
        <mesh geometry={triGeo} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* East Triangle flap */}
      <group position={[S / 2, 0, 0]} rotation={[0, 0, -(Math.PI / 2 - foldAngle)]}>
        <mesh geometry={triGeo} rotation={[0, 0, -Math.PI / 2]}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* West Triangle flap */}
      <group position={[-S / 2, 0, 0]} rotation={[0, 0, Math.PI / 2 - foldAngle]}>
        <mesh geometry={triGeo} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 3. TRIANGULAR PRISM NET ──────────────────────────────────
export function PrismNet({ dims, openFactor, color }) {
  const B = dims.base || 2.5;
  const H = dims.triHeight || 2.2;
  const L = dims.length || 3;

  const sideLength = Math.sqrt((B / 2) ** 2 + H ** 2);
  const angleSide = (Math.PI / 2) * openFactor;

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const endCapGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -B / 2, 0, 0,
      B / 2, 0, 0,
      0, H, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [B, H]);

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - openFactor), 0]}>
      {/* Bottom rectangular base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[B, L]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Right side wall */}
      <group position={[B / 2, 0, 0]} rotation={[0, 0, -angleSide]}>
        <mesh position={[sideLength / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[sideLength, L]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Left side wall */}
      <group position={[-B / 2, 0, 0]} rotation={[0, 0, angleSide]}>
        <mesh position={[-sideLength / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[sideLength, L]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Front triangular cap */}
      <group position={[0, 0, L / 2]} rotation={[angleSide, 0, 0]}>
        <mesh geometry={endCapGeo}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Back triangular cap */}
      <group position={[0, 0, -L / 2]} rotation={[-angleSide, 0, 0]}>
        <mesh geometry={endCapGeo} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 4. CYLINDER NET ──────────────────────────────────────────
export function CylinderNet({ dims, openFactor, color }) {
  const R = dims.radius || 1.2;
  const H = dims.height || 2.8;
  const circ = 2 * Math.PI * R;

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  // Parametric uncurling body: from cylinder at openFactor=0 to flat sheet at openFactor=1
  const bodyGeo = useMemo(() => {
    const uSegments = 36;
    const vSegments = 10;
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      const y = (v - 0.5) * H;

      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments;
        const phi = (u - 0.5) * 2 * Math.PI * (1 - openFactor * 0.999);
        const curR = (1 - openFactor) * R + openFactor * 0.001;

        const x = (1 - openFactor) * (curR * Math.sin(phi)) + openFactor * ((u - 0.5) * circ);
        const z = (1 - openFactor) * (curR * Math.cos(phi));

        positions.push(x, y, z);
      }
    }

    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = (j + 1) * (uSegments + 1) + i;
        const c = (j + 1) * (uSegments + 1) + (i + 1);
        const d = j * (uSegments + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [R, H, circ, openFactor]);

  const lidAngle = (Math.PI / 2) * openFactor;

  return (
    <group position={[0, (R * 0.5) * openFactor, 0]}>
      {/* Uncurling lateral sheet */}
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Top circular lid */}
      <group position={[0, H / 2, 0]} rotation={[-lidAngle, 0, 0]}>
        <mesh position={[0, openFactor * R, (1 - openFactor) * 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Bottom circular lid */}
      <group position={[0, -H / 2, 0]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, -openFactor * R, (1 - openFactor) * 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 5. CONE NET ──────────────────────────────────────────────
export function ConeNet({ dims, openFactor, color }) {
  const R = dims.radius || 1.3;
  const H = dims.height || 2.8;
  const slant = Math.sqrt(R ** 2 + H ** 2);
  const sectorAngle = (2 * Math.PI * (R / slant));

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const lidAngle = (Math.PI / 2) * openFactor;

  return (
    <group position={[0, (R * 0.5) * openFactor, 0]}>
      {/* Cone Solid / Unrolled Sector */}
      {openFactor < 0.05 ? (
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[R, H, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2 * openFactor, 0, 0]}>
          <ringGeometry args={[0.01, slant, 32, 1, -sectorAngle / 2, sectorAngle]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      )}

      {/* Base Circle */}
      <group position={[0, -H / 2, 0]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, -openFactor * R, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 6. SPHERE NET (4 Circles Proof) ──────────────────────────
export function SphereNet({ dims, openFactor, color }) {
  const R = dims.radius || 1.4;
  const spread = openFactor * (R * 2.2);

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  if (openFactor < 0.05) {
    return (
      <mesh>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
    );
  }

  return (
    <group>
      {/* 4 Flat Circles = Surface Area of Sphere */}
      <mesh position={[-spread, 0, -spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[spread, 0, -spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[-spread, 0, spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[spread, 0, spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
    </group>
  );
}

// ─── 7. TRIANGLE 2D (Split into Rectangle) ────────────────────
export function TriangleNet({ dims, openFactor, color }) {
  const B = dims.base || 3;
  const H = dims.height || 2.5;

  const matProps = {
    color,
    roughness: 0.3,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const shift = openFactor * (B * 0.35);

  const leftTri = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -B / 2, 0, 0,
      0, 0, 0,
      0, H, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [B, H]);

  const rightTri = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      0, 0, 0,
      B / 2, 0, 0,
      0, H, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [B, H]);

  return (
    <group position={[0, -H / 2, 0]}>
      <mesh geometry={leftTri} position={[-shift, 0, 0]}>
        <meshStandardMaterial {...matProps} />
      </mesh>
      <mesh geometry={rightTri} position={[shift, 0, 0]}>
        <meshStandardMaterial {...matProps} />
      </mesh>
    </group>
  );
}

// ─── MAIN UNIFYING RIG ────────────────────────────────────────
export default function UnfoldingNet3D({ shapeId, dimensions, openFactor, color }) {
  switch (shapeId) {
    case 'cube':
    case 'cuboid':
      return <BoxNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'pyramid':
      return <PyramidNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'prism':
      return <PrismNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'cylinder':
      return <CylinderNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'cone':
      return <ConeNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'sphere':
      return <SphereNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'triangle':
      return <TriangleNet dims={dimensions} openFactor={openFactor} color={color} />;
    default:
      return <BoxNet dims={dimensions} openFactor={openFactor} color={color} />;
  }
}
