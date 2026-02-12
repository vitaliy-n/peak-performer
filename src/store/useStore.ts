import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfDay } from 'date-fns';
import type {
  User,
  Goal,
  Habit,
  Task,
  Project,
  DailyLog,
  JournalEntry,
  Achievement,
  FinanceEntry,
  FinanceState,
  Book,
  ReadingSession,
} from '../types';
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

interface AppState {
  user: User | null;
  goals: Goal[];
  habits: Habit[];
  tasks: Task[];
  projects: Project[];
  dailyLogs: DailyLog[];
  journalEntries: JournalEntry[];
  achievements: Achievement[];
  inbox: string[];
  books: Book[];
  readingSessions: ReadingSession[];
  currentView: string;
  theme: 'light' | 'dark' | 'auto';
  tourRunning: boolean;
  
  // Finance state
  finance: FinanceState;
  
  // User actions
  initUser: (name: string) => void;
  updateUser: (updates: Partial<User>) => void;
  addPoints: (points: number) => void;
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'status'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'totalCompletions' | 'completionHistory'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setFrogOfDay: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Daily log actions
  getTodayLog: () => DailyLog | undefined;
  updateTodayLog: (updates: Partial<DailyLog>) => void;
  
  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Reading actions
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addReadingSession: (session: Omit<ReadingSession, 'id' | 'date'>) => void;

  // Inbox actions
  addToInbox: (item: string) => void;
  removeFromInbox: (index: number) => void;
  clearInbox: () => void;
  
  // Achievement actions
  unlockAchievement: (id: string) => void;
  
  // Finance actions
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id' | 'date'>) => void;
  updateFinanceEntry: (id: string, updates: Partial<FinanceEntry>) => void;
  deleteFinanceEntry: (id: string) => void;
  toggleSevenRule: (ruleKey: string) => void;
  updateFireData: (data: Partial<FinanceState['fireData']>) => void;
  
  // Navigation
  setCurrentView: (view: string) => void;
  
  // Theme
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setTourRunning: (running: boolean) => void;
  
  // Seed data
  loadSeedData: () => void;
  clearAllData: () => void;
}

