import type { StateCreator } from 'zustand';
import type { User } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface UserSlice {
  user: User | null;
  currentView: string;
  theme: 'light' | 'dark' | 'oled' | 'auto';
  tourRunning: boolean;
  
  initUser: (name: string, role?: 'admin' | 'guest') => void;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
  checkStreak: () => void;
  setCurrentView: (view: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'oled' | 'auto') => void;
  setTourRunning: (running: boolean) => void;
}

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
  user: null,
  currentView: 'dashboard',
  theme: 'auto',
  tourRunning: false,

  initUser: (name: string, role: 'admin' | 'guest' = 'guest') => {
    const user: User = {
      id: uuidv4(),
      name,
      email: '',
      createdAt: new Date().toISOString(),
      missionStatement: '',
      coreValues: [],
      lifeRoles: {},
      wakeUpTime: '05:00',
      morningRoutine: ['silence', 'affirmations', 'visualization', 'exercise', 'reading', 'scribing'],
      eveningRoutine: ['review', 'gratitude', 'planning'],
      preferredMethodologies: [],
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: new Date().toISOString(),
      totalPoints: 0,
      level: 1,
      achievements: [],
      isPremium: false,
      subscriptionType: 'free',
      role,
    };
    set({ user });
  },

  updateUser: (updates) => {
    set((state: AppState) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  checkStreak: () => {
    const { user } = get();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.split('T')[0] : null;

    if (lastLogin === today) return;

    let newStreak = 1;
    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        newStreak = (user.currentStreak || 0) + 1;
      }
    }

    const updatedUser = {
      ...user,
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak || 0, newStreak),
      lastLoginDate: new Date().toISOString(),
    };

    set({ user: updatedUser });
  },

  addPoints: (points) => {
    set((state: AppState) => {
      if (!state.user) return state;
      
      // XP Multiplier based on streak: 10% bonus per day, max 2.5x
      const streak = state.user.currentStreak || 1;
      const multiplier = Math.min(1 + (streak * 0.1), 2.5);
      const adjustedPoints = Math.round(points * multiplier);
      
      const newTotal = state.user.totalPoints + adjustedPoints;
      let newLevel = state.user.level;
      
      const levelThresholds = [0, 1000, 5000, 15000, 50000, 100000, 250000, 500000, 1000000, 5000000];
      for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (newTotal >= levelThresholds[i]) {
          newLevel = i + 1;
          break;
        }
      }
      
      return {
        user: {
          ...state.user,
          totalPoints: newTotal,
          level: newLevel,
        },
      };
    });
  },

  setCurrentView: (view) => {
    set({ currentView: view });
  },

  setTheme: (theme) => {
    set({ theme });
    const root = document.documentElement;
    root.classList.remove('dark', 'oled');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'oled') {
      root.classList.add('dark', 'oled');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    }
  },

  setTourRunning: (running) => {
    set({ tourRunning: running });
  },
});
