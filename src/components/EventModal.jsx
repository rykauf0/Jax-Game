import React from 'react';

export default function EventModal({ event, onDismiss }) {
  if (!event) return null;

  const isBlocked = event.blocked;
  const isBad = event.type === 'bad' && !isBlocked;

  const bgColor = isBlocked ? '#ECFDF5' : isBad ? '#FFF1F2' : '#F0FDF4';
  const borderColor = isBlocked ? '#6EE7B7' : isBad ? '#FECACA' : '#86EFAC';
  const titleColor = isBlocked ? '#059669' : isBad ? '#DC2626' : '#059669';
  const btnColor = isBlocked ? '#10B981' : isBad ? '#EF4444' : '#22C55E';
  const btnShadow = isBlocked ? '#059669' : isBad ? '#B91C1C' : '#15803D';

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)', zIndex: 50, padding: '20px',
      backdropFilter: 'blur(2px)',
    }} onClick={onDismiss}>
      <div style={{
        background: bgColor,
        borderRadius: '24px',
        padding: '20px 24px 16px',
        maxWidth: '260px', width: '100%',
        textAlign: 'center',
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        animation: 'modal-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: `3px solid ${borderColor}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px ${borderColor}33`,
      }} onClick={e => e.stopPropagation()}>
        {isBlocked ? (
          <>
            <div style={{
              fontSize: '48px', marginBottom: '6px',
              animation: 'shield-pulse 0.6s ease-out',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}>🛡️</div>
            <div style={{
              fontSize: '18px', fontWeight: 700, color: '#059669',
              marginBottom: '4px',
            }}>
              Protected!
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>
              {event.blockedBy} blocked {event.title}
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontSize: '52px', marginBottom: '4px',
              animation: isBad ? 'shake 0.4s ease-out' : 'icon-bounce 0.5s ease-out',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}>
              {event.icon}
            </div>
            <div style={{
              fontSize: '19px', fontWeight: 700, color: titleColor, marginBottom: '2px',
            }}>
              {event.title}
            </div>
            <div style={{
              fontSize: '13px', color: '#4B5563', marginBottom: '8px',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {event.text}
            </div>
            {event.fact && (
              <div style={{
                fontSize: '11px', color: '#78716C',
                background: 'rgba(255,255,255,0.7)', borderRadius: '10px',
                padding: '6px 10px',
                border: '1px solid rgba(0,0,0,0.06)',
                fontFamily: "'Nunito', sans-serif",
              }}>
                💡 {event.fact}
              </div>
            )}
          </>
        )}
        <button onClick={onDismiss} style={{
          marginTop: '12px', padding: '8px 28px', borderRadius: '14px',
          border: 'none',
          background: btnColor,
          boxShadow: `0 3px 0 ${btnShadow}, 0 4px 8px rgba(0,0,0,0.1)`,
          color: 'white', fontWeight: 700, fontSize: '16px',
          fontFamily: "'Fredoka', 'Nunito', sans-serif",
          cursor: 'pointer',
          letterSpacing: '0.5px',
          transition: 'transform 0.1s',
        }}
          onPointerDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
          onPointerUp={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          OK!
        </button>
      </div>
    </div>
  );
}