const POINTS = {
  completeHabit: 10,
  completeTask: 5,
  completeFrog: 30,
  completeMorningRoutine: 50,
  journalEntry: 15,
  weeklyReview: 100,
  deepWorkHour: 20,
  readPage: 1,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_frog', name: 'Перша жаба', description: 'Виконайте свою першу "жабу"', icon: '🐸', points: 50, unlockedAt: null, category: 'productivity' },
  { id: 'early_bird', name: 'Рання пташка', description: 'Прокиньтесь о 5 ранку 7 днів поспіль', icon: '🌅', points: 200, unlockedAt: null, category: 'habits' },
  { id: 'habit_starter', name: 'Початок звички', description: 'Створіть свою першу звичку', icon: '🌱', points: 25, unlockedAt: null, category: 'habits' },
  { id: 'streak_7', name: 'Тижневий streak', description: '7-денний streak будь-якої звички', icon: '🔥', points: 100, unlockedAt: null, category: 'habits' },
  { id: 'streak_30', name: 'Місячний streak', description: '30-денний streak будь-якої звички', icon: '💪', points: 500, unlockedAt: null, category: 'habits' },
  { id: 'goal_setter', name: 'Ціль встановлена', description: 'Встановіть свою першу ціль', icon: '🎯', points: 25, unlockedAt: null, category: 'goals' },
  { id: 'goal_crusher', name: 'Досягнення цілі', description: 'Досягніть своєї першої цілі', icon: '🏆', points: 200, unlockedAt: null, category: 'goals' },
  { id: 'deep_worker', name: 'Глибока робота', description: '4 години глибокої роботи за день', icon: '🧠', points: 150, unlockedAt: null, category: 'productivity' },
  { id: 'journaler', name: 'Журналіст', description: 'Напишіть 10 записів у журналі', icon: '📝', points: 100, unlockedAt: null, category: 'mindfulness' },
  { id: 'reader', name: 'Читач', description: 'Прочитайте 100 сторінок', icon: '📚', points: 100, unlockedAt: null, category: 'reading' },
  { id: 'morning_master', name: 'Майстер ранку', description: 'Виконайте ранкову рутину 7 днів поспіль', icon: '☀️', points: 300, unlockedAt: null, category: 'habits' },
  { id: 'atomic', name: 'Атомні звички', description: '1% покращення 30 днів поспіль', icon: '⚛️', points: 1000, unlockedAt: null, category: 'special' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      goals: [],
      habits: [],
      tasks: [],
      projects: [],
      dailyLogs: [],
      journalEntries: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      inbox: [],
      books: [],
      readingSessions: [],
      currentView: 'dashboard',
      theme: 'auto',
      tourRunning: false,
      
      // Finance state
      finance: {
        entries: [],
        sevenRulesCompleted: {},
        fireData: {
          annualExpenses: 30000,
          currentSavings: 10000,
          annualSavings: 15000,
          expectedReturn: 7,
        },
      },

      initUser: (name: string) => {
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
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          level: 1,
          achievements: [],
          isPremium: false,
          subscriptionType: 'free',
        };
        set({ user });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      addPoints: (points) => {
        set((state) => {
          if (!state.user) return state;
          const newTotal = state.user.totalPoints + points;
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

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          completed: false,
          completedAt: null,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      toggleTaskCompletion: (id) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const wasCompleted = task.completed;
          
          if (!wasCompleted) {
            get().addPoints(task.isFrog ? POINTS.completeFrog : POINTS.completeTask);
            if (task.isFrog) {
              get().unlockAchievement('first_frog');
            }
          }

          return {
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    completed: !t.completed,
                    completedAt: !t.completed ? new Date().toISOString() : null,
                  }
                : t
            ),
          };
        });
      },

      setFrogOfDay: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => ({
            ...t,
            isFrog: t.id === id,
          })),
        }));
      },

      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          tasks: [],
        };
        set((state) => ({ projects: [...state.projects, project] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

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

      addJournalEntry: (entryData) => {
        const entry: JournalEntry = {
          ...entryData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          get().addPoints(POINTS.journalEntry);
          const totalEntries = state.journalEntries.length + 1;
          if (totalEntries >= 10) {
            get().unlockAchievement('journaler');
          }
          return { journalEntries: [...state.journalEntries, entry] };
        });
      },

      updateJournalEntry: (id, updates) => {
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      deleteJournalEntry: (id) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        }));
      },

      addBook: (bookInput) => {
        const {
          pagesRead = 0,
          totalPages = 0,
          dailyPagesGoal = 10,
          favorite = false,
          topIdeas = [],
          status = 'reading',
          ...rest
        } = bookInput;

        const now = new Date().toISOString();
        const newBook: Book = {
          id: uuidv4(),
          createdAt: now,
          lastUpdated: now,
          pagesRead,
          totalPages,
          dailyPagesGoal,
          favorite,
          topIdeas,
          status,
          ...rest,
        } as Book;

        set((state) => ({ books: [...state.books, newBook] }));
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id
              ? { ...book, ...updates, lastUpdated: new Date().toISOString() }
              : book
          ),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
          readingSessions: state.readingSessions.filter((session) => session.bookId !== id),
        }));
      },

      addReadingSession: ({ bookId, pagesRead, durationMinutes, focusLevel, mood, notes }) => {
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          const increment = Math.max(0, pagesRead);
          const newPagesRead = Math.min(book.totalPages || Infinity, book.pagesRead + increment);
          const updatedBook: Book = {
            ...book,
            pagesRead: newPagesRead,
            status:
              book.totalPages > 0 && newPagesRead >= book.totalPages ? 'completed' : book.status,
            completedAt:
              book.totalPages > 0 && newPagesRead >= book.totalPages
                ? book.completedAt ?? new Date().toISOString()
                : book.completedAt,
            lastUpdated: new Date().toISOString(),
          };

          const session: ReadingSession = {
            id: uuidv4(),
            bookId,
            date: new Date().toISOString(),
            pagesRead: increment,
            durationMinutes,
            focusLevel,
            mood,
            notes,
          };

          if (increment > 0) {
            get().addPoints(increment * POINTS.readPage);
          }

          return {
            books: state.books.map((b) => (b.id === bookId ? updatedBook : b)),
            readingSessions: [session, ...state.readingSessions].slice(0, 100),
          };
        });
      },

      addToInbox: (item) => {
        set((state) => ({ inbox: [...state.inbox, item] }));
      },

      removeFromInbox: (index) => {
        set((state) => ({
          inbox: state.inbox.filter((_, i) => i !== index),
        }));
      },

      clearInbox: () => {
        set({ inbox: [] });
      },

      unlockAchievement: (id) => {
        set((state) => {
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

      // Finance actions
      addFinanceEntry: (entry) => {
        set((state) => ({
          finance: {
            ...state.finance,
            entries: [...state.finance.entries, {
              ...entry,
              id: uuidv4(),
              date: new Date().toISOString(),
            }],
          },
        }));
        get().addPoints(5);
      },

      updateFinanceEntry: (id, updates) => {
        set((state) => ({
          finance: {
            ...state.finance,
            entries: state.finance.entries.map((entry) =>
              entry.id === id ? { ...entry, ...updates } : entry
            ),
          },
        }));
      },

      deleteFinanceEntry: (id) => {
        set((state) => ({
          finance: {
            ...state.finance,
            entries: state.finance.entries.filter((entry) => entry.id !== id),
          },
        }));
      },

      toggleSevenRule: (ruleKey) => {
        set((state) => ({
          finance: {
            ...state.finance,
            sevenRulesCompleted: {
              ...state.finance.sevenRulesCompleted,
              [ruleKey]: !state.finance.sevenRulesCompleted[ruleKey],
            },
          },
        }));
        get().addPoints(5);
      },

      updateFireData: (data) => {
        set((state) => ({
          finance: {
            ...state.finance,
            fireData: {
              ...state.finance.fireData,
              ...data,
            },
          },
        }));
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },

      setTourRunning: (running) => {
        set({ tourRunning: running });
      },

      loadSeedData: () => {
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
    }
  )
);
