import type { StateCreator } from 'zustand';
import type { Achievement } from '../../types';
import type { AppState } from '../types';

export interface AchievementSlice {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
}

export const createAchievementSlice: StateCreator<AppState, [], [], AchievementSlice> = (set, get) => ({
  achievements: [], // Initialized in useStore via loadSeedData or defaults
  
  unlockAchievement: (id) => {
    set((state: AppState) => {
      const achievement = state.achievements.find((a) => a.id === id);
      if (!achievement || achievement.unlockedAt) return state;

      get().addPoints(achievement.points);

      return {
        achievements: state.achievements.map((a) =>
          a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
        ),
        user: state.user
          ? {
              ...state.user,
              achievements: [...state.user.achievements, id],
            }
          : null,
      };
    });
  },
});
