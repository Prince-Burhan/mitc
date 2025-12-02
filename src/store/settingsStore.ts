import { create } from 'zustand';
import { SiteSettings } from '../types';

interface SettingsState {
  settings: SiteSettings | null;
  loading: boolean;
  setSettings: (settings: SiteSettings) => void;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,
  
  setSettings: (settings) => set({ settings, loading: false }),
  
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),
  
  setLoading: (loading) => set({ loading }),
}));