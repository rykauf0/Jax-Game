import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MINI_GAME_DURATION } from '../data/constants';
import { audio } from '../utils/audio';

// SVG Fish component
function FishSVG({ x, y, size }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <ellipse cx={size * 0.45} cy={size * 0.5} rx={size * 0.4} ry={size * 0.28} fill="#60A5FA" />
      <polygon points={`${size * 0.8},${size * 0.5} ${size},${size * 0.25} ${size},${size * 0.75}`} fill="#3B82F6" />
      <circle cx={size * 0.3} cy={size * 0.42} r={size * 0.07} fill="white" />
      <circle cx={size * 0.3} cy={size * 0.42} r={size * 0.04} fill="#1F2937" />
      <ellipse cx={size * 0.55} cy={size * 0.5} rx={size * 0.05} ry={size * 0.12} fill="#93C5FD" opacity="0.5" />
    </g>
  );
}

// SVG Trash component
function TrashSVG({ x, y, size }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <rect x={size * 0.2} y={size * 0.15} width={size * 0.6} height={size * 0.7} rx="3" fill="#EF4444" opacity="0.8" />
      <line x1={size * 0.3} y1={size * 0.3} x2={size * 0.7} y2={size * 0.7} stroke="#FCA5A5" strokeWidth="2" />
      <line x1={size * 0.7} y1={size * 0.3} x2={size * 0.3} y2={size * 0.7} stroke="#FCA5A5" strokeWidth="2" />
    </g>
  );
}

// SVG Pollution bubble
function PollutionSVG({ x, y, size }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <circle cx={size / 2} cy={size / 2} r={size * 0.42} fill="url(#pollGrad)" />
      <circle cx={size * 0.38} cy={size * 0.35} r={size * 0.1} fill="rgba(255,255,255,0.3)" />
    </g>
  );
}

// SVG Snowflake
function SnowflakeSVG({ x, y, size, rotation }) {
  const r = size * 0.4;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      {[0, 60, 120].map(angle => (
        <g key={angle} transform={`rotate(${angle})`}>
          <line x1={0} y1={-r} x2={0} y2={r} stroke="#BFDBFE" strokeWidth="2" />
          <line x1={0} y1={-r * 0.6} x2={-r * 0.3} y2={-r * 0.85} stroke="#BFDBFE" strokeWidth="1.5" />
          <line x1={0} y1={-r * 0.6} x2={r * 0.3} y2={-r * 0.85} stroke="#BFDBFE" strokeWidth="1.5" />
          <line x1={0} y1={r * 0.6} x2={-r * 0.3} y2={r * 0.85} stroke="#BFDBFE" strokeWidth="1.5" />
          <line x1={0} y1={r * 0.6} x2={r * 0.3} y2={r * 0.85} stroke="#BFDBFE" strokeWidth="1.5" />
        </g>
      ))}
      <circle cx={0} cy={0} r={size * 0.06} fill="#DBEAFE" />
    </g>
  );
}

// SVG Raindrop
function RaindropSVG({ x, y, size }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d={`M0 ${-size * 0.35} Q${size * 0.3} ${size * 0.1} 0 ${size * 0.35} Q${-size * 0.3} ${size * 0.1} 0 ${-size * 0.35}`}
        fill="#EF4444" opacity="0.7" />
      <circle cx={0} cy={0} r={size * 0.12} fill="#FCA5A5" opacity="0.3" />
    </g>
  );
}

// Particle effect
function Particles({ particles }) {
  return particles.map(p => (
    <circle key={p.id} cx={p.x} cy={p.y} r={p.r || 3}
      fill={p.color} opacity={p.opacity}>
    </circle>
  ));
}

// Floating text
function FloatingTexts({ texts }) {
  return texts.map(t => (
    <text key={t.id} x={t.x} y={t.y} textAnchor="middle"
      fill={t.color} fontSize="16" fontWeight="bold" fontFamily="Fredoka, sans-serif"
      opacity={t.opacity}>
      {t.text}
    </text>
  ));
}

