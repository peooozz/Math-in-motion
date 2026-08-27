/**
 * QuestMapPage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Adventure Quest Level Map.
 * A visual winding path of 12 progressive learning missions
 * across 4 themed worlds with star ratings, lock states, and XP.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import { QUESTS } from '../data/questData';
import useAppStore, { computePlayerLevel } from '../store/useAppStore';
import sound from '../utils/soundEffects';

export default function QuestMapPage() {
  const player = useAppStore((s) => s.player);
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  const levelInfo = computePlayerLevel(player.xp);

  const handleQuestClick = (quest, isLocked) => {
    if (isLocked) {
      sound.playError();
      return;
    }
    sound.playPop();
    setCurrentShape(quest.shapeId, quest.id);
  };

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.15) 0%, #0f0d1a 75%)',
      overflowY: 'auto',
      padding: '1.5rem 1rem 3rem',
    }}>
      {/* ═══ TOP BAR ═══ */}
      <header style={{
        maxWidth: '720px',
        margin: '0 auto 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-sm"
            onClick={() => setViewMode('gallery')}
          >
            ← Gallery
          </button>
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '1.4rem',
              margin: 0,
              color: '#fbbf24',
            }}>
              🗺️ Adventure Quest
            </h1>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>
              Master 3D geometry mission by mission!
            </div>
          </div>
        </div>

        {/* Player stats chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
            ⭐ {player.stars}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>
            💎 {player.gems}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8' }}>
            Lv.{levelInfo.level}
          </span>
          <button
            onClick={toggleSound}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0 0.2rem',
            }}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* ═══ QUEST PROGRESSION PATH ═══ */}
      <main style={{
        maxWidth: '620px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {QUESTS.map((quest, idx) => {
          const questProgress = player.questProgress[quest.id];
          const isCompleted = !!questProgress?.completed;
          const starsEarned = questProgress?.stars || 0;

          // Unlock condition: Quest 1 is always unlocked; subsequent unlocked if previous completed
          const isUnlocked = quest.id === 1 || !!player.questProgress[quest.id - 1]?.completed;

          return (
            <div
              key={quest.id}
              onClick={() => handleQuestClick(quest, !isUnlocked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '18px',
                background: isCompleted
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 13, 26, 0.8))'
                  : isUnlocked
                  ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.12), rgba(15, 13, 26, 0.8))'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${
                  isCompleted
                    ? '#10b98155'
                    : isUnlocked
                    ? '#818cf855'
                    : 'rgba(255,255,255,0.06)'
                }`,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.45,
                transform: 'translateY(0)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isUnlocked ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
              }}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
            >
              {/* Level node badge */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isCompleted
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isUnlocked
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0,
                boxShadow: isUnlocked ? '0 0 16px rgba(129, 140, 248, 0.35)' : 'none',
              }}>
                {isUnlocked ? quest.icon : '🔒'}
              </div>

              {/* Quest Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '0.15rem',
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: isCompleted ? '#34d399' : '#818cf8',
                  }}>
                    {quest.world} · Quest {quest.id}
                  </span>
                </div>

                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.02rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.2rem',
                }}>
                  {quest.title}
                </div>

                <div style={{
                  fontSize: '0.76rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.35,
                }}>
                  {quest.story}
                </div>
              </div>

              {/* Star Rating & XP Chip */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {isCompleted ? (
                  <div>
                    <div style={{ fontSize: '1.1rem', letterSpacing: '0.1rem' }}>
                      {'⭐'.repeat(starsEarned)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                      CLEARED
                    </div>
                  </div>
                ) : isUnlocked ? (
                  <div>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(251, 191, 36, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}>
                      PLAY →
                    </span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
                      +{quest.xpReward} XP
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
