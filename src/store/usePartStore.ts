import { useState, useEffect, useCallback } from 'react';
import { Part, PartInventory, WorkOrderPart, getTotalStock } from '@/types/part';
import { fetchParts } from '@/services/partService';
import { supabase } from '@/lib/supabase';
import { useSiteStore } from './useSiteStore';

let globalParts: Part[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

export const consumePartsFromInventory = (
    woParts: WorkOrderPart[]
): { ok: boolean; reason?: string } => {
  return { ok: true };
};

export const getPartSync = (id: string): Part | undefined =>
    globalParts.find(p => p.id === id);

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
    const { activeSiteId } = useSiteStore.getState();
    if (!activeSiteId) {
      console.error('Missing activeSiteId for addPart');
      return {} as Part;
    }

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tempPart: Part = {
      ...part,
      id: tempId,
      createdAt: now,
      updatedAt: now,
    };

    globalParts = [...globalParts, tempPart];
    notify();

    (async () => {
      try {
        const { data, error } = await supabase
            .from('parts')
            .insert({
              site_id: activeSiteId,
              name: part.name,
              description: part.description,
              part_type: part.partType,
              unit: part.unit,
              min_stock: part.minStock,
              image_url: part.imageUrl || null,
              barcode: part.barcode || null,
            })
            .select()
            .single();

        if (error) throw error;

        globalParts = globalParts.map(p =>
            p.id === tempId
                ? { ...(data as any), partType: data.part_type, minStock: data.min_stock, imageUrl: data.image_url, createdAt: data.created_at, updatedAt: data.updated_at, inventory: part.inventory || [], compatibleAssetIds: part.compatibleAssetIds || [] }
                : p
        );
        notify();
      } catch (error) {
        console.error('Error adding part:', error);
        globalParts = globalParts.filter(p => p.id !== tempId);
        notify();
      }
    })();

    return tempPart;
  }, []);

  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    const original = globalParts.find(p => p.id === id);
    if (!original) return;

    globalParts = globalParts.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    notify();

    (async () => {
      try {
        const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.partType !== undefined) dbUpdates.part_type = updates.partType;
        if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
        if (updates.minStock !== undefined) dbUpdates.min_stock = updates.minStock;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl || null;
        if (updates.barcode !== undefined) dbUpdates.barcode = updates.barcode || null;

        const { error } = await supabase
            .from('parts')
            .update(dbUpdates)
            .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating part:', error);
        globalParts = globalParts.map(p => p.id === id ? original : p);
        notify();
      }
    })();
  }, []);

  const deletePart = useCallback(
      (id: string): { ok: boolean; reason?: string } => {
        const originalList = [...globalParts];
        globalParts = globalParts.filter(p => p.id !== id);
        notify();

        (async () => {
          try {
            const { error } = await supabase
                .from('parts')
                .delete()
                .eq('id', id);

            if (error) throw error;
          } catch (error) {
            console.error('Error deleting part:', error);
            globalParts = originalList;
            notify();
          }
        })();

        return { ok: true };
      },
      []
  );

  const getPartById = useCallback((id: string) => globalParts.find(p => p.id === id), []);

  const setInventoryAtLocation = useCallback(
      (partId: string, inv: PartInventory) => {
        globalParts = globalParts.map(p => {
          if (p.id !== partId) return p;
          const existing = p.inventory.find(i => i.locationId === inv.locationId);
          const inventory = existing
              ? p.inventory.map(i => i.locationId === inv.locationId ? inv : i)
              : [...p.inventory, inv];
          return { ...p, inventory };
        });
        notify();

        (async () => {
          try {
            const { error } = await supabase
                .from('part_inventory')
                .upsert({
                  part_id: partId,
                  location_id: inv.locationId,
                  quantity: inv.quantity,
                  min_quantity: inv.minQuantity || 0,
                }, { onConflict: 'part_id,location_id' });
            if (error) throw error;
          } catch (err) {
            console.error('Error setting inventory:', err);
          }
        })();
      },
      []
  );

  const removeInventoryAtLocation = useCallback(
      (partId: string, locationId: string): { ok: boolean; reason?: string } => {
        globalParts = globalParts.map(p =>
            p.id !== partId ? p : { ...p, inventory: p.inventory.filter(i => i.locationId !== locationId) }
        );
        notify();

        (async () => {
          try {
            const { error } = await supabase
                .from('part_inventory')
                .delete()
                .eq('part_id', partId)
                .eq('location_id', locationId);
            if (error) throw error;
          } catch (err) {
            console.error('Error removing inventory:', err);
          }
        })();

        return { ok: true };
      },
      []
  );

  const restock = useCallback(
      (partId: string, locationId: string, locationName: string, quantity: number) => {
        globalParts = globalParts.map(p => {
          if (p.id !== partId) return p;
          const existing = p.inventory.find(i => i.locationId === locationId);
          const inventory = existing
              ? p.inventory.map(i => i.locationId === locationId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i)
              : [...p.inventory, { locationId, locationName, quantity, minQuantity: 0 }];
          return { ...p, inventory };
        });
        notify();

        (async () => {
          try {
            const part = globalParts.find(p => p.id === partId);
            const inv = part?.inventory.find(i => i.locationId === locationId);
            const { error } = await supabase
                .from('part_inventory')
                .upsert({
                  part_id: partId,
                  location_id: locationId,
                  quantity: inv?.quantity ?? quantity,
                  min_quantity: inv?.minQuantity ?? 0,
                }, { onConflict: 'part_id,location_id' });
            if (error) throw error;
          } catch (err) {
            console.error('Error restocking part:', err);
          }
        })();
      },
      []
  );

  const getPartsNeedingRestock = useCallback(() => {
    return globalParts.filter(p =>
        (p.inventory || []).some(inv => inv.quantity <= inv.minQuantity)
    );
  }, []);

  const getPartsByAsset = useCallback((assetId: string) => {
    return globalParts.filter(p => (p.compatibleAssetIds || []).includes(assetId));
  }, []);

  const getPartsByLocation = useCallback((locationId: string) => {
    return globalParts.filter(p => (p.inventory || []).some(i => i.locationId === locationId));
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