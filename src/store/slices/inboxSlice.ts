import type { StateCreator } from 'zustand';
import type { AppState } from '../types';

export interface InboxSlice {
  inbox: string[];
  addToInbox: (item: string) => void;
  removeFromInbox: (index: number) => void;
  clearInbox: () => void;
}

export const createInboxSlice: StateCreator<AppState, [], [], InboxSlice> = (set) => ({
  inbox: [],

  addToInbox: (item) => {
    set((state) => ({ inbox: [...state.inbox, item] }));
  },

  removeFromInbox: (index) => {
    set((state) => ({
      inbox: state.inbox.filter((_, i) => i !== index),
    }));
  },

  clearInbox: () => {
    set({ inbox: [] });
  },
});
