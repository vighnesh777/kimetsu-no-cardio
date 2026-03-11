import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '../../contexts/ThemeContext';
import DSIcon from '../DSIcon/DSIcon';
import styles from './StatsCard.module.css';

export default function StatsCard({
  iconName,
  label,
  value,
  unit,
  progress,
  goal,
  goalLabel,
  delay = 0,
  loading = false,
}) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className={styles.header}>
        <DSIcon name={iconName} size={17} color={primary} />
        <span className={styles.label}>{label}</span>
      </div>

      {loading ? (
        <div className={styles.skeleton} />
      ) : (
        <div className={styles.content}>
          {progress !== undefined ? (
            <div className={styles.progressWrap}>
              <CircularProgressbar
                value={progress}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: primary,
                  trailColor: 'rgba(255,255,255,0.08)',
                  strokeLinecap: 'round',
                })}
              />
              <div className={styles.progressCenter}>
                <span className={styles.value}>{value ?? '—'}</span>
                {unit && <span className={styles.unit}>{unit}</span>}
              </div>
            </div>
          ) : (
            <div className={styles.valueArea}>
              <span className={styles.valueLarge}>{value ?? '—'}</span>
              {unit && <span className={styles.unit}>{unit}</span>}
            </div>
          )}

          {goal && (
            <div className={styles.goal}>
              <span className={styles.goalLabel}>{goalLabel || 'Goal'}</span>
              <span className={styles.goalValue}>{goal}</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.shine} />
    </motion.div>
  );
}
