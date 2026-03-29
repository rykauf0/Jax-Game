import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MINI_GAME_DURATION } from '../data/constants';
import { audio } from '../utils/audio';

const ITEM_SIZE = 58;

function FloatingText({ x, y, text, color }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      color, fontWeight: 800, fontSize: '20px',
      fontFamily: "'Fredoka', sans-serif",
      pointerEvents: 'none',
      animation: 'float-up 0.7s ease-out forwards',
      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
      zIndex: 10,
    }}>
      {text}
    </div>
  );
}

function BurstParticles({ x, y, colors }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 5 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: colors[i % colors.length],
          animation: `particle-fly-${i % 4} 0.5s ease-out forwards`,
          left: -4, top: -4,
        }} />
      ))}
    </div>
  );
}

function ExpandRing({ x, y, color }) {
  return (
    <div style={{
      position: 'absolute', left: x - 20, top: y - 20,
      width: '40px', height: '40px',
      borderRadius: '50%',
      border: `3px solid ${color}`,
      animation: 'ring-expand 0.4s ease-out forwards',
      pointerEvents: 'none', zIndex: 4,
    }} />
  );
}

// SVG Fish — faces left by default (eye at left, tail at right), flip when going right
function FishSVG({ goingLeft }) {
  return (
    <svg width="44" height="28" viewBox="0 0 44 28" style={{ transform: goingLeft ? 'none' : 'scaleX(-1)' }}>
      <ellipse cx="20" cy="14" rx="16" ry="10" fill="#60A5FA" />
      <polygon points="36,14 44,6 44,22" fill="#3B82F6" />
      <circle cx="12" cy="11" r="3" fill="white" />
      <circle cx="12" cy="11" r="1.5" fill="#1F2937" />
      <ellipse cx="22" cy="14" rx="3" ry="6" fill="#93C5FD" opacity="0.4" />
    </svg>
  );
}

// SVG Trash
function TrashSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <rect x="8" y="8" width="20" height="22" rx="3" fill="#B91C1C" opacity="0.85" />
      <rect x="6" y="5" width="24" height="4" rx="2" fill="#DC2626" />
      <line x1="14" y1="13" x2="14" y2="25" stroke="#FECACA" strokeWidth="1.5" />
      <line x1="18" y1="13" x2="18" y2="25" stroke="#FECACA" strokeWidth="1.5" />
      <line x1="22" y1="13" x2="22" y2="25" stroke="#FECACA" strokeWidth="1.5" />
    </svg>
  );
}

// SVG Snowflake
function SnowflakeMiniSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <g transform="translate(20,20)" stroke="#93C5FD" strokeWidth="2.5" fill="none" strokeLinecap="round">
        {[0, 60, 120].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-14" x2="0" y2="14" />
            <line x1="0" y1="-9" x2="-5" y2="-13" />
            <line x1="0" y1="-9" x2="5" y2="-13" />
            <line x1="0" y1="9" x2="-5" y2="13" />
            <line x1="0" y1="9" x2="5" y2="13" />
          </g>
        ))}
      </g>
      <circle cx="20" cy="20" r="2" fill="#BFDBFE" />
    </svg>
  );
}

// SVG Smog puff (hazard)
function SmogSVG() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="18" r="7" fill="#94A3B8" opacity="0.8" />
      <circle cx="10" cy="14" r="5" fill="#94A3B8" opacity="0.6" />
      <circle cx="20" cy="14" r="5" fill="#94A3B8" opacity="0.6" />
      <circle cx="15" cy="11" r="4" fill="#94A3B8" opacity="0.5" />
    </svg>
  );
}

