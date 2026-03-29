import { useState, useCallback } from 'react';
import { DIFFICULTY, INFRA_COOLING, TOTAL_TURNS, START_YEAR, YEARS_PER_TURN, START_TEMP, CUB_TURN, CUB_BELLY_THRESHOLD, MINI_GAME_CHANCE, MINI_GAME_START_TURN, SCORE_TIERS } from '../data/constants';
import { CARDS, RARITY_WEIGHTS } from '../data/cards';
import { getRandomEvent } from '../data/events';

function dealCards() {
  const weighted = [];
  CARDS.forEach(c => {
    const w = RARITY_WEIGHTS[c.rarity];
    for (let i = 0; i < w; i++) weighted.push(c);
  });
  const hand = [];
  const used = new Set();
  while (hand.length < 3) {
    const idx = Math.floor(Math.random() * weighted.length);
    const card = weighted[idx];
    if (!used.has(card.id)) {
      used.add(card.id);
      hand.push(card);
    }
  }
  return hand;
}

export function calculateScore(state) {
  const yearsSurvived = state.year - START_YEAR;
  const infraCount = Object.values(state.infra).reduce((a, b) => a + b, 0);
  const items = [
    { label: 'Years Survived', emoji: '📅', points: yearsSurvived * 8 },
    { label: 'Belly Health', emoji: '❤️', points: Math.round(state.belly * 3) },
    { label: 'Infrastructure', emoji: '🏗️', points: infraCount * 15 },
    { label: 'Research', emoji: '🔬', points: state.researchLevel * 10 },
    { label: 'Mini-Games', emoji: '🎮', points: state.miniGameScore * 20 },
    { label: 'Friends', emoji: '🤝', points: state.friends.length * 50 },
  ];
  if (state.cubsAlive) items.push({ label: 'Cubs Survived', emoji: '🐻', points: 100 });
  if (state.won) items.push({ label: 'Victory Bonus', emoji: '🏆', points: 200 });

  const tempPenalty = state.temp > 2.0 ? Math.round((state.temp - 2.0) * 25) : 0;
  if (tempPenalty > 0) items.push({ label: 'Heat Penalty', emoji: '🌡️', points: -tempPenalty });

  const total = items.reduce((a, b) => a + b.points, 0);
  const tier = SCORE_TIERS.find(t => total >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1];
  return { items, total: Math.max(0, total), tier };
}

export function checkAchievements(state, score) {
  const earned = [];
  earned.push('first_game');
  if (state.won) {
    earned.push('guardian');
    if (state.temp < 1.8) earned.push('ice_master');
    if (state.cubsAlive) earned.push('bear_family');
    if (state.belly >= 70) earned.push('well_fed');
    if (state.difficulty === 'hard') earned.push('hero_mode');
  }
  if (Object.values(state.infra).reduce((a, b) => a + b, 0) >= 5) earned.push('green_builder');
  if (score >= 1200) earned.push('diamond_mind');
  return earned;
}

