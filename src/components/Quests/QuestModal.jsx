/**
 * QuestModal.jsx
 * ═══════════════════════════════════════════════════════════════
 * In-stage Quest HUD banner & Victory Celebration popup.
 * Automatically verifies quest success criteria, evaluates stars,
 * triggers audio fanfares, and awards XP & Gems.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import { getQuestById } from '../../data/questData';
import { shapeConfig } from '../../data/shapeConfig';
import useAppStore from '../../store/useAppStore';
import sound from '../../utils/soundEffects';

const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export default function QuestModal({ questId, dimensions }) {
  const quest = getQuestById(questId);
  const completeQuest = useAppStore((s) => s.completeQuest);
  const setCurrentShape = useAppStore((s) => s.setCurrentShape);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const isAlreadyCompleted = useAppStore((s) => !!s.player.questProgress[questId]?.completed);

  const [cleared, setCleared] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  if (!quest) return null;

  const config = shapeConfig[quest.shapeId];
  const formula = config?.formulas?.[quest.targetKey];
  const currentValue = formula ? round(formula.compute(dimensions), 1) : 0;
  const isTargetHit = Math.abs(currentValue - quest.targetValue) <= quest.tolerance;

  // ─── Verify Quest Completion ───────────────────────────────
  useEffect(() => {
    if (isTargetHit && !cleared) {
      setCleared(true);
      setShowVictory(true);
      sound.playFanfare();
      sound.playCoin();
      completeQuest(quest.id, 3, quest.xpReward, quest.gemReward);
    }
  }, [isTargetHit, cleared, quest]);

  const handleNextQuest = () => {
    const nextQ = getQuestById(quest.id + 1);
    if (nextQ) {
      setCurrentShape(nextQ.shapeId, nextQ.id);
      setCleared(false);
      setShowVictory(false);
    } else {
      setViewMode('map');
    }
  };

  return (
    <>
      {/* Top Floating Mission Banner */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        maxWidth: '92%',
        width: '460px',
        padding: '0.6rem 0.9rem',
        borderRadius: '14px',
        background: 'rgba(15, 13, 26, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'page-in 0.3s ease',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🏆</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#fbbf24',
            }}>
              Quest #{quest.id}: {quest.title}
            </span>
          </div>

          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              setShowHint(!showHint);
              if (!showHint) setHintIndex((i) => (i + 1) % quest.hints.length);
            }}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
          >
            💡 Hint
          </button>
        </div>

        <div style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.3,
          marginBottom: '0.4rem',
        }}>
          🎯 <strong>Objective:</strong> {quest.objective}
        </div>

        {/* Live Target Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: '3px',
              width: `${Math.min(100, Math.max(5, (currentValue / quest.targetValue) * 100))}%`,
              background: isTargetHit
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              transition: 'width 0.1s ease',
            }} />
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isTargetHit ? '#10b981' : '#fbbf24',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {currentValue} / {quest.targetValue}
          </span>
        </div>

        {/* Expandable Hint */}
        {showHint && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.6rem',
            borderRadius: '8px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            fontSize: '0.74rem',
            color: '#fef08a',
            animation: 'page-in 0.2s ease',
          }}>
            🤖 <strong>Geo's Clue:</strong> {quest.hints[hintIndex % quest.hints.length]}
          </div>
        )}
      </div>

      {/* Fullscreen Victory Celebration Popup */}
      {showVictory && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(15, 13, 26, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'page-in 0.3s ease',
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            padding: '1.75rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(30, 27, 50, 0.95), rgba(15, 13, 26, 0.98))',
            border: '2px solid rgba(251, 191, 36, 0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(251, 191, 36, 0.2)',
            textAlign: 'center',
            animation: 'badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}>
            {/* Stars */}
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem', letterSpacing: '0.2rem' }}>
              ⭐ ⭐ ⭐
            </div>

            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '1.6rem',
              margin: '0 0 0.4rem',
              color: '#fbbf24',
            }}>
              QUEST CLEARED!
            </h2>

            <p style={{
              fontSize: '0.88rem',
              color: 'var(--color-text-secondary)',
              margin: '0 0 1rem',
              lineHeight: 1.4,
            }}>
              {quest.geoVictory}
            </p>

            {/* Rewards Banner */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              padding: '0.8rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  XP EARNED
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#818cf8' }}>
                  +{quest.xpReward} XP
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  GEMS EARNED
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#34d399' }}>
                  +{quest.gemReward} 💎
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
              <button
                className="btn"
                onClick={() => {
                  sound.playPop();
                  setViewMode('map');
                }}
              >
                🗺️ Quest Map
              </button>
              <button
                className="btn btn-accent"
                onClick={handleNextQuest}
              >
                Next Quest →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
