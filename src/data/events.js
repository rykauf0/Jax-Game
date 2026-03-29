// 30 events across 3 eras — accurate climate science, kid-friendly language
export const EVENTS = [
  // EARLY ERA (turns 1-5) — introductory, gentler
  { id: 'e1', era: 'early', type: 'good', title: 'Fish Feast!', text: 'The sea ice is thick — great for hunting!', effect: { belly: 12 }, fact: 'Polar bears hunt seals by waiting at breathing holes in the ice.' },
  { id: 'e2', era: 'early', type: 'bad', title: 'Early Thaw', text: 'Spring came too soon this year.', effect: { belly: -8 }, fact: 'Arctic spring arrives 2-3 weeks earlier than it did 30 years ago.' },
  { id: 'e3', era: 'early', type: 'good', title: 'Research Team!', text: 'Scientists are studying the Arctic.', effect: { stars: 3 }, fact: 'Scientists use satellites to track how much Arctic ice melts each year.' },
  { id: 'e4', era: 'early', type: 'bad', title: 'Warm Current', text: 'Warm ocean water is softening the ice.', effect: { temp: 0.05 }, fact: 'The ocean absorbs most of the extra heat trapped by greenhouse gases.' },
  { id: 'e5', era: 'early', type: 'good', title: 'Cold Winter!', text: 'A long winter helped ice grow thick.', effect: { temp: -0.06 }, fact: 'Polar bears have black skin under white fur to absorb heat from the sun.' },
  { id: 'e6', era: 'early', type: 'good', title: 'Seal Colony!', text: 'Aka found a group of seals nearby!', effect: { belly: 15 }, fact: 'A polar bear can smell a seal from over 1 kilometer away.' },
  { id: 'e7', era: 'early', type: 'bad', title: 'Blizzard', text: 'A big storm made hunting hard.', effect: { belly: -6 }, fact: 'Arctic blizzards can have winds over 100 km per hour.' },
  { id: 'e8', era: 'early', type: 'good', title: 'Northern Lights!', text: 'A beautiful aurora — scientists celebrate!', effect: { stars: 2 }, fact: 'The Northern Lights happen when particles from the Sun hit our atmosphere.' },
  { id: 'e9', era: 'early', type: 'bad', title: 'Shipping Lanes', text: 'More ships are traveling through Arctic waters.', effect: { temp: 0.04 }, fact: 'As ice melts, ships can travel routes that used to be frozen shut.' },
  { id: 'e10', era: 'early', type: 'good', title: 'Healthy Habitat!', text: 'The ecosystem is in good shape this year.', effect: { belly: 8, stars: 1 }, fact: 'A healthy Arctic ecosystem has thick ice, plenty of seals, and clean water.' },

  // MID ERA (turns 6-10) — more serious
  { id: 'm1', era: 'mid', type: 'bad', title: 'Ice Breakup!', text: 'Large ice sheets are splitting apart.', effect: { belly: -12, temp: 0.06 }, fact: 'The Arctic loses about 13% of its sea ice every 10 years.' },
  { id: 'm2', era: 'mid', type: 'good', title: 'Aid Package!', text: 'Countries are sending support to Arctic communities.', effect: { belly: 15, stars: 2 }, fact: 'Over 190 countries have signed the Paris Climate Agreement.' },
  { id: 'm3', era: 'mid', type: 'bad', title: 'Heat Wave!', text: 'Temperatures are far above normal.', effect: { belly: -10, temp: 0.08 }, fact: 'The Arctic is warming about 4 times faster than the rest of the planet.' },
  { id: 'm4', era: 'mid', type: 'good', title: 'Clean Energy!', text: 'A nearby community switched to solar power!', effect: { temp: -0.05, stars: 1 }, fact: 'Solar and wind energy create electricity without producing CO2.' },
  { id: 'm5', era: 'mid', type: 'bad', title: 'Permafrost Thaw!', text: 'Frozen ground is melting, releasing trapped gas.', effect: { belly: -14 }, blockableBy: 'stormShield', fact: 'Permafrost contains twice as much carbon as the entire atmosphere.' },
  { id: 'm6', era: 'mid', type: 'good', title: 'Ice Recovery!', text: 'A cold spell helped ice rebuild.', effect: { temp: -0.07 }, fact: 'If we reduce emissions enough, Arctic ice can partially recover.' },
  { id: 'm7', era: 'mid', type: 'bad', title: 'Oil Spill!', text: 'A tanker accident polluted the water.', effect: { belly: -10, temp: 0.04 }, fact: 'Oil spills can poison fish, seals, and bears for many years.' },
  { id: 'm8', era: 'mid', type: 'good', title: 'World Attention!', text: 'People around the world want to help!', effect: { stars: 3 }, fact: 'Young people everywhere are marching for climate action.' },
  { id: 'm9', era: 'mid', type: 'bad', title: 'Longer Summers', text: 'The ice-free season is getting longer.', effect: { belly: -11 }, fact: 'Bears must fast on land when ice melts — some go months without food.' },
  { id: 'm10', era: 'mid', type: 'good', title: 'Whale Migration!', text: 'Whales bring nutrients to Arctic waters!', effect: { belly: 10, stars: 1 }, fact: 'Whale poop fertilizes the ocean and helps tiny plants grow!' },

  // LATE ERA (turns 11-15) — high stakes
  { id: 'l1', era: 'late', type: 'bad', title: 'Record Heat!', text: 'This is the hottest year ever recorded.', effect: { belly: -15, temp: 0.10 }, fact: 'Each of the last 9 years has been among the 10 warmest on record.' },
  { id: 'l2', era: 'late', type: 'good', title: 'Climate Summit!', text: 'World leaders agree to major emission cuts!', effect: { temp: -0.10, stars: 3, belly: 10 }, fact: 'When countries work together, they can reduce emissions faster.' },
  { id: 'l3', era: 'late', type: 'bad', title: 'Starvation Risk!', text: 'Aka must swim far to find any ice.', effect: { belly: -18 }, fact: 'Polar bears sometimes swim over 600 km to reach sea ice.' },
  { id: 'l4', era: 'late', type: 'good', title: 'Green Tech!', text: 'New technology captures CO2 from the air!', effect: { temp: -0.08, stars: 2 }, fact: 'Scientists are building machines that pull CO2 out of the atmosphere.' },
  { id: 'l5', era: 'late', type: 'bad', title: 'Tipping Point!', text: 'Ice is melting so fast it speeds up more melting.', effect: { temp: 0.12, belly: -12 }, fact: 'White ice reflects sunlight, but dark ocean absorbs heat — a feedback loop.' },
  { id: 'l6', era: 'late', type: 'good', title: 'Global Action!', text: 'Every country has a climate plan now!', effect: { belly: 15, temp: -0.06, stars: 2 }, fact: 'Renewable energy is now cheaper than fossil fuels in most countries.' },
  { id: 'l7', era: 'late', type: 'bad', title: 'Sea Level Rise!', text: 'Melting ice is flooding coastal areas.', effect: { belly: -16, temp: 0.08 }, fact: 'If all Arctic ice melted, sea levels would rise about 7 meters.' },
  { id: 'l8', era: 'late', type: 'good', title: 'Reforestation!', text: 'Billions of trees have been planted!', effect: { temp: -0.09 }, fact: 'Trees absorb CO2 — one tree can absorb 22 kg of CO2 per year.' },
  { id: 'l9', era: 'late', type: 'bad', title: 'Arctic Wildfire!', text: 'Fires in the tundra release stored carbon.', effect: { belly: -14, temp: 0.07 }, blockableBy: 'stormShield', fact: 'Arctic wildfires have increased tenfold since the 1970s.' },
  { id: 'l10', era: 'late', type: 'bad', title: 'Mega Storm!', text: 'Extreme weather devastates the region!', effect: { belly: -20 }, blockableBy: 'stormShield', fact: 'Warmer oceans create more powerful and frequent storms.' },
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
