import { useState, useEffect, useCallback } from 'react';
import { Launch } from '@/lib/types';

const FAVORITES_STORAGE_KEY = 'spacex-favorites';

interface FavoritesHook {
  favorites: string[];
  favoriteLaunches: Launch[];
  isFavorite: (_launchId: string) => boolean;
  addFavorite: (_launch: Launch) => Promise<void>;
  removeFavorite: (_launchId: string) => Promise<void>;
  toggleFavorite: (_launch: Launch) => Promise<void>;
  clearFavorites: () => void;
  favoritesCount: number;
  isLoading: (_launchId: string) => boolean;
  isInitialized: boolean;
}

// Global state for cross-component synchronization
let globalFavorites: string[] = [];
let globalFavoriteLaunches: Launch[] = [];
const globalListeners: Set<() => void> = new Set();

const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getFavoriteLaunchesFromStorage = (): Launch[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`${FAVORITES_STORAGE_KEY}-launches`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites: string[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Silently fail - localStorage might not be available
  }
};

const saveFavoriteLaunchesToStorage = (launches: Launch[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${FAVORITES_STORAGE_KEY}-launches`, JSON.stringify(launches));
  } catch {
    // Silently fail - localStorage might not be available
  }
};

// Notify all listeners of state changes
const notifyListeners = (): void => {
  globalListeners.forEach(listener => listener());
};

// Initialize global state from storage
const initializeGlobalState = (): void => {
  if (globalFavorites.length === 0 && globalFavoriteLaunches.length === 0) {
    globalFavorites = getFavoritesFromStorage();
    globalFavoriteLaunches = getFavoriteLaunchesFromStorage();
  }
};

// Update global state and persist
const updateGlobalFavorites = (favorites: string[], launches: Launch[]): void => {
  globalFavorites = favorites;
  globalFavoriteLaunches = launches;
  saveFavoritesToStorage(favorites);
  saveFavoriteLaunchesToStorage(launches);
  notifyListeners();
};

export const useFavorites = (): FavoritesHook => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteLaunches, setFavoriteLaunches] = useState<Launch[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Initialize from global state and set up listener
  useEffect(() => {
    initializeGlobalState();
    
    setFavorites(globalFavorites);
    setFavoriteLaunches(globalFavoriteLaunches);
    setIsInitialized(true);

    // Add listener for global state changes
    const updateLocalState = () => {
      setFavorites([...globalFavorites]);
      setFavoriteLaunches([...globalFavoriteLaunches]);
    };
    
    globalListeners.add(updateLocalState);

    return () => {
      globalListeners.delete(updateLocalState);
    };
  }, []);

  const isFavorite = useCallback((launchId: string): boolean => {
    return favorites.includes(launchId);
  }, [favorites]);

  const isLoading = useCallback((launchId: string): boolean => {
    return loadingStates[launchId] || false;
  }, [loadingStates]);

  const addFavorite = useCallback(async (launch: Launch): Promise<void> => {
    if (globalFavorites.includes(launch.id)) return;
    
    setLoadingStates(prev => ({ ...prev, [launch.id]: true }));
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = [...globalFavorites, launch.id];
    const existingLaunch = globalFavoriteLaunches.find(l => l.id === launch.id);
    const newLaunches = existingLaunch 
      ? globalFavoriteLaunches 
      : [...globalFavoriteLaunches, launch];
    
    updateGlobalFavorites(newFavorites, newLaunches);
    
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[launch.id];
      return newState;
    });
  }, []);

  const removeFavorite = useCallback(async (launchId: string): Promise<void> => {
    if (!globalFavorites.includes(launchId)) return;
    
    setLoadingStates(prev => ({ ...prev, [launchId]: true }));
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newFavorites = globalFavorites.filter(id => id !== launchId);
    const newLaunches = globalFavoriteLaunches.filter(launch => launch.id !== launchId);
    
    updateGlobalFavorites(newFavorites, newLaunches);
    
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[launchId];
      return newState;
    });
  }, []);

  const toggleFavorite = useCallback(async (launch: Launch): Promise<void> => {
    if (globalFavorites.includes(launch.id)) {
      await removeFavorite(launch.id);
    } else {
      await addFavorite(launch);
    }
  }, [addFavorite, removeFavorite]);

  const clearFavorites = useCallback((): void => {
    updateGlobalFavorites([], []);
  }, []);

  return {
    favorites,
    favoriteLaunches,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
    isLoading,
    isInitialized
  };
};

export default useFavorites;
