import React, { useState, useEffect } from 'react';
import HabitatScene from './HabitatScene';
import ActionCard from './ActionCard';
import EventModal from './EventModal';
import MiniGame from './MiniGame';
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
      position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', borderRadius: '16px',
      padding: '8px 16px', zIndex: 45, display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)', animation: 'slide-down 0.3s ease-out',
      fontFamily: 'Fredoka, Nunito, sans-serif',
    }}>
      <span style={{ fontSize: '24px' }}>{friend.icon}</span>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>New Friend!</div>
        <div style={{ fontSize: '11px', color: '#FFFBEB' }}>{friend.name} +50 pts</div>
      </div>
    </div>
  );
}

function CubsAnnouncement({ onDismiss }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', zIndex: 50, padding: '16px',
    }} onClick={onDismiss}>
      <div style={{
        background: '#FFF7ED', borderRadius: '20px', padding: '20px', textAlign: 'center',
        maxWidth: '260px', fontFamily: 'Fredoka, Nunito, sans-serif',
        animation: 'modal-pop 0.3s ease-out', border: '2px solid #FBBF24',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '40px', marginBottom: '4px' }}>🐻‍❄️🐻‍❄️</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#D97706' }}>Cubs Born!</div>
        <div style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0' }}>
          Aka has cubs! They need extra food but give bonus points!
        </div>
        <button onClick={onDismiss} style={{
          marginTop: '8px', padding: '8px 24px', borderRadius: '20px', border: 'none',
          background: '#F59E0B', color: 'white', fontWeight: 700, fontSize: '14px',
          cursor: 'pointer', fontFamily: 'Fredoka, Nunito, sans-serif',
        }}>Yay!</button>
      </div>
    </div>
  );
}

