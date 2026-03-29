const KEYS = {
  highScore: 'pg_highScore',
  achievements: 'pg_achievements',
  gamesPlayed: 'pg_gamesPlayed',
};

export function getHighScore() {
  return parseInt(localStorage.getItem(KEYS.highScore) || '0', 10);
}

export function setHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(KEYS.highScore, String(score));
    return true;
  }
  return false;
}

export function getAchievements() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.achievements) || '[]');
  } catch { return []; }
}

export function unlockAchievement(id) {
  const achs = getAchievements();
  if (!achs.includes(id)) {
    achs.push(id);
    localStorage.setItem(KEYS.achievements, JSON.stringify(achs));
    return true;
  }
  return false;
}

export function getGamesPlayed() {
  return parseInt(localStorage.getItem(KEYS.gamesPlayed) || '0', 10);
}

export function incrementGamesPlayed() {
  const n = getGamesPlayed() + 1;
  localStorage.setItem(KEYS.gamesPlayed, String(n));
  return n;
}
