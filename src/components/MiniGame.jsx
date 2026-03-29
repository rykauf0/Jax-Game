import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MINI_GAME_DURATION } from '../data/constants';
import { audio } from '../utils/audio';

const ITEM_SIZE = 54; // px - big enough for child fingers

function FloatingText({ x, y, text, color }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      color, fontWeight: 800, fontSize: '18px',
      fontFamily: "'Fredoka', sans-serif",
      pointerEvents: 'none',
      animation: 'float-up 0.7s ease-out forwards',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      zIndex: 10,
    }}>
      {text}
    </div>
  );
}

function BurstParticles({ x, y, colors }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 5 }}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        return (
          <div key={i} style={{
            position: 'absolute',
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: colors[i % colors.length],
            animation: `particle-fly-${i % 4} 0.5s ease-out forwards`,
            left: -4, top: -4,
          }} />
        );
      })}
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

function GameItem({ item, onTap }) {
  const icons = {
    fish: '🐟', trash: '🗑️', bubble: '💨', snowflake: '❄️', rain: '💧',
  };
  const isHazard = item.type === 'trash' || item.type === 'rain';

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
        fontSize: ITEM_SIZE * 0.65,
        cursor: 'pointer',
        borderRadius: '50%',
        background: isHazard
          ? 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)'
          : item.type === 'bubble'
          ? 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.05) 70%)'
          : 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        animation: isHazard ? 'hazard-wobble 0.8s ease-in-out infinite' : 'item-float 1.5s ease-in-out infinite',
        filter: isHazard ? 'drop-shadow(0 0 4px rgba(239,68,68,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {icons[item.type]}
    </div>
  );
}

