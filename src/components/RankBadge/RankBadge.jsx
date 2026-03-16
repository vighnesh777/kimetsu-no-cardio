import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './RankBadge.module.css';

export default function RankBadge({ rank, rankProgress, streakCount, compact = false }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';

  if (!rank) return null;

  const isHashira = rank.id === 'hashira';
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference * (1 - (rankProgress?.percent ?? 0) / 100);

  return (
    <motion.div
      className={`${styles.badge} ${compact ? styles.compact : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Corps seal ring */}
      <div className={styles.sealWrap}>
        <svg className={styles.ring} viewBox="0 0 88 88">
          {/* Background track */}
          <circle cx="44" cy="44" r="38" fill="none"
            stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          {/* Progress arc */}
          {!isHashira && (
            <circle cx="44" cy="44" r="38" fill="none"
              stroke={primary} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.8s ease' }}
            />
          )}
          {isHashira && (
            <circle cx="44" cy="44" r="38" fill="none"
              stroke={primary} strokeWidth="4"
              opacity="0.8"
            />
          )}
          {/* Outer decorative dots */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 44 + 44 * Math.cos(rad);
            const y = 44 + 44 * Math.sin(rad);
            return <circle key={i} cx={x} cy={y} r="2.5" fill={primary} opacity="0.6" />;
          })}
        </svg>

        {/* Center — rank kanji */}
        <div className={styles.sealCenter}>
          <span className={styles.kanji} style={{ color: primary }}>
            {rank.kanji}
          </span>
          {isHashira && (
            <motion.div
              className={styles.hashiraGlow}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: primary }}
            />
          )}
        </div>
      </div>

      {!compact && (
        <div className={styles.info}>
          <span className={styles.english}>{rank.english}</span>
          <span className={styles.japanese}>{rank.japanese}</span>
          <span className={styles.title}>{rank.title}</span>

          {!isHashira && rankProgress && (
            <div className={styles.progressRow}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${rankProgress.percent}%`, background: primary }}
                />
              </div>
              <span className={styles.progressText} style={{ color: primary }}>
                {rankProgress.pointsIntoRank} / {rankProgress.pointsNeeded}
              </span>
            </div>
          )}

          {isHashira && (
            <p className={styles.hashiraTitle} style={{ color: primary }}>
              Pillar of the Demon Slayer Corps
            </p>
          )}
        </div>
      )}

      {streakCount > 0 && !compact && (
        <div className={styles.streak}>
          <span className={styles.streakFlame} style={{ color: primary }}>
            ▲
          </span>
          <span className={styles.streakCount} style={{ color: primary }}>
            {streakCount}
          </span>
          <span className={styles.streakLabel}>day streak</span>
        </div>
      )}
    </motion.div>
  );
}
