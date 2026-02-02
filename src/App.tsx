import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import {
  Dashboard,
  MorningRoutine,
  Goals,
  Habits,
  Tasks,
  Journal,
  Analytics,
  Achievements,
  Premium,
  Settings,
  Onboarding,
} from './pages';

function App() {
  const { user, currentView } = useStore();

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
