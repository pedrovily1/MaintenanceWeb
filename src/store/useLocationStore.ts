import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/types/location';
import { fetchLocations } from '@/services/locationService';
import { supabase } from '@/lib/supabase';
import { useSiteStore } from './useSiteStore';

let globalLocations: Location[] = [];
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(l => l());
};

/** Get all descendant location IDs (recursive) for a given locationId */
export const getDescendantLocationIds = (locationId: string): string[] => {
  const result: string[] = [];
  const queue = [locationId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = globalLocations.filter(l => l.parentLocationId === current);
    for (const child of children) {
      result.push(child.id);
      queue.push(child.id);
    }
  }
  return result;
};

/** Get location by ID (non-hook, for cross-store use) */
export const getLocationSync = (id: string): Location | undefined =>
  globalLocations.find(l => l.id === id);

/** Get all locations (non-hook) */
export const getLocationsSync = (): Location[] => [...globalLocations];

export const useLocationStore = () => {
  const [locations, setLocations] = useState<Location[]>(globalLocations);

  useEffect(() => {
    const l = () => setLocations([...globalLocations]);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const loadLocations = useCallback(async (siteId: string) => {
    if (!siteId) return;
    try {
      const data = await fetchLocations(siteId);
      globalLocations = data;
      notify();
    } catch (error) {
      console.error("Failed to load locations:", error);
      globalLocations = [];
      notify();
    }
  }, []);

  const addLocation = useCallback((loc: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { activeSiteId } = useSiteStore.getState();
    if (!activeSiteId) {
      console.error('Missing activeSiteId for addLocation');
      return {} as Location;
    }

    const tempId = crypto.randomUUID();
    const now = new Date().toISOString();
    const tempLoc: Location = {
      ...loc,
      id: tempId,
      siteId: activeSiteId,
      createdAt: now,
      updatedAt: now,
    };

    globalLocations = [...globalLocations, tempLoc];
    notify();

    (async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .insert({
            site_id: activeSiteId,
            name: loc.name,
            description: loc.description,
            address: loc.address,
            image_url: loc.imageUrl,
            parent_location_id: loc.parentLocationId,
          })
          .select()
          .single();

        if (error) throw error;

        globalLocations = globalLocations.map(l => l.id === tempId ? data as Location : l);
        notify();
      } catch (error) {
        console.error('Error adding location:', error);
        globalLocations = globalLocations.filter(l => l.id !== tempId);
        notify();
      }
    })();

    return tempLoc;
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    const original = globalLocations.find(l => l.id === id);
    if (!original) return;

    globalLocations = globalLocations.map(l =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    notify();

    (async () => {
      try {
        const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
        if (updates.parentLocationId !== undefined) dbUpdates.parent_location_id = updates.parentLocationId;

        const { error } = await supabase
          .from('locations')
          .update(dbUpdates)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating location:', error);
        globalLocations = globalLocations.map(l => l.id === id ? original : l);
        notify();
      }
    })();
  }, []);

  const deleteLocation = useCallback((id: string): { ok: boolean; reason?: string } => {
    const hasChildren = globalLocations.some(l => l.parentLocationId === id);
    if (hasChildren) {
      return { ok: false, reason: 'Cannot delete a location that has sub-locations.' };
    }

    const original = globalLocations.find(l => l.id === id);
    globalLocations = globalLocations.filter(l => l.id !== id);
    notify();

    (async () => {
      try {
        const { error } = await supabase
          .from('locations')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting location:', error);
        if (original) {
          globalLocations = [...globalLocations, original];
          notify();
        }
      }
    })();

    return { ok: true };
  }, []);

  const getLocationById = useCallback((id: string) => {
    return globalLocations.find(l => l.id === id);
  }, []);

  const getChildLocations = useCallback((parentId: string) => {
    return globalLocations.filter(l => l.parentLocationId === parentId);
  }, []);

  const getRootLocations = useCallback(() => {
    return globalLocations.filter(l => !l.parentLocationId);
  }, []);

  return {
    locations,
    loadLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    getChildLocations,
    getRootLocations,
  };
};
