import type { StateCreator } from 'zustand';
import type { AIChatMessage, AICoachState } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface AICoachSlice {
  aiCoach: AICoachState;
  addChatMessage: (message: Omit<AIChatMessage, 'id' | 'createdAt'>) => void;
  setAITyping: (isTyping: boolean) => void;
  clearChatHistory: () => void;
}

export const createAICoachSlice: StateCreator<AppState, [], [], AICoachSlice> = (set) => ({
  aiCoach: {
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Привіт! Я твій AI Coach. Я можу допомогти тобі з аналізом твоїх звичок, пояснити складні концепції (Feynman technique) або просто підтримати мотивацію. З чого почнемо?',
        createdAt: new Date().toISOString(),
        type: 'text',
      },
    ],
    isTyping: false,
  },

  addChatMessage: (message) => {
    set((state) => ({
      aiCoach: {
        ...state.aiCoach,
        messages: [
          ...state.aiCoach.messages,
          {
            ...message,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
          },
        ],
      },
    }));
  },

  setAITyping: (isTyping) => {
    set((state) => ({
      aiCoach: {
        ...state.aiCoach,
        isTyping,
      },
    }));
  },

  clearChatHistory: () => {
    set((state) => ({
      aiCoach: {
        ...state.aiCoach,
        messages: [
          {
            id: uuidv4(),
            role: 'assistant',
            content: 'Чат очищено. Про що хочеш поговорити?',
            createdAt: new Date().toISOString(),
            type: 'text',
          },
        ],
      },
    }));
  },
});