export default function GameScreen({ state, playCard, jumpTime, dismissEvent, completeMiniGame, clearNewFriend }) {
  const [muted, setMuted] = useState(false);
  const [showCubsModal, setShowCubsModal] = useState(false);
  const [jumpAnim, setJumpAnim] = useState(false);
  const [cardReaction, setCardReaction] = useState(null);

  const tempInfo = TEMP_LABELS.find(t => state.temp < t.max) || TEMP_LABELS[TEMP_LABELS.length - 1];
  const year = state.year;
  const progress = ((year - START_YEAR) / (TOTAL_TURNS * YEARS_PER_TURN)) * 100;
  const infraCount = Object.values(state.infra).reduce((a, b) => a + b, 0);
  const d = DIFFICULTY[state.difficulty];

  // Rough score estimate
  const yearPts = (year - START_YEAR) * 8;
  const bellyPts = Math.round(state.belly * 3);
  const infraPts = infraCount * 15;
  const friendPts = state.friends.length * 50;
  const approxScore = yearPts + bellyPts + infraPts + friendPts + state.researchLevel * 10 + state.miniGameScore * 20;

  // Cubs announcement
  useEffect(() => {
    if (state.hasCubs && !state.cubsAnnounced) {
      setShowCubsModal(true);
    }
  }, [state.hasCubs, state.cubsAnnounced]);

  // Background music
  useEffect(() => {
    if (!muted) startBgMusic();
    else stopBgMusic();
    return () => stopBgMusic();
  }, [muted]);

  const handleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    audio.setMuted(newMuted);
  };

  const handlePlayCard = (cardId) => {
    audio.cardPlayed();
    // Card reaction overlay
    const card = state.hand.find(c => c.id === cardId);
    if (card) {
      if (card.effect.belly) setCardReaction('❤️');
      else if (card.effect.infra) setCardReaction('❄️');
      else if (card.effect.shield || card.effect.stormShield) setCardReaction('🛡️');
      else setCardReaction('✨');
      setTimeout(() => setCardReaction(null), 600);
    }
    playCard(cardId);
  };

  const handleJump = () => {
    audio.timeJump();
    setJumpAnim(true);
    setTimeout(() => {
      setJumpAnim(false);
      jumpTime();
    }, 400);
  };

  const handleDismissEvent = () => {
    if (state.currentEvent?.type === 'bad' && !state.currentEvent?.blocked) {
      audio.badEvent();
    } else {
      audio.goodEvent();
    }
    dismissEvent();
  };

  const handleDismissCubs = () => {
    setShowCubsModal(false);
    // Mark as announced in state
    state.cubsAnnounced = true;
  };

  const bellyColor = state.belly > 70 ? '#22C55E' : state.belly > 40 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: 'Nunito, sans-serif', position: 'relative',
      background: '#F8FAFC', overflow: 'hidden',
    }}>
      {/* Global animations */}
      <style>{`
        @keyframes modal-pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slide-down { from { transform: translateX(-50%) translateY(-100%); } to { transform: translateX(-50%) translateY(0); } }
        @keyframes twinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(50%); } }
        @keyframes pulse-low { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes sparkle-float { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(-30px) scale(0.5); opacity: 0; } }
        @keyframes jump-flash { 0% { opacity: 0; } 50% { opacity: 0.3; } 100% { opacity: 0; } }
      `}</style>

      {/* Jump flash overlay */}
      {jumpAnim && (
        <div style={{
          position: 'absolute', inset: 0, background: 'white', zIndex: 40,
          animation: 'jump-flash 0.4s ease-out', pointerEvents: 'none',
        }} />
      )}

      {/* Card reaction overlay */}
      {cardReaction && (
        <div style={{
          position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: '48px', zIndex: 35, pointerEvents: 'none',
          animation: 'sparkle-float 0.6s ease-out forwards',
        }}>
          {cardReaction}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: '8px', background: '#E5E7EB', position: 'relative' }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #3B82F6, #22C55E)',
          width: `${Math.min(100, progress)}%`, transition: 'width 0.5s ease',
          borderRadius: '0 4px 4px 0',
        }} />
        <span style={{
          position: 'absolute', right: '4px', top: '-1px', fontSize: '7px',
          color: '#9CA3AF', fontFamily: 'Nunito, sans-serif',
        }}>2070</span>
      </div>

      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '4px 10px', background: 'white', borderBottom: '1px solid #E5E7EB',
        fontSize: '12px',
      }}>
        <span style={{
          background: state.difficulty === 'easy' ? '#DCFCE7' : state.difficulty === 'medium' ? '#FEF3C7' : '#FEE2E2',
          padding: '1px 8px', borderRadius: '8px', fontWeight: 700, fontSize: '11px',
          color: state.difficulty === 'easy' ? '#059669' : state.difficulty === 'medium' ? '#D97706' : '#DC2626',
        }}>
          {d.label}
        </span>
        <span style={{ color: '#6B7280', fontWeight: 600 }}>
          Turn {Math.min(state.turn, TOTAL_TURNS)}/{TOTAL_TURNS}
        </span>
        <button onClick={handleMute} style={{
          background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '2px',
        }}>
          {muted ? '🔇' : '🔊'}
        </button>
        <span style={{
          fontWeight: 700, color: '#D97706', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '2px',
        }}>
          {state.stars} ⭐
        </span>
      </div>

      {/* Habitat scene */}
      <div style={{
        height: '28vh', minHeight: '140px', maxHeight: '240px',
        background: '#1a1a4e', position: 'relative',
      }}>
        <HabitatScene
          temp={state.temp}
          belly={state.belly}
          hasCubs={state.hasCubs}
          cubsAlive={state.cubsAlive}
        />
      </div>

      {/* Belly bar + habitat label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '4px 10px', background: 'white', borderBottom: '1px solid #E5E7EB',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', minWidth: '30px' }}>
          ❤️ {Math.round(state.belly)}%
        </span>
        <div style={{
          flex: 1, height: '10px', background: '#E5E7EB', borderRadius: '5px',
          overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            height: '100%', width: `${state.belly}%`,
            background: bellyColor, borderRadius: '5px',
            transition: 'width 0.5s ease, background 0.3s',
            animation: state.belly < 30 ? 'pulse-low 1s ease-in-out infinite' : 'none',
          }} />
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, color: tempInfo.color,
          whiteSpace: 'nowrap',
        }}>
          {tempInfo.label}
        </span>
      </div>

      {/* Stats strip - 3 items */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', padding: '3px 8px',
        background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', fontSize: '11px',
      }}>
        <span style={{ color: '#4B5563' }}>📅 {year}</span>
        <span style={{ color: '#4B5563' }}>
          {state.temp < 1.8 ? '🧊 Thick Ice' : state.temp < 2.5 ? '💧 Thin Ice' : '🏜️ Bare Land'}
        </span>
        <span style={{ color: '#D97706', fontWeight: 700 }}>🏆 {approxScore}</span>
      </div>

      {/* Infra + Friends strip */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '2px 8px', background: 'white', borderBottom: '1px solid #E5E7EB',
        fontSize: '10px', gap: '4px',
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {Object.entries(INFRA_LABELS).map(([key, info]) => (
            <span key={key} style={{
              opacity: state.infra[key] > 0 ? 1 : 0.3,
              fontWeight: state.infra[key] > 0 ? 700 : 400,
            }}>
              {info.icon}{state.infra[key] > 0 ? state.infra[key] : ''}
            </span>
          ))}
          {state.researchLevel > 0 && <span style={{ color: '#6B7280' }}>🔬{state.researchLevel}</span>}
          {state.shield && <span>🛡️</span>}
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {FRIENDS.map(f => (
            <span key={f.id} style={{
              fontSize: '13px',
              opacity: state.friends.includes(f.id) ? 1 : 0.2,
              filter: state.friends.includes(f.id) ? 'none' : 'grayscale(1)',
            }}>
              {f.icon}
            </span>
          ))}
        </div>
      </div>

      {/* Cards section */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '6px 8px', gap: '6px',
        minHeight: 0,
      }}>
        {state.phase === 'cards' && (
          <>
            <div style={{
              display: 'flex', gap: '6px', justifyContent: 'center',
            }}>
              {state.hand.map(card => (
                <ActionCard
                  key={card.id}
                  card={card}
                  canAfford={state.stars >= card.cost}
                  onPlay={handlePlayCard}
                />
              ))}
            </div>
            {state.hand.length === 0 && (
              <div style={{
                textAlign: 'center', color: '#9CA3AF', fontSize: '13px',
                fontFamily: 'Fredoka, Nunito, sans-serif',
              }}>
                No cards left! Jump forward!
              </div>
            )}
          </>
        )}
        {state.phase === 'jumping' && (
          <div style={{ textAlign: 'center', fontSize: '24px', fontFamily: 'Fredoka, sans-serif', color: '#3B82F6' }}>
            ⏩ Jumping...
          </div>
        )}
      </div>

      {/* Jump button */}
      {state.phase === 'cards' && (
        <div style={{ padding: '6px 12px 12px', background: '#F8FAFC' }}>
          <button onClick={handleJump} style={{
            width: '100%', padding: '12px', borderRadius: '16px',
            border: 'none', background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: 'white', fontSize: '16px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Fredoka, Nunito, sans-serif',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            ⏩ Jump 3 Years
          </button>
        </div>
      )}

      {/* Event modal */}
      {state.phase === 'event' && state.currentEvent && (
        <EventModal event={state.currentEvent} onDismiss={handleDismissEvent} />
      )}

      {/* Mini-game */}
      {state.phase === 'miniGame' && state.miniGameType && (
        <MiniGame type={state.miniGameType} onComplete={completeMiniGame} />
      )}

      {/* Friend banner */}
      {state.newFriend && (
        <FriendBanner friendId={state.newFriend} onDone={clearNewFriend} />
      )}

      {/* Cubs announcement */}
      {showCubsModal && (
        <CubsAnnouncement onDismiss={handleDismissCubs} />
      )}
    </div>
  );
}
