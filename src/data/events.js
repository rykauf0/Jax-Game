// 30 events across 3 eras
export const EVENTS = [
  // EARLY ERA (turns 1-5) - gentler events
  { id: 'e1', era: 'early', type: 'good', icon: '🐟', title: 'Fish Feast!', text: 'Lots of fish nearby!', effect: { belly: 12 }, fact: 'Polar bears love to eat seals and fish!' },
  { id: 'e2', era: 'early', type: 'bad', icon: '🌧️', title: 'Cold Rain', text: 'Aka got cold and wet', effect: { belly: -8 }, fact: 'Rain in the Arctic is becoming more common!' },
  { id: 'e3', era: 'early', type: 'good', icon: '⭐', title: 'Helpers Arrive!', text: 'Scientists bring supplies', effect: { stars: 3 }, fact: 'Scientists study the Arctic to help polar bears!' },
  { id: 'e4', era: 'early', type: 'bad', icon: '🌡️', title: 'Warm Spell', text: 'Ice is getting soft', effect: { temp: 0.05 }, fact: 'The Arctic warms faster than anywhere else!' },
  { id: 'e5', era: 'early', type: 'good', icon: '❄️', title: 'Cold Snap!', text: 'Nice and frosty!', effect: { temp: -0.06 }, fact: 'Polar bears have black skin under white fur!' },
  { id: 'e6', era: 'early', type: 'good', icon: '🦭', title: 'Seal Spotted!', text: 'Aka caught a meal!', effect: { belly: 15 }, fact: 'Polar bears can smell seals from far away!' },
  { id: 'e7', era: 'early', type: 'bad', icon: '💨', title: 'Strong Winds', text: 'Hard to hunt today', effect: { belly: -6 }, fact: 'Arctic winds can be very powerful!' },
  { id: 'e8', era: 'early', type: 'good', icon: '🌟', title: 'Aurora Night!', text: 'Beautiful lights! +2 stars', effect: { stars: 2 }, fact: 'Northern lights are caused by the sun!' },
  { id: 'e9', era: 'early', type: 'bad', icon: '🏭', title: 'Distant Smoke', text: 'Pollution drifts north', effect: { temp: 0.04 }, fact: 'Pollution from cities travels to the Arctic!' },
  { id: 'e10', era: 'early', type: 'good', icon: '🐻', title: 'Bear Friend!', text: 'Made a new friend!', effect: { belly: 8, stars: 1 }, fact: 'Polar bears sometimes play together!' },

  // MID ERA (turns 6-10) - moderate events
  { id: 'm1', era: 'mid', type: 'bad', icon: '🌊', title: 'Ice Cracking!', text: 'The ice is breaking up', effect: { belly: -12, temp: 0.06 }, fact: 'Arctic ice has shrunk a lot in 50 years!' },
  { id: 'm2', era: 'mid', type: 'good', icon: '🎁', title: 'Supply Drop!', text: 'Extra food and stars!', effect: { belly: 15, stars: 2 }, fact: 'Many countries work together to protect bears!' },
  { id: 'm3', era: 'mid', type: 'bad', icon: '🔥', title: 'Heat Wave!', text: "It's too warm!", effect: { belly: -10, temp: 0.08 }, fact: 'Heat waves in the Arctic melt ice very fast!' },
  { id: 'm4', era: 'mid', type: 'good', icon: '🌿', title: 'New Plants!', text: 'Green energy helps!', effect: { temp: -0.05, stars: 1 }, fact: 'Wind and solar power make no pollution!' },
  { id: 'm5', era: 'mid', type: 'bad', icon: '⛈️', title: 'Big Storm!', text: 'Aka needs shelter!', effect: { belly: -14 }, blockableBy: 'stormShield', fact: 'Arctic storms are getting stronger!' },
  { id: 'm6', era: 'mid', type: 'good', icon: '🏔️', title: 'Ice Returns!', text: 'A cold winter helped!', effect: { temp: -0.07 }, fact: 'Cold winters help ice grow back!' },
  { id: 'm7', era: 'mid', type: 'bad', icon: '🛢️', title: 'Oil Spill!', text: 'Water is dirty!', effect: { belly: -10, temp: 0.04 }, fact: 'Oil spills hurt ocean animals!' },
  { id: 'm8', era: 'mid', type: 'good', icon: '📰', title: 'World Cares!', text: 'People want to help!', effect: { stars: 3 }, fact: 'Kids like you help by learning about climate!' },
  { id: 'm9', era: 'mid', type: 'bad', icon: '🏜️', title: 'Dry Summer', text: 'Less food around', effect: { belly: -11 }, fact: 'Warmer summers mean less food for bears!' },
  { id: 'm10', era: 'mid', type: 'good', icon: '🐋', title: 'Whale Visit!', text: 'Ocean friends bring luck!', effect: { belly: 10, stars: 1 }, fact: 'Whales and bears share the Arctic ocean!' },

  // LATE ERA (turns 11-15) - harsh events
  { id: 'l1', era: 'late', type: 'bad', icon: '🌋', title: 'Record Heat!', text: 'Dangerous temperatures!', effect: { belly: -15, temp: 0.10 }, fact: 'Every year can set new heat records!' },
  { id: 'l2', era: 'late', type: 'good', icon: '🎉', title: 'Big Win!', text: 'New climate agreement!', effect: { temp: -0.10, stars: 3, belly: 10 }, fact: 'Countries make promises to cut pollution!' },
  { id: 'l3', era: 'late', type: 'bad', icon: '💀', title: 'Food Crisis!', text: "Aka can't find food!", effect: { belly: -18 }, fact: 'Less ice means bears must swim further for food!' },
  { id: 'l4', era: 'late', type: 'good', icon: '🔋', title: 'Tech Boom!', text: 'Clean energy spreads!', effect: { temp: -0.08, stars: 2 }, fact: 'Solar panels get cheaper every year!' },
  { id: 'l5', era: 'late', type: 'bad', icon: '🌡️', title: 'Tipping Point!', text: 'Ice melting faster!', effect: { temp: 0.12, belly: -12 }, fact: 'Some ice melt cannot be undone!' },
  { id: 'l6', era: 'late', type: 'good', icon: '🌍', title: 'World Unite!', text: 'Everyone helps!', effect: { belly: 15, temp: -0.06, stars: 2 }, fact: 'Working together can slow climate change!' },
  { id: 'l7', era: 'late', type: 'bad', icon: '🌊', title: 'Flood Waters!', text: 'Ice home is sinking!', effect: { belly: -16, temp: 0.08 }, fact: 'Melting ice raises ocean water levels!' },
  { id: 'l8', era: 'late', type: 'good', icon: '🌱', title: 'Forest Grows!', text: 'Trees absorb carbon!', effect: { temp: -0.09 }, fact: 'Trees breathe in the gas that warms Earth!' },
  { id: 'l9', era: 'late', type: 'bad', icon: '🔥', title: 'Wildfire!', text: 'Smoke fills the air!', effect: { belly: -14, temp: 0.07 }, blockableBy: 'stormShield', fact: 'Wildfires release pollution into the air!' },
  { id: 'l10', era: 'late', type: 'bad', icon: '⚡', title: 'Mega Storm!', text: 'Worst storm ever!', effect: { belly: -20 }, blockableBy: 'stormShield', fact: 'Climate change makes storms more powerful!' },
];

export function getEraForTurn(turn) {
  if (turn <= 5) return 'early';
  if (turn <= 10) return 'mid';
  return 'late';
}

export function getRandomEvent(turn) {
  const era = getEraForTurn(turn);
  const eraEvents = EVENTS.filter(e => e.era === era);
  return eraEvents[Math.floor(Math.random() * eraEvents.length)];
}
