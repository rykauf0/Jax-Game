import React from 'react';

export default function PolarBear({ belly, hasCubs, cubsAlive, temp }) {
  const mood = belly > 70 ? 'happy' : belly > 40 ? 'okay' : 'sad';
  const breathSpeed = mood === 'happy' ? '2s' : mood === 'okay' ? '3s' : '1.5s';
  const bounceAnim = mood === 'happy' ? 'bear-bounce 1.5s ease-in-out infinite' :
    mood === 'sad' ? 'bear-shiver 0.3s ease-in-out infinite' : 'bear-breathe 3s ease-in-out infinite';

  return (
    <g>
      <style>{`
        @keyframes bear-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes bear-breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.02); } }
        @keyframes bear-shiver { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        @keyframes tail-wag { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
      `}</style>
      <g style={{ animation: bounceAnim, transformOrigin: 'center bottom' }}>
        {/* Body */}
        <ellipse cx="150" cy="120" rx="38" ry="32" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="150" cy="78" rx="26" ry="24" fill="#FAFAF5" stroke="#E8E4DD" strokeWidth="1.5" />
        {/* Ears */}
        <circle cx="130" cy="60" r="8" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1" />
        <circle cx="130" cy="60" r="4" fill="#FFCDD2" />
        <circle cx="170" cy="60" r="8" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1" />
        <circle cx="170" cy="60" r="4" fill="#FFCDD2" />
        {/* Eyes */}
        <circle cx="140" cy="75" r="3.5" fill="#2D2D2D" />
        <circle cx="160" cy="75" r="3.5" fill="#2D2D2D" />
        <circle cx="141" cy="74" r="1.2" fill="white" />
        <circle cx="161" cy="74" r="1.2" fill="white" />
        {/* Eyebrows when sad */}
        {mood === 'sad' && <>
          <line x1="135" y1="68" x2="143" y2="70" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="165" y1="68" x2="157" y2="70" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
        </>}
        {/* Snout */}
        <ellipse cx="150" cy="86" rx="10" ry="7" fill="#E8E4DD" />
        <ellipse cx="150" cy="84" rx="5" ry="3" fill="#2D2D2D" />
        {/* Mouth */}
        {mood === 'happy' ? (
          <path d="M145 89 Q150 94 155 89" stroke="#2D2D2D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : mood === 'sad' ? (
          <path d="M145 92 Q150 88 155 92" stroke="#2D2D2D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : (
          <line x1="146" y1="90" x2="154" y2="90" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" />
        )}
        {/* Front legs */}
        <ellipse cx="132" cy="145" rx="10" ry="14" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1" />
        <ellipse cx="168" cy="145" rx="10" ry="14" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1" />
        {/* Paws */}
        <ellipse cx="132" cy="157" rx="8" ry="4" fill="#E8E4DD" />
        <ellipse cx="168" cy="157" rx="8" ry="4" fill="#E8E4DD" />
        {/* Tail */}
        <ellipse cx="188" cy="115" rx="6" ry="5" fill="#F5F5F0" stroke="#E8E4DD" strokeWidth="1"
          style={{ animation: mood === 'happy' ? 'tail-wag 0.6s ease-in-out infinite' : 'none', transformOrigin: '185px 115px' }} />
      </g>
      {/* Cubs */}
      {hasCubs && cubsAlive && (
        <g style={{ animation: 'bear-bounce 2s ease-in-out infinite 0.3s' }}>
          <ellipse cx="205" cy="140" rx="14" ry="12" fill="#FAF8F0" stroke="#E8E4DD" strokeWidth="1" />
          <circle cx="205" cy="128" r="10" fill="#FAFAF5" stroke="#E8E4DD" strokeWidth="1" />
          <circle cx="197" cy="122" r="4" fill="#FAF8F0" stroke="#E8E4DD" strokeWidth="0.5" />
          <circle cx="213" cy="122" r="4" fill="#FAF8F0" stroke="#E8E4DD" strokeWidth="0.5" />
          <circle cx="201" cy="127" r="2" fill="#2D2D2D" />
          <circle cx="209" cy="127" r="2" fill="#2D2D2D" />
          <ellipse cx="205" cy="131" rx="3" ry="2" fill="#E8E4DD" />
          <ellipse cx="205" cy="130" rx="2" ry="1.2" fill="#2D2D2D" />
        </g>
      )}
    </g>
  );
}
