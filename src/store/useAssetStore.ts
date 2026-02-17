import { useState, useEffect, useCallback } from 'react';
import { Asset } from '../types/asset';
import { assetPersistence } from '@/services/persistence/assetPersistence';

const SEED_DATA: Asset[] = [
  {
    id: "1",
    assetTag: "ASSET-001",
    name: "HVAC Unit 01",
    description: "Main floor HVAC unit",
    status: "Active",
    criticality: "High",
    locationName: "Main Building",
    manufacturer: "Carrier",
    model: "X-400",
    serialNumber: "SN-12345",
    installDate: "2023-01-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    meters: []
  },
  {
    id: "2",
    assetTag: "ASSET-002",
    name: "Backup Generator",
    description: "Emergency power backup",
    status: "Active",
    criticality: "High",
    locationName: "Generator Room",
    manufacturer: "Cummins",
    model: "DG-100",
    serialNumber: "SN-98765",
    installDate: "2022-06-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    meters: []
  },
  {
    id: "3",
    assetTag: "ASSET-003",
    name: "Elevator A",
    description: "Main passenger elevator",
    status: "Out of Service",
    criticality: "Medium",
    locationName: "Lobby",
    manufacturer: "Otis",
    model: "GEN2",
    serialNumber: "SN-55555",
    installDate: "2021-03-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    meters: []
  }
];

let globalAssets: Asset[] = assetPersistence.load(SEED_DATA);
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
  assetPersistence.saveDebounced(globalAssets);
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

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    globalAssets = [...globalAssets, newAsset];
    notify();
    return newAsset;
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    globalAssets = globalAssets.map(a => {
      if (a.id === id) {
        return {
          ...a,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    });
    notify();
  }, []);

  const deleteAsset = useCallback((id: string) => {
    globalAssets = globalAssets.filter(a => a.id !== id);
    notify();
  }, []);

  const getAssetById = useCallback((id: string) => {
    return globalAssets.find(a => a.id === id);
  }, []);

  return {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById
  };
};
