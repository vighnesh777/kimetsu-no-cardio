// Daily mission templates — dispatched by your Kasugai Crow
// 3 missions per day, generated deterministically from the date

export const MISSION_TEMPLATES = [
  // Steps-based
  { id: 'm_steps_5k',  type: 'steps',    title: 'First Steps',        japanese: '最初の一歩',    description: 'Walk 5,000 steps today.',   target: 5000,  unit: 'steps', points: 20 },
  { id: 'm_steps_8k',  type: 'steps',    title: 'Long March',         japanese: '長征',          description: 'Walk 8,000 steps today.',   target: 8000,  unit: 'steps', points: 25 },
  { id: 'm_steps_10k', type: 'steps',    title: 'Hashira Patrol',     japanese: '柱の巡回',      description: 'Complete 10,000 steps — a full patrol.',  target: 10000, unit: 'steps', points: 35 },
  { id: 'm_steps_12k', type: 'steps',    title: 'Relentless Pursuit', japanese: '執念の追跡',    description: 'Walk 12,000 steps. Leave nothing to chance.', target: 12000, unit: 'steps', points: 40 },

  // Workout-based
  { id: 'm_workout_1', type: 'workout',  title: 'Blood and Sweat',    japanese: '血と汗',        description: 'Log at least 1 training session today.',  target: 1, unit: 'session', points: 25 },
  { id: 'm_workout_2', type: 'workout',  title: 'Double Training',    japanese: '二重稽古',      description: 'Complete 2 training sessions today.',     target: 2, unit: 'sessions', points: 40 },
  { id: 'm_push_day',  type: 'category', title: 'Push Like Rengoku',  japanese: '煉獄の如く押す', description: 'Complete a Push training session.',       target: 'Push', unit: 'category', points: 25 },
  { id: 'm_pull_day',  type: 'category', title: 'Lats Like Giyu',     japanese: '義勇の背中',    description: 'Complete a Pull training session.',       target: 'Pull', unit: 'category', points: 25 },
  { id: 'm_leg_day',   type: 'category', title: 'Stand Like a Pillar', japanese: '柱の如く立つ',  description: 'Complete a Legs training session.',       target: 'Legs', unit: 'category', points: 25 },
  { id: 'm_core_day',  type: 'category', title: 'Core of Steel',       japanese: '鋼の核',        description: 'Complete a Core training session.',       target: 'Core', unit: 'category', points: 25 },
  { id: 'm_cardio',    type: 'category', title: 'Demon Hunt Cardio',   japanese: '鬼狩り走破',    description: 'Complete a Cardio session.',              target: 'Cardio', unit: 'category', points: 25 },
  { id: 'm_fullbody',  type: 'category', title: 'Total Commitment',    japanese: '全力投球',       description: 'Complete a Full Body workout.',           target: 'Full Body', unit: 'category', points: 30 },
  { id: 'm_recovery',  type: 'category', title: 'Shinobu\'s Wisdom',   japanese: '胡蝶の教え',    description: 'Log a Recovery session. Rest is training too.', target: 'Recovery', unit: 'category', points: 20 },

  // Active minutes
  { id: 'm_active_20', type: 'active',   title: 'Warm-Up Mission',    japanese: 'ウォームアップ', description: 'Be active for 20 minutes.',   target: 20, unit: 'min', points: 15 },
  { id: 'm_active_30', type: 'active',   title: 'Breathing Practice', japanese: '呼吸修行',      description: 'Be active for 30 minutes.',   target: 30, unit: 'min', points: 25 },
  { id: 'm_active_45', type: 'active',   title: 'Concentration',      japanese: '集中',          description: 'Be active for 45 minutes.',   target: 45, unit: 'min', points: 35 },
  { id: 'm_active_60', type: 'active',   title: 'Endurance Test',     japanese: '耐久試験',      description: 'Sustain 60 minutes of activity.',target: 60, unit: 'min', points: 45 },

  // Calories
  { id: 'm_cal_300',  type: 'calories',  title: 'Burn the Demon',     japanese: '鬼を燃やす',    description: 'Burn 300 calories today.',  target: 300, unit: 'kcal', points: 20 },
  { id: 'm_cal_500',  type: 'calories',  title: 'Furnace of Will',    japanese: '意志の炉',      description: 'Burn 500 calories today.',  target: 500, unit: 'kcal', points: 30 },
];

// Deterministic daily mission selection — same 3 missions on same date across all devices
export function getDailyMissions(dateStr) {
  // Simple seeded hash from date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed << 5) - seed + dateStr.charCodeAt(i)) | 0;
  }
  seed = Math.abs(seed);

  const total = MISSION_TEMPLATES.length;
  const idx1 = seed % total;
  const idx2 = (seed * 31 + 7) % total;
  const idx3 = (seed * 97 + 13) % total;

  // Ensure no duplicates
  const picked = [idx1];
  let i2 = idx2;
  while (picked.includes(i2)) i2 = (i2 + 1) % total;
  picked.push(i2);
  let i3 = idx3;
  while (picked.includes(i3)) i3 = (i3 + 1) % total;
  picked.push(i3);

  return picked.map(i => MISSION_TEMPLATES[i]);
}

export function todayKey() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

// Check if a mission is auto-completable from fitness data
export function checkMissionCompletion(mission, { steps, activeMinutes, calories, todayWorkouts }) {
  switch (mission.type) {
    case 'steps':    return (steps || 0) >= mission.target;
    case 'active':   return (activeMinutes || 0) >= mission.target;
    case 'calories': return (calories || 0) >= mission.target;
    case 'workout':  return todayWorkouts.length >= mission.target;
    case 'category':
      return todayWorkouts.some(w =>
        w.breathingStyle === mission.target ||
        (w.category && w.category === mission.target) ||
        // Match against exercise category from exercises.js
        mission.target === w.exerciseCategory
      );
    default: return false;
  }
}
