import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical,
  Trash2,
  Edit,
  Star,
  Inbox,
  FolderKanban,
  AlertCircle,
  LayoutGrid,
  List,
  Zap,
  Battery,
  Coffee
} from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import type { Task, Priority, EnergyLevel } from '../types';
import { PRIORITY_LABELS } from '../types';

const CONTEXTS = ['@робота', '@дім', '@дзвінки', '@комп\'ютер', '@навчання', '@покупки'];

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion, setFrogOfDay, inbox, addToInbox, removeFromInbox, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [filterContext, setFilterContext] = useState<string>('all');
  const [newInboxItem, setNewInboxItem] = useState('');
  const [showInbox, setShowInbox] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'A' as Priority,
    context: '',
    energyLevel: 'medium' as EnergyLevel,
    estimatedTime: 30,
    dueDate: '',
  });

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask({
        userId: user?.id || '',
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        context: formData.context,
        energyLevel: formData.energyLevel,
        estimatedTime: formData.estimatedTime,
        dueDate: formData.dueDate || null,
        isFrog: false,
        projectId: null,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'A',
      context: '',
      energyLevel: 'medium',
      estimatedTime: 30,
      dueDate: '',
    });
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      context: task.context,
      energyLevel: task.energyLevel || 'medium',
      estimatedTime: task.estimatedTime,
      dueDate: task.dueDate || '',
    });
    setIsModalOpen(true);
    setShowMenu(null);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setShowMenu(null);
  };

  const handleAddToInbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInboxItem.trim()) {
      addToInbox(newInboxItem.trim());
      setNewInboxItem('');
    }
  };

  const processInboxItem = (index: number, item: string) => {
    setFormData({ ...formData, title: item });
    setIsModalOpen(true);
    removeFromInbox(index);
    setShowInbox(false);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed && t.completedAt?.startsWith(today));
  
  const frogTask = activeTasks.find(t => t.isFrog);
  const priorityATasks = activeTasks.filter(t => t.priority === 'A' && !t.isFrog);
  const otherTasks = activeTasks.filter(t => t.priority !== 'A' && !t.isFrog);

  const uniqueContexts = [...new Set(tasks.map(t => t.context).filter(Boolean))];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Завдання</h1>
          <p className="text-gray-500 mt-1">
            GTD + Eat That Frog: Почни з найважчого
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowInbox(true)}>
            <Inbox className="w-5 h-5 mr-2" />
            Inbox ({inbox.length})
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Нове завдання
          </Button>
        </div>
      </div>

      {/* Frog of the Day */}
      <Card className="mb-6 border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🐸</span> 
            Жаба дня (Eat That Frog)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {frogTask ? (
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskCompletion(frogTask.id)}
                className="mt-1"
              >
                <Circle className="w-6 h-6 text-green-500 hover:text-green-600" />
              </button>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">{frogTask.title}</p>
                {frogTask.description && (
                  <p className="text-gray-600 mt-1">{frogTask.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  {frogTask.estimatedTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {frogTask.estimatedTime} хв
                    </span>
                  )}
                  {frogTask.context && (
                    <span className="px-2 py-0.5 bg-white rounded">{frogTask.context}</span>
                  )}
                </div>
              </div>
              <Button
                variant="primary"
                onClick={() => toggleTaskCompletion(frogTask.id)}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Виконано!
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Виберіть найважливіше завдання, яке ви маєте виконати сьогодні першим
              </p>
              {priorityATasks.length > 0 ? (
                <div className="space-y-2">
                  {priorityATasks.slice(0, 3).map(task => (
                    <button
                      key={task.id}
                      onClick={() => setFrogOfDay(task.id)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 text-left flex items-center gap-3"
                    >
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">{task.title}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        Зробити жабою
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Створити завдання
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Toggle + Context Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Список"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'matrix' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Матриця Ейзенхауера"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
        <button
          onClick={() => setFilterContext('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filterContext === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Всі ({activeTasks.length})
        </button>
        {uniqueContexts.map(context => (
          <button
            key={context}
            onClick={() => setFilterContext(context)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filterContext === context 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {context} ({activeTasks.filter(t => t.context === context).length})
          </button>
        ))}
        </div>
      </div>

      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Q1: Urgent + Important */}
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-red-50 py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <span className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center text-xs font-bold">I</span>
                Терміново + Важливо — ЗРОБИТИ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto">
                {activeTasks.filter(t => t.priority === 'A' && t.dueDate && t.dueDate <= today).map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTaskCompletion(task.id)} onEdit={() => openEditModal(task)} onDelete={() => handleDelete(task.id)} onSetFrog={() => setFrogOfDay(task.id)} showMenu={showMenu} setShowMenu={setShowMenu} />
                ))}
                {activeTasks.filter(t => t.priority === 'A' && t.dueDate && t.dueDate <= today).length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">Чудово! Немає термінових важливих завдань</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Q2: Not Urgent + Important */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50 py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-bold">II</span>
                Важливо, але не Терміново — ПЛАНУВАТИ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto">
                {activeTasks.filter(t => (t.priority === 'A' || t.priority === 'B') && (!t.dueDate || t.dueDate > today)).map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTaskCompletion(task.id)} onEdit={() => openEditModal(task)} onDelete={() => handleDelete(task.id)} onSetFrog={() => setFrogOfDay(task.id)} showMenu={showMenu} setShowMenu={setShowMenu} />
                ))}
                {activeTasks.filter(t => (t.priority === 'A' || t.priority === 'B') && (!t.dueDate || t.dueDate > today)).length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">Немає запланованих важливих завдань</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Q3: Urgent + Not Important */}
          <Card className="border-2 border-yellow-200">
            <CardHeader className="bg-yellow-50 py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-700">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded flex items-center justify-center text-xs font-bold">III</span>
                Терміново, але не Важливо — ДЕЛЕГУВАТИ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto">
                {activeTasks.filter(t => t.priority === 'C' && t.dueDate && t.dueDate <= today).map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTaskCompletion(task.id)} onEdit={() => openEditModal(task)} onDelete={() => handleDelete(task.id)} onSetFrog={() => setFrogOfDay(task.id)} showMenu={showMenu} setShowMenu={setShowMenu} />
                ))}
                {activeTasks.filter(t => t.priority === 'C' && t.dueDate && t.dueDate <= today).length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">Немає термінових другорядних завдань</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Q4: Not Urgent + Not Important */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gray-50 py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                <span className="w-6 h-6 bg-gray-400 text-white rounded flex items-center justify-center text-xs font-bold">IV</span>
                Не Терміново + Не Важливо — ВИДАЛИТИ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto">
                {activeTasks.filter(t => (t.priority === 'D' || t.priority === 'E') || (t.priority === 'C' && (!t.dueDate || t.dueDate > today))).map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => toggleTaskCompletion(task.id)} onEdit={() => openEditModal(task)} onDelete={() => handleDelete(task.id)} onSetFrog={() => setFrogOfDay(task.id)} showMenu={showMenu} setShowMenu={setShowMenu} />
                ))}
                {activeTasks.filter(t => (t.priority === 'D' || t.priority === 'E') || (t.priority === 'C' && (!t.dueDate || t.dueDate > today))).length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">Немає другорядних завдань</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'list' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority A Tasks */}
        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Пріоритет A (Обов'язково)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {(filterContext === 'all' ? priorityATasks : priorityATasks.filter(t => t.context === filterContext)).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskCompletion(task.id)}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task.id)}
                  onSetFrog={() => setFrogOfDay(task.id)}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              ))}
              {priorityATasks.length === 0 && (
                <p className="p-4 text-center text-gray-500 text-sm">
                  Немає завдань з пріоритетом A
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Other Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Інші завдання
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {(filterContext === 'all' ? otherTasks : otherTasks.filter(t => t.context === filterContext)).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskCompletion(task.id)}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task.id)}
                  onSetFrog={() => setFrogOfDay(task.id)}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              ))}
              {otherTasks.length === 0 && (
                <p className="p-4 text-center text-gray-500 text-sm">
                  Немає інших завдань
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Виконано сьогодні ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {completedTasks.map(task => (
                <div key={task.id} className="p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-500 line-through">{task.title}</span>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <p className="p-4 text-center text-gray-500 text-sm">
                  Ще нічого не виконано
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Inbox Modal */}
      <Modal
        isOpen={showInbox}
        onClose={() => setShowInbox(false)}
        title="📥 Inbox (GTD Capture)"
        size="md"
      >
        <div className="space-y-4">
          <form onSubmit={handleAddToInbox} className="flex gap-2">
            <Input
              value={newInboxItem}
              onChange={e => setNewInboxItem(e.target.value)}
              placeholder="Швидко записати думку..."
              className="flex-1"
            />
            <Button type="submit">Додати</Button>
          </form>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">
              Обробіть кожен елемент: що це? чи потрібна дія?
            </p>
            {inbox.length > 0 ? (
              <div className="space-y-2">
                {inbox.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-1">{item}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => processInboxItem(index, item)}
                    >
                      Обробити
                    </Button>
                    <button
                      onClick={() => removeFromInbox(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">Inbox порожній 🎉</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTask ? 'Редагувати завдання' : 'Нове завдання'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Що потрібно зробити?"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Опишіть завдання..."
            required
          />

          <Textarea
            label="Деталі"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Додаткові деталі..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Контекст (GTD)
              </label>
              <select
                value={formData.context}
                onChange={e => setFormData({ ...formData, context: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Без контексту</option>
                {CONTEXTS.map(ctx => (
                  <option key={ctx} value={ctx}>{ctx}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рівень енергії
              </label>
              <select
                value={formData.energyLevel}
                onChange={e => setFormData({ ...formData, energyLevel: e.target.value as EnergyLevel })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="high">⚡ Високий (High)</option>
                <option value="medium">🔋 Середній (Medium)</option>
                <option value="low">☕ Низький (Low)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Час (хвилини)"
              type="number"
              value={formData.estimatedTime}
              onChange={e => setFormData({ ...formData, estimatedTime: Number(e.target.value) })}
            />
            <Input
              label="Дедлайн"
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={resetForm}>
              Скасувати
            </Button>
            <Button type="submit">
              {editingTask ? 'Зберегти' : 'Створити'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetFrog: () => void;
  showMenu: string | null;
  setShowMenu: (id: string | null) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onSetFrog,
  showMenu,
  setShowMenu,
}) => (
  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
    <button onClick={onToggle} className="mt-0.5">
      <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
    </button>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900">{task.title}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
        {task.estimatedTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {task.estimatedTime} хв
          </span>
        )}
        {task.context && (
          <span className="px-1.5 py-0.5 bg-gray-100 rounded">{task.context}</span>
        )}
        {task.energyLevel && (
          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${
            task.energyLevel === 'high' ? 'bg-yellow-100 text-yellow-700' :
            task.energyLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {task.energyLevel === 'high' && <Zap className="w-3 h-3" />}
            {task.energyLevel === 'medium' && <Battery className="w-3 h-3" />}
            {task.energyLevel === 'low' && <Coffee className="w-3 h-3" />}
            {task.energyLevel === 'high' ? 'High' : task.energyLevel === 'medium' ? 'Med' : 'Low'}
          </span>
        )}
        <span className={`px-1.5 py-0.5 rounded ${
          task.priority === 'A' ? 'bg-red-100 text-red-600' :
          task.priority === 'B' ? 'bg-yellow-100 text-yellow-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {task.priority}
        </span>
      </div>
    </div>
    <div className="relative">
      <button 
        onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </button>
      {showMenu === task.id && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[130px]">
          <button
            onClick={onSetFrog}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            🐸 Зробити жабою
          </button>
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Редагувати
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Видалити
          </button>
        </div>
      )}
    </div>
  </div>
);
