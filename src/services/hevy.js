// Hevy API service
// Docs: https://api.hevyapp.com/docs
// Users get their API key from Hevy app → Settings → API Key

const HEVY_BASE      = 'https://api.hevyapp.com';
const LAST_SYNC_KEY  = 'ds_hevy_last_sync';
const SYNCED_IDS_KEY = 'ds_hevy_synced_ids';

// ── Key resolution ──────────────────────────────────────────────
// Key is baked in at build time via VITE_HEVY_API_KEY in .env.local
// (never committed — add as a GitHub Secret for production builds)
const ENV_KEY = import.meta.env.VITE_HEVY_API_KEY || '';

export const getHevyKey      = () => ENV_KEY;
export const getLastSyncTime = () => localStorage.getItem(LAST_SYNC_KEY);

// ── Muscle mapping: Hevy → react-body-highlighter IDs ──────────
const HEVY_TO_MODEL = {
  chest:          'chest',
  back:           'upper-back',
  lats:           'upper-back',
  upper_back:     'upper-back',
  lower_back:     'lower-back',
  shoulders:      'front-deltoids',
  front_deltoid:  'front-deltoids',
  rear_deltoid:   'back-deltoids',
  biceps:         'biceps',
  triceps:        'triceps',
  forearms:       'forearm',
  forearm:        'forearm',
  core:           'abs',
  abdominals:     'abs',
  abs:            'abs',
  obliques:       'obliques',
  glutes:         'gluteal',
  quads:          'quadriceps',
  quadriceps:     'quadriceps',
  hamstrings:     'hamstring',
  hamstring:      'hamstring',
  calves:         'calves',
  traps:          'trapezius',
  trapezius:      'trapezius',
  abductors:      'abductors',
  adductors:      'adductor',
};

function mapMuscle(raw) {
  if (!raw) return null;
  const key = raw.toLowerCase().replace(/[\s-]/g, '_');
  return HEVY_TO_MODEL[key] || null;
}

function extractMuscles(exercise) {
  const muscles = new Set();
  const primary = mapMuscle(exercise.muscle_group);
  if (primary) muscles.add(primary);
  for (const m of exercise.other_muscles_group || []) {
    const mapped = mapMuscle(m);
    if (mapped) muscles.add(mapped);
  }
  return [...muscles];
}

// ── API calls ───────────────────────────────────────────────────
async function hevyGet(path, apiKey) {
  const res = await fetch(`${HEVY_BASE}${path}`, {
    headers: { 'api-key': apiKey },
  });
  if (res.status === 401) throw new Error('Invalid Hevy API key');
  if (!res.ok) throw new Error(`Hevy API error: ${res.status}`);
  return res.json();
}

export async function validateHevyKey(apiKey) {
  try {
    await hevyGet('/v1/workouts?page=1&pageSize=1', apiKey);
    return true;
  } catch {
    return false;
  }
}

// Fetch all workouts from Hevy, stopping at already-synced IDs
export async function fetchHevyWorkouts(apiKey) {
  const syncedIds = new Set(
    JSON.parse(localStorage.getItem(SYNCED_IDS_KEY) || '[]')
  );

  const all = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await hevyGet(`/v1/workouts?page=${page}&pageSize=20`, apiKey);
    totalPages = data.page_count || 1;

    let hitSynced = false;
    for (const w of data.workouts || []) {
      if (syncedIds.has(w.id)) { hitSynced = true; break; }
      all.push(w);
    }
    if (hitSynced) break;
    page++;

    if (page <= totalPages) await new Promise(r => setTimeout(r, 120)); // ~8 req/s
  }

  return all;
}

// Convert a Hevy workout object into our internal workout entry format
export function hevyToEntry(workout, breathingStyle) {
  const muscles = [];
  const exerciseNames = [];

  for (const ex of workout.exercises || []) {
    exerciseNames.push(ex.title || '');
    for (const m of extractMuscles(ex)) {
      if (!muscles.includes(m)) muscles.push(m);
    }
  }

  const durationMin = workout.start_time && workout.end_time
    ? Math.round((new Date(workout.end_time) - new Date(workout.start_time)) / 60000)
    : '';

  const totalSets = (workout.exercises || []).reduce(
    (s, ex) => s + (ex.sets?.length || 0), 0
  );
  const totalReps = (workout.exercises || []).reduce(
    (s, ex) => s + (ex.sets || []).reduce((r, set) => r + (set.reps || 0), 0), 0
  );

  return {
    hevyId:        workout.id,
    source:        'hevy',
    date:          new Date(workout.start_time || workout.created_at).toLocaleDateString(),
    exercise:      workout.title || exerciseNames[0] || 'Hevy Workout',
    breathingStyle: breathingStyle || '',
    sets:          totalSets || '',
    reps:          totalReps || '',
    duration:      durationMin,
    calories:      '',
    notes:         exerciseNames.slice(0, 3).join(', ') + (exerciseNames.length > 3 ? '…' : ''),
    muscles,
  };
}

// Mark a list of workout IDs as synced so we don't re-process them
export function markAsSynced(workoutIds) {
  const existing = JSON.parse(localStorage.getItem(SYNCED_IDS_KEY) || '[]');
  const merged = [...new Set([...existing, ...workoutIds])];
  // Keep only the last 500 IDs to avoid unbounded growth
  localStorage.setItem(SYNCED_IDS_KEY, JSON.stringify(merged.slice(-500)));
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}
