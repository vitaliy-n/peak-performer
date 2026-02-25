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
import { createAuthSlice } from './slices/authSlice';
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
  SEED_SKILLS,
  SEED_BOOKS,
  SEED_FINANCE,
  SEED_MINDSET,
  SEED_HEALTH,
  SEED_12_WEEK_YEAR,
  SEED_FEYNMAN_NOTES,
  SEED_READING_SESSIONS,
  SEED_AI_CHAT,
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
      ...createAuthSlice(...a),

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
          skills: SEED_SKILLS,
          books: SEED_BOOKS,
          finance: SEED_FINANCE,
          mindset: SEED_MINDSET,
          health: SEED_HEALTH,
          twelveWeekYears: [SEED_12_WEEK_YEAR],
          activeTwelveWeekYearId: SEED_12_WEEK_YEAR.id,
          feynmanNotes: SEED_FEYNMAN_NOTES,
          readingSessions: SEED_READING_SESSIONS,
          aiCoach: SEED_AI_CHAT,
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
          skills: [],
          feynmanNotes: [],
          books: [],
          readingSessions: [],
          finance: {
            entries: [],
            investments: [],
            sevenRulesCompleted: {},
            fireData: {
              annualExpenses: 30000,
              currentSavings: 0,
              annualSavings: 0,
              expectedReturn: 7,
            },
          },
          mindset: {
            cookieJar: [],
            decisions: [],
            affirmations: [],
            visualizations: [],
          },
          health: {
            sleep: [],
            exercise: [],
            energy: [],
            fasting: {
              isFasting: false,
              startTime: null,
              targetDuration: 16,
              history: [],
            },
          },
          aiCoach: {
            messages: [],
            isTyping: false,
          },
          twelveWeekYears: [],
          activeTwelveWeekYearId: null,
          isAuthenticated: false,
          token: null,
        });
      },
    }),
    {
      name: 'peak-performer-storage',
      storage: createJSONStorage(() => {
        let saveTimeout: ReturnType<typeof setTimeout>;
        
        return {
          getItem: async (name: string): Promise<string | null> => {
            return (await getIdb(name)) || null;
          },
          setItem: async (name: string, value: string): Promise<void> => {
            await setIdb(name, value);
            
            // Debounced auto-save to server if authenticated
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(async () => {
              try {
                const state = JSON.parse(value);
                if (state.state && state.state.isAuthenticated && state.state.user?.id) {
                   await fetch(`http://localhost:3001/api/data/${state.state.user.id}`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: value,
                   });
                }
              } catch (e) {
                console.error("Auto-save failed:", e);
              }
            }, 1000); // 1 second debounce
          },
          removeItem: async (name: string): Promise<void> => {
            await delIdb(name);
          },
        };
      }),
    }
  )
);

