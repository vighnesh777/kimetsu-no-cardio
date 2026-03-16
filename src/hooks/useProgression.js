import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  fetchProgress, saveProgressField,
  fetchAchievements, saveAchievement,
  fetchMissionCompletions, saveMissionCompletion,
  fetchWorkouts,
} from '../services/googleSheets';
import { getRankForPoints, getNextRank, getRankProgress, POINT_VALUES } from '../data/ranks';
import { checkAchievements, ACHIEVEMENTS } from '../data/achievements';

const VALID_ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map(a => a.id));
import { getDailyMissions, todayKey, checkMissionCompletion } from '../data/missions';
import { getFormsForStyle, getUnlockedFormCount } from '../data/breathingForms';

export function useProgression() {
  const { accessToken } = useAuth();
  const { styleId } = useTheme();

  const [loading,          setLoading]          = useState(true);
  const [progress,         setProgress]         = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [missionCompletions,   setMissionCompletions]   = useState([]);
  const [workouts,         setWorkouts]         = useState([]);
  const [newAchievements,  setNewAchievements]  = useState([]); // newly unlocked this session
  const syncing = useRef(false);

  // ── Load all data from Sheets ──────────────────────────────────
  const load = useCallback(async () => {
    if (!accessToken || syncing.current) return;
    syncing.current = true;
    try {
      const [prog, achievements, completions, ws] = await Promise.all([
        fetchProgress(accessToken),
        fetchAchievements(accessToken),
        fetchMissionCompletions(accessToken),
        fetchWorkouts(accessToken),
      ]);
      setProgress(prog);
      setMissionCompletions(completions);
      setWorkouts(ws);

      // Deduplicate + filter out stale IDs that no longer exist in ACHIEVEMENTS
      const alreadyUnlockedIds = [...new Set(
        achievements.map(a => a.id).filter(id => VALID_ACHIEVEMENT_IDS.has(id))
      )];
      setUnlockedAchievements(alreadyUnlockedIds);

      // ── Auto-unlock any achievements earned before gamification was added ──
      // Build stats from freshly-loaded data (not from stale state)
      const styleForms    = getFormsForStyle(styleId || '');
      const totalFrms     = styleForms.length;
      const unlockFrms    = Math.min(getUnlockedFormCount(ws.length), totalFrms);

      // Calculate max weekly workouts from worksheet history
      const weekCounts = {};
      ws.forEach(w => {
        if (!w.date) return;
        const d = new Date(w.date);
        if (isNaN(d)) return;
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().split('T')[0];
        weekCounts[key] = (weekCounts[key] || 0) + 1;
      });
      const maxWeekly = Math.max(0, ...Object.values(weekCounts));
      const uniqueEx  = new Set(ws.map(w => w.exercise).filter(Boolean)).size;
      const maxDur    = Math.max(0, ...ws.map(w => parseInt(w.duration || '0', 10)));

      const catchUpStats = {
        totalWorkouts:      ws.length,
        streak:             prog.streakCount,
        hasReturned:        prog.hasReturned,
        maxDailySteps:      prog.maxDailySteps,
        maxSessionDuration: Math.max(prog.maxSessionDuration, maxDur),
        maxWeeklyWorkouts:  Math.max(prog.maxWeeklyWorkouts, maxWeekly),
        uniqueExercises:    Math.max(prog.uniqueExercises?.length ?? 0, uniqueEx),
        missionsCompleted:  prog.missionsCompleted,
        perfectMissionDays: prog.perfectMissionDays,
        rankPoints:         prog.rankPoints,
        unlockedForms:      unlockFrms,
        totalForms:         totalFrms,
      };

      const newlyUnlocked = checkAchievements(catchUpStats, alreadyUnlockedIds);
      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
        setNewAchievements(newlyUnlocked);
        setTimeout(() => setNewAchievements([]), 6000);
        await Promise.all(newlyUnlocked.map(id => saveAchievement(accessToken, id)));
      }
    } catch (err) {
      console.error('[Progression] Load error:', err);
    } finally {
      syncing.current = false;
      setLoading(false);
    }
  }, [accessToken, styleId]);

  useEffect(() => {
    if (!accessToken) {
      // Not signed in to Google — show achievements/missions empty, not loading
      setLoading(false);
      return;
    }
    load();
  }, [load, accessToken]);

  // ── Derived state ──────────────────────────────────────────────
  const rankPoints    = progress?.rankPoints    ?? 0;
  const streakCount   = progress?.streakCount   ?? 0;
  const currentRank   = getRankForPoints(rankPoints);
  const nextRank      = getNextRank(rankPoints);
  const rankProgress  = getRankProgress(rankPoints);

  const todayStr      = new Date().toLocaleDateString();
  const todayWorkouts = workouts.filter(w => w.date === todayStr);
  const dailyMissions = getDailyMissions(todayKey());
  const completedToday = new Set(
    missionCompletions.filter(m => m.date === todayKey()).map(m => m.missionId)
  );

  const forms      = getFormsForStyle(styleId);
  const totalForms = forms.length;
  const unlockedForms = Math.min(getUnlockedFormCount(workouts.length), totalForms);

  // ── Add rank points ────────────────────────────────────────────
  const addPoints = useCallback(async (amount) => {
    if (!accessToken || !progress) return;
    const newPoints = rankPoints + amount;
    setProgress(p => ({ ...p, rankPoints: newPoints }));
    await saveProgressField(accessToken, 'rank_points', newPoints);

    // Check for newly unlocked achievements after points change
    await checkAndUnlockAchievements({ rankPoints: newPoints });
  }, [accessToken, progress, rankPoints]);

  // ── Update streak ──────────────────────────────────────────────
  const updateStreak = useCallback(async () => {
    if (!accessToken || !progress) return;
    const today = todayKey();
    const last  = progress.streakLastDate;

    // Already updated today
    if (last === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    let newStreak = last === yesterdayKey ? streakCount + 1 : 1;
    const wasReturning = streakCount === 0 && last && last !== yesterdayKey;

    setProgress(p => ({
      ...p,
      streakCount: newStreak,
      streakLastDate: today,
      hasReturned: wasReturning || p.hasReturned,
    }));

    await Promise.all([
      saveProgressField(accessToken, 'streak_count', newStreak),
      saveProgressField(accessToken, 'streak_last_date', today),
      wasReturning ? saveProgressField(accessToken, 'has_returned', 'true') : Promise.resolve(),
    ]);

    // Streak day points
    await addPoints(POINT_VALUES.streakDay, 'streak');
  }, [accessToken, progress, streakCount, addPoints]);

  // ── Complete a mission ─────────────────────────────────────────
  const completeMission = useCallback(async (missionId, points) => {
    if (!accessToken || completedToday.has(missionId)) return;
    const today = todayKey();

    setMissionCompletions(prev => [...prev, { date: today, missionId, completedAt: new Date().toISOString() }]);

    const newTotal = (progress?.missionsCompleted ?? 0) + 1;
    const todayCompleted = completedToday.size + 1;
    const newPerfect = todayCompleted === 3
      ? (progress?.perfectMissionDays ?? 0) + 1
      : (progress?.perfectMissionDays ?? 0);

    setProgress(p => ({ ...p, missionsCompleted: newTotal, perfectMissionDays: newPerfect }));

    await Promise.all([
      saveMissionCompletion(accessToken, today, missionId),
      saveProgressField(accessToken, 'missions_completed', newTotal),
      todayCompleted === 3 ? saveProgressField(accessToken, 'perfect_mission_days', newPerfect) : Promise.resolve(),
      addPoints(points, 'mission'),
    ]);
  }, [accessToken, completedToday, progress, addPoints]);

  // ── Check + unlock achievements ────────────────────────────────
  const checkAndUnlockAchievements = useCallback(async (extraStats = {}) => {
    if (!accessToken) return;

    const stats = {
      totalWorkouts:      workouts.length,
      streak:             streakCount,
      hasReturned:        progress?.hasReturned ?? false,
      maxDailySteps:      progress?.maxDailySteps ?? 0,
      maxSessionDuration: progress?.maxSessionDuration ?? 0,
      maxWeeklyWorkouts:  progress?.maxWeeklyWorkouts ?? 0,
      uniqueExercises:    progress?.uniqueExercises?.length ?? 0,
      missionsCompleted:  progress?.missionsCompleted ?? 0,
      perfectMissionDays: progress?.perfectMissionDays ?? 0,
      rankPoints:         rankPoints,
      unlockedForms,
      totalForms,
      ...extraStats,
    };

    const newlyUnlocked = checkAchievements(stats, unlockedAchievements);
    if (!newlyUnlocked.length) return;

    setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    setNewAchievements(newlyUnlocked);
    setTimeout(() => setNewAchievements([]), 6000); // clear toast after 6s

    await Promise.all(newlyUnlocked.map(id => saveAchievement(accessToken, id)));
  }, [accessToken, workouts, streakCount, progress, rankPoints, unlockedAchievements, unlockedForms, totalForms]);

  // ── On workout logged ──────────────────────────────────────────
  const onWorkoutLogged = useCallback(async (workout) => {
    await updateStreak();
    await addPoints(POINT_VALUES.workoutLogged, 'workout');

    // Update max session duration
    const duration = parseInt(workout.duration || '0', 10);
    if (duration > (progress?.maxSessionDuration ?? 0)) {
      setProgress(p => ({ ...p, maxSessionDuration: duration }));
      await saveProgressField(accessToken, 'max_session_duration', duration);
    }

    // Update unique exercises
    const existing = new Set(progress?.uniqueExercises ?? []);
    if (workout.exercise && !existing.has(workout.exercise)) {
      existing.add(workout.exercise);
      const arr = [...existing];
      setProgress(p => ({ ...p, uniqueExercises: arr }));
      await saveProgressField(accessToken, 'unique_exercises', arr.join(','));
    }

    await checkAndUnlockAchievements();
  }, [accessToken, progress, updateStreak, addPoints, checkAndUnlockAchievements]);

  // ── Auto-check missions from Google Fit data ───────────────────
  const autoCheckMissions = useCallback(async (fitData) => {
    if (!fitData) return;

    // Update max daily steps
    if ((fitData.steps ?? 0) > (progress?.maxDailySteps ?? 0)) {
      const s = fitData.steps;
      setProgress(p => ({ ...p, maxDailySteps: s }));
      await saveProgressField(accessToken, 'max_daily_steps', s);
    }

    for (const mission of dailyMissions) {
      if (completedToday.has(mission.id)) continue;
      const done = checkMissionCompletion(mission, {
        steps:          fitData.steps,
        activeMinutes:  fitData.activeMinutes,
        calories:       fitData.calories,
        todayWorkouts,
      });
      if (done) await completeMission(mission.id, mission.points);
    }

    await checkAndUnlockAchievements({ maxDailySteps: fitData.steps ?? 0 });
  }, [accessToken, progress, dailyMissions, completedToday, todayWorkouts, completeMission, checkAndUnlockAchievements]);

  const missionsCompleted  = progress?.missionsCompleted  ?? 0;
  const perfectMissionDays = progress?.perfectMissionDays ?? 0;

  return {
    loading,
    // Rank
    rankPoints, currentRank, nextRank, rankProgress,
    // Streak
    streakCount,
    // Forms
    forms, totalForms, unlockedForms,
    // Achievements
    unlockedAchievements, newAchievements,
    // Missions
    dailyMissions, completedToday, missionsCompleted, perfectMissionDays,
    // Workouts
    workouts,
    // Actions
    onWorkoutLogged, completeMission, autoCheckMissions,
    reload: load,
  };
}