export default function MiniGame({ type, onComplete }) {
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

  // Timer
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

  // Move items with requestAnimationFrame for smooth movement
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
      })).filter(item => item.x > -60 && item.x < 400 && item.y > -60 && item.y < 600));
      moveRef.current = requestAnimationFrame(tick);
    };
    moveRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(moveRef.current);
  }, [phase]);

  // Decay effects
  useEffect(() => {
    if (effects.length === 0) return;
    const id = setTimeout(() => {
      setEffects(prev => prev.filter(e => Date.now() - e.time < 700));
    }, 700);
    return () => clearTimeout(id);
  }, [effects]);

  // Spawn items
  useEffect(() => {
    if (phase !== 'playing') return;
    const getContainerSize = () => {
      if (!containerRef.current) return { w: 300, h: 350 };
      const r = containerRef.current.getBoundingClientRect();
      return { w: r.width, h: r.height };
    };

    const spawn = () => {
      const { w, h } = getContainerSize();
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
      } else if (type === 'pollution') {
        setItems(prev => [...prev, {
          id, type: 'bubble',
          x: pad + Math.random() * (w - pad * 2),
          y: h + pad,
          vx: (Math.random() - 0.5) * 15,
          vy: -(70 + Math.random() * 50),
        }]);
      } else if (type === 'snowflake') {
        const isRain = Math.random() < 0.18;
        setItems(prev => [...prev, {
          id, type: isRain ? 'rain' : 'snowflake',
          x: pad + Math.random() * (w - pad * 2),
          y: -pad,
          vx: (Math.random() - 0.5) * 20,
          vy: 60 + Math.random() * 40,
        }]);
      }
    };

    // Faster spawn rate for more action
    const interval = type === 'pollution' ? 380 : 420;
    const id = setInterval(spawn, interval);
    // Spawn a few immediately
    spawn(); spawn();
    return () => clearInterval(id);
  }, [phase, type]);

  const handleTap = useCallback((item) => {
    const isHazard = item.type === 'trash' || item.type === 'rain';

    setItems(prev => prev.filter(i => i.id !== item.id));

    const now = Date.now();
    if (isHazard) {
      setEffects(prev => [...prev,
        { id: nextId.current++, type: 'text', x: item.x, y: item.y - 20, text: '-1!', color: '#EF4444', time: now },
        { id: nextId.current++, type: 'burst', x: item.x, y: item.y, colors: ['#EF4444', '#FCA5A5', '#F87171', '#FECACA'], time: now },
        { id: nextId.current++, type: 'ring', x: item.x, y: item.y, color: '#EF4444', time: now },
      ]);
      setScore(s => { const n = Math.max(0, s - 1); scoreRef.current = n; return n; });
      audio.miniHazard();
    } else {
      const label = type === 'pollution' ? 'POP!' : '+1!';
      const colors = type === 'pollution'
        ? ['#A855F7', '#C084FC', '#E9D5FF', '#DDD6FE']
        : type === 'snowflake'
        ? ['#60A5FA', '#93C5FD', '#BFDBFE', 'white']
        : ['#FBBF24', '#34D399', '#60A5FA', '#F472B6'];

      setEffects(prev => [...prev,
        { id: nextId.current++, type: 'text', x: item.x, y: item.y - 20, text: label, color: '#059669', time: now },
        { id: nextId.current++, type: 'burst', x: item.x, y: item.y, colors, time: now },
        { id: nextId.current++, type: 'ring', x: item.x, y: item.y, color: colors[0], time: now },
      ]);
      setScore(s => { const n = s + 1; scoreRef.current = n; return n; });
      audio.miniCatch();
      if (type === 'snowflake') setIceHeight(h => Math.min(50, h + 3));
    }
  }, [type]);

  const startGame = () => setPhase('playing');

  // Auto-dismiss results
  useEffect(() => {
    if (phase !== 'results') return;
    const id = setTimeout(() => onComplete(scoreRef.current, type), 1500);
    return () => clearTimeout(id);
  }, [phase, type, onComplete]);

  const titles = { fish: 'Fish Catch!', pollution: 'Pollution Pop!', snowflake: 'Snowflake Catch!' };
  const icons = { fish: '🐟', pollution: '💨', snowflake: '❄️' };
  const bgGradients = {
    fish: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)',
    pollution: 'linear-gradient(180deg, #EDE9FE 0%, #DDD6FE 100%)',
    snowflake: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
  };

  // Intro screen
  if (phase === 'intro') {
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
          <div style={{
            fontSize: '56px', marginBottom: '8px',
            animation: 'icon-bounce 0.6s ease-out',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          }}>
            {icons[type]}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
            {titles[type]}
          </div>
          <div style={{
            fontSize: '13px', color: '#6B7280', marginBottom: '16px',
            fontFamily: "'Nunito', sans-serif",
          }}>
            Tap to catch! {MINI_GAME_DURATION} seconds!
          </div>
          <button onClick={startGame} style={{
            padding: '12px 36px', borderRadius: '18px', border: 'none',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            boxShadow: '0 4px 0 #1D4ED8, 0 6px 12px rgba(37,99,235,0.3)',
            color: 'white', fontSize: '20px', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Fredoka', sans-serif",
            transition: 'transform 0.1s',
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

  // Results screen
  if (phase === 'results') {
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
          <div style={{ fontSize: '44px', marginBottom: '4px' }}>🎉</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1F2937' }}>
            Score: {score}!
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            {score >= 5 ? 'Amazing!' : score >= 3 ? 'Great job!' : 'Nice try!'}
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: bgGradients[type], zIndex: 60,
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.85)',
        borderBottom: '2px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: '15px', fontWeight: 700, color: '#374151',
        }}>
          {icons[type]} {titles[type]}
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

      {/* Game area */}
      <div ref={containerRef} style={{
        flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none',
      }}>
        {/* Snowflake ice shelf */}
        {type === 'snowflake' && iceHeight > 0 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: `${iceHeight}px`,
            background: 'linear-gradient(180deg, #BAE6FD, #7DD3FC)',
            borderRadius: '8px 8px 0 0',
            transition: 'height 0.3s ease',
            boxShadow: '0 -2px 8px rgba(125,211,252,0.3)',
          }} />
        )}

        {/* Items */}
        {items.map(item => (
          <GameItem key={item.id} item={item} onTap={handleTap} />
        ))}

        {/* Effects */}
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
