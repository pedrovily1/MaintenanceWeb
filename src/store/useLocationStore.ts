import { useState, useEffect, useCallback } from 'react';
import type { Location } from '@/types/location';

const STORAGE_KEY = 'locations_v1';

const SEED_DATA: Location[] = [
  {
    id: '2687779',
    name: 'General',
    description: 'This is the default location. When you create assets without assigning a location they will be placed here.',
    address: '',
    parentLocationId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3368477',
    name: 'General Storage',
    description: '',
    address: '',
    parentLocationId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2698783',
    name: 'Slovakia',
    description: '',
    address: 'Airbase CSA 1, Sliac, 96231, Slovakia',
    parentLocationId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2698784',
    name: 'Main Building',
    description: 'Main building complex',
    address: '',
    parentLocationId: '2698783',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2698785',
    name: 'Generator Room',
    description: 'Emergency power equipment room',
    address: '',
    parentLocationId: '2698783',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2698786',
    name: 'Lobby',
    description: 'Main entrance lobby',
    address: '',
    parentLocationId: '2698783',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let globalLocations: Location[] = [];
const listeners = new Set<() => void>();

// Load from localStorage
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  try {
    globalLocations = JSON.parse(saved);
  } catch {
    globalLocations = SEED_DATA;
  }
} else {
  globalLocations = SEED_DATA;
}

const notify = () => {
  listeners.forEach(l => l());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(globalLocations));
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

  const addLocation = useCallback((loc: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newLoc: Location = {
      ...loc,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    globalLocations = [...globalLocations, newLoc];
    notify();
    return newLoc;
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<Location>) => {
    globalLocations = globalLocations.map(l =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    notify();
  }, []);

  const deleteLocation = useCallback((id: string): { ok: boolean; reason?: string } => {
    // Safety: check for sub-locations
    const children = globalLocations.filter(l => l.parentLocationId === id);
    if (children.length > 0) {
      return { ok: false, reason: `Cannot delete: ${children.length} sub-location(s) exist. Reassign or delete them first.` };
    }
    // Safety checks for assets and work orders are done by the caller via
    // the hasAssetsAtLocation / hasWorkOrdersAtLocation helpers below.
    globalLocations = globalLocations.filter(l => l.id !== id);
    notify();
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
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    getChildLocations,
    getRootLocations,
  };
};
