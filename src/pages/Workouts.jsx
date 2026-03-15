import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { logWorkout, fetchWorkouts, getSheetUrl } from '../services/googleSheets';
import { getHevyKey, fetchHevyWorkouts, hevyToEntry, markAsSynced } from '../services/hevy';
import { EXERCISES, CATEGORIES, MUSCLE_GROUPS, getMusclesFromWorkouts } from '../data/exercises';
import MuscleSkeleton from '../components/MuscleSkeleton/MuscleSkeleton';
import HevyConnect from '../components/HevyConnect/HevyConnect';
import DSIcon from '../components/DSIcon/DSIcon';
import styles from './Workouts.module.css';

// ── Custom Exercise Builder ────────────────────────────────────
function CustomExerciseBuilder({ initialName, onConfirm, onCancel }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';
  const [name, setName] = useState(initialName || '');
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  const toggleMuscle = (id) =>
    setSelectedMuscles(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm({ name: name.trim(), category: 'Custom', muscles: selectedMuscles, defaults: {} });
  };

  return (
    <motion.div
      className={styles.customBuilder}
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <p className={styles.customTitle}>Custom Exercise</p>

      <input
        className={styles.customNameInput}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Exercise name..."
        autoFocus
      />

      <p className={styles.customMuscleLabel}>Select targeted muscles:</p>
      <div className={styles.muscleGrid}>
        {Object.entries(MUSCLE_GROUPS).map(([id, info]) => (
          <button
            key={id}
            type="button"
            className={`${styles.muscleToggle} ${selectedMuscles.includes(id) ? styles.muscleToggleOn : ''}`}
            style={selectedMuscles.includes(id) ? { borderColor: primary, color: primary, background: `${primary}18` } : {}}
            onClick={() => toggleMuscle(id)}
          >
            {info.label}
          </button>
        ))}
      </div>

      <div className={styles.customActions}>
        <button type="button" className={styles.customCancel} onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className={styles.customConfirm}
          style={{ background: primary, color: '#000' }}
          onClick={handleConfirm}
          disabled={!name.trim()}
        >
          Use This Exercise
        </button>
      </div>
    </motion.div>
  );
}

