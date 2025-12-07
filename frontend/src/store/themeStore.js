import { create } from 'zustand';

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  return stored || 'light';
};

/**
 * Theme Store using Zustand with manual persistence
 */
export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  /**
   * Toggle theme
   */
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },

  /**
   * Set theme
   */
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));

