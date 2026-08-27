/**
 * TrophyModal.jsx
 * ═══════════════════════════════════════════════════════════════
 * Sunny & Cheerful 3D Toy Skin Shop & Trophy Room for Kids.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore, { computePlayerLevel } from '../../store/useAppStore';
import { SHAPE_SKINS } from '../../data/skinsConfig';
import sound from '../../utils/soundEffects';

const BADGES_LIST = [
  { id: 'first_drag', name: 'First Touch', emoji: '👆', desc: 'Manipulated your first 3D dimension handle.' },
  { id: 'master-cube', name: 'Cube Master', emoji: '🧊', desc: 'Matched target volume on the Cube.' },
  { id: 'master-cylinder', name: 'Cylinder Star', emoji: '🥫', desc: 'Matched target volume on the Cylinder.' },
  { id: 'master-sphere', name: 'Sphere Champion', emoji: '🏀', desc: 'Mastered spherical geometry.' },
  { id: 'master-cone', name: 'Cone Expert', emoji: '🍦', desc: 'Discovered the ⅓ cone-to-cylinder relationship.' },
  { id: 'master-pyramid', name: 'Pyramid Builder', emoji: '🔺', desc: 'Constructed an ancient pyramid.' },
  { id: 'master-prism', name: 'Prism Pro', emoji: '🔷', desc: 'Mastered triangular prism volume.' },
  { id: 'master-triangle', name: 'Triangle Titan', emoji: '📐', desc: 'Perfected 2D base × height calculations.' },
  { id: 'streak_3', name: 'Triple Streak', emoji: '🔥', desc: 'Hit 3 target matches in a row!' },
  { id: 'quest_5', name: 'Adventurer', emoji: '🗺️', desc: 'Completed 5 adventure quests!' },
  { id: 'skin_collector', name: 'Style Star', emoji: '✨', desc: 'Unlocked your first 3D toy skin!' },
  { id: 'grand_geometer', name: 'Grand Geometer', emoji: '🎓', desc: 'Reached player level 10!' },
];

export default function TrophyModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('skins'); // 'skins' | 'badges' | 'stats'
  const player = useAppStore((s) => s.player);
  const activeSkin = useAppStore((s) => s.activeSkin);
  const unlockSkin = useAppStore((s) => s.unlockSkin);
  const setSkin = useAppStore((s) => s.setSkin);
  const earnBadge = useAppStore((s) => s.earnBadge);

  if (!isOpen) return null;

  const levelInfo = computePlayerLevel(player.xp);

  const handleSkinClick = (skin) => {
    const isUnlocked = player.unlockedSkins.includes(skin.id);
    if (isUnlocked) {
      setSkin(skin.id);
    } else {
      const success = unlockSkin(skin.id, skin.cost);
      if (success) {
        earnBadge('skin_collector');
      } else {
        sound.playError();
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'page-in 0.25s ease',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        borderRadius: '24px',
        background: '#ffffff',
        border: '2px solid #e2e8f0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1.5px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '1.35rem',
              margin: '0 0 0.2rem',
              color: '#0f172a',
            }}>
              🎨 3D Toy Skins & Trophies
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              Level {levelInfo.level} · {levelInfo.title} · <span style={{ color: '#059669', fontWeight: 800 }}>{player.gems} 💎 Gems</span>
            </div>
          </div>

          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            style={{ borderRadius: '50%', width: '34px', height: '34px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.6rem 1.5rem',
          borderBottom: '1.5px solid #e2e8f0',
          background: '#ffffff',
        }}>
          <button
            className={`btn btn-sm ${activeTab === 'skins' ? 'btn-accent' : ''}`}
            onClick={() => {
              sound.playPop();
              setActiveTab('skins');
            }}
          >
            🎨 3D Shape Skins
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'badges' ? 'btn-accent' : ''}`}
            onClick={() => {
              sound.playPop();
              setActiveTab('badges');
            }}
          >
            🎖️ Badges ({player.unlockedSkins?.length || 0})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'stats' ? 'btn-accent' : ''}`}
            onClick={() => {
              sound.playPop();
              setActiveTab('stats');
            }}
          >
            📊 Stats
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.2rem 1.5rem', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
          {/* ─── SKINS SHOP ─── */}
          {activeTab === 'skins' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.75rem',
            }}>
              {SHAPE_SKINS.map((skin) => {
                const isUnlocked = player.unlockedSkins.includes(skin.id);
                const isEquipped = activeSkin === skin.id;
                const canAfford = player.gems >= skin.cost;

                return (
                  <div
                    key={skin.id}
                    style={{
                      padding: '0.9rem',
                      borderRadius: '18px',
                      background: isEquipped ? '#eef2ff' : '#ffffff',
                      border: `2px solid ${isEquipped ? '#6366f1' : '#e2e8f0'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{skin.emoji}</span>
                        <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', color: '#0f172a' }}>
                          {skin.name}
                        </strong>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.75rem', lineHeight: 1.35 }}>
                        {skin.desc}
                      </p>
                    </div>

                    <button
                      className={`btn btn-sm ${isEquipped ? 'btn-accent' : ''}`}
                      onClick={() => handleSkinClick(skin)}
                      disabled={!isUnlocked && !canAfford}
                      style={{
                        width: '100%',
                        fontSize: '0.78rem',
                        opacity: !isUnlocked && !canAfford ? 0.5 : 1,
                      }}
                    >
                      {isEquipped ? '✓ EQUIPPED' : isUnlocked ? 'EQUIP' : `UNLOCK (${skin.cost} 💎)`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── BADGES ─── */}
          {activeTab === 'badges' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.65rem',
            }}>
              {BADGES_LIST.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{b.emoji}</span>
                  <div>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#0f172a',
                    }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── STATS ─── */}
          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '18px',
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 800, marginBottom: '0.2rem' }}>
                  LEVEL PROGRESSION
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.4rem', color: '#0f172a' }}>
                  {levelInfo.title}
                </div>
                <div style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: '#e2e8f0',
                  margin: '0.6rem 0 0.3rem',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '4px',
                    width: `${levelInfo.progressPct}%`,
                    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                  }} />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>{levelInfo.xpInLevel} XP in Level</span>
                  <span>{levelInfo.xpNeeded} XP to Next Rank</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.65rem',
                textAlign: 'center',
              }}>
                <div style={{ padding: '0.9rem', borderRadius: '16px', background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem' }}>⭐</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#d97706' }}>
                    {player.stars}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Stars</div>
                </div>

                <div style={{ padding: '0.9rem', borderRadius: '16px', background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem' }}>💎</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#059669' }}>
                    {player.gems}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Gems</div>
                </div>

                <div style={{ padding: '0.9rem', borderRadius: '16px', background: '#ffffff', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.5rem' }}>🔥</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#ea580c' }}>
                    {player.streak}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Day Streak</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
