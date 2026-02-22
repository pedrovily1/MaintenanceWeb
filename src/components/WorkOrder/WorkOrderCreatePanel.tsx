import { useMemo, useState } from "react";
import { useSiteStore } from "@/store/useSiteStore";
import { WorkOrder } from "@/types/workOrder";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useVendorStore } from "@/store/useVendorStore";
import { useAssetStore } from "@/store/useAssetStore";
import { LocationTreeSelector } from "@/components/LocationTreeSelector";
import { getLocationSync } from "@/store/useLocationStore";
import { usePartStore } from "@/store/usePartStore";
import { getTotalStock } from "@/types/part";
import type { WorkOrderPart } from "@/types/part";

// Draft work order type used before persisting to the store
export type DraftWorkOrder = Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber'>;

interface WorkOrderCreatePanelProps {
  value: DraftWorkOrder;
  onChange: (patch: Partial<DraftWorkOrder>) => void;
  onCancel: () => void;
  onCreate: (data: DraftWorkOrder) => void;
}

// NOTE: This panel reuses the same visual language as the detail pane (spacing, typography, borders)
export const WorkOrderCreatePanel = ({ value, onChange, onCancel, onCreate }: WorkOrderCreatePanelProps) => {
  const { activeCategories } = useCategoryStore();
  const { activeSiteId } = useSiteStore();
  const { activeVendors } = useVendorStore();
  const { assets } = useAssetStore();
  const { parts } = usePartStore();

  // Parts section state
  const [newPartId, setNewPartId] = useState('');
  const [newPartLocId, setNewPartLocId] = useState('');
  const [newPartQty, setNewPartQty] = useState(1);
  const [partAddError, setPartAddError] = useState<string | null>(null);

  const selectedPart = parts.find(p => p.id === newPartId);
  const availableLocations = selectedPart ? selectedPart.inventory : [];

  const addPart = () => {
    if (!newPartId) { setPartAddError('Select a part.'); return; }
    if (!newPartLocId) { setPartAddError('Select a location.'); return; }
    if (newPartQty <= 0) { setPartAddError('Quantity must be > 0.'); return; }

    const part = parts.find(p => p.id === newPartId);
    if (!part) return;
    const inv = part.inventory.find(i => i.locationId === newPartLocId);
    if (!inv) { setPartAddError('Part not stocked at this location.'); return; }
    if (inv.quantity < newPartQty) {
      setPartAddError(`Only ${inv.quantity} ${part.unit || 'unit(s)'} available at this location.`);
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
    // Prevent duplicate part+location
    if (existing.some(p => p.partId === wop.partId && p.locationId === wop.locationId)) {
      setPartAddError('This part from this location is already added.');
      return;
    }

    onChange({ parts: [...existing, wop] });
    setNewPartId('');
    setNewPartLocId('');
    setNewPartQty(1);
    setPartAddError(null);
  };

  const removeWoPart = (partId: string, locationId: string) => {
    onChange({ parts: (value.parts || []).filter(p => !(p.partId === partId && p.locationId === locationId)) });
  };

  const hasAssetSelected = Boolean(value.assetId);

  const isValid = useMemo(() => {
    // Minimal inline validation: Title and Due Date are required to create
    return Boolean(value.title && value.title.trim().length > 0 && value.dueDate && value.workType && value.priority && value.status);
  }, [value]);

  const update = (key: keyof DraftWorkOrder, v: any) => onChange({ [key]: v } as Partial<DraftWorkOrder>);

  return (
    <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
      <div className="relative box-border caret-transparent flex flex-col grow w-full">
        <div className="box-border caret-transparent shrink-0">
          <header className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4">
            <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
              <div className="box-border caret-transparent">
                <h3 className="text-[20.0004px] font-semibold box-border caret-transparent tracking-[-0.2px] leading-[28.0006px]">
                  New Work Order
                </h3>
                <div className="text-gray-600 text-[11.9994px]">Create a new work order inline</div>
              </div>
              <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-[var(--border)] px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isValid || !activeSiteId}
                  onClick={() => onCreate(value)}
                  className={`relative font-bold items-center caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] text-center text-nowrap border px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid transition-colors ${isValid ? 'text-white bg-accent border-accent hover:bg-accent-hover hover:border-accent-hover cursor-pointer' : 'text-gray-400 bg-gray-200 border-[var(--border)] cursor-not-allowed'}`}
                >
                  Create
                </button>
              </div>
            </div>
          </header>
        </div>

        <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4">
          <div className="box-border caret-transparent shrink-0 pb-6">
            <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4 mt-3">
              <div className="box-border caret-transparent basis-[0%] grow ml-6 my-3">
                {/* Title */}
                <div className="box-border caret-transparent shrink-0 pb-2">
                  <strong className="font-semibold box-border caret-transparent shrink-0">Title</strong>
                </div>
                <input
                  className={`w-full border rounded p-2 text-sm ${value.title?.trim() ? 'border-[var(--border)]' : 'border-red-300'}`}
                  placeholder="Enter a descriptive title"
                  value={value.title}
                  onChange={(e) => update('title', e.target.value)}
                />

                {/* Description */}
                <div className="box-border caret-transparent shrink-0 mt-6 pb-2">
                  <strong className="font-semibold box-border caret-transparent shrink-0">Description</strong>
                </div>
                <textarea
                  className="w-full border border-[var(--border)] rounded p-2 text-sm min-h-[100px]"
                  placeholder="Describe the task..."
                  value={value.description}
                  onChange={(e) => update('description', e.target.value)}
                />

                {/* Row: Work Type, Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Work Type</strong>
                    </div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.workType}
                      onChange={(e) => update('workType', e.target.value as DraftWorkOrder['workType'])}
                    >
                      <option value="Preventive">Preventive</option>
                      <option value="Corrective">Corrective</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Priority</strong>
                    </div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.priority}
                      onChange={(e) => update('priority', e.target.value as DraftWorkOrder['priority'])}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Row: Start Date, Due Date, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Start Date</strong>
                    </div>
                    <input
                      type="date"
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.startDate || ''}
                      onChange={(e) => update('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Due Date</strong>
                    </div>
                    <input
                      type="date"
                      className={`w-full border rounded p-2 text-sm ${value.dueDate ? 'border-[var(--border)]' : 'border-red-300'}`}
                      value={value.dueDate}
                      onChange={(e) => update('dueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Status</strong>
                    </div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.status}
                      onChange={(e) => update('status', e.target.value as DraftWorkOrder['status'])}
                    >
                      <option value="Open">Open</option>
                      <option value="On Hold">On Hold</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                {/* Row: Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Assigned To</strong>
                    </div>
                    <input
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.assignedTo}
                      onChange={(e) => update('assignedTo', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Asset</strong>
                    </div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.assetId || ''}
                      onChange={(e) => {
                        const selectedAsset = assets.find(a => a.id === e.target.value);
                        if (selectedAsset) {
                          const loc = selectedAsset.locationId ? getLocationSync(selectedAsset.locationId) : undefined;
                          onChange({
                            assetId: selectedAsset.id,
                            asset: selectedAsset.name,
                            locationId: selectedAsset.locationId || null,
                            location: loc?.name || selectedAsset.locationName || '',
                          });
                        } else {
                          // Asset cleared - location becomes editable
                          onChange({ assetId: undefined, asset: '' });
                        }
                      }}
                    >
                      <option value="">No Asset</option>
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Location</strong>
                      {hasAssetSelected && (
                        <span className="text-xs text-gray-400 ml-2">(synced from asset)</span>
                      )}
                    </div>
                    <LocationTreeSelector
                      value={value.locationId || null}
                      disabled={hasAssetSelected}
                      onChange={(locationId, locationName) => {
                        onChange({ locationId, location: locationName });
                      }}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Category</strong>
                    </div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={value.categoryId || ''}
                      onChange={(e) => update('categoryId', e.target.value || null)}
                    >
                      <option value="">No Category</option>
                      {activeCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vendor */}
                <div className="mt-6">
                  <div className="box-border caret-transparent shrink-0 pb-2">
                    <strong className="font-semibold box-border caret-transparent shrink-0">Vendor</strong>
                    <span className="text-gray-500 text-xs ml-2">(optional - for external contractor work)</span>
                  </div>
                  <select
                    className="w-full border border-[var(--border)] rounded p-2 text-sm"
                    value={value.vendorId || ''}
                    onChange={(e) => update('vendorId', e.target.value || null)}
                  >
                    <option value="">Internal Work (No Vendor)</option>
                    {activeVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}{vendor.trade ? ` - ${vendor.trade}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parts Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between pb-2">
                    <strong className="font-semibold box-border caret-transparent shrink-0">Parts</strong>
                    <span className="text-xs text-gray-500">Inventory will be deducted on completion</span>
                  </div>

                  {/* Added parts table */}
                  {(value.parts || []).length > 0 && (
                    <div className="border border-[var(--border)] rounded overflow-hidden mb-3">
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
                          {(value.parts || []).map(wop => {
                            const p = parts.find(pt => pt.id === wop.partId);
                            const inv = p?.inventory.find(i => i.locationId === wop.locationId);
                            const insufficient = inv ? inv.quantity < wop.quantityUsed : false;
                            return (
                              <tr key={`${wop.partId}-${wop.locationId}`} className={`border-b border-[var(--border)] last:border-0 ${insufficient ? 'bg-red-50' : ''}`}>
                                <td className="px-2 py-1.5 font-medium">{wop.partName}</td>
                                <td className="px-2 py-1.5 text-gray-500">{wop.locationName}</td>
                                <td className="px-2 py-1.5 text-center">
                                  {insufficient ? (
                                    <span className="text-red-600 font-bold">{wop.quantityUsed} ⚠</span>
                                  ) : wop.quantityUsed}
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeWoPart(wop.partId, wop.locationId)}
                                    className="text-red-400 hover:text-red-600 text-xs"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Add part row */}
                  <div className="border border-dashed border-[var(--border)] rounded p-3 space-y-2">
                    <div className="text-[10px] text-[var(--muted)] uppercase font-semibold">Add Part</div>
                    <select
                      className="w-full border border-[var(--border)] rounded p-2 text-sm"
                      value={newPartId}
                      onChange={e => { setNewPartId(e.target.value); setNewPartLocId(''); setPartAddError(null); }}
                    >
                      <option value="">Select a part…</option>
                      {parts.map(p => {
                        const total = getTotalStock(p);
                        return (
                          <option key={p.id} value={p.id}>
                            {p.name} ({total} {p.unit || 'unit'}{total !== 1 ? 's' : ''} available)
                          </option>
                        );
                      })}
                    </select>

                    {selectedPart && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[var(--muted)] block mb-0.5">Location</label>
                          <select
                            className="w-full border border-[var(--border)] rounded p-1.5 text-sm"
                            value={newPartLocId}
                            onChange={e => setNewPartLocId(e.target.value)}
                          >
                            <option value="">Select location…</option>
                            {availableLocations.map(inv => (
                              <option key={inv.locationId} value={inv.locationId}>
                                {inv.locationName} ({inv.quantity} in stock)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-[var(--muted)] block mb-0.5">Quantity</label>
                          <input
                            type="number"
                            min={1}
                            max={newPartLocId ? (availableLocations.find(i => i.locationId === newPartLocId)?.quantity ?? 999) : 999}
                            className="w-full border border-[var(--border)] rounded p-1.5 text-sm"
                            value={newPartQty}
                            onChange={e => setNewPartQty(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                      </div>
                    )}

                    {partAddError && (
                      <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">
                        {partAddError}
                      </div>
                    )}

                    {selectedPart && (
                      <button
                        type="button"
                        onClick={addPart}
                        className="text-blue-500 text-xs font-bold uppercase tracking-widest hover:text-blue-400"
                      >
                        + Add Part
                      </button>
                    )}
                  </div>
                </div>

                {/* Legacy Categories (tags) */}
                <div className="mt-6">
                  <div className="box-border caret-transparent shrink-0 pb-2">
                    <strong className="font-semibold box-border caret-transparent shrink-0">Tags</strong>
                  </div>
                  <input
                    className="w-full border border-[var(--border)] rounded p-2 text-sm"
                    placeholder="Comma separated tags"
                    value={(value.categories || []).join(', ')}
                    onChange={(e) => update('categories', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </div>

                {/* Repeating */}
                <div className="mt-6">
                  <div className="flex items-center gap-2">
                    <input
                      id="isRepeating"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(value.isRepeating)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        onChange({
                          isRepeating: checked,
                          schedule: checked ? {
                            frequency: 'weekly',
                            startDate: value.startDate || new Date().toISOString().split('T')[0]
                          } : undefined
                        });
                      }}
                    />
                    <label htmlFor="isRepeating" className="text-sm font-semibold">Repeating schedule</label>
                  </div>

                  {value.isRepeating && (
                    <div className="mt-3 pl-6 border-l-2 border-blue-500">
                      <div className="box-border caret-transparent shrink-0 pb-2">
                        <strong className="text-xs font-semibold box-border caret-transparent shrink-0">Frequency</strong>
                      </div>
                      <select
                        className="w-full border border-[var(--border)] rounded p-2 text-sm"
                        value={value.schedule?.frequency || 'weekly'}
                        onChange={(e) => {
                          const freq = e.target.value as any;
                          update('schedule', { ...value.schedule, frequency: freq });
                        }}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>

                      <div className="mt-3">
                        <div className="box-border caret-transparent shrink-0 pb-2">
                          <strong className="text-xs font-semibold box-border caret-transparent shrink-0">Schedule Start Date</strong>
                        </div>
                        <input
                          type="date"
                          className="w-full border border-[var(--border)] rounded p-2 text-sm"
                          value={value.schedule?.startDate || value.startDate || ''}
                          onChange={(e) => {
                            update('schedule', { ...value.schedule, startDate: e.target.value });
                            update('startDate', e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sections (optional at creation) */}
                <div className="mt-6 text-xs text-gray-500">
                  Sections are preloaded and can be completed after creation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to build a default draft matching previous implicit defaults used by prompt-based flow
export const buildDefaultDraft = (overrides?: Partial<DraftWorkOrder>): DraftWorkOrder => ({
  title: "",
  description: "",
  createdByUserId: '',
  status: 'Open',
  priority: 'Medium',
  startDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  assignedTo: 'Admin',
  assignedUsers: [{ name: 'Admin', imageUrl: 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture4.png' }],
  asset: '',
  locationId: null,
  location: '',
  categories: ['Maintenance'],
  workType: 'Corrective',
  sections: [], // No longer pre-filled
  attachments: [],
  isRepeating: false,
  procedureInstances: [],
  parts: [],
  ...overrides,
});