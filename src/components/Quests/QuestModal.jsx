/**
 * QuestModal.jsx
 * ═══════════════════════════════════════════════════════════════
 * Sunny & Cheerful In-Stage Quest HUD & Victory Screen for Kids.
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

  const [cleared, setCleared] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  if (!quest) return null;

  const config = shapeConfig[quest.shapeId];
  const formula = config?.formulas?.[quest.targetKey];
  const currentValue = formula ? round(formula.compute(dimensions), 1) : 0;
  const isTargetHit = Math.abs(currentValue - quest.targetValue) <= quest.tolerance;

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
      {/* Top Floating Mission Banner (Light & Crisp) */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        maxWidth: '92%',
        width: '460px',
        padding: '0.65rem 1rem',
        borderRadius: '18px',
        background: '#ffffff',
        border: '2.5px solid #fde68a',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.15)',
        animation: 'page-in 0.3s ease',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '0.9rem',
              color: '#b45309',
            }}>
              Mission #{quest.id}: {quest.title}
            </span>
          </div>

          <button
            className="btn btn-sm"
            onClick={() => {
              sound.playPop();
              setShowHint(!showHint);
              if (!showHint) setHintIndex((i) => (i + 1) % quest.hints.length);
            }}
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: '#fef3c7', borderColor: '#fde68a', color: '#b45309' }}
          >
            💡 Clue
          </button>
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#334155',
          lineHeight: 1.35,
          marginBottom: '0.4rem',
        }}>
          🎯 <strong>Goal:</strong> {quest.objective}
        </div>

        {/* Live Target Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            flex: 1,
            height: '7px',
            borderRadius: '4px',
            background: '#e2e8f0',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: '4px',
              width: `${Math.min(100, Math.max(5, (currentValue / quest.targetValue) * 100))}%`,
              background: isTargetHit
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              transition: 'width 0.1s ease',
            }} />
          </div>
          <span style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: isTargetHit ? '#059669' : '#b45309',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {currentValue} / {quest.targetValue}
          </span>
        </div>

        {/* Expandable Hint */}
        {showHint && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.45rem 0.7rem',
            borderRadius: '10px',
            background: '#fef3c7',
            border: '1.5px solid #fde68a',
            fontSize: '0.76rem',
            color: '#92400e',
            fontWeight: 600,
            animation: 'page-in 0.2s ease',
          }}>
            🤖 <strong>Geo's Clue:</strong> {quest.hints[hintIndex % quest.hints.length]}
          </div>
        )}
      </div>

      {/* Fullscreen Victory Celebration */}
      {showVictory && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(15, 23, 42, 0.45)',
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
            background: '#ffffff',
            border: '3px solid #86efac',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            animation: 'badge-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}>
            {/* Stars */}
            <div style={{ fontSize: '2.8rem', marginBottom: '0.4rem', letterSpacing: '0.3rem' }}>
              ⭐ ⭐ ⭐
            </div>

            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '1.7rem',
              margin: '0 0 0.4rem',
              color: '#15803d',
            }}>
              QUEST CLEARED!
            </h2>

            <p style={{
              fontSize: '0.9rem',
              color: '#475569',
              margin: '0 0 1.25rem',
              lineHeight: 1.4,
              fontWeight: 600,
            }}>
              {quest.geoVictory}
            </p>

            {/* Rewards Card */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              padding: '0.9rem',
              borderRadius: '16px',
              background: '#f0fdf4',
              border: '2px solid #bbf7d0',
              marginBottom: '1.4rem',
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                  XP REWARD
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.4rem', color: '#4f46e5' }}>
                  +{quest.xpReward} XP
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                  GEMS EARNED
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '1.4rem', color: '#059669' }}>
                  +{quest.gemReward} 💎
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
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
                style={{ fontWeight: 800 }}
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
