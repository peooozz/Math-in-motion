/**
 * useAppStore.js
 * ═══════════════════════════════════════════════════════════════
 * Global Zustand store with persistence, gamification stats,
 * Quest progression, Mini-games, Sound control, and Customization.
 * ═══════════════════════════════════════════════════════════════
 */
import { create } from 'zustand';
import sound from '../utils/soundEffects';

const STORAGE_KEY = 'math_in_motion_save_v1';

function loadSavedState() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      xp: state.player.xp,
      gems: state.player.gems,
      stars: state.player.stars,
      streak: state.player.streak,
      questProgress: state.player.questProgress,
      unlockedSkins: state.player.unlockedSkins,
      badges: state.progress.badges,
      shapeProgress: state.progress.shapeProgress,
      activeSkin: state.activeSkin,
      soundEnabled: state.soundEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

// ─── Level Computation from XP ─────────────────────────────
export function computePlayerLevel(xp = 0) {
  const TITLES = [
    { level: 1, xpReq: 0, title: 'Curious Novice 🐣' },
    { level: 2, xpReq: 100, title: 'Shape Explorer 🔍' },
    { level: 3, xpReq: 250, title: 'Dimension Builder 🧱' },
    { level: 4, xpReq: 450, title: 'Volume Apprentice 📦' },
    { level: 5, xpReq: 700, title: 'Area Specialist 📐' },
    { level: 6, xpReq: 1000, title: 'Curve Connoisseur 🥫' },
    { level: 7, xpReq: 1400, title: 'Sphere Master 🏀' },
    { level: 8, xpReq: 1900, title: 'Pyramid Archaeologist 🔺' },
    { level: 9, xpReq: 2500, title: 'Prism Strategist 🔷' },
    { level: 10, xpReq: 3200, title: 'Net Folding Wizard 🧩' },
    { level: 11, xpReq: 4000, title: 'Grand Geometer 🎓' },
    { level: 12, xpReq: 5000, title: 'Master of Dimensions 🌌' },
  ];

  let current = TITLES[0];
  let next = TITLES[1];

  for (let i = 0; i < TITLES.length; i++) {
    if (xp >= TITLES[i].xpReq) {
      current = TITLES[i];
      next = TITLES[i + 1] || { level: current.level + 1, xpReq: current.xpReq + 1500, title: 'Infinite Legend ⭐' };
    } else {
      break;
    }
  }

  const xpInLevel = xp - current.xpReq;
  const xpNeeded = next.xpReq - current.xpReq;
  const progressPct = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

  return {
    level: current.level,
    title: current.title,
    xp,
    xpInLevel,
    xpNeeded,
    progressPct,
    nextTitle: next.title,
  };
}

const saved = loadSavedState();

