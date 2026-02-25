import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import type { MindsetState, CookieJarEntry, DecisionEntry, Affirmation, Visualization } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface MindsetSlice {
  mindset: MindsetState;
  addCookieJarEntry: (entry: string) => void;
  deleteCookieJarEntry: (id: string) => void;
  addDecisionEntry: (entry: Omit<DecisionEntry, 'id' | 'date'>) => void;
  deleteDecisionEntry: (id: string) => void;
  addAffirmation: (text: string, category: Affirmation['category']) => void;
  deleteAffirmation: (id: string) => void;
  incrementAffirmationUsage: (id: string) => void;
  addVisualization: (visualization: Omit<Visualization, 'id'>) => void;
  deleteVisualization: (id: string) => void;
}

export const createMindsetSlice: StateCreator<AppState, [], [], MindsetSlice> = (set, get) => ({
  mindset: {
    cookieJar: [],
    decisions: [],
    affirmations: [
      { id: '1', text: 'Я здатний досягти будь-якої мети, яку поставлю перед собою.', category: 'confidence', usageCount: 0 },
      { id: '2', text: 'Я постійно вчуся і розвиваюсь.', category: 'growth', usageCount: 0 },
      { id: '3', text: 'Я вдячний за можливості, які приносить новий день.', category: 'gratitude', usageCount: 0 },
    ],
    visualizations: [
      { id: '1', title: 'Ідеальний день', description: 'Уявіть свій ідеальний день від пробудження до сну в деталях.', durationMinutes: 5 },
      { id: '2', title: 'Досягнення цілі', description: 'Візуалізуйте момент досягнення вашої головної цілі. Що ви відчуваєте?', durationMinutes: 3 },
    ],
  },

  addCookieJarEntry: (victory) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        cookieJar: [
          ...state.mindset.cookieJar,
          {
            id: uuidv4(),
            victory,
            date: new Date().toISOString(),
          },
        ],
      },
    }));
    get().addPoints(15);
  },

  deleteCookieJarEntry: (id) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        cookieJar: state.mindset.cookieJar.filter((c: CookieJarEntry) => c.id !== id),
      },
    }));
  },

  addDecisionEntry: (entry) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        decisions: [
          ...state.mindset.decisions,
          {
            ...entry,
            id: uuidv4(),
            date: new Date().toISOString(),
          },
        ],
      },
    }));
    get().addPoints(20);
  },

  deleteDecisionEntry: (id) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        decisions: state.mindset.decisions.filter((d: DecisionEntry) => d.id !== id),
      },
    }));
  },

  addAffirmation: (text, category) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        affirmations: [
          ...state.mindset.affirmations,
          {
            id: uuidv4(),
            text,
            category,
            usageCount: 0,
          },
        ],
      },
    }));
  },

  deleteAffirmation: (id) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        affirmations: state.mindset.affirmations.filter((a: Affirmation) => a.id !== id),
      },
    }));
  },

  incrementAffirmationUsage: (id) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        affirmations: state.mindset.affirmations.map((a: Affirmation) =>
          a.id === id ? { ...a, usageCount: a.usageCount + 1 } : a
        ),
      },
    }));
    get().addPoints(5);
  },

  addVisualization: (visualization) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        visualizations: [
          ...state.mindset.visualizations,
          {
            ...visualization,
            id: uuidv4(),
          },
        ],
      },
    }));
  },

  deleteVisualization: (id) => {
    set((state: AppState) => ({
      mindset: {
        ...state.mindset,
        visualizations: state.mindset.visualizations.filter((v: Visualization) => v.id !== id),
      },
    }));
  },
});