function GameItem({ item, onTap }) {
  const isHazard = item.type === 'trash' || item.type === 'rain';
  const isSmog = item.type === 'rain';

  return (
    <div
      onPointerDown={(e) => { e.preventDefault(); onTap(item); }}
      style={{
        position: 'absolute',
        left: item.x - ITEM_SIZE / 2,
        top: item.y - ITEM_SIZE / 2,
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        background: isHazard
          ? isSmog
            ? 'radial-gradient(circle, rgba(148,163,184,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        animation: isHazard ? 'hazard-wobble 0.8s ease-in-out infinite' : 'item-float 1.5s ease-in-out infinite',
        filter: isHazard
          ? isSmog
            ? 'drop-shadow(0 0 5px rgba(148,163,184,0.4))'
            : 'drop-shadow(0 0 5px rgba(239,68,68,0.3))'
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {item.type === 'fish' && <FishSVG goingLeft={item.vx < 0} />}
      {item.type === 'trash' && <TrashSVG />}
      {item.type === 'snowflake' && <SnowflakeMiniSVG />}
      {item.type === 'rain' && <SmogSVG />}
    </div>
  );
}

// ====== MEMORY MATCH GAME ======
function MemoryMatchGame({ onComplete }) {
  const [phase, setPhase] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(MINI_GAME_DURATION + 5); // 15s for memory
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [checking, setChecking] = useState(false);
  const scoreRef = useRef(0);

  const animals = [
    { id: 'bear', color: '#F5F0E8', label: 'Bear',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><circle cx="20" cy="22" r="12" fill="#F5F0E8" /><circle cx="20" cy="14" r="9" fill="#FAF6F0" /><circle cx="12" cy="8" r="4" fill="#F5F0E8" /><circle cx="28" cy="8" r="4" fill="#F5F0E8" /><circle cx="17" cy="13" r="2" fill="#2D2D2D" /><circle cx="23" cy="13" r="2" fill="#2D2D2D" /><ellipse cx="20" cy="17" rx="3" ry="2" fill="#2D2D2D" /></svg> },
    { id: 'seal', color: '#94A3B8', label: 'Seal',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="24" rx="14" ry="8" fill="#94A3B8" /><circle cx="16" cy="16" r="7" fill="#B0BEC5" /><circle cx="14" cy="14" r="1.5" fill="#1F2937" /><circle cx="18" cy="14" r="1.5" fill="#1F2937" /><circle cx="16" cy="17" r="1" fill="#1F2937" /></svg> },
    { id: 'fox', color: '#F5F0E8', label: 'Fox',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><circle cx="20" cy="20" r="10" fill="#F5F0E8" /><polygon points="12,12 14,20 8,16" fill="#E8E4DD" /><polygon points="28,12 26,20 32,16" fill="#E8E4DD" /><circle cx="17" cy="18" r="1.5" fill="#1F2937" /><circle cx="23" cy="18" r="1.5" fill="#1F2937" /><circle cx="20" cy="22" r="1.2" fill="#1F2937" /><ellipse cx="20" cy="26" rx="6" ry="4" fill="white" /></svg> },
    { id: 'penguin', color: '#1F2937', label: 'Penguin',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="22" rx="10" ry="12" fill="#1F2937" /><ellipse cx="20" cy="24" rx="6" ry="8" fill="white" /><circle cx="17" cy="16" r="1.5" fill="white" /><circle cx="23" cy="16" r="1.5" fill="white" /><circle cx="17" cy="16" r="0.7" fill="#1F2937" /><circle cx="23" cy="16" r="0.7" fill="#1F2937" /><polygon points="20,19 18,22 22,22" fill="#F59E0B" /></svg> },
    { id: 'whale', color: '#3B82F6', label: 'Whale',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="22" rx="14" ry="9" fill="#60A5FA" /><ellipse cx="20" cy="25" rx="8" ry="5" fill="#93C5FD" /><circle cx="12" cy="19" r="2" fill="white" /><circle cx="12" cy="19" r="1" fill="#1F2937" /><path d="M30 16 Q34 8 38 14" fill="#3B82F6" /></svg> },
    { id: 'owl', color: '#E8E4DD', label: 'Owl',
      render: () => <svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="22" rx="10" ry="11" fill="#E8E4DD" /><circle cx="16" cy="18" r="4" fill="white" stroke="#D4CBC0" strokeWidth="0.5" /><circle cx="24" cy="18" r="4" fill="white" stroke="#D4CBC0" strokeWidth="0.5" /><circle cx="16" cy="18" r="2" fill="#F59E0B" /><circle cx="24" cy="18" r="2" fill="#F59E0B" /><circle cx="16" cy="18" r="1" fill="#1F2937" /><circle cx="24" cy="18" r="1" fill="#1F2937" /><polygon points="20,20 19,23 21,23" fill="#F59E0B" /></svg> },
  ];

  useEffect(() => {
    // Create pairs — pick 4 random animals, make pairs, shuffle
    const picked = [...animals].sort(() => Math.random() - 0.5).slice(0, 4);
    const pairs = [...picked, ...picked].sort(() => Math.random() - 0.5);
    setCards(pairs.map((a, i) => ({ ...a, idx: i })));
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase('results'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Check for match when 2 cards are flipped
  useEffect(() => {
    if (flipped.length !== 2) return;
    setChecking(true);
    const [a, b] = flipped;
    const cardA = cards[a];
    const cardB = cards[b];

    if (cardA.id === cardB.id) {
      // Match!
      setTimeout(() => {
        setMatched(prev => [...prev, cardA.id]);
        setScore(s => { const n = s + 1; scoreRef.current = n; return n; });
        setFlipped([]);
        setChecking(false);
        audio.miniCatch();
      }, 400);
    } else {
      // No match — flip back
      setTimeout(() => {
        setFlipped([]);
        setChecking(false);
        audio.miniHazard();
      }, 800);
    }
  }, [flipped, cards]);

  // Win early
  useEffect(() => {
    if (matched.length === 4 && phase === 'playing') {
      setTimeout(() => setPhase('results'), 500);
    }
  }, [matched.length, phase]);

  const handleFlip = (idx) => {
    if (checking || flipped.length >= 2) return;
    if (flipped.includes(idx)) return;
    if (matched.includes(cards[idx].id)) return;
    setFlipped(prev => [...prev, idx]);
    audio.buttonTap();
  };

  const startGame = () => setPhase('playing');

  useEffect(() => {
    if (phase !== 'results') return;
    const id = setTimeout(() => onComplete(scoreRef.current, 'memory'), 1500);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  if (phase === 'intro') {
    return <MiniGameIntro icon={<MatchIcon />} title="Memory Match!" desc="Find the matching pairs!" duration={MINI_GAME_DURATION + 5} onStart={startGame} />;
  }

  if (phase === 'results') {
    return <MiniGameResults score={score} />;
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)', zIndex: 60,
    }}>
      <MiniGameHeader title="Memory Match!" timeLeft={timeLeft} score={score} />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '8px',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '2 / 1',
        }}>
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(card.id);
            return (
              <button
                key={idx}
                onClick={() => handleFlip(idx)}
                style={{
                  borderRadius: '14px',
                  border: matched.includes(card.id)
                    ? '3px solid #22C55E'
                    : isFlipped
                    ? '3px solid #3B82F6'
                    : '3px solid #CBD5E1',
                  background: isFlipped
                    ? 'white'
                    : 'linear-gradient(145deg, #3B82F6, #2563EB)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s, border-color 0.2s',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg) scale(0.98)',
                  boxShadow: isFlipped
                    ? '0 2px 8px rgba(0,0,0,0.1)'
                    : '0 4px 0 #1D4ED8, 0 6px 8px rgba(0,0,0,0.15)',
                  minHeight: '60px',
                  padding: '4px',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  opacity: matched.includes(card.id) ? 0.6 : 1,
                }}
              >
                {isFlipped ? (
                  <div style={{ animation: 'icon-bounce 0.3s ease-out' }}>
                    {card.render()}
                  </div>
                ) : (
                  <div style={{
                    fontSize: '20px', color: 'white', fontWeight: 800,
                    fontFamily: "'Fredoka', sans-serif",
                  }}>
                    ?
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MatchIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <rect x="4" y="4" width="22" height="22" rx="4" fill="#3B82F6" />
      <rect x="30" y="4" width="22" height="22" rx="4" fill="#3B82F6" />
      <rect x="4" y="30" width="22" height="22" rx="4" fill="#3B82F6" />
      <rect x="30" y="30" width="22" height="22" rx="4" fill="#22C55E" />
      <text x="41" y="46" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Fredoka">!</text>
      <text x="15" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Fredoka">?</text>
      <text x="41" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Fredoka">?</text>
      <text x="15" y="46" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Fredoka">?</text>
    </svg>
  );
}

// Shared mini-game UI components
function MiniGameIntro({ icon, title, desc, duration, onStart }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 60,
      backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        background: 'white', borderRadius: '28px', padding: '28px 32px', textAlign: 'center',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        animation: 'modal-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{ marginBottom: '8px', animation: 'icon-bounce 0.6s ease-out' }}>
          {icon}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{
          fontSize: '14px', color: '#6B7280', marginBottom: '16px',
          fontFamily: "'Nunito', sans-serif",
        }}>
          {desc} {duration} seconds!
        </div>
        <button onClick={onStart} style={{
          padding: '14px 40px', borderRadius: '18px', border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          boxShadow: '0 4px 0 #1D4ED8, 0 6px 12px rgba(37,99,235,0.3)',
          color: 'white', fontSize: '20px', fontWeight: 700,
          cursor: 'pointer', fontFamily: "'Fredoka', sans-serif",
          minHeight: '52px',
        }}
          onPointerDown={e => e.currentTarget.style.transform = 'translateY(3px)'}
          onPointerUp={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}

function MiniGameResults({ score }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 60,
    }}>
      <div style={{
        background: 'white', borderRadius: '28px', padding: '24px', textAlign: 'center',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        animation: 'modal-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: '44px', marginBottom: '4px' }}>
          <StarBurst />
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937' }}>
          Score: {score}!
        </div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
          {score >= 5 ? 'Amazing!' : score >= 3 ? 'Great job!' : 'Nice try!'}
        </div>
      </div>
    </div>
  );
}

function StarBurst() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="#FEF3C7" />
      <path d="M24 8l4.5 9.1 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5z" fill="#FBBF24" />
    </svg>
  );
}

function MiniGameHeader({ title, timeLeft, score }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 14px',
      background: 'rgba(255,255,255,0.9)',
      borderBottom: '2px solid rgba(0,0,0,0.06)',
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '15px', fontWeight: 700, color: '#374151' }}>
        {title}
      </span>
      <span style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontWeight: 700,
        color: timeLeft <= 3 ? '#EF4444' : '#374151',
        animation: timeLeft <= 3 ? 'shake 0.3s ease-in-out infinite' : 'none',
        background: timeLeft <= 3 ? '#FEE2E2' : '#F3F4F6',
        padding: '2px 10px', borderRadius: '10px',
      }}>
        {timeLeft}s
      </span>
      <span style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: 700,
        color: '#059669', background: '#ECFDF5', padding: '2px 10px', borderRadius: '10px',
      }}>
        {score}
      </span>
    </div>
  );
}

