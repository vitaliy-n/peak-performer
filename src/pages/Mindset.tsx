import React, { useState } from 'react';
import {
  Brain,
  Flame,
  Shield,
  Lightbulb,
  Plus,
  Trash2,
  Trophy,
  Zap,
  Eye,
  Quote,
  Play
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input, Textarea } from '../components/ui';
import type { DecisionEntry, Affirmation, Visualization } from '../types';

const MENTAL_MODELS = [
  { name: 'First Principles Thinking', description: 'Розбий проблему до базових істин і будуй вгору', emoji: '🔬', author: 'Elon Musk' },
  { name: 'Inversion', description: 'Думай навпаки — уникай невдач замість пошуку успіху', emoji: '🔄', author: 'Charlie Munger' },
  { name: 'Second-Order Thinking', description: 'Думай про наслідки наслідків', emoji: '🎯', author: 'Howard Marks' },
  { name: 'Circle of Competence', description: 'Знай межі свого знання', emoji: '⭕', author: 'Warren Buffett' },
  { name: "Occam's Razor", description: 'Найпростіше пояснення — зазвичай правильне', emoji: '✂️', author: 'William of Ockham' },
  { name: 'Probabilistic Thinking', description: 'Думай ймовірностями, не визначеностями', emoji: '🎲', author: 'Annie Duke' },
  { name: 'Hanlon\'s Razor', description: 'Не приписуй злому наміру те, що можна пояснити необізнаністю', emoji: '🤷', author: 'Robert Hanlon' },
  { name: 'Map is Not the Territory', description: 'Модель реальності ≠ реальність', emoji: '🗺️', author: 'Alfred Korzybski' },
  { name: 'Pareto Principle (80/20)', description: '20% зусиль дають 80% результату', emoji: '📊', author: 'Vilfredo Pareto' },
  { name: 'Sunk Cost Fallacy', description: 'Минулі інвестиції не повинні впливати на майбутні рішення', emoji: '💸', author: 'Behavioral Economics' },
  { name: 'Availability Bias', description: 'Ми переоцінюємо ймовірність того, що легко згадати', emoji: '🧠', author: 'Daniel Kahneman' },
  { name: 'Compounding', description: 'Маленькі покращення накопичуються з часом', emoji: '📈', author: 'Albert Einstein' },
];

const STOIC_PRACTICES = [
  { name: 'Dichotomy of Control', description: 'Зосередься лише на тому, що ти контролюєш', emoji: '⚖️' },
  { name: 'Negative Visualization', description: 'Уяви найгірший сценарій — і прийми його', emoji: '🌑' },
  { name: 'Voluntary Discomfort', description: 'Навмисно виходь із зони комфорту', emoji: '🥶' },
  { name: 'Memento Mori', description: "Пам'ятай про смертність — дій зараз", emoji: '⏳' },
  { name: 'Amor Fati', description: 'Полюби свою долю — все відбувається для тебе', emoji: '❤️' },
  { name: 'View from Above', description: 'Подивись на проблему з висоти — в масштабі Всесвіту', emoji: '🌍' },
];

const POWER_QUESTIONS = [
  'Яка ОДНА річ, яку я можу зробити, щоб все інше стало простішим або непотрібним?',
  'Якби я мав лише 2 години на роботу, що б я зробив?',
  'Що б я зробив, якби не боявся?',
  'Чого я уникаю і чому?',
  'Як виглядає мій ідеальний звичайний день?',
  'Які мої 3 найбільші перемоги за останній місяць?',
  'Що б порадив мені мій 80-річний я?',
  'Чому я навчився з останньої невдачі?',
  'Хто мої 5 найближчих людей і куди вони мене ведуть?',
  'Яку одну звичку я можу змінити, щоб трансформувати своє життя?',
];

