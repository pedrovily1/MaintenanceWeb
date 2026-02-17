// Local persistence for Procedure Library with simple debounce to limit churn
import { Procedure } from '@/types/procedure';

const STORAGE_KEY = 'procedures_v1';
let debounceTimer: number | undefined;

export const procedurePersistence = {
  load(): Procedure[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data as Procedure[];
      return [];
    } catch (e) {
      console.error('Failed to load procedures', e);
      return [];
    }
  },
  save(procedures: Procedure[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(procedures));
    } catch (e) {
      console.error('Failed to save procedures', e);
    }
  },
  saveDebounced(procedures: Procedure[], delay = 250) {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      this.save(procedures);
    }, delay);
  }
};
