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

const DATA_TYPES = {
  steps:         'com.google.step_count.delta',
  calories:      'com.google.calories.expended',
  distance:      'com.google.distance.delta',
  heartRate:     'com.google.heart_rate.bpm',
  sleep:         'com.google.sleep.segment',
  activeMinutes: 'com.google.active_minutes',
};

// Fetch aggregate data aligned to calendar days (startMs → now)
async function aggregateData(token, dataTypeName, startMs, endMs = Date.now(), bucketMs = 86400000) {
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

export async function fetchTodaySteps(token) {
  try {
    // Start at midnight so we match exactly what Google Fit shows on the phone
    const data = await aggregateData(token, DATA_TYPES.steps, todayMidnightMs());
    const points = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
    return points.reduce((sum, p) => sum + (p.value?.[0]?.intVal || 0), 0);
  } catch { return null; }
}

export async function fetchWeeklySteps(token) {
  try {
    // 7 calendar days: midnight 6 days ago → now, one bucket per day
    const data = await aggregateData(token, DATA_TYPES.steps, midnightNDaysAgoMs(6));
    return (data.bucket || []).map(b => {
      // Use the bucket's own start time for the day label
      const day = new Date(parseInt(b.startTimeMillis))
        .toLocaleDateString('en', { weekday: 'short' });
      const steps = (b.dataset?.[0]?.point || []).reduce(
        (s, p) => s + (p.value?.[0]?.intVal || 0), 0
      );
      return { day, steps };
    });
  } catch { return []; }
}

export async function fetchTodayCalories(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.calories, todayMidnightMs());
    const points = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
    return Math.round(points.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0));
  } catch { return null; }
}

export async function fetchTodayDistance(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.distance, todayMidnightMs());
    const points = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
    const meters = points.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0);
    return (meters / 1000).toFixed(2);
  } catch { return null; }
}

export async function fetchHeartRate(token) {
  try {
    // Use 1-hour buckets since midnight for a resting average
    const data = await aggregateData(token, DATA_TYPES.heartRate, todayMidnightMs(), Date.now(), 3600000);
    const allPoints = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
    if (!allPoints.length) return null;
    const avg = allPoints.reduce((s, p) => s + (p.value?.[0]?.fpVal || 0), 0) / allPoints.length;
    return Math.round(avg);
  } catch { return null; }
}

export async function fetchSleepLastNight(token) {
  try {
    // Look back 2 calendar days to catch sleep that started before midnight
    const data = await aggregateData(token, DATA_TYPES.sleep, midnightNDaysAgoMs(1));
    let totalSleepMs = 0;
    for (const bucket of data.bucket || []) {
      for (const point of bucket.dataset?.[0]?.point || []) {
        const sleepType = point.value?.[0]?.intVal;
        if (sleepType >= 1 && sleepType <= 4) {
          const start = parseInt(point.startTimeNanos) / 1_000_000;
          const end   = parseInt(point.endTimeNanos)   / 1_000_000;
          totalSleepMs += end - start;
        }
      }
    }
    return (totalSleepMs / 3600000).toFixed(1);
  } catch { return null; }
}

export async function fetchActiveMinutes(token) {
  try {
    const data = await aggregateData(token, DATA_TYPES.activeMinutes, todayMidnightMs());
    const points = (data.bucket || []).flatMap(b => b.dataset?.[0]?.point || []);
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
