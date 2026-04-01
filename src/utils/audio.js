let ctx = null;
let muted = false;

// Create AudioContext lazily, always inside a user gesture call chain
function getCtx() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  // Always try to resume — iOS keeps it suspended until user gesture
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function playNote(freq, type, duration, volume = 0.3, delay = 0) {
  if (muted) return;
  const c = getCtx();
  if (!c || c.state === 'closed') return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = c.currentTime + delay;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + duration);
  } catch (e) {
    console.warn('Audio playNote error:', e);
  }
}

function playChord(notes) {
  notes.forEach(([freq, type, dur, vol, delay]) => {
    playNote(freq, type, dur, vol || 0.1, delay || 0);
  });
}

export const audio = {
  cardPlayed() {
    playChord([
      [880, 'sine', 0.15, 0.35, 0],
      [1320, 'sine', 0.12, 0.25, 0.06],
    ]);
  },

  timeJump() {
    playChord([
      [523, 'sine', 0.12, 0.3, 0],
      [659, 'sine', 0.12, 0.3, 0.07],
      [784, 'sine', 0.12, 0.3, 0.14],
      [1047, 'sine', 0.18, 0.35, 0.21],
      [1568, 'sine', 0.1, 0.15, 0.25],
    ]);
  },

  goodEvent() {
    playChord([
      [659, 'triangle', 0.18, 0.3, 0],
      [784, 'triangle', 0.18, 0.3, 0.1],
      [1047, 'triangle', 0.22, 0.35, 0.2],
      [1047, 'sine', 0.18, 0.15, 0.2],
    ]);
  },

  badEvent() {
    playChord([
      [440, 'triangle', 0.22, 0.25, 0],
      [370, 'triangle', 0.28, 0.25, 0.12],
      [330, 'triangle', 0.32, 0.2, 0.24],
    ]);
  },

  miniCatch() {
    playChord([
      [1047, 'sine', 0.08, 0.35, 0],
      [1568, 'sine', 0.06, 0.2, 0.02],
    ]);
  },

  miniHazard() {
    playNote(200, 'triangle', 0.12, 0.25);
  },

  win() {
    playChord([
      [523, 'sine', 0.18, 0.35, 0],
      [523, 'triangle', 0.18, 0.18, 0],
      [659, 'sine', 0.18, 0.35, 0.18],
      [784, 'sine', 0.18, 0.35, 0.36],
      [1047, 'sine', 0.35, 0.4, 0.54],
      [1047, 'triangle', 0.28, 0.18, 0.54],
      [1568, 'sine', 0.12, 0.15, 0.7],
      [2093, 'sine', 0.1, 0.1, 0.75],
    ]);
  },

  lose() {
    playChord([
      [330, 'triangle', 0.45, 0.25, 0],
      [294, 'triangle', 0.55, 0.22, 0.3],
      [262, 'triangle', 0.65, 0.2, 0.6],
    ]);
  },

  buttonTap() {
    playNote(660, 'sine', 0.08, 0.2);
  },

  setMuted(m) { muted = m; },
  isMuted() { return muted; },

  // Call on first user interaction to unlock AudioContext
  init() {
    const c = getCtx();
    if (c) {
      // Play a silent buffer to fully unlock on iOS
      try {
        const buffer = c.createBuffer(1, 1, 22050);
        const source = c.createBufferSource();
        source.buffer = buffer;
        source.connect(c.destination);
        source.start(0);
      } catch {}
    }
  },
};

// Background music — gentle ambient arctic soundscape
let bgInterval = null;
const chords = [
  [261, 329, 392], // C major
  [220, 329, 440], // Am
  [349, 440, 523], // F
  [392, 494, 587], // G
];
let chordIdx = 0;

export function startBgMusic() {
  if (bgInterval) return;

  const playPad = () => {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    try {
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, c.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, c.currentTime + 3.5);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 4);
      });

      if (Math.random() < 0.5) {
        const pentatonic = [523, 587, 659, 784, 880, 1047];
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const delay = 1 + Math.random() * 2;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = note;
        gain.gain.setValueAtTime(0, c.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.08, c.currentTime + delay + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 1);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime + delay);
        osc.stop(c.currentTime + delay + 1.2);
      }
    } catch {}
  };

  playPad();
  bgInterval = setInterval(playPad, 4000);
}

export function stopBgMusic() {
  if (bgInterval) { clearInterval(bgInterval); bgInterval = null; }
}
