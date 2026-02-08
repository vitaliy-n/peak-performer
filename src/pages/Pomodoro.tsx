import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee,
  Brain,
  CheckCircle2,
  Settings2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '../components/ui';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLong: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLong: 4,
};

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Робота',
  shortBreak: 'Коротка перерва',
  longBreak: 'Довга перерва',
};

const MODE_COLORS: Record<TimerMode, { bg: string; ring: string; text: string }> = {
  work: { bg: 'from-red-500 to-orange-500', ring: '#EF4444', text: 'text-red-600' },
  shortBreak: { bg: 'from-green-500 to-emerald-500', ring: '#10B981', text: 'text-green-600' },
  longBreak: { bg: 'from-blue-500 to-indigo-500', ring: '#3B82F6', text: 'text-blue-600' },
};

export const Pomodoro: React.FC = () => {
  const { addPoints } = useStore();
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalPomodorosToday, setTotalPomodorosToday] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionLog, setSessionLog] = useState<{ mode: TimerMode; task: string; completedAt: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getDuration = useCallback((m: TimerMode) => {
    switch (m) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
    }
  }, [settings]);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
        osc2.stop(ctx.currentTime + 1);
      }, 300);
    } catch {
      // Audio not supported
    }
  }, [soundEnabled]);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    playSound();

    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      setTotalPomodorosToday(prev => prev + 1);
      addPoints(20);

      setSessionLog(prev => [...prev, {
        mode: 'work',
        task: currentTask || 'Без назви',
        completedAt: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      }]);

      if (newCompleted % settings.pomodorosUntilLong === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  }, [mode, completedPomodoros, settings, playSound, addPoints, currentTask]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const skipToNext = () => {
    setIsRunning(false);
    if (mode === 'work') {
      if ((completedPomodoros + 1) % settings.pomodorosUntilLong === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalDuration = getDuration(mode);
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const colors = MODE_COLORS[mode];

  const circumference = 2 * Math.PI * 140;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          🍅 Помодоро Таймер
        </h1>
        <p className="text-gray-500 mt-1">
          Техніка Pomodoro: 25 хв роботи → 5 хв перерва → повторити
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              mode === m
                ? `bg-white shadow-sm ${MODE_COLORS[m].text}`
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m === 'work' && <Brain className="w-4 h-4 inline mr-2" />}
            {m === 'shortBreak' && <Coffee className="w-4 h-4 inline mr-2" />}
            {m === 'longBreak' && <Coffee className="w-4 h-4 inline mr-2" />}
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="py-8">
              {/* Current Task */}
              <div className="mb-8">
                <input
                  type="text"
                  value={currentTask}
                  onChange={e => setCurrentTask(e.target.value)}
                  placeholder="Над чим працюєте? (необов'язково)"
                  className="w-full text-center text-lg px-4 py-2 border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>

              {/* Circular Timer */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg width="320" height="320" className="transform -rotate-90">
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="#E5E7EB"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke={colors.ring}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-mono font-bold text-gray-900">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-medium mt-2 ${colors.text}`}>
                      {MODE_LABELS[mode]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={resetTimer}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Скинути"
                >
                  <RotateCcw className="w-6 h-6 text-gray-500" />
                </button>

                <button
                  onClick={toggleTimer}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 bg-gradient-to-br ${colors.bg}`}
                >
                  {isRunning ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>

                <button
                  onClick={skipToNext}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  title="Пропустити"
                >
                  <SkipForward className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Sound toggle */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  Звук {soundEnabled ? 'увімкнено' : 'вимкнено'}
                </button>
              </div>

              {/* Pomodoro dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: settings.pomodorosUntilLong }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all ${
                      i < (completedPomodoros % settings.pomodorosUntilLong)
                        ? 'bg-red-500 scale-110'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {completedPomodoros % settings.pomodorosUntilLong} / {settings.pomodorosUntilLong}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Settings */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Сьогодні</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-gray-900">{totalPomodorosToday}</p>
                <p className="text-sm text-gray-500">помодоро завершено</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-lg font-bold text-red-600">
                    {totalPomodorosToday * settings.workDuration}
                  </p>
                  <p className="text-xs text-gray-500">хв роботи</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">
                    {totalPomodorosToday * 20}
                  </p>
                  <p className="text-xs text-gray-500">XP зароблено</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Налаштування</span>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Settings2 className="w-5 h-5 text-gray-400" />
                </button>
              </CardTitle>
            </CardHeader>
            {showSettings && (
              <CardContent className="space-y-3">
                <Input
                  label="Робота (хвилини)"
                  type="number"
                  value={settings.workDuration}
                  onChange={e => {
                    const val = Math.max(1, Number(e.target.value));
                    setSettings(s => ({ ...s, workDuration: val }));
                    if (mode === 'work' && !isRunning) setTimeLeft(val * 60);
                  }}
                />
                <Input
                  label="Коротка перерва (хвилини)"
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={e => {
                    const val = Math.max(1, Number(e.target.value));
                    setSettings(s => ({ ...s, shortBreakDuration: val }));
                    if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                />
                <Input
                  label="Довга перерва (хвилини)"
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={e => {
                    const val = Math.max(1, Number(e.target.value));
                    setSettings(s => ({ ...s, longBreakDuration: val }));
                    if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                />
                <Input
                  label="Помодоро до довгої перерви"
                  type="number"
                  value={settings.pomodorosUntilLong}
                  onChange={e => {
                    const val = Math.max(1, Number(e.target.value));
                    setSettings(s => ({ ...s, pomodorosUntilLong: val }));
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSettings(DEFAULT_SETTINGS);
                    if (!isRunning) setTimeLeft(getDuration(mode));
                  }}
                  className="w-full"
                >
                  Скинути до стандартних
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Session Log */}
          {sessionLog.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Журнал сесій</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sessionLog.slice().reverse().map((session, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.task}
                        </p>
                        <p className="text-xs text-gray-500">{session.completedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tips */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Правила Pomodoro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: '🎯', title: 'Одне завдання', desc: 'Працюйте лише над одним завданням за помодоро' },
              { icon: '🚫', title: 'Без переривань', desc: 'Ніяких відволікань під час робочої сесії' },
              { icon: '🔄', title: 'Перервано — перезапустіть', desc: 'Якщо вас перервали, почніть помодоро заново' },
              { icon: '📊', title: 'Відстежуйте', desc: 'Записуйте кількість завершених помодоро' },
            ].map((tip, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                <span className="text-2xl">{tip.icon}</span>
                <p className="font-medium text-gray-900 mt-2">{tip.title}</p>
                <p className="text-sm text-gray-500 mt-1">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
