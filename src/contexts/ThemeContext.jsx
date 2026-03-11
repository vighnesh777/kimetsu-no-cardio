import { createContext, useContext, useState, useEffect } from 'react';
import { getStyle } from '../themes/breathingStyles';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [styleId, setStyleId] = useState(() => localStorage.getItem('breathingStyle') || null);
  const theme = styleId ? getStyle(styleId) : null;

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--color-bg', c.bg);
    root.style.setProperty('--color-bg-secondary', c.bgSecondary);
    root.style.setProperty('--color-bg-card', c.bgCard);
    root.style.setProperty('--color-text', c.text);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--color-glow', c.glow);
    root.style.setProperty('--gradient', theme.gradient);
    root.style.setProperty('--card-gradient', theme.cardGradient);
    root.style.setProperty('--border-glow', theme.borderGlow);
    document.body.style.backgroundColor = c.bg;
  }, [theme]);

  const selectStyle = (id) => {
    setStyleId(id);
    localStorage.setItem('breathingStyle', id);
  };

  const clearStyle = () => {
    setStyleId(null);
    localStorage.removeItem('breathingStyle');
  };

  return (
    <ThemeContext.Provider value={{ theme, styleId, selectStyle, clearStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
