import React from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart3,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LIFE_AREA_LABELS } from '../types';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

export const Analytics: React.FC = () => {
  const { habits, tasks, goals, dailyLogs, journalEntries, user } = useStore();

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));
  const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(today, 29 - i), 'yyyy-MM-dd'));

  // --- Habits Stats (Bar Chart) ---
  const habitData = last7Days.map(date => {
    const completed = habits.filter(h => h.completionHistory[date]).length;
    return {
      date: format(parseISO(date), 'EEE', { locale: uk }),
      completed,
      total: habits.length
    };
  });

  // --- Productivity/Energy/Mood (Line Chart) ---
  const dailyLogData = last7Days.map(date => {
    const log = dailyLogs.find(l => l.date === date);
    return {
      date: format(parseISO(date), 'EEE', { locale: uk }),
      productivity: log?.productivityScore || 0,
      energy: log?.energyScore || 0,
      mood: log?.moodScore || 0,
    };
  });

  const avgHabitCompletion = habits.length > 0
    ? Math.round(
        (last30Days.reduce((sum, date) => 
          sum + habits.filter(h => h.completionHistory[date]).length, 0
        ) / (30 * habits.length)) * 100
      )
    : 0;

  // --- Tasks Stats (Pie Chart) ---
  const tasksByPriority = [
    { name: 'A (Обов\'язково)', value: tasks.filter(t => t.priority === 'A').length },
    { name: 'B (Бажано)', value: tasks.filter(t => t.priority === 'B').length },
    { name: 'C (Можна)', value: tasks.filter(t => t.priority === 'C').length },
    { name: 'D (Делегувати)', value: tasks.filter(t => t.priority === 'D').length },
    { name: 'E (Видалити)', value: tasks.filter(t => t.priority === 'E').length },
  ].filter(item => item.value > 0);

  // --- Goals Stats (Radar Chart) ---
  const completedGoals = goals.filter(g => g.status === 'completed');

  const goalsRadarData = Object.keys(LIFE_AREA_LABELS).map(area => {
    const areaGoals = goals.filter(g => g.lifeArea === area && g.status === 'active');
    const avgProgress = areaGoals.length > 0
      ? Math.round(areaGoals.reduce((sum, g) => sum + g.progress, 0) / areaGoals.length)
      : 0;
    
    return {
      subject: LIFE_AREA_LABELS[area as keyof typeof LIFE_AREA_LABELS],
      A: avgProgress,
      fullMark: 100,
    };
  });

  // Streaks
  const currentMaxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
  const totalHabitCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

  // Journal & Reading
  const journalEntriesLast30 = journalEntries.filter(e => last30Days.includes(e.date)).length;
  const totalPagesRead = dailyLogs.reduce((sum, log) => sum + (log.readingPages || 0), 0);
  const totalDeepWorkHours = dailyLogs.reduce((sum, log) => sum + (log.deepWorkHours || 0), 0);

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Аналітика</h1>
        <p className="text-gray-500 mt-1">
          Відстежуйте свій прогрес та знаходьте патерни
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentMaxStreak}</p>
                <p className="text-sm text-gray-500">Поточний streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalHabitCompletions}</p>
                <p className="text-sm text-gray-500">Звичок виконано</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedGoals.length}</p>
                <p className="text-sm text-gray-500">Цілей досягнуто</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.totalPoints?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-500">Всього XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Habits Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Звички за тиждень</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">Середній показник за 30 днів:</span>
              <span className="font-semibold text-green-600">{avgHabitCompletion}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Productivity Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Тренди продуктивності</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyLogData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="productivity" name="Продуктивність" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="energy" name="Енергія" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="mood" name="Настрій" stroke="#EC4899" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Goals Radar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Баланс цілей (Колесо життя)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={goalsRadarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Progress" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Priority Pie */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Пріоритети завдань</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tasksByPriority.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>_
        </Card>

        {/* Activity Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Активність (30 днів)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Прочитано сторінок</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalPagesRead}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Годин Deep Work</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalDeepWorkHours.toFixed(1)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Записів журналу</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{journalEntriesLast30}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ранкових рутин</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{morningRoutineCompletions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
