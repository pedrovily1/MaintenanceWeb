import { useState, useEffect, useCallback } from 'react';
import { Part, PartInventory, WorkOrderPart, getTotalStock } from '@/types/part';
import { fetchParts } from '@/services/partService';

let globalParts: Part[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

/**
 * Deduct inventory for a list of WorkOrderParts.
 * Returns { ok: boolean; reason?: string } — caller must check before committing.
 */
export const consumePartsFromInventory = (
  woParts: WorkOrderPart[]
): { ok: boolean; reason?: string } => {
  // No-op for Phase 1
  return { ok: true };
};

/** Get a part by ID without a hook (for cross-store lookups) */
export const getPartSync = (id: string): Part | undefined =>
  globalParts.find(p => p.id === id);

/** Get all parts without a hook */
export const getPartsSync = (): Part[] => [...globalParts];

export const usePartStore = () => {
  const [parts, setParts] = useState<Part[]>(globalParts);

  useEffect(() => {
    const l = () => setParts([...globalParts]);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const loadParts = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      const data = await fetchParts(siteId);
      globalParts = data;
      notify();
    } catch (error) {
      console.error("Failed to load parts:", error);
      globalParts = [];
      notify();
    }
  }, []);

  const addPart = useCallback((part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => {
    // No-op for Phase 1
    return {} as Part;
  }, []);

  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    // No-op for Phase 1
  }, []);

  const deletePart = useCallback(
    (id: string): { ok: boolean; reason?: string } => {
      // No-op for Phase 1
      return { ok: true };
    },
    []
  );

  const getPartById = useCallback((id: string) => globalParts.find(p => p.id === id), []);

  const setInventoryAtLocation = useCallback(
    (partId: string, inv: PartInventory) => {
      // No-op for Phase 1
    },
    []
  );

  const removeInventoryAtLocation = useCallback(
    (partId: string, locationId: string): { ok: boolean; reason?: string } => {
      // No-op for Phase 1
      return { ok: true };
    },
    []
  );

  const restock = useCallback(
    (partId: string, locationId: string, locationName: string, quantity: number) => {
      // No-op for Phase 1
    },
    []
  );

  const getPartsNeedingRestock = useCallback(() => {
    return globalParts.filter(p =>
      p.inventory.some(inv => inv.quantity <= inv.minQuantity)
    );
  }, []);

  const getPartsByAsset = useCallback((assetId: string) => {
    return globalParts.filter(p => p.compatibleAssetIds.includes(assetId));
  }, []);

  const getPartsByLocation = useCallback((locationId: string) => {
    return globalParts.filter(p => p.inventory.some(i => i.locationId === locationId));
  }, []);

  return {
    parts,
    loadParts,
    addPart,
    updatePart,
    deletePart,
    getPartById,
    setInventoryAtLocation,
    removeInventoryAtLocation,
    restock,
    getPartsNeedingRestock,
    getPartsByAsset,
    getPartsByLocation,
    getTotalStock,
  };
};
