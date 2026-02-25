import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import type { TwelveWeekYear, WeeklyPlan } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface TwelveWeekYearSlice {
  twelveWeekYears: TwelveWeekYear[];
  activeTwelveWeekYearId: string | null;
  createTwelveWeekYear: (title: string, startDate: string, goalIds: string[]) => void;
  updateTwelveWeekYear: (id: string, updates: Partial<TwelveWeekYear>) => void;
  deleteTwelveWeekYear: (id: string) => void;
  setActiveTwelveWeekYear: (id: string) => void;
  updateWeeklyPlan: (yearId: string, weekId: string, updates: Partial<WeeklyPlan>) => void;
}

export const createTwelveWeekYearSlice: StateCreator<AppState, [], [], TwelveWeekYearSlice> = (set, get) => ({
  twelveWeekYears: [],
  activeTwelveWeekYearId: null,

  createTwelveWeekYear: (title, startDate, goalIds) => {
    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + 12 * 7); // 12 weeks

    const weeks: WeeklyPlan[] = Array.from({ length: 13 }, (_, i) => {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return {
        id: uuidv4(),
        weekNumber: i + 1,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        tactics: [],
        score: 0,
        notes: '',
      };
    });

    const newYear: TwelveWeekYear = {
      id: uuidv4(),
      title,
      startDate,
      endDate: endDate.toISOString().split('T')[0],
      goals: goalIds,
      weeks,
      status: 'active',
    };

    set((state: AppState) => ({
      twelveWeekYears: [...state.twelveWeekYears, newYear],
      activeTwelveWeekYearId: newYear.id,
    }));
    get().addPoints(50);
  },

  updateTwelveWeekYear: (id, updates) => {
    set((state: AppState) => ({
      twelveWeekYears: state.twelveWeekYears.map((y: TwelveWeekYear) =>
        y.id === id ? { ...y, ...updates } : y
      ),
    }));
  },

  deleteTwelveWeekYear: (id) => {
    set((state: AppState) => ({
      twelveWeekYears: state.twelveWeekYears.filter((y: TwelveWeekYear) => y.id !== id),
      activeTwelveWeekYearId: state.activeTwelveWeekYearId === id ? null : state.activeTwelveWeekYearId,
    }));
  },

  setActiveTwelveWeekYear: (id) => {
    set({ activeTwelveWeekYearId: id });
  },

  updateWeeklyPlan: (yearId, weekId, updates) => {
    set((state: AppState) => ({
      twelveWeekYears: state.twelveWeekYears.map((year: TwelveWeekYear) => {
        if (year.id !== yearId) return year;
        return {
          ...year,
          weeks: year.weeks.map((week: WeeklyPlan) =>
            week.id === weekId ? { ...week, ...updates } : week
          ),
        };
      }),
    }));
  },
});
