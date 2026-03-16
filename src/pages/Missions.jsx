import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useProgressionContext as useProgression } from '../contexts/ProgressionContext';
import DSIcon from '../components/DSIcon/DSIcon';
import crowImg from '../assets/image-removebg-preview.png';
import styles from './Missions.module.css';

// Maps mission type → DS-themed icon name
const TYPE_ICON_NAMES = {
  steps:    'steps',
  workout:  'swords',
  category: 'scroll',
  active:   'windSpiral',
  calories: 'flame',
};

function MissionCard({ mission, completed, onComplete, fitData }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';

  // Auto-progress display
  let current = 0;
  if (fitData) {
    if (mission.type === 'steps')    current = fitData.steps    || 0;
    if (mission.type === 'active')   current = fitData.activeMinutes || 0;
    if (mission.type === 'calories') current = fitData.calories  || 0;
  }
  const hasAutoProgress = ['steps','active','calories'].includes(mission.type);
  const autoProgress = hasAutoProgress ? Math.min((current / mission.target) * 100, 100) : 0;

  return (
    <motion.div
      className={`${styles.card} ${completed ? styles.done : ''}`}
      style={completed
        ? { borderColor: primary, background: `${primary}10` }
        : {}}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className={styles.cardTop}>
        <DSIcon
          name={TYPE_ICON_NAMES[mission.type] || 'swords'}
          size={26}
          color={completed ? primary : 'rgba(255,255,255,0.4)'}
          className={styles.missionIcon}
        />
        <div className={styles.missionInfo}>
          <p className={styles.missionTitle} style={completed ? { color: primary } : {}}>
            {mission.title}
          </p>
          <p className={styles.missionJp}>{mission.japanese}</p>
          <p className={styles.missionDesc}>{mission.description}</p>
        </div>
        <div className={styles.missionPoints} style={{ color: primary }}>
          +{mission.points}
          <span className={styles.ptLabel}>pts</span>
        </div>
      </div>

      {hasAutoProgress && !completed && (
        <div className={styles.progressRow}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${autoProgress}%`, background: primary }} />
          </div>
          <span className={styles.progressText} style={{ color: primary }}>
            {current.toLocaleString()} / {mission.target.toLocaleString()} {mission.unit}
          </span>
        </div>
      )}

      {completed ? (
        <div className={styles.completedBadge} style={{ color: primary }}>
          Mission Complete — 任務完了
        </div>
      ) : (
        !hasAutoProgress && (
          <motion.button
            className={styles.completeBtn}
            style={{ background: primary }}
            onClick={() => onComplete(mission.id, mission.points)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Mark Complete
          </motion.button>
        )
      )}
    </motion.div>
  );
}

export default function Missions() {
  const { theme } = useTheme();
  const {
    dailyMissions, completedToday, loading,
    completeMission, missionsCompleted, perfectMissionDays,
  } = useProgression();

  const primary = theme?.colors.primary || '#FF4500';
  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
  const completedCount = dailyMissions.filter(m => completedToday.has(m.id)).length;
  const allDone = completedCount === dailyMissions.length;

  return (
    <div className={styles.page}>
      {/* Crow header */}
      <motion.div className={styles.crowHeader} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Crow flying animation: sweeps in an arc, wings flap via scale */}
        <motion.div
          className={styles.crowIcon}
          style={{ filter: `drop-shadow(0 0 16px ${primary})` }}
          animate={{
            x:      [0, 12, 0, -12, 0],
            y:      [0, -14, -6, -14, 0],
            rotate: [-6, 0, 4, 0, -6],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Wing flap: subtle vertical scale alternation */}
          <motion.img
            src={crowImg}
            alt="Kasugai Crow"
            className={styles.crowImg}
            animate={{ scaleY: [1, 0.88, 1, 0.88, 1], scaleX: [1, 1.06, 1, 1.06, 1] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className={styles.crowText}>
          <h1 className={styles.title}>Crow Dispatch</h1>
          <p className={styles.subtitle}>鎹鴉からの任務 — Missions from your Kasugai Crow</p>
          <p className={styles.dateText}>{today}</p>
        </div>

        <div className={styles.completedSummary}>
          <span className={styles.completedNum} style={{ color: primary }}>{completedCount}</span>
          <span className={styles.completedOf}>/ {dailyMissions.length}</span>
          <span className={styles.completedLabel}>Today</span>
        </div>
      </motion.div>

      {/* All done banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            className={styles.allDoneBanner}
            style={{ borderColor: primary, background: `${primary}12` }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <span className={styles.allDoneIcon}>⚔</span>
            <div>
              <p className={styles.allDoneTitle} style={{ color: primary }}>All missions complete!</p>
              <p className={styles.allDoneSub}>Your crow will dispatch new missions tomorrow at dawn.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's missions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Today's Missions
          <span className={styles.sectionBadge} style={{ background: primary, color: '#000' }}>
            Daily
          </span>
        </h2>

        {loading ? (
          <div className={styles.skeletons}>
            {[0,1,2].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : (
          <div className={styles.missionList}>
            {dailyMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                completed={completedToday.has(mission.id)}
                onComplete={completeMission}
                fitData={null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Overall stats */}
      <motion.div
        className={styles.statsCard}
        style={{ borderColor: primary }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className={styles.statsTitle}>Mission Record</h3>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: primary }}>{missionsCompleted}</span>
            <span className={styles.statLabel}>Total Completed</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: primary }}>{perfectMissionDays}</span>
            <span className={styles.statLabel}>Perfect Days</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum} style={{ color: primary }}>
              {(missionsCompleted * 30).toLocaleString()}
            </span>
            <span className={styles.statLabel}>Points Earned</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
