import React from 'react';
import { format, subDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LIFE_AREA_LABELS } from '../types';

export const Analytics: React.FC = () => {
  const { habits, tasks, goals, dailyLogs, journalEntries, user } = useStore();

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));
  const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(today, 29 - i), 'yyyy-MM-dd'));

  // Habits stats
  const habitCompletionsByDay = last7Days.map(date => {
    const completed = habits.filter(h => h.completionHistory[date]).length;
    return { date, completed, total: habits.length };
  });

  const avgHabitCompletion = habits.length > 0
    ? Math.round(
        (last30Days.reduce((sum, date) => 
          sum + habits.filter(h => h.completionHistory[date]).length, 0
        ) / (30 * habits.length)) * 100
      )
    : 0;

  // Tasks stats
  const completedTasksLast7Days = tasks.filter(t => 
    t.completed && t.completedAt && last7Days.includes(t.completedAt.split('T')[0])
  ).length;

  const tasksByPriority = {
    A: tasks.filter(t => t.priority === 'A').length,
    B: tasks.filter(t => t.priority === 'B').length,
    C: tasks.filter(t => t.priority === 'C').length,
    D: tasks.filter(t => t.priority === 'D').length,
    E: tasks.filter(t => t.priority === 'E').length,
  };

  // Goals stats
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const avgGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  const goalsByArea = Object.keys(LIFE_AREA_LABELS).map(area => ({
    area,
    label: LIFE_AREA_LABELS[area as keyof typeof LIFE_AREA_LABELS],
    count: goals.filter(g => g.lifeArea === area).length,
    avgProgress: Math.round(
      goals.filter(g => g.lifeArea === area && g.status === 'active')
        .reduce((sum, g) => sum + g.progress, 0) /
      (goals.filter(g => g.lifeArea === area && g.status === 'active').length || 1)
    ),
  }));

  // Streaks
  const maxStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const currentMaxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
  const totalHabitCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

  // Journal stats
  const journalEntriesLast30 = journalEntries.filter(e => 
    last30Days.includes(e.date)
  ).length;

  // Reading stats (from daily logs)
  const totalPagesRead = dailyLogs.reduce((sum, log) => sum + (log.readingPages || 0), 0);
  const totalDeepWorkHours = dailyLogs.reduce((sum, log) => sum + (log.deepWorkHours || 0), 0);

  // Morning routine completion
  const morningRoutineCompletions = dailyLogs.filter(log => {
    const saversCompleted = [
      log.silenceCompleted,
      log.affirmationsCompleted,
      log.visualizationCompleted,
      log.exerciseCompleted,
      log.readingCompleted,
      log.scribingCompleted,
    ].filter(Boolean).length;
    return saversCompleted >= 4;
  }).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Аналітика</h1>
        <p className="text-gray-500 mt-1">
          Відстежуйте свій прогрес та знаходьте паттерни
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentMaxStreak}</p>
                <p className="text-sm text-gray-500">Поточний streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHabitCompletions}</p>
                <p className="text-sm text-gray-500">Звичок виконано</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-sm text-gray-500">Цілей досягнуто</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user?.totalPoints?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-500">Всього XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habits Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Звички за тиждень</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 gap-2">
              {habitCompletionsByDay.map(({ date, completed, total }) => {
                const height = total > 0 ? (completed / total) * 100 : 0;
                return (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '120px' }}>
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(date), 'EEE', { locale: uk })}
                    </p>
                    <p className="text-xs font-medium">{completed}/{total}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">Середній показник за 30 днів:</span>
              <span className="font-semibold text-green-600">{avgHabitCompletion}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Goals by Life Area */}
        <Card>
          <CardHeader>
            <CardTitle>Цілі за сферами життя</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goalsByArea.filter(g => g.count > 0).map(({ area, label, count, avgProgress }) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-gray-700 truncate">
                    {label}
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium">{avgProgress}%</span>
                    <span className="text-xs text-gray-500 ml-1">({count})</span>
                  </div>
                </div>
              ))}
              {goalsByArea.every(g => g.count === 0) && (
                <p className="text-center text-gray-500 py-4">Ще немає цілей</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Завдання за пріоритетом (ABCDE)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 text-center">
              {Object.entries(tasksByPriority).map(([priority, count]) => {
                const colors = {
                  A: 'bg-red-100 text-red-700',
                  B: 'bg-yellow-100 text-yellow-700',
                  C: 'bg-blue-100 text-blue-700',
                  D: 'bg-gray-100 text-gray-700',
                  E: 'bg-gray-50 text-gray-500',
                };
                return (
                  <div key={priority} className={`p-4 rounded-xl ${colors[priority as keyof typeof colors]}`}>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm font-medium">{priority}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Виконано за 7 днів: <span className="font-semibold text-green-600">{completedTasksLast7Days}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Активність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 rounded-xl text-center">
                <BookOpen className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalPagesRead}</p>
                <p className="text-sm text-gray-500">Сторінок прочитано</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalDeepWorkHours.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Годин Deep Work</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{journalEntriesLast30}</p>
                <p className="text-sm text-gray-500">Записів за 30 днів</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{morningRoutineCompletions}</p>
                <p className="text-sm text-gray-500">Ранкових рутин</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streaks & Records */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Рекорди та досягнення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl text-white text-center">
                <Flame className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{maxStreak}</p>
                <p className="text-sm opacity-90">Найдовший streak</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl text-white text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{completedGoals.length}</p>
                <p className="text-sm opacity-90">Цілей досягнуто</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl text-white text-center">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{avgGoalProgress}%</p>
                <p className="text-sm opacity-90">Середній прогрес</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl text-white text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">{user?.level || 1}</p>
                <p className="text-sm opacity-90">Поточний рівень</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
