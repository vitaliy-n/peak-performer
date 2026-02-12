import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  Plus,
  Trash2,
  Calculator,
  Target,
  Wallet,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, Input } from '../components/ui';

interface FinanceEntry {
  id: string;
  type: 'income' | 'expense' | 'saving' | 'investment';
  category: string;
  amount: number;
  description: string;
  date: string;
}

const EXPENSE_CATEGORIES = [
  'Житло', 'Їжа', 'Транспорт', 'Здоров\'я', 'Розваги',
  'Одяг', 'Освіта', 'Підписки', 'Інше',
];

const SEVEN_RULES = [
  { rule: 'Відкладай 10% від усього заробітку', emoji: '💰', key: 'save10' },
  { rule: 'Контролюй витрати', emoji: '📊', key: 'control' },
  { rule: 'Змушуй гроші працювати', emoji: '📈', key: 'invest' },
  { rule: 'Захищай капітал від втрат', emoji: '🛡️', key: 'protect' },
  { rule: 'Інвестуй у власне житло', emoji: '🏠', key: 'home' },
  { rule: 'Забезпеч майбутній дохід', emoji: '🔮', key: 'future' },
  { rule: 'Інвестуй у себе', emoji: '🧠', key: 'self' },
];

export const Finance: React.FC = () => {
  const { finance, addFinanceEntry, deleteFinanceEntry, toggleSevenRule, updateFireData } = useStore();
  const [activeTab, setActiveTab] = useState<'tracker' | 'rules' | 'fire'>('tracker');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: 'expense' as FinanceEntry['type'],
    category: '',
    amount: 0,
    description: '',
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addFinanceEntry({
      type: form.type,
      category: form.category,
      amount: form.amount,
      description: form.description,
    });
    setShowModal(false);
    setForm({ type: 'expense', category: '', amount: 0, description: '' });
  };

  const totalIncome = finance.entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = finance.entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalSavings = finance.entries.filter(e => e.type === 'saving').reduce((s, e) => s + e.amount, 0);
  const totalInvestments = finance.entries.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalSavings + totalInvestments) / totalIncome) * 100) : 0;

  // FIRE calculations
  const fiNumber = finance.fireData.annualExpenses * 25;
  const yearsToFI = finance.fireData.annualSavings > 0
    ? Math.log((fiNumber * (finance.fireData.expectedReturn / 100) + finance.fireData.annualSavings) / (finance.fireData.currentSavings * (finance.fireData.expectedReturn / 100) + finance.fireData.annualSavings)) / Math.log(1 + finance.fireData.expectedReturn / 100)
    : 0;

  // Conscious Spending Plan (Ramit Sethi)
  const fixedCostsPct = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const investmentsPct = totalIncome > 0 ? Math.round((totalInvestments / totalIncome) * 100) : 0;
  const savingsPct = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;
  const guiltFreePct = 100 - fixedCostsPct - investmentsPct - savingsPct;

  const tabs = [
    { key: 'tracker', label: 'Трекер', icon: Wallet },
    { key: 'rules', label: '7 Правил', icon: PiggyBank },
    { key: 'fire', label: 'FIRE', icon: Target },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Фінанси</h1>
          <p className="text-gray-500 mt-1">
            Rich Dad Poor Dad + The Richest Man in Babylon + FIRE
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
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tracker Tab */}
      {activeTab === 'tracker' && (
        <div>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="py-4 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalIncome.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Доходи</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <Wallet className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalExpenses.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Витрати</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <PiggyBank className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalSavings.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Заощадження</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{savingsRate}%</p>
                <p className="text-sm text-gray-500">Savings Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Conscious Spending Plan */}
          {totalIncome > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Conscious Spending Plan (Ramit Sethi)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Fixed Costs', pct: fixedCostsPct, target: '50-60%', color: 'bg-red-500' },
                    { label: 'Investments', pct: investmentsPct, target: '10%', color: 'bg-purple-500' },
                    { label: 'Savings', pct: savingsPct, target: '5-10%', color: 'bg-blue-500' },
                    { label: 'Guilt-Free', pct: Math.max(0, guiltFreePct), target: '20-35%', color: 'bg-green-500' },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none"
                            className={item.color.replace('bg-', 'text-')}
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - item.pct / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                          {item.pct}%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                      <p className="text-xs text-gray-500">Ціль: {item.target}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add + Entries List */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Записи</h2>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Додати запис
            </Button>
          </div>

          {finance.entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Почніть відстежувати свої фінанси</p>
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Перший запис
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {finance.entries.slice().reverse().map(entry => (
                <Card key={entry.id}>
                  <CardContent className="py-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        entry.type === 'income' ? 'bg-green-100' :
                        entry.type === 'expense' ? 'bg-red-100' :
                        entry.type === 'saving' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {entry.type === 'income' ? '💰' : entry.type === 'expense' ? '💸' : entry.type === 'saving' ? '🏦' : '📈'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{entry.description || entry.category}</p>
                        <p className="text-xs text-gray-500">{entry.category}</p>
                      </div>
                      <span className={`font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString()}
                      </span>
                      <button onClick={() => deleteFinanceEntry(entry.id)} className="p-1 hover:bg-red-50 rounded text-red-400">
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

      {/* 7 Rules Tab */}
      {activeTab === 'rules' && (
        <div>
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">The Richest Man in Babylon</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">7 правил управління грошима від Джорджа Клейсона</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {SEVEN_RULES.map((item, index) => (
              <button
                key={item.key}
                onClick={() => toggleSevenRule(item.key)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  finance.sevenRulesCompleted[item.key]
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">Правило {index + 1}</span>
                  </div>
                  <p className={`font-semibold text-lg ${finance.sevenRulesCompleted[item.key] ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {item.rule}
                  </p>
                </div>
                {finance.sevenRulesCompleted[item.key] && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Виконано: {Object.values(finance.sevenRulesCompleted).filter(Boolean).length} / {SEVEN_RULES.length} правил
            </p>
          </div>
        </div>
      )}

      {/* FIRE Tab */}
      {activeTab === 'fire' && (
        <div>
          <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="py-4">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">FIRE — Financial Independence, Retire Early</h3>
              <p className="text-sm text-orange-700 dark:text-orange-400">Розрахуйте скільки потрібно для фінансової свободи</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" /> FIRE Калькулятор
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Річні витрати ($)" type="number" value={finance.fireData.annualExpenses} onChange={e => updateFireData({ annualExpenses: Number(e.target.value) })} />
                <Input label="Поточні заощадження ($)" type="number" value={finance.fireData.currentSavings} onChange={e => updateFireData({ currentSavings: Number(e.target.value) })} />
                <Input label="Річні заощадження ($)" type="number" value={finance.fireData.annualSavings} onChange={e => updateFireData({ annualSavings: Number(e.target.value) })} />
                <Input label="Очікувана дохідність (%)" type="number" value={finance.fireData.expectedReturn} onChange={e => updateFireData({ expectedReturn: Number(e.target.value) })} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Результати</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
                    <p className="text-sm text-gray-500 mb-1">FI Number (25x витрат)</p>
                    <p className="text-3xl font-bold text-green-600">${fiNumber.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Правило 4%: потрібно для фін. свободи</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center">
                    <p className="text-sm text-gray-500 mb-1">Років до FIRE</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {yearsToFI > 0 && isFinite(yearsToFI) ? Math.ceil(yearsToFI) : '∞'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">При поточному темпі заощаджень</p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl text-center">
                    <p className="text-sm text-gray-500 mb-1">Прогрес до FI</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {fiNumber > 0 ? Math.min(100, Math.round((finance.fireData.currentSavings / fiNumber) * 100)) : 0}%
                    </p>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${Math.min(100, (finance.fireData.currentSavings / fiNumber) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Compound Interest */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      <strong>Compound Interest:</strong> ${finance.fireData.currentSavings.toLocaleString()} через 10 років при {finance.fireData.expectedReturn}% = $
                      {Math.round(finance.fireData.currentSavings * Math.pow(1 + finance.fireData.expectedReturn / 100, 10)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Новий фінансовий запис">
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'income', label: 'Дохід', emoji: '💰' },
                { value: 'expense', label: 'Витрата', emoji: '💸' },
                { value: 'saving', label: 'Заощадження', emoji: '🏦' },
                { value: 'investment', label: 'Інвестиція', emoji: '📈' },
              ].map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value as FinanceEntry['type'] })}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    form.type === t.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <p className="text-xs mt-1">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
          <Input label="Сума ($)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Категорія</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <option value="">Оберіть категорію</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Опис" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Деталі..." />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Скасувати</Button>
            <Button type="submit">Додати</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
