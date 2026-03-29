import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HabitatScene from './HabitatScene';
import ActionCard from './ActionCard';
import EventModal from './EventModal';
import MiniGame from './MiniGame';
import { ParticleLayer, useParticles } from '../utils/particles';
import { TEMP_LABELS, TOTAL_TURNS, START_YEAR, YEARS_PER_TURN, INFRA_LABELS, FRIENDS, DIFFICULTY } from '../data/constants';
import { audio, startBgMusic, stopBgMusic } from '../utils/audio';

function FriendBanner({ friendId, onDone }) {
  const friend = FRIENDS.find(f => f.id === friendId);
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  if (!friend) return null;
  return (
    <div style={{
      position: 'absolute', top: '44px', left: '50%', transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
      borderRadius: '20px', padding: '10px 20px', zIndex: 45,
      display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 6px 20px rgba(245,158,11,0.4), 0 0 0 3px rgba(255,255,255,0.3)',
      animation: 'slide-down 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      fontFamily: "'Fredoka', 'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}>{friend.icon}</span>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>New Friend!</div>
        <div style={{ fontSize: '12px', color: '#FFFBEB' }}>{friend.name} +50 pts</div>
      </div>
    </div>
  );
}

function CubsAnnouncement({ onDismiss }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)', zIndex: 50, padding: '16px',
      backdropFilter: 'blur(2px)',
    }} onClick={onDismiss}>
      <div style={{
        background: 'linear-gradient(180deg, #FFFBEB, #FEF3C7)', borderRadius: '28px',
        padding: '24px', textAlign: 'center', maxWidth: '280px',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        animation: 'modal-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: '3px solid #FCD34D',
        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '52px', marginBottom: '6px', animation: 'icon-bounce 0.5s ease-out' }}>🐻‍❄️</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#B45309' }}>Cubs Born!</div>
        <div style={{ fontSize: '14px', color: '#78716C', margin: '6px 0', fontFamily: "'Nunito', sans-serif" }}>
          Aka has cubs! They need extra food but earn bonus points!
        </div>
        <button onClick={onDismiss} style={{
          marginTop: '10px', padding: '12px 32px', borderRadius: '16px', border: 'none',
          background: '#F59E0B', boxShadow: '0 4px 0 #B45309',
          color: 'white', fontWeight: 700, fontSize: '18px',
          cursor: 'pointer', fontFamily: "'Fredoka', sans-serif",
          minHeight: '48px',
        }}>Yay!</button>
      </div>
    </div>
  );
}