const useAppStore = create((set, get) => ({
  // ─── Navigation & Views ──────────────────────────────────
  currentShape: null, // null = homepage / map, string = 'cube' etc.
  viewMode: 'gallery', // 'gallery' | 'map'
  activeQuestId: null, // number or null
  activeSkin: saved.activeSkin || 'default',

  // ─── Audio ───────────────────────────────────────────────
  soundEnabled: saved.soundEnabled !== undefined ? saved.soundEnabled : true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.setEnabled(next);
    set({ soundEnabled: next });
    if (next) sound.playPop();
    saveState(get());
  },

  // ─── Navigation Actions ──────────────────────────────────
  setCurrentShape: (shapeId, questId = null) => {
    sound.playPop();
    const prev = get().currentShape;
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
      activeQuestId: questId,
      _shapeEnterTime: shapeId ? Date.now() : null,
    });
  },

  goHome: () => {
    sound.playPop();
    get().setCurrentShape(null, null);
  },

  setViewMode: (mode) => {
    sound.playPop();
    set({ viewMode: mode, currentShape: null });
  },

  // ─── Difficulty & Visual Modes ───────────────────────────
  difficulty: 'standard',
  setDifficulty: (d) => {
    sound.playPop();
    set({ difficulty: d });
  },

  gradeFilter: 'all',
  setGradeFilter: (f) => {
    sound.playPop();
    set({ gradeFilter: f });
  },

  showFormula: true,
  toggleFormula: () => set((s) => ({ showFormula: !s.showFormula })),

  seeInside: false,
  toggleSeeInside: () => {
    sound.playPop();
    set((s) => ({ seeInside: !s.seeInside }));
  },
  setSeeInside: (v) => set({ seeInside: v }),

  // ─── Player Economy & Gamification ───────────────────────
  player: {
    xp: saved.xp || 0,
    gems: saved.gems || 30, // starter gift!
    stars: saved.stars || 0,
    streak: saved.streak || 1,
    questProgress: saved.questProgress || {}, // { [questId]: { completed: true, stars: 3, score: 100 } }
    unlockedSkins: saved.unlockedSkins || ['default'],
  },

  addXp: (amount) => {
    const prevLevel = computePlayerLevel(get().player.xp).level;
    set((s) => {
      const nextXp = s.player.xp + amount;
      return {
        player: {
          ...s.player,
          xp: nextXp,
        },
      };
    });
    const newLevel = computePlayerLevel(get().player.xp).level;
    if (newLevel > prevLevel) {
      sound.playFanfare();
    }
    saveState(get());
  },

  addGems: (amount) => {
    sound.playCoin();
    set((s) => ({
      player: {
        ...s.player,
        gems: s.player.gems + amount,
      },
    }));
    saveState(get());
  },

  completeQuest: (questId, stars = 3, xp = 100, gems = 20) => {
    sound.playFanfare();
    set((s) => {
      const prevStars = s.player.questProgress[questId]?.stars || 0;
      const starDiff = Math.max(0, stars - prevStars);

      const nextQuestProgress = {
        ...s.player.questProgress,
        [questId]: {
          completed: true,
          stars: Math.max(prevStars, stars),
        },
      };

      return {
        player: {
          ...s.player,
          xp: s.player.xp + xp,
          gems: s.player.gems + gems,
          stars: s.player.stars + starDiff,
          questProgress: nextQuestProgress,
        },
      };
    });
    saveState(get());
  },

  unlockSkin: (skinId, cost) => {
    const { player } = get();
    if (player.gems < cost || player.unlockedSkins.includes(skinId)) return false;

    sound.playSuccess();
    set((s) => ({
      activeSkin: skinId,
      player: {
        ...s.player,
        gems: s.player.gems - cost,
        unlockedSkins: [...s.player.unlockedSkins, skinId],
      },
    }));
    saveState(get());
    return true;
  },

  setSkin: (skinId) => {
    sound.playPop();
    set({ activeSkin: skinId });
    saveState(get());
  },

  // ─── Session Progress / Badges ───────────────────────────
  progress: {
    visited: [],
    timeSpent: {},
    badges: saved.badges || [],
    shapeProgress: saved.shapeProgress || {},
  },

  earnBadge: (badge) => {
    const current = get().progress.badges;
    if (!current.includes(badge)) {
      sound.playSuccess();
      set((s) => ({
        progress: {
          ...s.progress,
          badges: [...s.progress.badges, badge],
        },
      }));
      get().addXp(50);
      get().addGems(10);
      saveState(get());
    }
  },

  setShapeProgress: (shapeId, pct) => {
    set((s) => ({
      progress: {
        ...s.progress,
        shapeProgress: {
          ...s.progress.shapeProgress,
          [shapeId]: Math.min(100, Math.max(0, pct)),
        },
      },
    }));
    saveState(get());
  },

  _shapeEnterTime: null,
}));

// Initialize sound engine state
if (typeof window !== 'undefined') {
  sound.setEnabled(useAppStore.getState().soundEnabled);
}

export default useAppStore;
