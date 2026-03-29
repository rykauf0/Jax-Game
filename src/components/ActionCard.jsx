import React, { useState } from 'react';

const rarityColors = {
  common: { bg: '#F0F9FF', border: '#93C5FD', glow: 'none' },
  uncommon: { bg: '#F0FDF4', border: '#86EFAC', glow: 'none' },
  rare: { bg: '#FFFBEB', border: '#FCD34D', glow: '0 0 8px rgba(251,191,36,0.4)' },
};

export default function ActionCard({ card, canAfford, onPlay }) {
  const [tapped, setTapped] = useState(false);
  const colors = rarityColors[card.rarity];

  const handleTap = () => {
    if (!canAfford) return;
    setTapped(true);
    onPlay(card.id);
    setTimeout(() => setTapped(false), 300);
  };

  return (
    <button
      onClick={handleTap}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        padding: '6px 4px',
        borderRadius: '12px',
        border: `2px solid ${canAfford ? colors.border : '#D1D5DB'}`,
        background: canAfford ? colors.bg : '#F3F4F6',
        opacity: canAfford ? 1 : 0.5,
        cursor: canAfford ? 'pointer' : 'not-allowed',
        boxShadow: card.rarity === 'rare' && canAfford ? colors.glow : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        transform: tapped ? 'scale(0.92)' : 'scale(1)',
        flex: '1 1 0',
        minWidth: 0,
        maxWidth: '120px',
        fontFamily: 'Nunito, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Rare shimmer */}
      {card.rarity === 'rare' && canAfford && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
          background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
          animation: 'shimmer 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ fontSize: '20px', lineHeight: 1 }}>{card.icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1F2937', textAlign: 'center', lineHeight: 1.1 }}>
        {card.name}
      </span>
      <span style={{ fontSize: '9px', color: '#6B7280', lineHeight: 1.1 }}>{card.effectDesc}</span>
      <span style={{
        fontSize: '11px', fontWeight: 700,
        color: canAfford ? '#D97706' : '#9CA3AF',
        display: 'flex', alignItems: 'center', gap: '2px',
      }}>
        {card.cost} ⭐
      </span>
    </button>
  );
}