function useSpawnLoop(gameActive, spawnFn, interval) {
  useEffect(() => {
    if (!gameActive) return;
    const id = setInterval(spawnFn, interval);
    return () => clearInterval(id);
  }, [gameActive, spawnFn, interval]);
}

export default function MiniGame({ type, onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro, playing, results
  const [timeLeft, setTimeLeft] = useState(MINI_GAME_DURATION);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [particles, setParticles] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [iceHeight, setIceHeight] = useState(0);
  const nextId = useRef(0);
  const scoreRef = useRef(0);

  const W = 300, H = 280;

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Move items
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setItems(prev => prev.map(item => {
        if (type === 'fish') return { ...item, x: item.x + item.vx };
        if (type === 'pollution') return { ...item, y: item.y + item.vy };
        if (type === 'snowflake') return { ...item, y: item.y + item.vy, rotation: (item.rotation || 0) + 2 };
        return item;
      }).filter(item => {
        if (type === 'fish') return item.x > -50 && item.x < W + 50;
        if (type === 'pollution') return item.y > -50;
        if (type === 'snowflake') return item.y < H + 50;
        return true;
      }));
    }, 50);
    return () => clearInterval(id);
  }, [phase, type]);

  // Decay particles and floating texts
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p, x: p.x + p.vx, y: p.y + p.vy, opacity: p.opacity - 0.05,
      })).filter(p => p.opacity > 0));
      setFloatingTexts(prev => prev.map(t => ({
        ...t, y: t.y - 1.5, opacity: t.opacity - 0.03,
      })).filter(t => t.opacity > 0));
    }, 50);
    return () => clearInterval(id);
  }, [phase]);

  const spawnItem = useCallback(() => {
    const id = nextId.current++;
    if (type === 'fish') {
      const isTrash = Math.random() < 0.2;
      setItems(prev => [...prev, {
        id, type: isTrash ? 'trash' : 'fish',
        x: Math.random() < 0.5 ? -20 : W + 20,
        y: 40 + Math.random() * (H - 80),
        vx: (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random()),
        size: 44,
      }]);
    } else if (type === 'pollution') {
      setItems(prev => [...prev, {
        id, type: 'bubble',
        x: 20 + Math.random() * (W - 40),
        y: H + 20,
        vy: -(1.5 + Math.random() * 1.5),
        size: 40 + Math.random() * 10,
      }]);
    } else if (type === 'snowflake') {
      const isRain = Math.random() < 0.18;
      setItems(prev => [...prev, {
        id, type: isRain ? 'rain' : 'snowflake',
        x: 20 + Math.random() * (W - 40),
        y: -20,
        vy: 1.5 + Math.random() * 1.5,
        size: 36 + Math.random() * 10,
        rotation: Math.random() * 360,
      }]);
    }
  }, [type]);

  useSpawnLoop(phase === 'playing', spawnItem, type === 'pollution' ? 500 : 600);

  const handleTap = useCallback((item, e) => {
    e.stopPropagation();
    const isHazard = item.type === 'trash' || item.type === 'rain';

    // Remove item
    setItems(prev => prev.filter(i => i.id !== item.id));

    // Create particles
    const burstColor = isHazard ? '#EF4444' : type === 'pollution' ? '#A855F7' : '#60A5FA';
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: nextId.current++,
      x: item.x, y: item.y,
      vx: Math.cos(i * Math.PI / 4) * 3,
      vy: Math.sin(i * Math.PI / 4) * 3,
      color: isHazard ? ['#EF4444', '#FCA5A5'][i % 2] : [burstColor, '#FBBF24', '#34D399'][i % 3],
      opacity: 1, r: 3,
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Floating text
    if (isHazard) {
      setFloatingTexts(prev => [...prev, {
        id: nextId.current++, x: item.x, y: item.y, text: '-1!', color: '#EF4444', opacity: 1,
      }]);
      setScore(s => { const n = Math.max(0, s - 1); scoreRef.current = n; return n; });
      audio.miniHazard();
    } else {
      const pts = type === 'pollution' ? 1 : type === 'fish' ? 1 : 1;
      const label = type === 'fish' ? '+6!' : type === 'pollution' ? 'POP!' : '+1!';
      setFloatingTexts(prev => [...prev, {
        id: nextId.current++, x: item.x, y: item.y, text: label, color: '#10B981', opacity: 1,
      }]);
      setScore(s => { const n = s + pts; scoreRef.current = n; return n; });
      audio.miniCatch();
      if (type === 'snowflake') setIceHeight(h => Math.min(60, h + 4));
    }
  }, [type]);

  const startGame = () => setPhase('playing');

  const finishResults = () => {
    onComplete(scoreRef.current, type);
  };

  // Auto-dismiss results after 1.5s
  useEffect(() => {
    if (phase !== 'results') return;
    const id = setTimeout(finishResults, 1500);
    return () => clearTimeout(id);
  }, [phase]);

  const titles = { fish: '🐟 Fish Catch!', pollution: '💨 Pollution Pop!', snowflake: '❄️ Snowflake Catch!' };
  const bgColors = { fish: '#EFF6FF', pollution: '#F5F3FF', snowflake: '#EFF6FF' };

  if (phase === 'intro') {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 60,
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px', textAlign: 'center',
          fontFamily: 'Fredoka, Nunito, sans-serif', animation: 'modal-pop 0.3s ease-out',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {type === 'fish' ? '🐟' : type === 'pollution' ? '💨' : '❄️'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
            {titles[type]}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
            Tap to catch! {MINI_GAME_DURATION} seconds!
          </div>
          <button onClick={startGame} style={{
            padding: '10px 32px', borderRadius: '20px', border: 'none',
            background: '#3B82F6', color: 'white', fontSize: '18px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Fredoka, Nunito, sans-serif',
          }}>
            Let's Go!
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 60,
      }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px', textAlign: 'center',
          fontFamily: 'Fredoka, Nunito, sans-serif', animation: 'modal-pop 0.3s ease-out',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '4px' }}>🎉</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>
            Score: {score}!
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            Great job!
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      background: bgColors[type], zIndex: 60,
    }}>
      {/* Timer bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', background: 'white', borderBottom: '2px solid #E5E7EB',
      }}>
        <span style={{
          fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '14px', fontWeight: 700,
        }}>
          {titles[type]}
        </span>
        <span style={{
          fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '16px', fontWeight: 700,
          color: timeLeft <= 2 ? '#EF4444' : '#1F2937',
          animation: timeLeft <= 2 ? 'bear-shiver 0.2s ease-in-out infinite' : 'none',
        }}>
          ⏱️ {timeLeft}s
        </span>
        <span style={{
          fontFamily: 'Fredoka, Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#059669',
        }}>
          Score: {score}
        </span>
      </div>

      {/* Game area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="pollGrad">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>

          {/* Snowflake ice shelf */}
          {type === 'snowflake' && iceHeight > 0 && (
            <rect x="0" y={H - iceHeight} width={W} height={iceHeight} fill="#BAE6FD" rx="4" opacity="0.7" />
          )}

          {/* Items */}
          {items.map(item => (
            <g key={item.id} onClick={(e) => handleTap(item, e)} style={{ cursor: 'pointer' }}>
              {/* Invisible larger tap target */}
              <circle cx={item.x} cy={item.y} r={24} fill="transparent" />
              {item.type === 'fish' && <FishSVG x={item.x} y={item.y} size={item.size} />}
              {item.type === 'trash' && <TrashSVG x={item.x} y={item.y} size={item.size} />}
              {item.type === 'bubble' && <PollutionSVG x={item.x} y={item.y} size={item.size} />}
              {item.type === 'snowflake' && <SnowflakeSVG x={item.x} y={item.y} size={item.size} rotation={item.rotation || 0} />}
              {item.type === 'rain' && <RaindropSVG x={item.x} y={item.y} size={item.size} />}
            </g>
          ))}

          {/* Particles */}
          <Particles particles={particles} />
          <FloatingTexts texts={floatingTexts} />
        </svg>
      </div>
    </div>
  );
}
