import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/types/location';
import { fetchLocations } from '@/services/locationService';

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
    // No-op for Phase 1
    return {} as Location;
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    // No-op for Phase 1
  }, []);

  const deleteLocation = useCallback((id: string): { ok: boolean; reason?: string } => {
    // No-op for Phase 1
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
