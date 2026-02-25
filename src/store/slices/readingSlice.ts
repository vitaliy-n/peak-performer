import type { StateCreator } from 'zustand';
import type { Book, ReadingSession } from '../../types';
import type { AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { POINTS } from '../constants';

export interface ReadingSlice {
  books: Book[];
  readingSessions: ReadingSession[];
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addReadingSession: (session: Omit<ReadingSession, 'id' | 'date'>) => void;
}

export const createReadingSlice: StateCreator<AppState, [], [], ReadingSlice> = (set, get) => ({
  books: [],
  readingSessions: [],

  addBook: (bookInput) => {
    const {
      pagesRead = 0,
      totalPages = 0,
      dailyPagesGoal = 10,
      favorite = false,
      topIdeas = [],
      status = 'reading',
      ...rest
    } = bookInput;

    const now = new Date().toISOString();
    const newBook: Book = {
      id: uuidv4(),
      createdAt: now,
      lastUpdated: now,
      pagesRead,
      totalPages,
      dailyPagesGoal,
      favorite,
      topIdeas,
      status,
      ...rest,
    } as Book;

    set((state) => ({ books: [...state.books, newBook] }));
  },

  updateBook: (id, updates) => {
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id
          ? { ...book, ...updates, lastUpdated: new Date().toISOString() }
          : book
      ),
    }));
  },

  deleteBook: (id) => {
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
      readingSessions: state.readingSessions.filter((session) => session.bookId !== id),
    }));
  },

  addReadingSession: ({ bookId, pagesRead, durationMinutes, focusLevel, mood, notes }) => {
    set((state) => {
      const book = state.books.find((b) => b.id === bookId);
      if (!book) return state;

      const increment = Math.max(0, pagesRead);
      const newPagesRead = Math.min(book.totalPages || Infinity, book.pagesRead + increment);
      const updatedBook: Book = {
        ...book,
        pagesRead: newPagesRead,
        status:
          book.totalPages > 0 && newPagesRead >= book.totalPages ? 'completed' : book.status,
        completedAt:
          book.totalPages > 0 && newPagesRead >= book.totalPages
            ? book.completedAt ?? new Date().toISOString()
            : book.completedAt,
        lastUpdated: new Date().toISOString(),
      };

      const session: ReadingSession = {
        id: uuidv4(),
        bookId,
        date: new Date().toISOString(),
        pagesRead: increment,
        durationMinutes,
        focusLevel,
        mood,
        notes,
      };

      if (increment > 0) {
        get().addPoints(increment * POINTS.readPage);
      }

      return {
        books: state.books.map((b) => (b.id === bookId ? updatedBook : b)),
        readingSessions: [session, ...state.readingSessions].slice(0, 100),
      };
    });
  },
});
