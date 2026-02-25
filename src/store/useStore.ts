import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get as getIdb, set as setIdb, del as delIdb } from 'idb-keyval';
import type { AppState } from './types';
import { createUserSlice } from './slices/userSlice';
import { createAchievementSlice } from './slices/achievementSlice';
import { createGoalSlice } from './slices/goalSlice';
import { createHabitSlice } from './slices/habitSlice';
import { createTaskSlice } from './slices/taskSlice';
import { createProjectSlice } from './slices/projectSlice';
import { createDailyLogSlice } from './slices/dailyLogSlice';
import { createJournalSlice } from './slices/journalSlice';
import { createReadingSlice } from './slices/readingSlice';
import { createFinanceSlice } from './slices/financeSlice';
import { createInboxSlice } from './slices/inboxSlice';
import { createAICoachSlice } from './slices/aiCoachSlice';
import { createHealthSlice } from './slices/healthSlice';
import { createMindsetSlice } from './slices/mindsetSlice';
import { createLearningSlice } from './slices/learningSlice';
import { createTwelveWeekYearSlice } from './slices/twelveWeekYearSlice';
import {
  SEED_USER,
  SEED_HABITS,
  SEED_GOALS,
  SEED_TASKS,
  SEED_PROJECTS,
  SEED_DAILY_LOGS,
  SEED_JOURNAL_ENTRIES,
  SEED_ACHIEVEMENTS,
  SEED_INBOX,
} from '../data/seeder';
import { DEFAULT_ACHIEVEMENTS } from './constants';

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createAchievementSlice(...a),
      ...createGoalSlice(...a),
      ...createHabitSlice(...a),
      ...createTaskSlice(...a),
      ...createProjectSlice(...a),
      ...createDailyLogSlice(...a),
      ...createJournalSlice(...a),
      ...createReadingSlice(...a),
      ...createFinanceSlice(...a),
      ...createInboxSlice(...a),
      ...createAICoachSlice(...a),
      ...createHealthSlice(...a),
      ...createMindsetSlice(...a),
      ...createLearningSlice(...a),
      ...createTwelveWeekYearSlice(...a),

      loadSeedData: () => {
        const [set] = a;
        set({
          user: SEED_USER,
          habits: SEED_HABITS,
          goals: SEED_GOALS,
          tasks: SEED_TASKS,
          projects: SEED_PROJECTS,
          dailyLogs: SEED_DAILY_LOGS,
          journalEntries: SEED_JOURNAL_ENTRIES,
          achievements: SEED_ACHIEVEMENTS,
          inbox: SEED_INBOX,
        });
      },

      clearAllData: () => {
        const [set] = a;
        set({
          user: null,
          habits: [],
          goals: [],
          tasks: [],
          projects: [],
          dailyLogs: [],
          journalEntries: [],
          achievements: DEFAULT_ACHIEVEMENTS,
          inbox: [],
        });
      },
    }),
    {
      name: 'peak-performer-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          return (await getIdb(name)) || null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await setIdb(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
          await delIdb(name);
        },
      })),
    }
  )
);
