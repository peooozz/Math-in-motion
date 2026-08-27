# Math in Motion 🎲
> **Touch it. Twist it. Understand it.**

An interactive web-based 3D math learning playground where students (Grade 3–10) manipulate mathematical objects directly with live numeric readouts to build intuition for geometry concepts.

---

## ✨ Features

- **3D Shape Gallery:** Real-time animated 3D previews for 8 distinct shapes (Cube, Cuboid, Cylinder, Sphere, Cone, Triangle, Pyramid, Triangular Prism).
- **Interactive Drag Handles:** Directly stretch dimensions (length, width, height, radius) in 3D space with touch and mouse support.
- **Live Formula Card:** Math formulas with real-time numeric substitution and highlight flashing as dimensions change.
- **Multi-Tier Difficulty Modes:**
  - **Explorer 🧒 (Grade 3–5):** Visual unit-cube counting and intuitive descriptions.
  - **Builder 🧑 (Grade 6–8):** Step-by-step formula substitutions and standard units.
  - **Mathematician 🎓 (Grade 9–10):** Symbolic notation, derivations, and surface area ratios.
- **"See Inside" Cutaway:** View internal unit voxel grids inside 3D solids.
- **"Match the Volume" Mini-Game:** Gamified challenges with target volumes and confetti rewards.
- **CBSE Curriculum Aligned:** Tagged per shape and grade level.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **3D Graphics:** Three.js via `@react-three/fiber` & `@react-three/drei`
- **State Management:** Zustand
- **Animations:** GSAP & `@gsap/react`
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design System
- **Gestures:** `@use-gesture/react`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/peooozz/Math-in-motion.git
   cd Math-in-motion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Home/              # ShapeCard (3D preview), GradeFilterBar, TodaysChallengeCard
│   ├── ShapeDetail/       # ShapeStage3D, DimensionHandle, LiveDimensionsCard, LiveFormulaCard, MiniGameStrip
│   └── Shared/            # DifficultyToggle, ChallengePrompt, HUDPanel
├── data/
│   └── shapeConfig.js     # Single source of truth for all 8 shapes & formulas
├── pages/
│   ├── HomePage.jsx       # Shape gallery grid
│   └── ShapeDetailPage.jsx # Reusable data-driven 3D stage template
├── store/
│   └── useAppStore.js     # Zustand store for navigation & state
└── utils/
    ├── cameraTransitions.js
    └── geometryMath.js
```

---

## 📄 License
MIT License
