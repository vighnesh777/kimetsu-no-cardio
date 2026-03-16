// Google Fit REST API service
const FIT_BASE = 'https://www.googleapis.com/fitness/v1/users/me';

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Returns midnight (00:00:00) of today in local time as ms timestamp
function todayMidnightMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Returns midnight N full days ago (e.g. n=6 → 6 days ago midnight)
function midnightNDaysAgoMs(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.getTime();
}

// Google's derived sources — these are what the Google Fit app itself uses
// estimated_steps is the exact source Google Fit UI shows for daily steps,
// including manual entries, sensor data, and third-party apps.
const MERGE_SOURCES = {
  steps:         'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
  calories:      'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
  distance:      'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
  heartRate:     'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
  activeMinutes: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes',
};

const DATA_TYPES = {
  sleep: 'com.google.sleep.segment', // no standard merge source for sleep
};

// Fetch aggregate using a specific data source ID (most reliable for merged data)
async function aggregateBySource(token, dataSourceId, startMs, endMs = Date.now(), bucketMs = 86400000) {
  const body = {
    aggregateBy: [{ dataSourceId }],
    bucketByTime: { durationMillis: bucketMs },
    startTimeMillis: startMs,
    endTimeMillis: endMs,
  };
  const res = await fetch(`${FIT_BASE}/dataset:aggregate`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Google Fit error: ${res.status} for ${dataSourceId}`);
  return res.json();
}

// Fallback: aggregate by data type name when no merge source is available
async function aggregateByType(token, dataTypeName, startMs, endMs = Date.now(), bucketMs = 86400000) {
  const body = {
    aggregateBy: [{ dataTypeName }],
    bucketByTime: { durationMillis: bucketMs },
    startTimeMillis: startMs,
    endTimeMillis: endMs,
  };
  const res = await fetch(`${FIT_BASE}/dataset:aggregate`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Google Fit error: ${res.status}`);
  return res.json();
}

// Flatten ALL datasets in every bucket — captures manual entries and
// automatic tracking which may come from different data sources (dataset indices).
const allPoints = (data) =>
  (data.bucket || []).flatMap(b => (b.dataset || []).flatMap(ds => ds.point || []));

export async function fetchTodaySteps(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.steps, todayMidnightMs());
    return allPoints(data).reduce((sum, p) => sum + (p.value?.[0]?.intVal || 0), 0);
  } catch { return null; }
}

export async function fetchWeeklySteps(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.steps, midnightNDaysAgoMs(6));
    return (data.bucket || []).map(b => {
      const day   = new Date(parseInt(b.startTimeMillis))
        .toLocaleDateString('en', { weekday: 'short' });
      const steps = (b.dataset || [])
        .flatMap(ds => ds.point || [])
        .reduce((s, p) => s + (p.value?.[0]?.intVal || 0), 0);
      return { day, steps };
    });
  } catch { return []; }
}

export async function fetchTodayCalories(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.calories, todayMidnightMs());
    return Math.round(allPoints(data).reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0));
  } catch { return null; }
}

export async function fetchTodayDistance(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.distance, todayMidnightMs());
    const meters = allPoints(data).reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0);
    return (meters / 1000).toFixed(2);
  } catch { return null; }
}

export async function fetchHeartRate(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.heartRate, todayMidnightMs(), Date.now(), 3600000);
    const pts = allPoints(data);
    if (!pts.length) return null;
    const avg = pts.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0) / pts.length;
    return Math.round(avg);
  } catch { return null; }
}

export async function fetchSleepLastNight(token) {
  try {
    // Sleep has no standard merge source — use dataTypeName
    const data = await aggregateByType(token, DATA_TYPES.sleep, midnightNDaysAgoMs(1));
    let totalSleepMs = 0;
    for (const point of allPoints(data)) {
      const sleepType = point.value?.[0]?.intVal;
      if (sleepType >= 1 && sleepType <= 4) {
        const start = parseInt(point.startTimeNanos) / 1_000_000;
        const end   = parseInt(point.endTimeNanos)   / 1_000_000;
        totalSleepMs += end - start;
      }
    }
    return (totalSleepMs / 3600000).toFixed(1);
  } catch { return null; }
}

export async function fetchActiveMinutes(token) {
  try {
    const data = await aggregateBySource(token, MERGE_SOURCES.activeMinutes, todayMidnightMs());
    return allPoints(data).reduce((s, p) => s + (p.value?.[0]?.intVal || 0), 0);
  } catch { return null; }
}

export async function fetchAllFitnessData(token) {
  const [steps, calories, distance, heartRate, sleep, activeMinutes, weeklySteps] =
    await Promise.all([
      fetchTodaySteps(token),
      fetchTodayCalories(token),
      fetchTodayDistance(token),
      fetchHeartRate(token),
      fetchSleepLastNight(token),
      fetchActiveMinutes(token),
      fetchWeeklySteps(token),
    ]);

  return { steps, calories, distance, heartRate, sleep, activeMinutes, weeklySteps };
}
