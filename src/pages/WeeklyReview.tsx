import React, { useState } from 'react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  ClipboardCheck, 
  Target, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Star,
  AlertTriangle,
  Lightbulb,
  Save
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea } from '../components/ui';
import { CircularProgress } from '../components/ui/Progress';

export const WeeklyReview: React.FC = () => {
  const { habits, tasks, goals, dailyLogs, journalEntries, addPoints, user } = useStore();
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), 'yyyy-MM-dd'));

  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [lessons, setLessons] = useState('');
  const [nextWeekPriorities, setNextWeekPriorities] = useState('');
  const [saved, setSaved] = useState(false);

  // Habits stats
  const totalHabitChecks = last7Days.reduce((sum, date) => 
    sum + habits.filter(h => h.completionHistory[date]).length, 0
  );
  const possibleHabitChecks = habits.length * 7;
  const habitCompletionRate = possibleHabitChecks > 0 
    ? Math.round((totalHabitChecks / possibleHabitChecks) * 100) 
    : 0;

  const bestHabit = habits.length > 0 
    ? habits.reduce((best, h) => {
        const count = last7Days.filter(d => h.completionHistory[d]).length;
        const bestCount = last7Days.filter(d => best.completionHistory[d]).length;
        return count > bestCount ? h : best;
      })
    : null;

  const worstHabit = habits.length > 0
    ? habits.reduce((worst, h) => {
        const count = last7Days.filter(d => h.completionHistory[d]).length;
        const worstCount = last7Days.filter(d => worst.completionHistory[d]).length;
        return count < worstCount ? h : worst;
      })
    : null;

  // Tasks stats
  const completedTasksThisWeek = tasks.filter(t => 
    t.completed && t.completedAt && last7Days.some(d => t.completedAt?.startsWith(d))
  ).length;

  const totalTasksCreated = tasks.filter(t => 
    last7Days.some(d => t.createdAt.startsWith(d))
  ).length;

  // Goals stats
  const activeGoals = goals.filter(g => g.status === 'active');
  const avgGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  // Morning routine stats
  const morningRoutineDays = last7Days.filter(date => {
    const log = dailyLogs.find(l => l.date === date);
    if (!log) return false;
    const completed = [
      log.silenceCompleted, log.affirmationsCompleted, log.visualizationCompleted,
      log.exerciseCompleted, log.readingCompleted, log.scribingCompleted
    ].filter(Boolean).length;
    return completed >= 4;
  }).length;

  // Journal stats
  const journalEntriesThisWeek = journalEntries.filter(e => 
    last7Days.includes(e.date)
  ).length;

  // Reading stats
  const pagesReadThisWeek = last7Days.reduce((sum, date) => {
    const log = dailyLogs.find(l => l.date === date);
    return sum + (log?.readingPages || 0);
  }, 0);

  // Deep work stats
  const deepWorkHoursThisWeek = last7Days.reduce((sum, date) => {
    const log = dailyLogs.find(l => l.date === date);
    return sum + (log?.deepWorkHours || 0);
  }, 0);

  const handleSaveReview = () => {
    addPoints(50);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Overall weekly score
  const scores = [
    habitCompletionRate,
    possibleHabitChecks > 0 ? Math.round((completedTasksThisWeek / Math.max(totalTasksCreated, 1)) * 100) : 0,
    Math.round((morningRoutineDays / 7) * 100),
    avgGoalProgress,
  ];
  const overallScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          Тижневий огляд
        </h1>
        <p className="text-gray-500 mt-1">
          {format(weekStart, 'd MMMM', { locale: uk })} — {format(weekEnd, 'd MMMM yyyy', { locale: uk })}
          {' '}| GTD + Covey: "Sharpen the Saw"
        </p>
      </div>

      {/* Overall Score */}
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="py-6">
          <div className="flex items-center gap-8">
            <CircularProgress 
              value={overallScore} 
              size={100} 
              strokeWidth={10} 
              color="#ffffff"
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                Загальна оцінка тижня: {overallScore}%
              </h2>
              <p className="text-blue-200">
                {overallScore >= 80 ? 'Чудовий тиждень! Ви на правильному шляху.' :
                 overallScore >= 60 ? 'Хороший тиждень. Є простір для покращення.' :
                 overallScore >= 40 ? 'Задовільний тиждень. Зосередьтеся на ключових звичках.' :
                 'Непростий тиждень. Не здавайтеся, наступний буде кращим!'}
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-4xl font-bold">{user?.totalPoints?.toLocaleString() || 0}</p>
              <p className="text-blue-200">Загальний XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{habitCompletionRate}%</p>
            <p className="text-sm text-gray-500">Звички</p>
            <p className="text-xs text-gray-400">{totalHabitChecks}/{possibleHabitChecks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedTasksThisWeek}</p>
            <p className="text-sm text-gray-500">Завдань виконано</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{avgGoalProgress}%</p>
            <p className="text-sm text-gray-500">Прогрес цілей</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{morningRoutineDays}/7</p>
            <p className="text-sm text-gray-500">Ранкових рутин</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Habits Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Звички за тиждень</CardTitle>
          </CardHeader>
          <CardContent>
            {habits.length > 0 ? (
              <div className="space-y-3">
                {habits.map(habit => {
                  const completedDays = last7Days.filter(d => habit.completionHistory[d]).length;
                  const rate = Math.round((completedDays / 7) * 100);
                  return (
                    <div key={habit.id} className="flex items-center gap-3">
                      <span className="text-xl">{habit.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{habit.title}</span>
                          <span className="text-gray-500">{completedDays}/7</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  {bestHabit && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-1 text-green-700 text-sm font-medium mb-1">
                        <TrendingUp className="w-4 h-4" /> Найкраща
                      </div>
                      <p className="text-sm text-gray-700">{bestHabit.icon} {bestHabit.title}</p>
                    </div>
                  )}
                  {worstHabit && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-1 text-red-700 text-sm font-medium mb-1">
                        <TrendingDown className="w-4 h-4" /> Потребує уваги
                      </div>
                      <p className="text-sm text-gray-700">{worstHabit.icon} {worstHabit.title}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Ще немає звичок</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Активність</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Записів у журналі</span>
                <span className="font-bold text-purple-600">{journalEntriesThisWeek}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm text-gray-700">Сторінок прочитано</span>
                <span className="font-bold text-amber-600">{pagesReadThisWeek}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Годин Deep Work</span>
                <span className="font-bold text-blue-600">{deepWorkHoursThisWeek.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Ранкових рутин SAVERS</span>
                <span className="font-bold text-green-600">{morningRoutineDays}/7</span>
              </div>
            </div>

            {/* Covey Quadrant hint */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Covey Quadrant II (Важливе, але не термінове):
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>- Планування та стратегія</li>
                <li>- Навчання та розвиток</li>
                <li>- Побудова стосунків</li>
                <li>- Здоров'я та відпочинок</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reflection Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Рефлексія тижня (GTD Weekly Review)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-green-500" />
              <label className="text-sm font-medium text-gray-700">Перемоги та досягнення</label>
            </div>
            <Textarea
              value={wins}
              onChange={e => setWins(e.target.value)}
              placeholder="Що вдалося цього тижня? За що ви себе хвалите?"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <label className="text-sm font-medium text-gray-700">Виклики та перешкоди</label>
            </div>
            <Textarea
              value={challenges}
              onChange={e => setChallenges(e.target.value)}
              placeholder="Що було складним? Які перешкоди виникли?"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              <label className="text-sm font-medium text-gray-700">Уроки та висновки</label>
            </div>
            <Textarea
              value={lessons}
              onChange={e => setLessons(e.target.value)}
              placeholder="Чому ви навчилися? Які інсайти отримали?"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <label className="text-sm font-medium text-gray-700">Пріоритети на наступний тиждень</label>
            </div>
            <Textarea
              value={nextWeekPriorities}
              onChange={e => setNextWeekPriorities(e.target.value)}
              placeholder="Які 3 найважливіші речі на наступний тиждень?"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-500">
              Збереження дає +50 XP
            </p>
            <Button onClick={handleSaveReview} disabled={saved}>
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Збережено!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Зберегти огляд
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GTD Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>GTD Weekly Review Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Очистити Inbox', desc: 'Обробіть всі вхідні елементи', icon: '📥' },
              { label: 'Переглянути списки дій', desc: 'Оновіть статуси та пріоритети', icon: '📋' },
              { label: 'Переглянути календар', desc: 'Минулий тиждень + наступні 2 тижні', icon: '📅' },
              { label: 'Переглянути "Waiting For"', desc: 'Статус делегованих завдань', icon: '⏳' },
              { label: 'Переглянути проєкти', desc: 'Визначте наступні кроки', icon: '📂' },
              { label: 'Переглянути цілі', desc: 'Оновіть прогрес та пріоритети', icon: '🎯' },
            ].map((item, i) => (
              <GTDCheckItem key={i} label={item.label} desc={item.desc} icon={item.icon} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const GTDCheckItem: React.FC<{ label: string; desc: string; icon: string }> = ({ label, desc, icon }) => {
  const [checked, setChecked] = useState(false);

  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
        checked 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <p className={`font-medium ${checked ? 'text-green-700 line-through' : 'text-gray-900'}`}>
          {label}
        </p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      {checked && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
    </button>
  );
};
