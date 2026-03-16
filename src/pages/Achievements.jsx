import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useProgressionContext as useProgression } from '../contexts/ProgressionContext';
import { ACHIEVEMENTS, RARITY_COLORS, ACHIEVEMENT_CATEGORIES } from '../data/achievements';
import styles from './Achievements.module.css';

function AchievementScroll({ achievement, unlocked, unlockedAt }) {
  const { theme } = useTheme();
  const rarity = RARITY_COLORS[achievement.rarity];
  const [showDesc, setShowDesc] = useState(false);

  return (
    <motion.div
      className={`${styles.scroll} ${unlocked ? styles.unlocked : styles.sealed}`}
      style={unlocked ? { borderColor: rarity.color, boxShadow: `0 0 16px ${rarity.glow}` } : {}}
      onClick={() => setShowDesc(v => !v)}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Scroll top roll */}
      <div className={styles.scrollRoll} style={{ background: unlocked ? rarity.color : undefined }} />

      {!showDesc ? (
        <div className={styles.scrollFront}>
          {/* Lock seal for locked achievements */}
          {!unlocked && (
            <div className={styles.lockSeal}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
              </svg>
            </div>
          )}

          <div className={styles.scrollIcon} style={{ color: unlocked ? rarity.color : 'rgba(255,255,255,0.15)' }}>
            ⚔
          </div>

          {/* Name always visible — dimmed if locked */}
          <p className={styles.scrollName} style={{ color: unlocked ? rarity.color : 'rgba(255,255,255,0.35)' }}>
            {achievement.name}
          </p>
          <p className={styles.scrollJp} style={{ opacity: unlocked ? 1 : 0.3 }}>
            {achievement.japanese}
          </p>

          <span
            className={styles.rarityTag}
            style={unlocked
              ? { color: rarity.color, borderColor: rarity.color }
              : { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            {rarity.label}
          </span>

          {unlocked && unlockedAt && (
            <p className={styles.unlockedDate}>
              {new Date(unlockedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {!unlocked && (
            <p className={styles.tapHint}>Tap to see how to unlock</p>
          )}
        </div>
      ) : (
        <motion.div
          className={styles.scrollBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className={styles.backName} style={{ color: unlocked ? rarity.color : 'rgba(255,255,255,0.4)' }}>
            {achievement.name}
          </p>
          <p className={styles.backDesc}>{achievement.description}</p>
          <span className={styles.backCategory}>{achievement.category}</span>
          {!unlocked && <p className={styles.backLocked}>Not yet unlocked</p>}
        </motion.div>
      )}

      {/* Scroll bottom roll */}
      <div className={styles.scrollRoll} style={{ background: unlocked ? rarity.color : undefined }} />
    </motion.div>
  );
}

export default function Achievements() {
  const { theme } = useTheme();
  const { unlockedAchievements, loading } = useProgression();
  const [category, setCategory] = useState('All');
  const primary = theme?.colors.primary || '#FF4500';

  // Only count IDs that map to a real achievement — filters out stale/invalid Sheets rows
  const validIds      = new Set(ACHIEVEMENTS.map(a => a.id));
  const unlockedSet   = new Set(unlockedAchievements.filter(id => validIds.has(id)));
  const filtered      = ACHIEVEMENTS.filter(a =>
    category === 'All' || a.category === category
  );

  const totalUnlocked = unlockedSet.size;   // unique valid unlocked IDs
  const totalAll      = ACHIEVEMENTS.length;

  // Sort: unlocked first, then by rarity
  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  const sorted = [...filtered].sort((a, b) => {
    const aU = unlockedSet.has(a.id) ? 0 : 1;
    const bU = unlockedSet.has(b.id) ? 0 : 1;
    if (aU !== bU) return aU - bU;
    return (rarityOrder[a.rarity] ?? 4) - (rarityOrder[b.rarity] ?? 4);
  });

  return (
    <div className={styles.page}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className={styles.title}>
            <span style={{ color: primary }}>Mission</span> Scrolls
          </h1>
          <p className={styles.subtitle}>任務の巻物 — Achievements of the Demon Slayer Corps</p>
        </div>
        <div className={styles.summary}>
          <div className={styles.summaryLine}>
            <span className={styles.summaryCount} style={{ color: primary }}>{totalUnlocked}</span>
            <span className={styles.summaryTotal}> unlocked</span>
          </div>
          <div className={styles.summaryLine}>
            <span className={styles.summaryLocked}>{totalAll - totalUnlocked}</span>
            <span className={styles.summaryTotal}> remaining</span>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className={styles.overallProgress}>
        <div className={styles.overallBar}>
          <motion.div
            className={styles.overallFill}
            style={{ background: primary }}
            initial={{ width: 0 }}
            animate={{ width: `${(totalUnlocked / totalAll) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className={styles.overallPct} style={{ color: primary }}>
          {Math.round((totalUnlocked / totalAll) * 100)}% of scrolls unsealed
        </span>
      </div>

      {/* Category filter */}
      <div className={styles.filters}>
        {ACHIEVEMENT_CATEGORIES.map(c => (
          <button
            key={c}
            className={`${styles.filter} ${category === c ? styles.filterActive : ''}`}
            style={category === c ? { background: primary, borderColor: primary, color: '#000' } : {}}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <motion.div className={styles.grid} layout>
          <AnimatePresence mode="popLayout">
            {sorted.map(a => (
              <AchievementScroll
                key={a.id}
                achievement={a}
                unlocked={unlockedSet.has(a.id)}
                unlockedAt={null}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filtered.length === 0 && (
        <p className={styles.empty}>No achievements in this category yet.</p>
      )}
    </div>
  );
}
