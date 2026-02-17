import { Attachment } from './workOrder';

export type AssetStatus = 'Active' | 'Inactive' | 'Out of Service';
export type AssetCriticality = 'Low' | 'Medium' | 'High';

export interface AssetMeter {
  id: string;
  name: string;
  unit?: string;
  lastReading?: number;
  lastReadingAt?: string; // ISO
}

export interface Asset {
  id: string;
  assetTag?: string;
  name: string;
  description?: string;
  status: AssetStatus;
  criticality?: AssetCriticality;
  locationId?: string;
  locationName?: string;
  parentAssetId?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string; // ISO
  warrantyEnd?: string; // ISO
  notes?: string;
  meters?: AssetMeter[];
  attachments?: Attachment[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface AssetStore {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
}
