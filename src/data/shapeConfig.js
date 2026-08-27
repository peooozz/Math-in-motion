/**
 * shapeConfig.js
 * ═══════════════════════════════════════════════════════════════════
 * THE SINGLE SOURCE OF TRUTH for every shape in Math in Motion.
 *
 * Adding a new shape = adding one config object here. No new components needed.
 *
 * Each entry defines:
 *  - identity (name, icon, grade range, teaser)
 *  - dimensions (draggable parameters with axis, color, constraints)
 *  - derived values (computed from dimensions, e.g. slant height)
 *  - formulas (volume/area as functions + display strings for every difficulty)
 *  - geometry type (which Three.js primitive to render)
 *  - mini-game + net + aha config
 * ═══════════════════════════════════════════════════════════════════
 */

const PI = Math.PI;
const sqrt = Math.sqrt;
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

// ─── SHAPE DEFINITIONS ──────────────────────────────────────────────

export const SHAPES_ORDER = [
  'cube', 'cuboid', 'cylinder', 'sphere',
  'cone', 'triangle', 'pyramid', 'prism',
];

export const shapeConfig = {
  // ═══════════════════════════════════════════════════════════════════
  // CUBE
  // ═══════════════════════════════════════════════════════════════════
  cube: {
    id: 'cube',
    name: 'Cube',
    emoji: '🧊',
    accentColor: '#f43f5e',
    gradeRange: [3, 6],
    teaser: 'How much space is inside a perfect box?',
    realWorldExamples: ['dice', 'ice cube', 'gift box', 'Rubik\'s cube'],

    // Draggable dimensions
    dimensions: [
      {
        key: 'side',
        label: 'Side',
        symbol: 's',
        axis: 'x',
        color: '#ef4444',
        default: 3,
        min: 1,
        max: 8,
        step: 0.5,
        // Handle sits at half the side length along X
        getHandlePos: (d) => [d.side / 2, 0, d.side / 2 + 0.4],
        // When handle moves along X, side = 2 × handle X position
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    // Computed values (not directly draggable)
    derived: {},

    // All formulas
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => d.side ** 3,
        symbolic: 'V = s³',
        worded: 'Volume = side × side × side',
        substitute: (d) => `${round(d.side)} × ${round(d.side)} × ${round(d.side)}`,
        unit: 'cm³',
        explorer: (val) => `This cube can hold ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 6 * d.side ** 2,
        symbolic: 'SA = 6s²',
        worded: 'Surface Area = 6 × side × side',
        substitute: (d) => `6 × ${round(d.side)} × ${round(d.side)}`,
        unit: 'cm²',
        explorer: (val) => `The outside covers ${Math.round(val)} little squares!`,
      },
    },

    // Three.js geometry type
    geometryType: 'box',
    getGeometryArgs: (d) => [d.side, d.side, d.side],

    // Net unfolding type
    netType: 'cube-net',
    ahaAnimation: 'unitCubeFill',

    challenges: [
      'Can you make a cube with volume exactly 27 cm³?',
      'What happens to the volume when you double the side?',
      'Can you find a side length where Volume = Surface Area (numerically)?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CUBOID (Rectangular Prism)
  // ═══════════════════════════════════════════════════════════════════
  cuboid: {
    id: 'cuboid',
    name: 'Cuboid',
    emoji: '📦',
    accentColor: '#3b82f6',
    gradeRange: [4, 7],
    teaser: 'What if all three sides are different?',
    realWorldExamples: ['shoebox', 'book', 'brick', 'phone'],

    dimensions: [
      {
        key: 'length',
        label: 'Length',
        symbol: 'l',
        axis: 'x',
        color: '#ef4444',
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.length / 2, 0, d.width / 2 + 0.4],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 3,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.length / 2 + 0.4, d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'width',
        label: 'Width',
        symbol: 'w',
        axis: 'z',
        color: '#3b82f6',
        default: 2,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.length / 2 + 0.4, 0, d.width / 2],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    derived: {},

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => d.length * d.width * d.height,
        symbolic: 'V = l × w × h',
        worded: 'Volume = length × width × height',
        substitute: (d) => `${round(d.length)} × ${round(d.width)} × ${round(d.height)}`,
        unit: 'cm³',
        explorer: (val) => `This box can hold ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) =>
          2 * (d.length * d.width + d.width * d.height + d.height * d.length),
        symbolic: 'SA = 2(lw + wh + hl)',
        worded: 'Surface Area = 2 × (l×w + w×h + h×l)',
        substitute: (d) =>
          `2 × (${round(d.length)}×${round(d.width)} + ${round(d.width)}×${round(d.height)} + ${round(d.height)}×${round(d.length)})`,
        unit: 'cm²',
        explorer: (val) => `The outside covers ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'box',
    getGeometryArgs: (d) => [d.length, d.height, d.width],

    netType: 'cuboid-net',
    ahaAnimation: 'unitCubeFill',

    challenges: [
      'Make a box with volume exactly 24 cm³ — how many ways can you do it?',
      'Can you make a cuboid with the same volume but different surface area?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CYLINDER
  // ═══════════════════════════════════════════════════════════════════
  cylinder: {
    id: 'cylinder',
    name: 'Cylinder',
    emoji: '🥫',
    accentColor: '#8b5cf6',
    gradeRange: [6, 9],
    teaser: 'A circle stretched into 3D — how much fits inside?',
    realWorldExamples: ['can', 'pipe', 'candle', 'water bottle'],

    dimensions: [
      {
        key: 'radius',
        label: 'Radius',
        symbol: 'r',
        axis: 'x',
        color: '#a855f7',
        default: 2,
        min: 0.5,
        max: 5,
        step: 0.25,
        getHandlePos: (d) => [d.radius, -d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.radius + 0.4, d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    derived: {},

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => PI * d.radius ** 2 * d.height,
        symbolic: 'V = πr²h',
        worded: 'Volume = π × radius² × height',
        substitute: (d) =>
          `π × ${round(d.radius)}² × ${round(d.height)}`,
        unit: 'cm³',
        explorer: (val) => `This cylinder holds about ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 2 * PI * d.radius * (d.radius + d.height),
        symbolic: 'SA = 2πr(r + h)',
        worded: 'Surface Area = 2 × π × r × (r + h)',
        substitute: (d) =>
          `2 × π × ${round(d.radius)} × (${round(d.radius)} + ${round(d.height)})`,
        unit: 'cm²',
        explorer: (val) => `The outside covers about ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'cylinder',
    getGeometryArgs: (d) => [d.radius, d.radius, d.height, 32],

    netType: 'cylinder-net',
    ahaAnimation: 'cylinderCrossSection',

    challenges: [
      'Can you make a cylinder with the same volume as a 3×3×3 cube?',
      'What happens to volume when you double the radius vs. double the height?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPHERE
  // ═══════════════════════════════════════════════════════════════════
  sphere: {
    id: 'sphere',
    name: 'Sphere',
    emoji: '🏀',
    accentColor: '#10b981',
    gradeRange: [6, 9],
    teaser: 'The perfect round shape — no edges, no corners.',
    realWorldExamples: ['ball', 'globe', 'orange', 'marble'],

    dimensions: [
      {
        key: 'radius',
        label: 'Radius',
        symbol: 'r',
        axis: 'x',
        color: '#10b981',
        default: 3,
        min: 0.5,
        max: 6,
        step: 0.25,
        getHandlePos: (d) => [d.radius, 0, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
    ],

    derived: {
      diameter: {
        label: 'Diameter',
        symbol: 'd',
        compute: (d) => d.radius * 2,
      },
    },

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => (4 / 3) * PI * d.radius ** 3,
        symbolic: 'V = ⁴⁄₃πr³',
        worded: 'Volume = ⁴⁄₃ × π × radius³',
        substitute: (d) =>
          `⁴⁄₃ × π × ${round(d.radius)}³`,
        unit: 'cm³',
        explorer: (val) => `This sphere holds about ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 4 * PI * d.radius ** 2,
        symbolic: 'SA = 4πr²',
        worded: 'Surface Area = 4 × π × radius²',
        substitute: (d) =>
          `4 × π × ${round(d.radius)}²`,
        unit: 'cm²',
        explorer: (val) => `The outside covers about ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'sphere',
    getGeometryArgs: (d) => [d.radius, 32, 32],

    netType: null, // Spheres don't unfold into a flat net
    ahaAnimation: 'sphereOrangePeel',

    challenges: [
      'What radius gives a sphere with volume ≈ 100 cm³?',
      'Does doubling the radius double the volume? Test it!',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONE
  // ═══════════════════════════════════════════════════════════════════
  cone: {
    id: 'cone',
    name: 'Cone',
    emoji: '🍦',
    accentColor: '#f59e0b',
    gradeRange: [8, 10],
    teaser: 'One-third of a cylinder — but why exactly one-third?',
    realWorldExamples: ['party hat', 'ice cream cone', 'traffic cone', 'funnel'],

    dimensions: [
      {
        key: 'radius',
        label: 'Radius',
        symbol: 'r',
        axis: 'x',
        color: '#f59e0b',
        default: 2,
        min: 0.5,
        max: 5,
        step: 0.25,
        getHandlePos: (d) => [d.radius, -d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [0.4, d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    derived: {
      slantHeight: {
        label: 'Slant Height',
        symbol: 'l',
        compute: (d) => sqrt(d.radius ** 2 + d.height ** 2),
        color: '#a855f7',
      },
    },

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => (1 / 3) * PI * d.radius ** 2 * d.height,
        symbolic: 'V = ⅓πr²h',
        worded: 'Volume = ⅓ × π × radius² × height',
        substitute: (d) =>
          `⅓ × π × ${round(d.radius)}² × ${round(d.height)}`,
        unit: 'cm³',
        explorer: (val) => `This cone holds about ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const l = sqrt(d.radius ** 2 + d.height ** 2);
          return PI * d.radius * (d.radius + l);
        },
        symbolic: 'SA = πr(r + l)',
        worded: 'Surface Area = π × r × (r + slant height)',
        substitute: (d) => {
          const l = round(sqrt(d.radius ** 2 + d.height ** 2));
          return `π × ${round(d.radius)} × (${round(d.radius)} + ${l})`;
        },
        unit: 'cm²',
        explorer: (val) => `The outside covers about ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'cone',
    getGeometryArgs: (d) => [d.radius, d.height, 32],

    netType: 'cone-net',
    ahaAnimation: 'coneVsCylinderPour',

    challenges: [
      'Make a cone and cylinder with the same base and height. Compare volumes!',
      'What happens to slant height as you increase radius but keep height the same?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRIANGLE (2D shape — area, not volume)
  // ═══════════════════════════════════════════════════════════════════
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    emoji: '📐',
    accentColor: '#14b8a6',
    gradeRange: [3, 8],
    teaser: 'Three sides, three angles — half a rectangle\'s area!',
    realWorldExamples: ['roof', 'pizza slice', 'yield sign', 'sail'],
    is2D: true,

    dimensions: [
      {
        key: 'base',
        label: 'Base',
        symbol: 'b',
        axis: 'x',
        color: '#ef4444',
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.base / 2, 0, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 3,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [0, d.height, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
    ],

    derived: {
      sideLength: {
        label: 'Equal Side',
        symbol: 'a',
        compute: (d) => sqrt((d.base / 2) ** 2 + d.height ** 2),
      },
      perimeter: {
        label: 'Perimeter',
        symbol: 'P',
        compute: (d) => d.base + 2 * sqrt((d.base / 2) ** 2 + d.height ** 2),
      },
    },

    formulas: {
      area: {
        label: 'Area',
        compute: (d) => 0.5 * d.base * d.height,
        symbolic: 'A = ½bh',
        worded: 'Area = ½ × base × height',
        substitute: (d) => `½ × ${round(d.base)} × ${round(d.height)}`,
        unit: 'cm²',
        explorer: (val) => `This triangle covers ${round(val)} little squares!`,
      },
      perimeter: {
        label: 'Perimeter',
        compute: (d) => d.base + 2 * sqrt((d.base / 2) ** 2 + d.height ** 2),
        symbolic: 'P = b + 2a',
        worded: 'Perimeter = base + 2 × side',
        substitute: (d) => {
          const a = round(sqrt((d.base / 2) ** 2 + d.height ** 2));
          return `${round(d.base)} + 2 × ${a}`;
        },
        unit: 'cm',
        explorer: (val) => `Walking around this triangle is ${round(val)} cm!`,
      },
    },

    geometryType: 'triangle',
    getGeometryArgs: (d) => [d.base, d.height],

    netType: null,
    ahaAnimation: 'triangleHalfRect',

    challenges: [
      'Can you make a triangle with area exactly 6 cm²?',
      'What base and height give the biggest area with perimeter = 12?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PYRAMID (square base)
  // ═══════════════════════════════════════════════════════════════════
  pyramid: {
    id: 'pyramid',
    name: 'Pyramid',
    emoji: '🔺',
    accentColor: '#f97316',
    gradeRange: [8, 10],
    teaser: 'One-third of a prism — the ancient Egyptians\' favorite shape.',
    realWorldExamples: ['Egyptian pyramid', 'tent', 'roof top', 'cheese wedge'],

    dimensions: [
      {
        key: 'baseSide',
        label: 'Base Side',
        symbol: 'a',
        axis: 'x',
        color: '#ef4444',
        default: 3,
        min: 1,
        max: 8,
        step: 0.5,
        getHandlePos: (d) => [d.baseSide / 2, -d.height / 2, d.baseSide / 2 + 0.3],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [0.4, d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    derived: {
      slantHeight: {
        label: 'Slant Height',
        symbol: 'l',
        compute: (d) => sqrt((d.baseSide / 2) ** 2 + d.height ** 2),
      },
    },

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => (1 / 3) * d.baseSide ** 2 * d.height,
        symbolic: 'V = ⅓a²h',
        worded: 'Volume = ⅓ × base² × height',
        substitute: (d) =>
          `⅓ × ${round(d.baseSide)}² × ${round(d.height)}`,
        unit: 'cm³',
        explorer: (val) => `This pyramid holds about ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const l = sqrt((d.baseSide / 2) ** 2 + d.height ** 2);
          return d.baseSide ** 2 + 2 * d.baseSide * l;
        },
        symbolic: 'SA = a² + 2al',
        worded: 'Surface Area = base² + 2 × base × slant height',
        substitute: (d) => {
          const l = round(sqrt((d.baseSide / 2) ** 2 + d.height ** 2));
          return `${round(d.baseSide)}² + 2 × ${round(d.baseSide)} × ${l}`;
        },
        unit: 'cm²',
        explorer: (val) => `The outside covers about ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'pyramid',
    getGeometryArgs: (d) => [d.baseSide, d.height],

    netType: 'pyramid-net',
    ahaAnimation: 'pyramidVsPrism',

    challenges: [
      'A pyramid is ⅓ of a prism — make one of each with the same base to verify!',
      'What baseSide and height give volume = 12 cm³?',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PRISM (triangular base)
  // ═══════════════════════════════════════════════════════════════════
  prism: {
    id: 'prism',
    name: 'Triangular Prism',
    emoji: '🔷',
    accentColor: '#06b6d4',
    gradeRange: [8, 10],
    teaser: 'A triangle stretched into 3D — the general prism idea.',
    realWorldExamples: ['Toblerone box', 'tent', 'ramp', 'wedge'],

    dimensions: [
      {
        key: 'base',
        label: 'Base',
        symbol: 'b',
        axis: 'x',
        color: '#ef4444',
        default: 3,
        min: 1,
        max: 8,
        step: 0.5,
        getHandlePos: (d) => [d.base / 2, -d.triHeight / 2, d.length / 2 + 0.4],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'triHeight',
        label: 'Tri. Height',
        symbol: 'tₕ',
        axis: 'y',
        color: '#22c55e',
        default: 2.5,
        min: 1,
        max: 8,
        step: 0.5,
        getHandlePos: (d) => [0, d.triHeight / 2, d.length / 2 + 0.4],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
      {
        key: 'length',
        label: 'Length',
        symbol: 'l',
        axis: 'z',
        color: '#3b82f6',
        default: 5,
        min: 1,
        max: 10,
        step: 0.5,
        getHandlePos: (d) => [d.base / 2 + 0.4, 0, d.length / 2],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],

    derived: {
      triSide: {
        label: 'Triangle Side',
        symbol: 'a',
        compute: (d) => sqrt((d.base / 2) ** 2 + d.triHeight ** 2),
      },
    },

    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => 0.5 * d.base * d.triHeight * d.length,
        symbolic: 'V = ½ × b × tₕ × l',
        worded: 'Volume = ½ × base × tri.height × length',
        substitute: (d) =>
          `½ × ${round(d.base)} × ${round(d.triHeight)} × ${round(d.length)}`,
        unit: 'cm³',
        explorer: (val) => `This prism holds about ${Math.round(val)} little cubes!`,
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const triSide = sqrt((d.base / 2) ** 2 + d.triHeight ** 2);
          const triArea = 0.5 * d.base * d.triHeight;
          return 2 * triArea + d.base * d.length + 2 * triSide * d.length;
        },
        symbolic: 'SA = 2A△ + bl + 2al',
        worded: 'SA = 2×triangle area + base×length + 2×side×length',
        substitute: (d) => {
          const a = round(sqrt((d.base / 2) ** 2 + d.triHeight ** 2));
          const triA = round(0.5 * d.base * d.triHeight);
          return `2×${triA} + ${round(d.base)}×${round(d.length)} + 2×${a}×${round(d.length)}`;
        },
        unit: 'cm²',
        explorer: (val) => `The outside covers about ${Math.round(val)} little squares!`,
      },
    },

    geometryType: 'prism',
    getGeometryArgs: (d) => [d.base, d.triHeight, d.length],

    netType: 'prism-net',
    ahaAnimation: 'prismBaseTimesHeight',

    challenges: [
      'Volume = base area × length. Verify by changing only the length!',
      'Can you make a prism with the same volume as a 3×3×3 cube?',
    ],
  },
};

// ─── HELPER: get default dimensions for a shape ─────────────────────
export function getDefaultDimensions(shapeId) {
  const config = shapeConfig[shapeId];
  if (!config) return {};
  const dims = {};
  config.dimensions.forEach((d) => {
    dims[d.key] = d.default;
  });
  return dims;
}

// ─── HELPER: compute all formula results ────────────────────────────
export function computeAllFormulas(shapeId, dimensions) {
  const config = shapeConfig[shapeId];
  if (!config) return {};
  const results = {};
  Object.entries(config.formulas).forEach(([key, formula]) => {
    results[key] = formula.compute(dimensions);
  });
  return results;
}

// ─── HELPER: compute all derived values ─────────────────────────────
export function computeDerived(shapeId, dimensions) {
  const config = shapeConfig[shapeId];
  if (!config || !config.derived) return {};
  const results = {};
  Object.entries(config.derived).forEach(([key, d]) => {
    results[key] = d.compute(dimensions);
  });
  return results;
}

// ─── HELPER: get next/prev shape ────────────────────────────────────
export function getAdjacentShapes(shapeId) {
  const idx = SHAPES_ORDER.indexOf(shapeId);
  return {
    prev: idx > 0 ? SHAPES_ORDER[idx - 1] : null,
    next: idx < SHAPES_ORDER.length - 1 ? SHAPES_ORDER[idx + 1] : null,
  };
}

// ─── HELPER: filter shapes by grade ─────────────────────────────────
export function filterShapesByGrade(gradeFilter) {
  if (gradeFilter === 'all') return SHAPES_ORDER;
  const rangeMap = {
    elementary: [3, 5],
    standard: [6, 8],
    advanced: [9, 10],
  };
  const [lo, hi] = rangeMap[gradeFilter] || [3, 10];
  return SHAPES_ORDER.filter((id) => {
    const [sLo, sHi] = shapeConfig[id].gradeRange;
    // Shape overlaps with the filter range
    return sLo <= hi && sHi >= lo;
  });
}
