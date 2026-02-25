import type { StateCreator } from 'zustand';
import type { AppState } from '../types';
import type { Skill, FeynmanNote } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface LearningSlice {
  skills: Skill[];
  feynmanNotes: FeynmanNote[];
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addFeynmanNote: (note: Omit<FeynmanNote, 'id' | 'createdAt'>) => void;
  deleteFeynmanNote: (id: string) => void;
}

export const createLearningSlice: StateCreator<AppState, [], [], LearningSlice> = (set, get) => ({
  skills: [],
  feynmanNotes: [],

  addSkill: (skillData) => {
    set((state: AppState) => ({
      skills: [
        ...state.skills,
        {
          ...skillData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    get().addPoints(10);
  },

  updateSkill: (id, updates) => {
    set((state: AppState) => ({
      skills: state.skills.map((s: Skill) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteSkill: (id) => {
    set((state: AppState) => ({
      skills: state.skills.filter((s: Skill) => s.id !== id),
    }));
  },

  addFeynmanNote: (noteData) => {
    set((state: AppState) => ({
      feynmanNotes: [
        ...state.feynmanNotes,
        {
          ...noteData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    get().addPoints(15);
  },

  deleteFeynmanNote: (id) => {
    set((state: AppState) => ({
      feynmanNotes: state.feynmanNotes.filter((n: FeynmanNote) => n.id !== id),
    }));
  },
});
