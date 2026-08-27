/**
 * shapeConfig.js
 * ═══════════════════════════════════════════════════════════════════
 * THE SINGLE SOURCE OF TRUTH for every shape in Math in Motion.
 * 12 Shapes: Cube, Cuboid, Cylinder, Sphere, Cone, Triangle,
 * Pyramid, Prism, Hemisphere, Hexagonal Prism, Octahedron, Torus.
 * ═══════════════════════════════════════════════════════════════════
 */

const PI = Math.PI;
const sqrt = Math.sqrt;
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

// ─── 12 SHAPES ORDER ──────────────────────────────────────────────
export const SHAPES_ORDER = [
  'cube',
  'cuboid',
  'cylinder',
  'sphere',
  'cone',
  'pyramid',
  'prism',
  'hemisphere',
  'hexagonal_prism',
  'octahedron',
  'torus',
  'triangle',
];

export const shapeConfig = {
  // ─── 1. CUBE ───────────────────────────────────────────────────
  cube: {
    id: 'cube',
    name: 'Cube',
    emoji: '🧊',
    accentColor: '#f43f5e',
    gradeRange: [3, 6],
    teaser: 'How much space is inside a perfect box?',
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
        getHandlePos: (d) => [d.side / 2, 0, d.side / 2 + 0.4],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],
    derived: {},
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => d.side ** 3,
        symbolic: 'V = s³',
        worded: 'Volume = side × side × side',
        substitute: (d) => `${round(d.side)} × ${round(d.side)} × ${round(d.side)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 6 * d.side ** 2,
        symbolic: 'SA = 6s²',
        worded: 'Surface Area = 6 × side²',
        substitute: (d) => `6 × ${round(d.side)}²`,
        unit: 'cm²',
      },
    },
    geometryType: 'box',
    getGeometryArgs: (d) => [d.side, d.side, d.side],
  },

  // ─── 2. CUBOID ─────────────────────────────────────────────────
  cuboid: {
    id: 'cuboid',
    name: 'Cuboid',
    emoji: '📦',
    accentColor: '#0284c7',
    gradeRange: [4, 7],
    teaser: 'What if all three sides are different?',
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
        color: '#0284c7',
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
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 2 * (d.length * d.width + d.width * d.height + d.height * d.length),
        symbolic: 'SA = 2(lw + wh + hl)',
        worded: 'Surface Area = 2 × (lw + wh + hl)',
        substitute: (d) => `2 × (${round(d.length)}×${round(d.width)} + ...)`,
        unit: 'cm²',
      },
    },
    geometryType: 'box',
    getGeometryArgs: (d) => [d.length, d.height, d.width],
  },

  // ─── 3. CYLINDER ───────────────────────────────────────────────
  cylinder: {
    id: 'cylinder',
    name: 'Cylinder',
    emoji: '🥫',
    accentColor: '#8b5cf6',
    gradeRange: [6, 9],
    teaser: 'A circle stretched into 3D — like a soda can!',
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
        substitute: (d) => `π × ${round(d.radius)}² × ${round(d.height)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 2 * PI * d.radius * (d.radius + d.height),
        symbolic: 'SA = 2πr(r + h)',
        worded: 'Surface Area = 2πr × (r + h)',
        substitute: (d) => `2π × ${round(d.radius)} × (${round(d.radius)} + ${round(d.height)})`,
        unit: 'cm²',
      },
    },
    geometryType: 'cylinder',
    getGeometryArgs: (d) => [d.radius, d.radius, d.height, 32],
  },

  // ─── 4. SPHERE ─────────────────────────────────────────────────
  sphere: {
    id: 'sphere',
    name: 'Sphere',
    emoji: '🏀',
    accentColor: '#10b981',
    gradeRange: [6, 9],
    teaser: 'The perfectly round bouncy ball — no corners!',
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
        substitute: (d) => `⁴⁄₃ × π × ${round(d.radius)}³`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 4 * PI * d.radius ** 2,
        symbolic: 'SA = 4πr²',
        worded: 'Surface Area = 4 × π × radius²',
        substitute: (d) => `4 × π × ${round(d.radius)}²`,
        unit: 'cm²',
      },
    },
    geometryType: 'sphere',
    getGeometryArgs: (d) => [d.radius, 32, 32],
  },

  // ─── 5. CONE ───────────────────────────────────────────────────
  cone: {
    id: 'cone',
    name: 'Cone',
    emoji: '🍦',
    accentColor: '#f59e0b',
    gradeRange: [8, 10],
    teaser: 'Exactly one-third of a cylinder!',
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
        substitute: (d) => `⅓ × π × ${round(d.radius)}² × ${round(d.height)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const l = sqrt(d.radius ** 2 + d.height ** 2);
          return PI * d.radius * (d.radius + l);
        },
        symbolic: 'SA = πr(r + l)',
        worded: 'Surface Area = πr × (r + slant)',
        substitute: (d) => `π × ${round(d.radius)} × (${round(d.radius)} + slant)`,
        unit: 'cm²',
      },
    },
    geometryType: 'cone',
    getGeometryArgs: (d) => [d.radius, d.height, 32],
  },

  // ─── 6. PYRAMID ────────────────────────────────────────────────
  pyramid: {
    id: 'pyramid',
    name: 'Pyramid',
    emoji: '🔺',
    accentColor: '#ea580c',
    gradeRange: [8, 10],
    teaser: 'One-third of a prism — the ancient Egyptian favorite!',
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
        substitute: (d) => `⅓ × ${round(d.baseSide)}² × ${round(d.height)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const l = sqrt((d.baseSide / 2) ** 2 + d.height ** 2);
          return d.baseSide ** 2 + 2 * d.baseSide * l;
        },
        symbolic: 'SA = a² + 2al',
        worded: 'Surface Area = base² + 2 × base × slant',
        substitute: (d) => `${round(d.baseSide)}² + 2 × ${round(d.baseSide)} × slant`,
        unit: 'cm²',
      },
    },
    geometryType: 'pyramid',
    getGeometryArgs: (d) => [d.baseSide, d.height],
  },

  // ─── 7. TRIANGULAR PRISM ──────────────────────────────────────
  prism: {
    id: 'prism',
    name: 'Triangular Prism',
    emoji: '🔷',
    accentColor: '#06b6d4',
    gradeRange: [8, 10],
    teaser: 'A triangle stretched into 3D — like a Toblerone box!',
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
    derived: {},
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => 0.5 * d.base * d.triHeight * d.length,
        symbolic: 'V = ½ × b × tₕ × l',
        worded: 'Volume = ½ × base × tri.height × length',
        substitute: (d) => `½ × ${round(d.base)} × ${round(d.triHeight)} × ${round(d.length)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => {
          const triSide = sqrt((d.base / 2) ** 2 + d.triHeight ** 2);
          const triArea = 0.5 * d.base * d.triHeight;
          return 2 * triArea + d.base * d.length + 2 * triSide * d.length;
        },
        symbolic: 'SA = 2A△ + perimeter × length',
        worded: 'Surface Area = 2 × Triangle + 3 × Rectangles',
        substitute: (d) => `2 × (½ × ${round(d.base)} × ${round(d.triHeight)}) + ...`,
        unit: 'cm²',
      },
    },
    geometryType: 'prism',
    getGeometryArgs: (d) => [d.base, d.triHeight, d.length],
  },

  // ─── 8. HEMISPHERE (NEW) ──────────────────────────────────────
  hemisphere: {
    id: 'hemisphere',
    name: 'Hemisphere',
    emoji: '🛖',
    accentColor: '#14b8a6',
    gradeRange: [6, 9],
    teaser: 'Half of a sphere — like an igloo, bowl, or planetarium dome!',
    dimensions: [
      {
        key: 'radius',
        label: 'Radius',
        symbol: 'r',
        axis: 'x',
        color: '#14b8a6',
        default: 2.8,
        min: 1,
        max: 6,
        step: 0.25,
        getHandlePos: (d) => [d.radius, 0, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
    ],
    derived: {},
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => (2 / 3) * PI * d.radius ** 3,
        symbolic: 'V = ⅔πr³',
        worded: 'Volume = ⅔ × π × radius³',
        substitute: (d) => `⅔ × π × ${round(d.radius)}³`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Total Surface Area',
        compute: (d) => 3 * PI * d.radius ** 2,
        symbolic: 'SA = 3πr²',
        worded: 'Surface Area = 2πr² (dome) + πr² (base circle)',
        substitute: (d) => `3 × π × ${round(d.radius)}²`,
        unit: 'cm²',
      },
    },
    geometryType: 'hemisphere',
    getGeometryArgs: (d) => [d.radius, 32, 16],
  },

  // ─── 9. HEXAGONAL PRISM (NEW) ─────────────────────────────────
  hexagonal_prism: {
    id: 'hexagonal_prism',
    name: 'Hex Prism',
    emoji: '✏️',
    accentColor: '#f59e0b',
    gradeRange: [7, 10],
    teaser: 'Six-sided polygon stretched tall — like a wooden pencil or honeycomb!',
    dimensions: [
      {
        key: 'side',
        label: 'Hex Side',
        symbol: 's',
        axis: 'x',
        color: '#ef4444',
        default: 2,
        min: 1,
        max: 5,
        step: 0.25,
        getHandlePos: (d) => [d.side, -d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
      {
        key: 'height',
        label: 'Height',
        symbol: 'h',
        axis: 'y',
        color: '#22c55e',
        default: 4.5,
        min: 1,
        max: 8,
        step: 0.5,
        getHandlePos: (d) => [d.side + 0.4, d.height / 2, 0],
        valueFromAxisPos: (axisVal) => axisVal * 2,
      },
    ],
    derived: {
      baseArea: {
        label: 'Hex Base Area',
        symbol: 'A_hex',
        compute: (d) => ((3 * sqrt(3)) / 2) * d.side ** 2,
      },
    },
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => ((3 * sqrt(3)) / 2) * d.side ** 2 * d.height,
        symbolic: 'V = (³√³⁄₂)s²h',
        worded: 'Volume = Hex Base Area × Height',
        substitute: (d) => `(${round(((3 * sqrt(3)) / 2) * d.side ** 2)}) × ${round(d.height)}`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 3 * sqrt(3) * d.side ** 2 + 6 * d.side * d.height,
        symbolic: 'SA = 3√3s² + 6sh',
        worded: 'Surface Area = 2 × Hexagon + 6 × Rectangles',
        substitute: (d) => `2 × HexArea + 6 × (${round(d.side)} × ${round(d.height)})`,
        unit: 'cm²',
      },
    },
    geometryType: 'hexagonal_prism',
    getGeometryArgs: (d) => [d.side, d.height],
  },

  // ─── 10. OCTAHEDRON (NEW) ─────────────────────────────────────
  octahedron: {
    id: 'octahedron',
    name: 'Octahedron',
    emoji: '💎',
    accentColor: '#a855f7',
    gradeRange: [7, 10],
    teaser: 'Eight equilateral triangular faces — a sparkling diamond crystal!',
    dimensions: [
      {
        key: 'edge',
        label: 'Edge Length',
        symbol: 'a',
        axis: 'x',
        color: '#a855f7',
        default: 3,
        min: 1,
        max: 6,
        step: 0.5,
        getHandlePos: (d) => [d.edge / sqrt(2), 0, 0],
        valueFromAxisPos: (axisVal) => axisVal * sqrt(2),
      },
    ],
    derived: {},
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => (sqrt(2) / 3) * d.edge ** 3,
        symbolic: 'V = (√2⁄3)a³',
        worded: 'Volume = (√2 ÷ 3) × edge³',
        substitute: (d) => `(√2 ÷ 3) × ${round(d.edge)}³`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 2 * sqrt(3) * d.edge ** 2,
        symbolic: 'SA = 2√3a²',
        worded: 'Surface Area = 8 × Triangle Area',
        substitute: (d) => `8 × (¼√3 × ${round(d.edge)}²)`,
        unit: 'cm²',
      },
    },
    geometryType: 'octahedron',
    getGeometryArgs: (d) => [d.edge / sqrt(2)],
  },

  // ─── 11. TORUS (NEW) ──────────────────────────────────────────
  torus: {
    id: 'torus',
    name: 'Torus',
    emoji: '🍩',
    accentColor: '#ec4899',
    gradeRange: [8, 10],
    teaser: 'The delicious donut ring — rotating a circle around a ring!',
    dimensions: [
      {
        key: 'majorRadius',
        label: 'Ring Radius',
        symbol: 'R',
        axis: 'x',
        color: '#ec4899',
        default: 3,
        min: 1.5,
        max: 6,
        step: 0.25,
        getHandlePos: (d) => [d.majorRadius, 0, 0],
        valueFromAxisPos: (axisVal) => axisVal,
      },
      {
        key: 'tubeRadius',
        label: 'Tube Radius',
        symbol: 'r',
        axis: 'y',
        color: '#3b82f6',
        default: 1,
        min: 0.3,
        max: 2,
        step: 0.1,
        getHandlePos: (d) => [d.majorRadius + d.tubeRadius, 0, 0],
        valueFromAxisPos: (axisVal) => Math.max(0.3, axisVal - 3),
      },
    ],
    derived: {},
    formulas: {
      volume: {
        label: 'Volume',
        compute: (d) => 2 * PI ** 2 * d.majorRadius * d.tubeRadius ** 2,
        symbolic: 'V = 2π²Rr²',
        worded: 'Volume = 2 × π² × Ring Radius × Tube Radius²',
        substitute: (d) => `2π² × ${round(d.majorRadius)} × ${round(d.tubeRadius)}²`,
        unit: 'cm³',
      },
      surfaceArea: {
        label: 'Surface Area',
        compute: (d) => 4 * PI ** 2 * d.majorRadius * d.tubeRadius,
        symbolic: 'SA = 4π²Rr',
        worded: 'Surface Area = 4 × π² × Ring Radius × Tube Radius',
        substitute: (d) => `4π² × ${round(d.majorRadius)} × ${round(d.tubeRadius)}`,
        unit: 'cm²',
      },
    },
    geometryType: 'torus',
    getGeometryArgs: (d) => [d.majorRadius, d.tubeRadius, 16, 36],
  },

  // ─── 12. TRIANGLE (2D) ─────────────────────────────────────────
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    emoji: '📐',
    accentColor: '#14b8a6',
    gradeRange: [3, 8],
    teaser: 'Three sides, three angles — half a rectangle\'s area!',
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
    },
    formulas: {
      area: {
        label: 'Area',
        compute: (d) => 0.5 * d.base * d.height,
        symbolic: 'A = ½bh',
        worded: 'Area = ½ × base × height',
        substitute: (d) => `½ × ${round(d.base)} × ${round(d.height)}`,
        unit: 'cm²',
      },
      perimeter: {
        label: 'Perimeter',
        compute: (d) => d.base + 2 * sqrt((d.base / 2) ** 2 + d.height ** 2),
        symbolic: 'P = b + 2a',
        worded: 'Perimeter = base + 2 × side',
        substitute: (d) => `${round(d.base)} + 2 × side`,
        unit: 'cm',
      },
    },
    geometryType: 'triangle',
    getGeometryArgs: (d) => [d.base, d.height],
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
    return sLo <= hi && sHi >= lo;
  });
}
