import type { StateCreator } from 'zustand';
import type { DailyLog } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export interface DailyLogSlice {
  dailyLogs: DailyLog[];
  getTodayLog: () => DailyLog | undefined;
  updateTodayLog: (updates: Partial<DailyLog>) => void;
}

export const createDailyLogSlice: StateCreator<AppState, [], [], DailyLogSlice> = (set, get) => ({
  dailyLogs: [],

  getTodayLog: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().dailyLogs.find((log) => log.date === today);
  },

  updateTodayLog: (updates) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    set((state) => {
      const existingLog = state.dailyLogs.find((log) => log.date === today);
      
      if (existingLog) {
        return {
          dailyLogs: state.dailyLogs.map((log) =>
            log.date === today ? { ...log, ...updates } : log
          ),
        };
      } else {
        const newLog: DailyLog = {
          id: uuidv4(),
          userId: state.user?.id || '',
          date: today,
          silenceCompleted: false,
          silenceDuration: 0,
          affirmationsCompleted: false,
          visualizationCompleted: false,
          exerciseCompleted: false,
          exerciseType: '',
          exerciseDuration: 0,
          readingCompleted: false,
          readingPages: 0,
          scribingCompleted: false,
          frogOfTheDay: '',
          frogCompleted: false,
          frogCompletedTime: null,
          deepWorkHours: 0,
          deepWorkSessions: 0,
          gratitudeList: [],
          focusToday: '',
          excitedAbout: '',
          committedTo: '',
          wins: [],
          lessons: [],
          improvements: [],
          tomorrowPriorities: [],
          productivityScore: 0,
          energyScore: 0,
          moodScore: 0,
          overallScore: 0,
          journalEntry: '',
          ...updates,
        };
        return { dailyLogs: [...state.dailyLogs, newLog] };
      }
    });
  },
});
