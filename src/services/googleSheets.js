// Google Sheets API service — used as a workout log backend
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE_BASE  = 'https://www.googleapis.com/drive/v3';
const SHEET_NAME  = 'Demon Slayer Fitness Tracker';

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const SHEET_TITLE = 'Workouts';
const COLUMNS = ['Date', 'Breathing Style', 'Exercise', 'Sets', 'Reps', 'Duration (min)', 'Calories', 'Notes', 'Muscles', 'Hevy ID'];

// Search the user's Drive for an existing spreadsheet by exact name.
// Uses drive.metadata.readonly — no file content is accessed.
async function findSheetInDrive(token) {
  const q = encodeURIComponent(
    `name='${SHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
  );
  const res = await fetch(`${DRIVE_BASE}/files?q=${q}&fields=files(id)&pageSize=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id || null;
}

export async function getOrCreateSpreadsheet(token) {
  // 1. Check localStorage cache first (fastest path)
  const cached = localStorage.getItem('ds_sheet_id');
  if (cached) return cached;

  // 2. Search Drive for an existing sheet (handles cleared cache / new device)
  const existing = await findSheetInDrive(token);
  if (existing) {
    localStorage.setItem('ds_sheet_id', existing);
    return existing;
  }

  // 3. Nothing found — create a fresh spreadsheet
  const res = await fetch(`${SHEETS_BASE}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      properties: { title: SHEET_NAME },
      sheets: [{ properties: { title: SHEET_TITLE } }],
    }),
  });
  if (!res.ok) throw new Error('Failed to create spreadsheet');
  const data = await res.json();
  const id = data.spreadsheetId;
  localStorage.setItem('ds_sheet_id', id);

  // Write header row into the new sheet
  await appendRows(token, id, [COLUMNS]);
  return id;
}

export async function appendRows(token, spreadsheetId, rows) {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${SHEET_TITLE}!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ values: rows }),
    }
  );
  if (!res.ok) throw new Error('Failed to append to sheet');
  return res.json();
}

function workoutToRow(workout) {
  return [
    workout.date || new Date().toLocaleDateString(),
    workout.breathingStyle || '',
    workout.exercise || '',
    workout.sets || '',
    workout.reps || '',
    workout.duration || '',
    workout.calories || '',
    workout.notes || '',
    Array.isArray(workout.muscles) ? workout.muscles.join(',') : '',
    workout.hevyId || '',   // col J — used to deduplicate on re-sync
  ];
}

export async function logWorkout(token, workout) {
  const sheetId = await getOrCreateSpreadsheet(token);
  return appendRows(token, sheetId, [workoutToRow(workout)]);
}

// Batch-append many workouts in a single API call — used for Hevy history sync
export async function logWorkoutsBatch(token, workouts) {
  if (!workouts.length) return;
  const sheetId = await getOrCreateSpreadsheet(token);
  return appendRows(token, sheetId, workouts.map(workoutToRow));
}

export async function fetchWorkouts(token) {
  // Always resolve via getOrCreateSpreadsheet so Drive is searched
  // when localStorage cache is missing (cleared storage, new device, etc.)
  const sheetId = await getOrCreateSpreadsheet(token).catch(() => null);
  if (!sheetId) return [];

  const res = await fetch(
    `${SHEETS_BASE}/${sheetId}/values/${SHEET_TITLE}!A2:J`,
    { headers: headers(token) }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const rows = data.values || [];

  return rows.map(row => ({
    date: row[0] || '',
    breathingStyle: row[1] || '',
    exercise: row[2] || '',
    sets: row[3] || '',
    reps: row[4] || '',
    duration: row[5] || '',
    calories: row[6] || '',
    notes: row[7] || '',
    muscles: row[8] ? row[8].split(',').filter(Boolean) : [],
    hevyId: row[9] || '',   // col J — empty for manually-logged workouts
  })).reverse();
}

export function getSheetUrl() {
  const id = localStorage.getItem('ds_sheet_id');
  return id ? `https://docs.google.com/spreadsheets/d/${id}` : null;
}

// ── Generic sheet helpers ────────────────────────────────────────────────────

async function readSheet(token, spreadsheetId, sheetTitle, range) {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${sheetTitle}!${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.values || [];
}

async function appendToSheet(token, spreadsheetId, sheetTitle, rows) {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${sheetTitle}!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ values: rows }),
    }
  );
  if (!res.ok) throw new Error(`Failed to append to ${sheetTitle}`);
  return res.json();
}

async function updateCell(token, spreadsheetId, sheetTitle, range, value) {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${sheetTitle}!${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify({ values: [[value]] }),
    }
  );
  if (!res.ok) throw new Error(`Failed to update ${sheetTitle}!${range}`);
  return res.json();
}

