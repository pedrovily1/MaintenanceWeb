import React, { useMemo, useState } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '@/types/workOrder';
import { useAssetStore } from '@/store/useAssetStore';

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
  location: '',
  categories: [],
  workType: 'Other',
  sections: [],
  attachments: []
};

export const WorkOrderEditorPanel: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const { assets } = useAssetStore();
  const base = useMemo(() => ({ ...empty, ...initial }), [initial]);
  const [value, setValue] = useState<WorkOrderEditorValue>(base);
  const [errors, setErrors] = useState<{ title?: string }>({});

  React.useEffect(() => {
    setValue(base);
  }, [base]);

  if (!open) return null;

  const set = (patch: Partial<WorkOrderEditorValue>) => setValue(v => ({ ...v, ...patch }));

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

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-xl h-full overflow-auto border-l border-zinc-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-lg font-semibold">{initial?.id ? 'Edit Work Order' : 'New Work Order'}</div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title<span className="text-red-500">*</span></label>
              <input 
                value={value.title} 
                onChange={(e) => set({ title: e.target.value })} 
                className={`w-full border rounded px-2 py-1 text-sm ${errors.title ? 'border-red-400' : 'border-zinc-200'}`} 
              />
              {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title}</div>}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select 
                value={value.status} 
                onChange={(e) => set({ status: e.target.value as WorkOrderStatus })} 
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
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
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
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
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Asset</label>
              <select 
                value={assets.find(a => a.name === value.asset)?.id || ''} 
                onChange={(e) => {
                  const asset = assets.find(a => a.id === e.target.value);
                  set({ asset: asset?.name || '', assetId: asset?.id || '', location: asset?.locationName || '' });
                }} 
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
              >
                <option value="">No Asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea 
                value={value.description} 
                onChange={(e) => set({ description: e.target.value })} 
                className="w-full border border-zinc-200 rounded px-2 py-1 text-sm min-h-[100px]" 
              />
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
