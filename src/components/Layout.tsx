import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Repeat, 
  BookOpen, 
  Sun,
  BarChart3,
  Trophy,
  Settings,
  Crown,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { LEVEL_NAMES, LEVEL_POINTS } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, currentView, setCurrentView } = useStore();

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Дашборд', view: 'dashboard' },
    { icon: <Sun className="w-5 h-5" />, label: 'Ранкова рутина', view: 'morning' },
    { icon: <Target className="w-5 h-5" />, label: 'Цілі', view: 'goals' },
    { icon: <Repeat className="w-5 h-5" />, label: 'Звички', view: 'habits' },
    { icon: <CheckSquare className="w-5 h-5" />, label: 'Завдання', view: 'tasks' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Журнал', view: 'journal' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Аналітика', view: 'analytics' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Досягнення', view: 'achievements' },
  ];

  const currentLevel = user?.level || 1;
  const currentPoints = user?.totalPoints || 0;
  const nextLevelPoints = LEVEL_POINTS[currentLevel + 1] || LEVEL_POINTS[10];
  const currentLevelPoints = LEVEL_POINTS[currentLevel];
  const progressToNextLevel = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Peak Performer</h1>
              <p className="text-xs text-gray-500">Система успіху</p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        {user && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{LEVEL_NAMES[currentLevel]}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Рівень {currentLevel}</span>
                <span>{currentPoints.toLocaleString()} XP</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progressToNextLevel)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              icon={item.icon}
              label={item.label}
              view={item.view}
              active={currentView === item.view}
              onClick={() => setCurrentView(item.view)}
            />
          ))}
        </nav>

        {/* Premium CTA */}
        {user && !user.isPremium && (
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => setCurrentView('premium')}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg p-3 flex items-center justify-center gap-2 font-medium hover:from-amber-500 hover:to-orange-600 transition-colors"
            >
              <Crown className="w-5 h-5" />
              Отримати Premium
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="p-4 border-t border-gray-100">
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label="Налаштування"
            view="settings"
            active={currentView === 'settings'}
            onClick={() => setCurrentView('settings')}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
