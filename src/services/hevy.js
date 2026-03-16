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
// Maps every known Hevy muscle_group string → react-body-highlighter ID
const HEVY_TO_MODEL = {
  chest:            'chest',
  back:             'upper-back',
  lats:             'upper-back',
  upper_back:       'upper-back',
  lower_back:       'lower-back',
  shoulders:        'front-deltoids',
  front_deltoid:    'front-deltoids',
  rear_deltoid:     'back-deltoids',
  biceps:           'biceps',
  triceps:          'triceps',
  forearms:         'forearm',
  forearm:          'forearm',
  core:             'abs',
  abdominals:       'abs',
  abs:              'abs',
  obliques:         'obliques',
  glutes:           'gluteal',
  quads:            'quadriceps',
  quadriceps:       'quadriceps',
  hamstrings:       'hamstring',
  hamstring:        'hamstring',
  calves:           'calves',
  traps:            'trapezius',
  trapezius:        'trapezius',
  abductors:        'abductors',
  adductors:        'adductor',
  // Compound / catch-all values Hevy sometimes returns
  other:            null,   // skip — no meaningful mapping
};

// Muscles to use when a workout or exercise is tagged "full_body"
const FULL_BODY_MUSCLES = [
  'chest', 'upper-back', 'abs', 'quadriceps',
  'gluteal', 'hamstring', 'front-deltoids', 'triceps', 'biceps',
];

function mapMuscle(raw) {
  if (!raw) return null;
  const key = raw.toLowerCase().replace(/[\s-]/g, '_');
  if (key === 'full_body') return '__full_body__';   // special sentinel
  return HEVY_TO_MODEL[key] ?? null;
}

function extractMuscles(exercise) {
  const muscles = new Set();

  const addRaw = (raw) => {
    if (!raw) return;
    const mapped = mapMuscle(raw);
    if (mapped === '__full_body__') {
      FULL_BODY_MUSCLES.forEach(m => muscles.add(m));
    } else if (mapped) {
      muscles.add(mapped);
    }
  };

  addRaw(exercise.muscle_group);
  for (const m of exercise.other_muscles_group || []) addRaw(m);

  return [...muscles];
}

// ── API calls ───────────────────────────────────────────────────
async function hevyGet(path, apiKey) {
  const res = await fetch(`${HEVY_BASE}${path}`, {
    headers: { 'api-key': apiKey },
  });
  if (!res.ok) {
    // Read body so we surface Hevy's actual error message
    let detail = '';
    try { detail = JSON.stringify(await res.json()); } catch { detail = await res.text().catch(() => ''); }
    if (res.status === 401) throw new Error('Invalid Hevy API key');
    throw new Error(`Hevy API error ${res.status}: ${detail}`);
  }
  return res.json();
}

const TEMPLATE_CACHE_KEY = 'ds_hevy_templates';

// Fetch ALL exercise templates from Hevy (paginated) and cache in localStorage.
// Templates contain muscle_group data that workout exercises don't include.
async function fetchAndCacheTemplates(apiKey) {
  const cached = localStorage.getItem(TEMPLATE_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const templates = {};
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await hevyGet(`/v1/exercise_templates?page=${page}&pageSize=100`, apiKey);
    totalPages = data.page_count ?? 1;
    for (const t of data.exercise_templates ?? []) {
      templates[t.id] = {
        title:           t.title,
        muscle_group:    t.primary_muscle_group ?? t.muscle_group,
        other_muscles:   t.secondary_muscle_groups ?? t.other_muscles_group ?? [],
      };
    }
    page++;
    if (page <= totalPages) await new Promise(r => setTimeout(r, 150));
  }

  console.log('[Hevy] Cached', Object.keys(templates).length, 'exercise templates');
  localStorage.setItem(TEMPLATE_CACHE_KEY, JSON.stringify(templates));
  return templates;
}

// Clear the synced-ID cache — call this to force a full historical re-sync
export function clearSyncedIds() {
  localStorage.removeItem(SYNCED_IDS_KEY);
  localStorage.removeItem(LAST_SYNC_KEY);
  localStorage.removeItem(TEMPLATE_CACHE_KEY); // also refresh templates
}

// Fetch all workouts from Hevy + exercise templates (for muscle data)
// Returns { workouts, templates }
export async function fetchHevyWorkouts(apiKey) {
  const syncedIds = new Set(
    JSON.parse(localStorage.getItem(SYNCED_IDS_KEY) || '[]')
  );

  // Fetch templates first so we have muscle group data for every exercise
  const templates = await fetchAndCacheTemplates(apiKey);

  console.log('[Hevy] Starting sync. Already-synced IDs:', syncedIds.size);

  const all = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await hevyGet(`/v1/workouts?page=${page}&pageSize=10`, apiKey);
    totalPages = data.page_count ?? data.pageCount ?? 1;
    const workouts = data.workouts ?? data.data ?? [];

    console.log('[Hevy] Page', page, '/', totalPages, '— workouts:', workouts.length);

    let hitSynced = false;
    for (const w of workouts) {
      if (syncedIds.has(w.id)) { hitSynced = true; break; }
      all.push(w);
    }
    if (hitSynced) break;
    page++;
    if (page <= totalPages) await new Promise(r => setTimeout(r, 150));
  }

  console.log('[Hevy] Total new workouts:', all.length);
  return { workouts: all, templates };
}

// Convert a Hevy workout object into our internal workout entry format.
// templates = { [templateId]: { title, muscle_group, other_muscles } }
export function hevyToEntry(workout, breathingStyle, templates = {}) {
  const muscles = [];
  const exerciseNames = [];

  for (const ex of workout.exercises || []) {
    exerciseNames.push(ex.title || '');

    // Look up muscle data from the exercise template (muscle_group is not on the exercise itself)
    const tmpl = templates[ex.exercise_template_id] || {};
    const exWithMuscles = {
      muscle_group:        ex.muscle_group        ?? tmpl.muscle_group,
      other_muscles_group: ex.other_muscles_group ?? tmpl.other_muscles ?? [],
    };

    console.log('[Hevy] Exercise:', ex.title, '| muscle_group:', exWithMuscles.muscle_group, '| template_id:', ex.exercise_template_id);

    for (const m of extractMuscles(exWithMuscles)) {
      if (!muscles.includes(m)) muscles.push(m);
    }
  }
  console.log('[Hevy] Resolved muscles for workout:', workout.title, '→', muscles);

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
