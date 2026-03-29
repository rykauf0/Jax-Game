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

function playNote(freq, type, duration, volume = 0.12, delay = 0) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
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
  } catch {}
}

function playChord(notes) {
  notes.forEach(([freq, type, dur, vol, delay]) => {
    playNote(freq, type, dur, vol || 0.1, delay || 0);
  });
}

export const audio = {
  cardPlayed() {
    // Bright, happy two-note ping
    playChord([
      [880, 'sine', 0.12, 0.1, 0],
      [1320, 'sine', 0.1, 0.07, 0.06],
    ]);
  },

  timeJump() {
    // Magical rising arpeggio
    playChord([
      [523, 'sine', 0.1, 0.1, 0],
      [659, 'sine', 0.1, 0.1, 0.07],
      [784, 'sine', 0.1, 0.1, 0.14],
      [1047, 'sine', 0.15, 0.12, 0.21],
      // Add sparkly overtone
      [1568, 'sine', 0.08, 0.04, 0.25],
    ]);
  },

  goodEvent() {
    // Happy ascending chime with harmony
    playChord([
      [659, 'triangle', 0.15, 0.1, 0],
      [784, 'triangle', 0.15, 0.1, 0.1],
      [1047, 'triangle', 0.2, 0.12, 0.2],
      [1047, 'sine', 0.15, 0.05, 0.2], // harmonic shimmer
    ]);
  },

  badEvent() {
    // Gentle descending tone — not scary, just "oh no"
    playChord([
      [440, 'triangle', 0.2, 0.08, 0],
      [370, 'triangle', 0.25, 0.08, 0.12],
      [330, 'triangle', 0.3, 0.06, 0.24],
    ]);
  },

  miniCatch() {
    // Quick satisfying pop with overtone
    playChord([
      [1047, 'sine', 0.06, 0.1, 0],
      [1568, 'sine', 0.05, 0.05, 0.02],
    ]);
  },

  miniHazard() {
    // Short dull thud
    playNote(200, 'triangle', 0.1, 0.08);
  },

  win() {
    // Victory fanfare! Celebratory and triumphant
    playChord([
      [523, 'sine', 0.15, 0.12, 0],
      [523, 'triangle', 0.15, 0.06, 0],
      [659, 'sine', 0.15, 0.12, 0.18],
      [784, 'sine', 0.15, 0.12, 0.36],
      [1047, 'sine', 0.3, 0.14, 0.54],
      [1047, 'triangle', 0.25, 0.06, 0.54],
      // Sparkle at the end
      [1568, 'sine', 0.1, 0.04, 0.7],
      [2093, 'sine', 0.08, 0.03, 0.75],
    ]);
  },

  lose() {
    // Gentle, sad — not punishing
    playChord([
      [330, 'triangle', 0.4, 0.08, 0],
      [294, 'triangle', 0.5, 0.07, 0.3],
      [262, 'triangle', 0.6, 0.06, 0.6],
    ]);
  },

  buttonTap() {
    playNote(660, 'sine', 0.06, 0.06);
  },

  setMuted(m) { muted = m; },
  isMuted() { return muted; },
  init() { getCtx(); },
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

      // Soft pad chord
      chord.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, c.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, c.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, c.currentTime + 3.5);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 4);
      });

      // Random pentatonic sparkle
      if (Math.random() < 0.5) {
        const pentatonic = [523, 587, 659, 784, 880, 1047];
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const delay = 1 + Math.random() * 2;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = note;
        gain.gain.setValueAtTime(0, c.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.03, c.currentTime + delay + 0.1);
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
