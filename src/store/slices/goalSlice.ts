import type { StateCreator } from 'zustand';
import type { Goal } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface GoalSlice {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'status'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

export const createGoalSlice: StateCreator<AppState, [], [], GoalSlice> = (set, get) => ({
  goals: [],

  addGoal: (goalData) => {
    const goal: Goal = {
      ...goalData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
    };
    set((state) => {
      const isFirstGoal = state.goals.length === 0;
      if (isFirstGoal) {
        get().unlockAchievement('goal_setter');
      }
      return { goals: [...state.goals, goal] };
    });
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
  },

  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },
});
