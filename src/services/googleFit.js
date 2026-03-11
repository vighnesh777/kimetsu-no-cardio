// Google Fit REST API service
const FIT_BASE = 'https://www.googleapis.com/fitness/v1/users/me';

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const nowMs = () => Date.now();
const daysAgoMs = (n) => Date.now() - n * 24 * 60 * 60 * 1000;
const toNanos = (ms) => (ms * 1_000_000).toString();

// Data source type IDs
const DATA_TYPES = {
  steps: 'com.google.step_count.delta',
  calories: 'com.google.calories.expended',
  distance: 'com.google.distance.delta',
  heartRate: 'com.google.heart_rate.bpm',
  sleep: 'com.google.sleep.segment',
  activeMinutes: 'com.google.active_minutes',
  weight: 'com.google.weight',
};

async function aggregateData(token, dataTypeName, durationMs = 86400000, daysBack = 7) {
  const endTime = nowMs();
  const startTime = daysAgoMs(daysBack);

  const body = {
    aggregateBy: [{ dataTypeName }],
    bucketByTime: { durationMillis: durationMs },
    startTimeMillis: startTime,
    endTimeMillis: endTime,
  };

  const res = await fetch(`${FIT_BASE}/dataset:aggregate`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Google Fit error: ${res.status}`);
  return res.json();
}

export async function fetchTodaySteps(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.steps, 86400000, 1);
    const bucket = data.bucket?.[0];
    const points = bucket?.dataset?.[0]?.point || [];
    return points.reduce((sum, p) => sum + (p.value?.[0]?.intVal || 0), 0);
  } catch { return null; }
}

export async function fetchWeeklySteps(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.steps, 86400000, 7);
    return (data.bucket || []).map((b, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      const day = d.toLocaleDateString('en', { weekday: 'short' });
      const steps = (b.dataset?.[0]?.point || []).reduce(
        (s, p) => s + (p.value?.[0]?.intVal || 0), 0
      );
      return { day, steps };
    });
  } catch { return []; }
}

export async function fetchTodayCalories(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.calories, 86400000, 1);
    const points = data.bucket?.[0]?.dataset?.[0]?.point || [];
    const total = points.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0);
    return Math.round(total);
  } catch { return null; }
}

export async function fetchTodayDistance(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.distance, 86400000, 1);
    const points = data.bucket?.[0]?.dataset?.[0]?.point || [];
    const meters = points.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0);
    return (meters / 1000).toFixed(2);
  } catch { return null; }
}

export async function fetchHeartRate(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.heartRate, 3600000, 1);
    const allPoints = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
    if (!allPoints.length) return null;
    const avg = allPoints.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0) / allPoints.length;
    return Math.round(avg);
  } catch { return null; }
}

export async function fetchSleepLastNight(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.sleep, 86400000, 2);
    let totalSleepMs = 0;
    for (const bucket of data.bucket || []) {
      for (const point of bucket.dataset?.[0]?.point || []) {
        const sleepType = point.value?.[0]?.intVal;
        if (sleepType >= 1 && sleepType <= 4) {
          const start = parseInt(point.startTimeNanos) / 1_000_000;
          const end = parseInt(point.endTimeNanos) / 1_000_000;
          totalSleepMs += end - start;
        }
      }
    }
    return (totalSleepMs / 3600000).toFixed(1);
  } catch { return null; }
}

export async function fetchActiveMinutes(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.activeMinutes, 86400000, 1);
    const points = data.bucket?.[0]?.dataset?.[0]?.point || [];
    return points.reduce((s, p) => s + (p.value?.[0]?.intVal || 0), 0);
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
