import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './StreakCalendar.module.css';

const WEEKS  = 53;   // full year (52 weeks + partial current week)
const DAYS   = 7;

/**
 * Build a grid of { date, count, isToday, isStreak } objects going back WEEKS×7 days.
 * workoutDates is an array of date strings matching toLocaleDateString() format.
 */
function buildGrid(workoutDates) {
  const dateSet = new Set(workoutDates);
  const today   = new Date();
  today.setHours(0, 0, 0, 0);

  // Rewind to the Monday of the oldest week
  const start = new Date(today);
  start.setDate(today.getDate() - (WEEKS * DAYS - 1));
  // Align to Monday
  const dayOfWeek = start.getDay(); // 0=Sun
  start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));

  const cells = [];
  const cur   = new Date(start);

  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < DAYS; d++) {
      const key     = cur.toLocaleDateString();
      const isToday = cur.getTime() === today.getTime();
      const isFuture = cur > today;
      week.push({
        date:   new Date(cur),
        key,
        count:  isFuture ? 0 : (dateSet.has(key) ? 1 : 0),
        isToday,
        isFuture,
      });
      cur.setDate(cur.getDate() + 1);
    }
    cells.push(week);
  }

  // Compute streak (consecutive days with workouts up to today)
  let streak = 0;
  const check = new Date(today);
  while (true) {
    const k = check.toLocaleDateString();
    if (!dateSet.has(k)) {
      // Allow today to be empty (streak hasn't ended yet)
      if (check.getTime() !== today.getTime()) break;
    } else {
      streak++;
    }
    check.setDate(check.getDate() - 1);
    if (streak > WEEKS * DAYS) break; // cap safety
  }

  // Mark streak days
  const streakSet = new Set();
  const s = new Date(today);
  for (let i = 0; i < streak; i++) {
    streakSet.add(s.toLocaleDateString());
    s.setDate(s.getDate() - 1);
  }

  return { cells, streak, streakSet };
}

// Month label positions: first cell of each new month
function monthLabels(cells) {
  const labels = [];
  cells.forEach((week, wi) => {
    const firstOfMonth = week.find(d => d.date.getDate() === 1);
    if (firstOfMonth) {
      labels.push({
        wi,
        label: firstOfMonth.date.toLocaleDateString('en', { month: 'short' }),
      });
    }
  });
  return labels;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakCalendar({ workouts = [], hevyWorkouts = [] }) {
  const { theme } = useTheme();
  const primary   = theme?.colors.primary || '#FF4500';
  const glow      = theme?.colors.glow    || 'rgba(255,69,0,0.5)';
  const gridRef   = useRef(null);

  // Merge Sheets workouts + any in-memory Hevy workouts not yet in Sheets
  const allDates = useMemo(() => {
    const sheetsSet = new Set(workouts.map(w => w.date).filter(Boolean));
    const hevyDates = hevyWorkouts.map(w => w.date).filter(d => d && !sheetsSet.has(d));
    return [...workouts.map(w => w.date), ...hevyDates].filter(Boolean);
  }, [workouts, hevyWorkouts]);

  // Auto-scroll to the rightmost (current) week after render
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollLeft = gridRef.current.scrollWidth;
    }
  }, [allDates.length]);

  const { cells, streak, streakSet } = useMemo(() => buildGrid(allDates), [allDates]);
  const months = useMemo(() => monthLabels(cells), [cells]);

  const cellColor = (cell) => {
    if (cell.isFuture) return 'rgba(255,255,255,0.03)';
    if (cell.count === 0) return 'rgba(255,255,255,0.06)';
    if (streakSet.has(cell.key)) return primary;
    return `${primary}66`; // trained but outside current streak
  };

  const cellGlow = (cell) => {
    if (!cell.count || cell.isFuture) return 'none';
    if (cell.isToday) return `0 0 8px ${glow}, 0 0 14px ${glow}`;
    if (streakSet.has(cell.key)) return `0 0 6px ${glow}`;
    return 'none';
  };

  // Detect which week indices start a new month (for padding)
  const monthStartWeeks = new Set(
    cells
      .map((week, wi) => ({ wi, hasFirst: week.some(d => d.date.getDate() === 1 && !d.isFuture) }))
      .filter(x => x.hasFirst && x.wi > 0)
      .map(x => x.wi)
  );

  // Month label text per week index
  const monthLabelAt = {};
  months.forEach(m => { monthLabelAt[m.wi] = m.label; });

  return (
    <motion.div
      className={styles.wrap}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Training Streak</h3>
          {streak > 0 && (
            <motion.span
              className={styles.streakBadge}
              style={{ background: `${primary}22`, borderColor: primary, color: primary }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {streak} day{streak !== 1 ? 's' : ''}
            </motion.span>
          )}
        </div>
        <p className={styles.sub}>
          {streak > 0
            ? 'Current streak — keep it going, Demon Slayer!'
            : 'Log a workout to start your streak.'}
        </p>
      </div>

      {/* Calendar */}
      <div className={styles.calendarWrap}>
        {/* Day-of-week labels */}
        <div className={styles.dayLabels}>
          {DAY_LABELS.map(d => (
            <span key={d} className={styles.dayLabel}>{d}</span>
          ))}
        </div>

        <div className={styles.gridOuter} ref={gridRef}>
          {/* Month label row — aligns with week columns */}
          <div className={styles.monthRow}>
            {cells.map((_, wi) => (
              <span
                key={wi}
                className={styles.monthLabel}
                style={{
                  width: 11,
                  flexShrink: 0,
                  marginLeft: monthStartWeeks.has(wi) ? 6 : 0,
                  display: 'block',
                  textAlign: 'left',
                }}
              >
                {monthLabelAt[wi] || ''}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className={styles.grid}>
            {cells.map((week, wi) => (
              <div
                key={wi}
                className={`${styles.weekCol} ${monthStartWeeks.has(wi) ? styles.monthStart : ''}`}
              >
                {week.map(cell => (
                  <motion.div
                    key={cell.key}
                    className={`${styles.cell} ${cell.isToday ? styles.cellToday : ''}`}
                    style={{
                      background:  cellColor(cell),
                      boxShadow:   cellGlow(cell),
                      borderColor: cell.isToday ? primary : 'transparent',
                    }}
                    title={`${cell.date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}${cell.count ? ' — trained' : ''}`}
                    whileHover={{ scale: 1.5, zIndex: 10 }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {[0.06, 0.4, 0.65, 0.85, 1].map((op, i) => (
          <div
            key={i}
            className={styles.legendDot}
            style={{
              background: i === 0
                ? 'rgba(255,255,255,0.06)'
                : `${primary}${Math.round(op * 255).toString(16).padStart(2, '0')}`,
            }}
          />
        ))}
        <span className={styles.legendLabel}>More</span>
        <div className={styles.legendSpacer} />
        <div
          className={styles.legendDot}
          style={{ background: primary, boxShadow: `0 0 6px ${glow}`, outline: `1.5px solid ${primary}` }}
        />
        <span className={styles.legendLabel}>Active streak</span>
      </div>
    </motion.div>
  );
}
