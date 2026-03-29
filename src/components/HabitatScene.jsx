import React from 'react';
import PolarBear from './PolarBear';

export default function HabitatScene({ temp, belly, hasCubs, cubsAlive }) {
  // Sky color based on temperature
  const skyColor = temp < 1.5 ? '#1a1a4e' : temp < 2.0 ? '#2d3a6e' : temp < 2.5 ? '#6b5a3e' : '#c4602a';
  const skyGradEnd = temp < 1.5 ? '#2d4a7e' : temp < 2.0 ? '#4e6a8e' : temp < 2.5 ? '#9e7a4e' : '#e88040';

  // Ice/land
  const iceWidth = temp < 1.8 ? 100 : temp < 2.5 ? 60 : 20;
  const waterLevel = temp < 1.8 ? 75 : temp < 2.5 ? 65 : 55;

  // Stars visible when cold
  const showStars = temp < 2.0;
  const showAurora = temp < 1.8;
  const showGrass = temp > 2.2;

  return (
    <svg viewBox="0 0 300 160" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyColor} />
          <stop offset="100%" stopColor={skyGradEnd} />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F4FD" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="300" height="160" fill="url(#sky)" />

      {/* Stars */}
      {showStars && (
        <g>
          {[
            [30, 15], [80, 25], [140, 10], [200, 20], [260, 12],
            [50, 35], [120, 30], [230, 35], [180, 8], [270, 28],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.8 + Math.random() * 0.5} fill="white"
              opacity={0.5 + Math.random() * 0.5}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}

      {/* Aurora */}
      {showAurora && (
        <g opacity="0.3">
          <path d="M0 30 Q75 10 150 35 Q225 15 300 30" stroke="#4ADE80" strokeWidth="3" fill="none" opacity="0.5">
            <animate attributeName="d" values="M0 30 Q75 10 150 35 Q225 15 300 30;M0 25 Q75 20 150 28 Q225 22 300 25;M0 30 Q75 10 150 35 Q225 15 300 30" dur="5s" repeatCount="indefinite" />
          </path>
          <path d="M0 35 Q100 20 200 40 Q250 25 300 38" stroke="#34D399" strokeWidth="2" fill="none" opacity="0.4">
            <animate attributeName="d" values="M0 35 Q100 20 200 40 Q250 25 300 38;M0 32 Q100 28 200 34 Q250 30 300 35;M0 35 Q100 20 200 40 Q250 25 300 38" dur="4s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* Distant icebergs */}
      {temp < 2.2 && (
        <g>
          <polygon points="20,70 30,55 40,70" fill="#CBD5E1" opacity="0.5" />
          <polygon points="260,68 275,50 290,68" fill="#CBD5E1" opacity="0.4" />
          {temp < 1.8 && <polygon points="60,72 75,58 90,72" fill="#CBD5E1" opacity="0.3" />}
        </g>
      )}

      {/* Water */}
      <rect x="0" y={waterLevel} width="300" height={160 - waterLevel} fill="url(#water)" />

      {/* Water waves */}
      <path d={`M0 ${waterLevel + 3} Q30 ${waterLevel} 60 ${waterLevel + 3} Q90 ${waterLevel + 6} 120 ${waterLevel + 3} Q150 ${waterLevel} 180 ${waterLevel + 3} Q210 ${waterLevel + 6} 240 ${waterLevel + 3} Q270 ${waterLevel} 300 ${waterLevel + 3}`}
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
        <animate attributeName="d"
          values={`M0 ${waterLevel + 3} Q30 ${waterLevel} 60 ${waterLevel + 3} Q90 ${waterLevel + 6} 120 ${waterLevel + 3} Q150 ${waterLevel} 180 ${waterLevel + 3} Q210 ${waterLevel + 6} 240 ${waterLevel + 3} Q270 ${waterLevel} 300 ${waterLevel + 3};M0 ${waterLevel + 1} Q30 ${waterLevel + 4} 60 ${waterLevel + 1} Q90 ${waterLevel - 2} 120 ${waterLevel + 1} Q150 ${waterLevel + 4} 180 ${waterLevel + 1} Q210 ${waterLevel - 2} 240 ${waterLevel + 1} Q270 ${waterLevel + 4} 300 ${waterLevel + 1};M0 ${waterLevel + 3} Q30 ${waterLevel} 60 ${waterLevel + 3} Q90 ${waterLevel + 6} 120 ${waterLevel + 3} Q150 ${waterLevel} 180 ${waterLevel + 3} Q210 ${waterLevel + 6} 240 ${waterLevel + 3} Q270 ${waterLevel} 300 ${waterLevel + 3}`}
          dur="3s" repeatCount="indefinite" />
      </path>

      {/* Ice platform */}
      <ellipse cx="150" cy={waterLevel + 2} rx={iceWidth * 1.5} ry="12" fill="url(#ice)" stroke="#93C5FD" strokeWidth="0.5" />
      {temp < 2.0 && (
        <ellipse cx="150" cy={waterLevel} rx={iceWidth * 1.3} ry="8" fill="#F0F9FF" opacity="0.6" />
      )}

      {/* Grass/flowers on land when warm */}
      {showGrass && (
        <g>
          {[80, 100, 200, 220, 240].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={waterLevel + 5} x2={x} y2={waterLevel - 2} stroke="#4ADE80" strokeWidth="1.5" />
              <line x1={x} y1={waterLevel} x2={x - 3} y2={waterLevel - 4} stroke="#4ADE80" strokeWidth="1" />
            </g>
          ))}
          {temp > 2.5 && [110, 210].map((x, i) => (
            <circle key={i} cx={x} cy={waterLevel - 1} r="2.5" fill="#F472B6" />
          ))}
        </g>
      )}

      {/* Bear */}
      <g transform={`translate(${75}, ${waterLevel - 62}) scale(0.4)`}>
        <PolarBear belly={belly} hasCubs={hasCubs} cubsAlive={cubsAlive} temp={temp} />
      </g>
    </svg>
  );
}
