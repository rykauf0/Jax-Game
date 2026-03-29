import React from 'react';

export default function EventModal({ event, onDismiss }) {
  if (!event) return null;

  const isBlocked = event.blocked;
  const isBad = event.type === 'bad' && !isBlocked;

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', zIndex: 50, padding: '16px',
    }} onClick={onDismiss}>
      <div style={{
        background: isBlocked ? '#ECFDF5' : isBad ? '#FEF2F2' : '#F0FDF4',
        borderRadius: '16px',
        padding: '16px 20px',
        maxWidth: '280px', width: '100%',
        textAlign: 'center',
        fontFamily: 'Nunito, sans-serif',
        animation: 'modal-pop 0.3s ease-out',
        border: `2px solid ${isBlocked ? '#6EE7B7' : isBad ? '#FCA5A5' : '#86EFAC'}`,
      }} onClick={e => e.stopPropagation()}>
        {isBlocked ? (
          <>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#059669', fontFamily: 'Fredoka, Nunito, sans-serif' }}>
              {event.blockedBy} Protected Aka!
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
              {event.title} was blocked!
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>{event.icon}</div>
            <div style={{
              fontSize: '16px', fontWeight: 700,
              color: isBad ? '#DC2626' : '#059669',
              fontFamily: 'Fredoka, Nunito, sans-serif',
            }}>
              {event.title}
            </div>
            <div style={{ fontSize: '13px', color: '#4B5563', margin: '4px 0' }}>{event.text}</div>
            {event.fact && (
              <div style={{
                fontSize: '11px', color: '#6B7280', marginTop: '8px',
                background: '#FFF7ED', borderRadius: '8px', padding: '6px 8px',
              }}>
                💡 {event.fact}
              </div>
            )}
          </>
        )}
        <button onClick={onDismiss} style={{
          marginTop: '12px', padding: '8px 24px', borderRadius: '20px',
          border: 'none', background: isBlocked ? '#10B981' : isBad ? '#EF4444' : '#22C55E',
          color: 'white', fontWeight: 700, fontSize: '14px',
          fontFamily: 'Fredoka, Nunito, sans-serif',
          cursor: 'pointer',
        }}>
          OK!
        </button>
      </div>
    </div>
  );
}
