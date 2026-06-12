import { useState, useCallback, useEffect } from 'react';
import { themeLib, type Theme } from '@/shared/lib/theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => themeLib.get());

  useEffect(() => {
    themeLib.init();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    themeLib.set(t);
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = themeLib.toggle();
    setThemeState(next);
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
};