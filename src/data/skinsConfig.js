/**
 * skinsConfig.js
 * ═══════════════════════════════════════════════════════════════
 * Custom 3D Shape Materials/Skins unlockable with Gems.
 * Gives students a fun reward economy to customize their 3D playground.
 * ═══════════════════════════════════════════════════════════════
 */

export const SHAPE_SKINS = [
  {
    id: 'default',
    name: 'Vibrant Matte',
    emoji: '🎨',
    desc: 'Clean studio plastic with soft ambient lighting.',
    cost: 0,
    unlockedByDefault: true,
    materialProps: {
      roughness: 0.35,
      metalness: 0.05,
      wireframe: false,
    },
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    emoji: '⚡',
    desc: 'Luminescent cyberpunk glow that pulses with energy.',
    cost: 30,
    unlockedByDefault: false,
    materialProps: {
      roughness: 0.1,
      metalness: 0.2,
      emissiveIntensity: 0.55,
      wireframe: false,
    },
  },
  {
    id: 'candy',
    name: 'Candy Gloss',
    emoji: '🍬',
    desc: 'Deliciously shiny, candy-coated reflective glaze.',
    cost: 50,
    unlockedByDefault: false,
    materialProps: {
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      wireframe: false,
    },
  },
  {
    id: 'hologram',
    name: 'Holo Grid',
    emoji: '🌐',
    desc: 'Futuristic architectural wireframe hologram.',
    cost: 75,
    unlockedByDefault: false,
    materialProps: {
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissiveIntensity: 0.8,
    },
  },
  {
    id: 'gold',
    name: 'Golden Master',
    emoji: '👑',
    desc: 'Pure gleaming 24K polished solid gold.',
    cost: 120,
    unlockedByDefault: false,
    materialProps: {
      colorOverride: '#fbbf24',
      roughness: 0.15,
      metalness: 0.95,
      emissive: '#78350f',
      emissiveIntensity: 0.2,
    },
  },
  {
    id: 'crystal',
    name: 'Crystal Glass',
    emoji: '💎',
    desc: 'Translucent refractive diamond glass.',
    cost: 150,
    unlockedByDefault: false,
    materialProps: {
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.65,
    },
  },
];

export function getSkinById(id) {
  return SHAPE_SKINS.find((s) => s.id === id) || SHAPE_SKINS[0];
}
