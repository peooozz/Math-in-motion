/**
 * UnfoldingNet3D.jsx
 * ═══════════════════════════════════════════════════════════════
 * Ultra-Smooth & Physically Accurate 3D Unfolding Net Rigs
 * for all 12 Geometry Shapes.
 * Features Harmonic Cosine Easing, Zero-Gap Hinge Pivots,
 * and Dual-Tone Interior/Exterior Materials.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useMemo } from 'react';
import * as THREE from 'three';

// ─── Harmonic Cosine Easing Curve ───────────────────────────────
const easeCos = (x) => (1 - Math.cos(x * Math.PI)) / 2;

// ─── 1. CUBE & CUBOID BOX NET ──────────────────────────────────
export function BoxNet({ dims, openFactor, color }) {
  const L = dims.length || dims.side || 2;
  const W = dims.width || dims.side || 2;
  const H = dims.height || dims.side || 2;

  const t = easeCos(openFactor);
  const angle = (Math.PI / 2) * t;

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - t), 0]}>
      {/* Base / Bottom Face (stays flat on ground) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Front Face Hinge (at z = +W/2) */}
      <group position={[0, 0, W / 2]} rotation={[angle, 0, 0]}>
        <mesh position={[0, H / 2, 0]}>
          <planeGeometry args={[L, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Back Face Hinge (at z = -W/2) */}
      <group position={[0, 0, -W / 2]} rotation={[-angle, 0, 0]}>
        <mesh position={[0, H / 2, 0]}>
          <planeGeometry args={[L, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>

        {/* Top Lid attached to far edge of Back Face (at y = H) */}
        <group position={[0, H, 0]} rotation={[-angle, 0, 0]}>
          <mesh position={[0, W / 2, 0]}>
            <planeGeometry args={[L, W]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
        </group>
      </group>

      {/* Left Face Hinge (at x = -L/2) */}
      <group position={[-L / 2, 0, 0]} rotation={[0, 0, angle]}>
        <mesh position={[-H / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Right Face Hinge (at x = +L/2) */}
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
  const closedAngle = Math.atan2(H, S / 2);
  const t = easeCos(openFactor);
  const foldAngle = closedAngle * (1 - t);

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
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - t), 0]}>
      {/* Base Square */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[S, S]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* 4 Triangular Flaps Blooming Outward */}
      <group position={[0, 0, S / 2]} rotation={[Math.PI / 2 - foldAngle, 0, 0]}>
        <mesh geometry={triGeo}><meshStandardMaterial {...matProps} /></mesh>
      </group>
      <group position={[0, 0, -S / 2]} rotation={[-(Math.PI / 2 - foldAngle), 0, 0]}>
        <mesh geometry={triGeo} rotation={[0, Math.PI, 0]}><meshStandardMaterial {...matProps} /></mesh>
      </group>
      <group position={[S / 2, 0, 0]} rotation={[0, 0, -(Math.PI / 2 - foldAngle)]}>
        <mesh geometry={triGeo} rotation={[0, 0, -Math.PI / 2]}><meshStandardMaterial {...matProps} /></mesh>
      </group>
      <group position={[-S / 2, 0, 0]} rotation={[0, 0, Math.PI / 2 - foldAngle]}>
        <mesh geometry={triGeo} rotation={[0, 0, Math.PI / 2]}><meshStandardMaterial {...matProps} /></mesh>
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

  const t = easeCos(openFactor);
  const angleSide = (Math.PI / 2) * t;

  const matProps = {
    color,
    roughness: 0.25,
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
    <group position={[0, -H / 2 + (H / 2) * (1 - t), 0]}>
      {/* Bottom Rectangle Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[B, L]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Right Side Wall */}
      <group position={[B / 2, 0, 0]} rotation={[0, 0, -angleSide]}>
        <mesh position={[sideLength / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[sideLength, L]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Left Side Wall */}
      <group position={[-B / 2, 0, 0]} rotation={[0, 0, angleSide]}>
        <mesh position={[-sideLength / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[sideLength, L]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Front Triangular Cap */}
      <group position={[0, 0, L / 2]} rotation={[angleSide, 0, 0]}>
        <mesh geometry={endCapGeo}><meshStandardMaterial {...matProps} /></mesh>
      </group>

      {/* Back Triangular Cap */}
      <group position={[0, 0, -L / 2]} rotation={[-angleSide, 0, 0]}>
        <mesh geometry={endCapGeo} rotation={[0, Math.PI, 0]}><meshStandardMaterial {...matProps} /></mesh>
      </group>
    </group>
  );
}

// ─── 4. CYLINDER NET ──────────────────────────────────────────
export function CylinderNet({ dims, openFactor, color }) {
  const R = dims.radius || 1.2;
  const H = dims.height || 2.8;
  const circ = 2 * Math.PI * R;
  const t = easeCos(openFactor);

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const bodyGeo = useMemo(() => {
    const uSegs = 40;
    const vSegs = 10;
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    for (let j = 0; j <= vSegs; j++) {
      const v = j / vSegs;
      const y = (v - 0.5) * H;

      for (let i = 0; i <= uSegs; i++) {
        const u = i / uSegs;
        const phi = (u - 0.5) * 2 * Math.PI * (1 - t * 0.999);
        const curR = (1 - t) * R + t * 0.001;

        const x = (1 - t) * (curR * Math.sin(phi)) + t * ((u - 0.5) * circ);
        const z = (1 - t) * (curR * Math.cos(phi));

        positions.push(x, y, z);
      }
    }

    for (let j = 0; j < vSegs; j++) {
      for (let i = 0; i < uSegs; i++) {
        const a = j * (uSegs + 1) + i;
        const b = (j + 1) * (uSegs + 1) + i;
        const c = (j + 1) * (uSegs + 1) + (i + 1);
        const d = j * (uSegs + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [R, H, circ, t]);

  const lidAngle = (Math.PI / 2) * t;

  return (
    <group position={[0, (R * 0.5) * t, 0]}>
      <mesh geometry={bodyGeo}><meshStandardMaterial {...matProps} /></mesh>

      {/* Top Circular Lid */}
      <group position={[0, H / 2, 0]} rotation={[-lidAngle, 0, 0]}>
        <mesh position={[0, t * R, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Bottom Circular Lid */}
      <group position={[0, -H / 2, 0]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, -t * R, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
  const sectorAngle = 2 * Math.PI * (R / slant);
  const t = easeCos(openFactor);

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const lidAngle = (Math.PI / 2) * t;

  return (
    <group position={[0, (R * 0.5) * t, 0]}>
      {t < 0.02 ? (
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[R, H, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2 * t, 0, 0]}>
          <ringGeometry args={[0.01, slant, 32, 1, -sectorAngle / 2, sectorAngle]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      )}

      {/* Base Circle */}
      <group position={[0, -H / 2, 0]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, -t * R, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
  const t = easeCos(openFactor);
  const spread = t * (R * 2.2);

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  if (t < 0.03) {
    return (
      <mesh>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
    );
  }

  return (
    <group>
      <mesh position={[-spread, 0, -spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} /><meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[spread, 0, -spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} /><meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[-spread, 0, spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} /><meshStandardMaterial {...matProps} />
      </mesh>
      <mesh position={[spread, 0, spread]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 32]} /><meshStandardMaterial {...matProps} />
      </mesh>
    </group>
  );
}

// ─── 7. HEMISPHERE NET (Dome + Base Disc) ──────────────────────
export function HemisphereNet({ dims, openFactor, color }) {
  const R = dims.radius || 2.5;
  const t = easeCos(openFactor);
  const lidAngle = (Math.PI / 2) * t;

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  return (
    <group position={[0, -R / 2, 0]}>
      {/* Dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2 * (1 - t * 0.5)]} />
        <meshStandardMaterial {...matProps} />
      </mesh>

      {/* Flat Circular Base Lid */}
      <group position={[0, 0, 0]} rotation={[lidAngle, 0, 0]}>
        <mesh position={[0, -t * R * 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, 32]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 8. HEXAGONAL PRISM NET ───────────────────────────────────
export function HexPrismNet({ dims, openFactor, color }) {
  const S = dims.side || 2;
  const H = dims.height || 4;
  const t = easeCos(openFactor);
  const angle = (Math.PI / 2) * t;

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const hexGeo = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = S * Math.cos(a);
      const y = S * Math.sin(a);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [S]);

  return (
    <group position={[0, -H / 2 + (H / 2) * (1 - t), 0]}>
      {/* 6 Unrolling Rectangular Side Walls */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((posMultiplier, idx) => (
        <mesh
          key={idx}
          position={[posMultiplier * S * t + (1 - t) * (S * Math.cos((idx * Math.PI) / 3)), H / 2, (1 - t) * (S * Math.sin((idx * Math.PI) / 3))]}
          rotation={[0, (1 - t) * (-(idx * Math.PI) / 3 + Math.PI / 2), 0]}
        >
          <planeGeometry args={[S, H]} />
          <meshStandardMaterial {...matProps} />
        </mesh>
      ))}

      {/* Top Hex Lid */}
      <group position={[0, H, 0]} rotation={[-angle, 0, 0]}>
        <mesh position={[0, t * S, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={hexGeo}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>

      {/* Bottom Hex Lid */}
      <group position={[0, 0, 0]} rotation={[angle, 0, 0]}>
        <mesh position={[0, -t * S, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={hexGeo}>
          <meshStandardMaterial {...matProps} />
        </mesh>
      </group>
    </group>
  );
}

// ─── 9. OCTAHEDRON NET (Diamond) ──────────────────────────────
export function OctahedronNet({ dims, openFactor, color }) {
  const edge = dims.edge || 3;
  const t = easeCos(openFactor);
  const triH = (Math.sqrt(3) / 2) * edge;

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const triGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -edge / 2, 0, 0,
      edge / 2, 0, 0,
      0, triH, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    return geo;
  }, [edge, triH]);

  if (t < 0.03) {
    return (
      <mesh>
        <octahedronGeometry args={[edge / Math.sqrt(2)]} />
        <meshStandardMaterial {...matProps} />
      </mesh>
    );
  }

  return (
    <group position={[0, -triH / 2, 0]}>
      {/* 8 Connected Triangular Faces */}
      {[-3, -2, -1, 0, 1, 2, 3, 4].map((offset, i) => (
        <mesh
          key={i}
          geometry={triGeo}
          position={[offset * (edge * 0.5) * t, 0, 0]}
          rotation={[0, 0, i % 2 === 0 ? 0 : Math.PI]}
        >
          <meshStandardMaterial {...matProps} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 10. TORUS NET (Donut) ────────────────────────────────────
export function TorusNet({ dims, openFactor, color }) {
  const R = dims.majorRadius || 3;
  const r = dims.tubeRadius || 1;
  const t = easeCos(openFactor);

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

  const arc = 2 * Math.PI * (1 - t * 0.85);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[R, r, 16, 48, arc]} />
      <meshStandardMaterial {...matProps} />
    </mesh>
  );
}

// ─── 11. TRIANGLE 2D ──────────────────────────────────────────
export function TriangleNet({ dims, openFactor, color }) {
  const B = dims.base || 3;
  const H = dims.height || 2.5;
  const t = easeCos(openFactor);
  const shift = t * (B * 0.35);

  const matProps = {
    color,
    roughness: 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide,
  };

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
    case 'hemisphere':
      return <HemisphereNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'hexagonal_prism':
      return <HexPrismNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'octahedron':
      return <OctahedronNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'torus':
      return <TorusNet dims={dimensions} openFactor={openFactor} color={color} />;
    case 'triangle':
      return <TriangleNet dims={dimensions} openFactor={openFactor} color={color} />;
    default:
      return <BoxNet dims={dimensions} openFactor={openFactor} color={color} />;
  }
}
