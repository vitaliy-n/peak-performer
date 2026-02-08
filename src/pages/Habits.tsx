import React, { useState } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  Plus, 
  Flame, 
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit,
  TrendingUp,
  Repeat
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import type { Habit } from '../types';

const HABIT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16'
];

const HABIT_ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎯', '💰'];

export const Habits: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    identity: '',
    cue: '',
    craving: '',
    response: '',
    reward: '',
    color: HABIT_COLORS[0],
    icon: HABIT_ICONS[0],
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit({
        userId: user?.id || '',
        title: formData.title,
        description: formData.description,
        cue: formData.cue,
        craving: formData.craving,
        response: formData.response,
        reward: formData.reward,
        identity: formData.identity,
        frequency: 'daily',
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        reminderTime: null,
        afterHabit: null,
        color: formData.color,
        icon: formData.icon,
      });
    }

    setIsModalOpen(false);
    setEditingHabit(null);
    setFormData({
      title: '',
      description: '',
      identity: '',
      cue: '',
      craving: '',
      response: '',
      reward: '',
      color: HABIT_COLORS[0],
      icon: HABIT_ICONS[0],
    });
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      description: habit.description,
      identity: habit.identity,
      cue: habit.cue,
      craving: habit.craving,
      response: habit.response,
      reward: habit.reward,
      color: habit.color,
      icon: habit.icon,
    });
    setIsModalOpen(true);
    setShowMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю звичку?')) {
      deleteHabit(id);
    }
    setShowMenu(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Звички</h1>
          <p className="text-gray-500 mt-1">
            Atomic Habits: 1% краще щодня = 37x за рік
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Нова звичка
        </Button>
      </div>

      {/* Week Calendar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Цей тиждень</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Header */}
            <div className="font-medium text-gray-500 text-sm py-2">Звичка</div>
            {weekDays.map(day => (
              <div 
                key={day.toISOString()} 
                className={`text-center py-2 text-sm ${
                  format(day, 'yyyy-MM-dd') === today 
                    ? 'bg-blue-50 rounded-lg font-medium text-blue-600' 
                    : 'text-gray-500'
                }`}
              >
                <div>{format(day, 'EEE', { locale: uk })}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
            ))}

            {/* Habits rows */}
            {habits.map(habit => (
              <React.Fragment key={habit.id}>
                <div className="flex items-center gap-2 py-3 pr-2">
                  <span className="text-xl">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{habit.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {habit.currentStreak} днів
                    </div>
                  </div>
                </div>
                {weekDays.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isCompleted = habit.completionHistory[dateStr];
                  const isToday = dateStr === today;
                  const isPast = day < new Date() && !isToday;
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleHabitCompletion(habit.id, dateStr)}
                      disabled={!isToday && !isPast}
                      className={`flex items-center justify-center py-3 rounded-lg transition-colors ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : isToday 
                          ? 'bg-blue-50 hover:bg-blue-100' 
                          : isPast
                          ? 'bg-red-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 
                          className="w-6 h-6" 
                          style={{ color: habit.color }}
                        />
                      ) : (
                        <Circle 
                          className={`w-6 h-6 ${
                            isToday ? 'text-blue-300' : isPast ? 'text-red-300' : 'text-gray-300'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {habits.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Почніть будувати звички</h3>
              <p className="text-gray-500 mb-1 max-w-sm mx-auto">
                "Ви не піднімаєтесь до рівня своїх цілей — ви опускаєтесь до рівня своїх систем"
              </p>
              <p className="text-sm text-gray-400 mb-6">— Джеймс Клір, Atomic Habits</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Створити першу звичку
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const last30Days = Array.from({ length: 30 }, (_, i) => 
            format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
          );
          const completedLast30 = last30Days.filter(d => habit.completionHistory[d]).length;
          const completionRate = Math.round((completedLast30 / 30) * 100);

          return (
            <Card key={habit.id} className="relative">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${habit.color}20` }}
                  >
                    {habit.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setShowMenu(showMenu === habit.id ? null : habit.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {showMenu === habit.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                            <button
                              onClick={() => openEditModal(habit)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" /> Редагувати
                            </button>
                            <button
                              onClick={() => handleDelete(habit.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Видалити
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {habit.identity && (
                      <p className="text-sm text-gray-500 italic mt-1">"{habit.identity}"</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">{habit.currentStreak}</span>
                        <span className="text-xs text-gray-500">streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">{completionRate}%</span>
                        <span className="text-xs text-gray-500">за 30 днів</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{habit.totalCompletions}</span>
                        <span className="text-xs text-gray-500">всього</span>
                      </div>
                    </div>

                    {/* Mini heatmap */}
                    <div className="flex gap-0.5 mt-3">
                      {last30Days.slice(-14).map(date => (
                        <div
                          key={date}
                          className={`w-3 h-3 rounded-sm ${
                            habit.completionHistory[date]
                              ? 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                          title={date}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Today's action */}
                <button
                  onClick={() => toggleHabitCompletion(habit.id, today)}
                  className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
                    habit.completionHistory[today]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {habit.completionHistory[today] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 inline mr-2" />
                      Виконано сьогодні ✓
                    </>
                  ) : (
                    'Відмітити на сьогодні'
                  )}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        title={editingHabit ? 'Редагувати звичку' : 'Нова звичка'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Назва звички"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Наприклад: Читати 20 сторінок"
                required
              />
            </div>
            <div className="col-span-2">
              <Textarea
                label="Опис"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Детальний опис звички..."
                rows={2}
              />
            </div>
          </div>

          {/* Identity (Atomic Habits) */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              🎯 Ідентичність (Atomic Habits)
            </label>
            <Input
              value={formData.identity}
              onChange={e => setFormData({ ...formData, identity: e.target.value })}
              placeholder="Я є людиною, яка..."
            />
            <p className="text-xs text-purple-600 mt-1">
              Фокус на тому, ким ви хочете стати, а не на результаті
            </p>
          </div>

          {/* 4 Laws of Behavior Change */}
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-700">4 закони зміни поведінки</h4>
            
            <Input
              label="1. Тригер (Make it Obvious)"
              value={formData.cue}
              onChange={e => setFormData({ ...formData, cue: e.target.value })}
              placeholder="Після чого? Де? Коли?"
            />
            
            <Input
              label="2. Бажання (Make it Attractive)"
              value={formData.craving}
              onChange={e => setFormData({ ...formData, craving: e.target.value })}
              placeholder="Чому це привабливо?"
            />
            
            <Input
              label="3. Дія (Make it Easy)"
              value={formData.response}
              onChange={e => setFormData({ ...formData, response: e.target.value })}
              placeholder="2-хвилинна версія дії"
            />
            
            <Input
              label="4. Нагорода (Make it Satisfying)"
              value={formData.reward}
              onChange={e => setFormData({ ...formData, reward: e.target.value })}
              placeholder="Яка винагорода після?"
            />
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Іконка</label>
              <div className="flex flex-wrap gap-2">
                {HABIT_ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 text-xl rounded-lg border-2 ${
                      formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Колір</label>
              <div className="flex flex-wrap gap-2">
                {HABIT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Скасувати
            </Button>
            <Button type="submit">
              {editingHabit ? 'Зберегти' : 'Створити'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
