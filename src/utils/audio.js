let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, type, duration, volume = 0.15) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {}
}

function playSequence(notes, gap = 0.05) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  try {
    notes.forEach(([freq, type, dur], i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const start = c.currentTime + i * gap;
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(start);
      osc.stop(start + dur);
    });
  } catch {}
}

export const audio = {
  cardPlayed() { playTone(660, 'sine', 0.1, 0.12); },
  timeJump() { playSequence([[523, 'sine', 0.08], [659, 'sine', 0.08], [784, 'sine', 0.08], [1047, 'sine', 0.12]], 0.05); },
  goodEvent() { playSequence([[659, 'triangle', 0.1], [784, 'triangle', 0.1], [1047, 'triangle', 0.15]], 0.08); },
  badEvent() { playSequence([[330, 'triangle', 0.15], [294, 'triangle', 0.2]], 0.1); },
  miniCatch() { playTone(880, 'sine', 0.06, 0.1); },
  miniHazard() { playTone(180, 'sine', 0.08, 0.1); },
  win() { playSequence([[523, 'sine', 0.12], [659, 'sine', 0.12], [784, 'sine', 0.12], [1047, 'sine', 0.2]], 0.15); },
  lose() {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    try {
      [261, 311].forEach(f => {
        const osc = c.createOscillator(); const g = c.createGain();
        osc.type = 'triangle'; osc.frequency.value = f;
        g.gain.setValueAtTime(0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
        osc.connect(g); g.connect(c.destination);
        osc.start(c.currentTime); osc.stop(c.currentTime + 0.5);
      });
      setTimeout(() => {
        if (muted) return;
        const c2 = getCtx(); if (!c2) return;
        const osc = c2.createOscillator(); const g = c2.createGain();
        osc.type = 'triangle'; osc.frequency.value = 233;
        g.gain.setValueAtTime(0.1, c2.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c2.currentTime + 0.4);
        osc.connect(g); g.connect(c2.destination);
        osc.start(c2.currentTime); osc.stop(c2.currentTime + 0.4);
      }, 400);
    } catch {}
  },
  setMuted(m) { muted = m; },
  isMuted() { return muted; },
  init() { getCtx(); },
};

// Background music
let bgInterval = null;
const pentatonic = [261, 294, 330, 392, 440, 523, 587, 659];

export function startBgMusic() {
  if (bgInterval) return;
  bgInterval = setInterval(() => {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    try {
      // Soft drone
      const drone = c.createOscillator();
      const dg = c.createGain();
      drone.type = 'sine';
      drone.frequency.value = 130;
      dg.gain.setValueAtTime(0.03, c.currentTime);
      dg.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 2);
      drone.connect(dg);
      dg.connect(c.destination);
      drone.start(c.currentTime);
      drone.stop(c.currentTime + 2);

      // Random sparkle
      if (Math.random() < 0.6) {
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = note;
        g.gain.setValueAtTime(0.04, c.currentTime + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(c.currentTime + 0.5);
        osc.stop(c.currentTime + 1.5);
      }
    } catch {}
  }, 3000);
}

export function stopBgMusic() {
  if (bgInterval) { clearInterval(bgInterval); bgInterval = null; }
}
