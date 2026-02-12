import React, { useState } from 'react';
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
  Zap,
  Menu,
  X,
  Timer,
  ClipboardCheck,
  GraduationCap,
  DollarSign,
  Heart,
  Brain,
  Library
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { LEVEL_NAMES, LEVEL_POINTS } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: string;
  active: boolean;
  onClick: () => void;
  tourClass?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, tourClass }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${tourClass ?? ''} ${
      active
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
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
  const { user, currentView, setCurrentView, setTourRunning } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Дашборд', view: 'dashboard', tourClass: 'dashboard-tour' },
    { icon: <Sun className="w-5 h-5" />, label: 'Ранкова рутина', view: 'morning' },
    { icon: <Target className="w-5 h-5" />, label: 'Цілі', view: 'goals' },
    { icon: <Repeat className="w-5 h-5" />, label: 'Звички', view: 'habits', tourClass: 'habits-tour' },
    { icon: <CheckSquare className="w-5 h-5" />, label: 'Завдання', view: 'tasks' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Журнал', view: 'journal' },
    { icon: <Timer className="w-5 h-5" />, label: 'Помодоро', view: 'pomodoro' },
    { icon: <ClipboardCheck className="w-5 h-5" />, label: 'Тижневий огляд', view: 'weekly-review' },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Навчання', view: 'learning', tourClass: 'learning-tour' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Фінанси', view: 'finance', tourClass: 'finance-tour' },
    { icon: <Heart className="w-5 h-5" />, label: "Здоров'я", view: 'health', tourClass: 'health-tour' },
    { icon: <Brain className="w-5 h-5" />, label: 'Мислення', view: 'mindset', tourClass: 'mindset-tour' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Аналітика', view: 'analytics' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Досягнення', view: 'achievements' },
    { icon: <Library className="w-5 h-5" />, label: 'Бібліотека', view: 'library', tourClass: 'library-tour' },
  ];

  const currentLevel = user?.level || 1;
  const currentPoints = user?.totalPoints || 0;
  const nextLevelPoints = LEVEL_POINTS[currentLevel + 1] || LEVEL_POINTS[10];
  const currentLevelPoints = LEVEL_POINTS[currentLevel];
  const progressToNextLevel = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-gray-100">Peak Performer</h1>
              <p className="text-xs text-gray-500">Система успіху</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* User Stats */}
      {user && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
              <p className="text-sm text-gray-500">{LEVEL_NAMES[currentLevel]}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Рівень {currentLevel}</span>
              <span>{currentPoints.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressToNextLevel)}%` }}
              />
            </div>
            <button
              onClick={() => setTourRunning(true)}
              className="mt-3 w-full text-xs font-semibold px-3 py-2 bg-blue-100/70 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Почати тур
            </button>
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
            onClick={() => handleNavClick(item.view)}
            tourClass={item.tourClass}
          />
        ))}
      </nav>

      {/* Premium CTA */}
      {user && !user.isPremium && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => handleNavClick('premium')}
            className="premium-tour w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg p-3 flex items-center justify-center gap-2 font-medium hover:from-amber-500 hover:to-orange-600 transition-colors"
          >
            <Crown className="w-5 h-5" />
            Отримати Premium
          </button>
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Налаштування"
          view="settings"
          active={currentView === 'settings'}
          onClick={() => handleNavClick('settings')}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100">Peak Performer</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: static, Mobile: slide-over */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
