export type MeterId = string;

export interface Meter {
  id: MeterId;
  name: string;
  unit?: string; // e.g. Hours, kWh
  description?: string;
  assetId?: string; // optional link to asset
  locationId?: string; // optional link to location (if your app has locations)
  locationName?: string; // display helper if no location store yet
  active?: boolean; // default true
  lastReading?: number;
  lastReadingAt?: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface MeterReading {
  id: string;
  meterId: MeterId;
  workOrderId?: string; // set when readings are created from a WO
  value: number;
  unit?: string; // snapshot; do not trust for current unit
  recordedByUserId?: string; // who recorded it (manual or via WO assignee)
  source?: 'manual' | 'workorder';
  recordedAt?: string; // ISO explicit record time
  createdAt: string; // ISO (storage timestamp)
}

export interface MeterStoreShape {
  meters: Meter[];
  readings: MeterReading[];
  addMeter: (m: Omit<Meter, 'id' | 'createdAt' | 'updatedAt'>) => Meter;
  updateMeter: (id: string, patch: Partial<Meter>) => void;
  deleteMeter: (id: string) => void;
  addReading: (r: Omit<MeterReading, 'id' | 'createdAt'>) => MeterReading;
  getMeterById: (id: string) => Meter | undefined;
  getReadingsByMeter: (meterId: string) => MeterReading[];
}
