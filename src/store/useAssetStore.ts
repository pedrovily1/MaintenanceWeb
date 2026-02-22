import { useState, useEffect, useCallback } from 'react';
import { Asset } from '../types/asset';
import { fetchAssets } from '@/services/assetService';
import { supabase } from '@/lib/supabase';
import { useSiteStore } from './useSiteStore';

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
    const { activeSiteId } = useSiteStore.getState();
    if (!activeSiteId) {
      console.error('Missing activeSiteId for addAsset');
      return {} as Asset;
    }

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tempAsset: Asset = {
      ...asset,
      id: tempId,
      createdAt: now,
      updatedAt: now,
    };

    globalAssets = [...globalAssets, tempAsset];
    notify();

    (async () => {
      try {
        const { data, error } = await supabase
          .from('assets')
          .insert({
            site_id: activeSiteId,
            name: asset.name,
            description: asset.description,
            status: asset.status,
            criticality: asset.criticality,
            asset_tag: asset.assetTag,
            location_id: asset.locationId,
            location_name: asset.locationName,
            parent_asset_id: asset.parentAssetId,
            category: asset.category,
            manufacturer: asset.manufacturer,
            model: asset.model,
            serial_number: asset.serialNumber,
            install_date: asset.installDate,
            warranty_end: asset.warrantyEnd,
            image_url: asset.imageUrl,
            notes: asset.notes,
          })
          .select()
          .single();

        if (error) throw error;

        globalAssets = globalAssets.map(a => a.id === tempId ? data as Asset : a);
        notify();
      } catch (error) {
        console.error('Error adding asset:', error);
        globalAssets = globalAssets.filter(a => a.id !== tempId);
        notify();
      }
    })();

    return tempAsset;
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    const original = globalAssets.find(a => a.id === id);
    if (!original) return;

    globalAssets = globalAssets.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );
    notify();

    (async () => {
      try {
        const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.criticality !== undefined) dbUpdates.criticality = updates.criticality;
        if (updates.assetTag !== undefined) dbUpdates.asset_tag = updates.assetTag;
        if (updates.locationId !== undefined) dbUpdates.location_id = updates.locationId;
        if (updates.locationName !== undefined) dbUpdates.location_name = updates.locationName;
        if (updates.parentAssetId !== undefined) dbUpdates.parent_asset_id = updates.parentAssetId;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.manufacturer !== undefined) dbUpdates.manufacturer = updates.manufacturer;
        if (updates.model !== undefined) dbUpdates.model = updates.model;
        if (updates.serialNumber !== undefined) dbUpdates.serial_number = updates.serialNumber;
        if (updates.installDate !== undefined) dbUpdates.install_date = updates.installDate;
        if (updates.warrantyEnd !== undefined) dbUpdates.warranty_end = updates.warrantyEnd;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

        const { error } = await supabase
          .from('assets')
          .update(dbUpdates)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating asset:', error);
        globalAssets = globalAssets.map(a => a.id === id ? original : a);
        notify();
      }
    })();
  }, []);

  const deleteAsset = useCallback((id: string) => {
    const originalList = [...globalAssets];
    globalAssets = globalAssets.filter(a => a.id !== id);
    notify();

    (async () => {
      try {
        const { error } = await supabase
          .from('assets')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting asset:', error);
        globalAssets = originalList;
        notify();
      }
    })();
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
