import React from 'react';

// Reusable SVG icon system — no emojis anywhere
// All icons are simple, geometric, colorful SVGs

export function StarIcon({ size = 16, color = '#FBBF24' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

export function HeartIcon({ size = 16, color = '#EF4444' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function TrophyIcon({ size = 16, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M5 3h14v2H5V3zm0 4h14c0 3-2 5.5-5 6.3V16h2v2H8v-2h2v-2.7C7 12.5 5 10 5 7zm-3 0h2c0 2.2.5 3.8 1.3 5H4c-.6-1.2-1-2.8-1-5h-.9zm17 0c0 2.2-.5 3.8-1.3 5H19c.6-1.2 1-2.8 1-5h2zM8 20h8v2H8v-2z" />
    </svg>
  );
}

export function CalendarIcon({ size = 14, color = '#64748B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
    </svg>
  );
}

export function SnowflakeIcon({ size = 14, color = '#60A5FA' }) {
  const r = 9;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <g transform="translate(12,12)" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
        {[0, 60, 120].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1={-r} x2="0" y2={r} />
            <line x1="0" y1={-r * 0.55} x2={-3} y2={-r * 0.8} />
            <line x1="0" y1={-r * 0.55} x2={3} y2={-r * 0.8} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ThermometerIcon({ size = 14, color = '#F97316' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M15 13V5a3 3 0 00-6 0v8a5 5 0 106 0zm-3 6a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}

export function SunIcon({ size = 14, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const rad = (a * Math.PI) / 180;
        return <line key={a} x1={12 + Math.cos(rad) * 7} y1={12 + Math.sin(rad) * 7} x2={12 + Math.cos(rad) * 9.5} y2={12 + Math.sin(rad) * 9.5} stroke={color} strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function WindIcon({ size = 16, color = '#60A5FA' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
    </svg>
  );
}

export function SolarIcon({ size = 16, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="3" y="10" width="18" height="10" rx="1" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5" />
      <line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth="1" />
      <line x1="9" y1="10" x2="9" y2="20" stroke={color} strokeWidth="1" />
      <line x1="15" y1="10" x2="15" y2="20" stroke={color} strokeWidth="1" />
      <circle cx="12" cy="5" r="2.5" fill={color} />
      {[0, 45, 90, 135, 180].map(a => {
        const rad = ((a - 90) * Math.PI) / 180;
        return <line key={a} x1={12 + Math.cos(rad) * 4} y1={5 + Math.sin(rad) * 4} x2={12 + Math.cos(rad) * 5.5} y2={5 + Math.sin(rad) * 5.5} stroke={color} strokeWidth="1.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function WaveIcon({ size = 16, color = '#3B82F6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity="0.5" />
    </svg>
  );
}

export function FactoryIcon({ size = 16, color = '#6B7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M22 22H2V10l6-4v4l6-4v4l6-4v16zM6 20h3v-4H6v4zm5 0h3v-4h-3v4zm5 0h3v-4h-3v4z" />
    </svg>
  );
}

export function ShieldIcon({ size = 16, color = '#10B981' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.58L19 9l-8 8z" />
    </svg>
  );
}

export function SpeakerIcon({ size = 18, on = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#64748B" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {on ? (
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      ) : (
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      )}
    </svg>
  );
}

export function TreeIcon({ size = 16, color = '#22C55E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 2L5 12h3l-2 5h4v5h4v-5h4l-2-5h3L12 2z" />
    </svg>
  );
}

export function MagnifyIcon({ size = 16, color = '#8B5CF6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon({ size = 16, color = '#92400E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

export function HelicopterIcon({ size = 16, color = '#DC2626' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M3 4h18v2H3V4zm4 8h10a2 2 0 012 2v2H5v-2a2 2 0 012-2zm-2 6h14v2H5v-2zm3-8V7h8v3H8z" />
    </svg>
  );
}

export function GlobeIcon({ size = 16, color = '#2563EB' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M4 7h16M4 17h16" opacity="0.5" />
    </svg>
  );
}

export function IceIcon({ size = 16, color = '#38BDF8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.8" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M6 4l6-2 6 2v4l-3 2 3 2v4l-6 2-6-2v-4l3-2-3-2V4z" />
    </svg>
  );
}

export function FishIcon({ size = 16, color = '#3B82F6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8c2.5 0 4.8 1.2 6.3 3L22 5v14l-3.7-2C16.8 18.8 14.5 20 12 20zm-2-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}

export function LightbulbIcon({ size = 14, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M9 21h6v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
    </svg>
  );
}

export function MedalIcon({ size = 16, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 15a5 5 0 100-10 5 5 0 000 10z" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" opacity="0.6" />
    </svg>
  );
}

export function GamepadIcon({ size = 16, color = '#8B5CF6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M6 9h2V7h2v2h2v2h-2v2H8v-2H6V9zm9 1a1 1 0 110-2 1 1 0 010 2zm2 2a1 1 0 110-2 1 1 0 010 2z" />
      <path d="M20 6H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z" opacity="0.3" />
    </svg>
  );
}

export function HandshakeIcon({ size = 16, color = '#10B981' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 4L2 9l4 2v6l6 3 6-3v-6l2-1v7h2V9L12 4zm0 14l-4-2v-3.5L12 15l4-2.5V16l-4 2z" />
    </svg>
  );
}

export function BearIcon({ size = 16, color = '#92400E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="8" cy="6" r="3" opacity="0.6" />
      <circle cx="16" cy="6" r="3" opacity="0.6" />
      <ellipse cx="12" cy="14" rx="7" ry="8" />
      <circle cx="9.5" cy="12" r="1.2" fill="white" />
      <circle cx="14.5" cy="12" r="1.2" fill="white" />
      <ellipse cx="12" cy="15" rx="2.5" ry="1.8" fill="#D4A574" />
    </svg>
  );
}

// Animal friend SVG icons (replacing emoji)
export function SealSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="16" cy="18" rx="12" ry="8" fill="#94A3B8" />
      <circle cx="12" cy="12" r="7" fill="#B0BEC5" />
      <circle cx="10" cy="10.5" r="1.5" fill="#1F2937" />
      <circle cx="14" cy="10.5" r="1.5" fill="#1F2937" />
      <circle cx="12" cy="13" r="1" fill="#1F2937" />
      <line x1="5" y1="12" x2="2" y2="10" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="13" x2="2" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="10" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="13" x2="22" y2="13" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function OwlSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="16" cy="18" rx="9" ry="10" fill="#E8E4DD" />
      <circle cx="12" cy="14" r="4" fill="white" stroke="#D4CBC0" strokeWidth="1" />
      <circle cx="20" cy="14" r="4" fill="white" stroke="#D4CBC0" strokeWidth="1" />
      <circle cx="12" cy="14" r="2" fill="#F59E0B" />
      <circle cx="20" cy="14" r="2" fill="#F59E0B" />
      <circle cx="12" cy="14" r="1" fill="#1F2937" />
      <circle cx="20" cy="14" r="1" fill="#1F2937" />
      <polygon points="16,16 14,20 18,20" fill="#F59E0B" />
      <polygon points="8,8 12,12 10,5" fill="#D4CBC0" />
      <polygon points="24,8 20,12 22,5" fill="#D4CBC0" />
    </svg>
  );
}

export function FoxSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="16" cy="20" rx="8" ry="7" fill="#E8E4DD" />
      <circle cx="16" cy="14" r="7" fill="#F5F0E8" />
      <polygon points="10,8 12,14 7,12" fill="#E8E4DD" />
      <polygon points="22,8 20,14 25,12" fill="#E8E4DD" />
      <circle cx="13" cy="13" r="1.5" fill="#1F2937" />
      <circle cx="19" cy="13" r="1.5" fill="#1F2937" />
      <circle cx="16" cy="16" r="1.2" fill="#1F2937" />
      <ellipse cx="16" cy="22" rx="5" ry="3" fill="white" />
    </svg>
  );
}

export function NarwhalSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="18" cy="18" rx="10" ry="6" fill="#93C5FD" />
      <circle cx="12" cy="16" r="2" fill="white" />
      <circle cx="12" cy="16" r="1" fill="#1F2937" />
      <line x1="8" y1="12" x2="2" y2="4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="26" cy="18" rx="3" ry="2" fill="#60A5FA" />
      <path d="M24 14 Q26 10 28 14" fill="#93C5FD" />
    </svg>
  );
}

export function PenguinSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="16" cy="18" rx="8" ry="10" fill="#1F2937" />
      <ellipse cx="16" cy="20" rx="5" ry="7" fill="white" />
      <circle cx="13" cy="13" r="1.5" fill="white" />
      <circle cx="19" cy="13" r="1.5" fill="white" />
      <circle cx="13" cy="13" r="0.8" fill="#1F2937" />
      <circle cx="19" cy="13" r="0.8" fill="#1F2937" />
      <polygon points="16,15 14,17 18,17" fill="#F59E0B" />
      <ellipse cx="16" cy="28" rx="3" ry="1" fill="#F59E0B" />
    </svg>
  );
}

export function EagleSVG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <ellipse cx="16" cy="18" rx="6" ry="7" fill="#92400E" />
      <circle cx="16" cy="12" r="5" fill="#F5F0E8" />
      <circle cx="14" cy="11" r="1.2" fill="#1F2937" />
      <circle cx="18" cy="11" r="1.2" fill="#1F2937" />
      <polygon points="16,13 14,16 18,16" fill="#F59E0B" />
      <path d="M4 14 Q10 10 12 16" fill="#92400E" />
      <path d="M28 14 Q22 10 20 16" fill="#92400E" />
    </svg>
  );
}

// Map friend IDs to SVG components
export const FRIEND_SVGS = {
  seal: SealSVG,
  owl: OwlSVG,
  fox: FoxSVG,
  narwhal: NarwhalSVG,
  penguin: PenguinSVG,
  eagle: EagleSVG,
};

// Card icon components
export function FeedIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block' }}>
      <ellipse cx="16" cy="18" rx="10" ry="6" fill="#60A5FA" />
      <polygon points="26,18 30,14 30,22" fill="#3B82F6" />
      <circle cx="12" cy="16" r="2" fill="white" />
      <circle cx="12" cy="16" r="1" fill="#1F2937" />
    </svg>
  );
}

export function SealHuntIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'inline-block' }}>
      <ellipse cx="16" cy="20" rx="11" ry="6" fill="#94A3B8" />
      <circle cx="12" cy="14" r="6" fill="#B0BEC5" />
      <circle cx="10" cy="13" r="1.5" fill="#1F2937" />
      <circle cx="14" cy="13" r="1.5" fill="#1F2937" />
      <circle cx="12" cy="16" r="1" fill="#1F2937" />
    </svg>
  );
}
