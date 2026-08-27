/**
 * TrophyModal.jsx
 * ═══════════════════════════════════════════════════════════════
 * Trophy Room & 3D Material / Skin Customization Shop.
 * Shows player progression, collectible badges, and allows
 * purchasing & equipping custom 3D shader skins with earned Gems.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState } from 'react';
import useAppStore, { computePlayerLevel } from '../../store/useAppStore';
import { SHAPE_SKINS } from '../../data/skinsConfig';
import sound from '../../utils/soundEffects';

const BADGES_LIST = [
  { id: 'first_drag', name: 'First Touch', emoji: '👆', desc: 'Manipulated your first 3D dimension handle.' },
  { id: 'master-cube', name: 'Cube Conqueror', emoji: '🧊', desc: 'Matched target volume on the Cube.' },
  { id: 'master-cylinder', name: 'Cylinder Captain', emoji: '🥫', desc: 'Matched target volume on the Cylinder.' },
  { id: 'master-sphere', name: 'Sphere Sovereign', emoji: '🏀', desc: 'Mastered spherical surface area & volume.' },
  { id: 'master-cone', name: 'Cone Connoisseur', emoji: '🍦', desc: 'Discovered the ⅓ cone-to-cylinder relationship.' },
  { id: 'master-pyramid', name: 'Pyramid Pharaoh', emoji: '🔺', desc: 'Constructed an ancient volume-accurate pyramid.' },
  { id: 'master-prism', name: 'Prism Prodigy', emoji: '🔷', desc: 'Mastered triangular prism volume calculations.' },
  { id: 'master-triangle', name: 'Triangle Titan', emoji: '📐', desc: 'Perfected 2D base × height calculations.' },
  { id: 'streak_3', name: 'Triple Streak', emoji: '🔥', desc: 'Hit 3 target volume matches in a row!' },
  { id: 'quest_5', name: 'Quest Adventurer', emoji: '🗺️', desc: 'Completed 5 adventure quests!' },
  { id: 'skin_collector', name: 'Style Icon', emoji: '✨', desc: 'Unlocked your first custom 3D shape skin!' },
  { id: 'grand_geometer', name: 'Grand Geometer', emoji: '🎓', desc: 'Reached player level 10 and completed the exam!' },
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
      background: 'rgba(15, 13, 26, 0.85)',
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
        background: 'linear-gradient(135deg, rgba(30, 27, 50, 0.98), rgba(15, 13, 26, 0.99))',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '1.3rem',
              margin: '0 0 0.2rem',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              🏆 Trophy Room & Skin Shop
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              Level {levelInfo.level} · {levelInfo.title} · {player.gems} 💎 Gems Available
            </div>
          </div>

          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.6rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
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
            📊 Player Stats
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.2rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {/* ─── SKINS SHOP ─── */}
          {activeTab === 'skins' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                      padding: '0.85rem',
                      borderRadius: '14px',
                      background: isEquipped
                        ? 'rgba(129, 140, 248, 0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isEquipped ? '#818cf8' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{skin.emoji}</span>
                        <strong style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem' }}>
                          {skin.name}
                        </strong>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', margin: '0 0 0.6rem', lineHeight: 1.35 }}>
                        {skin.desc}
                      </p>
                    </div>

                    <button
                      className={`btn btn-sm ${isEquipped ? 'btn-accent' : ''}`}
                      onClick={() => handleSkinClick(skin)}
                      disabled={!isUnlocked && !canAfford}
                      style={{
                        width: '100%',
                        fontSize: '0.75rem',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.6rem',
            }}>
              {BADGES_LIST.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{b.emoji}</span>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#fbbf24',
                    }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
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
                borderRadius: '14px',
                background: 'rgba(129, 140, 248, 0.08)',
                border: '1px solid rgba(129, 140, 248, 0.2)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.2rem' }}>
                  LEVEL PROGRESSION
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.4rem' }}>
                  {levelInfo.title}
                </div>
                <div style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0.6rem 0 0.3rem',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '4px',
                    width: `${levelInfo.progressPct}%`,
                    background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{levelInfo.xpInLevel} XP in Level</span>
                  <span>{levelInfo.xpNeeded} XP Needed for Next Rank</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.6rem',
                textAlign: 'center',
              }}>
                <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '1.4rem' }}>⭐</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fbbf24' }}>
                    {player.stars}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Quest Stars</div>
                </div>

                <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '1.4rem' }}>💎</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#34d399' }}>
                    {player.gems}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Gems</div>
                </div>

                <div style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '1.4rem' }}>🔥</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#f97316' }}>
                    {player.streak}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Day Streak</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
