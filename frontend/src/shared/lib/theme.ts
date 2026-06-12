export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'dark-mode'; // exact key used by Lineone

export const themeLib = {
  get(): Theme {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'light';
  },

  set(theme: Theme): void {
    localStorage.setItem(STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggle(): Theme {
    const next = themeLib.get() === 'dark' ? 'light' : 'dark';
    themeLib.set(next);
    return next;
  },

  init(): void {
    // Called once on app startup — applies persisted theme immediately
    themeLib.set(themeLib.get());
  },
};