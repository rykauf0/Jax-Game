import React from 'react';

export default function PolarBear({ belly, hasCubs, cubsAlive }) {
  const mood = belly > 70 ? 'happy' : belly > 40 ? 'okay' : 'sad';

  return (
    <g>
      <defs>
        <radialGradient id="bearFur" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F0E8" />
          <stop offset="100%" stopColor="#E8E0D4" />
        </radialGradient>
        <radialGradient id="bearFurHead" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FAF6F0" />
          <stop offset="100%" stopColor="#EDE8E0" />
        </radialGradient>
        <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB4C0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFB4C0" stopOpacity="0" />
        </radialGradient>
        <filter id="bearShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#00000022" />
        </filter>
      </defs>

      {/* Main bear group with mood animation */}
      <g filter="url(#bearShadow)">
        <g>
          {/* Breathing/bouncing animation applied via CSS */}
          <g className={`bear-mood-${mood}`}>
            {/* BODY - big round chunky body */}
            <ellipse cx="100" cy="105" rx="44" ry="38" fill="url(#bearFur)" />
            {/* Belly highlight */}
            <ellipse cx="100" cy="110" rx="28" ry="24" fill="white" opacity="0.4" />

            {/* BACK LEGS (behind body) */}
            <ellipse cx="72" cy="135" rx="16" ry="12" fill="#EDE8E0" />
            <ellipse cx="128" cy="135" rx="16" ry="12" fill="#EDE8E0" />
            {/* Back paw pads */}
            <ellipse cx="70" cy="143" rx="12" ry="5" fill="#E0D8CC" rx="10" />
            <ellipse cx="130" cy="143" rx="12" ry="5" fill="#E0D8CC" />

            {/* FRONT LEGS */}
            <ellipse cx="76" cy="132" rx="13" ry="16" fill="url(#bearFur)" />
            <ellipse cx="124" cy="132" rx="13" ry="16" fill="url(#bearFur)" />
            {/* Front paw pads */}
            <ellipse cx="76" cy="146" rx="11" ry="5" fill="#E0D8CC" />
            <ellipse cx="124" cy="146" rx="11" ry="5" fill="#E0D8CC" />
            {/* Toe beans! */}
            <circle cx="72" cy="144" r="2.5" fill="#D4CBC0" />
            <circle cx="76" cy="143" r="2.5" fill="#D4CBC0" />
            <circle cx="80" cy="144" r="2.5" fill="#D4CBC0" />
            <circle cx="120" cy="144" r="2.5" fill="#D4CBC0" />
            <circle cx="124" cy="143" r="2.5" fill="#D4CBC0" />
            <circle cx="128" cy="144" r="2.5" fill="#D4CBC0" />

            {/* HEAD */}
            <ellipse cx="100" cy="62" rx="32" ry="30" fill="url(#bearFurHead)" />

            {/* EARS - round and cute */}
            <circle cx="74" cy="40" r="12" fill="#F5F0E8" />
            <circle cx="74" cy="40" r="7" fill="#FFCDD2" />
            <circle cx="126" cy="40" r="12" fill="#F5F0E8" />
            <circle cx="126" cy="40" r="7" fill="#FFCDD2" />

            {/* EYES */}
            <g className="bear-eyes">
              {mood === 'happy' ? (
                <>
                  {/* Happy squinted eyes */}
                  <path d="M86 58 Q90 54 94 58" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M106 58 Q110 54 114 58" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Normal/sad eyes */}
                  <ellipse cx="90" cy="58" rx="5" ry={mood === 'sad' ? 5.5 : 5} fill="#2D2D2D" />
                  <ellipse cx="110" cy="58" rx="5" ry={mood === 'sad' ? 5.5 : 5} fill="#2D2D2D" />
                  {/* Eye shine */}
                  <circle cx="92" cy="56" r="2" fill="white" />
                  <circle cx="112" cy="56" r="2" fill="white" />
                  <circle cx="88" cy="60" r="1" fill="white" opacity="0.5" />
                  <circle cx="108" cy="60" r="1" fill="white" opacity="0.5" />
                </>
              )}
            </g>

            {/* Worried eyebrows when sad */}
            {mood === 'sad' && (
              <>
                <line x1="83" y1="48" x2="94" y2="51" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
                <line x1="117" y1="48" x2="106" y2="51" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {/* CHEEK BLUSH */}
            <circle cx="78" cy="65" r="8" fill="url(#cheekBlush)" />
            <circle cx="122" cy="65" r="8" fill="url(#cheekBlush)" />

            {/* SNOUT */}
            <ellipse cx="100" cy="70" rx="14" ry="10" fill="#EDE8E0" />
            {/* Nose - big and cute */}
            <ellipse cx="100" cy="67" rx="6" ry="4" fill="#2D2D2D" />
            {/* Nose shine */}
            <ellipse cx="98" cy="66" rx="2" ry="1.2" fill="#4A4A4A" />

            {/* MOUTH */}
            {mood === 'happy' ? (
              <path d="M92 74 Q100 82 108 74" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : mood === 'sad' ? (
              <path d="M93 78 Q100 73 107 78" stroke="#2D2D2D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            ) : (
              <line x1="94" y1="76" x2="106" y2="76" stroke="#2D2D2D" strokeWidth="1.8" strokeLinecap="round" />
            )}

            {/* TAIL - animated when happy */}
            <g className={mood === 'happy' ? 'bear-tail-wag' : ''}>
              <ellipse cx="148" cy="98" rx="8" ry="7" fill="#F5F0E8" />
            </g>
          </g>
        </g>
      </g>

      {/* CUBS - small cute bear */}
      {hasCubs && cubsAlive && (
        <g className="bear-mood-happy" style={{ transformOrigin: '165px 130px' }}>
          <g transform="translate(150, 95) scale(0.42)">
            <ellipse cx="100" cy="105" rx="40" ry="34" fill="#FAF6F0" />
            <ellipse cx="100" cy="110" rx="24" ry="20" fill="white" opacity="0.3" />
            <ellipse cx="80" cy="130" rx="11" ry="13" fill="#FAF6F0" />
            <ellipse cx="120" cy="130" rx="11" ry="13" fill="#FAF6F0" />
            <ellipse cx="100" cy="62" rx="28" ry="26" fill="#FAFAF5" />
            <circle cx="78" cy="43" r="10" fill="#FAF6F0" />
            <circle cx="78" cy="43" r="6" fill="#FFCDD2" />
            <circle cx="122" cy="43" r="10" fill="#FAF6F0" />
            <circle cx="122" cy="43" r="6" fill="#FFCDD2" />
            <circle cx="90" cy="58" r="4" fill="#2D2D2D" />
            <circle cx="110" cy="58" r="4" fill="#2D2D2D" />
            <circle cx="91.5" cy="56.5" r="1.5" fill="white" />
            <circle cx="111.5" cy="56.5" r="1.5" fill="white" />
            <circle cx="82" cy="65" r="6" fill="url(#cheekBlush)" />
            <circle cx="118" cy="65" r="6" fill="url(#cheekBlush)" />
            <ellipse cx="100" cy="68" rx="10" ry="8" fill="#EDE8E0" />
            <ellipse cx="100" cy="66" rx="4.5" ry="3" fill="#2D2D2D" />
            <path d="M94 72 Q100 78 106 72" stroke="#2D2D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </g>
      )}
    </g>
  );
}
