// Comprehensive exercise library with muscle group mappings.
// muscles array uses react-body-highlighter MuscleType IDs exactly.

// Keys must exactly match react-body-highlighter MuscleType IDs
export const MUSCLE_GROUPS = {
  chest:            { label: 'Chest',       view: 'front' },
  abs:              { label: 'Abs',         view: 'front' },
  obliques:         { label: 'Obliques',    view: 'front' },
  'front-deltoids': { label: 'Front Delts', view: 'front' },
  biceps:           { label: 'Biceps',      view: 'front' },
  forearm:          { label: 'Forearms',    view: 'front' },
  quadriceps:       { label: 'Quads',       view: 'front' },
  calves:           { label: 'Calves',      view: 'both'  },
  trapezius:        { label: 'Traps',       view: 'back'  },
  'upper-back':     { label: 'Upper Back',  view: 'back'  },
  'lower-back':     { label: 'Lower Back',  view: 'back'  },
  'back-deltoids':  { label: 'Rear Delts',  view: 'back'  },
  triceps:          { label: 'Triceps',     view: 'back'  },
  gluteal:          { label: 'Glutes',      view: 'back'  },
  hamstring:        { label: 'Hamstrings',  view: 'back'  },
  abductors:        { label: 'Abductors',   view: 'back'  },
  adductor:         { label: 'Adductors',   view: 'front' },
};

