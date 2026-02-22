import { useEffect, useState, useCallback } from 'react';
import type { Meter, MeterReading } from '@/types/meter';
import { meterPersistence } from '@/services/persistence/meterPersistence';

const METER_SEED_DATA = (): { meters: Meter[], readings: MeterReading[] } => {
  const now = new Date();
  const generatorId = 'seed-meter-generator-1';
  
  const meters: Meter[] = [
    {
      id: generatorId,
      name: 'Generator Hours',
      unit: 'hrs',
      description: 'Main backup generator runtime',
      assetId: '2', // Backup Generator in AssetStore
      locationName: 'Generator Room',
      active: true,
      lastReading: 40.0,
      lastReadingAt: now.toISOString(),
      createdAt: new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now.toISOString()
    }
  ];

  const readings: MeterReading[] = [];
  const totalHours = 40;
  const daysCount = 90;
  const startTimestamp = now.getTime() - daysCount * 24 * 60 * 60 * 1000;
  
  // Create about 60 readings over 90 days to reach 40 hours
  // This averages ~0.44 hours per reading if 90 readings, but we'll do fewer with larger increments
  let currentHours = 0;
  for (let i = 0; i < 60; i++) {
    const readingTime = new Date(startTimestamp + (i * (daysCount / 60) * 24 * 60 * 60 * 1000));
    // Random increment between 0 and 1.5 hours
    const increment = Math.random() * 1.35; 
    currentHours = Math.min(totalHours, currentHours + increment);
    
    readings.push({
      id: `seed-reading-${i}`,
      meterId: generatorId,
      value: Number(currentHours.toFixed(2)),
      unit: 'hrs',
      source: 'workorder',
      recordedAt: readingTime.toISOString(),
      createdAt: readingTime.toISOString()
    });
    
    if (currentHours >= totalHours) break;
  }
  
  // Ensure the last reading is exactly 40 at "now"
  if (currentHours < totalHours) {
    readings.push({
      id: `seed-reading-final`,
      meterId: generatorId,
      value: 40.0,
      unit: 'hrs',
      source: 'manual',
      recordedAt: now.toISOString(),
      createdAt: now.toISOString()
    });
  }

  return { meters, readings: readings.reverse() };
};

// Global state (simple listener pattern aligned with other stores)
let { meters: globalMeters, readings: globalReadings } = meterPersistence.load();

// If empty, use seed data
if (globalMeters.length === 0 && globalReadings.length === 0) {
  const seed = METER_SEED_DATA();
  globalMeters = seed.meters;
  globalReadings = seed.readings;
}

const listeners = new Set<() => void>();

export const __notifyMeters = () => {
  listeners.forEach(l => l());
  meterPersistence.saveDebounced({ meters: globalMeters, readings: globalReadings });
};
const notify = __notifyMeters;

// Helper exported for cross-store safety (e.g., when an asset is deleted)
export const unlinkMetersByAssetId = (assetId: string) => {
  let changed = false;
  globalMeters = globalMeters.map(m => {
    if (m.assetId === assetId) {
      changed = true;
      return { ...m, assetId: undefined, updatedAt: new Date().toISOString() };
    }
    return m;
  });
  if (changed) notify();
};

// Prevent duplicate readings on re-renders: check by (meterId, workOrderId)
export const __hasReadingForWorkOrder = (meterId?: string, workOrderId?: string) => {
  if (!meterId || !workOrderId) return false;
  return globalReadings.some(r => r.meterId === meterId && r.workOrderId === workOrderId);
};