// ── Searchable Exercise Picker ─────────────────────────────────
function ExercisePicker({ selected, onSelect }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setShowCustom(false); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = EXERCISES.filter(ex =>
    (category === 'All' || ex.category === category) &&
    ex.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (ex) => { onSelect(ex); setOpen(false); setShowCustom(false); setQuery(''); };
  const handleClear = () => { onSelect(null); setQuery(''); setShowCustom(false); };

  const handleCustomConfirm = (ex) => {
    onSelect(ex);
    setOpen(false);
    setShowCustom(false);
    setQuery('');
  };

  return (
    <div className={styles.picker} ref={ref}>
      <label className={styles.fieldLabel}>Exercise</label>
      {selected ? (
        <div className={styles.selectedEx}>
          <span className={styles.selectedName}>{selected.name}</span>
          <span className={styles.selectedCat}>{selected.category}</span>
          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            <DSIcon name="close" size={12} />
          </button>
        </div>
      ) : (
        <div className={styles.searchWrap}>
          <input
            className={styles.searchInput}
            placeholder="Search exercises..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); setShowCustom(false); }}
            onFocus={() => setOpen(true)}
          />
        </div>
      )}

      <AnimatePresence>
        {open && !selected && !showCustom && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.catPills}>
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  className={`${styles.catPill} ${category === c ? styles.catPillActive : ''}`}
                  onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
            <div className={styles.dropList}>
              {filtered.map(ex => (
                <button key={ex.name} type="button" className={styles.dropItem} onClick={() => handleSelect(ex)}>
                  <div>
                    <span className={styles.dropName}>{ex.name}</span>
                    <span className={styles.dropMuscles}>{ex.muscles.slice(0,3).map(m => m.replace('-',' ')).join(', ')}</span>
                  </div>
                  <span className={styles.dropCat}>{ex.category}</span>
                </button>
              ))}
            </div>
            {/* Custom exercise entry point — always visible at bottom */}
            <button
              type="button"
              className={styles.addCustomBtn}
              onClick={() => { setOpen(false); setShowCustom(true); }}
            >
              <DSIcon name="nichirin" size={13} />
              {query.trim() ? `Add "${query.trim()}" as custom` : 'Add custom exercise'}
            </button>
          </motion.div>
        )}

        {showCustom && !selected && (
          <CustomExerciseBuilder
            key="custom"
            initialName={query.trim()}
            onConfirm={handleCustomConfirm}
            onCancel={() => { setShowCustom(false); setOpen(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkoutForm({ onSave, theme, submitting }) {
  const [exercise, setExercise] = useState(null);
  const [form, setForm] = useState({ sets:'', reps:'', duration:'', calories:'', notes:'' });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const primary = theme?.colors.primary || '#FF4500';

  const handleExerciseSelect = (ex) => {
    setExercise(ex);
    if (ex?.defaults) setForm(f => ({ ...f, sets: ex.defaults.sets||'', reps: ex.defaults.reps||'', duration: ex.defaults.duration||'' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exercise) return;
    onSave({ exercise: exercise.name, muscles: exercise.muscles, ...form });
    setExercise(null);
    setForm({ sets:'', reps:'', duration:'', calories:'', notes:'' });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <ExercisePicker selected={exercise} onSelect={handleExerciseSelect} />

      {exercise && (
        <motion.div className={styles.muscleChips} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}>
          <span className={styles.muscleChipsLabel}>Targets:</span>
          {exercise.muscles.map(m => (
            <span key={m} className={styles.chip} style={{ borderColor: primary, color: primary }}>
              {m.replace('_',' ')}
            </span>
          ))}
        </motion.div>
      )}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Sets</label>
          <input type="number" value={form.sets} onChange={e=>setF('sets',e.target.value)} placeholder="3" min="0" />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Reps</label>
          <input type="number" value={form.reps} onChange={e=>setF('reps',e.target.value)} placeholder="12" min="0" />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Duration (min)</label>
          <input type="number" value={form.duration} onChange={e=>setF('duration',e.target.value)} placeholder="30" min="0" />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Calories</label>
          <input type="number" value={form.calories} onChange={e=>setF('calories',e.target.value)} placeholder="200" min="0" />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.fieldLabel}>Notes</label>
          <input value={form.notes} onChange={e=>setF('notes',e.target.value)} placeholder="How was the session?" />
        </div>
      </div>

      <motion.button type="submit" className={styles.submitBtn}
        disabled={submitting || !exercise} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
        <DSIcon name="nichirin" size={18} />
        {submitting ? ' Logging...' : ' Log Training'}
      </motion.button>
    </form>
  );
}

function WorkoutRow({ workout, primary }) {
  return (
    <motion.div className={styles.row} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
      <div className={styles.rowDate}>{workout.date}</div>
      <div className={styles.rowExercise} style={{ color: primary }}>{workout.exercise}</div>
      <div className={styles.rowMeta}>
        {workout.sets && workout.reps && <span>{workout.sets}x{workout.reps}</span>}
        {workout.duration && <span>{workout.duration}min</span>}
        {workout.calories && <span>{workout.calories}kcal</span>}
      </div>
      {workout.notes && <div className={styles.rowNotes}>{workout.notes}</div>}
    </motion.div>
  );
}

export default function Workouts() {
  const { theme, styleId } = useTheme();
  const { accessToken } = useAuth();
  const [workouts,      setWorkouts]      = useState([]);
  const [submitting,    setSubmitting]    = useState(false);
  const [toast,         setToast]         = useState(null);
  const [loadingHistory,setLoadingHistory]= useState(false);
  const [hevySyncing,   setHevySyncing]   = useState(false);

  const primary    = theme?.colors.primary || '#FF4500';
  const sheetUrl   = getSheetUrl();
  const todayStr   = new Date().toLocaleDateString();
  const todayMuscles   = getMusclesFromWorkouts(workouts.filter(w => w.date === todayStr));
  const allTimeMuscles = getMusclesFromWorkouts(workouts);

  useEffect(() => {
    if (!accessToken) return;
    setLoadingHistory(true);
    fetchWorkouts(accessToken)
      .then(rows => { setWorkouts(rows); return rows; })
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [accessToken]);

  const showToast = (msg, ok=true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  // ── Hevy sync ────────────────────────────────────────────────
  const syncHevy = async () => {
    const hevyKey = getHevyKey();
    if (!hevyKey) return;
    setHevySyncing(true);
    try {
      const newWorkouts = await fetchHevyWorkouts(hevyKey);
      if (!newWorkouts.length) { showToast('Hevy is up to date.'); return; }

      const entries = newWorkouts.map(w => hevyToEntry(w, theme?.name || ''));
      // Add to local state immediately
      setWorkouts(prev => [...entries, ...prev]);

      // Sync to Google Sheets if connected
      if (accessToken) {
        for (const entry of entries) {
          await logWorkout(accessToken, entry);
        }
      }

      markAsSynced(newWorkouts.map(w => w.id));
      showToast(`Synced ${newWorkouts.length} new Hevy workout${newWorkouts.length > 1 ? 's' : ''}!`);
    } catch (err) {
      showToast(`Hevy sync failed: ${err.message}`, false);
    } finally {
      setHevySyncing(false);
    }
  };

  const handleSave = async (formData) => {
    const entry = { ...formData, breathingStyle: theme?.name || styleId || 'Unknown' };
    setWorkouts(prev => [{ ...entry, date: todayStr }, ...prev]);
    if (!accessToken) { showToast('Workout logged locally (connect Google to sync)'); return; }
    setSubmitting(true);
    try { await logWorkout(accessToken, entry); showToast('Training logged to Google Sheets!'); }
    catch { showToast('Failed to sync to Sheets', false); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.header} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div>
          <h1 className={styles.title}><span style={{ color: primary }}>Training</span> Log</h1>
          <p className={styles.subtitle}>{theme?.name} — {theme?.japanese}</p>
        </div>
        {sheetUrl && (
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className={styles.sheetLink}>
            <DSIcon name="sheets" size={14} /> Open Sheets
          </a>
        )}
      </motion.div>

      {/* Hevy integration card */}
      <motion.div className={styles.hevyCard} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
        <HevyConnect onSynced={syncHevy} />
        {hevySyncing && (
          <p className={styles.hevySyncing} style={{ color: primary }}>
            Syncing Hevy workouts…
          </p>
        )}
      </motion.div>

      <div className={styles.skeletonRow}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} style={{ flex:1, minWidth:0 }}>
          <MuscleSkeleton muscleCounts={todayMuscles} title="Today's Muscles" />
        </motion.div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }} style={{ flex:1, minWidth:0 }}>
          <MuscleSkeleton muscleCounts={allTimeMuscles} title="All-Time Activity" />
        </motion.div>
      </div>

      <motion.div className={styles.formCard} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <h2 className={styles.sectionTitle}>Log New Training</h2>
        <WorkoutForm onSave={handleSave} theme={theme} submitting={submitting} />
      </motion.div>

      <motion.div className={styles.historyCard} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h2 className={styles.sectionTitle}>
          Training History
          {workouts.length > 0 && <span className={styles.count}>{workouts.length}</span>}
        </h2>
        {loadingHistory && <p className={styles.loading}>Loading history...</p>}
        {!loadingHistory && workouts.length === 0 && <p className={styles.empty}>No training logged yet. Begin your journey, Demon Slayer.</p>}
        <div className={styles.historyList}>
          {workouts.map((w, i) => (
            <WorkoutRow key={w.hevyId || i} workout={w} primary={primary} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div className={`${styles.toast} ${toast.ok ? styles.toastOk : styles.toastErr}`}
            initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:50 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
