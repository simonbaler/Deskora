/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeMode, ThemeContextType } from '../types';
import { soundManager } from '../lib/sound';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'deskora_theme';

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__deskora_theme_test__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredThemeMode(): ThemeMode {
  if (!isStorageAvailable()) return 'system';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getStoredThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const mode = getStoredThemeMode();
    if (mode === 'system') return getSystemTheme();
    return mode;
  });

  // Apply class to HTML element and update meta theme color
  const applyThemeToDOM = useCallback((theme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0D0B0F' : '#FFFCFA');
    }
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    let activeTheme: 'light' | 'dark' = 'light';
    if (themeMode === 'system') {
      activeTheme = getSystemTheme();
    } else {
      activeTheme = themeMode;
    }

    setResolvedTheme(activeTheme);
    applyThemeToDOM(activeTheme);

    if (isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, themeMode);
      } catch {
        // storage quota/access error fallback
      }
    }
  }, [themeMode, applyThemeToDOM]);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        const nextTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextTheme);
        applyThemeToDOM(nextTheme);
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    } else if ((mq as unknown as { addListener?: (fn: typeof handleChange) => void }).addListener) {
      (mq as unknown as { addListener: (fn: typeof handleChange) => void }).addListener(handleChange);
      return () => {
        (mq as unknown as { removeListener?: (fn: typeof handleChange) => void }).removeListener?.(handleChange);
      };
    }
  }, [themeMode, applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    soundManager.play('theme_change');
    setThemeModeState((currentMode) => {
      const currentResolved =
        currentMode === 'system' ? getSystemTheme() : currentMode;
      const nextTheme = currentResolved === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    soundManager.play('theme_change');
    setThemeModeState(mode);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themeMode,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
