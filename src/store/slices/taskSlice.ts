import type { StateCreator } from 'zustand';
import type { Task } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { POINTS } from '../constants';

export interface TaskSlice {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'> & { id?: string }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  setFrogOfDay: (id: string) => void;
}

export const createTaskSlice: StateCreator<AppState, [], [], TaskSlice> = (set, get) => ({
  tasks: [],

  addTask: (taskData) => {
    const task: Task = {
      ...taskData,
      id: taskData.id || uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
    };
    set((state) => ({ tasks: [...state.tasks, task] }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  toggleTaskCompletion: (id) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return state;

      const wasCompleted = task.completed;
      
      if (!wasCompleted) {
        get().addPoints(task.isFrog ? POINTS.completeFrog : POINTS.completeTask);
        if (task.isFrog) {
          get().unlockAchievement('first_frog');
        }
      }

      return {
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
              }
            : t
        ),
      };
    });
  },

  setFrogOfDay: (id) => {
    set((state) => ({
      tasks: state.tasks.map((t) => ({
        ...t,
        isFrog: t.id === id,
      })),
    }));
  },
});
