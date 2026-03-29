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
    bellyDrainMult: 1.35,
    tempAccelMult: 1.25,
    starIncomeMult: 0.8,
    startBelly: 72,
    startStars: 10,
    badEventMult: 1.5,
  },
};

export const INFRA_COOLING = {
  wind: 0.019,
  solar: 0.015,
  ocean: 0.012,
  carbon: 0.03,
};

export const INFRA_LABELS = {
  wind: { iconType: 'wind', name: 'Wind' },
  solar: { iconType: 'solar', name: 'Solar' },
  ocean: { iconType: 'wave', name: 'Ocean' },
  carbon: { iconType: 'factory', name: 'Carbon' },
};

export const TOTAL_TURNS = 15;
export const START_YEAR = 2025;
export const YEARS_PER_TURN = 3;
export const END_YEAR = 2070;
export const START_TEMP = 1.1;
export const CUB_TURN = 4;
export const CUB_BELLY_THRESHOLD = 40;
export const MINI_GAME_START_TURN = 2;
export const MINI_GAME_DURATION = 10;

export const TEMP_LABELS = [
  { max: 1.5, label: 'Cold', iconType: 'snowflake', color: '#60A5FA' },
  { max: 2.0, label: 'Warm', iconType: 'thermometer', color: '#FBBF24' },
  { max: 2.5, label: 'Hot', iconType: 'thermometer', color: '#F97316' },
  { max: Infinity, label: 'Danger!', iconType: 'sun', color: '#EF4444' },
];

export const BELLY_LABELS = [
  { min: 80, label: 'Full!', fish: 5, color: '#22C55E' },
  { min: 60, label: 'Happy', fish: 4, color: '#4ADE80' },
  { min: 40, label: 'Hungry', fish: 3, color: '#FBBF24' },
  { min: 20, label: 'Starving!', fish: 2, color: '#F97316' },
  { min: 0, label: 'Danger!', fish: 1, color: '#EF4444' },
];

export const SCORE_TIERS = [
  { name: 'Diamond', iconType: 'trophy', min: 1200, color: '#B9F2FF' },
  { name: 'Gold', iconType: 'trophy', min: 800, color: '#FBBF24' },
  { name: 'Silver', iconType: 'trophy', min: 500, color: '#C0C0C0' },
  { name: 'Bronze', iconType: 'trophy', min: 0, color: '#CD7F32' },
];

export const FRIENDS = [
  { id: 'seal', name: 'Seal' },
  { id: 'owl', name: 'Snowy Owl' },
  { id: 'fox', name: 'Arctic Fox' },
  { id: 'narwhal', name: 'Narwhal' },
  { id: 'penguin', name: 'Penguin' },
  { id: 'eagle', name: 'Eagle' },
];

export const ACHIEVEMENTS = [
  { id: 'first_game', name: 'First Steps', iconType: 'bear', req: 'Complete any game' },
  { id: 'guardian', name: 'Polar Guardian', iconType: 'shield', req: 'Win on any difficulty' },
  { id: 'ice_master', name: 'Ice Master', iconType: 'ice', req: 'Win with temp under 1.8°' },
  { id: 'bear_family', name: 'Bear Family', iconType: 'heart', req: 'Win with cubs alive' },
  { id: 'green_builder', name: 'Builder', iconType: 'factory', req: 'Build 5+ infrastructure' },
  { id: 'diamond_mind', name: 'Diamond Mind', iconType: 'trophy', req: 'Score 1200+' },
  { id: 'hero_mode', name: 'True Hero', iconType: 'star', req: 'Win on Hard' },
  { id: 'well_fed', name: 'Well Fed', iconType: 'fish', req: 'Win with 70%+ belly' },
];