export const EXERCISES = [
  // ── PUSH ──────────────────────────────────────────────────────
  { name: 'Barbell Bench Press',    category: 'Push',      muscles: ['chest', 'triceps', 'front-deltoids'],      defaults: { sets: 4, reps: 8 } },
  { name: 'Dumbbell Bench Press',   category: 'Push',      muscles: ['chest', 'triceps', 'front-deltoids'],      defaults: { sets: 3, reps: 12 } },
  { name: 'Incline Bench Press',    category: 'Push',      muscles: ['chest', 'front-deltoids', 'triceps'],      defaults: { sets: 4, reps: 10 } },
  { name: 'Decline Bench Press',    category: 'Push',      muscles: ['chest', 'triceps'],                   defaults: { sets: 3, reps: 12 } },
  { name: 'Push-ups',               category: 'Push',      muscles: ['chest', 'triceps', 'front-deltoids'],      defaults: { sets: 3, reps: 20 } },
  { name: 'Diamond Push-ups',       category: 'Push',      muscles: ['triceps', 'chest'],                   defaults: { sets: 3, reps: 15 } },
  { name: 'Pike Push-ups',          category: 'Push',      muscles: ['front-deltoids', 'triceps'],               defaults: { sets: 3, reps: 12 } },
  { name: 'Overhead Press',         category: 'Push',      muscles: ['front-deltoids', 'triceps', 'trapezius'],      defaults: { sets: 4, reps: 8 } },
  { name: 'Dumbbell Shoulder Press',category: 'Push',      muscles: ['front-deltoids', 'triceps'],               defaults: { sets: 3, reps: 12 } },
  { name: 'Arnold Press',           category: 'Push',      muscles: ['front-deltoids', 'triceps'],               defaults: { sets: 3, reps: 10 } },
  { name: 'Lateral Raises',         category: 'Push',      muscles: ['front-deltoids'],                          defaults: { sets: 3, reps: 15 } },
  { name: 'Front Raises',           category: 'Push',      muscles: ['front-deltoids'],                          defaults: { sets: 3, reps: 15 } },
  { name: 'Cable Fly',              category: 'Push',      muscles: ['chest'],                              defaults: { sets: 3, reps: 15 } },
  { name: 'Pec Deck',               category: 'Push',      muscles: ['chest'],                              defaults: { sets: 3, reps: 15 } },
  { name: 'Tricep Dips',            category: 'Push',      muscles: ['triceps', 'chest'],                   defaults: { sets: 3, reps: 12 } },
  { name: 'Skull Crushers',         category: 'Push',      muscles: ['triceps'],                            defaults: { sets: 3, reps: 12 } },
  { name: 'Tricep Pushdown',        category: 'Push',      muscles: ['triceps'],                            defaults: { sets: 3, reps: 15 } },
  { name: 'Overhead Tricep Ext.',   category: 'Push',      muscles: ['triceps'],                            defaults: { sets: 3, reps: 12 } },

  // ── PULL ──────────────────────────────────────────────────────
  { name: 'Pull-ups',               category: 'Pull',      muscles: ['upper-back', 'biceps', 'back-deltoids'],   defaults: { sets: 4, reps: 8 } },
  { name: 'Chin-ups',               category: 'Pull',      muscles: ['biceps', 'upper-back'],                     defaults: { sets: 3, reps: 8 } },
  { name: 'Barbell Row',            category: 'Pull',      muscles: ['upper-back', 'upper-back', 'biceps'],       defaults: { sets: 4, reps: 8 } },
  { name: 'Dumbbell Row',           category: 'Pull',      muscles: ['upper-back', 'biceps', 'back-deltoids'],   defaults: { sets: 3, reps: 10 } },
  { name: 'Lat Pulldown',           category: 'Pull',      muscles: ['upper-back', 'biceps'],                     defaults: { sets: 3, reps: 12 } },
  { name: 'Seated Cable Row',       category: 'Pull',      muscles: ['upper-back', 'upper-back', 'biceps'],       defaults: { sets: 3, reps: 12 } },
  { name: 'T-Bar Row',              category: 'Pull',      muscles: ['upper-back', 'upper-back', 'biceps'],       defaults: { sets: 4, reps: 10 } },
  { name: 'Face Pulls',             category: 'Pull',      muscles: ['back-deltoids', 'trapezius'],            defaults: { sets: 3, reps: 15 } },
  { name: 'Deadlift',               category: 'Pull',      muscles: ['lower-back', 'gluteal', 'hamstring', 'trapezius', 'upper-back'], defaults: { sets: 4, reps: 5 } },
  { name: 'Romanian Deadlift',      category: 'Pull',      muscles: ['hamstring', 'gluteal', 'lower-back'], defaults: { sets: 3, reps: 10 } },
  { name: 'Good Mornings',          category: 'Pull',      muscles: ['lower-back', 'hamstring'],           defaults: { sets: 3, reps: 12 } },
  { name: 'Bicep Curls',            category: 'Pull',      muscles: ['biceps'],                             defaults: { sets: 3, reps: 12 } },
  { name: 'Hammer Curls',           category: 'Pull',      muscles: ['biceps', 'forearm'],                 defaults: { sets: 3, reps: 12 } },
  { name: 'Preacher Curls',         category: 'Pull',      muscles: ['biceps'],                             defaults: { sets: 3, reps: 12 } },
  { name: 'Concentration Curls',    category: 'Pull',      muscles: ['biceps'],                             defaults: { sets: 3, reps: 12 } },
  { name: 'Reverse Curls',          category: 'Pull',      muscles: ['forearm', 'biceps'],                 defaults: { sets: 3, reps: 12 } },
  { name: 'Shrugs',                 category: 'Pull',      muscles: ['trapezius'],                              defaults: { sets: 3, reps: 15 } },
  { name: 'Inverted Row',           category: 'Pull',      muscles: ['upper-back', 'biceps', 'back-deltoids'], defaults: { sets: 3, reps: 12 } },

  // ── LEGS ──────────────────────────────────────────────────────
  { name: 'Barbell Squat',          category: 'Legs',      muscles: ['quadriceps', 'gluteal', 'hamstring', 'lower-back'], defaults: { sets: 4, reps: 8 } },
  { name: 'Front Squat',            category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 4, reps: 6 } },
  { name: 'Goblet Squat',           category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 3, reps: 15 } },
  { name: 'Leg Press',              category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 4, reps: 12 } },
  { name: 'Hack Squat',             category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 4, reps: 10 } },
  { name: 'Lunges',                 category: 'Legs',      muscles: ['quadriceps', 'gluteal', 'hamstring'],      defaults: { sets: 3, reps: 12 } },
  { name: 'Walking Lunges',         category: 'Legs',      muscles: ['quadriceps', 'gluteal', 'hamstring'],      defaults: { sets: 3, reps: 20 } },
  { name: 'Bulgarian Split Squat',  category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 3, reps: 10 } },
  { name: 'Leg Curl',               category: 'Legs',      muscles: ['hamstring'],                         defaults: { sets: 3, reps: 12 } },
  { name: 'Leg Extension',          category: 'Legs',      muscles: ['quadriceps'],                              defaults: { sets: 3, reps: 15 } },
  { name: 'Hip Thrust',             category: 'Legs',      muscles: ['gluteal', 'hamstring'],               defaults: { sets: 4, reps: 12 } },
  { name: 'Calf Raises',            category: 'Legs',      muscles: ['calves'],                             defaults: { sets: 4, reps: 20 } },
  { name: 'Seated Calf Raises',     category: 'Legs',      muscles: ['calves'],                             defaults: { sets: 3, reps: 20 } },
  { name: 'Step-ups',               category: 'Legs',      muscles: ['quadriceps', 'gluteal'],                    defaults: { sets: 3, reps: 12 } },
  { name: 'Sumo Squat',             category: 'Legs',      muscles: ['gluteal', 'quadriceps', 'hamstring'],      defaults: { sets: 3, reps: 15 } },
  { name: 'Wall Sit',               category: 'Legs',      muscles: ['quadriceps'],                              defaults: { sets: 3, duration: 1 } },
  { name: 'Box Jumps',              category: 'Legs',      muscles: ['quadriceps', 'gluteal', 'calves'],          defaults: { sets: 4, reps: 8 } },
  { name: 'Glute Bridges',          category: 'Legs',      muscles: ['gluteal', 'hamstring'],               defaults: { sets: 3, reps: 20 } },

  // ── CORE ──────────────────────────────────────────────────────
  { name: 'Plank',                  category: 'Core',      muscles: ['abs', 'lower-back', 'gluteal'],        defaults: { sets: 3, duration: 1 } },
  { name: 'Side Plank',             category: 'Core',      muscles: ['obliques', 'abs'],                    defaults: { sets: 3, duration: 1 } },
  { name: 'Crunches',               category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 20 } },
  { name: 'Bicycle Crunches',       category: 'Core',      muscles: ['abs', 'obliques'],                    defaults: { sets: 3, reps: 20 } },
  { name: 'Russian Twists',         category: 'Core',      muscles: ['obliques', 'abs'],                    defaults: { sets: 3, reps: 20 } },
  { name: 'Leg Raises',             category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 15 } },
  { name: 'Hanging Knee Raises',    category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 12 } },
  { name: 'Ab Wheel Rollout',       category: 'Core',      muscles: ['abs', 'upper-back'],                        defaults: { sets: 3, reps: 10 } },
  { name: 'Dead Bug',               category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 12 } },
  { name: 'Bird Dog',               category: 'Core',      muscles: ['abs', 'lower-back', 'gluteal'],        defaults: { sets: 3, reps: 12 } },
  { name: 'Mountain Climbers',      category: 'Core',      muscles: ['abs', 'front-deltoids'],                   defaults: { sets: 3, duration: 1 } },
  { name: 'V-ups',                  category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 15 } },
  { name: 'Cable Crunch',           category: 'Core',      muscles: ['abs'],                                defaults: { sets: 3, reps: 15 } },
  { name: 'Dragon Flag',            category: 'Core',      muscles: ['abs', 'lower-back'],                  defaults: { sets: 3, reps: 6 } },

  // ── CARDIO ────────────────────────────────────────────────────
  { name: 'Running',                category: 'Cardio',    muscles: ['quadriceps', 'hamstring', 'calves', 'gluteal'], defaults: { duration: 30 } },
  { name: 'Cycling',                category: 'Cardio',    muscles: ['quadriceps', 'hamstring', 'calves'],      defaults: { duration: 30 } },
  { name: 'Swimming',               category: 'Cardio',    muscles: ['upper-back', 'front-deltoids', 'chest', 'triceps'], defaults: { duration: 30 } },
  { name: 'Jump Rope',              category: 'Cardio',    muscles: ['calves', 'front-deltoids', 'forearm'],    defaults: { duration: 15 } },
  { name: 'HIIT',                   category: 'Cardio',    muscles: ['quadriceps', 'gluteal', 'abs', 'front-deltoids'], defaults: { duration: 20 } },
  { name: 'Rowing Machine',         category: 'Cardio',    muscles: ['upper-back', 'biceps', 'quadriceps', 'abs'], defaults: { duration: 20 } },
  { name: 'Stair Climber',          category: 'Cardio',    muscles: ['gluteal', 'quadriceps', 'calves'],          defaults: { duration: 20 } },
  { name: 'Elliptical',             category: 'Cardio',    muscles: ['quadriceps', 'hamstring', 'gluteal'],      defaults: { duration: 30 } },
  { name: 'Burpees',                category: 'Cardio',    muscles: ['chest', 'abs', 'quadriceps', 'gluteal'],    defaults: { sets: 4, reps: 10 } },
  { name: 'Battle Ropes',           category: 'Cardio',    muscles: ['front-deltoids', 'triceps', 'abs'],        defaults: { sets: 4, duration: 1 } },
  { name: 'Sled Push',              category: 'Cardio',    muscles: ['quadriceps', 'gluteal', 'front-deltoids'],       defaults: { sets: 4, duration: 1 } },

  // ── FULL BODY ─────────────────────────────────────────────────
  { name: 'Clean and Press',        category: 'Full Body', muscles: ['quadriceps', 'gluteal', 'front-deltoids', 'trapezius', 'triceps'], defaults: { sets: 4, reps: 5 } },
  { name: 'Thruster',               category: 'Full Body', muscles: ['quadriceps', 'front-deltoids', 'triceps'],      defaults: { sets: 4, reps: 8 } },
  { name: 'Kettlebell Swing',       category: 'Full Body', muscles: ['gluteal', 'hamstring', 'lower-back', 'front-deltoids'], defaults: { sets: 4, reps: 15 } },
  { name: 'Turkish Get-up',         category: 'Full Body', muscles: ['front-deltoids', 'abs', 'gluteal'],         defaults: { sets: 3, reps: 5 } },
  { name: 'Man Maker',              category: 'Full Body', muscles: ['chest', 'upper-back', 'front-deltoids', 'abs', 'quadriceps'], defaults: { sets: 3, reps: 8 } },
  { name: 'Power Clean',            category: 'Full Body', muscles: ['quadriceps', 'gluteal', 'trapezius', 'front-deltoids', 'lower-back'], defaults: { sets: 5, reps: 3 } },
  { name: 'Snatch',                 category: 'Full Body', muscles: ['quadriceps', 'gluteal', 'front-deltoids', 'trapezius', 'lower-back'], defaults: { sets: 5, reps: 3 } },

  // ── RECOVERY ──────────────────────────────────────────────────
  { name: 'Meditation',             category: 'Recovery',  muscles: [],                                     defaults: { duration: 20 } },
  { name: 'Yoga',                   category: 'Recovery',  muscles: ['abs', 'lower-back', 'hamstring'],    defaults: { duration: 45 } },
  { name: 'Stretching',             category: 'Recovery',  muscles: [],                                     defaults: { duration: 15 } },
  { name: 'Foam Rolling',           category: 'Recovery',  muscles: [],                                     defaults: { duration: 15 } },
];

// Build a lookup map: exercise name → exercise object
export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map(e => [e.name, e]));

/** Return muscles trained from a list of workout objects.
 *  Priority: use w.muscles (set at log time, covers custom exercises)
 *  Fallback: look up by exercise name in EXERCISE_MAP (covers Sheets-fetched rows)
 */
export function getMusclesFromWorkouts(workouts) {
  const counts = {};
  workouts.forEach(w => {
    // w.muscles is an array when available (fresh log or parsed from Sheets)
    const muscles =
      (Array.isArray(w.muscles) && w.muscles.length > 0)
        ? w.muscles
        : EXERCISE_MAP[w.exercise]?.muscles || [];

    muscles.forEach(m => {
      if (m) counts[m] = (counts[m] || 0) + 1;
    });
  });
  return counts;
}

/** Muscles trained from workouts on a specific date string */
export function getMusclesForDate(workouts, dateStr) {
  return getMusclesFromWorkouts(workouts.filter(w => w.date === dateStr));
}

export const CATEGORIES = ['All', ...new Set(EXERCISES.map(e => e.category))];
