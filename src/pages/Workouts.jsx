import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { logWorkout, fetchWorkouts, getSheetUrl } from '../services/googleSheets';
import DSIcon from '../components/DSIcon/DSIcon';
import styles from './Workouts.module.css';

const EXERCISE_PRESETS = [
  { name: 'Running',    icon: 'distance',     type: 'cardio'    },
  { name: 'Push-ups',   icon: 'weight',       type: 'strength'  },
  { name: 'Pull-ups',   icon: 'weight',       type: 'strength'  },
  { name: 'Squats',     icon: 'activeMinutes',type: 'strength'  },
  { name: 'Plank',      icon: 'target',       type: 'core'      },
  { name: 'Cycling',    icon: 'distance',     type: 'cardio'    },
  { name: 'Swimming',   icon: 'water',        type: 'cardio'    },
  { name: 'HIIT',       icon: 'thunder',      type: 'cardio'    },
  { name: 'Deadlift',   icon: 'weight',       type: 'strength'  },
  { name: 'Meditation', icon: 'style',        type: 'recovery'  },
];

function WorkoutForm({ onSave, theme, submitting }) {
  const [form, setForm] = useState({
    exercise: '',
    sets: '',
    reps: '',
    duration: '',
    calories: '',
    notes: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const primary = theme?.colors.primary || '#FF4500';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.exercise) return;
    onSave(form);
    setForm({ exercise: '', sets: '', reps: '', duration: '', calories: '', notes: '' });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.presets}>
        {EXERCISE_PRESETS.map(p => (
          <button
            key={p.name}
            type="button"
            className={`${styles.preset} ${form.exercise === p.name ? styles.presetActive : ''}`}
            onClick={() => set('exercise', p.name)}
          >
            <DSIcon name={p.icon} size={14} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Exercise</label>
          <input
            value={form.exercise}
            onChange={e => set('exercise', e.target.value)}
            placeholder="Exercise name"
            required
          />
        </div>
        <div className={styles.field}>
          <label>Duration (min)</label>
          <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="30" min="0" />
        </div>
        <div className={styles.field}>
          <label>Sets</label>
          <input type="number" value={form.sets} onChange={e => set('sets', e.target.value)} placeholder="3" min="0" />
        </div>
        <div className={styles.field}>
          <label>Reps</label>
          <input type="number" value={form.reps} onChange={e => set('reps', e.target.value)} placeholder="12" min="0" />
        </div>
        <div className={styles.field}>
          <label>Calories</label>
          <input type="number" value={form.calories} onChange={e => set('calories', e.target.value)} placeholder="200" min="0" />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label>Notes</label>
          <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="How was the training?" />
        </div>
      </div>

      <motion.button
        type="submit"
        className={styles.submitBtn}
        disabled={submitting || !form.exercise}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <DSIcon name="katana" size={16} />{submitting ? ' Logging...' : ' Log Training'}
      </motion.button>
    </form>
  );
}

function WorkoutRow({ workout, primary }) {
  return (
    <motion.div
      className={styles.row}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.rowDate}>{workout.date}</div>
      <div className={styles.rowExercise} style={{ color: primary }}>{workout.exercise}</div>
      <div className={styles.rowMeta}>
        {workout.sets && workout.reps && <span>{workout.sets}×{workout.reps}</span>}
        {workout.duration && <span>{workout.duration}min</span>}
        {workout.calories && <span>{workout.calories}kcal</span>}
      </div>
      {workout.notes && <div className={styles.rowNotes}>{workout.notes}</div>}
      <div className={styles.rowStyle}>{workout.breathingStyle}</div>
    </motion.div>
  );
}

export default function Workouts() {
  const { theme, styleId } = useTheme();
  const { accessToken } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const primary = theme?.colors.primary || '#FF4500';
  const sheetUrl = getSheetUrl();

  useEffect(() => {
    if (!accessToken) return;
    setLoadingHistory(true);
    fetchWorkouts(accessToken)
      .then(setWorkouts)
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [accessToken]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (form) => {
    const entry = { ...form, breathingStyle: theme?.name || styleId || 'Unknown' };

    // Optimistic local save
    setWorkouts(prev => [{
      ...entry,
      date: new Date().toLocaleDateString(),
    }, ...prev]);

    if (!accessToken) {
      showToast('Workout logged locally (connect Google to sync)');
      return;
    }

    setSubmitting(true);
    try {
      await logWorkout(accessToken, entry);
      showToast('Training logged to Google Sheets!');
    } catch (err) {
      showToast('Failed to sync to Sheets', false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className={styles.title}>
            <span style={{ color: primary }}>Training</span> Log
          </h1>
          <p className={styles.subtitle}>
            {theme?.name} — {theme?.japanese}
          </p>
        </div>
        {sheetUrl && (
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className={styles.sheetLink}>
            <DSIcon name="sheets" size={14} /> Open Sheets
          </a>
        )}
      </motion.div>

      <motion.div
        className={styles.formCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={styles.sectionTitle}>Log New Training</h2>
        <WorkoutForm onSave={handleSave} theme={theme} submitting={submitting} />
      </motion.div>

      <motion.div
        className={styles.historyCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>
          Training History
          {workouts.length > 0 && <span className={styles.count}>{workouts.length}</span>}
        </h2>

        {loadingHistory && <p className={styles.loading}>Loading history...</p>}

        {!loadingHistory && workouts.length === 0 && (
          <p className={styles.empty}>
            No training logged yet. Begin your journey, Demon Slayer.
          </p>
        )}

        <div className={styles.historyList}>
          {workouts.map((w, i) => (
            <WorkoutRow key={i} workout={w} primary={primary} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${toast.ok ? styles.toastOk : styles.toastErr}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
