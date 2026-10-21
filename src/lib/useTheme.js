import { useCallback, useEffect, useState } from 'react';

const KEY = 'tips-academy.theme';

/** Light / dark theme for the whole platform, remembered between visits. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, setTheme, toggle };
}