// ====== CATCH GAME (Fish or Snowflake) ======
function CatchGame({ type, onComplete }) {
  const [phase, setPhase] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(MINI_GAME_DURATION);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [effects, setEffects] = useState([]);
  const [iceHeight, setIceHeight] = useState(0);
  const nextId = useRef(0);
  const scoreRef = useRef(0);
  const containerRef = useRef(null);
  const moveRef = useRef(null);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase('results'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setItems(prev => prev.map(item => ({
        ...item,
        x: item.x + (item.vx || 0) * dt,
        y: item.y + (item.vy || 0) * dt,
      })).filter(item => item.x > -60 && item.x < 500 && item.y > -60 && item.y < 700));
      moveRef.current = requestAnimationFrame(tick);
    };
    moveRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(moveRef.current);
  }, [phase]);

  useEffect(() => {
    if (effects.length === 0) return;
    const id = setTimeout(() => {
      setEffects(prev => prev.filter(e => Date.now() - e.time < 700));
    }, 700);
    return () => clearTimeout(id);
  }, [effects]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const getSize = () => {
      if (!containerRef.current) return { w: 300, h: 350 };
      const r = containerRef.current.getBoundingClientRect();
      return { w: r.width, h: r.height };
    };

    const spawn = () => {
      const { w, h } = getSize();
      const id = nextId.current++;
      const pad = ITEM_SIZE;

      if (type === 'fish') {
        const isTrash = Math.random() < 0.18;
        const fromLeft = Math.random() < 0.5;
        setItems(prev => [...prev, {
          id, type: isTrash ? 'trash' : 'fish',
          x: fromLeft ? -pad : w + pad,
          y: pad + Math.random() * (h - pad * 2),
          vx: (fromLeft ? 1 : -1) * (60 + Math.random() * 40),
          vy: (Math.random() - 0.5) * 20,
        }]);
      } else {
        const isSmog = Math.random() < 0.18;
        setItems(prev => [...prev, {
          id, type: isSmog ? 'rain' : 'snowflake',
          x: pad + Math.random() * (w - pad * 2),
          y: -pad,
          vx: (Math.random() - 0.5) * 20,
          vy: 60 + Math.random() * 40,
        }]);
      }
    };

    const interval = 400;
    const id = setInterval(spawn, interval);
    spawn(); spawn();
    return () => clearInterval(id);
  }, [phase, type]);

  const handleTap = useCallback((item) => {
    const isHazard = item.type === 'trash' || item.type === 'rain';
    setItems(prev => prev.filter(i => i.id !== item.id));
    const now = Date.now();

    if (isHazard) {
      const hazardColor = item.type === 'rain' ? '#94A3B8' : '#EF4444';
      const hazardBurstColors = item.type === 'rain'
        ? ['#94A3B8', '#B0BEC5', '#CBD5E1', '#E2E8F0']
        : ['#EF4444', '#FCA5A5', '#F87171', '#FECACA'];
      setEffects(prev => [...prev,
        { id: nextId.current++, type: 'text', x: item.x, y: item.y - 20, text: '-1!', color: hazardColor, time: now },
        { id: nextId.current++, type: 'burst', x: item.x, y: item.y, colors: hazardBurstColors, time: now },
        { id: nextId.current++, type: 'ring', x: item.x, y: item.y, color: hazardColor, time: now },
      ]);
      setScore(s => { const n = Math.max(0, s - 1); scoreRef.current = n; return n; });
      audio.miniHazard();
    } else {
      const colors = type === 'snowflake'
        ? ['#60A5FA', '#93C5FD', '#BFDBFE', 'white']
        : ['#FBBF24', '#34D399', '#60A5FA', '#F472B6'];
      setEffects(prev => [...prev,
        { id: nextId.current++, type: 'text', x: item.x, y: item.y - 20, text: '+1!', color: '#059669', time: now },
        { id: nextId.current++, type: 'burst', x: item.x, y: item.y, colors, time: now },
        { id: nextId.current++, type: 'ring', x: item.x, y: item.y, color: colors[0], time: now },
      ]);
      setScore(s => { const n = s + 1; scoreRef.current = n; return n; });
      audio.miniCatch();
      if (type === 'snowflake') setIceHeight(h => Math.min(50, h + 3));
    }
  }, [type]);

  const startGame = () => setPhase('playing');

  useEffect(() => {
    if (phase !== 'results') return;
    const id = setTimeout(() => onComplete(scoreRef.current, type), 1500);
    return () => clearTimeout(id);
  }, [phase, type, onComplete]);

  const titles = { fish: 'Fish Catch!', snowflake: 'Snowflake Catch!' };
  const bgGradients = {
    fish: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)',
    snowflake: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
  };

  const icons = {
    fish: <FishSVG goingLeft={false} />,
    snowflake: <SnowflakeMiniSVG />,
  };

  if (phase === 'intro') {
    return <MiniGameIntro icon={<div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons[type]}</div>} title={titles[type]} desc="Tap to catch!" duration={MINI_GAME_DURATION} onStart={startGame} />;
  }

  if (phase === 'results') {
    return <MiniGameResults score={score} />;
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: bgGradients[type], zIndex: 60,
    }}>
      <MiniGameHeader title={titles[type]} timeLeft={timeLeft} score={score} />
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
        {type === 'snowflake' && iceHeight > 0 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: `${iceHeight}px`,
            background: 'linear-gradient(180deg, #BAE6FD, #7DD3FC)',
            borderRadius: '8px 8px 0 0',
            transition: 'height 0.3s ease',
          }} />
        )}
        {items.map(item => <GameItem key={item.id} item={item} onTap={handleTap} />)}
        {effects.map(e => {
          if (e.type === 'text') return <FloatingText key={e.id} x={e.x - 15} y={e.y} text={e.text} color={e.color} />;
          if (e.type === 'burst') return <BurstParticles key={e.id} x={e.x} y={e.y} colors={e.colors} />;
          if (e.type === 'ring') return <ExpandRing key={e.id} x={e.x} y={e.y} color={e.color} />;
          return null;
        })}
      </div>
    </div>
  );
}

// ====== MAIN MINI-GAME ROUTER ======
export default function MiniGame({ type, onComplete }) {
  if (type === 'memory') {
    return <MemoryMatchGame onComplete={onComplete} />;
  }
  return <CatchGame type={type} onComplete={onComplete} />;
}
