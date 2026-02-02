export type LifeArea = 
  | 'career' 
  | 'financial' 
  | 'health' 
  | 'relationships' 
  | 'personal_growth' 
  | 'spiritual' 
  | 'fun_recreation' 
  | 'physical_environment';

export type GoalTimeframe = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'yearly' 
  | '3_year' 
  | '5_year' 
  | '10_year' 
  | 'lifetime';

export type Priority = 'A' | 'B' | 'C' | 'D' | 'E';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  missionStatement: string;
  coreValues: string[];
  lifeRoles: Record<string, string>;
  wakeUpTime: string;
  morningRoutine: string[];
  eveningRoutine: string[];
  preferredMethodologies: string[];
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  achievements: string[];
  isPremium: boolean;
  subscriptionType: 'free' | 'premium' | 'pro' | 'lifetime';
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  why: string;
  lifeArea: LifeArea;
  timeframe: GoalTimeframe;
  priority: Priority;
  specific: string;
  measurable: string;
  targetValue: number;
  currentValue: number;
  startDate: string;
  targetDate: string | null;
  parentGoalId: string | null;
  subGoals: string[];
  actionSteps: ActionStep[];
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActionStep {
  id: string;
  goalId: string;
  description: string;
  priority: Priority;
  context: string;
  estimatedTime: number;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  cue: string;
  craving: string;
  response: string;
  reward: string;
  identity: string;
  frequency: HabitFrequency;
  targetDays: number[];
  reminderTime: string | null;
  afterHabit: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionHistory: Record<string, boolean>;
  createdAt: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  context: string;
  estimatedTime: number;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
  isFrog: boolean;
  projectId: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'someday' | 'waiting';
  tasks: string[];
  createdAt: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  silenceCompleted: boolean;
  silenceDuration: number;
  affirmationsCompleted: boolean;
  visualizationCompleted: boolean;
  exerciseCompleted: boolean;
  exerciseType: string;
  exerciseDuration: number;
  readingCompleted: boolean;
  readingPages: number;
  scribingCompleted: boolean;
  frogOfTheDay: string;
  frogCompleted: boolean;
  frogCompletedTime: string | null;
  deepWorkHours: number;
  deepWorkSessions: number;
  gratitudeList: string[];
  focusToday: string;
  excitedAbout: string;
  committedTo: string;
  wins: string[];
  lessons: string[];
  improvements: string[];
  tomorrowPriorities: string[];
  productivityScore: number;
  energyScore: number;
  moodScore: number;
  overallScore: number;
  journalEntry: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  type: 'morning' | 'evening' | 'gratitude' | 'reflection' | 'free';
  title: string;
  content: string;
  gratitudeItems: string[];
  mood: number;
  tags: string[];
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  weekStart: string;
  inboxCleared: boolean;
  projectsReviewed: boolean;
  nextActionsUpdated: boolean;
  waitingForReviewed: boolean;
  somedayMaybeReviewed: boolean;
  rolesReviewed: Record<string, string>;
  bigRocks: string[];
  wins: string[];
  challenges: string[];
  lessons: string[];
  focusAreas: string[];
  keyProjects: string[];
  weekRating: number;
  lifeAreaScores: Record<LifeArea, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string | null;
  category: 'habits' | 'goals' | 'productivity' | 'mindfulness' | 'reading' | 'special';
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  book: string;
  category: string;
}

export interface MethodologyTip {
  id: string;
  methodology: string;
  author: string;
  title: string;
  description: string;
  actionItem: string;
}

export const LIFE_AREA_LABELS: Record<LifeArea, string> = {
  career: 'Кар\'єра',
  financial: 'Фінанси',
  health: 'Здоров\'я',
  relationships: 'Стосунки',
  personal_growth: 'Особистий розвиток',
  spiritual: 'Духовність',
  fun_recreation: 'Відпочинок',
  physical_environment: 'Оточення'
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  A: 'Обов\'язково (A)',
  B: 'Бажано (B)',
  C: 'Можна (C)',
  D: 'Делегувати (D)',
  E: 'Видалити (E)'
};

export const TIMEFRAME_LABELS: Record<GoalTimeframe, string> = {
  daily: 'Щоденна',
  weekly: 'Тижнева',
  monthly: 'Місячна',
  quarterly: 'Квартальна',
  yearly: 'Річна',
  '3_year': '3 роки',
  '5_year': '5 років',
  '10_year': '10 років',
  lifetime: 'Життєва'
};

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Початківець',
  2: 'Учень',
  3: 'Практик',
  4: 'Досягач',
  5: 'Майстер',
  6: 'Експерт',
  7: 'Мудрець',
  8: 'Легенда',
  9: 'Титан',
  10: 'Трансцендент'
};

export const LEVEL_POINTS: Record<number, number> = {
  1: 0,
  2: 1000,
  3: 5000,
  4: 15000,
  5: 50000,
  6: 100000,
  7: 250000,
  8: 500000,
  9: 1000000,
  10: 5000000
};
