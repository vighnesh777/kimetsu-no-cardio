import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './FormProgression.module.css';

// Workouts required to unlock each form (cumulative)
// Form 1 is always unlocked; each subsequent form needs progressively more workouts
const FORM_THRESHOLDS = [0, 5, 12, 22, 35, 50, 68, 88, 110, 135, 162, 192, 225, 260, 298, 340];

// Roman numeral labels
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI'];

export function getFormLevel(totalWorkouts, formCount) {
  const maxForm  = Math.min(formCount, FORM_THRESHOLDS.length);
  let currentForm = 1;
  for (let i = 1; i < maxForm; i++) {
    if (totalWorkouts >= FORM_THRESHOLDS[i]) currentForm = i + 1;
    else break;
  }
  return currentForm;
}

export function getFormProgress(totalWorkouts, formCount) {
  const maxForm     = Math.min(formCount, FORM_THRESHOLDS.length);
  const currentForm = getFormLevel(totalWorkouts, formCount);

  if (currentForm >= maxForm) {
    return { currentForm, nextForm: null, progress: 100, needed: 0, current: totalWorkouts };
  }

  const currentThreshold = FORM_THRESHOLDS[currentForm - 1];
  const nextThreshold    = FORM_THRESHOLDS[currentForm];
  const progressInRange  = totalWorkouts - currentThreshold;
  const rangeSize        = nextThreshold - currentThreshold;
  const progress         = Math.min((progressInRange / rangeSize) * 100, 100);
  const needed           = nextThreshold - totalWorkouts;

  return { currentForm, nextForm: currentForm + 1, progress, needed, current: totalWorkouts };
}

export default function FormProgression({ totalWorkouts = 0 }) {
  const { theme } = useTheme();
  if (!theme) return null;

  const primary    = theme.colors.primary;
  const accent     = theme.colors.accent;
  const formCount  = theme.formCount;
  const { currentForm, nextForm, progress, needed } = getFormProgress(totalWorkouts, formCount);
  const isMastered = !nextForm;

  return (
    <motion.div
      className={styles.wrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className={styles.header}>
        <div className={styles.left}>
          <span className={styles.icon}>{theme.icon}</span>
          <div>
            <p className={styles.styleName}>{theme.name}</p>
            <p className={styles.formLabel} style={{ color: primary }}>
              {isMastered ? 'All Forms Mastered' : `Form ${ROMAN[currentForm - 1]}`}
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <span className={styles.formCount} style={{ color: accent }}>
            {currentForm} / {formCount}
          </span>
          <span className={styles.formCountLabel}>Forms</span>
        </div>
      </div>

      <div className={styles.barTrack}>
        <motion.div
          className={styles.barFill}
          style={{ background: primary }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.workoutCount}>
          {totalWorkouts} workout{totalWorkouts !== 1 ? 's' : ''} logged
        </span>
        {!isMastered && (
          <span className={styles.nextUnlock}>
            {needed} more to unlock Form {ROMAN[currentForm]}
          </span>
        )}
        {isMastered && (
          <span className={styles.mastered} style={{ color: accent }}>
            {theme.rank} — Fully Mastered
          </span>
        )}
      </div>

      {/* Form dots */}
      <div className={styles.dots}>
        {Array.from({ length: formCount }, (_, i) => (
          <div
            key={i}
            className={styles.dot}
            title={`Form ${ROMAN[i]}`}
            style={{
              background: i < currentForm ? primary : 'rgba(255,255,255,0.08)',
              boxShadow: i < currentForm ? `0 0 6px ${primary}` : 'none',
              opacity: i < currentForm ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