export function useGameState() {
  const [state, setState] = useState(null);

  const initGame = useCallback((difficulty) => {
    const d = DIFFICULTY[difficulty];
    setState({
      difficulty,
      phase: 'cards', // cards, jumping, event, miniGame, gameOver
      turn: 1,
      year: START_YEAR,
      belly: d.startBelly,
      stars: d.startStars,
      temp: START_TEMP,
      infra: { wind: 0, solar: 0, ocean: 0, carbon: 0 },
      researchLevel: 0,
      shield: false,
      stormShield: false,
      hasCubs: false,
      cubsAlive: false,
      cubsAnnounced: false,
      hand: dealCards(),
      currentEvent: null,
      miniGameType: null,
      miniGameScore: 0,
      friends: [],
      won: false,
      cardsPlayedThisTurn: [],
      pendingMiniGame: false,
      newFriend: null,
      newAchievements: [],
    });
  }, []);

  const playCard = useCallback((cardId) => {
    setState(prev => {
      if (!prev || prev.phase !== 'cards') return prev;
      const card = CARDS.find(c => c.id === cardId);
      if (!card || prev.stars < card.cost) return prev;

      const next = { ...prev, stars: prev.stars - card.cost, cardsPlayedThisTurn: [...prev.cardsPlayedThisTurn, cardId] };

      // Apply effects
      const eff = card.effect;
      if (eff.belly) {
        let bellyGain = eff.belly;
        if (next.hasCubs && bellyGain > 0) bellyGain = Math.round(bellyGain * 0.85);
        next.belly = Math.min(100, next.belly + bellyGain);
      }
      if (eff.stars) next.stars += eff.stars;
      if (eff.tempChange) next.temp = Math.max(0.5, next.temp + eff.tempChange);
      if (eff.shield) next.shield = true;
      if (eff.stormShield) next.stormShield = true;
      if (eff.research) next.researchLevel += eff.research;
      if (eff.infra) {
        next.infra = { ...next.infra };
        next.infra[eff.infra] += 1;
      }

      // Remove card from hand
      next.hand = prev.hand.filter(c => c.id !== cardId);
      return next;
    });
  }, []);

  const jumpTime = useCallback(() => {
    setState(prev => {
      if (!prev || prev.phase !== 'cards') return prev;
      const d = DIFFICULTY[prev.difficulty];
      const next = { ...prev, phase: 'jumping' };

      // Advance year
      next.year = prev.year + YEARS_PER_TURN;
      next.turn = prev.turn + 1;

      // Calculate warming
      let warming = (0.05 + prev.turn * 0.01) * d.tempAccelMult;
      if (prev.temp > 2.0) warming += (prev.temp - 2.0) * 0.017;

      // Apply infrastructure cooling
      let cooling = 0;
      Object.entries(prev.infra).forEach(([type, count]) => {
        cooling += INFRA_COOLING[type] * count;
      });
      next.temp = Math.max(0.5, prev.temp + warming - cooling);

      // Belly drain
      let drain = 9 * d.bellyDrainMult;
      drain += Math.max(0, (prev.temp - 1.5) * 5);
      if (prev.hasCubs) drain += 4;
      // Ocean infra food bonus
      drain -= prev.infra.ocean * 1;
      next.belly = Math.max(0, Math.round(prev.belly - drain));

      // Star income
      const baseIncome = (2 + Math.floor(Math.random() * 2)) * d.starIncomeMult;
      next.stars = Math.round(prev.stars + baseIncome + prev.researchLevel);

      // Cubs check
      if (!prev.hasCubs && prev.turn >= CUB_TURN && prev.belly > CUB_BELLY_THRESHOLD) {
        next.hasCubs = true;
        next.cubsAlive = true;
      }
      if (prev.hasCubs) {
        next.cubsAlive = next.belly > 15;
      }

      // Check game over
      if (next.belly <= 0) {
        next.phase = 'gameOver';
        next.won = false;
        return next;
      }

      // Check win
      if (next.turn > TOTAL_TURNS) {
        next.phase = 'gameOver';
        next.won = true;
        return next;
      }

      // Generate event
      next.currentEvent = getRandomEvent(prev.turn);

      // Apply event
      if (next.currentEvent) {
        const evt = next.currentEvent;
        const isBad = evt.type === 'bad';

        // Check shields
        if (isBad && next.shield) {
          next.currentEvent = { ...evt, blocked: true, blockedBy: 'Safe Zone' };
          next.shield = false;
        } else if (isBad && evt.blockableBy === 'stormShield' && next.stormShield) {
          next.currentEvent = { ...evt, blocked: true, blockedBy: "Aka's Den" };
          next.stormShield = false;
        } else {
          const mult = isBad ? d.badEventMult : 1;
          if (evt.effect.belly) {
            const val = Math.round(evt.effect.belly * (isBad ? mult : 1));
            next.belly = Math.min(100, Math.max(0, next.belly + val));
          }
          if (evt.effect.temp) {
            next.temp = Math.max(0.5, next.temp + evt.effect.temp * (isBad ? mult : 1));
          }
          if (evt.effect.stars) {
            next.stars += evt.effect.stars;
          }
        }

        if (next.belly <= 0) {
          next.phase = 'gameOver';
          next.won = false;
          return next;
        }
      }

      next.phase = 'event';
      return next;
    });
  }, []);

  const dismissEvent = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev, currentEvent: null };

      // Check for mini-game
      if (prev.turn >= MINI_GAME_START_TURN && Math.random() < MINI_GAME_CHANCE) {
        const types = ['fish', 'pollution', 'snowflake'];
        next.phase = 'miniGame';
        next.miniGameType = types[Math.floor(Math.random() * types.length)];
      } else {
        next.phase = 'cards';
        next.hand = dealCards();
        next.cardsPlayedThisTurn = [];
      }
      return next;
    });
  }, []);

  const completeMiniGame = useCallback((score, type) => {
    setState(prev => {
      if (!prev) return prev;
      const next = { ...prev };
      next.miniGameScore += score;

      // Rewards based on type and score
      if (type === 'fish') {
        next.belly = Math.min(100, next.belly + Math.round(score * 3));
        next.stars += Math.max(1, Math.floor(score / 2));
      } else if (type === 'pollution') {
        next.temp = Math.max(0.5, next.temp - score * 0.01);
        next.stars += Math.max(1, Math.floor(score / 3));
      } else if (type === 'snowflake') {
        next.belly = Math.min(100, next.belly + Math.round(score * 2));
        next.temp = Math.max(0.5, next.temp - score * 0.008);
        next.stars += Math.max(1, Math.floor(score / 3));
      }

      // Friend collection: score 3+ earns a friend
      if (score >= 3) {
        const allFriendIds = ['seal', 'owl', 'fox', 'narwhal', 'penguin', 'eagle'];
        const available = allFriendIds.filter(f => !prev.friends.includes(f));
        if (available.length > 0) {
          const newFriendId = available[Math.floor(Math.random() * available.length)];
          next.friends = [...prev.friends, newFriendId];
          next.newFriend = newFriendId;
        }
      }

      next.phase = 'cards';
      next.hand = dealCards();
      next.cardsPlayedThisTurn = [];
      next.miniGameType = null;
      return next;
    });
  }, []);

  const clearNewFriend = useCallback(() => {
    setState(prev => prev ? { ...prev, newFriend: null } : prev);
  }, []);

  const markCubsAnnounced = useCallback(() => {
    setState(prev => prev ? { ...prev, cubsAnnounced: true } : prev);
  }, []);

  return {
    state,
    initGame,
    playCard,
    jumpTime,
    dismissEvent,
    completeMiniGame,
    clearNewFriend,
    markCubsAnnounced,
  };
}
