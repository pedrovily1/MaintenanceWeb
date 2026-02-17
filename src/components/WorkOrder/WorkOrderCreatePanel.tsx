import { useMemo } from "react";
import { DEFAULT_SECTIONS } from "@/utils/defaultSections";
import { WorkOrder } from "@/types/workOrder";

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
  const isValid = useMemo(() => {
    // Minimal inline validation: Title and Due Date are required to create
    return Boolean(value.title && value.title.trim().length > 0 && value.dueDate && value.workType && value.priority && value.status);
  }, [value]);

  const update = (key: keyof DraftWorkOrder, v: any) => onChange({ [key]: v } as Partial<DraftWorkOrder>);

  return (
    <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
      <div className="relative box-border caret-transparent flex flex-col grow w-full">
        <div className="box-border caret-transparent shrink-0">
          <header className="border-b-zinc-200 box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4 border-b">
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
                  className="items-center bg-white caret-transparent flex h-8 justify-center tracking-[-0.2px] leading-[20.0004px] text-center border border-zinc-200 px-3 rounded-bl rounded-br rounded-tl rounded-tr border-solid hover:border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isValid}
                  onClick={() => onCreate(value)}
                  className={`relative font-bold items-center caret-transparent gap-x-1 flex shrink-0 h-10 justify-center tracking-[-0.2px] leading-[14px] text-center text-nowrap border px-4 rounded-bl rounded-br rounded-tl rounded-tr border-solid ${isValid ? 'text-white bg-blue-500 border-blue-500 hover:bg-blue-400 hover:border-blue-400' : 'text-gray-400 bg-gray-200 border-gray-200 cursor-not-allowed'}`}
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
                  className={`w-full border rounded p-2 text-sm ${value.title?.trim() ? 'border-zinc-200' : 'border-red-300'}`}
                  placeholder="Enter a descriptive title"
                  value={value.title}
                  onChange={(e) => update('title', e.target.value)}
                />

                {/* Description */}
                <div className="box-border caret-transparent shrink-0 mt-6 pb-2">
                  <strong className="font-semibold box-border caret-transparent shrink-0">Description</strong>
                </div>
                <textarea
                  className="w-full border border-zinc-200 rounded p-2 text-sm min-h-[100px]"
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
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
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
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
                      value={value.priority}
                      onChange={(e) => update('priority', e.target.value as DraftWorkOrder['priority'])}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Row: Due Date, Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Due Date</strong>
                    </div>
                    <input
                      type="date"
                      className={`w-full border rounded p-2 text-sm ${value.dueDate ? 'border-zinc-200' : 'border-red-300'}`}
                      value={value.dueDate}
                      onChange={(e) => update('dueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Status</strong>
                    </div>
                    <select
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
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
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
                      value={value.assignedTo}
                      onChange={(e) => update('assignedTo', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Asset</strong>
                    </div>
                    <input
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
                      value={value.asset}
                      onChange={(e) => update('asset', e.target.value)}
                    />
                  </div>
                </div>

                {/* Location & Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Location</strong>
                    </div>
                    <input
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
                      value={value.location}
                      onChange={(e) => update('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="box-border caret-transparent shrink-0 pb-2">
                      <strong className="font-semibold box-border caret-transparent shrink-0">Categories</strong>
                    </div>
                    <input
                      className="w-full border border-zinc-200 rounded p-2 text-sm"
                      placeholder="Comma separated"
                      value={(value.categories || []).join(', ')}
                      onChange={(e) => update('categories', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    />
                  </div>
                </div>

                {/* Repeating */}
                <div className="mt-6 flex items-center gap-2">
                  <input
                    id="isRepeating"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={Boolean(value.isRepeating)}
                    onChange={(e) => update('isRepeating', e.target.checked)}
                  />
                  <label htmlFor="isRepeating" className="text-sm">Repeating schedule</label>
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
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  assignedTo: 'Pedro Modesto',
  assignedUsers: [{ name: 'Pedro Modesto', imageUrl: 'https://app.getmaintainx.com/img/static/user_placeholders/RandomPicture24.png' }],
  asset: 'GENERAL PURPOSE',
  location: 'Site',
  categories: ['Maintenance'],
  workType: 'Corrective',
  sections: [], // No longer pre-filled
  attachments: [],
  isRepeating: false,
  procedureInstances: [],
});