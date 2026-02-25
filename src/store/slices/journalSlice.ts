import type { StateCreator } from 'zustand';
import type { JournalEntry } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { POINTS } from '../constants';

export interface JournalSlice {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
}

export const createJournalSlice: StateCreator<AppState, [], [], JournalSlice> = (set, get) => ({
  journalEntries: [],

  addJournalEntry: (entryData) => {
    const entry: JournalEntry = {
      ...entryData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      get().addPoints(POINTS.journalEntry);
      const totalEntries = state.journalEntries.length + 1;
      if (totalEntries >= 10) {
        get().unlockAchievement('journaler');
      }
      return { journalEntries: [...state.journalEntries, entry] };
    });
  },

  updateJournalEntry: (id, updates) => {
    set((state) => ({
      journalEntries: state.journalEntries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  },

  deleteJournalEntry: (id) => {
    set((state) => ({
      journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
    }));
  },
});
