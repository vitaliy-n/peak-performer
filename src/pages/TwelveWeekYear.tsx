import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Trophy,
  AlertCircle
} from 'lucide-react';
import { format, isWithinInterval, parseISO, differenceInDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import type { WeeklyPlan, TwelveWeekYear, Task } from '../types';

export const TwelveWeekYearPage: React.FC = () => {
  const { 
    twelveWeekYears, 
    activeTwelveWeekYearId, 
    createTwelveWeekYear, 
    updateWeeklyPlan, 
    goals,
    tasks,
    addTask,
    toggleTaskCompletion,
  } = useStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newYearForm, setNewYearForm] = useState({ title: '', startDate: '', selectedGoals: [] as string[] });
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [newTacticTitle, setNewTacticTitle] = useState('');

  const activeYear = useMemo(() => 
    twelveWeekYears.find((y: TwelveWeekYear) => y.id === activeTwelveWeekYearId) || twelveWeekYears.find((y: TwelveWeekYear) => y.status === 'active'),
    [twelveWeekYears, activeTwelveWeekYearId]
  );

  // Set initial selected week to current week or first week
  React.useEffect(() => {
    if (activeYear && !selectedWeekId) {
      const today = new Date();
      const currentWeek = activeYear.weeks.find((w: WeeklyPlan) => 
        isWithinInterval(today, { start: parseISO(w.startDate), end: parseISO(w.endDate) })
      );
      setSelectedWeekId(currentWeek?.id || activeYear.weeks[0]?.id);
    }
  }, [activeYear, selectedWeekId]);

  const selectedWeek = activeYear?.weeks.find((w: WeeklyPlan) => w.id === selectedWeekId);

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearForm.title || !newYearForm.startDate) return;
    createTwelveWeekYear(newYearForm.title, newYearForm.startDate, newYearForm.selectedGoals);
    setShowCreateModal(false);
    setNewYearForm({ title: '', startDate: '', selectedGoals: [] });
  };

  const handleAddTactic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTacticTitle.trim() || !selectedWeek || !activeYear) return;

    const newTaskId = uuidv4();
    
    // Create task with reference to 12WY context (optional, but good for organization)
    addTask({
      id: newTaskId,
      userId: 'user', // Store handles actual user ID or it's ignored if hardcoded in slice
      title: newTacticTitle,
      description: `Тактика для тижня ${selectedWeek.weekNumber} (${activeYear.title})`,
      priority: 'A',
      context: '@12weekyear',
      estimatedTime: 30,
      dueDate: selectedWeek.endDate, // Due by end of week
      isFrog: false,
      projectId: null,
    });

    // Add task ID to weekly plan tactics
    const newTactics = [...selectedWeek.tactics, newTaskId];
    updateWeeklyPlan(activeYear.id, selectedWeek.id, { tactics: newTactics });
    
    setNewTacticTitle('');
  };

  const calculateScore = (week: WeeklyPlan) => {
    if (week.tactics.length === 0) return 0;
    const completed = tasks.filter((t: Task) => week.tactics.includes(t.id) && t.completed).length;
    return Math.round((completed / week.tactics.length) * 100);
  };

  // Calculate overall progress
  const yearProgress = activeYear ? differenceInDays(new Date(), parseISO(activeYear.startDate)) / (12 * 7) * 100 : 0;
  const clampedProgress = Math.min(100, Math.max(0, yearProgress));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">12-Тижневий Рік</h1>
          <p className="text-gray-500 mt-1">
            Досягніть більше за 12 тижнів, ніж інші за 12 місяців
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" /> Новий 12-тижневий рік
        </Button>
      </div>

      {!activeYear ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Немає активного плану
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Створіть свій перший 12-тижневий план, щоб сфокусуватися на найважливішому.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Створити план
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Dashboard Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardContent className="py-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{activeYear.title}</h2>
                    <p className="text-indigo-100">
                      {format(parseISO(activeYear.startDate), 'd MMM')} — {format(parseISO(activeYear.endDate), 'd MMM yyyy', { locale: uk })}
                    </p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Прогрес часу</span>
                    <span>{Math.round(clampedProgress)}%</span>
                  </div>
                  <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/90 rounded-full transition-all duration-500"
                      style={{ width: `${clampedProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Поточний тиждень</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {selectedWeek?.weekNumber || 1} <span className="text-lg text-gray-400 font-normal">/ 13</span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {selectedWeek ? calculateScore(selectedWeek) : 0}% виконання
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weeks Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {activeYear.weeks.map(week => {
              const isCurrent = isWithinInterval(new Date(), { start: parseISO(week.startDate), end: parseISO(week.endDate) });
              const isSelected = selectedWeekId === week.id;
              const score = calculateScore(week);
              
              return (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                      : isCurrent
                        ? 'bg-white dark:bg-gray-800 border-2 border-indigo-500 text-indigo-600'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-xs font-medium opacity-70">Тиж {week.weekNumber}</span>
                  <span className={`text-lg font-bold ${!isSelected && score >= 85 ? 'text-green-500' : ''}`}>
                    {score}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Weekly Plan Content */}
          {selectedWeek && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tactics / Tasks */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Тактики на тиждень {selectedWeek.weekNumber}</span>
                      <span className="text-sm font-normal text-gray-500">
                        {format(parseISO(selectedWeek.startDate), 'd MMM')} — {format(parseISO(selectedWeek.endDate), 'd MMM')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add Tactic */}
                      <form onSubmit={handleAddTactic} className="flex gap-2">
                        <Input 
                          value={newTacticTitle}
                          onChange={e => setNewTacticTitle(e.target.value)}
                          placeholder="Нова тактика (завдання)..."
                          className="flex-1"
                        />
                        <Button type="submit">Додати</Button>
                      </form>

                      {/* Tactics List */}
                      <div className="space-y-2">
                        {selectedWeek.tactics.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Немає тактик на цей тиждень. Додайте завдання!</p>
                        ) : (
                          tasks
                            .filter(t => selectedWeek.tactics.includes(t.id))
                            .map(task => (
                              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                                <button 
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className="text-gray-400 hover:text-green-500 transition-colors"
                                >
                                  {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                                </button>
                                <span className={`flex-1 font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                                  {task.title}
                                </span>
                                <button
                                  onClick={() => {
                                    // Remove from this week
                                    const newTactics = selectedWeek.tactics.filter(id => id !== task.id);
                                    updateWeeklyPlan(activeYear.id, selectedWeek.id, { tactics: newTactics });
                                  }} 
                                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded"
                                >
                                  <ChevronRight className="w-4 h-4 rotate-45" /> {/* Using rotate for X */}
                                </button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes/Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Огляд тижня</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Які перемоги? Що пішло не так? Чому я навчився?"
                      value={selectedWeek.notes}
                      onChange={(e) => updateWeeklyPlan(activeYear.id, selectedWeek.id, { notes: e.target.value })}
                      className="min-h-[120px]"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Goals Reference */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Цілі на 12 тижнів</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeYear.goals.map(goalId => {
                        const goal = goals.find(g => g.id === goalId);
                        if (!goal) return null;
                        return (
                          <div key={goal.id} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                            <p className="font-semibold text-sm mb-1">{goal.title}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{Math.round(goal.progress)}%</span>
                              <span>{goal.currentValue} / {goal.targetValue}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 font-semibold">
                    <AlertCircle className="w-5 h-5" />
                    <span>Фокус</span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    "Не намагайтеся зробити все. Виберіть 1-3 ключові цілі і бийте в одну точку."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Створити 12-тижневий рік">
        <form onSubmit={handleCreateYear} className="space-y-4">
          <Input 
            label="Назва періоду" 
            value={newYearForm.title} 
            onChange={e => setNewYearForm({ ...newYearForm, title: e.target.value })} 
            placeholder="Q1 2024: Прорив..." 
            required 
          />
          <Input 
            label="Дата початку" 
            type="date"
            value={newYearForm.startDate} 
            onChange={e => setNewYearForm({ ...newYearForm, startDate: e.target.value })} 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Оберіть цілі (макс 3)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
              {goals.filter(g => g.status === 'active').map(goal => (
                <label key={goal.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={newYearForm.selectedGoals.includes(goal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (newYearForm.selectedGoals.length < 3) {
                          setNewYearForm({ ...newYearForm, selectedGoals: [...newYearForm.selectedGoals, goal.id] });
                        }
                      } else {
                        setNewYearForm({ ...newYearForm, selectedGoals: newYearForm.selectedGoals.filter(id => id !== goal.id) });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm truncate">{goal.title}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Скасувати</Button>
            <Button type="submit">Створити план</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
