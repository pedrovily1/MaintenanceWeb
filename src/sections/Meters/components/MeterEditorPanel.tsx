import React, { useMemo, useState } from 'react';
import type { Meter } from '@/types/meter';
import { useAssetStore } from '@/store/useAssetStore';

export type MeterEditorValue = Omit<Meter, 'id' | 'createdAt' | 'updatedAt'>;

type Props = {
  open: boolean;
  initial?: Partial<Meter>;
  onClose: () => void;
  onSubmit: (value: MeterEditorValue) => void;
};

const empty: MeterEditorValue = {
  name: '',
  unit: '',
  description: '',
  assetId: undefined,
  locationId: undefined,
  locationName: '',
  active: true,
  lastReading: undefined,
  lastReadingAt: undefined,
};

export const MeterEditorPanel: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const { assets } = useAssetStore();
  const base = useMemo(() => ({ ...empty, ...initial }), [initial]);
  const [value, setValue] = useState<MeterEditorValue>(base);
  const [errors, setErrors] = useState<{ name?: string }>({});

  React.useEffect(() => { setValue(base); }, [base]);

  const set = (patch: Partial<MeterEditorValue>) => setValue(v => ({ ...v, ...patch }));

  const validate = () => {
    const e: { name?: string } = {};
    if (!value.name?.trim()) e.name = 'Name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...value, assetId: value.assetId || undefined, locationId: value.locationId || undefined, locationName: value.locationName?.trim() || undefined });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-xl h-full overflow-auto border-l border-zinc-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-lg font-semibold">{initial?.id ? 'Edit Meter' : 'New Meter'}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Name<span className="text-red-500">*</span></label>
              <input value={value.name} onChange={(e) => set({ name: e.target.value })} className={`w-full border rounded px-2 py-1 text-sm ${errors.name ? 'border-red-400' : 'border-zinc-200'}`} />
              {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit</label>
              <input value={value.unit || ''} onChange={(e) => set({ unit: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="e.g., Hours, kWh" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Active</label>
              <select value={value.active ? 'true' : 'false'} onChange={(e) => set({ active: e.target.value === 'true' })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea value={value.description || ''} onChange={(e) => set({ description: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm min-h-[72px]" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Linked Asset</label>
              <select value={value.assetId || ''} onChange={(e) => set({ assetId: e.target.value || undefined })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm">
                <option value="">None (Global Meter)</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Linked Location (optional)</label>
              <input value={value.locationName || ''} onChange={(e) => set({ locationName: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" placeholder="Location name" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-200 bg-gray-50 flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border border-zinc-200 text-sm" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
