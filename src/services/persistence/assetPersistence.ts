// Simple localStorage-backed persistence with schema versioning and debounced writes

import type { Asset } from '@/types/asset';

const STORAGE_KEY = 'assets_store';
const SCHEMA_VERSION = 1;

export type AssetsState = {
  version: number;
  data: Asset[];
};

const defaultState = (seed: Asset[]): AssetsState => ({ version: SCHEMA_VERSION, data: seed });

let writeTimer: number | undefined;

export const assetPersistence = {
  load: (seed: Asset[] = []): Asset[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed;
      const parsed: AssetsState | Asset[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Pre-versioned format; migrate
        return parsed as Asset[];
      }
      if (parsed && typeof parsed === 'object') {
        const state = parsed as AssetsState;
        if (!state.version || state.version !== SCHEMA_VERSION) {
          // Basic forward-compatible migration: keep data
          return (state as any).data || seed;
        }
        return state.data || seed;
      }
      return seed;
    } catch (e) {
      console.warn('assetPersistence.load: failed to parse, using seed', e);
      return seed;
    }
  },

  save: (assets: Asset[]) => {
    const payload: AssetsState = { version: SCHEMA_VERSION, data: assets };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('assetPersistence.save: failed to write', e);
    }
  },

  saveDebounced: (assets: Asset[], delayMs = 250) => {
    if (writeTimer) window.clearTimeout(writeTimer);
    writeTimer = window.setTimeout(() => {
      assetPersistence.save(assets);
      writeTimer = undefined;
    }, delayMs);
  }
};
