import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import {
  Dashboard,
  MorningRoutine,
  Goals,
  Habits,
  Tasks,
  Journal,
  Pomodoro,
  WeeklyReview,
  Analytics,
  Achievements,
  Premium,
  Settings,
  Onboarding,
} from './pages';

function App() {
  const { user, currentView, theme, setTheme } = useStore();

  // Restore persisted theme on mount
  useEffect(() => {
    setTheme(theme);
  }, []);

  // Show onboarding if no user
  if (!user) {
    return <Onboarding />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'morning':
        return <MorningRoutine />;
      case 'goals':
        return <Goals />;
      case 'habits':
        return <Habits />;
      case 'tasks':
        return <Tasks />;
      case 'journal':
        return <Journal />;
      case 'pomodoro':
        return <Pomodoro />;
      case 'weekly-review':
        return <WeeklyReview />;
      case 'analytics':
        return <Analytics />;
      case 'achievements':
        return <Achievements />;
      case 'premium':
        return <Premium />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
}

export default App
