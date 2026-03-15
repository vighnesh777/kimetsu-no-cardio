// Google Sheets API service — used as a workout log backend
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const SHEET_TITLE = 'Workouts';
const COLUMNS = ['Date', 'Breathing Style', 'Exercise', 'Sets', 'Reps', 'Duration (min)', 'Calories', 'Notes', 'Muscles'];

export async function getOrCreateSpreadsheet(token) {
  const saved = localStorage.getItem('ds_sheet_id');
  if (saved) return saved;

  const res = await fetch(`${SHEETS_BASE}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      properties: { title: 'Demon Slayer Fitness Tracker' },
      sheets: [{
        properties: { title: SHEET_TITLE },
      }],
    }),
  });
  if (!res.ok) throw new Error('Failed to create spreadsheet');
  const data = await res.json();
  const id = data.spreadsheetId;
  localStorage.setItem('ds_sheet_id', id);

  // Write header row
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

export async function logWorkout(token, workout) {
  const sheetId = await getOrCreateSpreadsheet(token);
  const row = [
    new Date().toLocaleDateString(),
    workout.breathingStyle,
    workout.exercise,
    workout.sets || '',
    workout.reps || '',
    workout.duration || '',
    workout.calories || '',
    workout.notes || '',
    Array.isArray(workout.muscles) ? workout.muscles.join(',') : '',
  ];
  return appendRows(token, sheetId, [row]);
}

export async function fetchWorkouts(token) {
  const sheetId = localStorage.getItem('ds_sheet_id');
  if (!sheetId) return [];

  const res = await fetch(
    `${SHEETS_BASE}/${sheetId}/values/${SHEET_TITLE}!A2:I`,
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
    // Parse muscles back from comma-separated string (col I)
    muscles: row[8] ? row[8].split(',').filter(Boolean) : [],
  })).reverse();
}

export function getSheetUrl() {
  const id = localStorage.getItem('ds_sheet_id');
  return id ? `https://docs.google.com/spreadsheets/d/${id}` : null;
}
