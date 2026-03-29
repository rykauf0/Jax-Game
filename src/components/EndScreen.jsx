import React, { useEffect, useState } from 'react';
import { calculateScore, checkAchievements } from '../hooks/useGameState';
import { setHighScore, unlockAchievement, incrementGamesPlayed } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/constants';
import { audio } from '../utils/audio';

export default function EndScreen({ state, onRestart }) {
  const [newAchs, setNewAchs] = useState([]);
  const scoreData = calculateScore(state);

  useEffect(() => {
    incrementGamesPlayed();
    setHighScore(scoreData.total);

    const earned = checkAchievements(state, scoreData.total);
    const newlyUnlocked = [];
    earned.forEach(id => {
      if (unlockAchievement(id)) newlyUnlocked.push(id);
    });
    setNewAchs(newlyUnlocked);

    if (state.won) audio.win();
    else audio.lose();
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100vh', padding: '16px',
      fontFamily: 'Fredoka, Nunito, sans-serif',
      background: state.won
        ? `linear-gradient(180deg, ${scoreData.tier.color}33 0%, #F0FDF4 100%)`
        : 'linear-gradient(180deg, #FEE2E2 0%, #FEF2F2 100%)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ fontSize: '40px', marginTop: '8px' }}>
        {state.won ? scoreData.tier.emoji : '💙'}
      </div>
      <h1 style={{
        fontSize: '24px', fontWeight: 700, margin: '4px 0',
        color: state.won ? '#059669' : '#DC2626',
      }}>
        {state.won ? `${scoreData.tier.name} Guardian!` : "Don't Give Up!"}
      </h1>
      {!state.won && (
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0', textAlign: 'center' }}>
          Aka needs your help! Try again!
        </p>
      )}

      {/* Score */}
      <div style={{
        fontSize: '32px', fontWeight: 700,
        color: state.won ? scoreData.tier.color === '#B9F2FF' ? '#0891B2' : '#D97706' : '#6B7280',
        textShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {scoreData.total} pts
      </div>

      {/* Breakdown */}
      <div style={{
        width: '100%', maxWidth: '300px', background: 'white',
        borderRadius: '12px', padding: '10px', margin: '8px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {scoreData.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '3px 4px', fontSize: '13px',
            borderBottom: i < scoreData.items.length - 1 ? '1px solid #F3F4F6' : 'none',
          }}>
            <span>
              <span style={{ marginRight: '4px' }}>{item.emoji}</span>
              <span style={{ color: '#4B5563' }}>{item.label}</span>
            </span>
            <span style={{
              fontWeight: 700,
              color: item.points >= 0 ? '#059669' : '#DC2626',
            }}>
              {item.points >= 0 ? '+' : ''}{item.points}
            </span>
          </div>
        ))}
      </div>

      {/* New achievements */}
      {newAchs.length > 0 && (
        <div style={{
          width: '100%', maxWidth: '300px', background: '#FFFBEB',
          borderRadius: '12px', padding: '8px 10px', marginBottom: '8px',
          border: '2px solid #FCD34D',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>
            🎖️ New Achievements!
          </div>
          {newAchs.map(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            return ach ? (
              <div key={id} style={{ fontSize: '12px', color: '#4B5563', padding: '2px 0' }}>
                {ach.emoji} {ach.name}
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Play again */}
      <button onClick={onRestart} style={{
        padding: '12px 32px', borderRadius: '20px', border: 'none',
        background: state.won ? '#22C55E' : '#3B82F6', color: 'white',
        fontSize: '18px', fontWeight: 700, cursor: 'pointer',
        fontFamily: 'Fredoka, Nunito, sans-serif',
        marginTop: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        {state.won ? 'Play Again!' : 'Try Again!'}
      </button>
    </div>
  );
}
