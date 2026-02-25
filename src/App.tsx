import { useEffect, Suspense, lazy } from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import {
  Dashboard,
  Onboarding,
} from './pages';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy loaded heavy pages
const MorningRoutine = lazy(() => import('./pages').then(module => ({ default: module.MorningRoutine })));
const Goals = lazy(() => import('./pages').then(module => ({ default: module.Goals })));
const Habits = lazy(() => import('./pages').then(module => ({ default: module.Habits })));
const Tasks = lazy(() => import('./pages').then(module => ({ default: module.Tasks })));
const Journal = lazy(() => import('./pages').then(module => ({ default: module.Journal })));
const Pomodoro = lazy(() => import('./pages').then(module => ({ default: module.Pomodoro })));
const WeeklyReview = lazy(() => import('./pages').then(module => ({ default: module.WeeklyReview })));
const Analytics = lazy(() => import('./pages').then(module => ({ default: module.Analytics })));
const Achievements = lazy(() => import('./pages').then(module => ({ default: module.Achievements })));
const Premium = lazy(() => import('./pages').then(module => ({ default: module.Premium })));
const Settings = lazy(() => import('./pages').then(module => ({ default: module.Settings })));
const Learning = lazy(() => import('./pages').then(module => ({ default: module.Learning })));
const Finance = lazy(() => import('./pages').then(module => ({ default: module.Finance })));
const Health = lazy(() => import('./pages').then(module => ({ default: module.Health })));
const Mindset = lazy(() => import('./pages').then(module => ({ default: module.Mindset })));
const Library = lazy(() => import('./pages').then(module => ({ default: module.Library })));
const AICoach = lazy(() => import('./pages').then(module => ({ default: module.AICoach })));
const TwelveWeekYearPage = lazy(() => import('./pages').then(module => ({ default: module.TwelveWeekYearPage })));

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

function App() {
  const { user, currentView, theme, setTheme, checkStreak } = useStore();

  // Restore persisted theme on mount and check streak
  useEffect(() => {
    setTheme(theme);
    if (user) {
      checkStreak();
    }
  }, [user?.id]); // Check streak when user loads/changes

  // Show onboarding if no user
  if (!user) {
    return <Onboarding />;
  }

  const getViewComponent = () => {
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
      case 'learning':
        return <Learning />;
      case 'finance':
        return <Finance />;
      case 'health':
        return <Health />;
      case 'mindset':
        return <Mindset />;
      case 'library':
        return <Library />;
      case 'ai-coach':
        return <AICoach />;
      case '12-week-year':
        return <TwelveWeekYearPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {getViewComponent()}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}

export default App
