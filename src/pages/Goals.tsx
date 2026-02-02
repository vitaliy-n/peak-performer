import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import { Progress } from '../components/ui/Progress';
import type { Goal, LifeArea, GoalTimeframe, Priority } from '../types';
import { LIFE_AREA_LABELS, TIMEFRAME_LABELS, PRIORITY_LABELS } from '../types';

const LIFE_AREA_COLORS: Record<LifeArea, string> = {
  career: '#3B82F6',
  financial: '#10B981',
  health: '#EF4444',
  relationships: '#EC4899',
  personal_growth: '#8B5CF6',
  spiritual: '#F59E0B',
  fun_recreation: '#06B6D4',
  physical_environment: '#84CC16',
};

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<LifeArea | 'all'>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<GoalTimeframe | 'all'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    why: '',
    lifeArea: 'personal_growth' as LifeArea,
    timeframe: 'yearly' as GoalTimeframe,
    priority: 'A' as Priority,
    specific: '',
    measurable: '',
    targetValue: 100,
    currentValue: 0,
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      updateGoal(editingGoal.id, {
        ...formData,
        targetDate: formData.targetDate || null,
        progress: (formData.currentValue / formData.targetValue) * 100,
      });
    } else {
      addGoal({
        userId: user?.id || '',
        title: formData.title,
        description: formData.description,
        why: formData.why,
        lifeArea: formData.lifeArea,
        timeframe: formData.timeframe,
        priority: formData.priority,
        specific: formData.specific,
        measurable: formData.measurable,
        targetValue: formData.targetValue,
        currentValue: formData.currentValue,
        startDate: new Date().toISOString(),
        targetDate: formData.targetDate || null,
        parentGoalId: null,
        subGoals: [],
        actionSteps: [],
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      why: '',
      lifeArea: 'personal_growth',
      timeframe: 'yearly',
      priority: 'A',
      specific: '',
      measurable: '',
      targetValue: 100,
      currentValue: 0,
      targetDate: '',
    });
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      why: goal.why,
      lifeArea: goal.lifeArea,
      timeframe: goal.timeframe,
      priority: goal.priority,
      specific: goal.specific,
      measurable: goal.measurable,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      targetDate: goal.targetDate || '',
    });
    setIsModalOpen(true);
    setShowMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю ціль?')) {
      deleteGoal(id);
    }
    setShowMenu(null);
  };

  const handleComplete = (goal: Goal) => {
    updateGoal(goal.id, { 
      status: 'completed', 
      currentValue: goal.targetValue,
      progress: 100 
    });
    setShowMenu(null);
  };

  const filteredGoals = goals.filter(g => {
    if (filterArea !== 'all' && g.lifeArea !== filterArea) return false;
    if (filterTimeframe !== 'all' && g.timeframe !== filterTimeframe) return false;
    return true;
  });

  const activeGoals = filteredGoals.filter(g => g.status === 'active');
  const completedGoals = filteredGoals.filter(g => g.status === 'completed');

  const lifeAreaStats = Object.keys(LIFE_AREA_LABELS).map(area => ({
    area: area as LifeArea,
    count: goals.filter(g => g.lifeArea === area && g.status === 'active').length,
    avgProgress: goals
      .filter(g => g.lifeArea === area && g.status === 'active')
      .reduce((sum, g) => sum + g.progress, 0) / 
      (goals.filter(g => g.lifeArea === area && g.status === 'active').length || 1),
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Цілі</h1>
          <p className="text-gray-500 mt-1">
            "What is the ONE Thing?" - Gary Keller
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Нова ціль
        </Button>
      </div>

      {/* Life Wheel Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Колесо життя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {lifeAreaStats.map(({ area, count, avgProgress }) => (
              <button
                key={area}
                onClick={() => setFilterArea(filterArea === area ? 'all' : area)}
                className={`p-3 rounded-xl text-center transition-all ${
                  filterArea === area 
                    ? 'ring-2 ring-offset-2' 
                    : 'hover:bg-gray-50'
                }`}
                style={{ 
                  backgroundColor: filterArea === area ? `${LIFE_AREA_COLORS[area]}20` : undefined,
                  ['--tw-ring-color' as string]: LIFE_AREA_COLORS[area] 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: LIFE_AREA_COLORS[area] }}
                >
                  {Math.round(avgProgress)}%
                </div>
                <p className="text-xs font-medium text-gray-700 truncate">
                  {LIFE_AREA_LABELS[area]}
                </p>
                <p className="text-xs text-gray-500">{count} цілей</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterTimeframe}
          onChange={e => setFilterTimeframe(e.target.value as GoalTimeframe | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Всі терміни</option>
          {Object.entries(TIMEFRAME_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {filterArea !== 'all' && (
          <button
            onClick={() => setFilterArea('all')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Скинути фільтр: {LIFE_AREA_LABELS[filterArea]}
          </button>
        )}
      </div>

      {/* Active Goals */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Активні цілі ({activeGoals.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGoals.map(goal => (
            <Card key={goal.id} className="relative">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Area indicator */}
                  <div 
                    className="w-2 h-full absolute left-0 top-0 rounded-l-xl"
                    style={{ backgroundColor: LIFE_AREA_COLORS[goal.lifeArea] }}
                  />

                  <div className="flex-1 pl-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span 
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
                          style={{ 
                            backgroundColor: `${LIFE_AREA_COLORS[goal.lifeArea]}20`,
                            color: LIFE_AREA_COLORS[goal.lifeArea]
                          }}
                        >
                          {LIFE_AREA_LABELS[goal.lifeArea]}
                        </span>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setShowMenu(showMenu === goal.id ? null : goal.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {showMenu === goal.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                            <button
                              onClick={() => openEditModal(goal)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" /> Редагувати
                            </button>
                            <button
                              onClick={() => handleComplete(goal)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-green-600 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Завершити
                            </button>
                            <button
                              onClick={() => handleDelete(goal.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Видалити
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {goal.why && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Чому:</span> {goal.why}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Прогрес</span>
                        <span className="font-medium">{Math.round(goal.progress)}%</span>
                      </div>
                      <Progress value={goal.progress} color="blue" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{goal.currentValue} / {goal.targetValue}</span>
                        {goal.targetDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(goal.targetDate), 'dd.MM.yyyy')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {TIMEFRAME_LABELS[goal.timeframe]}
                      </span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">
                        Пріоритет {goal.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Update progress button */}
                <button
                  onClick={() => openEditModal(goal)}
                  className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Оновити прогрес
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeGoals.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">У вас ще немає активних цілей</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Створити першу ціль
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Досягнуті цілі ({completedGoals.length}) 🎉
          </h2>
          <div className="space-y-2">
            {completedGoals.map(goal => (
              <div 
                key={goal.id}
                className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{goal.title}</p>
                  <p className="text-sm text-gray-500">{LIFE_AREA_LABELS[goal.lifeArea]}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingGoal ? 'Редагувати ціль' : 'Нова ціль (SMART)'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <Input
            label="Назва цілі"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Чого ви хочете досягти?"
            required
          />

          {/* Why (RPM) */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              🎯 Чому це важливо? (Tony Robbins RPM)
            </label>
            <Textarea
              value={formData.why}
              onChange={e => setFormData({ ...formData, why: e.target.value })}
              placeholder="Глибока причина, яка мотивуватиме вас..."
              rows={2}
            />
          </div>

          {/* SMART Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="S - Specific (Конкретно)"
              value={formData.specific}
              onChange={e => setFormData({ ...formData, specific: e.target.value })}
              placeholder="Що саме?"
            />
            <Input
              label="M - Measurable (Вимірювано)"
              value={formData.measurable}
              onChange={e => setFormData({ ...formData, measurable: e.target.value })}
              placeholder="Як виміряти?"
            />
          </div>

          {/* Progress tracking */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Поточне значення"
              type="number"
              value={formData.currentValue}
              onChange={e => setFormData({ ...formData, currentValue: Number(e.target.value) })}
            />
            <Input
              label="Цільове значення"
              type="number"
              value={formData.targetValue}
              onChange={e => setFormData({ ...formData, targetValue: Number(e.target.value) })}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сфера життя
              </label>
              <select
                value={formData.lifeArea}
                onChange={e => setFormData({ ...formData, lifeArea: e.target.value as LifeArea })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(LIFE_AREA_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Термін
              </label>
              <select
                value={formData.timeframe}
                onChange={e => setFormData({ ...formData, timeframe: e.target.value as GoalTimeframe })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(TIMEFRAME_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пріоритет (ABCDE)
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Date */}
          <Input
            label="T - Time-bound (Дедлайн)"
            type="date"
            value={formData.targetDate}
            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
          />

          {/* Description */}
          <Textarea
            label="Опис"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Детальний опис цілі..."
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={resetForm}>
              Скасувати
            </Button>
            <Button type="submit">
              {editingGoal ? 'Зберегти' : 'Створити'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
