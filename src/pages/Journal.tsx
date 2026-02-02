import React, { useState } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
  Plus, 
  BookOpen, 
  Heart, 
  Sun, 
  Moon, 
  Pencil,
  Trash2,
  Calendar,
  Search
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import type { JournalEntry } from '../types';

const JOURNAL_TYPES = [
  { key: 'morning', label: 'Ранковий', icon: Sun, color: 'bg-amber-100 text-amber-600' },
  { key: 'evening', label: 'Вечірній', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { key: 'gratitude', label: 'Вдячність', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { key: 'reflection', label: 'Рефлексія', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
  { key: 'free', label: 'Вільний', icon: Pencil, color: 'bg-gray-100 text-gray-600' },
];

const MORNING_PROMPTS = [
  'За що я вдячний сьогодні?',
  'Що зробить цей день чудовим?',
  'Яка моя головна ціль на сьогодні?',
  'Хто я хочу бути сьогодні?',
  'Яка моя афірмація на сьогодні?',
];

const EVENING_PROMPTS = [
  'Які 3 найкращі моменти сьогодні?',
  'Чому я навчився сьогодні?',
  'Що я міг би зробити краще?',
  'За що я вдячний за сьогоднішній день?',
  'Які мої пріоритети на завтра?',
];

const GRATITUDE_PROMPTS = [
  'Назвіть 3 речі, за які ви вдячні...',
  'Хто допоміг вам сьогодні?',
  'Яка маленька радість сталася сьогодні?',
  'За яку можливість ви вдячні?',
  'Що хорошого відбулося на цьому тижні?',
];

export const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, user } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedType, setSelectedType] = useState<'morning' | 'evening' | 'gratitude' | 'reflection' | 'free'>('morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    gratitudeItems: ['', '', ''],
    mood: 7,
    tags: [] as string[],
  });

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, {
        ...formData,
        gratitudeItems: formData.gratitudeItems.filter(Boolean),
      });
    } else {
      addJournalEntry({
        userId: user?.id || '',
        date: today,
        type: selectedType,
        title: formData.title || `${JOURNAL_TYPES.find(t => t.key === selectedType)?.label} запис`,
        content: formData.content,
        gratitudeItems: formData.gratitudeItems.filter(Boolean),
        mood: formData.mood,
        tags: formData.tags,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({
      title: '',
      content: '',
      gratitudeItems: ['', '', ''],
      mood: 7,
      tags: [],
    });
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setSelectedType(entry.type);
    setFormData({
      title: entry.title,
      content: entry.content,
      gratitudeItems: [...entry.gratitudeItems, '', '', ''].slice(0, 3),
      mood: entry.mood,
      tags: entry.tags,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Видалити цей запис?')) {
      deleteJournalEntry(id);
    }
  };

  const getPrompts = () => {
    switch (selectedType) {
      case 'morning': return MORNING_PROMPTS;
      case 'evening': return EVENING_PROMPTS;
      case 'gratitude': return GRATITUDE_PROMPTS;
      default: return [];
    }
  };

  const filteredEntries = journalEntries
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e => 
      searchQuery === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const todayEntries = journalEntries.filter(e => e.date === today);
  const hasMorning = todayEntries.some(e => e.type === 'morning');
  const hasEvening = todayEntries.some(e => e.type === 'evening');
  const hasGratitude = todayEntries.some(e => e.type === 'gratitude');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Журнал</h1>
          <p className="text-gray-500 mt-1">
            Scribing: Ясність думок через письмо
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Новий запис
        </Button>
      </div>

      {/* Today's Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Сьогоднішні записи</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => {
                setSelectedType('morning');
                setIsModalOpen(true);
              }}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                hasMorning 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-amber-50 border-amber-200 hover:border-amber-300'
              }`}
            >
              <Sun className={`w-8 h-8 mx-auto mb-2 ${hasMorning ? 'text-green-500' : 'text-amber-500'}`} />
              <p className="font-medium">Ранковий</p>
              <p className="text-sm text-gray-500">
                {hasMorning ? '✓ Виконано' : 'Заповнити'}
              </p>
            </button>

            <button
              onClick={() => {
                setSelectedType('gratitude');
                setIsModalOpen(true);
              }}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                hasGratitude 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-pink-50 border-pink-200 hover:border-pink-300'
              }`}
            >
              <Heart className={`w-8 h-8 mx-auto mb-2 ${hasGratitude ? 'text-green-500' : 'text-pink-500'}`} />
              <p className="font-medium">Вдячність</p>
              <p className="text-sm text-gray-500">
                {hasGratitude ? '✓ Виконано' : 'Заповнити'}
              </p>
            </button>

            <button
              onClick={() => {
                setSelectedType('evening');
                setIsModalOpen(true);
              }}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                hasEvening 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-indigo-50 border-indigo-200 hover:border-indigo-300'
              }`}
            >
              <Moon className={`w-8 h-8 mx-auto mb-2 ${hasEvening ? 'text-green-500' : 'text-indigo-500'}`} />
              <p className="font-medium">Вечірній</p>
              <p className="text-sm text-gray-500">
                {hasEvening ? '✓ Виконано' : 'Заповнити'}
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Пошук в журналі..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">Всі записи</option>
          {JOURNAL_TYPES.map(type => (
            <option key={type.key} value={type.key}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map(entry => {
          const typeInfo = JOURNAL_TYPES.find(t => t.key === entry.type);
          const Icon = typeInfo?.icon || Pencil;
          
          return (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${typeInfo?.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(entry.createdAt), 'd MMMM yyyy, HH:mm', { locale: uk })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo?.color}`}>
                        {typeInfo?.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                    {entry.content && (
                      <p className="text-gray-600 mt-1 line-clamp-2">{entry.content}</p>
                    )}
                    {entry.gratitudeItems.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.gratitudeItems.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-sm">
                            ❤️ {item}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Настрій: {'😊'.repeat(Math.ceil(entry.mood / 2))}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Нічого не знайдено' : 'Ще немає записів'}
              </p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Створити перший запис
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingEntry ? 'Редагувати запис' : 'Новий запис'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          {!editingEntry && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип запису
              </label>
              <div className="flex gap-2">
                {JOURNAL_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.key}
                      type="button"
                      onClick={() => setSelectedType(type.key as typeof selectedType)}
                      className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                        selectedType === type.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Title */}
          <Input
            label="Заголовок"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder={`${JOURNAL_TYPES.find(t => t.key === selectedType)?.label} запис`}
          />

          {/* Prompts */}
          {getPrompts().length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">Підказки:</p>
              <ul className="text-sm text-blue-600 space-y-1">
                {getPrompts().map((prompt, i) => (
                  <li key={i}>• {prompt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gratitude Items */}
          {(selectedType === 'gratitude' || selectedType === 'morning') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                За що я вдячний? ❤️
              </label>
              {formData.gratitudeItems.map((item, i) => (
                <Input
                  key={i}
                  value={item}
                  onChange={e => {
                    const newItems = [...formData.gratitudeItems];
                    newItems[i] = e.target.value;
                    setFormData({ ...formData, gratitudeItems: newItems });
                  }}
                  placeholder={`${i + 1}. За що ви вдячні?`}
                  className="mb-2"
                />
              ))}
            </div>
          )}

          {/* Content */}
          <Textarea
            label="Зміст"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            placeholder="Ваші думки, ідеї, рефлексії..."
            rows={6}
          />

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Настрій: {formData.mood}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood}
              onChange={e => setFormData({ ...formData, mood: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>😢</span>
              <span>😐</span>
              <span>😊</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={resetForm}>
              Скасувати
            </Button>
            <Button type="submit">
              {editingEntry ? 'Зберегти' : 'Створити'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
