import React, { useState } from 'react';

const rarityStyles = {
  common: {
    bg: 'linear-gradient(145deg, #EFF6FF, #DBEAFE)',
    border: '#93C5FD',
    glow: '0 2px 8px rgba(59,130,246,0.15)',
    badge: null,
  },
  uncommon: {
    bg: 'linear-gradient(145deg, #ECFDF5, #D1FAE5)',
    border: '#6EE7B7',
    glow: '0 2px 8px rgba(52,211,153,0.2)',
    badge: '#10B981',
  },
  rare: {
    bg: 'linear-gradient(145deg, #FFFBEB, #FEF3C7)',
    border: '#FCD34D',
    glow: '0 2px 12px rgba(251,191,36,0.35), 0 0 20px rgba(251,191,36,0.15)',
    badge: '#F59E0B',
  },
};

export default function ActionCard({ card, canAfford, onPlay }) {
  const [pressed, setPressed] = useState(false);
  const style = rarityStyles[card.rarity];

  const handleDown = () => { if (canAfford) setPressed(true); };
  const handleUp = () => {
    setPressed(false);
    if (canAfford) onPlay(card.id);
  };
  const handleLeave = () => setPressed(false);

  return (
    <button
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1px',
        padding: '8px 6px 6px',
        borderRadius: '16px',
        border: `2.5px solid ${canAfford ? style.border : '#D1D5DB'}`,
        background: canAfford ? style.bg : 'linear-gradient(145deg, #F9FAFB, #F3F4F6)',
        opacity: canAfford ? 1 : 0.45,
        cursor: canAfford ? 'pointer' : 'not-allowed',
        boxShadow: canAfford
          ? (pressed ? '0 1px 2px rgba(0,0,0,0.1)' : `${style.glow}, 0 4px 0 ${canAfford ? style.border : '#D1D5DB'}`)
          : '0 2px 0 #D1D5DB',
        transform: pressed ? 'translateY(3px) scale(0.96)' : 'translateY(0) scale(1)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        flex: '1 1 0',
        minWidth: 0,
        maxWidth: '115px',
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
    >
      {/* Rare shimmer */}
      {card.rarity === 'rare' && canAfford && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '300%', height: '100%',
          background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 55%, transparent 65%)',
          animation: 'shimmer 2.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Rarity badge */}
      {style.badge && canAfford && (
        <div style={{
          position: 'absolute', top: '3px', right: '3px',
          width: '7px', height: '7px', borderRadius: '50%',
          background: style.badge,
          boxShadow: `0 0 4px ${style.badge}`,
        }} />
      )}

      {/* Icon */}
      <span style={{ fontSize: '24px', lineHeight: 1, filter: canAfford ? 'none' : 'grayscale(0.7)' }}>
        {card.icon}
      </span>

      {/* Name */}
      <span style={{
        fontSize: '11px', fontWeight: 800, color: canAfford ? '#1F2937' : '#9CA3AF',
        textAlign: 'center', lineHeight: 1.15,
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
      }}>
        {card.name}
      </span>

      {/* Effect */}
      <span style={{
        fontSize: '9px', color: canAfford ? '#6B7280' : '#9CA3AF',
        lineHeight: 1.1, textAlign: 'center',
      }}>
        {card.effectDesc}
      </span>

      {/* Cost pill */}
      <span style={{
        marginTop: '2px',
        padding: '1px 8px',
        borderRadius: '10px',
        background: canAfford ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : '#E5E7EB',
        fontSize: '11px',
        fontWeight: 800,
        color: canAfford ? '#B45309' : '#9CA3AF',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        display: 'flex', alignItems: 'center', gap: '2px',
        border: `1px solid ${canAfford ? '#FCD34D' : '#D1D5DB'}`,
      }}>
        {card.cost} ⭐
      </span>
    </button>
  );
}
