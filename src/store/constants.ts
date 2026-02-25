import type { Achievement } from '../types';

export const POINTS = {
  completeHabit: 10,
  completeTask: 5,
  completeFrog: 30,
  completeMorningRoutine: 50,
  journalEntry: 15,
  weeklyReview: 100,
  deepWorkHour: 20,
  readPage: 1,
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
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
