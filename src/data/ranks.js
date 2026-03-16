// Demon Slayer Corps official ranks — lowest to highest
// Points are cumulative totals needed to reach each rank

export const RANKS = [
  {
    id: 'mizunoto',
    kanji: '癸',
    japanese: '水の子',
    english: 'Mizunoto',
    title: 'Lowest Rank',
    description: 'You have passed Final Selection and joined the Corps. Your journey begins.',
    pointsRequired: 0,
    color: '#708090',
    seal: 'XII',
  },
  {
    id: 'mizunoe',
    kanji: '壬',
    japanese: '水の兄',
    english: 'Mizunoe',
    title: 'Eleventh Rank',
    description: 'Your resolve strengthens with each mission completed.',
    pointsRequired: 100,
    color: '#4682B4',
    seal: 'XI',
  },
  {
    id: 'kanoto',
    kanji: '辛',
    japanese: '金の子',
    english: 'Kanoto',
    title: 'Tenth Rank',
    description: 'You have proven your mettle in battle.',
    pointsRequired: 250,
    color: '#C0C0C0',
    seal: 'X',
  },
  {
    id: 'kanoe',
    kanji: '庚',
    japanese: '金の兄',
    english: 'Kanoe',
    title: 'Ninth Rank',
    description: 'Other slayers speak of your growing strength.',
    pointsRequired: 500,
    color: '#DAA520',
    seal: 'IX',
  },
  {
    id: 'tsuchinoto',
    kanji: '己',
    japanese: '土の子',
    english: 'Tsuchinoto',
    title: 'Eighth Rank',
    description: 'You stand firm like the earth beneath your feet.',
    pointsRequired: 800,
    color: '#8B6914',
    seal: 'VIII',
  },
  {
    id: 'tsuchinoe',
    kanji: '戊',
    japanese: '土の兄',
    english: 'Tsuchinoe',
    title: 'Seventh Rank',
    description: 'Demons tremble at the mention of your name.',
    pointsRequired: 1200,
    color: '#CD853F',
    seal: 'VII',
  },
  {
    id: 'hinoto',
    kanji: '丁',
    japanese: '火の子',
    english: 'Hinoto',
    title: 'Sixth Rank',
    description: 'The flame within you burns ever brighter.',
    pointsRequired: 1700,
    color: '#FF8C00',
    seal: 'VI',
  },
  {
    id: 'hinoe',
    kanji: '丙',
    japanese: '火の兄',
    english: 'Hinoe',
    title: 'Fifth Rank',
    description: 'You are among the elite of the Demon Slayer Corps.',
    pointsRequired: 2300,
    color: '#FF4500',
    seal: 'V',
  },
  {
    id: 'kinoto',
    kanji: '乙',
    japanese: '木の子',
    english: 'Kinoto',
    title: 'Second Rank — Pillar Candidate',
    description: 'One step from the pinnacle. Hashira are watching.',
    pointsRequired: 3000,
    color: '#32CD32',
    seal: 'II',
  },
  {
    id: 'hashira',
    kanji: '柱',
    japanese: '柱',
    english: 'Hashira',
    title: 'Pillar — Highest Rank',
    description: 'You stand among the nine pillars of the Demon Slayer Corps. The mightiest of slayers.',
    pointsRequired: 4000,
    color: '#FFD700',
    seal: 'I',
  },
];

// Points earned per action
export const POINT_VALUES = {
  workoutLogged: 20,       // log any workout
  stepGoalHit: 15,         // hit 10k steps
  missionCompleted: 30,    // complete a daily mission
  streakDay: 10,           // each day of active streak
  hevySynced: 10,          // hevy workout synced
};

export function getRankForPoints(points) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (points >= r.pointsRequired) rank = r;
    else break;
  }
  return rank;
}

export function getNextRank(points) {
  for (const r of RANKS) {
    if (points < r.pointsRequired) return r;
  }
  return null; // already Hashira
}

export function getRankProgress(points) {
  const current = getRankForPoints(points);
  const next = getNextRank(points);
  if (!next) return { current, next: null, percent: 100, pointsIntoRank: 0, pointsNeeded: 0 };
  const pointsIntoRank = points - current.pointsRequired;
  const pointsNeeded = next.pointsRequired - current.pointsRequired;
  const percent = Math.min((pointsIntoRank / pointsNeeded) * 100, 100);
  return { current, next, percent, pointsIntoRank, pointsNeeded };
}
