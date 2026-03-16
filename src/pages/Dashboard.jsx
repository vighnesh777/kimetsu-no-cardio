import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllFitnessData } from '../services/googleFit';
import StatsCard from '../components/StatsCard/StatsCard';
import FormProgression from '../components/FormProgression/FormProgression';
import RankBadge from '../components/RankBadge/RankBadge';
import DSIcon from '../components/DSIcon/DSIcon';
import { useProgressionContext as useProgression } from '../contexts/ProgressionContext';
import styles from './Dashboard.module.css';

const STEP_GOAL = 10000;
const CALORIE_GOAL = 600;
const SLEEP_GOAL = 8;
const ACTIVE_GOAL = 30;

function MotivationalBanner({ theme }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <motion.div
      className={styles.banner}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <DSIcon name="katana" size={28} color={theme?.colors.primary} />
      <div>
        <p className={styles.bannerStyle}>{theme?.name}</p>
        <p className={styles.bannerQuote}>"{theme?.quote}"</p>
      </div>
      <button className={styles.bannerClose} onClick={() => setVisible(false)}>
        <DSIcon name="close" size={14} />
      </button>
    </motion.div>
  );
}

export default function Dashboard() {
  const { theme, styleId } = useTheme();
  const { accessToken, user, isApiConnected } = useAuth();
  const navigate = useNavigate();
  const [data,        setData]      = useState(null);
  const [loading,     setLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const {
    currentRank, rankProgress, streakCount,
    forms, totalForms, unlockedForms,
    workouts, dailyMissions, completedToday,
    autoCheckMissions,
  } = useProgression();

  useEffect(() => {
    if (!accessToken) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAllFitnessData(accessToken)
      .then(d => {
        setData(d);
        setLastUpdated(new Date());
        autoCheckMissions(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const primary = theme?.colors.primary || '#FF4500';
  const textMuted = theme?.colors.textMuted || '#FF8C00';

  const stepProgress  = data?.steps         ? Math.min((data.steps / STEP_GOAL) * 100, 100)                   : 0;
  const calProgress   = data?.calories      ? Math.min((data.calories / CALORIE_GOAL) * 100, 100)             : 0;
  const sleepProgress = data?.sleep         ? Math.min((parseFloat(data.sleep) / SLEEP_GOAL) * 100, 100)      : 0;
  const activeProgress = data?.activeMinutes ? Math.min((data.activeMinutes / ACTIVE_GOAL) * 100, 100)        : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Token expired but user still signed in to Firebase
  const showReconnectBanner = user && !isApiConnected;

  return (
    <div className={styles.page}>
      <MotivationalBanner theme={theme} />

      {showReconnectBanner && (
        <motion.div
          className={styles.reconnectBanner}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DSIcon name="google" size={16} color="#faad14" />
          <span>
            Google Fit session expired.{' '}
            <button className={styles.reconnectLink} onClick={() => navigate('/onboarding')}>
              Reconnect
            </button>{' '}
            to sync live data.
          </span>
        </motion.div>
      )}

      <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div>
          <h1 className={styles.greeting}>
            {greeting()}, <span style={{ color: primary }}>{user?.displayName?.split(' ')[0] || 'Slayer'}</span>
          </h1>
          <p className={styles.date}>
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            {lastUpdated && (
              <span className={styles.sync}>
                · Synced {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>

        {!isApiConnected && (
          <button onClick={() => navigate('/onboarding')} className={styles.connectBtn}>
            <DSIcon name="google" size={14} />
            {user ? 'Reconnect Google Fit' : 'Connect Google Fit'}
          </button>
        )}
      </motion.div>

      <div className={styles.statsGrid}>
        <StatsCard iconName="steps"         label="Steps Today"      value={data?.steps?.toLocaleString()} progress={stepProgress}   goal={`${STEP_GOAL.toLocaleString()} steps`} goalLabel="Daily goal" delay={0}    loading={loading} />
        <StatsCard iconName="flame"         label="Calories Burned"  value={data?.calories}  unit="kcal" progress={calProgress}   goal={`${CALORIE_GOAL} kcal`}   goalLabel="Daily goal" delay={0.05} loading={loading} />
        <StatsCard iconName="distance"      label="Distance"         value={data?.distance}  unit="km"  delay={0.1}  loading={loading} />
        <StatsCard iconName="heartRate"     label="Heart Rate"       value={data?.heartRate} unit="bpm" delay={0.15} loading={loading} />
        <StatsCard iconName="sleep"         label="Sleep"            value={data?.sleep}     unit="hrs" progress={sleepProgress}  goal={`${SLEEP_GOAL} hrs`}      goalLabel="Sleep goal"  delay={0.2}  loading={loading} />
        <StatsCard iconName="activeMinutes" label="Active Minutes"   value={data?.activeMinutes} unit="min" progress={activeProgress} goal={`${ACTIVE_GOAL} min`} goalLabel="Daily goal" delay={0.25} loading={loading} />
      </div>

      <motion.div className={styles.chartCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>
            <DSIcon name="stats" size={16} color={primary} style={{ marginRight: 8 }} />
            Weekly Steps
          </h2>
          <span className={styles.chartSubtitle}>Past 7 days</span>
        </div>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.weeklySteps || []} barCategoryGap="25%">
              <XAxis dataKey="day" tick={{ fill: textMuted, fontSize: 12, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.9)', border: `1px solid ${primary}`, borderRadius: 8, color: primary, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar
                dataKey="steps"
                radius={[4, 4, 0, 0]}
                fill={primary}
                opacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Corps Rank */}
      <RankBadge rank={currentRank} rankProgress={rankProgress} streakCount={streakCount} />

      {/* Breathing Form Progression */}
      <FormProgression forms={forms} unlockedForms={unlockedForms} totalForms={totalForms} />

      {/* Daily Missions Preview */}
      <motion.div
        className={styles.missionsPreview}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className={styles.missionsPreviewHeader}>
          <h2 className={styles.missionsPreviewTitle}>Today's Crow Dispatch</h2>
          <Link to="/missions" className={styles.missionsPreviewLink} style={{ color: primary }}>
            View all →
          </Link>
        </div>
        <div className={styles.missionsPreviewList}>
          {dailyMissions.map(m => {
            const done = completedToday.has(m.id);
            return (
              <div
                key={m.id}
                className={`${styles.missionPreviewItem} ${done ? styles.missionDone : ''}`}
                style={done ? { borderColor: primary } : {}}
              >
                <span className={styles.missionPreviewDot} style={{ background: done ? primary : undefined }} />
                <span className={styles.missionPreviewName} style={done ? { color: primary } : {}}>
                  {m.title}
                </span>
                <span className={styles.missionPreviewPts} style={{ color: primary }}>+{m.points}pts</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div className={styles.styleInfoCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
        <div className={styles.styleInfoLeft}>
          <DSIcon name="style" size={36} color={primary} />
          <div>
            <p className={styles.styleInfoName}>{theme?.name}</p>
            <p className={styles.styleInfoJp}>{theme?.japanese}</p>
          </div>
        </div>
        <div className={styles.styleInfoRight}>
          <span className={styles.styleInfoForms}>{theme?.formCount} Forms</span>
          <span className={styles.styleInfoRank}>{theme?.rank}</span>
        </div>
        <p className={styles.styleInfoDesc}>{theme?.description}</p>
        <button onClick={() => navigate('/onboarding')} className={styles.changeStyleLink}>Change Hunter →</button>
      </motion.div>
    </div>
  );
}
