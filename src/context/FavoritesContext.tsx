/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useSound } from '../hooks/useSound';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, workspaceName: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'deskora_favorite_spaces';
const DEFAULT_FAVORITES = ['deskora-001'];

/**
 * Safely inspect if localStorage is available and writable
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__deskora_test_storage__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parse and sanitize stored favorites
 */
function getInitialFavorites(): string[] {
  if (!isStorageAvailable()) {
    return DEFAULT_FAVORITES;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_FAVORITES;
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return DEFAULT_FAVORITES;
    }

    // Sanitize: ensure valid string items, no empty strings, no unexpected objects or scripts
    const sanitized = parsed.filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0 && item.length <= 64
    );

    return sanitized.length > 0 ? sanitized : DEFAULT_FAVORITES;
  } catch (error) {
    // Corrupted JSON or unexpected storage failure: log warning and use in-memory fallback
    console.warn('Deskora: Favorites storage corrupted or unreadable. Using in-memory fallback.', error);
    return DEFAULT_FAVORITES;
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(getInitialFavorites);
  const { showToast } = useToast();
  const { playSound } = useSound();

  // Synchronize state changes to localStorage with quota and error guards
  useEffect(() => {
    if (!isStorageAvailable()) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      // QuotaExceededError or permission restrictions in sandboxed iframes
      console.warn('Deskora: Could not write favorites to localStorage (quota or restriction error). Falling back to in-memory state.', err);
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => {
      if (!id || typeof id !== 'string') return false;
      return favorites.includes(id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (id: string, workspaceName: string): boolean => {
      if (!id || typeof id !== 'string') return false;

      let nextIsFav = false;
      setFavorites((prev) => {
        const isFav = prev.includes(id);
        if (isFav) {
          nextIsFav = false;
          return prev.filter((favId) => favId !== id);
        } else {
          nextIsFav = true;
          return [...prev, id];
        }
      });

      if (favorites.includes(id)) {
        playSound('click');
        showToast(`Removed "${workspaceName}" from favorites`, 'info');
        return false;
      } else {
        playSound('favorite');
        showToast(`Saved "${workspaceName}" to favorites ❤️`, 'favorite');
        return true;
      }
    },
    [favorites, playSound, showToast]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
