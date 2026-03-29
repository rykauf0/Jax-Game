import React, { useState, useEffect } from 'react';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import { useGameState } from './hooks/useGameState';
import { stopBgMusic } from './utils/audio';

function Countdown({ onDone }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'linear-gradient(180deg, #1a1a4e, #2d4a7e)',
      fontFamily: 'Fredoka, Nunito, sans-serif',
    }}>
      <div key={count} style={{
        fontSize: count > 0 ? '72px' : '48px', fontWeight: 700, color: 'white',
        animation: 'modal-pop 0.5s ease-out',
      }}>
        {count > 0 ? count : 'GO!'}
      </div>
      <style>{`
        @keyframes modal-pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

function Tutorial({ onDone }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { icon: '🐻‍❄️', title: 'Meet Aka!', text: 'Keep her belly full and her ice cold!' },
    { icon: '🃏', title: 'Play Cards!', text: 'Tap cards to feed Aka or build clean energy!' },
    { icon: '⏩', title: 'Jump Forward!', text: 'Jump 3 years and see what happens!' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'linear-gradient(180deg, #EFF6FF, #DBEAFE)',
      fontFamily: 'Fredoka, Nunito, sans-serif', padding: '24px',
    }}>
      <div key={slide} style={{
        fontSize: '48px', marginBottom: '12px',
        animation: 'modal-pop 0.3s ease-out',
      }}>
        {slides[slide].icon}
      </div>
      <h2 style={{ fontSize: '22px', color: '#1F2937', margin: '0 0 6px 0' }}>
        {slides[slide].title}
      </h2>
      <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', margin: '0 0 20px 0' }}>
        {slides[slide].text}
      </p>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: i === slide ? '#3B82F6' : '#D1D5DB',
          }} />
        ))}
      </div>
      <button onClick={() => slide < 2 ? setSlide(s => s + 1) : onDone()} style={{
        padding: '10px 32px', borderRadius: '20px', border: 'none',
        background: '#3B82F6', color: 'white', fontSize: '16px', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'Fredoka, Nunito, sans-serif',
      }}>
        {slide < 2 ? 'Next' : "Let's Go!"}
      </button>
      <style>{`
        @keyframes modal-pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('title');
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const { state, initGame, playCard, jumpTime, dismissEvent, completeMiniGame, clearNewFriend } = useGameState();

  useEffect(() => {
    const played = localStorage.getItem('pg_gamesPlayed');
    if (played && parseInt(played) > 0) setIsFirstPlay(false);
  }, []);

  const handleStart = (difficulty) => {
    initGame(difficulty);
    setScreen('countdown');
  };

  const handleCountdownDone = () => {
    if (isFirstPlay) {
      setScreen('tutorial');
    } else {
      setScreen('game');
    }
  };

  const handleTutorialDone = () => {
    setIsFirstPlay(false);
    setScreen('game');
  };

  const handleRestart = () => {
    stopBgMusic();
    setScreen('title');
  };

  useEffect(() => {
    if (state && state.phase === 'gameOver') {
      stopBgMusic();
      setScreen('end');
    }
  }, [state?.phase]);

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'countdown' && <Countdown onDone={handleCountdownDone} />}
      {screen === 'tutorial' && <Tutorial onDone={handleTutorialDone} />}
      {screen === 'game' && state && (
        <GameScreen
          state={state}
          playCard={playCard}
          jumpTime={jumpTime}
          dismissEvent={dismissEvent}
          completeMiniGame={completeMiniGame}
          clearNewFriend={clearNewFriend}
        />
      )}
      {screen === 'end' && state && (
        <EndScreen state={state} onRestart={handleRestart} />
      )}
    </div>
  );
}
