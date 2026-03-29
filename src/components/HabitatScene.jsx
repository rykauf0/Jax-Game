import React, { useMemo } from 'react';
import PolarBear from './PolarBear';

export default function HabitatScene({ temp, belly, hasCubs, cubsAlive }) {
  // Sky gradient based on temperature
  const sky = temp < 1.5
    ? { top: '#0F1B3D', bot: '#1E3A5F', starOpacity: 0.8 }
    : temp < 2.0
    ? { top: '#1A2744', bot: '#2D5A7E', starOpacity: 0.4 }
    : temp < 2.5
    ? { top: '#4A3520', bot: '#8B6914', starOpacity: 0 }
    : { top: '#7C2D12', bot: '#C2410C', starOpacity: 0 };

  // Ice
  const iceRx = temp < 1.8 ? 140 : temp < 2.5 ? 90 : 45;
  const waterY = temp < 1.8 ? 145 : temp < 2.5 ? 135 : 125;
  const showAurora = temp < 1.8;
  const showGrass = temp > 2.2;

  // Deterministic stars
  const stars = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      x: ((i * 137.5) % 300),
      y: ((i * 97.3) % 70) + 5,
      r: 0.6 + (i % 3) * 0.4,
      delay: (i * 0.7) % 4,
      dur: 2 + (i % 4),
    })),
  []);

  // Deterministic cloud puffs
  const clouds = useMemo(() => [
    { cx: 45, cy: 35, rx: 22, ry: 8 },
    { cx: 65, cy: 30, rx: 18, ry: 7 },
    { cx: 55, cy: 38, rx: 15, ry: 6 },
    { cx: 220, cy: 45, rx: 20, ry: 7 },
    { cx: 240, cy: 40, rx: 16, ry: 6 },
    { cx: 230, cy: 48, rx: 14, ry: 5 },
  ], []);

  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          <stop offset="100%" stopColor={sky.bot} />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="iceGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="50%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="auroraGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4ADE80" stopOpacity="0" />
          <stop offset="30%" stopColor="#4ADE80" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#818CF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="300" height="200" fill="url(#skyGrad)" />

      {/* Stars */}
      {sky.starOpacity > 0 && stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={sky.starOpacity * 0.5}>
          <animate attributeName="opacity"
            values={`${sky.starOpacity * 0.2};${sky.starOpacity * 0.8};${sky.starOpacity * 0.2}`}
            dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Moon glow */}
      {temp < 2.0 && (
        <g>
          <circle cx="260" cy="30" r="30" fill="url(#moonGlow)" />
          <circle cx="260" cy="30" r="10" fill="#FEF9C3" opacity="0.6" />
          <circle cx="260" cy="30" r="7" fill="#FEF3C7" opacity="0.3" />
        </g>
      )}

      {/* Aurora Borealis */}
      {showAurora && (
        <g>
          <path d="M0 40 Q50 20 100 35 Q150 18 200 38 Q250 22 300 35" stroke="url(#auroraGrad1)" strokeWidth="12" fill="none" opacity="0.5">
            <animate attributeName="d"
              values="M0 40 Q50 20 100 35 Q150 18 200 38 Q250 22 300 35;M0 35 Q50 28 100 30 Q150 25 200 32 Q250 28 300 30;M0 40 Q50 20 100 35 Q150 18 200 38 Q250 22 300 35"
              dur="6s" repeatCount="indefinite" />
          </path>
          <path d="M0 48 Q70 30 140 45 Q210 28 300 42" stroke="url(#auroraGrad1)" strokeWidth="8" fill="none" opacity="0.35">
            <animate attributeName="d"
              values="M0 48 Q70 30 140 45 Q210 28 300 42;M0 42 Q70 38 140 38 Q210 35 300 38;M0 48 Q70 30 140 45 Q210 28 300 42"
              dur="5s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* Clouds - drift slowly */}
      <g opacity={temp < 2.0 ? 0.25 : 0.4}>
        {clouds.map((c, i) => (
          <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="white">
            <animate attributeName="cx" values={`${c.cx};${c.cx + 8};${c.cx}`} dur={`${12 + i * 3}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
      </g>

      {/* Distant mountains/icebergs */}
      {temp < 2.3 && (
        <g opacity="0.3">
          <polygon points="5,145 25,100 45,145" fill="#94A3B8" />
          <polygon points="15,145 25,108 35,145" fill="#CBD5E1" />
          <polygon points="245,140 268,92 290,140" fill="#94A3B8" />
          <polygon points="255,140 268,100 280,140" fill="#CBD5E1" />
          {temp < 1.8 && (
            <>
              <polygon points="60,148 80,112 100,148" fill="#94A3B8" opacity="0.5" />
              <polygon points="200,148 215,118 230,148" fill="#94A3B8" opacity="0.5" />
            </>
          )}
        </g>
      )}

      {/* Water */}
      <rect x="0" y={waterY} width="300" height={200 - waterY} fill="url(#waterGrad)" />

      {/* Water surface shimmer */}
      <g>
        {[0, 60, 120, 180, 240].map((x, i) => (
          <rect key={i} x={x} y={waterY} width="40" height="2" fill="white" opacity="0.08" rx="1">
            <animate attributeName="opacity" values="0.04;0.12;0.04" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="x" values={`${x};${x + 5};${x}`} dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>

      {/* Animated waves */}
      <path fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
        <animate attributeName="d"
          values={`M0 ${waterY + 4} Q30 ${waterY + 1} 60 ${waterY + 4} Q90 ${waterY + 7} 120 ${waterY + 4} Q150 ${waterY + 1} 180 ${waterY + 4} Q210 ${waterY + 7} 240 ${waterY + 4} Q270 ${waterY + 1} 300 ${waterY + 4};M0 ${waterY + 2} Q30 ${waterY + 5} 60 ${waterY + 2} Q90 ${waterY - 1} 120 ${waterY + 2} Q150 ${waterY + 5} 180 ${waterY + 2} Q210 ${waterY - 1} 240 ${waterY + 2} Q270 ${waterY + 5} 300 ${waterY + 2};M0 ${waterY + 4} Q30 ${waterY + 1} 60 ${waterY + 4} Q90 ${waterY + 7} 120 ${waterY + 4} Q150 ${waterY + 1} 180 ${waterY + 4} Q210 ${waterY + 7} 240 ${waterY + 4} Q270 ${waterY + 1} 300 ${waterY + 4}`}
          dur="4s" repeatCount="indefinite" />
      </path>

      {/* ICE PLATFORM - layered for depth */}
      <g>
        {/* Shadow */}
        <ellipse cx="150" cy={waterY + 6} rx={iceRx + 5} ry="8" fill="#1E40AF" opacity="0.2" />
        {/* Main ice */}
        <ellipse cx="150" cy={waterY + 1} rx={iceRx} ry="14" fill="url(#iceGlow)" />
        {/* Ice highlight */}
        <ellipse cx="140" cy={waterY - 2} rx={iceRx * 0.7} ry="8" fill="white" opacity="0.35" />
        {/* Ice edge detail */}
        {temp < 2.0 && (
          <>
            <ellipse cx="150" cy={waterY - 1} rx={iceRx * 0.85} ry="10" fill="#F0F9FF" opacity="0.3" />
            {/* Ice cracks when thin */}
            {temp > 1.5 && (
              <g opacity="0.2" stroke="#64748B" strokeWidth="0.5" fill="none">
                <path d={`M${150 - iceRx * 0.3} ${waterY} l10 -3 l8 2`} />
                <path d={`M${150 + iceRx * 0.2} ${waterY + 2} l-5 -4 l3 -2`} />
              </g>
            )}
          </>
        )}
      </g>

      {/* Grass/flowers when warm */}
      {showGrass && (
        <g>
          {[70, 85, 100, 200, 215, 230].map((x, i) => (
            <g key={i} opacity="0.7">
              <line x1={x} y1={waterY + 4} x2={x + (i % 2 ? 2 : -2)} y2={waterY - 5} stroke="#4ADE80" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="x2" values={`${x + 2};${x - 1};${x + 2}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </line>
            </g>
          ))}
          {temp > 2.5 && [90, 210, 110].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={waterY - 3} r="3" fill={['#F472B6', '#FBBF24', '#A78BFA'][i]} opacity="0.8">
                <animate attributeName="r" values="2.5;3.5;2.5" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>
      )}

      {/* Floating snow particles when cold */}
      {temp < 2.0 && (
        <g>
          {Array.from({ length: 8 }, (_, i) => {
            const x = ((i * 43) % 280) + 10;
            return (
              <circle key={i} cx={x} cy={0} r={1 + (i % 2)} fill="white" opacity="0.5">
                <animate attributeName="cy" values={`${(i * 23) % 60};200;${(i * 23) % 60}`}
                  dur={`${8 + i * 2}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${x};${x + 15};${x}`}
                  dur={`${6 + i}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </g>
      )}

      {/* === THE BEAR === centered, big, prominent */}
      <g transform={`translate(${hasCubs && cubsAlive ? 40 : 50}, ${waterY - 80}) scale(0.52)`}>
        <PolarBear belly={belly} hasCubs={hasCubs} cubsAlive={cubsAlive} />
      </g>
    </svg>
  );
}
