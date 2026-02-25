import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import type { HealthState, SleepEntry, ExerciseEntry, EnergyLog, FastingLog } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface HealthSlice {
  health: HealthState;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  addExerciseEntry: (entry: Omit<ExerciseEntry, 'id'>) => void;
  logEnergy: (entry: Omit<EnergyLog, 'id' | 'date'>) => void;
  startFasting: (startTime: string, targetDuration: number) => void;
  endFasting: (endTime: string) => void;
  cancelFasting: () => void;
}

export const createHealthSlice: StateCreator<AppState, [], [], HealthSlice> = (set, get) => ({
  health: {
    sleep: [],
    exercise: [],
    energy: [],
    fasting: {
      isFasting: false,
      startTime: null,
      targetDuration: 16,
      history: [],
    },
  },

  addSleepEntry: (entry) => {
    set((state) => ({
      health: {
        ...state.health,
        sleep: [
          ...state.health.sleep,
          { ...entry, id: uuidv4() },
        ],
      },
    }));
    get().addPoints(10);
  },

  addExerciseEntry: (entry) => {
    set((state) => ({
      health: {
        ...state.health,
        exercise: [
          ...state.health.exercise,
          { ...entry, id: uuidv4() },
        ],
      },
    }));
    get().addPoints(15);
  },

  logEnergy: (entry) => {
    set((state) => ({
      health: {
        ...state.health,
        energy: [
          ...state.health.energy,
          {
            ...entry,
            id: uuidv4(),
            date: new Date().toISOString().split('T')[0],
          },
        ],
      },
    }));
    get().addPoints(5);
  },

  startFasting: (startTime, targetDuration) => {
    set((state) => ({
      health: {
        ...state.health,
        fasting: {
          ...state.health.fasting,
          isFasting: true,
          startTime,
          targetDuration,
        },
      },
    }));
  },

  endFasting: (endTime) => {
    const state = get();
    const { startTime, targetDuration } = state.health.fasting;

    if (!startTime) return;

    const durationSeconds = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
    
    // Bonus points if target reached
    if (durationSeconds >= targetDuration * 3600) {
      get().addPoints(30);
    } else {
      get().addPoints(10);
    }

    const newLog: FastingLog = {
      id: uuidv4(),
      startTime,
      endTime,
      durationSeconds,
      targetDuration,
    };

    set((state) => ({
      health: {
        ...state.health,
        fasting: {
          ...state.health.fasting,
          isFasting: false,
          startTime: null,
          history: [...state.health.fasting.history, newLog],
        },
      },
    }));
  },

  cancelFasting: () => {
    set((state) => ({
      health: {
        ...state.health,
        fasting: {
          ...state.health.fasting,
          isFasting: false,
          startTime: null,
        },
      },
    }));
  },
});
