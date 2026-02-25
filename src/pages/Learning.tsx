import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  Plus,
  CheckCircle2,
  Trash2,
  Play,
  Pause,
  GraduationCap,
  Lightbulb,
  Star,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, Button, Modal, Input, Textarea } from '../components/ui';
import type { Book } from '../types';

export const Learning: React.FC = () => {
  const { 
    // Skills (Learning Slice)
    skills, addSkill, deleteSkill, updateSkill,
    // Feynman (Learning Slice)
    feynmanNotes, addFeynmanNote, deleteFeynmanNote,
    // Books (Reading Slice)
    books, addBook,
    addPoints 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'skills' | 'feynman' | 'books'>('skills');

  // Skills state forms
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState({ name: '', category: '', targetMinutes: 1200, subSkills: '', notes: '' });

  // Timer state
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Feynman state forms
  const [showFeynmanModal, setShowFeynmanModal] = useState(false);
  const [feynmanForm, setFeynmanForm] = useState({ concept: '', simpleExplanation: '', gaps: '', analogy: '' });

  // Books state forms
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '', author: '', why: '', category: '', topIdeas: '', rating: 8,
    status: 'reading' as Book['status'], pagesRead: 0, totalPages: 300,
  });

  // Timer logic
  React.useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartTimer = (skillId: string) => {
    if (activeSkillId === skillId && timerRunning) {
      setTimerRunning(false);
      // Save accumulated time
      const minutes = Math.floor(timerSeconds / 60);
      if (minutes > 0) {
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
          updateSkill(skillId, { totalMinutes: skill.totalMinutes + minutes });
          addPoints(minutes);
        }
      }
      setTimerSeconds(0);
      setActiveSkillId(null);
    } else {
      setActiveSkillId(skillId);
      setTimerRunning(true);
      setTimerSeconds(0);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    addSkill({
      name: skillForm.name,
      category: skillForm.category,
      totalMinutes: 0,
      targetMinutes: skillForm.targetMinutes,
      subSkills: skillForm.subSkills.split(',').map(s => s.trim()).filter(Boolean),
      notes: skillForm.notes,
    });
    setShowSkillModal(false);
    setSkillForm({ name: '', category: '', targetMinutes: 1200, subSkills: '', notes: '' });
  };

  const handleAddFeynman = (e: React.FormEvent) => {
    e.preventDefault();
    addFeynmanNote(feynmanForm);
    setShowFeynmanModal(false);
    setFeynmanForm({ concept: '', simpleExplanation: '', gaps: '', analogy: '' });
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook({
      title: bookForm.title,
      author: bookForm.author,
      why: bookForm.why,
      category: bookForm.category,
      topIdeas: bookForm.topIdeas.split('\n').filter(Boolean),
      rating: bookForm.rating,
      status: bookForm.status,
      pagesRead: bookForm.pagesRead,
      totalPages: bookForm.totalPages,
      dailyPagesGoal: 10,
      favorite: false,
    });
    setShowBookModal(false);
    setBookForm({ title: '', author: '', why: '', category: '', topIdeas: '', rating: 8, status: 'reading', pagesRead: 0, totalPages: 300 });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const tabs = [
    { key: 'skills', label: 'Навички (20 годин)', icon: Brain },
    { key: 'feynman', label: 'Техніка Фейнмана', icon: Lightbulb },
    { key: 'books', label: 'Бібліотека', icon: BookOpen },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Навчання</h1>
          <p className="text-gray-500 mt-1">
            Ultralearning + Техніка Фейнмана + Spaced Repetition
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Tab - The First 20 Hours */}
      {activeTab === 'skills' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              The First 20 Hours — Трекер навичок
            </h2>
            <Button onClick={() => setShowSkillModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Нова навичка
            </Button>
          </div>

          {skills.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Навчись чому завгодно за 20 годин
                </h3>
                <p className="text-gray-500 mb-1 max-w-md mx-auto">
                  Декомпозуй навичку на під-навички, вивчи основи, та практикуй мінімум 20 годин
                </p>
                <p className="text-sm text-gray-400 mb-6">— Josh Kaufman</p>
                <Button onClick={() => setShowSkillModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Почати вивчати навичку
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(skill => {
                const progress = Math.min(100, (skill.totalMinutes / skill.targetMinutes) * 100);
                const hoursLogged = (skill.totalMinutes / 60).toFixed(1);
                const hoursTarget = (skill.targetMinutes / 60).toFixed(0);
                const isActive = activeSkillId === skill.id;

                return (
                  <Card key={skill.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h3>
                          {skill.category && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded mt-1 inline-block">
                              {skill.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{hoursLogged} / {hoursTarget} годин</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub-skills */}
                      {skill.subSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {skill.subSkills.map((sub, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Timer */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStartTimer(skill.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            isActive && timerRunning
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {isActive && timerRunning ? (
                            <><Pause className="w-4 h-4" /> Зупинити</>
                          ) : (
                            <><Play className="w-4 h-4" /> Практикувати</>
                          )}
                        </button>
                        {isActive && (
                          <span className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
                            {formatTime(timerSeconds)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Feynman Tab */}
      {activeTab === 'feynman' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Техніка Фейнмана — Глибоке розуміння
            </h2>
            <Button onClick={() => setShowFeynmanModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Нова концепція
            </Button>
          </div>

          {/* 4 Steps Info */}
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">4 кроки Фейнмана:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { step: '1', text: 'Обери концепцію', emoji: '📝' },
                  { step: '2', text: 'Поясни 12-річній дитині', emoji: '👶' },
                  { step: '3', text: 'Знайди прогалини', emoji: '🔍' },
                  { step: '4', text: 'Спрости та створи аналогію', emoji: '💡' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <span className="text-xs text-gray-500">Крок {item.step}</span>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {feynmanNotes.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Поясни — і зрозумієш
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Якщо ви не можете пояснити щось простими словами, ви цього не розумієте
                </p>
                <Button onClick={() => setShowFeynmanModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Пояснити концепцію
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feynmanNotes.map(note => (
                <Card key={note.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{note.concept}</h3>
                      <button
                        onClick={() => deleteFeynmanNote(note.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Просте пояснення:</p>
                        <p className="text-gray-700 dark:text-gray-300">{note.simpleExplanation}</p>
                      </div>
                      {note.gaps && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Прогалини:</p>
                          <p className="text-gray-700 dark:text-gray-300">{note.gaps}</p>
                        </div>
                      )}
                      {note.analogy && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Аналогія:</p>
                          <p className="text-gray-700 dark:text-gray-300">{note.analogy}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Бібліотека — Трекер читання
            </h2>
            <Button onClick={() => setShowBookModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Додати книгу
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="py-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{books.filter(b => b.status === 'reading').length}</p>
                <p className="text-sm text-gray-500">Читаю зараз</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{books.filter(b => b.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Прочитано</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {books.reduce((sum, b) => sum + b.pagesRead, 0)}
                </p>
                <p className="text-sm text-gray-500">Сторінок</p>
              </CardContent>
            </Card>
          </div>

          {books.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  10 сторінок/день = 18+ книг на рік
                </h3>
                <p className="text-gray-500 mb-6">Почніть відстежувати своє читання</p>
                <Button onClick={() => setShowBookModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Додати першу книгу
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map(book => {
                const progress = book.totalPages > 0 ? (book.pagesRead / book.totalPages) * 100 : 0;
                return (
                  <Card key={book.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{book.title}</h3>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          book.status === 'completed' ? 'bg-green-100 text-green-700' :
                          book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {book.status === 'completed' ? 'Прочитано' :
                           book.status === 'reading' ? 'Читаю' : 'Бажаю'}
                        </span>
                      </div>
                      {book.status !== 'wishlist' && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{book.pagesRead} / {book.totalPages} стор.</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                      {book.topIdeas.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Ключові ідеї:</p>
                          <div className="flex flex-wrap gap-1">
                            {book.topIdeas.slice(0, 3).map((idea, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded">
                                {idea}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < book.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Skill Modal */}
      <Modal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} title="Нова навичка (The First 20 Hours)">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <Input label="Назва навички" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="Наприклад: Гра на гітарі" required />
          <Input label="Категорія" value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })} placeholder="Музика, Мови, Програмування..." />
          <Input label="Ціль (хвилини)" type="number" value={skillForm.targetMinutes} onChange={e => setSkillForm({ ...skillForm, targetMinutes: Number(e.target.value) })} />
          <Input label="Під-навички (через кому)" value={skillForm.subSkills} onChange={e => setSkillForm({ ...skillForm, subSkills: e.target.value })} placeholder="Акорди, Ритм, Перебор..." />
          <Textarea label="Нотатки" value={skillForm.notes} onChange={e => setSkillForm({ ...skillForm, notes: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowSkillModal(false)}>Скасувати</Button>
            <Button type="submit">Створити</Button>
          </div>
        </form>
      </Modal>

      {/* Feynman Modal */}
      <Modal isOpen={showFeynmanModal} onClose={() => setShowFeynmanModal(false)} title="Техніка Фейнмана" size="lg">
        <form onSubmit={handleAddFeynman} className="space-y-4">
          <Input label="1. Концепція" value={feynmanForm.concept} onChange={e => setFeynmanForm({ ...feynmanForm, concept: e.target.value })} placeholder="Яку концепцію ви вивчаєте?" required />
          <Textarea label="2. Поясніть простими словами (як 12-річній дитині)" value={feynmanForm.simpleExplanation} onChange={e => setFeynmanForm({ ...feynmanForm, simpleExplanation: e.target.value })} rows={4} placeholder="Поясніть без жаргону, простими словами..." required />
          <Textarea label="3. Де є прогалини?" value={feynmanForm.gaps} onChange={e => setFeynmanForm({ ...feynmanForm, gaps: e.target.value })} rows={2} placeholder="Що ви не змогли пояснити просто?" />
          <Input label="4. Аналогія" value={feynmanForm.analogy} onChange={e => setFeynmanForm({ ...feynmanForm, analogy: e.target.value })} placeholder="Це як..." />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowFeynmanModal(false)}>Скасувати</Button>
            <Button type="submit">Зберегти</Button>
          </div>
        </form>
      </Modal>

      {/* Book Modal */}
      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title="Додати книгу">
        <form onSubmit={handleAddBook} className="space-y-4">
          <Input label="Назва книги" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Автор" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} />
            <Input label="Категорія" value={bookForm.category} onChange={e => setBookForm({ ...bookForm, category: e.target.value })} placeholder="Бізнес, Психологія..." />
          </div>
          <Input label="Чому я це читаю?" value={bookForm.why} onChange={e => setBookForm({ ...bookForm, why: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Статус</label>
              <select value={bookForm.status} onChange={e => setBookForm({ ...bookForm, status: e.target.value as Book['status'] })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option value="reading">Читаю</option>
                <option value="completed">Прочитано</option>
                <option value="wishlist">Бажаю</option>
              </select>
            </div>
            <Input label="Прочитано (стор.)" type="number" value={bookForm.pagesRead} onChange={e => setBookForm({ ...bookForm, pagesRead: Number(e.target.value) })} />
            <Input label="Всього (стор.)" type="number" value={bookForm.totalPages} onChange={e => setBookForm({ ...bookForm, totalPages: Number(e.target.value) })} />
          </div>
          <Textarea label="Ключові ідеї (по рядку)" value={bookForm.topIdeas} onChange={e => setBookForm({ ...bookForm, topIdeas: e.target.value })} rows={3} placeholder="Ідея 1&#10;Ідея 2&#10;Ідея 3" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Рейтинг: {bookForm.rating}/10</label>
            <input type="range" min="1" max="10" value={bookForm.rating} onChange={e => setBookForm({ ...bookForm, rating: Number(e.target.value) })} className="w-full" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowBookModal(false)}>Скасувати</Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
