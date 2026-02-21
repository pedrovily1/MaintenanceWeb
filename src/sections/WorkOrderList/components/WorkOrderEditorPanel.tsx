import React, { useMemo, useState } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '@/types/workOrder';
import { useAssetStore } from '@/store/useAssetStore';
import { LocationTreeSelector } from '@/components/LocationTreeSelector';
import { getLocationSync } from '@/store/useLocationStore';
import { usePartStore } from '@/store/usePartStore';
import { getTotalStock } from '@/types/part';
import type { WorkOrderPart } from '@/types/part';

export type WorkOrderEditorValue = Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber' | 'createdByUserId'>;

type Props = {
  open: boolean;
  initial?: Partial<WorkOrder>;
  onClose: () => void;
  onSubmit: (value: WorkOrderEditorValue) => void;
};

const empty: WorkOrderEditorValue = {
  title: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  dueDate: new Date().toISOString().split('T')[0],
  assignedTo: 'Admin',
  asset: '',
  locationId: null,
  location: '',
  categories: [],
  workType: 'Other',
  sections: [],
  attachments: []
};

export const WorkOrderEditorPanel: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const { assets } = useAssetStore();
  const { parts } = usePartStore();
  const base = useMemo(() => ({ ...empty, ...initial }), [initial]);
  const [value, setValue] = useState<WorkOrderEditorValue>(base);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [newPartId, setNewPartId] = useState('');
  const [newPartLocId, setNewPartLocId] = useState('');
  const [newPartQty, setNewPartQty] = useState(1);
  const [partAddError, setPartAddError] = useState<string | null>(null);

  const selectedPart = parts.find(p => p.id === newPartId);

  const addEditorPart = () => {
    if (!newPartId) { setPartAddError('Select a part.'); return; }
    if (!newPartLocId) { setPartAddError('Select a location.'); return; }
    if (newPartQty <= 0) { setPartAddError('Quantity must be > 0.'); return; }
    const part = parts.find(p => p.id === newPartId);
    if (!part) return;
    const inv = part.inventory.find(i => i.locationId === newPartLocId);
    if (!inv) { setPartAddError('Part not stocked at this location.'); return; }
    if (inv.quantity < newPartQty) {
      setPartAddError(`Only ${inv.quantity} ${part.unit || 'unit(s)'} available.`);
      return;
    }
    const wop: WorkOrderPart = {
      partId: part.id,
      partName: part.name,
      locationId: inv.locationId,
      locationName: inv.locationName,
      quantityUsed: newPartQty,
      consumed: false,
    };
    const existing = (value.parts || []);
    if (existing.some(p => p.partId === wop.partId && p.locationId === wop.locationId)) {
      setPartAddError('Already added.'); return;
    }
    set({ parts: [...existing, wop] });
    setNewPartId(''); setNewPartLocId(''); setNewPartQty(1); setPartAddError(null);
  };

  const removeEditorPart = (partId: string, locationId: string) => {
    set({ parts: (value.parts || []).filter(p => !(p.partId === partId && p.locationId === locationId)) });
  };

  React.useEffect(() => {
    setValue(base);
  }, [base]);

  if (!open) return null;

  const set = (patch: Partial<WorkOrderEditorValue>) => setValue(v => ({ ...v, ...patch }));

  const hasAssetSelected = Boolean(value.assetId);

  const validate = () => {
    const e: { title?: string } = {};
    if (!value.title?.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...value });
  };

  const handleAssetChange = (assetId: string) => {
    const selectedAsset = assets.find(a => a.id === assetId);
    if (selectedAsset) {
      // Auto-sync location from asset
      const loc = selectedAsset.locationId ? getLocationSync(selectedAsset.locationId) : undefined;
      set({
        assetId: selectedAsset.id,
        asset: selectedAsset.name,
        locationId: selectedAsset.locationId || null,
        location: loc?.name || selectedAsset.locationName || '',
      });
    } else {
      // Asset cleared - location becomes editable again
      set({ assetId: undefined, asset: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-end" onClick={onClose}>
      <div className="bg-[var(--panel)] w-full max-w-xl h-full overflow-auto border-l border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--panel-2)] flex items-center justify-between">
          <div className="text-lg font-semibold">{initial?.id ? 'Edit Work Order' : 'New Work Order'}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>&#x2715;</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title<span className="text-red-500">*</span></label>
              <input
                value={value.title}
                onChange={(e) => set({ title: e.target.value })}
                className={`w-full border rounded px-2 py-1 text-sm ${errors.title ? 'border-red-400' : 'border-[var(--border)]'}`}
              />
              {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={value.status}
                onChange={(e) => set({ status: e.target.value as WorkOrderStatus })}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
              >
                <option value="Open">Open</option>
                <option value="On Hold">On Hold</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select
                value={value.priority}
                onChange={(e) => set({ priority: e.target.value as WorkOrderPriority })}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Due Date</label>
              <input
                type="date"
                value={value.dueDate}
                onChange={(e) => set({ dueDate: e.target.value })}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Asset</label>
              <select
                value={value.assetId || ''}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
              >
                <option value="">No Asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Location
                {hasAssetSelected && <span className="text-gray-400 ml-1">(synced from asset)</span>}
              </label>
              <LocationTreeSelector
                value={value.locationId || null}
                disabled={hasAssetSelected}
                onChange={(locationId, locationName) => set({ locationId, location: locationName })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea
                value={value.description}
                onChange={(e) => set({ description: e.target.value })}
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm min-h-[100px]"
              />
            </div>

            {/* Parts */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">
                Parts
              </label>
              {(value.parts || []).length > 0 && (
                <div className="border border-[var(--border)] rounded overflow-hidden mb-2">
                  <table className="w-full text-xs">
                    <thead className="bg-[var(--panel-2)] border-b border-[var(--border)]">
                      <tr>
                        <th className="text-left px-2 py-1 font-medium text-[var(--muted)] uppercase">Part</th>
                        <th className="text-left px-2 py-1 font-medium text-[var(--muted)] uppercase">Location</th>
                        <th className="text-center px-2 py-1 font-medium text-[var(--muted)] uppercase">Qty</th>
                        <th className="px-2 py-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(value.parts || []).map(wop => (
                        <tr key={`${wop.partId}-${wop.locationId}`} className={`border-b border-[var(--border)] last:border-0 ${wop.consumed ? 'opacity-60' : ''}`}>
                          <td className="px-2 py-1 font-medium">{wop.partName}</td>
                          <td className="px-2 py-1 text-gray-500">{wop.locationName}</td>
                          <td className="px-2 py-1 text-center">{wop.quantityUsed}</td>
                          <td className="px-2 py-1 text-center">
                            {wop.consumed ? (
                              <span className="text-[9px] text-green-600 font-bold uppercase">Consumed</span>
                            ) : (
                              <button type="button" onClick={() => removeEditorPart(wop.partId, wop.locationId)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="border border-dashed border-[var(--border)] rounded p-2 space-y-2">
                <select
                  className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
                  value={newPartId}
                  onChange={e => { setNewPartId(e.target.value); setNewPartLocId(''); setPartAddError(null); }}
                >
                  <option value="">Add a part…</option>
                  {parts.map(p => {
                    const total = getTotalStock(p);
                    return <option key={p.id} value={p.id}>{p.name} ({total} available)</option>;
                  })}
                </select>
                {selectedPart && (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
                      value={newPartLocId}
                      onChange={e => setNewPartLocId(e.target.value)}
                    >
                      <option value="">Select location…</option>
                      {selectedPart.inventory.map(inv => (
                        <option key={inv.locationId} value={inv.locationId}>
                          {inv.locationName} ({inv.quantity} in stock)
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-sm"
                        value={newPartQty}
                        onChange={e => setNewPartQty(Math.max(1, Number(e.target.value)))}
                      />
                      <button type="button" onClick={addEditorPart} className="text-blue-500 text-xs font-bold px-2 hover:text-blue-400 border border-blue-500 rounded">Add</button>
                    </div>
                  </div>
                )}
                {partAddError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">{partAddError}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--panel-2)] flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border border-[var(--border)] text-sm" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
