import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Download,
  Trash2,
  Save,
  Database,
  Play
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '../components/ui';

export const Settings: React.FC = () => {
  const { user, updateUser, loadSeedData, clearAllData, habits, goals, tasks, projects, dailyLogs, journalEntries, achievements, inbox, theme, setTheme } = useStore();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    missionStatement: user?.missionStatement || '',
    wakeUpTime: user?.wakeUpTime || '05:00',
  });

  const [coreValues, setCoreValues] = useState<string>(
    user?.coreValues?.join(', ') || ''
  );

  const [notifications, setNotifications] = useState({
    morningReminder: true,
    habitReminders: true,
    goalReminders: true,
    weeklyReport: true,
    achievements: true,
  });

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      email: profileData.email,
      missionStatement: profileData.missionStatement,
      wakeUpTime: profileData.wakeUpTime,
      coreValues: coreValues.split(',').map(v => v.trim()).filter(Boolean),
    });
    alert('Профіль збережено!');
  };

  const handleExportData = () => {
    const data = {
      user,
      habits,
      goals,
      tasks,
      projects,
      dailyLogs,
      journalEntries,
      achievements,
      inbox,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peak-performer-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Ви впевнені, що хочете видалити всі дані? Цю дію неможливо скасувати!')) {
      clearAllData();
      window.location.reload();
    }
  };

  const handleLoadDemoData = () => {
    if (confirm('Це замінить всі поточні дані демонстраційними. Продовжити?')) {
      loadSeedData();
      window.location.reload();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Налаштування</h1>
        <p className="text-gray-500 mt-1">
          Персоналізуйте свій досвід
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Профіль
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ім'я"
              value={profileData.name}
              onChange={e => setProfileData({ ...profileData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={e => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>

          <Textarea
            label="Особиста місія (Stephen Covey)"
            value={profileData.missionStatement}
            onChange={e => setProfileData({ ...profileData, missionStatement: e.target.value })}
            placeholder="Моя місія в житті - це..."
            rows={3}
          />

          <Input
            label="Основні цінності (через кому)"
            value={coreValues}
            onChange={e => setCoreValues(e.target.value)}
            placeholder="Чесність, Розвиток, Сім'я, Здоров'я..."
          />

          <Input
            label="Час підйому"
            type="time"
            value={profileData.wakeUpTime}
            onChange={e => setProfileData({ ...profileData, wakeUpTime: e.target.value })}
          />

          <Button onClick={handleSaveProfile}>
            <Save className="w-4 h-4 mr-2" />
            Зберегти профіль
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Сповіщення
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'morningReminder', label: 'Ранкове нагадування', desc: 'Нагадування почати ранкову рутину' },
            { key: 'habitReminders', label: 'Нагадування про звички', desc: 'Нагадування виконати щоденні звички' },
            { key: 'goalReminders', label: 'Нагадування про цілі', desc: 'Щотижневі нагадування про прогрес цілей' },
            { key: 'weeklyReport', label: 'Тижневий звіт', desc: 'Підсумок вашого прогресу за тиждень' },
            { key: 'achievements', label: 'Досягнення', desc: 'Сповіщення про нові досягнення' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({
                  ...notifications,
                  [item.key]: !notifications[item.key as keyof typeof notifications]
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications] 
                      ? 'translate-x-7' 
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Вигляд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-8 bg-white border border-gray-200 rounded mb-2" />
              <p className="text-sm font-medium">Світла</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-8 bg-gray-800 rounded mb-2" />
              <p className="text-sm font-medium">Темна</p>
            </button>
            <button
              onClick={() => setTheme('auto')}
              className={`p-4 border-2 rounded-xl transition-colors ${
                theme === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2" />
              <p className="text-sm font-medium">Авто</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Мова
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="uk">🇺🇦 Українська</option>
            <option value="en">🇬🇧 English</option>
            <option value="pl">🇵🇱 Polski</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Приватність та безпека
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Аналітика використання</p>
              <p className="text-sm text-gray-500">Допоможіть нам покращити додаток</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-blue-600">
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-7" />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Cloud Sync</p>
              <p className="text-sm text-gray-500">Синхронізувати дані між пристроями</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-gray-300">
              <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-1" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Управління даними
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Експорт даних</p>
              <p className="text-sm text-gray-500">Завантажити всі ваші дані у форматі JSON</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Експорт
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div>
              <p className="font-medium text-red-600">Видалити всі дані</p>
              <p className="text-sm text-gray-500">Незворотно видалити всі ваші дані</p>
            </div>
            <Button variant="destructive" onClick={handleClearData}>
              <Trash2 className="w-4 h-4 mr-2" />
              Видалити
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Демонстраційні дані
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Завантажити демо-дані</p>
              <p className="text-sm text-gray-500">Заповнити додаток прикладами звичок, цілей, завдань та журналу</p>
            </div>
            <Button variant="outline" onClick={handleLoadDemoData}>
              <Play className="w-4 h-4 mr-2" />
              Завантажити
            </Button>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Що включено:</strong> 8 звичок з історією, 11 цілей по різних сферах життя, 
              12 завдань з пріоритетами, 14 днів щоденних логів SAVERS, 10 записів у журналі, 
              12 досягнень та список справ GTD.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="py-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Peak Performer Pro</h3>
          <p className="text-gray-500 mb-2">Версія 1.0.0</p>
          <p className="text-sm text-gray-400">
            Система особистого розвитку на основі найкращих методологій успіху
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600">Умови використання</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">Політика конфіденційності</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">Підтримка</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
