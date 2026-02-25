import type { StateCreator } from 'zustand';
import type { Habit } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay } from 'date-fns';
import { POINTS } from '../constants';

export interface HabitSlice {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'totalCompletions' | 'completionHistory'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
}

export const createHabitSlice: StateCreator<AppState, [], [], HabitSlice> = (set, get) => ({
  habits: [],

  addHabit: (habitData) => {
    const habit: Habit = {
      ...habitData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionHistory: {},
    };
    set((state) => {
      const isFirstHabit = state.habits.length === 0;
      if (isFirstHabit) {
        get().unlockAchievement('habit_starter');
      }
      return { habits: [...state.habits, habit] };
    });
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    }));
  },

  toggleHabitCompletion: (id, date) => {
    set((state) => {
      const habit = state.habits.find((h) => h.id === id);
      if (!habit) return state;

      const wasCompleted = habit.completionHistory[date];
      const newHistory = { ...habit.completionHistory, [date]: !wasCompleted };
      
      let newStreak = 0;
      const today = startOfDay(new Date());
      let checkDate = today;
      
      while (true) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        if (newHistory[dateStr]) {
          newStreak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }

      const newLongestStreak = Math.max(habit.longestStreak, newStreak);
      const newTotalCompletions = habit.totalCompletions + (wasCompleted ? -1 : 1);

      if (!wasCompleted) {
        get().addPoints(POINTS.completeHabit);
        
        if (newStreak >= 7) {
          get().unlockAchievement('streak_7');
        }
        if (newStreak >= 30) {
          get().unlockAchievement('streak_30');
        }
      }

      return {
        habits: state.habits.map((h) =>
          h.id === id
            ? {
                ...h,
                completionHistory: newHistory,
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                totalCompletions: newTotalCompletions,
              }
            : h
        ),
      };
    });
  },
});
