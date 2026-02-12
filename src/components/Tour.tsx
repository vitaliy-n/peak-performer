import { useEffect } from 'react';
import { driver } from 'driver.js';
import type { Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useStore } from '../store/useStore';

interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    element: '.dashboard-tour',
    popover: {
      title: 'Головний дашборд',
      description: 'Центр управління днем: цитати, статистика, швидкі дії.',
      side: 'right',
    },
  },
  {
    element: '.habits-tour',
    popover: {
      title: 'Atomic Habits',
      description: 'Будуйте звички зі streak, 4 законами та identity-based підходом.',
      side: 'right',
    },
  },
  {
    element: '.learning-tour',
    popover: {
      title: 'Система навчання',
      description: 'The First 20 Hours, техніка Фейнмана та продвинутий трекер книг.',
      side: 'right',
    },
  },
  {
    element: '.finance-tour',
    popover: {
      title: 'Фінанси',
      description: 'Бюджет, 7 правил Вавилона, FIRE калькулятор та свідомі витрати.',
      side: 'right',
    },
  },
  {
    element: '.health-tour',
    popover: {
      title: 'Здоровʼя та енергія',
      description: 'Сон, вправи, дихання, енергетичні стани та протоколи відновлення.',
      side: 'right',
    },
  },
  {
    element: '.mindset-tour',
    popover: {
      title: 'Мислення',
      description: 'Ментальні моделі, стоїцизм, Power Questions, Decision Journal.',
      side: 'right',
    },
  },
  {
    element: '.library-tour',
    popover: {
      title: 'Бібліотека методологій',
      description: '60+ систем успіху з фільтрацією, пошуком та вибраними.',
      side: 'right',
    },
  },
  {
    element: '.premium-tour',
    popover: {
      title: 'Premium можливості',
      description: 'Розблокуйте AI Coach, інтеграції, сімейний доступ та більше XP.',
      side: 'top',
    },
  },
];

export const Tour: React.FC = () => {
  const { tourRunning, setTourRunning } = useStore();

  useEffect(() => {
    if (!tourRunning) {
      return;
    }

    const availableSteps = TOUR_STEPS.filter((step) => document.querySelector(step.element));

    if (availableSteps.length === 0) {
      setTourRunning(false);
      return;
    }

    const tourDriver: Driver = driver({
      showProgress: true,
      overlayOpacity: 0.55,
      allowClose: true,
      stageRadius: 8,
      popoverClass: 'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 shadow-xl rounded-xl',
      steps: availableSteps,
      onCloseClick: () => setTourRunning(false),
    });

    tourDriver.drive();

    return () => {
      tourDriver.destroy();
      setTourRunning(false);
    };
  }, [tourRunning, setTourRunning]);

  return null;
};
