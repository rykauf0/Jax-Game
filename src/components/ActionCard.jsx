import React, { useState, useRef, useEffect } from 'react';
import {
  FishIcon, SealHuntIcon, WindIcon, SolarIcon, WaveIcon, FactoryIcon,
  IceIcon, ShieldIcon, HomeIcon, MagnifyIcon, HelicopterIcon, GlobeIcon,
  TreeIcon, StarIcon, FeedIcon,
} from './Icons';

const CARD_ICONS = {
  fish: (s) => <FeedIcon size={s} />,
  seal: (s) => <SealHuntIcon size={s} />,
  wind: (s) => <WindIcon size={s} color="#60A5FA" />,
  solar: (s) => <SolarIcon size={s} color="#F59E0B" />,
  wave: (s) => <WaveIcon size={s} color="#3B82F6" />,
  factory: (s) => <FactoryIcon size={s} color="#6B7280" />,
  ice: (s) => <IceIcon size={s} color="#38BDF8" />,
  shield: (s) => <ShieldIcon size={s} color="#10B981" />,
  home: (s) => <HomeIcon size={s} color="#92400E" />,
  magnify: (s) => <MagnifyIcon size={s} color="#8B5CF6" />,
  helicopter: (s) => <HelicopterIcon size={s} color="#DC2626" />,
  globe: (s) => <GlobeIcon size={s} color="#2563EB" />,
  tree: (s) => <TreeIcon size={s} color="#22C55E" />,
};

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
  const [showLearn, setShowLearn] = useState(false);
  const longPressTimer = useRef(null);
  const style = rarityStyles[card.rarity];

  const handleDown = () => {
    if (canAfford) setPressed(true);
    if (card.learnText) {
      longPressTimer.current = setTimeout(() => {
        setShowLearn(true);
        setPressed(false); // cancel the press so we don't play the card
      }, 500);
    }
  };
  const handleUp = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    if (showLearn) { setShowLearn(false); return; }
    setPressed(false);
    if (canAfford) onPlay(card.id);
  };
  const handleLeave = () => {
    setPressed(false);
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };

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
        gap: '3px',
        padding: '10px 8px 8px',
        borderRadius: '18px',
        border: `2.5px solid ${canAfford ? style.border : '#D1D5DB'}`,
        background: canAfford ? style.bg : 'linear-gradient(145deg, #F9FAFB, #F3F4F6)',
        opacity: canAfford ? 1 : 0.4,
        cursor: canAfford ? 'pointer' : 'not-allowed',
        boxShadow: canAfford
          ? (pressed ? '0 1px 2px rgba(0,0,0,0.1)' : `${style.glow}, 0 5px 0 ${style.border}`)
          : '0 2px 0 #D1D5DB',
        transform: pressed ? 'translateY(4px) scale(0.96)' : 'translateY(0) scale(1)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        width: '100%',
        minHeight: '120px',
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        touchAction: 'manipulation',
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
          position: 'absolute', top: '4px', right: '4px',
          width: '8px', height: '8px', borderRadius: '50%',
          background: style.badge,
          boxShadow: `0 0 6px ${style.badge}`,
        }} />
      )}

      {/* Icon — BIG */}
      <span style={{
        lineHeight: 1,
        filter: canAfford ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' : 'grayscale(0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {CARD_ICONS[card.iconType] ? CARD_ICONS[card.iconType](40) : <FishIcon size={40} />}
      </span>

      {/* Name — bold and readable */}
      <span style={{
        fontSize: '14px', fontWeight: 800, color: canAfford ? '#1F2937' : '#9CA3AF',
        textAlign: 'center', lineHeight: 1.15,
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
      }}>
        {card.name}
      </span>

      {/* Effect description */}
      <span style={{
        fontSize: '11px', color: canAfford ? '#6B7280' : '#9CA3AF',
        lineHeight: 1.1, textAlign: 'center',
      }}>
        {card.effectDesc}
      </span>

      {/* Cost pill — larger */}
      <span style={{
        marginTop: '2px',
        padding: '2px 10px',
        borderRadius: '10px',
        background: canAfford ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : '#E5E7EB',
        fontSize: '13px',
        fontWeight: 800,
        color: canAfford ? '#B45309' : '#9CA3AF',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        display: 'flex', alignItems: 'center', gap: '3px',
        border: `1.5px solid ${canAfford ? '#FCD34D' : '#D1D5DB'}`,
      }}>
        {card.cost} <StarIcon size={13} />
      </span>

      {showLearn && card.learnText && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(59,130,246,0.95)', borderRadius: '16px', padding: '8px',
          zIndex: 10,
        }} onClick={(e) => { e.stopPropagation(); setShowLearn(false); }}>
          <span style={{
            fontSize: '11px', color: 'white', fontWeight: 600, lineHeight: 1.3,
            textAlign: 'center', fontFamily: "'Nunito', sans-serif",
          }}>
            {card.learnText}
          </span>
        </div>
      )}
    </button>
  );
}
