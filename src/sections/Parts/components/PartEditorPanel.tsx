import { useState, useEffect } from 'react';
import { Part, PartType, PartInventory } from '@/types/part';
import { useLocationStore } from '@/store/useLocationStore';

const PART_TYPES: PartType[] = ['Spare Part', 'Consumable', 'Tool', 'Safety Equipment', 'Other'];

type PartEditorPanelProps = {
  open: boolean;
  initial?: Part;
  onClose: () => void;
  onSubmit: (data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => void;
};

const EMPTY: Omit<Part, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  partType: 'Spare Part',
  unit: 'unit',
  minStock: 1,
  inventory: [],
  compatibleAssetIds: [],
};

export const PartEditorPanel = ({ open, initial, onClose, onSubmit }: PartEditorPanelProps) => {
  const { locations } = useLocationStore();
  const [form, setForm] = useState<Omit<Part, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);
  const [newLocId, setNewLocId] = useState('');
  const [newLocQty, setNewLocQty] = useState(0);
  const [newLocMin, setNewLocMin] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              description: initial.description ?? '',
              partType: initial.partType,
              unit: initial.unit ?? 'unit',
              minStock: initial.minStock,
              inventory: initial.inventory,
              compatibleAssetIds: initial.compatibleAssetIds,
              imageUrl: initial.imageUrl,
              barcode: initial.barcode,
            }
          : EMPTY
      );
      setError(null);
      setNewLocId('');
      setNewLocQty(0);
      setNewLocMin(1);
    }
  }, [open, initial]);

  if (!open) return null;

  const update = (key: keyof typeof form, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const addInventoryRow = () => {
    if (!newLocId) { setError('Select a location.'); return; }
    if (form.inventory.some(i => i.locationId === newLocId)) {
      setError('This location is already listed.'); return;
    }
    const loc = locations.find(l => l.id === newLocId);
    if (!loc) return;
    const inv: PartInventory = {
      locationId: newLocId,
      locationName: loc.name,
      quantity: newLocQty,
      minQuantity: newLocMin,
    };
    setForm(prev => ({ ...prev, inventory: [...prev.inventory, inv] }));
    setNewLocId('');
    setNewLocQty(0);
    setNewLocMin(1);
    setError(null);
  };

  const removeInventoryRow = (locationId: string) => {
    setForm(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.locationId !== locationId),
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end" onClick={onClose}>
      <div
        className="bg-white h-full w-full max-w-md shadow-xl flex flex-col overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[var(--panel-2)] border-b border-[var(--border)] px-4 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Part' : 'New Part'}</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[var(--border)] px-3 py-1 rounded text-sm hover:border-neutral-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-teal-500 text-white border border-teal-500 px-3 py-1 rounded text-sm hover:bg-teal-400"
            >
              {initial ? 'Save' : 'Create'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="p-4 space-y-5 flex-1">
          {/* Name */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-[var(--border)] rounded p-2 text-sm"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Part name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-[var(--border)] rounded p-2 text-sm min-h-[60px]"
              value={form.description ?? ''}
              onChange={e => update('description', e.target.value)}
              placeholder="Optional description"
            />
          </div>

          {/* Type + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">
                Part Type
              </label>
              <select
                className="w-full border border-[var(--border)] rounded p-2 text-sm"
                value={form.partType}
                onChange={e => update('partType', e.target.value as PartType)}
              >
                {PART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">
                Unit
              </label>
              <input
                className="w-full border border-[var(--border)] rounded p-2 text-sm"
                value={form.unit ?? ''}
                onChange={e => update('unit', e.target.value)}
                placeholder="unit, L, kg…"
              />
            </div>
          </div>

          {/* Min Stock */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-1">
              Global Minimum Stock
            </label>
            <input
              type="number"
              min={0}
              className="w-full border border-[var(--border)] rounded p-2 text-sm"
              value={form.minStock}
              onChange={e => update('minStock', Math.max(0, Number(e.target.value)))}
            />
          </div>

          {/* Inventory Table */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-2">
              Inventory by Location
            </label>
            {form.inventory.length > 0 && (
              <div className="border border-[var(--border)] rounded overflow-hidden mb-2">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--panel-2)] border-b border-[var(--border)]">
                    <tr>
                      <th className="text-left px-2 py-1 font-medium text-[var(--muted)] uppercase">Location</th>
                      <th className="text-center px-2 py-1 font-medium text-[var(--muted)] uppercase">Qty</th>
                      <th className="text-center px-2 py-1 font-medium text-[var(--muted)] uppercase">Min</th>
                      <th className="px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.inventory.map(inv => (
                      <tr key={inv.locationId} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-2 py-1">{inv.locationName}</td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="number"
                            min={0}
                            className="w-14 border border-[var(--border)] rounded px-1 py-0.5 text-center text-xs"
                            value={inv.quantity}
                            onChange={e => {
                              const qty = Math.max(0, Number(e.target.value));
                              setForm(prev => ({
                                ...prev,
                                inventory: prev.inventory.map(i =>
                                  i.locationId === inv.locationId ? { ...i, quantity: qty } : i
                                ),
                              }));
                            }}
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <input
                            type="number"
                            min={0}
                            className="w-14 border border-[var(--border)] rounded px-1 py-0.5 text-center text-xs"
                            value={inv.minQuantity}
                            onChange={e => {
                              const min = Math.max(0, Number(e.target.value));
                              setForm(prev => ({
                                ...prev,
                                inventory: prev.inventory.map(i =>
                                  i.locationId === inv.locationId ? { ...i, minQuantity: min } : i
                                ),
                              }));
                            }}
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            type="button"
                            onClick={() => removeInventoryRow(inv.locationId)}
                            className="text-red-400 hover:text-red-600 text-xs"
                            title="Remove location"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add location row */}
            <div className="border border-dashed border-[var(--border)] rounded p-2 space-y-2">
              <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Add Location</div>
              <select
                className="w-full border border-[var(--border)] rounded p-1 text-sm"
                value={newLocId}
                onChange={e => setNewLocId(e.target.value)}
              >
                <option value="">Select location…</option>
                {locations
                  .filter(l => !form.inventory.some(i => i.locationId === l.id))
                  .map(l => <option key={l.id} value={l.id}>{l.name}</option>)
                }
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
                    value={newLocQty}
                    onChange={e => setNewLocQty(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--muted)]">Min Qty</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-[var(--border)] rounded px-2 py-1 text-sm"
                    value={newLocMin}
                    onChange={e => setNewLocMin(Math.max(0, Number(e.target.value)))}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addInventoryRow}
                className="text-teal-500 text-xs font-bold uppercase tracking-widest hover:text-teal-400"
              >
                + Add to Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
