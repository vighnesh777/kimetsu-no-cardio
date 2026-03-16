import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AvatarProvider } from './contexts/AvatarContext';
import Navigation from './components/Navigation/Navigation';
import ParticleCanvas from './components/ParticleCanvas/ParticleCanvas';
import CharacterBackground from './components/CharacterBackground/CharacterBackground';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Stats from './pages/Stats';
import Achievements from './pages/Achievements';
import Missions from './pages/Missions';
import AchievementToast from './components/AchievementToast/AchievementToast';
import { ProgressionProvider, useProgressionContext } from './contexts/ProgressionContext';
import './index.css';

function AppRoutes() {
  const { styleId } = useTheme();
  const { newAchievements } = useProgressionContext();

  if (!styleId) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <>
      <CharacterBackground />
      <ParticleCanvas />
      <Navigation />
      <Routes>
        <Route path="/"              element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/workouts"      element={<Workouts />} />
        <Route path="/stats"         element={<Stats />} />
        <Route path="/missions"      element={<Missions />} />
        <Route path="/achievements"  element={<Achievements />} />
        <Route path="/onboarding"    element={<Onboarding />} />
        <Route path="*"              element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <AchievementToast newAchievements={newAchievements} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AvatarProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ProgressionProvider>
              <AppRoutes />
            </ProgressionProvider>
          </BrowserRouter>
        </AvatarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
