import React, { useState } from 'react';
import { getHighScore, getAchievements } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/constants';
import { audio } from '../utils/audio';

export default function TitleScreen({ onStart }) {
  const [selectedDiff, setSelectedDiff] = useState(null);
  const highScore = getHighScore();
  const achievementCount = getAchievements().length;

  const handleStart = (diff) => {
    audio.init();
    audio.cardPlayed();
    onStart(diff);
  };

  const difficulties = [
    { key: 'easy', label: 'Easy', color: '#22C55E', emoji: '🌟' },
    { key: 'medium', label: 'Medium', color: '#F59E0B', emoji: '⭐' },
    { key: 'hard', label: 'Hard', color: '#EF4444', emoji: '🔥' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', padding: '24px', fontFamily: 'Fredoka, Nunito, sans-serif',
      background: 'linear-gradient(180deg, #1a1a4e 0%, #2d4a7e 50%, #3B82F6 100%)',
      color: 'white', position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated stars background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: 'white',
            opacity: 0.3 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      {/* Bear SVG */}
      <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px', marginBottom: '8px' }}>
        <g style={{ animation: 'bear-bounce 2s ease-in-out infinite' }}>
          <ellipse cx="50" cy="60" rx="25" ry="20" fill="#F5F5F0" />
          <circle cx="50" cy="38" r="18" fill="#FAFAF5" />
          <circle cx="36" cy="24" r="6" fill="#F5F5F0" />
          <circle cx="36" cy="24" r="3" fill="#FFCDD2" />
          <circle cx="64" cy="24" r="6" fill="#F5F5F0" />
          <circle cx="64" cy="24" r="3" fill="#FFCDD2" />
          <circle cx="44" cy="36" r="2.5" fill="#2D2D2D" />
          <circle cx="56" cy="36" r="2.5" fill="#2D2D2D" />
          <circle cx="44.8" cy="35.3" r="0.8" fill="white" />
          <circle cx="56.8" cy="35.3" r="0.8" fill="white" />
          <ellipse cx="50" cy="43" rx="6" ry="4" fill="#E8E4DD" />
          <ellipse cx="50" cy="41.5" rx="3" ry="1.8" fill="#2D2D2D" />
          <path d="M46 45 Q50 49 54 45" stroke="#2D2D2D" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      <h1 style={{
        fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0',
        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        Polar Guardian
      </h1>
      <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 20px 0' }}>
        Protect Aka the polar bear!
      </p>

      {highScore > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '6px 16px',
          marginBottom: '12px', fontSize: '14px',
        }}>
          🏆 Best: {highScore} pts
        </div>
      )}

      {achievementCount > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '4px 12px',
          marginBottom: '16px', fontSize: '12px', opacity: 0.8,
        }}>
          🎖️ {achievementCount}/{ACHIEVEMENTS.length} achievements
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
        {difficulties.map(d => (
          <button key={d.key} onClick={() => handleStart(d.key)} style={{
            padding: '12px 20px', borderRadius: '16px',
            border: `2px solid ${d.color}`,
            background: `${d.color}22`, color: 'white',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Fredoka, Nunito, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.1s, background 0.2s',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
