import { useState, useEffect, useCallback } from 'react';
import { Asset } from '../types/asset';
import { fetchAssets } from '@/services/assetService';

let globalAssets: Asset[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const useAssetStore = () => {
  const [assets, setAssets] = useState<Asset[]>(globalAssets);

  useEffect(() => {
    const l = () => setAssets([...globalAssets]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const loadAssets = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      const data = await fetchAssets(siteId);
      globalAssets = data;
      notify();
    } catch (error) {
      console.error("Failed to load assets:", error);
      globalAssets = [];
      notify();
    }
  }, []);

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    // No-op for Phase 1
    return {} as Asset;
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    // No-op for Phase 1
  }, []);

  const deleteAsset = useCallback((id: string) => {
    // No-op for Phase 1
  }, []);

  const getAssetById = useCallback((id: string) => {
    return globalAssets.find(a => a.id === id);
  }, []);

  return {
    assets,
    loadAssets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById
  };
};
