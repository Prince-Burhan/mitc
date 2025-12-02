import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  subscribeToAuthChanges,
} from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initAuth: () => (() => void); // Fixed: return type is unsubscribe function
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const user = await authSignIn(email, password);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName: string) => {
        try {
          set({ loading: true, error: null });
          const user = await authSignUp(email, password, displayName);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          await authSignOut();
          set({ user: null, isAuthenticated: false, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, loading: false });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      initAuth: () => {
        const unsubscribe = subscribeToAuthChanges((user) => {
          set({ user, isAuthenticated: !!user, loading: false });
        });
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);