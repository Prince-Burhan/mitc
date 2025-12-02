import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { getSettings } from '../services/settingsService';

export const useSettings = () => {
  const { settings, setSettings, loading, setLoading } = useSettingsStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    refetch: loadSettings,
  };
};