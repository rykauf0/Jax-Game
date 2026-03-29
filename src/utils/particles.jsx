import { useState, useCallback, useRef, useEffect } from 'react';

let nextId = 0;

export function useParticles() {
  const [particles, setParticles] = useState([]);
  const rafRef = useRef(null);

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setParticles(prev => {
        if (prev.length === 0) return prev;
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy + (p.gravity || 0) * dt,
            life: p.life - dt,
            scale: p.scale * (p.shrink || 0.98),
          }))
          .filter(p => p.life > 0);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const burst = useCallback(({ x, y, count = 12, colors = ['#FBBF24', '#F472B6', '#34D399', '#60A5FA'], speed = 120, life = 0.8, size = 8, gravity = 80, shape = 'circle' }) => {
    const newParticles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const v = speed * (0.5 + Math.random() * 0.5);
      return {
        id: nextId++,
        x, y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v - 40,
        life: life * (0.7 + Math.random() * 0.3),
        scale: 1,
        size: size * (0.5 + Math.random() * 0.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity,
        shrink: 0.97,
        shape,
      };
    });
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const sparkle = useCallback(({ x, y, count = 8, color = '#FBBF24' }) => {
    burst({ x, y, count, colors: [color, '#FEF3C7', '#FDE68A', 'white'], speed: 80, life: 0.6, size: 6, gravity: 20, shape: 'star' });
  }, [burst]);

  const hearts = useCallback(({ x, y, count = 6 }) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: nextId++,
      x: x + (Math.random() - 0.5) * 40,
      y,
      vx: (Math.random() - 0.5) * 30,
      vy: -(60 + Math.random() * 60),
      life: 1.2,
      scale: 1,
      size: 16 + Math.random() * 8,
      color: ['#F472B6', '#FB7185', '#EC4899'][Math.floor(Math.random() * 3)],
      gravity: -10,
      shrink: 0.99,
      shape: 'heart',
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const snowflakes = useCallback(({ x, y, count = 8 }) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: nextId++,
      x: x + (Math.random() - 0.5) * 40,
      y,
      vx: (Math.random() - 0.5) * 40,
      vy: -(40 + Math.random() * 50),
      life: 1.0,
      scale: 1,
      size: 10 + Math.random() * 8,
      color: ['#BFDBFE', '#93C5FD', '#DBEAFE', 'white'][Math.floor(Math.random() * 4)],
      gravity: 20,
      shrink: 0.98,
      shape: 'snowflake',
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const ring = useCallback(({ x, y, color = '#FBBF24' }) => {
    setParticles(prev => [...prev, {
      id: nextId++, x, y, vx: 0, vy: 0,
      life: 0.5, scale: 1, size: 20, color, gravity: 0, shrink: 1.08, shape: 'ring',
    }]);
  }, []);

  return { particles, burst, sparkle, hearts, snowflakes, ring };
}

export function ParticleLayer({ particles }) {
  if (particles.length === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {particles.map(p => {
        const opacity = Math.min(1, p.life * 2);
        const s = p.size * p.scale;
        const style = {
          position: 'absolute',
          left: p.x - s / 2,
          top: p.y - s / 2,
          width: s, height: s,
          opacity,
          transform: `scale(${p.scale})`,
          pointerEvents: 'none',
        };

        if (p.shape === 'heart') {
          return (
            <div key={p.id} style={{ ...style, fontSize: s, lineHeight: 1, textAlign: 'center', width: 'auto', height: 'auto' }}>
              <span style={{ color: p.color }}>❤</span>
            </div>
          );
        }
        if (p.shape === 'snowflake') {
          return (
            <div key={p.id} style={{ ...style, fontSize: s, lineHeight: 1, textAlign: 'center', width: 'auto', height: 'auto' }}>
              <span style={{ color: p.color }}>❄</span>
            </div>
          );
        }
        if (p.shape === 'star') {
          return (
            <div key={p.id} style={{ ...style, fontSize: s, lineHeight: 1, textAlign: 'center', width: 'auto', height: 'auto' }}>
              <span style={{ color: p.color }}>✦</span>
            </div>
          );
        }
        if (p.shape === 'ring') {
          return (
            <div key={p.id} style={{
              ...style,
              width: s * 2, height: s * 2,
              left: p.x - s, top: p.y - s,
              borderRadius: '50%',
              border: `3px solid ${p.color}`,
              background: 'transparent',
            }} />
          );
        }
        // Default circle
        return (
          <div key={p.id} style={{
            ...style, borderRadius: '50%', background: p.color,
          }} />
        );
      })}
    </div>
  );
}
