/**
 * useAppStore.js
 * ═══════════════════════════════════════════════════════════════
 * Ultra-simple, clean global store for Math in Motion.
 * ═══════════════════════════════════════════════════════════════
 */
import { create } from 'zustand';
import sound from '../utils/soundEffects';

const useAppStore = create((set, get) => ({
  // null = Shape Gallery, string = 'cube' | 'cylinder' etc.
  currentShape: null,
  showBlocks: false,
  soundEnabled: true,

  setCurrentShape: (shapeId) => {
    sound.playPop();
    set({ currentShape: shapeId, showBlocks: false });
  },

  goHome: () => {
    sound.playPop();
    set({ currentShape: null, showBlocks: false });
  },

  toggleBlocks: () => {
    sound.playPop();
    set((s) => ({ showBlocks: !s.showBlocks }));
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.setEnabled(next);
    set({ soundEnabled: next });
    if (next) sound.playPop();
  },
}));

export default useAppStore;
