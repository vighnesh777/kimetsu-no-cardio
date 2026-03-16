// Achievement definitions — anime-accurate names + unlock conditions
// All detection is client-side from Sheets data + Google Fit data

export const ACHIEVEMENTS = [
  // ── Milestones ──────────────────────────────────────────────
  {
    id: 'final_selection',
    name: 'Final Selection',
    japanese: '最終選別',
    description: 'Log your first workout and earn the right to call yourself a Demon Slayer.',
    icon: 'sword',
    category: 'Milestone',
    rarity: 'common',
    check: ({ totalWorkouts }) => totalWorkouts >= 1,
  },
  {
    id: 'nichirin_forged',
    name: 'Nichirin Blade Forged',
    japanese: '日輪刀を鍛える',
    description: 'Haganezuka would be proud. 10 workouts logged.',
    icon: 'blade',
    category: 'Milestone',
    rarity: 'common',
    check: ({ totalWorkouts }) => totalWorkouts >= 10,
  },
  {
    id: 'fifty_missions',
    name: 'Veteran Slayer',
    japanese: '古参の剣士',
    description: 'Fifty workouts. The demons have learned to fear you.',
    icon: 'scroll',
    category: 'Milestone',
    rarity: 'rare',
    check: ({ totalWorkouts }) => totalWorkouts >= 50,
  },
  {
    id: 'century_of_blades',
    name: 'Century of Blades',
    japanese: '百刃',
    description: 'One hundred battles fought. The Upper Moons take notice.',
    icon: 'blades',
    category: 'Milestone',
    rarity: 'epic',
    check: ({ totalWorkouts }) => totalWorkouts >= 100,
  },
  {
    id: 'upper_moon_slayer',
    name: 'Upper Moon Slayer',
    japanese: '上弦討伐',
    description: 'Two hundred workouts. You stand where few dare tread.',
    icon: 'moon',
    category: 'Milestone',
    rarity: 'legendary',
    check: ({ totalWorkouts }) => totalWorkouts >= 200,
  },

  // ── Streaks ──────────────────────────────────────────────────
  {
    id: 'total_concentration',
    name: 'Total Concentration',
    japanese: '全集中',
    description: 'Train for 7 consecutive days without rest.',
    icon: 'breath',
    category: 'Streak',
    rarity: 'rare',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'constant_breathing',
    name: 'Constant Breathing',
    japanese: '常中',
    description: 'Maintain Total Concentration Breathing at all times. 14-day streak.',
    icon: 'breath',
    category: 'Streak',
    rarity: 'epic',
    check: ({ streak }) => streak >= 14,
  },
  {
    id: 'demon_slayer_mark',
    name: 'Demon Slayer Mark',
    japanese: '痣',
    description: 'The mark has appeared on your body. 30-day streak.',
    icon: 'mark',
    category: 'Streak',
    rarity: 'legendary',
    check: ({ streak }) => streak >= 30,
  },
  {
    id: 'mugen_train_survivor',
    name: 'Mugen Train Survivor',
    japanese: '無限列車の生存者',
    description: 'You fell, but you got back up. Return after breaking a streak.',
    icon: 'train',
    category: 'Streak',
    rarity: 'common',
    check: ({ hasReturned }) => hasReturned,
  },

  // ── Activity ─────────────────────────────────────────────────
  {
    id: 'water_surface_slash',
    name: 'Water Surface Slash',
    japanese: '水面斬り',
    description: 'Walk 10,000 steps in a single day.',
    icon: 'steps',
    category: 'Activity',
    rarity: 'common',
    check: ({ maxDailySteps }) => maxDailySteps >= 10000,
  },
  {
    id: 'thunderclap_flash',
    name: 'Thunderclap and Flash',
    japanese: '霹靂一閃',
    description: 'Log an active session of 45 minutes or more.',
    icon: 'thunder',
    category: 'Activity',
    rarity: 'rare',
    check: ({ maxSessionDuration }) => maxSessionDuration >= 45,
  },
  {
    id: 'stone_endurance',
    name: 'Stone Hashira\'s Endurance',
    japanese: '岩柱の忍耐',
    description: 'Complete a training session lasting 60 minutes or more.',
    icon: 'stone',
    category: 'Activity',
    rarity: 'rare',
    check: ({ maxSessionDuration }) => maxSessionDuration >= 60,
  },
  {
    id: 'mount_natagumo',
    name: 'Mount Natagumo',
    japanese: '那田蜘蛛山',
    description: 'Complete 5 workouts in a single week.',
    icon: 'mountain',
    category: 'Activity',
    rarity: 'rare',
    check: ({ maxWeeklyWorkouts }) => maxWeeklyWorkouts >= 5,
  },
  {
    id: 'rehab_training',
    name: 'Rehabilitation Training',
    japanese: 'リハビリ訓練',
    description: 'Log 3 different types of exercises.',
    icon: 'variety',
    category: 'Activity',
    rarity: 'common',
    check: ({ uniqueExercises }) => uniqueExercises >= 3,
  },

  // ── Missions ─────────────────────────────────────────────────
  {
    id: 'wisteria_forest',
    name: 'Wisteria Forest',
    japanese: '藤の森',
    description: 'Complete 10 daily missions.',
    icon: 'flower',
    category: 'Mission',
    rarity: 'rare',
    check: ({ missionsCompleted }) => missionsCompleted >= 10,
  },
  {
    id: 'crow_keeper',
    name: 'Crow Keeper',
    japanese: '鎹鴉',
    description: 'Complete 30 daily missions dispatched by your Kasugai Crow.',
    icon: 'crow',
    category: 'Mission',
    rarity: 'epic',
    check: ({ missionsCompleted }) => missionsCompleted >= 30,
  },
  {
    id: 'sound_hashira_flash',
    name: 'Sound Hashira\'s Flash',
    japanese: '音柱の閃光',
    description: 'Complete all 3 missions in a single day.',
    icon: 'sound',
    category: 'Mission',
    rarity: 'rare',
    check: ({ perfectMissionDays }) => perfectMissionDays >= 1,
  },

  // ── Rank ─────────────────────────────────────────────────────
  {
    id: 'corps_selection_champion',
    name: 'Pillar\'s Path',
    japanese: '柱への道',
    description: 'Reach Kinoto rank — one step from becoming a Hashira.',
    icon: 'rank',
    category: 'Rank',
    rarity: 'epic',
    check: ({ rankPoints }) => rankPoints >= 3000,
  },
  {
    id: 'hashira_ascension',
    name: 'Hashira Ascension',
    japanese: '柱就任',
    description: 'You have reached the pinnacle. You are a Pillar of the Demon Slayer Corps.',
    icon: 'pillar',
    category: 'Rank',
    rarity: 'legendary',
    check: ({ rankPoints }) => rankPoints >= 4000,
  },

  // ── Breathing ────────────────────────────────────────────────
  {
    id: 'first_form_mastered',
    name: 'First Form Unleashed',
    japanese: '壱ノ型解放',
    description: 'Unlock your Second Breathing Form.',
    icon: 'form',
    category: 'Breathing',
    rarity: 'common',
    check: ({ unlockedForms }) => unlockedForms >= 2,
  },
  {
    id: 'halfway_master',
    name: 'Midway to Mastery',
    japanese: '修行の半ば',
    description: 'Unlock half of your breathing style\'s forms.',
    icon: 'form',
    category: 'Breathing',
    rarity: 'rare',
    check: ({ unlockedForms, totalForms }) => totalForms > 0 && unlockedForms >= Math.ceil(totalForms / 2),
  },
  {
    id: 'full_mastery',
    name: 'Full Mastery',
    japanese: '完全習得',
    description: 'All forms of your breathing style have been unlocked.',
    icon: 'master',
    category: 'Breathing',
    rarity: 'legendary',
    check: ({ unlockedForms, totalForms }) => totalForms > 0 && unlockedForms >= totalForms,
  },
];

export const RARITY_COLORS = {
  common:    { color: '#A0A0A0', label: 'Common',    glow: 'rgba(160,160,160,0.4)' },
  rare:      { color: '#4169E1', label: 'Rare',      glow: 'rgba(65,105,225,0.5)'  },
  epic:      { color: '#9B59B6', label: 'Epic',      glow: 'rgba(155,89,182,0.5)'  },
  legendary: { color: '#FFD700', label: 'Legendary', glow: 'rgba(255,215,0,0.6)'   },
};

export const ACHIEVEMENT_CATEGORIES = ['All', 'Milestone', 'Streak', 'Activity', 'Mission', 'Rank', 'Breathing'];

// Check all achievements against current stats and return newly unlocked IDs
export function checkAchievements(stats, alreadyUnlocked) {
  const unlocked = new Set(alreadyUnlocked);
  const newlyUnlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.has(a.id) && a.check(stats)) {
      newlyUnlocked.push(a.id);
    }
  }
  return newlyUnlocked;
}
