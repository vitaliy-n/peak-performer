import type { StateCreator } from 'zustand';
import type { Project } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectSlice {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const createProjectSlice: StateCreator<AppState, [], [], ProjectSlice> = (set) => ({
  projects: [],

  addProject: (projectData) => {
    const project: Project = {
      ...projectData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    set((state) => ({ projects: [...state.projects, project] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },
});
