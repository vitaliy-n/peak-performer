import type { StateCreator } from 'zustand';
import type { FinanceEntry, FinanceState, Investment } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface FinanceSlice {
  finance: FinanceState;
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id' | 'date'>) => void;
  updateFinanceEntry: (id: string, updates: Partial<FinanceEntry>) => void;
  deleteFinanceEntry: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id' | 'lastUpdated'>) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  toggleSevenRule: (ruleKey: string) => void;
  updateFireData: (data: Partial<FinanceState['fireData']>) => void;
}

export const createFinanceSlice: StateCreator<AppState, [], [], FinanceSlice> = (set, get) => ({
  finance: {
    entries: [],
    investments: [],
    sevenRulesCompleted: {},
    fireData: {
      annualExpenses: 30000,
      currentSavings: 10000,
      annualSavings: 15000,
      expectedReturn: 7,
    },
  },

  addFinanceEntry: (entry) => {
    set((state) => ({
      finance: {
        ...state.finance,
        entries: [...state.finance.entries, {
          ...entry,
          id: uuidv4(),
          date: new Date().toISOString(),
        }],
      },
    }));
    get().addPoints(5);
  },

  updateFinanceEntry: (id, updates) => {
    set((state) => ({
      finance: {
        ...state.finance,
        entries: state.finance.entries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        ),
      },
    }));
  },

  deleteFinanceEntry: (id) => {
    set((state) => ({
      finance: {
        ...state.finance,
        entries: state.finance.entries.filter((entry) => entry.id !== id),
      },
    }));
  },

  addInvestment: (investment) => {
    set((state: AppState) => ({
      finance: {
        ...state.finance,
        investments: [
          ...state.finance.investments,
          {
            ...investment,
            id: uuidv4(),
            lastUpdated: new Date().toISOString(),
          },
        ],
      },
    }));
    get().addPoints(10);
  },

  updateInvestment: (id, updates) => {
    set((state: AppState) => ({
      finance: {
        ...state.finance,
        investments: state.finance.investments.map((inv: Investment) =>
          inv.id === id
            ? { ...inv, ...updates, lastUpdated: new Date().toISOString() }
            : inv
        ),
      },
    }));
  },

  deleteInvestment: (id) => {
    set((state: AppState) => ({
      finance: {
        ...state.finance,
        investments: state.finance.investments.filter((inv: Investment) => inv.id !== id),
      },
    }));
  },

  toggleSevenRule: (ruleKey) => {
    set((state) => ({
      finance: {
        ...state.finance,
        sevenRulesCompleted: {
          ...state.finance.sevenRulesCompleted,
          [ruleKey]: !state.finance.sevenRulesCompleted[ruleKey],
        },
      },
    }));
    get().addPoints(5);
  },

  updateFireData: (data) => {
    set((state) => ({
      finance: {
        ...state.finance,
        fireData: {
          ...state.finance.fireData,
          ...data,
        },
      },
    }));
  },
});
