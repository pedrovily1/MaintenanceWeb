import { useMemo } from "react";
import { DEFAULT_SECTIONS } from "@/utils/defaultSections";
import { WorkOrder } from "@/types/workOrder";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useVendorStore } from "@/store/useVendorStore";
import { useAssetStore } from "@/store/useAssetStore";
import { LocationTreeSelector } from "@/components/LocationTreeSelector";
import { getLocationSync } from "@/store/useLocationStore";

// Draft work order type used before persisting to the store
export type DraftWorkOrder = Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt' | 'workOrderNumber'>;

interface WorkOrderCreatePanelProps {
  value: DraftWorkOrder;
  onChange: (patch: Partial<DraftWorkOrder>) => void;
  onCancel: () => void;
  onCreate: (data: DraftWorkOrder) => void;
}

// NOTE: This panel reuses the same visual language as the detail pane (spacing, typography, borders)
// It is lightweight and controlled by the parent to preserve partially entered data if user navigates away.
export const WorkOrderCreatePanel = ({ value, onChange, onCancel, onCreate }: WorkOrderCreatePanelProps) => {
  const { activeCategories, getCategoryById } = useCategoryStore();
  const { activeVendors } = useVendorStore();
  const { assets } = useAssetStore();

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
                  disabled={!isValid}
                  onClick={() => onCreate(value)}
                  className={`relative font-bold items-center caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] text-center text-nowrap border px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid ${isValid ? 'text-white bg-blue-500 border-blue-500 hover:bg-blue-400 hover:border-blue-400' : 'text-gray-400 bg-gray-200 border-[var(--border)] cursor-not-allowed'}`}
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
                          // Auto-sync location from asset
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
                            // Also sync main startDate for consistency if needed
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
export const buildDefaultDraft = (): DraftWorkOrder => ({
  title: "",
  description: "",
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
});