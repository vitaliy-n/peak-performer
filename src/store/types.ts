import type { UserSlice } from './slices/userSlice';
import type { AchievementSlice } from './slices/achievementSlice';
import type { GoalSlice } from './slices/goalSlice';
import type { HabitSlice } from './slices/habitSlice';
import type { TaskSlice } from './slices/taskSlice';
import type { ProjectSlice } from './slices/projectSlice';
import type { DailyLogSlice } from './slices/dailyLogSlice';
import type { JournalSlice } from './slices/journalSlice';
import type { ReadingSlice } from './slices/readingSlice';
import type { FinanceSlice } from './slices/financeSlice';
import type { InboxSlice } from './slices/inboxSlice';
import type { AICoachSlice } from './slices/aiCoachSlice';
import type { HealthSlice } from './slices/healthSlice';
import type { MindsetSlice } from './slices/mindsetSlice';
import type { LearningSlice } from './slices/learningSlice';
import type { TwelveWeekYearSlice } from './slices/twelveWeekYearSlice';

export type AppState = 
  & UserSlice 
  & AchievementSlice 
  & GoalSlice 
  & HabitSlice 
  & TaskSlice 
  & ProjectSlice 
  & DailyLogSlice 
  & JournalSlice 
  & ReadingSlice 
  & FinanceSlice
  & InboxSlice
  & AICoachSlice
  & HealthSlice
  & MindsetSlice
  & LearningSlice
  & TwelveWeekYearSlice
  & {
    loadSeedData: () => void;
    clearAllData: () => void;
  };
