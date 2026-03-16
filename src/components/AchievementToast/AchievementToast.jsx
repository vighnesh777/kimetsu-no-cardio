import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ACHIEVEMENTS, RARITY_COLORS } from '../../data/achievements';
import styles from './AchievementToast.module.css';

export default function AchievementToast({ newAchievements = [] }) {
  const { theme } = useTheme();

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {newAchievements.map(id => {
          const a = ACHIEVEMENTS.find(x => x.id === id);
          if (!a) return null;
          const rarity = RARITY_COLORS[a.rarity];
          return (
            <motion.div
              key={id}
              className={styles.toast}
              style={{ borderColor: rarity.color, boxShadow: `0 0 24px ${rarity.glow}` }}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className={styles.toastInner}>
                <div className={styles.toastLeft}>
                  <span className={styles.toastIcon} style={{ color: rarity.color }}>⚔</span>
                </div>
                <div className={styles.toastText}>
                  <p className={styles.toastLabel} style={{ color: rarity.color }}>
                    Achievement Unlocked
                  </p>
                  <p className={styles.toastName}>{a.name}</p>
                  <p className={styles.toastJp}>{a.japanese}</p>
                </div>
                <span className={styles.toastRarity} style={{ color: rarity.color }}>
                  {rarity.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
