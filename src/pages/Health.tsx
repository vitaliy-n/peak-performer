import React, { useState, useEffect } from 'react';
import {
  Moon,
  Dumbbell,
  Wind,
  Battery,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Snowflake,
  UtensilsCrossed,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components/ui';
import type { ExerciseEntry, SleepEntry } from '../types';

const BREATHING_EXERCISES = [
  { name: 'Box Breathing (Navy SEALs)', pattern: '4-4-4-4', description: 'Вдих 4с → Затримка 4с → Видих 4с → Затримка 4с', phases: [4, 4, 4, 4] },
  { name: '4-7-8 (Засинання)', pattern: '4-7-8', description: 'Вдих 4с → Затримка 7с → Видих 8с', phases: [4, 7, 8, 0] },
  { name: 'Coherent Breathing', pattern: '5.5-5.5', description: 'Вдих 5.5с → Видих 5.5с (5.5 вдихів/хв)', phases: [5, 0, 5, 0] },
];

const SLEEP_HYGIENE_TIPS = [
  { tip: 'Температура 18-20°C у спальні', checked: false },
  { tip: 'Темрява — блокуйте все світло', checked: false },
  { tip: 'Немає екранів за 1 годину до сну', checked: false },
  { tip: 'Однаковий час сну кожен день', checked: false },
  { tip: 'Немає кофеїну після 14:00', checked: false },
  { tip: 'Немає алкоголю перед сном', checked: false },
];

export const Health: React.FC = () => {
  const { 
    health, 
    addSleepEntry, 
    addExerciseEntry, 
    logEnergy, 
    startFasting, 
    endFasting, 
    addPoints
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'sleep' | 'exercise' | 'breathing' | 'energy' | 'fasting'>('sleep');

  // Sleep state forms
  const [sleepForm, setSleepForm] = useState({ bedtime: '23:00', wakeTime: '07:00', quality: 7 });
  const [hygieneChecks, setHygieneChecks] = useState<boolean[]>(SLEEP_HYGIENE_TIPS.map(() => false));

  // Exercise state forms
  const [exerciseForm, setExerciseForm] = useState({ type: 'Кардіо', duration: 30, intensity: 'medium' as ExerciseEntry['intensity'] });

  // Breathing state
  const [selectedBreathing, setSelectedBreathing] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2'>('idle');
  const [breathTimer, setBreathTimer] = useState(0);
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathCycles, setBreathCycles] = useState(0);

  // Energy state forms
  const [energyForm, setEnergyForm] = useState({ physical: 7, emotional: 7, mental: 7, spiritual: 7 });

  // Fasting state
  const [fastingElapsed, setFastingElapsed] = useState(0);
  const [selectedFastingWindow, setSelectedFastingWindow] = useState(16);
  
  // Breathing timer
  useEffect(() => {
    if (!breathRunning) return;
    const exercise = BREATHING_EXERCISES[selectedBreathing];
    const phases = exercise.phases;
    const phaseNames: ('inhale' | 'hold1' | 'exhale' | 'hold2')[] = ['inhale', 'hold1', 'exhale', 'hold2'];

    let currentPhaseIdx = phaseNames.indexOf(breathPhase === 'idle' ? 'inhale' : breathPhase);
    if (currentPhaseIdx < 0) currentPhaseIdx = 0;

    if (breathPhase === 'idle') {
      setBreathPhase('inhale');
      setBreathTimer(phases[0]);
      return;
    }

    const interval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          let nextIdx = currentPhaseIdx + 1;
          if (nextIdx >= 4) {
            nextIdx = 0;
            setBreathCycles(c => c + 1);
          }
          // Skip phases with 0 duration
          while (phases[nextIdx] === 0 && nextIdx < 4) {
            nextIdx++;
            if (nextIdx >= 4) {
              nextIdx = 0;
              setBreathCycles(c => c + 1);
            }
          }
          setBreathPhase(phaseNames[nextIdx]);
          return phases[nextIdx];
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathRunning, breathPhase, selectedBreathing]);

  // Fasting timer
  useEffect(() => {
    if (!health.fasting.isFasting || !health.fasting.startTime) {
      setFastingElapsed(0);
      return;
    }
    
    // Initial calculation
    setFastingElapsed(Math.floor((Date.now() - new Date(health.fasting.startTime).getTime()) / 1000));

    const interval = setInterval(() => {
      if (health.fasting.startTime) {
        const elapsed = Math.floor((Date.now() - new Date(health.fasting.startTime).getTime()) / 1000);
        setFastingElapsed(elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [health.fasting.isFasting, health.fasting.startTime]);

  const handleAddSleep = () => {
    const [bh, bm] = sleepForm.bedtime.split(':').map(Number);
    const [wh, wm] = sleepForm.wakeTime.split(':').map(Number);
    let hours = wh - bh + (wm - bm) / 60;
    if (hours < 0) hours += 24;

    addSleepEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime: sleepForm.bedtime,
      wakeTime: sleepForm.wakeTime,
      quality: sleepForm.quality,
      hoursSlept: Math.round(hours * 10) / 10,
    });
  };

  const handleAddExercise = () => {
    addExerciseEntry({
      date: new Date().toISOString().split('T')[0],
      type: exerciseForm.type,
      duration: exerciseForm.duration,
      intensity: exerciseForm.intensity,
    });
  };

  const handleLogEnergy = () => {
    logEnergy(energyForm);
  };

  const startBreathing = () => {
    if (breathRunning) {
      setBreathRunning(false);
      setBreathPhase('idle');
      setBreathTimer(0);
      setBreathCycles(0);
    } else {
      setBreathRunning(true);
      setBreathCycles(0);
    }
  };

  const handleToggleFasting = () => {
    if (health.fasting.isFasting) {
      endFasting(new Date().toISOString());
    } else {
      startFasting(new Date().toISOString(), selectedFastingWindow);
    }
  };

  const formatFastingTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const breathPhaseLabel = {
    idle: 'Готово', inhale: 'ВДИХ', hold1: 'ЗАТРИМКА', exhale: 'ВИДИХ', hold2: 'ЗАТРИМКА',
  };

  const breathPhaseColor = {
    idle: 'text-gray-500', inhale: 'text-blue-600', hold1: 'text-amber-600', exhale: 'text-green-600', hold2: 'text-purple-600',
  };

  const tabs = [
    { key: 'sleep', label: 'Сон', icon: Moon },
    { key: 'exercise', label: 'Вправи', icon: Dumbbell },
    { key: 'breathing', label: 'Дихання', icon: Wind },
    { key: 'energy', label: 'Енергія', icon: Battery },
    { key: 'fasting', label: 'IF', icon: UtensilsCrossed },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Здоров'я та енергія</h1>
          <p className="text-gray-500 mt-1">Why We Sleep + Breath + The Power of Full Engagement</p>
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
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sleep Tab */}
      {activeTab === 'sleep' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Трекер сну (Matthew Walker)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Час засинання" type="time" value={sleepForm.bedtime} onChange={e => setSleepForm({ ...sleepForm, bedtime: e.target.value })} />
                <Input label="Час пробудження" type="time" value={sleepForm.wakeTime} onChange={e => setSleepForm({ ...sleepForm, wakeTime: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Якість сну: {sleepForm.quality}/10</label>
                <input type="range" min="1" max="10" value={sleepForm.quality} onChange={e => setSleepForm({ ...sleepForm, quality: Number(e.target.value) })} className="w-full" />
              </div>
              <Button onClick={handleAddSleep} className="w-full"><Plus className="w-4 h-4 mr-2" /> Записати сон</Button>

              {health.sleep.length > 0 && (
                <div className="space-y-2 mt-4">
                  {health.sleep.slice(-5).reverse().map((entry: SleepEntry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{entry.hoursSlept} годин</p>
                        <p className="text-xs text-gray-500">{entry.bedtime} → {entry.wakeTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Якість: {entry.quality}/10</p>
                        <p className="text-xs text-gray-500">{entry.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Sleep Hygiene Checklist</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SLEEP_HYGIENE_TIPS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const newChecks = [...hygieneChecks];
                      newChecks[i] = !newChecks[i];
                      setHygieneChecks(newChecks);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      hygieneChecks[i] ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {hygieneChecks[i] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={hygieneChecks[i] ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-700 dark:text-gray-300'}>
                      {item.tip}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                {hygieneChecks.filter(Boolean).length}/{SLEEP_HYGIENE_TIPS.length} виконано
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exercise Tab */}
      {activeTab === 'exercise' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Трекер вправ (Spark — John Ratey)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>BDNF:</strong> 30 хв кардіо = підвищення когнітивних функцій на 2-3 години
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип вправи</label>
                <select value={exerciseForm.type} onChange={e => setExerciseForm({ ...exerciseForm, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {['Кардіо', 'Силові', 'HIIT', 'Йога', 'Біг', 'Плавання', 'Ходьба', 'Розтяжка', 'Інше'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input label="Тривалість (хвилини)" type="number" value={exerciseForm.duration} onChange={e => setExerciseForm({ ...exerciseForm, duration: Number(e.target.value) })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Інтенсивність</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExerciseForm({ ...exerciseForm, intensity: level })}
                      className={`py-2 rounded-lg border-2 font-medium ${
                        exerciseForm.intensity === level
                          ? level === 'low' ? 'border-green-500 bg-green-50 text-green-700' :
                            level === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                            'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {level === 'low' ? 'Легка' : level === 'medium' ? 'Середня' : 'Висока'}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddExercise} className="w-full"><Plus className="w-4 h-4 mr-2" /> Записати тренування</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Історія тренувань</CardTitle></CardHeader>
            <CardContent>
              {health.exercise.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Ще немає записів</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {health.exercise.slice().reverse().map((entry: ExerciseEntry) => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{entry.type}</p>
                        <p className="text-xs text-gray-500">{entry.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entry.duration} хв</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          entry.intensity === 'high' ? 'bg-red-100 text-red-700' :
                          entry.intensity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>{entry.intensity === 'low' ? 'Легка' : entry.intensity === 'medium' ? 'Середня' : 'Висока'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Всього: <strong>{health.exercise.reduce((s: number, e: ExerciseEntry) => s + e.duration, 0)} хв</strong> за {health.exercise.length} тренувань
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breathing Tab */}
      {activeTab === 'breathing' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader><CardTitle>Дихальні практики (James Nestor — Breath)</CardTitle></CardHeader>
            <CardContent>
              {/* Exercise selector */}
              <div className="grid grid-cols-1 gap-2 mb-6">
                {BREATHING_EXERCISES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedBreathing(i); if (breathRunning) { setBreathRunning(false); setBreathPhase('idle'); } }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedBreathing === i ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{ex.name}</p>
                    <p className="text-sm text-gray-500">{ex.description}</p>
                  </button>
                ))}
              </div>

              {/* Timer visual */}
              <div className="flex flex-col items-center py-8">
                <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-8 transition-all duration-1000 ${
                  breathPhase === 'inhale' ? 'border-blue-400 scale-110 bg-blue-50 dark:bg-blue-900/20' :
                  breathPhase === 'exhale' ? 'border-green-400 scale-90 bg-green-50 dark:bg-green-900/20' :
                  breathPhase === 'hold1' || breathPhase === 'hold2' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' :
                  'border-gray-300 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <span className={`text-lg font-bold ${breathPhaseColor[breathPhase]}`}>
                    {breathPhaseLabel[breathPhase]}
                  </span>
                  <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {breathTimer}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-4">Циклів: {breathCycles}</p>
                <Button onClick={startBreathing} className="mt-4">
                  {breathRunning ? <><Pause className="w-4 h-4 mr-2" /> Зупинити</> : <><Play className="w-4 h-4 mr-2" /> Почати</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Energy Tab */}
      {activeTab === 'energy' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader><CardTitle>Управління енергією (Jim Loehr — The Power of Full Engagement)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500">Оцініть кожен вимір енергії від 1 до 10</p>
              {([
                { key: 'physical', label: 'Фізична енергія', emoji: '💪', color: 'text-red-600' },
                { key: 'emotional', label: 'Емоційна енергія', emoji: '❤️', color: 'text-pink-600' },
                { key: 'mental', label: 'Ментальна енергія', emoji: '🧠', color: 'text-blue-600' },
                { key: 'spiritual', label: 'Духовна енергія', emoji: '✨', color: 'text-purple-600' },
              ] as const).map(item => (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.emoji} {item.label}</span>
                    <span className={`font-bold ${item.color}`}>{energyForm[item.key as keyof typeof energyForm]}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={energyForm[item.key as keyof typeof energyForm]}
                    onChange={e => setEnergyForm({ ...energyForm, [item.key]: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-1">Загальна енергія</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round((energyForm.physical + energyForm.emotional + energyForm.mental + energyForm.spiritual) / 4 * 10) / 10}
                </p>
                <p className="text-sm text-gray-500">з 10</p>
              </div>

              <Button onClick={handleLogEnergy} className="w-full">Зберегти оцінку енергії</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fasting Tab */}
      {activeTab === 'fasting' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader><CardTitle>Інтервальне голодування (IF)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4 mb-6">
                {[16, 18, 20].map(hours => (
                  <button
                    key={hours}
                    onClick={() => setSelectedFastingWindow(hours)}
                    className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                      (health.fasting.isFasting ? health.fasting.targetDuration : selectedFastingWindow) === hours 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-500'
                    }`}
                    disabled={health.fasting.isFasting}
                  >
                    {hours}:{24 - hours}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center py-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                    <circle cx="96" cy="96" r="88" stroke={health.fasting.isFasting ? '#10B981' : '#D1D5DB'} strokeWidth="12" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - Math.min(1, fastingElapsed / ((health.fasting.targetDuration || selectedFastingWindow) * 3600)))}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                      {formatFastingTime(fastingElapsed)}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {health.fasting.isFasting ? health.fasting.targetDuration : selectedFastingWindow}:00:00
                    </span>
                  </div>
                </div>

                <Button onClick={handleToggleFasting} className="mt-6" variant={health.fasting.isFasting ? 'destructive' : 'primary'}>
                  {health.fasting.isFasting ? 'Завершити голодування' : 'Почати голодування'}
                </Button>

                {health.fasting.isFasting && fastingElapsed >= health.fasting.targetDuration * 3600 && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-center font-medium">
                    Вікно голодування завершено! Можете їсти.
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { time: '12 годин', benefit: 'Кетоз починається' },
                  { time: '16 годин', benefit: 'Autophagy активна' },
                  { time: '24 години', benefit: 'Максимальне очищення' },
                ].map(item => (
                  <div key={item.time} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.time}</p>
                    <p className="text-xs text-gray-500">{item.benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cold Exposure */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-cyan-500" /> Cold Exposure (Wim Hof)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Холодний душ: починайте з 30 секунд, поступово збільшуйте до 3 хвилин.
                Підвищує дофамін на 250%.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {['30 сек', '1 хв', '2 хв', '3 хв', '5 хв', '10 хв'].map(duration => (
                  <Button key={duration} variant="outline" size="sm" onClick={() => addPoints(10)}>
                    {duration} ❄️
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