export default function GameScreen({ state, playCard, jumpTime, dismissEvent, completeMiniGame, clearNewFriend, markCubsAnnounced }) {
  const [muted, setMuted] = useState(false);
  const [showCubsModal, setShowCubsModal] = useState(false);
  const [jumpAnim, setJumpAnim] = useState(false);
  const { particles, burst, hearts, snowflakes, sparkle, ring } = useParticles();
  const cardAreaRef = useRef(null);

  const tempInfo = TEMP_LABELS.find(t => state.temp < t.max) || TEMP_LABELS[TEMP_LABELS.length - 1];
  const year = state.year;
  const progress = ((year - START_YEAR) / (TOTAL_TURNS * YEARS_PER_TURN)) * 100;
  const infraCount = Object.values(state.infra).reduce((a, b) => a + b, 0);
  const d = DIFFICULTY[state.difficulty];

  const approxScore = useMemo(() => {
    return (year - START_YEAR) * 8 + Math.round(state.belly * 3) + infraCount * 15
      + state.friends.length * 50 + state.researchLevel * 10 + state.miniGameScore * 20;
  }, [year, state.belly, infraCount, state.friends.length, state.researchLevel, state.miniGameScore]);

  // Can afford any remaining card?
  const canAffordAny = state.hand.some(c => state.stars >= c.cost);
  // Should pulse the jump button?
  const shouldPromptJump = state.phase === 'cards' && (state.hand.length === 0 || !canAffordAny);

  useEffect(() => {
    if (state.hasCubs && !state.cubsAnnounced) setShowCubsModal(true);
  }, [state.hasCubs, state.cubsAnnounced]);

  useEffect(() => {
    if (!muted) startBgMusic();
    else stopBgMusic();
    return () => stopBgMusic();
  }, [muted]);

  const handleMute = () => {
    const m = !muted;
    setMuted(m);
    audio.setMuted(m);
  };

  const handlePlayCard = useCallback((cardId) => {
    audio.cardPlayed();
    const card = state.hand.find(c => c.id === cardId);
    if (cardAreaRef.current && card) {
      const rect = cardAreaRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (card.effect.belly) hearts({ x: cx, y: cy - 20 });
      else if (card.effect.infra) snowflakes({ x: cx, y: cy - 20 });
      else if (card.effect.shield || card.effect.stormShield) burst({ x: cx, y: cy - 20, colors: ['#6EE7B7', '#34D399', '#10B981', '#A7F3D0'], count: 10 });
      else sparkle({ x: cx, y: cy - 20 });
      ring({ x: cx, y: cy - 20, color: card.effect.belly ? '#F472B6' : '#60A5FA' });
    }
    playCard(cardId);
  }, [state.hand, playCard, hearts, snowflakes, burst, sparkle, ring]);

  const handleJump = () => {
    audio.timeJump();
    setJumpAnim(true);
    setTimeout(() => { setJumpAnim(false); jumpTime(); }, 500);
  };

  const handleDismissEvent = () => {
    if (state.currentEvent?.type === 'bad' && !state.currentEvent?.blocked) audio.badEvent();
    else audio.goodEvent();
    dismissEvent();
  };

  const handleDismissCubs = () => {
    setShowCubsModal(false);
    if (markCubsAnnounced) markCubsAnnounced();
  };

  const bellyColor = state.belly > 70 ? '#22C55E' : state.belly > 40 ? '#F59E0B' : '#EF4444';
  const bellyBg = state.belly > 70 ? '#DCFCE7' : state.belly > 40 ? '#FEF3C7' : '#FEE2E2';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100dvh', /* uses dynamic viewport height */
      fontFamily: "'Nunito', sans-serif", position: 'relative',
      background: '#F1F5F9', overflow: 'hidden',
    }}>
      <ParticleLayer particles={particles} />

      {jumpAnim && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(59,130,246,0.15) 100%)',
          animation: 'jump-flash 0.5s ease-out forwards',
        }} />
      )}

      {/* ===== PROGRESS BAR ===== */}
      <div style={{ height: '5px', background: '#E2E8F0', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, #3B82F6, ${progress > 60 ? '#22C55E' : '#60A5FA'})`,
          width: `${Math.min(100, progress)}%`, transition: 'width 0.6s ease',
          borderRadius: '0 3px 3px 0',
        }} />
      </div>

      {/* ===== COMPACT TOP BAR ===== */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '3px 8px', background: 'white',
        borderBottom: '1px solid #E2E8F0', flexShrink: 0,
      }}>
        <span style={{
          background: state.difficulty === 'easy' ? '#DCFCE7' : state.difficulty === 'medium' ? '#FEF3C7' : '#FEE2E2',
          padding: '1px 8px', borderRadius: '8px', fontWeight: 700, fontSize: '11px',
          color: state.difficulty === 'easy' ? '#059669' : state.difficulty === 'medium' ? '#D97706' : '#DC2626',
          fontFamily: "'Fredoka', sans-serif",
        }}>
          {d.label}
        </span>
        <span style={{ color: '#64748B', fontWeight: 700, fontSize: '11px', fontFamily: "'Fredoka', sans-serif" }}>
          Turn {Math.min(state.turn, TOTAL_TURNS)}/{TOTAL_TURNS}
        </span>
        <button onClick={handleMute} style={{
          background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px',
          fontSize: '16px', cursor: 'pointer', padding: '4px 8px', minHeight: '32px', minWidth: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {muted ? '🔇' : '🔊'}
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          padding: '3px 10px', borderRadius: '12px',
          border: '1.5px solid #FCD34D',
        }}>
          <span style={{ fontWeight: 800, color: '#B45309', fontSize: '15px', fontFamily: "'Fredoka', sans-serif" }}>
            {state.stars}
          </span>
          <span style={{ fontSize: '15px' }}>⭐</span>
        </div>
      </div>

      {/* ===== HABITAT SCENE (slightly shorter to give cards more room) ===== */}
      <div style={{
        height: '26vh', minHeight: '120px', maxHeight: '200px',
        position: 'relative', flexShrink: 0,
      }}>
        <HabitatScene temp={state.temp} belly={state.belly} hasCubs={state.hasCubs} cubsAlive={state.cubsAlive} />
      </div>

      {/* ===== BELLY BAR + TEMP (combined compact row) ===== */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '4px 10px', background: 'white',
        borderBottom: '1px solid #E2E8F0', flexShrink: 0,
      }}>
        <span style={{ fontSize: '14px' }}>❤️</span>
        <div style={{
          flex: 1, height: '12px', background: bellyBg, borderRadius: '6px',
          overflow: 'hidden', border: `1.5px solid ${bellyColor}33`,
        }}>
          <div style={{
            height: '100%', width: `${state.belly}%`,
            background: `linear-gradient(90deg, ${bellyColor}, ${bellyColor}CC)`,
            borderRadius: '5px', transition: 'width 0.5s ease',
            animation: state.belly < 25 ? 'pulse-low 0.8s ease-in-out infinite' : 'none',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '1px', left: '3px', right: '30%',
              height: '3px', borderRadius: '2px',
              background: 'rgba(255,255,255,0.4)',
            }} />
          </div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 800, color: bellyColor, fontFamily: "'Fredoka', sans-serif" }}>
          {Math.round(state.belly)}%
        </span>
        <div style={{
          fontSize: '11px', fontWeight: 700, color: tempInfo.color,
          whiteSpace: 'nowrap', padding: '2px 6px', borderRadius: '8px',
          background: `${tempInfo.color}15`, fontFamily: "'Fredoka', sans-serif",
        }}>
          {tempInfo.label}
        </div>
      </div>

      {/* ===== COMPACT INFO ROW (year + ice + score + infra) ===== */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '3px 8px', background: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0', flexShrink: 0,
        fontSize: '11px', fontWeight: 600, gap: '4px',
      }}>
        <span style={{ color: '#64748B', fontFamily: "'Fredoka', sans-serif" }}>
          📅 {year}
        </span>
        <span style={{ color: '#64748B', fontFamily: "'Fredoka', sans-serif" }}>
          {state.temp < 1.8 ? '🧊' : state.temp < 2.5 ? '💧' : '🏜️'}
          {state.temp < 1.8 ? ' Ice' : state.temp < 2.5 ? ' Thin' : ' Bare'}
        </span>
        {/* Infra icons inline */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          {Object.entries(INFRA_LABELS).map(([key, info]) => (
            state.infra[key] > 0 ? (
              <span key={key} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                {info.icon}<span style={{ fontWeight: 800, fontSize: '10px', color: '#3B82F6', fontFamily: "'Fredoka', sans-serif" }}>{state.infra[key]}</span>
              </span>
            ) : null
          ))}
          {state.researchLevel > 0 && <span style={{ fontSize: '12px' }}>🔬{state.researchLevel}</span>}
          {state.shield && <span style={{ fontSize: '12px' }}>🛡️</span>}
        </div>
        {/* Friends */}
        <div style={{ display: 'flex', gap: '1px' }}>
          {FRIENDS.map(f => (
            <span key={f.id} style={{
              fontSize: '12px',
              opacity: state.friends.includes(f.id) ? 1 : 0.15,
              filter: state.friends.includes(f.id) ? 'none' : 'grayscale(1)',
            }}>
              {f.icon}
            </span>
          ))}
        </div>
        <span style={{ color: '#B45309', fontWeight: 800, fontFamily: "'Fredoka', sans-serif" }}>
          🏆 {approxScore}
        </span>
      </div>

      {/* ===== CARDS + JUMP BUTTON (together as one flex section) ===== */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', minHeight: 0,
        padding: '0 8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}>
        {/* Card area */}
        <div ref={cardAreaRef} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: '4px 0',
          minHeight: 0,
        }}>
          {state.phase === 'cards' && state.hand.length > 0 && (
            <>
              {/* Helper text */}
              <div style={{
                fontSize: '13px', fontWeight: 700, color: '#94A3B8',
                fontFamily: "'Fredoka', sans-serif",
                marginBottom: '6px',
                animation: 'fade-in 0.3s ease-out',
              }}>
                {canAffordAny ? '👆 Tap a card to play!' : '⬇️ Tap Jump to continue!'}
              </div>
              <div style={{
                display: 'flex', gap: '10px', justifyContent: 'center',
                width: '100%', maxWidth: '380px',
              }}>
                {state.hand.map((card, i) => (
                  <div key={card.id} style={{
                    animation: `card-deal 0.3s ease-out ${i * 0.08}s both`,
                    flex: '1 1 0', display: 'flex', justifyContent: 'center',
                    maxWidth: '130px',
                  }}>
                    <ActionCard
                      card={card}
                      canAfford={state.stars >= card.cost}
                      onPlay={handlePlayCard}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {state.phase === 'cards' && state.hand.length === 0 && (
            <div style={{
              textAlign: 'center', fontFamily: "'Fredoka', sans-serif",
              animation: 'icon-bounce 0.5s ease-out',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>⬇️</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#64748B' }}>
                Tap Jump to continue!
              </div>
            </div>
          )}
          {state.phase === 'jumping' && (
            <div style={{
              textAlign: 'center', fontSize: '32px', fontFamily: "'Fredoka', sans-serif",
              color: '#3B82F6', animation: 'icon-bounce 0.5s ease-out',
            }}>
              ⏩ +3 Years...
            </div>
          )}
        </div>

        {/* ===== JUMP BUTTON — always at the bottom, always visible ===== */}
        {state.phase === 'cards' && (
          <button onClick={handleJump} style={{
            width: '100%',
            padding: '16px',
            borderRadius: '20px',
            border: 'none',
            background: shouldPromptJump
              ? 'linear-gradient(135deg, #22C55E, #16A34A)'
              : 'linear-gradient(135deg, #3B82F6, #2563EB)',
            boxShadow: shouldPromptJump
              ? '0 4px 0 #15803D, 0 6px 16px rgba(34,197,94,0.4)'
              : '0 4px 0 #1D4ED8, 0 6px 16px rgba(37,99,235,0.3)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Fredoka', 'Nunito', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.1s, box-shadow 0.1s, background 0.3s',
            letterSpacing: '0.5px',
            minHeight: '56px',
            flexShrink: 0,
            animation: shouldPromptJump ? 'jump-pulse 1.2s ease-in-out infinite' : 'none',
          }}
            onPointerDown={e => {
              e.currentTarget.style.transform = 'translateY(3px)';
              e.currentTarget.style.boxShadow = shouldPromptJump
                ? '0 1px 0 #15803D, 0 2px 8px rgba(34,197,94,0.3)'
                : '0 1px 0 #1D4ED8, 0 2px 8px rgba(37,99,235,0.3)';
            }}
            onPointerUp={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shouldPromptJump
                ? '0 4px 0 #15803D, 0 6px 16px rgba(34,197,94,0.4)'
                : '0 4px 0 #1D4ED8, 0 6px 16px rgba(37,99,235,0.3)';
            }}
            onPointerLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shouldPromptJump
                ? '0 4px 0 #15803D, 0 6px 16px rgba(34,197,94,0.4)'
                : '0 4px 0 #1D4ED8, 0 6px 16px rgba(37,99,235,0.3)';
            }}
          >
            ⏩ Jump 3 Years
          </button>
        )}
      </div>

      {/* ===== OVERLAYS ===== */}
      {state.phase === 'event' && state.currentEvent && (
        <EventModal event={state.currentEvent} onDismiss={handleDismissEvent} />
      )}
      {state.phase === 'miniGame' && state.miniGameType && (
        <MiniGame type={state.miniGameType} onComplete={completeMiniGame} />
      )}
      {state.newFriend && (
        <FriendBanner friendId={state.newFriend} onDone={clearNewFriend} />
      )}
      {showCubsModal && (
        <CubsAnnouncement onDismiss={handleDismissCubs} />
      )}
    </div>
  );
}
