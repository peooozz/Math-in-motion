/**
 * useAppStore.js
 * Global Zustand store for Math in Motion (v2 — page-based navigation).
 */
import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ─── Navigation ─────────────────────────────────────────────
  // null = homepage, string = shapeId (e.g. 'cube', 'cylinder')
  currentShape: null,

  setCurrentShape: (shapeId) => {
    const prev = get().currentShape;
    // Track time on previous shape
    if (prev && get()._shapeEnterTime) {
      const elapsed = Date.now() - get()._shapeEnterTime;
      set((s) => ({
        progress: {
          ...s.progress,
          timeSpent: {
            ...s.progress.timeSpent,
            [prev]: (s.progress.timeSpent[prev] || 0) + elapsed,
          },
          visited: s.progress.visited.includes(prev)
            ? s.progress.visited
            : [...s.progress.visited, prev],
        },
      }));
    }
    set({
      currentShape: shapeId,
      _shapeEnterTime: shapeId ? Date.now() : null,
    });
  },

  goHome: () => get().setCurrentShape(null),

  // ─── Grade Filter (homepage) ────────────────────────────────
  gradeFilter: 'all', // 'all' | 'elementary' | 'standard' | 'advanced'
  setGradeFilter: (f) => set({ gradeFilter: f }),

  // ─── Difficulty (detail page) ───────────────────────────────
  // 'elementary' = Explorer 🧒, 'standard' = Builder 🧑, 'advanced' = Mathematician 🎓
  difficulty: 'standard',
  setDifficulty: (d) => set({ difficulty: d }),

  // ─── Formula Toggle ────────────────────────────────────────
  showFormula: true,
  toggleFormula: () => set((s) => ({ showFormula: !s.showFormula })),

  // ─── See Inside Toggle ─────────────────────────────────────
  seeInside: false,
  toggleSeeInside: () => set((s) => ({ seeInside: !s.seeInside })),
  setSeeInside: (v) => set({ seeInside: v }),

  // ─── Progress / Badges ─────────────────────────────────────
  progress: {
    visited: [],
    timeSpent: {},
    badges: [],
    shapeProgress: {}, // { shapeId: 0-100 }
  },

  earnBadge: (badge) =>
    set((s) => ({
      progress: {
        ...s.progress,
        badges: s.progress.badges.includes(badge)
          ? s.progress.badges
          : [...s.progress.badges, badge],
      },
    })),

  setShapeProgress: (shapeId, pct) =>
    set((s) => ({
      progress: {
        ...s.progress,
        shapeProgress: {
          ...s.progress.shapeProgress,
          [shapeId]: Math.min(100, Math.max(0, pct)),
        },
      },
    })),

  // ─── Internal ──────────────────────────────────────────────
  _shapeEnterTime: null,
}));

export default useAppStore;
