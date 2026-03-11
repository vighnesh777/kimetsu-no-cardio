import { useState } from 'react';
import Model from 'react-body-highlighter';
import { useTheme } from '../../contexts/ThemeContext';
import { MUSCLE_GROUPS } from '../../data/exercises';
import styles from './MuscleSkeleton.module.css';

// Convert our { muscleId: count } map → react-body-highlighter data format
// Each "exercise" entry lights up a set of muscles at a given frequency
function countsToModelData(muscleCounts) {
  if (!Object.keys(muscleCounts).length) return [];
  return Object.entries(muscleCounts).map(([muscle, count]) => ({
    name: muscle,
    muscles: [muscle],
    frequency: count,
  }));
}

export default function MuscleSkeleton({ muscleCounts = {}, title = 'Muscle Activity' }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';
  const [view, setView] = useState('anterior');
  const [hovered, setHovered] = useState(null);

  const modelData = countsToModelData(muscleCounts);

  // Sorted muscles for legend
  const sortedMuscles = Object.entries(muscleCounts).sort(([, a], [, b]) => b - a).slice(0, 8);
  const maxCount = sortedMuscles[0]?.[1] || 1;

  // Colors: low → muted primary, high → full primary
  const highlightedColors = [
    `${primary}55`,  // frequency 1
    `${primary}88`,  // frequency 2
    `${primary}bb`,  // frequency 3
    primary,          // frequency 4+
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'anterior' ? styles.viewActive : ''}`}
            onClick={() => setView('anterior')}
          >Front</button>
          <button
            className={`${styles.viewBtn} ${view === 'posterior' ? styles.viewActive : ''}`}
            onClick={() => setView('posterior')}
          >Back</button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.modelWrap}>
          <Model
            data={modelData}
            style={{ width: '140px', height: 'auto' }}
            type={view}
            highlightedColors={highlightedColors}
            bodyColor="rgba(255,255,255,0.07)"
            strokeColor="rgba(255,255,255,0.15)"
            onClick={({ muscle, data }) => {
              if (muscle) setHovered(muscle === hovered ? null : muscle);
            }}
          />
          {hovered && (
            <div className={styles.tooltip} style={{ borderColor: primary }}>
              <span className={styles.tooltipLabel}>
                {MUSCLE_GROUPS[hovered]?.label || hovered}
              </span>
              <span className={styles.tooltipCount} style={{ color: primary }}>
                {muscleCounts[hovered] || 0} session{muscleCounts[hovered] !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className={styles.legend}>
          <p className={styles.legendTitle}>Most Trained</p>
          {sortedMuscles.length === 0 ? (
            <p className={styles.legendEmpty}>Log workouts to see data</p>
          ) : sortedMuscles.map(([muscle, count]) => (
            <div
              key={muscle}
              className={styles.legendRow}
              onMouseEnter={() => setHovered(muscle)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: hovered && hovered !== muscle ? 0.4 : 1 }}
            >
              <div className={styles.legendBarBg}>
                <div
                  className={styles.legendBarFill}
                  style={{ width: `${(count / maxCount) * 100}%`, background: primary }}
                />
              </div>
              <span className={styles.legendMuscle}>
                {MUSCLE_GROUPS[muscle]?.label || muscle}
              </span>
              <span className={styles.legendCount} style={{ color: primary }}>{count}x</span>
            </div>
          ))}

          <div className={styles.intensityKey}>
            <span className={styles.keyLabel}>Low</span>
            {highlightedColors.map((c, i) => (
              <div key={i} className={styles.keyDot} style={{ background: c }} />
            ))}
            <span className={styles.keyLabel}>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
