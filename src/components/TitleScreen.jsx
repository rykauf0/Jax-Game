import React from 'react';
import { getHighScore, getAchievements } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/constants';
import { audio } from '../utils/audio';

export default function TitleScreen({ onStart }) {
  const highScore = getHighScore();
  const achievementCount = getAchievements().length;

  const handleStart = (diff) => {
    audio.init();
    audio.cardPlayed();
    onStart(diff);
  };

  const difficulties = [
    { key: 'easy', label: 'Easy', color: '#22C55E', shadow: '#15803D', emoji: '🌟', desc: 'Best for beginners' },
    { key: 'medium', label: 'Medium', color: '#F59E0B', shadow: '#B45309', emoji: '⭐', desc: 'A fair challenge' },
    { key: 'hard', label: 'Hard', color: '#EF4444', shadow: '#B91C1C', emoji: '🔥', desc: 'For experts!' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100dvh', padding: '24px 20px', fontFamily: "'Fredoka', 'Nunito', sans-serif",
      background: 'linear-gradient(180deg, #0F172A 0%, #1E3A5F 40%, #2563EB 100%)',
      color: 'white', position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated stars + snow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 97.3) % 60}%`,
            width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
            borderRadius: '50%', background: 'white',
            animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite ${(i * 0.3) % 3}s`,
          }} />
        ))}
        {/* Drifting snowflakes */}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`snow-${i}`} style={{
            position: 'absolute',
            left: `${(i * 23) % 100}%`,
            fontSize: `${8 + (i % 3) * 4}px`,
            opacity: 0.3 + (i % 3) * 0.1,
            animation: `snow-fall ${10 + i * 2}s linear infinite ${i * 1.5}s`,
          }}>
            ❄
          </div>
        ))}
      </div>

      {/* Aurora shimmer at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.1) 25%, rgba(45,212,191,0.15) 50%, rgba(129,140,248,0.1) 75%, transparent 100%)',
        animation: 'aurora-shift 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Bear */}
      <div style={{
        animation: 'title-bear-bounce 3s ease-in-out infinite',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
        marginBottom: '4px',
      }}>
        <svg viewBox="0 0 120 120" style={{ width: '110px', height: '110px' }}>
          <defs>
            <radialGradient id="titleFur" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5F0E8" />
              <stop offset="100%" stopColor="#E8E0D4" />
            </radialGradient>
          </defs>
          <g transform="translate(10,10)">
            {/* Body */}
            <ellipse cx="50" cy="60" rx="30" ry="25" fill="url(#titleFur)" />
            <ellipse cx="50" cy="65" rx="18" ry="15" fill="white" opacity="0.3" />
            {/* Legs */}
            <ellipse cx="32" cy="78" rx="10" ry="10" fill="#EDE8E0" />
            <ellipse cx="68" cy="78" rx="10" ry="10" fill="#EDE8E0" />
            {/* Head */}
            <circle cx="50" cy="34" r="22" fill="#FAF6F0" />
            {/* Ears */}
            <circle cx="32" cy="18" r="9" fill="#F5F0E8" />
            <circle cx="32" cy="18" r="5" fill="#FFCDD2" />
            <circle cx="68" cy="18" r="9" fill="#F5F0E8" />
            <circle cx="68" cy="18" r="5" fill="#FFCDD2" />
            {/* Happy eyes */}
            <path d="M40 32 Q44 28 48 32" stroke="#2D2D2D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M52 32 Q56 28 60 32" stroke="#2D2D2D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="36" cy="38" r="5" fill="#FFB4C0" opacity="0.4" />
            <circle cx="64" cy="38" r="5" fill="#FFB4C0" opacity="0.4" />
            {/* Snout */}
            <ellipse cx="50" cy="40" rx="10" ry="7" fill="#EDE8E0" />
            <ellipse cx="50" cy="38" rx="4" ry="2.8" fill="#2D2D2D" />
            <path d="M45 43 Q50 48 55 43" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '32px', fontWeight: 700, margin: '0 0 2px 0',
        textShadow: '0 2px 12px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.3)',
        letterSpacing: '-0.5px',
      }}>
        Polar Guardian
      </h1>
      <p style={{
        fontSize: '14px', opacity: 0.7, margin: '0 0 16px 0',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Protect Aka the polar bear!
      </p>

      {/* High score + achievements */}
      {(highScore > 0 || achievementCount > 0) && (
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '14px',
        }}>
          {highScore > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
              padding: '4px 12px', fontSize: '13px',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
            }}>
              🏆 {highScore}
            </div>
          )}
          {achievementCount > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
              padding: '4px 12px', fontSize: '13px',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
            }}>
              🎖️ {achievementCount}/{ACHIEVEMENTS.length}
            </div>
          )}
        </div>
      )}

      {/* Difficulty buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '260px' }}>
        {difficulties.map(d => (
          <button key={d.key} onClick={() => handleStart(d.key)} style={{
            padding: '12px 16px', borderRadius: '18px',
            border: 'none',
            background: d.color,
            boxShadow: `0 4px 0 ${d.shadow}, 0 6px 16px rgba(0,0,0,0.2)`,
            color: 'white',
            fontSize: '18px', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Fredoka', 'Nunito', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.1s, box-shadow 0.1s',
            letterSpacing: '0.5px',
          }}
            onPointerDown={e => {
              e.currentTarget.style.transform = 'translateY(3px)';
              e.currentTarget.style.boxShadow = `0 1px 0 ${d.shadow}, 0 2px 8px rgba(0,0,0,0.2)`;
            }}
            onPointerUp={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 0 ${d.shadow}, 0 6px 16px rgba(0,0,0,0.2)`;
            }}
            onPointerLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 0 ${d.shadow}, 0 6px 16px rgba(0,0,0,0.2)`;
            }}
          >
            <span style={{ fontSize: '22px' }}>{d.emoji}</span>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
