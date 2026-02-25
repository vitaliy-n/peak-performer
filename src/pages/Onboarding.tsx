import React, { useState } from 'react';
import { Zap, Target, Repeat, CheckCircle2, ChevronRight, ChevronLeft, Database } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Input, Textarea } from '../components/ui';

const STEPS = [
  {
    title: 'Ласкаво просимо!',
    subtitle: 'Peak Performer Pro допоможе вам досягти ваших цілей',
  },
  {
    title: 'Як вас звати?',
    subtitle: 'Давайте познайомимось',
  },
  {
    title: 'Ваша місія',
    subtitle: 'Begin with the end in mind (Stephen Covey)',
  },
  {
    title: 'Ваші цінності',
    subtitle: 'Що для вас найважливіше в житті?',
  },
  {
    title: 'Готово!',
    subtitle: 'Ви готові почати свій шлях до успіху',
  },
];

const SUGGESTED_VALUES = [
  'Чесність', 'Сім\'я', 'Здоров\'я', 'Розвиток', 'Свобода', 
  'Творчість', 'Успіх', 'Баланс', 'Знання', 'Вплив'
];

export const Onboarding: React.FC = () => {
  const { initUser, updateUser, loadSeedData } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleComplete = () => {
    // Batch all updates at the end
    initUser(name.trim() || 'Користувач', 'guest');
    updateUser({ 
      missionStatement: mission,
      coreValues: selectedValues 
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return true;
      case 3: return selectedValues.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {STEPS[step].title}
              </h1>
              <p className="text-gray-600 mb-8">
                {STEPS[step].subtitle}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Цілі</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <Repeat className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Звички</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Продуктивність</p>
                </div>
              </div>

              <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Методології:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Atomic Habits', '7 Habits', 'GTD', 'Eat That Frog', 'Deep Work'].map(m => (
                    <span key={m} className="px-2 py-1 bg-white rounded text-xs text-gray-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {STEPS[step].title}
              </h1>
              <p className="text-gray-600 mb-6">
                {STEPS[step].subtitle}
              </p>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше ім'я"
                className="text-lg"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Mission */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {STEPS[step].title}
              </h1>
              <p className="text-gray-600 mb-6">
                {STEPS[step].subtitle}
              </p>
              <Textarea
                value={mission}
                onChange={e => setMission(e.target.value)}
                placeholder="Моя місія в житті - це..."
                rows={4}
                className="mb-4"
              />
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Підказка:</strong> Подумайте, яким ви хочете бути через 10 років. 
                  Що скажуть люди на вашому ювілеї? Що для вас справді важливо?
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Values */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {STEPS[step].title}
              </h1>
              <p className="text-gray-600 mb-2">
                {STEPS[step].subtitle}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Оберіть до 5 цінностей
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_VALUES.map(value => (
                  <button
                    key={value}
                    onClick={() => toggleValue(value)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedValues.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {selectedValues.length > 0 && (
                <p className="text-sm text-gray-500">
                  Обрано: {selectedValues.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Вітаємо, {name}! 🎉
              </h1>
              <p className="text-gray-600 mb-8">
                {STEPS[step].subtitle}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ваш перший день:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-sm">1</span>
                    Виконайте ранкову рутину SAVERS
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm">2</span>
                    Створіть свою першу звичку
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">3</span>
                    Встановіть головну ціль
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm">4</span>
                    Визначте "жабу" дня
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4 mt-2">
                <button
                  onClick={() => {
                    loadSeedData();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Database className="w-4 h-4" />
                  Або завантажити демо-дані для ознайомлення
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 && step < 4 ? (
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="w-5 h-5 mr-1" />
                Назад
              </Button>
            ) : (
              <div />
            )}
            
            <Button 
              onClick={step === 4 ? handleComplete : handleNext}
              disabled={!canProceed()}
              className={step === 4 ? 'w-full' : ''}
            >
              {step === 0 ? 'Почати' : step === 4 ? 'Перейти до дашборду' : 'Далі'}
              {step < 4 && <ChevronRight className="w-5 h-5 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Skip */}
        {step > 0 && step < 4 && (
          <button
            onClick={() => {
              if (step === 1 && !name.trim()) {
                setName('Користувач');
              }
              setStep(4);
            }}
            className="w-full text-center text-gray-500 mt-4 hover:text-gray-700"
          >
            Пропустити налаштування
          </button>
        )}
      </div>
    </div>
  );
};