export const Mindset: React.FC = () => {
  const { 
    mindset, 
    addCookieJarEntry, 
    deleteCookieJarEntry, 
    addDecisionEntry, 
    deleteDecisionEntry,
    addAffirmation,
    deleteAffirmation,
    incrementAffirmationUsage,
    addVisualization,
    deleteVisualization,
    addPoints 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'models' | 'stoic' | 'questions' | 'cookiejar' | 'decisions' | 'affirmations' | 'visualizations'>('models');

  // Cookie Jar state
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookieForm, setCookieForm] = useState('');

  // Decision Journal state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionForm, setDecisionForm] = useState<Omit<DecisionEntry, 'id' | 'date'>>({
    decision: '', reasoning: '', expectedOutcome: '', actualOutcome: '', lesson: '',
  });

  // Affirmation state
  const [showAffirmationModal, setShowAffirmationModal] = useState(false);
  const [affirmationForm, setAffirmationForm] = useState({ text: '', category: 'confidence' as Affirmation['category'] });

  // Visualization state
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [visualizationForm, setVisualizationForm] = useState<Omit<Visualization, 'id'>>({ title: '', description: '', durationMinutes: 5 });

  // Selected daily question
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleAddCookie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieForm.trim()) return;
    addCookieJarEntry(cookieForm);
    setCookieForm('');
    setShowCookieModal(false);
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    addDecisionEntry(decisionForm);
    setDecisionForm({ decision: '', reasoning: '', expectedOutcome: '', actualOutcome: '', lesson: '' });
    setShowDecisionModal(false);
  };

  const handleAddAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affirmationForm.text.trim()) return;
    addAffirmation(affirmationForm.text, affirmationForm.category);
    setAffirmationForm({ text: '', category: 'confidence' });
    setShowAffirmationModal(false);
  };

  const handleAddVisualization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visualizationForm.title.trim()) return;
    addVisualization(visualizationForm);
    setVisualizationForm({ title: '', description: '', durationMinutes: 5 });
    setShowVisualizationModal(false);
  };

  const tabs = [
    { key: 'models', label: 'Ментальні моделі', icon: Brain },
    { key: 'stoic', label: 'Стоїцизм', icon: Shield },
    { key: 'questions', label: 'Power Questions', icon: Zap },
    { key: 'cookiejar', label: 'Cookie Jar', icon: Trophy },
    { key: 'decisions', label: 'Decision Journal', icon: Lightbulb },
    { key: 'affirmations', label: 'Афірмації', icon: Quote },
    { key: 'visualizations', label: 'Візуалізація', icon: Eye },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Мислення та психологія</h1>
          <p className="text-gray-500 mt-1">
            Mental Models + Stoicism + Growth Mindset + Grit
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mental Models Tab */}
      {activeTab === 'models' && (
        <div>
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">Mental Models (Charlie Munger / Shane Parrish)</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                "Ви повинні мати моделі у вашій голові. І ви повинні масив моделей у вашій голові."
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MENTAL_MODELS.map((model, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{model.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{model.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{model.description}</p>
                      <p className="text-xs text-gray-400 mt-2">— {model.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stoic Practices Tab */}
      {activeTab === 'stoic' && (
        <div>
          <Card className="mb-6 bg-gradient-to-r from-stone-50 to-amber-50 dark:from-stone-900/20 dark:to-amber-900/20 border-stone-200 dark:border-stone-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-stone-800 dark:text-stone-300">Стоїцизм (Marcus Aurelius, Seneca, Epictetus)</h3>
              <p className="text-sm text-stone-700 dark:text-stone-400 mt-1">
                "Ви маєте владу над своїм розумом — не над зовнішніми подіями. Усвідомте це, і ви знайдете силу."
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {STOIC_PRACTICES.map((practice, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{practice.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{practice.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{practice.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Evening Stoic Review */}
          <Card>
            <CardHeader>
              <CardTitle>Вечірній стоїчний огляд (Seneca)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { q: 'Що я зробив добре сьогодні?', emoji: '✅' },
                  { q: 'Де я міг діяти краще?', emoji: '📝' },
                  { q: 'Що виходило за межі мого контролю, а я все одно хвилювався?', emoji: '⚖️' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">{item.emoji} {item.q}</p>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      rows={2}
                      placeholder="Ваші думки..."
                    />
                  </div>
                ))}
                <Button onClick={() => addPoints(15)} className="w-full">
                  Зберегти вечірній огляд (+15 XP)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Power Questions Tab */}
      {activeTab === 'questions' && (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">Power Questions</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                "Якість вашого життя визначається якістю питань, які ви ставите" — Tony Robbins
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {POWER_QUESTIONS.map((question, i) => (
              <button
                key={i}
                onClick={() => setSelectedQuestion(selectedQuestion === i ? null : i)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedQuestion === i
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 font-bold text-lg">{i + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{question}</p>
                    {selectedQuestion === i && (
                      <div className="mt-3">
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          rows={3}
                          placeholder="Ваша відповідь..."
                          onClick={e => e.stopPropagation()}
                        />
                        <Button size="sm" className="mt-2" onClick={(e: React.MouseEvent) => { e.stopPropagation(); addPoints(10); }}>
                          Зберегти відповідь
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cookie Jar Tab (David Goggins) */}
      {activeTab === 'cookiejar' && (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                <Flame className="w-5 h-5" /> Cookie Jar (David Goggins — Can't Hurt Me)
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                "Коли стає важко, загляни в банку з перемогами. Ти вже проходив через складніше."
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowCookieModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Додати перемогу
            </Button>
          </div>

          {mindset.cookieJar.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🍪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ваша Cookie Jar порожня
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Згадайте свої перемоги, складні моменти які ви подолали, та досягнення
                </p>
                <Button onClick={() => setShowCookieModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Перша перемога
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mindset.cookieJar.slice().reverse().map(entry => (
                <Card key={entry.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200 dark:border-amber-800">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🍪</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{entry.victory}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.date).toLocaleDateString('uk-UA')}
                        </p>
                      </div>
                      <button onClick={() => deleteCookieJarEntry(entry.id)} className="p-1 hover:bg-red-50 rounded text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Decision Journal Tab */}
      {activeTab === 'decisions' && (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">Decision Journal (Annie Duke — Thinking in Bets)</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                "Рішення ≠ Результат. Хороше рішення може мати поганий результат — і навпаки."
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowDecisionModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Записати рішення
            </Button>
          </div>

          {mindset.decisions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Decision Journal
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Записуйте свої рішення і їх обґрунтування. Переглядайте пізніше для навчання.
                </p>
                <Button onClick={() => setShowDecisionModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Записати рішення
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mindset.decisions.slice().reverse().map(entry => (
                <Card key={entry.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{entry.decision}</h3>
                      <button onClick={() => deleteDecisionEntry(entry.id)} className="p-1 hover:bg-red-50 rounded text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      {entry.reasoning && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded"><strong>Обґрунтування:</strong> {entry.reasoning}</div>
                      )}
                      {entry.expectedOutcome && (
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded"><strong>Очікуваний результат:</strong> {entry.expectedOutcome}</div>
                      )}
                      {entry.actualOutcome && (
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded"><strong>Реальний результат:</strong> {entry.actualOutcome}</div>
                      )}
                      {entry.lesson && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded"><strong>Урок:</strong> {entry.lesson}</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{new Date(entry.date).toLocaleDateString('uk-UA')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Affirmations Tab */}
      {activeTab === 'affirmations' && (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-pink-800 dark:text-pink-300">Афірмації</h3>
              <p className="text-sm text-pink-700 dark:text-pink-400 mt-1">
                Повторюйте ці твердження щодня, щоб перепрограмувати своє мислення.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowAffirmationModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Додати афірмацію
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mindset.affirmations.map(affirmation => (
              <Card key={affirmation.id} className="hover:shadow-md transition-all">
                <CardContent className="py-6 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">"{affirmation.text}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                        {affirmation.category}
                      </span>
                      <span className="text-xs text-gray-400">Повторено: {affirmation.usageCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => incrementAffirmationUsage(affirmation.id)}>
                      <Quote className="w-4 h-4 mr-2" /> Повторити
                    </Button>
                    <button onClick={() => deleteAffirmation(affirmation.id)} className="p-2 hover:bg-red-50 rounded text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Visualizations Tab */}
      {activeTab === 'visualizations' && (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300">Візуалізація</h3>
              <p className="text-sm text-teal-700 dark:text-teal-400 mt-1">
                Створюйте яскраві ментальні образи вашого успіху та майбутнього.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowVisualizationModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Додати візуалізацію
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mindset.visualizations.map(viz => (
              <Card key={viz.id} className="hover:shadow-md transition-all">
                <CardContent className="py-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{viz.title}</h3>
                    <button onClick={() => deleteVisualization(viz.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-12 overflow-hidden">{viz.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{viz.durationMinutes} хв</span>
                    <Button size="sm" onClick={() => addPoints(10)}>
                      <Play className="w-4 h-4 mr-2" /> Почати
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cookie Modal */}
      <Modal isOpen={showCookieModal} onClose={() => setShowCookieModal(false)} title="Додати перемогу до Cookie Jar">
        <form onSubmit={handleAddCookie} className="space-y-4">
          <Textarea
            label="Ваша перемога"
            value={cookieForm}
            onChange={e => setCookieForm(e.target.value)}
            placeholder="Опишіть момент, коли ви подолали складність або досягли чогось важливого..."
            rows={4}
            required
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowCookieModal(false)}>Скасувати</Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>

      {/* Decision Modal */}
      <Modal isOpen={showDecisionModal} onClose={() => setShowDecisionModal(false)} title="Decision Journal" size="lg">
        <form onSubmit={handleAddDecision} className="space-y-4">
          <Input label="Рішення" value={decisionForm.decision} onChange={e => setDecisionForm({ ...decisionForm, decision: e.target.value })} placeholder="Яке рішення ви приймаєте?" required />
          <Textarea label="Обґрунтування (чому саме це?)" value={decisionForm.reasoning} onChange={e => setDecisionForm({ ...decisionForm, reasoning: e.target.value })} rows={3} />
          <Textarea label="Очікуваний результат" value={decisionForm.expectedOutcome} onChange={e => setDecisionForm({ ...decisionForm, expectedOutcome: e.target.value })} rows={2} />
          <Textarea label="Реальний результат (заповніть пізніше)" value={decisionForm.actualOutcome} onChange={e => setDecisionForm({ ...decisionForm, actualOutcome: e.target.value })} rows={2} />
          <Textarea label="Урок (заповніть пізніше)" value={decisionForm.lesson} onChange={e => setDecisionForm({ ...decisionForm, lesson: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowDecisionModal(false)}>Скасувати</Button>
            <Button type="submit">Зберегти</Button>
          </div>
        </form>
      </Modal>

      {/* Affirmation Modal */}
      <Modal isOpen={showAffirmationModal} onClose={() => setShowAffirmationModal(false)} title="Нова афірмація">
        <form onSubmit={handleAddAffirmation} className="space-y-4">
          <Textarea 
            label="Текст афірмації" 
            value={affirmationForm.text} 
            onChange={e => setAffirmationForm({ ...affirmationForm, text: e.target.value })} 
            placeholder="Я..." 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Категорія</label>
            <select
              value={affirmationForm.category}
              onChange={e => setAffirmationForm({ ...affirmationForm, category: e.target.value as Affirmation['category'] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="confidence">Впевненість</option>
              <option value="growth">Розвиток</option>
              <option value="gratitude">Вдячність</option>
              <option value="identity">Ідентичність</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowAffirmationModal(false)}>Скасувати</Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>

      {/* Visualization Modal */}
      <Modal isOpen={showVisualizationModal} onClose={() => setShowVisualizationModal(false)} title="Нова візуалізація">
        <form onSubmit={handleAddVisualization} className="space-y-4">
          <Input 
            label="Назва" 
            value={visualizationForm.title} 
            onChange={e => setVisualizationForm({ ...visualizationForm, title: e.target.value })} 
            required 
          />
          <Textarea 
            label="Опис сцени" 
            value={visualizationForm.description} 
            onChange={e => setVisualizationForm({ ...visualizationForm, description: e.target.value })} 
            placeholder="Що ви бачите, чуєте, відчуваєте?" 
            rows={4} 
          />
          <Input 
            label="Тривалість (хв)" 
            type="number" 
            value={visualizationForm.durationMinutes} 
            onChange={e => setVisualizationForm({ ...visualizationForm, durationMinutes: Number(e.target.value) })} 
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowVisualizationModal(false)}>Скасувати</Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
