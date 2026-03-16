import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchWeeklySteps } from '../services/googleFit';
import { fetchWorkouts } from '../services/googleSheets';
import { getMusclesFromWorkouts } from '../data/exercises';
import MuscleSkeleton from '../components/MuscleSkeleton/MuscleSkeleton';
import StreakCalendar from '../components/StreakCalendar/StreakCalendar';
import DSIcon from '../components/DSIcon/DSIcon';
import { useProgressionContext } from '../contexts/ProgressionContext';
import styles from './Stats.module.css';

const DEMO_WEEKLY = [
  { day: 'Mon', steps: 8200, calories: 480, active: 35 },
  { day: 'Tue', steps: 6500, calories: 310, active: 22 },
  { day: 'Wed', steps: 9800, calories: 560, active: 48 },
  { day: 'Thu', steps: 7100, calories: 390, active: 30 },
  { day: 'Fri', steps: 5400, calories: 270, active: 18 },
  { day: 'Sat', steps: 11200, calories: 640, active: 55 },
  { day: 'Sun', steps: 7342, calories: 412, active: 28 },
];

const RADAR_DATA = [
  { stat: 'Cardio', value: 75 },
  { stat: 'Strength', value: 60 },
  { stat: 'Flexibility', value: 45 },
  { stat: 'Endurance', value: 80 },
  { stat: 'Recovery', value: 65 },
  { stat: 'Consistency', value: 70 },
];

function Highlight({ label, value, unit, iconName, delay }) {
  const { theme } = useTheme();
  const primary = theme?.colors.primary || '#FF4500';
  return (
    <motion.div className={styles.highlight}
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}>
      <DSIcon name={iconName} size={28} color={primary} className={styles.highlightIcon} />
      <div className={styles.highlightInfo}>
        <span className={styles.highlightValue}>{value}<span className={styles.highlightUnit}>{unit}</span></span>
        <span className={styles.highlightLabel}>{label}</span>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const { theme } = useTheme();
  const { accessToken } = useAuth();
  // workouts from progression context includes in-memory Hevy entries not yet committed to Sheets
  const { workouts: hevyLiveWorkouts } = useProgressionContext();
  const [weeklyData, setWeeklyData] = useState(DEMO_WEEKLY);
  const [allTimeMuscles, setAllTimeMuscles] = useState({});
  const [allWorkouts, setAllWorkouts] = useState([]);
  const todayStr = new Date().toLocaleDateString();
  const [todayMuscles, setTodayMuscles] = useState({});

  const primary = theme?.colors.primary || '#FF4500';
  const secondary = theme?.colors.secondary || '#FF8C00';
  const accent = theme?.colors.accent || '#FFD700';
  const textMuted = theme?.colors.textMuted || '#FF8C00';

  useEffect(() => {
    if (!accessToken) return;
    fetchWorkouts(accessToken).then(workouts => {
      setAllWorkouts(workouts);
      setAllTimeMuscles(getMusclesFromWorkouts(workouts));
      setTodayMuscles(getMusclesFromWorkouts(workouts.filter(w => w.date === todayStr)));
    }).catch(console.error);
    fetchWeeklySteps(accessToken).then(steps => {
      if (steps?.length) {
        setWeeklyData(steps.map((s, i) => ({
          ...s,
          calories: DEMO_WEEKLY[i]?.calories || 0,
          active: DEMO_WEEKLY[i]?.active || 0,
        })));
      }
    }).catch(console.error);
  }, [accessToken]);

  const totalSteps = weeklyData.reduce((s, d) => s + d.steps, 0);
  const avgSteps = Math.round(totalSteps / weeklyData.length);
  const bestDay = weeklyData.reduce((b, d) => d.steps > b.steps ? d : b, weeklyData[0]);
  const totalCalories = weeklyData.reduce((s, d) => s + d.calories, 0);

  const ttStyle = {
    contentStyle: { background: 'rgba(0,0,0,0.92)', border: `1px solid ${primary}`, borderRadius: 8, color: primary, fontSize: 12 },
    cursor: { stroke: primary, strokeWidth: 1, strokeDasharray: '4 4' },
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}><span style={{ color: primary }}>Performance</span> Stats</h1>
        <p className={styles.subtitle}>Weekly overview — your path to mastery</p>
      </motion.div>

      <div className={styles.highlights}>
        <Highlight iconName="steps"   label="Weekly Steps"   value={totalSteps.toLocaleString()} unit=""       delay={0} />
        <Highlight iconName="average" label="Daily Average"  value={avgSteps.toLocaleString()}   unit=" steps" delay={0.05} />
        <Highlight iconName="risSun"  label="Best Day"       value={bestDay?.day}                unit=""       delay={0.1} />
        <Highlight iconName="flame"   label="Weekly Calories" value={totalCalories.toLocaleString()} unit=" kcal" delay={0.15} />
      </div>

      <motion.div className={styles.chartCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className={styles.chartTitle}>Steps This Week</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip {...ttStyle} />
            <Area type="monotone" dataKey="steps" stroke={primary} strokeWidth={2} fill="url(#sg)"
              dot={{ fill: primary, r: 4 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className={styles.twoCol}>
        <motion.div className={styles.chartCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className={styles.chartTitle}>Calories Burned</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...ttStyle} />
              <Line type="monotone" dataKey="calories" stroke={secondary} strokeWidth={2}
                dot={{ fill: secondary, r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className={styles.chartCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className={styles.chartTitle}>Fitness Profile</h2>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: textMuted, fontSize: 11 }} />
              <Radar dataKey="value" stroke={primary} fill={primary} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className={styles.chartCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className={styles.chartTitle}>Active Minutes</h2>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip {...ttStyle} />
            <Area type="monotone" dataKey="active" stroke={accent} strokeWidth={2} fill="url(#ag)"
              dot={{ fill: accent, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Streak Calendar */}
      <StreakCalendar workouts={allWorkouts} hevyWorkouts={hevyLiveWorkouts} />

      {/* Muscle Activity */}
      <div className={styles.twoCol}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <MuscleSkeleton muscleCounts={todayMuscles} title="Today's Muscles" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <MuscleSkeleton muscleCounts={allTimeMuscles} title="All-Time Muscle Map" />
        </motion.div>
      </div>
    </div>
  );
}
