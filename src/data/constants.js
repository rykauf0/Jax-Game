export const DIFFICULTY = {
  easy: {
    label: 'Easy',
    bellyDrainMult: 0.85,
    tempAccelMult: 0.8,
    starIncomeMult: 1.2,
    startBelly: 85,
    startStars: 14,
    badEventMult: 0.75,
  },
  medium: {
    label: 'Medium',
    bellyDrainMult: 1.15,
    tempAccelMult: 1.1,
    starIncomeMult: 1.0,
    startBelly: 78,
    startStars: 10,
    badEventMult: 1.1,
  },
  hard: {
    label: 'Hard',
    bellyDrainMult: 1.6,
    tempAccelMult: 1.4,
    starIncomeMult: 0.8,
    startBelly: 65,
    startStars: 8,
    badEventMult: 1.5,
  },
};

export const INFRA_COOLING = {
  wind: 0.019,
  solar: 0.015,
  ocean: 0.012,
  carbon: 0.025,
};

export const INFRA_LABELS = {
  wind: { icon: '💨', name: 'Wind' },
  solar: { icon: '☀️', name: 'Solar' },
  ocean: { icon: '🌊', name: 'Ocean' },
  carbon: { icon: '🧹', name: 'Carbon' },
};

export const TOTAL_TURNS = 15;
export const START_YEAR = 2025;
export const YEARS_PER_TURN = 3;
export const END_YEAR = 2070;
export const START_TEMP = 1.1;
export const CUB_TURN = 5;
export const CUB_BELLY_THRESHOLD = 45;
export const MINI_GAME_CHANCE = 0.2;
export const MINI_GAME_START_TURN = 3;
export const MINI_GAME_DURATION = 10;

export const TEMP_LABELS = [
  { max: 1.5, label: '❄️ Cold', color: '#60A5FA' },
  { max: 2.0, label: '🌡️ Warm', color: '#FBBF24' },
  { max: 2.5, label: '🔥 Hot', color: '#F97316' },
  { max: Infinity, label: '☀️ Danger!', color: '#EF4444' },
];

export const SCORE_TIERS = [
  { name: 'Diamond', emoji: '💎', min: 1200, color: '#B9F2FF' },
  { name: 'Gold', emoji: '🥇', min: 800, color: '#FBBF24' },
  { name: 'Silver', emoji: '🥈', min: 500, color: '#C0C0C0' },
  { name: 'Bronze', emoji: '🥉', min: 0, color: '#CD7F32' },
];

export const FRIENDS = [
  { id: 'seal', name: 'Seal', icon: '🦭' },
  { id: 'owl', name: 'Snowy Owl', icon: '🦉' },
  { id: 'fox', name: 'Arctic Fox', icon: '🦊' },
  { id: 'narwhal', name: 'Narwhal', icon: '🐳' },
  { id: 'penguin', name: 'Penguin', icon: '🐧' },
  { id: 'eagle', name: 'Eagle', icon: '🦅' },
];

export const ACHIEVEMENTS = [
  { id: 'first_game', name: 'First Steps', emoji: '👣', req: 'Complete any game' },
  { id: 'guardian', name: 'Polar Guardian', emoji: '🛡️', req: 'Win on any difficulty' },
  { id: 'ice_master', name: 'Ice Master', emoji: '🧊', req: 'Win with temp under 1.8°' },
  { id: 'bear_family', name: 'Bear Family', emoji: '👨‍👩‍👧‍👦', req: 'Win with cubs alive' },
  { id: 'green_builder', name: 'Builder', emoji: '🏗️', req: 'Build 5+ infrastructure' },
  { id: 'diamond_mind', name: 'Diamond Mind', emoji: '💎', req: 'Score 1200+' },
  { id: 'hero_mode', name: 'True Hero', emoji: '🔥', req: 'Win on Hard' },
  { id: 'well_fed', name: 'Well Fed', emoji: '🐟', req: 'Win with 70%+ belly' },
];
