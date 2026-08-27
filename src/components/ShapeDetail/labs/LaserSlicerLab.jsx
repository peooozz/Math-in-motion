/**
 * LaserSlicerLab.jsx
 * ═══════════════════════════════════════════════════════════════
 * Interactive 3D Laser Slicer Lab.
 * Kids slide the laser blade angle (0° to 90°) through 3D shapes to
 * discover cross-sections (Circle, Ellipse, Rectangle, Triangle, Square)!
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore from '../../../store/useAppStore';
import sound from '../../../utils/soundEffects';

function getSliceShape(shapeId, angle) {
  const a = Math.round(angle);
  if (shapeId === 'cylinder') {
    if (a <= 5) return { name: 'Perfect Circle ⚪', desc: 'Flat horizontal cut = circle with radius r!' };
    if (a >= 85) return { name: 'Rectangle ▭', desc: 'Vertical axial cut = rectangle with height h!' };
    return { name: 'Stretched Ellipse 🥚', desc: 'Slanted diagonal cut = oval ellipse!' };
  }
  if (shapeId === 'cone') {
    if (a <= 5) return { name: 'Circle ⚪', desc: 'Parallel to circular base = circle!' };
    if (a >= 45 && a <= 55) return { name: 'Parabola 🪃', desc: 'Cut parallel to side slant = parabola curve!' };
    if (a >= 85) return { name: 'Triangle 🔺', desc: 'Slice right through the apex top = triangle!' };
    return { name: 'Ellipse 🥚', desc: 'Gentle diagonal slice = ellipse!' };
  }
  if (shapeId === 'sphere') {
    return { name: 'Always a Circle! ⚪', desc: 'Every flat slice of a sphere is always a circle!' };
  }
  if (shapeId === 'cube' || shapeId === 'cuboid') {
    if (a <= 5 || a >= 85) return { name: 'Square / Rectangle 🔲', desc: 'Parallel cut = same as cube face!' };
    return { name: 'Hexagon / Polygon ⬡', desc: 'Diagonal corner cut through faces!' };
  }
  return { name: 'Polygon 🔷', desc: 'Flat 2D slice through the 3D solid.' };
}

export default function LaserSlicerLab({ shapeId }) {
  const addXp = useAppStore((s) => s.addXp);
  const addGems = useAppStore((s) => s.addGems);

  const [sliceAngle, setSliceAngle] = useState(0);
  const [discovered, setDiscovered] = useState({});

  const sliceInfo = getSliceShape(shapeId, sliceAngle);

  const handleAngleChange = (e) => {
    const val = Number(e.target.value);
    setSliceAngle(val);

    const shapeKey = `${shapeId}-${sliceInfo.name}`;
    if (!discovered[shapeKey]) {
      sound.playLaserSlice();
      sound.playCoin();
      setDiscovered((d) => ({ ...d, [shapeKey]: true }));
      addXp(40);
      addGems(5);
    }
  };

  return (
    <div style={{ padding: '0.2rem 0' }}>
      {/* Title */}
      <div style={{
        fontSize: '0.86rem',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#0f172a',
        marginBottom: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>✂️ Laser Slicer (Cross-Sections)</span>
        <span style={{
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#0d9488',
          background: '#ccfbf1',
          padding: '0.2rem 0.5rem',
          borderRadius: '9999px',
        }}>
          Angle: {sliceAngle}°
        </span>
      </div>

      {/* Laser Slider Control */}
      <div style={{
        padding: '0.85rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)',
        border: '2px solid #99f6e4',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#0f766e',
          marginBottom: '0.3rem',
        }}>
          <span>Flat Horizontal (0°)</span>
          <span>Slanted (45°)</span>
          <span>Vertical (90°)</span>
        </div>

        <input
          type="range"
          min="0"
          max="90"
          value={sliceAngle}
          onChange={handleAngleChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#0d9488',
            marginBottom: '0.3rem',
          }}
        />

        {/* Revealed Cross-Section Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginTop: '0.6rem',
          padding: '0.6rem 0.8rem',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1.5px solid #ccfbf1',
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.08)',
        }}>
          <div style={{
            fontSize: '1.8rem',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ccfbf1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            ✂️
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '0.98rem',
              color: '#0f766e',
            }}>
              {sliceInfo.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.3 }}>
              {sliceInfo.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
