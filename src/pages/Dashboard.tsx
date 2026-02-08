import React from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  Zap, 
  Target, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Clock,
  TrendingUp,
  Quote,
  ChevronRight,
  Timer,
  Moon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { CircularProgress } from '../components/ui/Progress';

const QUOTES = [
  { text: "Почни день з найважчого завдання", author: "Браян Трейсі", book: "Eat That Frog" },
  { text: "1% краще щодня = 37x за рік", author: "Джеймс Клір", book: "Atomic Habits" },
  { text: "Перша година визначає день", author: "Хел Елрод", book: "Miracle Morning" },
  { text: "Thoughts become things", author: "Наполеон Хілл", book: "Think and Grow Rich" },
  { text: "Begin with the end in mind", author: "Стівен Кові", book: "7 Habits" },
  { text: "What is the ONE Thing?", author: "Гері Келлер", book: "The ONE Thing" },
  { text: "Deep work is valuable, rare, and meaningful", author: "Кел Ньюпорт", book: "Deep Work" },
];

export const Dashboard: React.FC = () => {
  const { user, habits, tasks, goals, getTodayLog, setCurrentView } = useStore();
  const todayLog = getTodayLog();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayQuote = QUOTES[new Date().getDate() % QUOTES.length];

  const completedHabitsToday = habits.filter(h => h.completionHistory[today]).length;
  const totalHabits = habits.length;
  const habitsProgress = totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0;

  const todayTasks = tasks.filter(t => !t.completed);
  const completedTasksToday = tasks.filter(t => t.completed && t.completedAt?.startsWith(today)).length;
  const frogTask = tasks.find(t => t.isFrog && !t.completed);

  const activeGoals = goals.filter(g => g.status === 'active');
  const avgGoalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length 
    : 0;

  const saversCompleted = [
    todayLog?.silenceCompleted,
    todayLog?.affirmationsCompleted,
    todayLog?.visualizationCompleted,
    todayLog?.exerciseCompleted,
    todayLog?.readingCompleted,
    todayLog?.scribingCompleted,
  ].filter(Boolean).length;

  const currentStreak = Math.max(...habits.map(h => h.currentStreak), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Доброго дня, {user?.name || 'Досягач'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy", { locale: uk })}
        </p>
      </div>

      {/* Quote of the Day */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 opacity-50 flex-shrink-0" />
            <div>
              <p className="text-xl font-medium mb-2">"{todayQuote.text}"</p>
              <p className="text-blue-100">
                — {todayQuote.author}, {todayQuote.book}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Daily Streak */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Поточний streak</p>
                <p className="text-3xl font-bold text-gray-900">{currentStreak}</p>
                <p className="text-sm text-gray-500">днів</p>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Progress */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Звички сьогодні</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedHabitsToday}/{totalHabits}
                </p>
                <p className="text-sm text-gray-500">виконано</p>
              </div>
              <CircularProgress value={habitsProgress} color="#10B981" />
            </div>
          </CardContent>
        </Card>

        {/* Tasks Progress */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Завдання</p>
                <p className="text-3xl font-bold text-gray-900">{completedTasksToday}</p>
                <p className="text-sm text-gray-500">виконано сьогодні</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Цілі</p>
                <p className="text-3xl font-bold text-gray-900">{activeGoals.length}</p>
                <p className="text-sm text-gray-500">активних</p>
              </div>
              <CircularProgress value={avgGoalProgress} color="#8B5CF6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frog of the Day */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🐸</span> Жаба дня
            </CardTitle>
            <button 
              onClick={() => setCurrentView('tasks')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Всі завдання <ChevronRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            {frogTask ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{frogTask.title}</p>
                    {frogTask.description && (
                      <p className="text-sm text-gray-500 mt-1">{frogTask.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {frogTask.estimatedTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {frogTask.estimatedTime} хв
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                        Пріоритет {frogTask.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Жаба дня ще не визначена</p>
                <button 
                  onClick={() => setCurrentView('tasks')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Визначити жабу →
                </button>
              </div>
            )}

            {/* Other priority tasks */}
            {todayTasks.filter(t => !t.isFrog).slice(0, 3).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">Інші важливі завдання:</p>
                <div className="space-y-2">
                  {todayTasks.filter(t => !t.isFrog).slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                      <span className="text-gray-700">{task.title}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Morning Routine Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">☀️</span> SAVERS
            </CardTitle>
            <button 
              onClick={() => setCurrentView('morning')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Почати
            </button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <CircularProgress 
                value={saversCompleted} 
                max={6} 
                size={100} 
                color="#F59E0B" 
              />
            </div>
            <div className="space-y-2">
              {[
                { key: 'silence', label: 'Тиша', emoji: '🧘', done: todayLog?.silenceCompleted },
                { key: 'affirmations', label: 'Афірмації', emoji: '💬', done: todayLog?.affirmationsCompleted },
                { key: 'visualization', label: 'Візуалізація', emoji: '🎯', done: todayLog?.visualizationCompleted },
                { key: 'exercise', label: 'Вправи', emoji: '💪', done: todayLog?.exerciseCompleted },
                { key: 'reading', label: 'Читання', emoji: '📚', done: todayLog?.readingCompleted },
                { key: 'scribing', label: 'Журнал', emoji: '✍️', done: todayLog?.scribingCompleted },
              ].map(item => (
                <div 
                  key={item.key}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    item.done ? 'bg-green-50 text-green-700' : 'text-gray-600'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className={item.done ? 'line-through' : ''}>{item.label}</span>
                  {item.done && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Score */}
      {todayLog && (todayLog.productivityScore > 0 || todayLog.energyScore > 0 || todayLog.moodScore > 0) && (
        <Card className="mt-6 mb-6">
          <CardHeader>
            <CardTitle>Оцінка дня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Продуктивність', value: todayLog.productivityScore, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'Енергія', value: todayLog.energyScore, color: 'text-green-600', bg: 'bg-green-100' },
                { label: 'Настрій', value: todayLog.moodScore, color: 'text-amber-600', bg: 'bg-amber-100' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Швидкі дії</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setCurrentView('morning')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Ранкова рутина</span>
          </button>
          
          <button
            onClick={() => setCurrentView('habits')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Відмітити звичку</span>
          </button>
          
          <button
            onClick={() => setCurrentView('goals')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Переглянути цілі</span>
          </button>
          
          <button
            onClick={() => setCurrentView('pomodoro')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Timer className="w-6 h-6 text-red-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Помодоро</span>
          </button>
          
          <button
            onClick={() => setCurrentView('journal')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Написати в журнал</span>
          </button>

          <button
            onClick={() => setCurrentView('journal')}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Moon className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm">Вечірній огляд</span>
          </button>
        </div>
      </div>
    </div>
  );
};
