/**
 * geometryMath.js
 * Pure math utility functions for all Math in Motion modules.
 * No React / Three.js dependencies — easy to unit-test independently.
 */

// ─── Module 1: Cube / Cuboid ────────────────────────────────────────

/** Volume of a rectangular cuboid */
export function computeVolume(l, w, h) {
  return l * w * h;
}

/** Surface area of a rectangular cuboid */
export function computeSurfaceArea(l, w, h) {
  return 2 * (l * w + w * h + h * l);
}

/** Surface-area-to-volume ratio */
export function saToVolumeRatio(l, w, h) {
  const v = computeVolume(l, w, h);
  return v === 0 ? Infinity : computeSurfaceArea(l, w, h) / v;
}

// ─── Module 3: Triangle ─────────────────────────────────────────────

/**
 * Signed area of a polygon via the Shoelace formula.
 * @param {Array<{x: number, y: number}>} vertices – ordered vertex list
 * @returns {number} Unsigned area
 */
export function shoelaceArea(vertices) {
  const n = vertices.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Euclidean distance between two 2D points.
 */
export function dist2D(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Interior angle (in degrees) at vertex B given triangle vertices A-B-C.
 */
export function interiorAngle(a, b, c) {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  const dot = ba.x * bc.x + ba.y * bc.y;
  const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2);
  const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2);
  if (magBA === 0 || magBC === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Check if three side lengths can form a valid triangle (triangle inequality).
 */
export function isValidTriangle(a, b, c) {
  return a + b > c && b + c > a && a + c > b;
}

/**
 * Classify a triangle by its sides and angles.
 * @returns {{ bySides: string, byAngles: string }}
 */
export function classifyTriangle(sides, angles) {
  const TOLERANCE = 1.5; // degree tolerance for angle checks
  const SIDE_TOL = 0.1; // side length tolerance

  // By sides
  let bySides = 'Scalene';
  const [s1, s2, s3] = sides;
  if (
    Math.abs(s1 - s2) < SIDE_TOL &&
    Math.abs(s2 - s3) < SIDE_TOL
  ) {
    bySides = 'Equilateral';
  } else if (
    Math.abs(s1 - s2) < SIDE_TOL ||
    Math.abs(s2 - s3) < SIDE_TOL ||
    Math.abs(s1 - s3) < SIDE_TOL
  ) {
    bySides = 'Isosceles';
  }

  // By angles
  let byAngles = 'Acute';
  const maxAngle = Math.max(...angles);
  if (Math.abs(maxAngle - 90) < TOLERANCE) {
    byAngles = 'Right';
  } else if (maxAngle > 90 + TOLERANCE) {
    byAngles = 'Obtuse';
  }

  return { bySides, byAngles };
}

// ─── Module 5: Angles ───────────────────────────────────────────────

/**
 * Angle in degrees between a direction vector and the positive X-axis.
 * Returns 0–360.
 */
export function angleBetweenRays(dx, dy) {
  let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

/**
 * Classify an angle by its degree measure.
 */
export function classifyAngle(degrees) {
  const d = ((degrees % 360) + 360) % 360;
  if (d === 0 || d === 360) return 'Zero';
  if (d < 90) return 'Acute';
  if (Math.abs(d - 90) < 0.5) return 'Right';
  if (d < 180) return 'Obtuse';
  if (Math.abs(d - 180) < 0.5) return 'Straight';
  return 'Reflex';
}

/**
 * Return the color for an angle type.
 */
export function angleTypeColor(type) {
  const map = {
    Zero: '#94a3b8',
    Acute: '#22c55e',
    Right: '#3b82f6',
    Obtuse: '#f97316',
    Straight: '#ef4444',
    Reflex: '#a855f7',
  };
  return map[type] || '#94a3b8';
}

/**
 * Snap an angle to common values if within a tolerance.
 * @param {number} deg – raw angle in degrees
 * @param {number} tolerance – snap tolerance in degrees (default 5)
 * @returns {number} snapped angle
 */
export function snapToCommonAngle(deg, tolerance = 5) {
  const COMMON = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
  for (const target of COMMON) {
    if (Math.abs(deg - target) < tolerance) return target === 360 ? 0 : target;
  }
  return deg;
}

// ─── Module 2: Cross-Section ────────────────────────────────────────

/**
 * Identify the cross-section shape when a plane slices a cylinder.
 * @param {number} angleDeg – angle of the slice plane relative to the cylinder axis (0 = perpendicular = circle)
 * @returns {string} shape name
 */
export function cylinderCrossSection(angleDeg) {
  const a = Math.abs(angleDeg) % 180;
  if (a < 2) return 'Circle';
  if (a > 88 && a < 92) return 'Rectangle';
  return 'Ellipse';
}

// ─── Formatting helpers ─────────────────────────────────────────────

/** Round to n decimal places */
export function round(val, decimals = 1) {
  const f = Math.pow(10, decimals);
  return Math.round(val * f) / f;
}
