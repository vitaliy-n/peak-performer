import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  Volume2,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';

interface TimerProps {
  duration: number;
  isRunning: boolean;
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, isRunning, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-4xl font-mono font-bold text-gray-900">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

const SAVERS_STEPS = [
  {
    key: 'silence',
    title: 'Тиша (Silence)',
    emoji: '🧘',
    duration: 10,
    description: 'Медитація, глибоке дихання або молитва',
    tips: [
      'Сядьте зручно з рівною спиною',
      'Закрийте очі та зосередьтеся на диханні',
      'Відпустіть всі думки і просто будьте присутні',
      'Можете використати техніку 4-7-8: вдих 4с, затримка 7с, видих 8с'
    ],
    benefit: 'Зменшує стрес, покращує ясність розуму'
  },
  {
    key: 'affirmations',
    title: 'Афірмації (Affirmations)',
    emoji: '💬',
    duration: 5,
    description: 'Повторюйте позитивні твердження вголос',
    tips: [
      'Говоріть у теперішньому часі: "Я є...", "Я маю..."',
      'Додайте емоції до слів',
      'Стійте прямо, дивіться в дзеркало',
      'Повторюйте свою місію та цілі'
    ],
    affirmations: [
      'Я здатен досягти будь-якої цілі, яку ставлю перед собою',
      'Кожен день я стаю кращою версією себе',
      'Я приймаю рішення швидко і впевнено',
      'Я притягую успіх, багатство та щастя',
      'Я вдячний за все, що маю в своєму житті'
    ],
    benefit: 'Програмує підсвідомість на успіх'
  },
  {
    key: 'visualization',
    title: 'Візуалізація (Visualization)',
    emoji: '🎯',
    duration: 5,
    description: 'Уявіть досягнення своїх цілей',
    tips: [
      'Закрийте очі та уявіть свій ідеальний день',
      'Відчуйте емоції від досягнення цілей',
      'Уявіть себе через 1 рік, 5 років, 10 років',
      'Візуалізуйте конкретні кроки до успіху'
    ],
    questions: [
      'Як виглядає ваше ідеальне життя?',
      'Що ви відчуваєте, досягнувши своєї головної цілі?',
      'Хто ви в своїй найкращій версії?'
    ],
    benefit: 'Активує RAS для пошуку можливостей'
  },
  {
    key: 'exercise',
    title: 'Вправи (Exercise)',
    emoji: '💪',
    duration: 20,
    description: 'Фізична активність для енергії',
    tips: [
      'Почніть з розминки',
      'Можна: йога, біг, HIIT, стрибки',
      'Головне - рух та підвищення пульсу',
      'Завершіть розтяжкою'
    ],
    exercises: [
      '20 присідань',
      '10 віджимань',
      '30 секунд планка',
      '20 випадів',
      '30 jumping jacks'
    ],
    benefit: 'Виробляє BDNF, дофамін, знижує кортизол'
  },
  {
    key: 'reading',
    title: 'Читання (Reading)',
    emoji: '📚',
    duration: 20,
    description: 'Читайте книги про саморозвиток',
    tips: [
      'Читайте мінімум 10 сторінок',
      'Робіть нотатки ключових ідей',
      'Застосовуйте прочитане сьогодні',
      '10 сторінок/день = 18+ книг на рік'
    ],
    recommendations: [
      '"Eat That Frog" - Brian Tracy',
      '"Atomic Habits" - James Clear',
      '"The 7 Habits" - Stephen Covey',
      '"Think and Grow Rich" - Napoleon Hill',
      '"Deep Work" - Cal Newport'
    ],
    benefit: 'Постійне навчання = постійний ріст'
  },
  {
    key: 'scribing',
    title: 'Журнал (Scribing)',
    emoji: '✍️',
    duration: 10,
    description: 'Записуйте думки, ідеї, вдячність',
    tips: [
      'Запишіть 3 речі, за які вдячні',
      'Визначте 3 пріоритети на день',
      'Напишіть свою "жабу" дня',
      'Зафіксуйте ідеї та інсайти'
    ],
    prompts: [
      'За що я вдячний сьогодні?',
      'Яка моя головна ціль на сьогодні?',
      'Хто я хочу бути сьогодні?',
      'Що я можу зробити для інших?'
    ],
    benefit: 'Ясність думок, фокус на головному'
  }
];

export const MorningRoutine: React.FC = () => {
  const { updateTodayLog, getTodayLog, addPoints } = useStore();
  const todayLog = getTodayLog();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const step = SAVERS_STEPS[currentStep];

  const completedSteps = [
    todayLog?.silenceCompleted,
    todayLog?.affirmationsCompleted,
    todayLog?.visualizationCompleted,
    todayLog?.exerciseCompleted,
    todayLog?.readingCompleted,
    todayLog?.scribingCompleted,
  ];

  const handleComplete = () => {
    setIsTimerRunning(false);
    const updates: Record<string, boolean> = {};
    
    switch (step.key) {
      case 'silence':
        updates.silenceCompleted = true;
        break;
      case 'affirmations':
        updates.affirmationsCompleted = true;
        break;
      case 'visualization':
        updates.visualizationCompleted = true;
        break;
      case 'exercise':
        updates.exerciseCompleted = true;
        break;
      case 'reading':
        updates.readingCompleted = true;
        break;
      case 'scribing':
        updates.scribingCompleted = true;
        break;
    }
    
    updateTodayLog(updates);
    
    if (currentStep < SAVERS_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }

    const allCompleted = completedSteps.filter(Boolean).length === 5;
    if (allCompleted) {
      addPoints(50);
    }
  };

  const handleSkip = () => {
    if (currentStep < SAVERS_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          ☀️ Ранкова рутина SAVERS
        </h1>
        <p className="text-gray-500 mt-1">
          Miracle Morning за методологією Хела Елрода
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Прогрес</span>
          <span className="text-sm text-gray-500">
            {completedSteps.filter(Boolean).length} / 6 виконано
          </span>
        </div>
        <div className="flex gap-2">
          {SAVERS_STEPS.map((s, index) => (
            <button
              key={s.key}
              onClick={() => {
                setCurrentStep(index);
                setIsTimerRunning(false);
              }}
              className={`flex-1 h-3 rounded-full transition-colors ${
                completedSteps[index]
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {SAVERS_STEPS.map((s, index) => (
            <span 
              key={s.key}
              className={`text-lg ${
                completedSteps[index] ? 'opacity-50' : ''
              } ${index === currentStep ? 'scale-125' : ''} transition-transform`}
            >
              {s.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{step.emoji}</span>
              {step.title}
            </CardTitle>
            <span className="text-sm text-gray-500">{step.duration} хвилин</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{step.description}</p>

          {/* Timer */}
          <div className="flex flex-col items-center py-8 bg-gray-50 rounded-xl mb-6">
            <Timer 
              duration={step.duration} 
              isRunning={isTimerRunning}
              onComplete={handleComplete}
            />
            <div className="flex items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTimerRunning(false)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-32"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" /> Пауза
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" /> Старт
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <span className="font-medium">Поради та інструкції</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              {/* Tips */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Як виконувати:</h4>
                <ul className="space-y-1">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Affirmations */}
              {'affirmations' in step && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Приклади афірмацій:</h4>
                  <ul className="space-y-1">
                    {step.affirmations?.map((a, i) => (
                      <li key={i} className="text-gray-600 italic">"{a}"</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions */}
              {'questions' in step && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Питання для візуалізації:</h4>
                  <ul className="space-y-1">
                    {step.questions?.map((q, i) => (
                      <li key={i} className="text-gray-600">{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exercises */}
              {'exercises' in step && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Швидке тренування:</h4>
                  <ul className="space-y-1">
                    {step.exercises?.map((e, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Book recommendations */}
              {'recommendations' in step && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Рекомендовані книги:</h4>
                  <ul className="space-y-1">
                    {step.recommendations?.map((r, i) => (
                      <li key={i} className="text-gray-600">📖 {r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Journal prompts */}
              {'prompts' in step && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Питання для журналу:</h4>
                  <ul className="space-y-1">
                    {step.prompts?.map((p, i) => (
                      <li key={i} className="text-gray-600">{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefit */}
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">✨ Користь: </span>
                <span className="text-green-600">{step.benefit}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={currentStep === SAVERS_STEPS.length - 1}
            >
              Пропустити
            </Button>
            <Button
              variant="primary"
              onClick={handleComplete}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Виконано
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Всі етапи SAVERS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SAVERS_STEPS.map((s, index) => (
              <button
                key={s.key}
                onClick={() => {
                  setCurrentStep(index);
                  setIsTimerRunning(false);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  completedSteps[index]
                    ? 'bg-green-50 border-green-200'
                    : index === currentStep
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{s.emoji}</div>
                <div className="font-medium text-gray-900 text-sm">{s.title.split(' ')[0]}</div>
                <div className="text-xs text-gray-500">{s.duration} хв</div>
                {completedSteps[index] && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-2 mx-auto" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