export const useMeterStore = () => {
  const [meters, setMeters] = useState<Meter[]>(globalMeters);
  const [readings, setReadings] = useState<MeterReading[]>(globalReadings);

  useEffect(() => {
    const l = () => { setMeters([...globalMeters]); setReadings([...globalReadings]); };
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);

  const addMeter = useCallback((m: Omit<Meter, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const full: Meter = { id: crypto.randomUUID(), active: true, ...m, createdAt: now, updatedAt: now };
    globalMeters = [...globalMeters, full];
    notify();
    return full;
  }, []);

  const updateMeter = useCallback((id: string, patch: Partial<Meter>) => {
    const now = new Date().toISOString();
    globalMeters = globalMeters.map(m => m.id === id ? { ...m, ...patch, updatedAt: now } : m);
    notify();
  }, []);

  const deleteMeter = useCallback((id: string) => {
    globalMeters = globalMeters.filter(m => m.id !== id);
    // Keep readings history; do not delete readings to preserve history as per fail-safe
    notify();
  }, []);

  const updateReading = useCallback((id: string, patch: Partial<MeterReading>) => {
    const now = new Date().toISOString();
    let meterToUpdate: string | undefined;

    globalReadings = globalReadings.map(r => {
      if (r.id === id) {
        meterToUpdate = r.meterId;
        return { ...r, ...patch };
      }
      return r;
    });

    if (meterToUpdate) {
      const meterReadings = globalReadings
        .filter(r => r.meterId === meterToUpdate)
        .sort((a, b) => new Date(b.recordedAt || b.createdAt).getTime() - new Date(a.recordedAt || a.createdAt).getTime());
      
      if (meterReadings.length > 0) {
        const latest = meterReadings[0];
        globalMeters = globalMeters.map(m => m.id === meterToUpdate ? {
          ...m,
          lastReading: latest.value,
          lastReadingAt: latest.recordedAt || latest.createdAt,
          updatedAt: now
        } : m);
      }
    }

    notify();
  }, []);

  const deleteReading = useCallback((id: string) => {
    const now = new Date().toISOString();
    let meterToUpdate: string | undefined;
    const readingToDelete = globalReadings.find(r => r.id === id);
    if (!readingToDelete) return;
    
    meterToUpdate = readingToDelete.meterId;
    globalReadings = globalReadings.filter(r => r.id !== id);

    if (meterToUpdate) {
      const meterReadings = globalReadings
        .filter(r => r.meterId === meterToUpdate)
        .sort((a, b) => new Date(b.recordedAt || b.createdAt).getTime() - new Date(a.recordedAt || a.createdAt).getTime());
      
      if (meterReadings.length > 0) {
        const latest = meterReadings[0];
        globalMeters = globalMeters.map(m => m.id === meterToUpdate ? {
          ...m,
          lastReading: latest.value,
          lastReadingAt: latest.recordedAt || latest.createdAt,
          updatedAt: now
        } : m);
      } else {
        globalMeters = globalMeters.map(m => m.id === meterToUpdate ? {
          ...m,
          lastReading: undefined,
          lastReadingAt: undefined,
          updatedAt: now
        } : m);
      }
    }

    notify();
  }, []);

  const addReading = useCallback((r: Omit<MeterReading, 'id' | 'createdAt'>) => {
    // De-dup protection if coming from WO completion
    if (r.workOrderId && __hasReadingForWorkOrder(r.meterId, r.workOrderId)) {
      // Already recorded; skip
      return globalReadings.find(x => x.meterId === r.meterId && x.workOrderId === r.workOrderId)!;
    }
    const now = new Date().toISOString();
    const full: MeterReading = { id: crypto.randomUUID(), ...r, createdAt: now };
    globalReadings = [full, ...globalReadings];

    // Update meter snapshot
    const meter = globalMeters.find(m => m.id === r.meterId);
    if (meter) {
      meter.lastReading = r.value;
      meter.lastReadingAt = r.recordedAt || now;
      meter.updatedAt = now;
    }
    notify();
    return full;
  }, []);

  const getMeterById = useCallback((id: string) => globalMeters.find(m => m.id === id), []);
  const getReadingsByMeter = useCallback((meterId: string) => globalReadings.filter(r => r.meterId === meterId).sort((a,b) => (b.recordedAt || b.createdAt || '').localeCompare(a.recordedAt || a.createdAt || '')), []);

  const loadMeters = useCallback(async (siteId: string) => {
    if (!siteId) return;
    console.log('loadMeters called for site:', siteId);
    // Meters are currently persisted locally; Supabase migration pending
  }, []);

  return { meters, readings, addMeter, updateMeter, deleteMeter, addReading, updateReading, deleteReading, getMeterById, getReadingsByMeter, loadMeters };
};

// Non-hook helpers for other stores to integrate safely
export const meterStoreHelpers = {
  addReadingFromWO: (meterId: string, value: number, unit?: string, workOrderId?: string, recordedByUserId?: string) => {
    if (!meterId || typeof value !== 'number' || isNaN(value)) return null;
    if (workOrderId && __hasReadingForWorkOrder(meterId, workOrderId)) return null;
    const now = new Date().toISOString();
    const full: MeterReading = { id: crypto.randomUUID(), meterId, value, unit, workOrderId, recordedByUserId, source: 'work_order', recordedAt: now, createdAt: now };
    globalReadings = [full, ...globalReadings];
    const meter = globalMeters.find(m => m.id === meterId);
    if (meter) {
      meter.lastReading = value;
      meter.lastReadingAt = now;
      meter.updatedAt = now;
    }
    __notifyMeters();
    return full;
  },
  getMeterSync: (id: string) => globalMeters.find(m => m.id === id),
};
