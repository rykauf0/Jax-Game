import React, { useState, useEffect } from 'react';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import { useGameState } from './hooks/useGameState';
import { stopBgMusic, audio } from './utils/audio';
import { BearIcon, StarIcon, CalendarIcon } from './components/Icons';

function Countdown({ onDone }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [count, onDone]);

  const colors = ['#EF4444', '#F59E0B', '#22C55E'];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100dvh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E3A5F 50%, #2563EB 100%)',
      fontFamily: "'Fredoka', 'Nunito', sans-serif",
    }}>
      <div key={count} style={{
        fontSize: count > 0 ? '96px' : '56px',
        fontWeight: 700,
        color: count > 0 ? colors[3 - count] || 'white' : '#22C55E',
        animation: 'countdown-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        textShadow: count > 0
          ? `0 0 40px ${colors[3 - count]}88, 0 4px 8px rgba(0,0,0,0.3)`
          : '0 0 40px rgba(34,197,94,0.5), 0 4px 8px rgba(0,0,0,0.3)',
      }}>
        {count > 0 ? count : 'GO!'}
      </div>
    </div>
  );
}

function Tutorial({ onDone }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { iconEl: <BearIcon size={48} color="#F5F0E8" />, title: 'Meet Aka!', text: 'Keep her belly full and her ice cold!' },
    { iconEl: <StarIcon size={48} color="#FBBF24" />, title: 'Play Cards!', text: 'Tap cards to feed Aka or build clean energy! Hold a card to learn facts!' },
    { iconEl: <CalendarIcon size={48} color="#3B82F6" />, title: 'Jump Forward!', text: 'Jump 3 years to see what happens next!' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100dvh', background: 'linear-gradient(180deg, #EFF6FF, #DBEAFE)',
      fontFamily: "'Fredoka', 'Nunito', sans-serif", padding: '24px',
    }}>
      <div key={slide} style={{
        marginBottom: '12px',
        animation: 'icon-bounce 0.5s ease-out',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
        display: 'flex', justifyContent: 'center',
      }}>
        {slides[slide].iconEl}
      </div>
      <h2 style={{ fontSize: '24px', color: '#1F2937', margin: '0 0 6px 0' }}>
        {slides[slide].title}
      </h2>
      <p style={{
        fontSize: '15px', color: '#6B7280', textAlign: 'center', margin: '0 0 24px 0',
        fontFamily: "'Nunito', sans-serif", maxWidth: '260px',
      }}>
        {slides[slide].text}
      </p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? '24px' : '8px', height: '8px', borderRadius: '4px',
            background: i === slide ? '#3B82F6' : '#CBD5E1',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <button onClick={() => slide < 2 ? setSlide(s => s + 1) : onDone()} style={{
        padding: '12px 36px', borderRadius: '18px', border: 'none',
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        boxShadow: '0 4px 0 #1D4ED8, 0 6px 12px rgba(37,99,235,0.3)',
        color: 'white', fontSize: '18px', fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Fredoka', sans-serif",
        transition: 'transform 0.1s',
      }}
        onPointerDown={e => e.currentTarget.style.transform = 'translateY(3px)'}
        onPointerUp={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {slide < 2 ? 'Next' : "Let's Go!"}
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('title');
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const { state, initGame, playCard, jumpTime, dismissEvent, completeMiniGame, clearNewFriend, markCubsAnnounced } = useGameState();

  useEffect(() => {
    audio.init(); // Set up audio unlock listeners early
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
    <div style={{ maxWidth: '768px', margin: '0 auto', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
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
          markCubsAnnounced={markCubsAnnounced}
        />
      )}
      {screen === 'end' && state && (
        <EndScreen state={state} onRestart={handleRestart} />
      )}
    </div>
  );
}
