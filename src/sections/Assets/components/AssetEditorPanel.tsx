import React, { useMemo, useState } from 'react';
import type { Asset, AssetStatus, AssetCriticality } from '@/types/asset';
import { AssetAttachments } from './AssetAttachments';
import type { Attachment } from '@/types/workOrder';
import { LocationTreeSelector } from '@/components/LocationTreeSelector';

export type AssetEditorValue = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;

type Props = {
  open: boolean;
  initial?: Partial<Asset>;
  onClose: () => void;
  onSubmit: (value: AssetEditorValue) => void;
};

const empty: AssetEditorValue = {
  name: '',
  status: 'Active',
  assetTag: '',
  description: '',
  criticality: 'Medium',
  locationId: '',
  locationName: '',
  parentAssetId: '',
  category: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  installDate: '',
  warrantyEnd: '',
  notes: '',
  meters: [],
  attachments: []
};

export const AssetEditorPanel: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const base = useMemo(() => ({ ...empty, ...initial }), [initial]);
  const [value, setValue] = useState<AssetEditorValue>(base);
  const [errors, setErrors] = useState<{ name?: string; status?: string }>({});

  React.useEffect(() => {
    setValue(base);
  }, [base]);

  if (!open) return null;

  const set = (patch: Partial<AssetEditorValue>) => setValue(v => ({ ...v, ...patch }));

  const validate = () => {
    const e: { name?: string; status?: string } = {};
    if (!value.name?.trim()) e.name = 'Name is required';
    if (!value.status) e.status = 'Status is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-xl h-full overflow-auto border-l border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <div className="text-lg font-semibold">{initial?.id ? 'Edit Asset' : 'New Asset'}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Name<span className="text-red-500">*</span></label>
              <input value={value.name} onChange={(e) => set({ name: e.target.value })} className={`w-full border rounded px-2 py-1 text-sm ${errors.name ? 'border-red-400' : 'border-[var(--border)]'}`} />
              {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status<span className="text-red-500">*</span></label>
              <select value={value.status} onChange={(e) => set({ status: e.target.value as AssetStatus })} className={`w-full border rounded px-2 py-1 text-sm ${errors.status ? 'border-red-400' : 'border-[var(--border)]'}`}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Service">Out of Service</option>
              </select>
              {errors.status && <div className="text-xs text-red-500 mt-1">{errors.status}</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Criticality</label>
              <select value={value.criticality || 'Medium'} onChange={(e) => set({ criticality: e.target.value as AssetCriticality })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Asset Tag</label>
              <input value={value.assetTag || ''} onChange={(e) => set({ assetTag: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <input value={value.category || ''} onChange={(e) => set({ category: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <LocationTreeSelector
                label="Location"
                value={value.locationId || null}
                onChange={(locationId, locationName) => set({ locationId: locationId || '', locationName })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Parent Asset ID</label>
              <input value={value.parentAssetId || ''} onChange={(e) => set({ parentAssetId: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Manufacturer</label>
              <input value={value.manufacturer || ''} onChange={(e) => set({ manufacturer: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Model</label>
              <input value={value.model || ''} onChange={(e) => set({ model: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Serial Number</label>
              <input value={value.serialNumber || ''} onChange={(e) => set({ serialNumber: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Install Date</label>
              <input type="date" value={value.installDate || ''} onChange={(e) => set({ installDate: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Warranty End</label>
              <input type="date" value={value.warrantyEnd || ''} onChange={(e) => set({ warrantyEnd: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea value={value.description || ''} onChange={(e) => set({ description: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm min-h-[72px]" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <textarea value={value.notes || ''} onChange={(e) => set({ notes: e.target.value })} className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm min-h-[72px]" />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Attachments</div>
            <AssetAttachments attachments={value.attachments || []} onChange={(a: Attachment[]) => set({ attachments: a })} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-gray-50 flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
