import React, { useEffect, useState } from 'react';
import { calculateScore, checkAchievements } from '../hooks/useGameState';
import { setHighScore, unlockAchievement, incrementGamesPlayed } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/constants';
import { audio } from '../utils/audio';
import {
  TrophyIcon, HeartIcon, CalendarIcon, FactoryIcon, MagnifyIcon, GamepadIcon,
  GlobeIcon, BearIcon, ThermometerIcon, MedalIcon, StarIcon, ShieldIcon,
  IceIcon, FishIcon,
} from './Icons';

const SCORE_ICON_MAP = {
  calendar: (s) => <CalendarIcon size={s} />,
  heart: (s) => <HeartIcon size={s} />,
  factory: (s) => <FactoryIcon size={s} />,
  magnify: (s) => <MagnifyIcon size={s} />,
  gamepad: (s) => <GamepadIcon size={s} />,
  globe: (s) => <GlobeIcon size={s} />,
  bear: (s) => <BearIcon size={s} />,
  trophy: (s) => <TrophyIcon size={s} />,
  thermometer: (s) => <ThermometerIcon size={s} />,
  shield: (s) => <ShieldIcon size={s} />,
  ice: (s) => <IceIcon size={s} />,
  star: (s) => <StarIcon size={s} />,
  fish: (s) => <FishIcon size={s} />,
};

function ScoreIcon({ type, size = 16 }) {
  const render = SCORE_ICON_MAP[type];
  return render ? render(size) : <StarIcon size={size} />;
}

export default function EndScreen({ state, onRestart }) {
  const [newAchs, setNewAchs] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [animScore, setAnimScore] = useState(0);
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

    // Animate score counting up
    setTimeout(() => setShowScore(true), 400);
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!showScore) return;
    const target = scoreData.total;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimScore(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [showScore, scoreData.total]);

  const isWin = state.won;
  const tier = scoreData.tier;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100dvh', padding: '12px 16px',
      fontFamily: "'Fredoka', 'Nunito', sans-serif",
      background: isWin
        ? `linear-gradient(180deg, ${tier.color}44 0%, #F8FAFC 50%, #F0FDF4 100%)`
        : 'linear-gradient(180deg, #FEE2E2 0%, #FFF5F5 100%)',
      overflowY: 'auto',
      position: 'relative',
    }}>
      {/* Confetti on win */}
      {isWin && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 13) % 100}%`,
              width: `${6 + (i % 3) * 3}px`,
              height: `${6 + (i % 3) * 3}px`,
              borderRadius: i % 2 ? '50%' : '2px',
              background: ['#FBBF24', '#F472B6', '#34D399', '#60A5FA', '#A78BFA', '#FB923C'][i % 6],
              animation: `confetti-fall ${3 + (i % 4)}s ease-in infinite ${i * 0.2}s`,
              opacity: 0.8,
            }} />
          ))}
        </div>
      )}

      {/* Trophy / Emoji */}
      <div style={{
        marginTop: '8px',
        animation: 'icon-bounce 0.6s ease-out',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
        display: 'flex', justifyContent: 'center',
      }}>
        {isWin ? <TrophyIcon size={56} color={tier.color === '#B9F2FF' ? '#0891B2' : tier.color} /> : <HeartIcon size={56} color="#3B82F6" />}
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '26px', fontWeight: 700, margin: '4px 0 2px',
        color: isWin ? '#059669' : '#DC2626',
        animation: 'modal-bounce 0.5s ease-out',
      }}>
        {isWin ? `${tier.name} Guardian!` : "Keep Trying!"}
      </h1>
      {!isWin && (
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 6px', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
          Aka needs your help! You'll do better next time!
        </p>
      )}

      {/* Animated score */}
      <div style={{
        fontSize: '40px', fontWeight: 700,
        color: isWin ? (tier.color === '#B9F2FF' ? '#0891B2' : '#D97706') : '#6B7280',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        animation: showScore ? 'score-pop 0.4s ease-out' : 'none',
        opacity: showScore ? 1 : 0,
      }}>
        {animScore} pts
      </div>

      {/* Score breakdown */}
      <div style={{
        width: '100%', maxWidth: '300px', background: 'white',
        borderRadius: '16px', padding: '10px 12px', margin: '8px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #E5E7EB',
      }}>
        {scoreData.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 2px', fontSize: '13px',
            borderBottom: i < scoreData.items.length - 1 ? '1px solid #F3F4F6' : 'none',
            animation: `slide-in 0.3s ease-out ${0.5 + i * 0.08}s both`,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><ScoreIcon type={item.iconType} /></span>
              <span style={{ color: '#4B5563', fontFamily: "'Nunito', sans-serif" }}>{item.label}</span>
            </span>
            <span style={{
              fontWeight: 700, fontSize: '14px',
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
          borderRadius: '16px', padding: '10px 12px', marginBottom: '8px',
          border: '2px solid #FCD34D',
          animation: 'modal-bounce 0.5s ease-out 1s both',
          boxShadow: '0 0 12px rgba(251,191,36,0.2)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MedalIcon size={14} /> New Achievements!
          </div>
          {newAchs.map(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            return ach ? (
              <div key={id} style={{ fontSize: '13px', color: '#4B5563', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ScoreIcon type={ach.iconType} /> {ach.name}
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Play again button */}
      <button onClick={onRestart} style={{
        padding: '14px 36px', borderRadius: '20px', border: 'none',
        background: isWin ? '#22C55E' : '#3B82F6',
        boxShadow: isWin ? '0 4px 0 #15803D, 0 6px 12px rgba(34,197,94,0.3)' : '0 4px 0 #1D4ED8, 0 6px 12px rgba(59,130,246,0.3)',
        color: 'white', fontSize: '20px', fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        marginTop: '6px',
        transition: 'transform 0.1s',
        letterSpacing: '0.5px',
      }}
        onPointerDown={e => e.currentTarget.style.transform = 'translateY(3px)'}
        onPointerUp={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {isWin ? 'Play Again!' : 'Try Again!'}
      </button>
    </div>
  );
}
