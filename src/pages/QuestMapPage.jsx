/**
 * QuestMapPage.jsx
 * ═══════════════════════════════════════════════════════════════
 * Sunny Adventure Quest Map for Kids.
 * Features 12 fun missions across 4 colorful toy worlds with star ratings,
 * XP rewards, and bubbly level nodes!
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
      background: 'linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 40%, #ffffff 100%)',
      overflowY: 'auto',
      padding: '1.5rem 1rem 3rem',
    }}>
      {/* ═══ TOP BAR (SUNNY) ═══ */}
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
              fontWeight: 900,
              fontSize: '1.5rem',
              margin: 0,
              color: '#0f172a',
            }}>
              🗺️ Adventure Quest Map
            </h1>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
              Complete fun 3D missions to collect stars!
            </div>
          </div>
        </div>

        {/* Player stats chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.35rem 0.8rem',
          borderRadius: '9999px',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706' }}>
            ⭐ {player.stars}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
            💎 {player.gems}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5' }}>
            Lv.{levelInfo.level}
          </span>
          <button
            onClick={toggleSound}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '0 0.2rem',
            }}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* ═══ QUEST PROGRESSION PATH (SUNNY TOY CARDS) ═══ */}
      <main style={{
        maxWidth: '620px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
      }}>
        {QUESTS.map((quest) => {
          const questProgress = player.questProgress[quest.id];
          const isCompleted = !!questProgress?.completed;
          const starsEarned = questProgress?.stars || 0;
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
                borderRadius: '20px',
                background: isCompleted
                  ? 'linear-gradient(135deg, #f0fdf4, #ffffff)'
                  : isUnlocked
                  ? 'linear-gradient(135deg, #eef2ff, #ffffff)'
                  : '#f8fafc',
                border: `2px solid ${
                  isCompleted
                    ? '#86efac'
                    : isUnlocked
                    ? '#c7d2fe'
                    : '#e2e8f0'
                }`,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.5,
                boxShadow: isUnlocked ? '0 6px 18px rgba(100, 116, 139, 0.08)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
            >
              {/* Level Node Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isCompleted
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isUnlocked
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: isUnlocked ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
              }}>
                {isUnlocked ? quest.icon : '🔒'}
              </div>

              {/* Quest Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isCompleted ? '#059669' : '#4f46e5',
                  marginBottom: '0.15rem',
                }}>
                  {quest.world} · Mission {quest.id}
                </div>

                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#0f172a',
                  marginBottom: '0.2rem',
                }}>
                  {quest.title}
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  color: '#64748b',
                  lineHeight: 1.35,
                }}>
                  {quest.story}
                </div>
              </div>

              {/* Star Rating & Action */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {isCompleted ? (
                  <div>
                    <div style={{ fontSize: '1.15rem' }}>
                      {'⭐'.repeat(starsEarned)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                      CLEARED
                    </div>
                  </div>
                ) : isUnlocked ? (
                  <button
                    className="btn btn-sm btn-accent"
                    style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                  >
                    PLAY →
                  </button>
                ) : (
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
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
