import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useStore } from '../store/useStore';
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
  Timer,
  ClipboardCheck,
  GraduationCap,
  DollarSign,
  Heart,
  Brain,
  Library,
  Moon,
  Sun as SunIcon,
  Laptop,
  Bot,
  Calendar
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { setCurrentView, setTheme } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const pages = [
    { view: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { view: 'ai-coach', label: 'AI Coach', icon: Bot },
    { view: '12-week-year', label: '12-Тижневий Рік', icon: Calendar },
    { view: 'morning', label: 'Ранкова рутина', icon: Sun },
    { view: 'goals', label: 'Цілі', icon: Target },
    { view: 'habits', label: 'Звички', icon: Repeat },
    { view: 'tasks', label: 'Завдання', icon: CheckSquare },
    { view: 'journal', label: 'Журнал', icon: BookOpen },
    { view: 'pomodoro', label: 'Помодоро', icon: Timer },
    { view: 'weekly-review', label: 'Тижневий огляд', icon: ClipboardCheck },
    { view: 'learning', label: 'Навчання', icon: GraduationCap },
    { view: 'finance', label: 'Фінанси', icon: DollarSign },
    { view: 'health', label: "Здоров'я", icon: Heart },
    { view: 'mindset', label: 'Мислення', icon: Brain },
    { view: 'analytics', label: 'Аналітика', icon: BarChart3 },
    { view: 'achievements', label: 'Досягнення', icon: Trophy },
    { view: 'library', label: 'Бібліотека', icon: Library },
    { view: 'settings', label: 'Налаштування', icon: Settings },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3">
        <Command.Input 
          placeholder="Введіть команду або пошук..." 
          className="w-full px-2 py-4 text-base bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
      </div>
      
      <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2">
        <Command.Empty className="py-6 text-center text-sm text-gray-500">
          Нічого не знайдено.
        </Command.Empty>

        <Command.Group heading="Навігація" className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          {pages.map((page) => (
            <Command.Item
              key={page.view}
              onSelect={() => runCommand(() => setCurrentView(page.view))}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-400 cursor-pointer transition-colors"
            >
              <page.icon className="w-4 h-4" />
              {page.label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Тема" className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 mt-2">
          <Command.Item
            onSelect={() => runCommand(() => setTheme('light'))}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-400 cursor-pointer transition-colors"
          >
            <SunIcon className="w-4 h-4" />
            Світла
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => setTheme('dark'))}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-400 cursor-pointer transition-colors"
          >
            <Moon className="w-4 h-4" />
            Темна
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => setTheme('oled'))}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-400 cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 bg-black border border-gray-600 rounded-full" />
            OLED Black
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => setTheme('auto'))}
            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-400 cursor-pointer transition-colors"
          >
            <Laptop className="w-4 h-4" />
            Системна
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};
