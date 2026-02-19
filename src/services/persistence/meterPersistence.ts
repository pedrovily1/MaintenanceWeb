import type { Meter, MeterReading } from '@/types/meter';

const STORAGE_KEY = 'meters_store_v1';

export type MeterState = {
  meters: Meter[];
  readings: MeterReading[];
};

const emptyState = (): MeterState => ({ meters: [], readings: [] });

let writeTimer: number | undefined;

export const meterPersistence = {
  load: (): MeterState => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw) as Partial<MeterState> | Meter[];
      if (Array.isArray(parsed)) {
        // very old format; just meters without readings
        return { meters: parsed as Meter[], readings: [] };
      }
      const meters = Array.isArray(parsed?.meters) ? parsed!.meters as Meter[] : [];
      const readings = Array.isArray(parsed?.readings) ? parsed!.readings as MeterReading[] : [];
      return { meters, readings };
    } catch (e) {
      console.warn('meterPersistence.load failed, using empty', e);
      return emptyState();
    }
  },
  save: (state: MeterState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('meterPersistence.save failed', e);
    }
  },
  saveDebounced: (state: MeterState, delayMs = 250) => {
    if (writeTimer) window.clearTimeout(writeTimer);
    writeTimer = window.setTimeout(() => {
      meterPersistence.save(state);
      writeTimer = undefined;
    }, delayMs);
  }
};