// Ensure a named sheet tab exists in the spreadsheet; create it if missing
async function ensureSheet(token, spreadsheetId, title, headerRow) {
  // Try reading it — if it works, it exists
  const rows = await readSheet(token, spreadsheetId, title, 'A1:A1');
  if (rows.length > 0) return; // already exists

  // Add the sheet tab
  await fetch(`${SHEETS_BASE}/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      requests: [{ addSheet: { properties: { title } } }],
    }),
  });

  // Write header row
  await appendToSheet(token, spreadsheetId, title, [headerRow]);
}

// ── Progress sheet ───────────────────────────────────────────────────────────
// Structure: two columns  Key | Value
// Rows: rank_points, streak_count, streak_last_date, missions_completed,
//        perfect_mission_days, has_returned, max_daily_steps, max_session_duration,
//        max_weekly_workouts, unique_exercises (comma-sep)

const PROGRESS_SHEET  = 'Progress';
const PROGRESS_KEYS = [
  'rank_points', 'streak_count', 'streak_last_date',
  'missions_completed', 'perfect_mission_days', 'has_returned',
  'max_daily_steps', 'max_session_duration', 'max_weekly_workouts',
  'unique_exercises',
];

async function initProgressSheet(token, sheetId) {
  await ensureSheet(token, sheetId, PROGRESS_SHEET, ['Key', 'Value']);
  // Check if any rows exist beyond the header
  const rows = await readSheet(token, sheetId, PROGRESS_SHEET, 'A2:B');
  if (rows.length > 0) return;
  // Write default values
  const defaults = [
    ['rank_points', '0'],
    ['streak_count', '0'],
    ['streak_last_date', ''],
    ['missions_completed', '0'],
    ['perfect_mission_days', '0'],
    ['has_returned', 'false'],
    ['max_daily_steps', '0'],
    ['max_session_duration', '0'],
    ['max_weekly_workouts', '0'],
    ['unique_exercises', ''],
  ];
  await appendToSheet(token, sheetId, PROGRESS_SHEET, defaults);
}

export async function fetchProgress(token) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await initProgressSheet(token, sheetId);
  const rows = await readSheet(token, sheetId, PROGRESS_SHEET, 'A2:B');
  const map = {};
  rows.forEach(([k, v]) => { if (k) map[k] = v || ''; });
  return {
    rankPoints:         parseInt(map.rank_points        || '0', 10),
    streakCount:        parseInt(map.streak_count       || '0', 10),
    streakLastDate:     map.streak_last_date || '',
    missionsCompleted:  parseInt(map.missions_completed  || '0', 10),
    perfectMissionDays: parseInt(map.perfect_mission_days|| '0', 10),
    hasReturned:        map.has_returned === 'true',
    maxDailySteps:      parseInt(map.max_daily_steps     || '0', 10),
    maxSessionDuration: parseInt(map.max_session_duration|| '0', 10),
    maxWeeklyWorkouts:  parseInt(map.max_weekly_workouts || '0', 10),
    uniqueExercises:    map.unique_exercises ? map.unique_exercises.split(',').filter(Boolean) : [],
  };
}

export async function saveProgressField(token, key, value) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await initProgressSheet(token, sheetId);
  // Find the row index of the key
  const rows = await readSheet(token, sheetId, PROGRESS_SHEET, 'A2:A');
  const rowIdx = rows.findIndex(r => r[0] === key);
  if (rowIdx === -1) return; // key not found — shouldn't happen after init
  const sheetRow = rowIdx + 2; // +1 for header, +1 for 1-indexed
  await updateCell(token, sheetId, PROGRESS_SHEET, `B${sheetRow}`, String(value));
}

// ── Achievements sheet ───────────────────────────────────────────────────────
// Structure: Achievement ID | Unlocked At (ISO date string)

const ACHIEVEMENTS_SHEET = 'Achievements';

export async function fetchAchievements(token) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await ensureSheet(token, sheetId, ACHIEVEMENTS_SHEET, ['Achievement ID', 'Unlocked At']);
  const rows = await readSheet(token, sheetId, ACHIEVEMENTS_SHEET, 'A2:B');
  return rows.map(r => ({ id: r[0] || '', unlockedAt: r[1] || '' })).filter(a => a.id);
}

export async function saveAchievement(token, achievementId) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await ensureSheet(token, sheetId, ACHIEVEMENTS_SHEET, ['Achievement ID', 'Unlocked At']);
  await appendToSheet(token, sheetId, ACHIEVEMENTS_SHEET, [
    [achievementId, new Date().toISOString()],
  ]);
}

// ── Missions sheet ───────────────────────────────────────────────────────────
// Structure: Date (YYYY-MM-DD) | Mission ID | Completed At

const MISSIONS_SHEET = 'Missions';

export async function fetchMissionCompletions(token) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await ensureSheet(token, sheetId, MISSIONS_SHEET, ['Date', 'Mission ID', 'Completed At']);
  const rows = await readSheet(token, sheetId, MISSIONS_SHEET, 'A2:C');
  return rows.map(r => ({ date: r[0] || '', missionId: r[1] || '', completedAt: r[2] || '' })).filter(r => r.missionId);
}

export async function saveMissionCompletion(token, dateStr, missionId) {
  const sheetId = await getOrCreateSpreadsheet(token);
  await ensureSheet(token, sheetId, MISSIONS_SHEET, ['Date', 'Mission ID', 'Completed At']);
  await appendToSheet(token, sheetId, MISSIONS_SHEET, [
    [dateStr, missionId, new Date().toISOString()],
  ]);
}
