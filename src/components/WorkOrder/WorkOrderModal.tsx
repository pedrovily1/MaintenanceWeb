import { useMemo, useState } from 'react';
import { useWorkOrderStore } from '@/store/useWorkOrderStore';
import { SectionRenderer } from '@/components/WorkOrder/SectionRenderer';
import { WorkOrderSection, WorkOrder } from '@/types/workOrder';
import { ProcedureSelector } from '@/components/WorkOrder/ProcedureSelector';
import { useProcedureStore } from '@/store/useProcedureStore';
import { procedureToWorkOrderSections } from '@/utils/procedureMapping';

interface WorkOrderModalProps {
  workOrderId: string;
  onClose: () => void;
}

export const WorkOrderModal = ({ workOrderId, onClose }: WorkOrderModalProps) => {
  const { workOrders, updateWorkOrder } = useWorkOrderStore();
  const wo = useMemo(() => workOrders.find(w => w.id === workOrderId), [workOrders, workOrderId]);
  const [showSelector, setShowSelector] = useState(false);
  const { getProcedureById } = useProcedureStore();

  if (!wo) return null;

  const updateMeta = (patch: Partial<WorkOrder>) => updateWorkOrder(wo.id, patch);

  const handleUpdateSection = (sectionId: string, updates: Partial<WorkOrderSection>) => {
    if (!wo) return;
    // try legacy sections
    if (Array.isArray(wo.sections)) {
      const idx = wo.sections.findIndex(s => s.id === sectionId);
      if (idx >= 0) {
        const newSections = wo.sections.map((s,i) => i === idx ? { ...s, ...updates } : s);
        updateWorkOrder(wo.id, { sections: newSections });
        return;
      }
    }
    // try procedure instance sections
    const instances = wo.procedureInstances || [];
    for (let i = 0; i < instances.length; i++) {
      const pi = instances[i];
      const sidx = pi.procedureSchemaSnapshot.findIndex(s => s.id === sectionId);
      if (sidx >= 0) {
        const newInstances = instances.map((inst, j) => {
          if (j !== i) return inst;
          const newSections = inst.procedureSchemaSnapshot.map((s, k) => k === sidx ? { ...s, ...updates } : s);
          const newResponses = { ...inst.responses };
          if (updates.fields) {
            updates.fields.forEach(f => { newResponses[f.id] = f.value; });
          }
          return { ...inst, procedureSchemaSnapshot: newSections, responses: newResponses, updatedAt: new Date().toISOString() };
        });
        updateWorkOrder(wo.id, { procedureInstances: newInstances });
        return;
      }
    }
  };

  const attachProcedure = (procedureId: string) => {
    const proc = getProcedureById(procedureId);
    if (!proc) return;
    const sections = procedureToWorkOrderSections(proc);
    const instance = {
      id: crypto.randomUUID(),
      procedureId: proc.id,
      procedureNameSnapshot: proc.name,
      procedureVersionSnapshot: proc.meta.version,
      procedureSchemaSnapshot: sections,
      responses: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const existing = wo.procedureInstances || [];
    updateWorkOrder(wo.id, { procedureInstances: [...existing, instance] });
    setShowSelector(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg shadow-lg border border-zinc-200">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">{wo.title}</div>
            <div className="text-xs text-gray-500">
              {wo.asset} • {wo.startDate ? `Starts ${new Date(wo.startDate).toLocaleDateString()} • ` : ''}Due {new Date(wo.dueDate).toLocaleDateString()}
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
          {/* Meta editors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select value={wo.status} onChange={(e) => updateMeta({ status: e.target.value as WorkOrder['status'] })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm">
                <option value="Open">Open</option>
                <option value="On Hold">On Hold</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select value={wo.priority} onChange={(e) => updateMeta({ priority: e.target.value as WorkOrder['priority'] })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Assigned To</label>
              <input value={wo.assignedTo} onChange={(e) => updateMeta({ assignedTo: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input type="date" value={wo.startDate || ''} onChange={(e) => updateMeta({ startDate: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Due Date</label>
              <input type="date" value={wo.dueDate} onChange={(e) => updateMeta({ dueDate: e.target.value })} className="w-full border border-zinc-200 rounded px-2 py-1 text-sm" />
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                id="modalIsRepeating"
                type="checkbox"
                className="h-4 w-4"
                checked={Boolean(wo.isRepeating)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  updateMeta({
                    isRepeating: checked,
                    schedule: checked ? {
                      frequency: 'weekly',
                      startDate: wo.startDate || new Date().toISOString().split('T')[0]
                    } : undefined
                  });
                }}
              />
              <label htmlFor="modalIsRepeating" className="text-sm font-semibold text-gray-700">Repeating Schedule</label>
            </div>

            {wo.isRepeating && (
              <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-blue-500">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Frequency</label>
                  <select
                    className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
                    value={wo.schedule?.frequency || 'weekly'}
                    onChange={(e) => updateMeta({ schedule: { ...(wo.schedule as any), frequency: e.target.value as any } })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Schedule Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
                    value={wo.schedule?.startDate || wo.startDate || ''}
                    onChange={(e) => {
                      updateMeta({
                        schedule: { ...(wo.schedule as any), startDate: e.target.value },
                        startDate: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attached Procedures */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm font-medium">Procedures</div>
            <button className="text-blue-600 text-sm hover:text-blue-500" onClick={() => setShowSelector(true)}>Add Procedure</button>
          </div>

          {(wo.procedureInstances || []).map((pi) => (
            <div key={pi.id} className="border border-zinc-200 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 text-sm font-semibold">{pi.procedureNameSnapshot} <span className="text-gray-400">v{pi.procedureVersionSnapshot}</span></div>
              <div className="p-3">
                {(pi.procedureSchemaSnapshot || []).map(section => (
                  <SectionRenderer key={section.id} section={section} onUpdate={(upd) => handleUpdateSection(section.id, upd)} />
                ))}
              </div>
            </div>
          ))}

          {/* Legacy sections (fallback) */}
          {Array.isArray(wo.sections) && wo.sections.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Legacy Form Data</div>
              {(wo.sections || []).map(section => (
                <SectionRenderer key={section.id} section={section} onUpdate={(upd) => handleUpdateSection(section.id, upd)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-200 bg-gray-50 flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded border border-zinc-200 text-sm" onClick={onClose}>Close</button>
        </div>
      </div>

      {/* Procedure selector drawer (simple overlay) */}
      {showSelector && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={() => setShowSelector(false)}>
          <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto rounded-lg shadow-lg border border-zinc-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
              <div className="text-lg font-semibold">Add Procedure</div>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setShowSelector(false)}>✕</button>
            </div>
            <ProcedureSelector onSelect={(id) => attachProcedure(id)} onClose={() => setShowSelector(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
