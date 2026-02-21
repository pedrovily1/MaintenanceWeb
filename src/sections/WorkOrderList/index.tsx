import { useState, useMemo, useEffect } from "react";
import { WorkOrderCreatePanel, buildDefaultDraft, DraftWorkOrder } from "@/components/WorkOrder/WorkOrderCreatePanel";
import { TabButtons } from "@/sections/WorkOrderList/components/TabButtons";
import { SortControls } from "@/sections/WorkOrderList/components/SortControls";
import { WorkOrderCard } from "@/sections/WorkOrderList/components/WorkOrderCard";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useProcedureStore } from "@/store/useProcedureStore";
import { useUserStore } from "@/store/useUserStore";
import { useFilterStore } from "@/store/useFilterStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { procedureToWorkOrderSections } from "@/utils/procedureMapping";

import { attachmentService } from "@/services/attachmentService";
import { SectionRenderer } from "@/components/WorkOrder/SectionRenderer";
import { WorkOrderSection, ProcedureInstance } from "@/types/workOrder";
import { ProcedureSelector } from "@/components/WorkOrder/ProcedureSelector";
import { WorkOrderEditorPanel } from "./components/WorkOrderEditorPanel";
import { Plus, Trash2, ClipboardList, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { getDescendantLocationIds } from "@/store/useLocationStore";

export const WorkOrderList = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrderStore();
  const { getUserById } = useUserStore();
  const { assignedTo, search: filterSearch, locationId: filterLocationId } = useFilterStore();
  const { getCategoryById } = useCategoryStore();
  const [panelMode, setPanelMode] = useState<'view' | 'create'>('view');
  const [draft, setDraft] = useState<DraftWorkOrder | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [pendingAttachProcedureId, setPendingAttachProcedureId] = useState<string | null>(null);
  const [showProcedureSelector, setShowProcedureSelector] = useState(false);
  const [procToRemove, setProcToRemove] = useState<string | null>(null);
  const { getProcedureById } = useProcedureStore();

  const filteredWorkOrders = useMemo(() => {
    if (!Array.isArray(workOrders)) return [];
    let list = workOrders;

    // Filter out templates (recurring items that are used to generate instances)
    list = list.filter(wo => !wo.isRepeating);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (activeTab === 'done') {
      list = list.filter(wo => wo && wo.status === 'Done');
    } else {
      // PART 2 Logic: Show if Open/In Progress/Overdue AND not future recurring
      list = list.filter(wo => {
        if (!wo || wo.status === 'Done') return false;
        
        // Exclude future recurring instances (those whose occurrenceDate > today AND whose previous cycle is incomplete)
        // Wait, "One cycle at a time" means if it's in the store and not Done, it IS the current active one.
        // And we don't pre-create future ones.
        // So any instance in the store with status !== 'Done' is an active instance.
        
        // Just check for overdue
        const isOverdue = wo.dueDate < todayStr;
        
        // Exclude future instances that might have been accidentally pre-created or if logic changes
        if (wo.occurrenceDate && wo.occurrenceDate > todayStr) {
           // In MaintainX, future instances don't show in To-Do.
           return false;
        }

        return true;
      });
    }

    if (assignedTo) {
      list = list.filter(wo => wo.assignedToUserId === assignedTo || wo.assignedTo === assignedTo);
    }

    if (filterSearch) {
      const term = filterSearch.toLowerCase();
      list = list.filter(wo =>
        wo.title.toLowerCase().includes(term) ||
        wo.workOrderNumber.toLowerCase().includes(term)
      );
    }

    // Filter by location (including child locations)
    if (filterLocationId) {
      const descendantIds = getDescendantLocationIds(filterLocationId);
      const matchIds = new Set([filterLocationId, ...descendantIds]);
      list = list.filter(wo => wo.locationId && matchIds.has(wo.locationId));
    }

    return list;
  }, [workOrders, activeTab, assignedTo, filterSearch, filterLocationId]);

  const selectedWorkOrder = useMemo(() => {
    try {
      if (!Array.isArray(workOrders) || workOrders.length === 0) return null;
      const found = workOrders.find(wo => wo && wo.id === selectedWorkOrderId);
      if (found) return found;
      // Don't auto-select the first one if the ID was explicitly set but not found (e.g. deleted)
      if (selectedWorkOrderId) return null;
      return (Array.isArray(filteredWorkOrders) && filteredWorkOrders[0]) || null;
    } catch (e) {
      console.error("Error selecting work order", e);
      return null;
    }
  }, [selectedWorkOrderId, workOrders, filteredWorkOrders]);

  const handleUpdateSection = (sectionId: string, updates: Partial<WorkOrderSection>) => {
    if (!selectedWorkOrder) return;
    // Try legacy sections first
    if (Array.isArray(selectedWorkOrder.sections)) {
      const found = selectedWorkOrder.sections.find(s => s && s.id === sectionId);
      if (found) {
        const updatedSections = selectedWorkOrder.sections.map(s => s && s.id === sectionId ? { ...s, ...updates } : s);
        updateWorkOrder(selectedWorkOrder.id, { sections: updatedSections });
        return;
      }
    }
    // Then try within attached procedure instances
    const instances = selectedWorkOrder.procedureInstances || [];
    for (let i = 0; i < instances.length; i++) {
      const pi = instances[i];
      const idx = pi.procedureSchemaSnapshot.findIndex(s => s.id === sectionId);
      if (idx >= 0) {
        const newInstances = instances.map((inst, j) => {
          if (j !== i) return inst;
          const newSections = inst.procedureSchemaSnapshot.map((s, k) => k === idx ? { ...s, ...updates } : s);
          // Also sync responses record
          const newResponses = { ...inst.responses };
          if (updates.fields) {
            updates.fields.forEach(f => {
              newResponses[f.id] = f.value;
            });
          }
          return { ...inst, procedureSchemaSnapshot: newSections, responses: newResponses, updatedAt: new Date().toISOString() } as ProcedureInstance;
        });
        updateWorkOrder(selectedWorkOrder.id, { procedureInstances: newInstances });
        return;
      }
    }
  };

  const isWorkOrderValidForDone = useMemo(() => {
    if (!selectedWorkOrder) return false;
    const base = Array.isArray(selectedWorkOrder.sections) ? selectedWorkOrder.sections : [];
    const proc = (selectedWorkOrder.procedureInstances || []).flatMap(pi => pi.procedureSchemaSnapshot || []);
    const sections = [...base, ...proc];

    try {
      return sections.every(section => {
        if (!section || !section.required) return true;
        const fields = section.fields;
        if (!Array.isArray(fields)) return true;
        return fields.every(field => {
          if (!field || !field.required) return true;
          if (field.type === 'photo' || field.type === 'file') return Array.isArray(field.attachments) && field.attachments.length > 0;
          return field.value !== undefined && field.value !== null && field.value !== '';
        });
      });
    } catch (e) {
      console.error("Error validating work order", e);
      return false;
    }
  }, [selectedWorkOrder]);

  const handleStatusUpdate = (status: 'Open' | 'On Hold' | 'In Progress' | 'Done') => {
    if (!selectedWorkOrder) return;
    if (status === 'Done' && !isWorkOrderValidForDone) {
      setStatusError("Please complete all required fields before marking as Done.");
      return;
    } else {
      setStatusError(null);
    }
    const updates: Partial<any> = { status };
    if (status === 'Done' && selectedWorkOrder.status !== 'Done') {
      updates.completedAt = new Date().toISOString();
    } else if (status !== 'Done' && selectedWorkOrder.status === 'Done') {
      updates.completedAt = undefined;
    }
    updateWorkOrder(selectedWorkOrder.id, updates);
  };

  const handleNewWorkOrder = () => {
    setPanelMode('create');
    setDraft((prev) => prev ?? buildDefaultDraft());
  };

  const attachProcedureToWorkOrder = (woId: string, procedureId: string) => {
    const proc = getProcedureById(procedureId);
    if (!proc) return;
    const sections = procedureToWorkOrderSections(proc);
    const instance: ProcedureInstance = {
      id: crypto.randomUUID(),
      procedureId: proc.id,
      procedureNameSnapshot: proc.name,
      procedureVersionSnapshot: proc.meta.version,
      procedureSchemaSnapshot: sections,
      responses: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const target = workOrders.find(w => w.id === woId);
    const existing = target?.procedureInstances || [];
    updateWorkOrder(woId, { procedureInstances: [...existing, instance] });
  };

  const reorderProcedureInstance = (woId: string, index: number, direction: 'up' | 'down') => {
    const target = workOrders.find(w => w.id === woId);
    if (!target || !target.procedureInstances) return;
    const instances = [...target.procedureInstances];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= instances.length) return;
    const [moved] = instances.splice(index, 1);
    instances.splice(newIndex, 0, moved);
    updateWorkOrder(woId, { procedureInstances: instances });
  };

  const removeProcedureInstance = (woId: string, instanceId: string) => {
    const target = workOrders.find(w => w.id === woId);
    if (!target) return;
    const existing = target.procedureInstances || [];
    updateWorkOrder(woId, { procedureInstances: existing.filter(i => i.id !== instanceId) });
    setProcToRemove(null);
  };

  // Add listener for a custom event from PageHeader
  useEffect(() => {
    const handler = () => handleNewWorkOrder();
    window.addEventListener('trigger-new-work-order', handler);
    return () => window.removeEventListener('trigger-new-work-order', handler);
  }, []);



  // Listen for parts inventory error (stock too low to complete WO)
  useEffect(() => {
    const handler = (e: any) => {
      const { reason } = e.detail || {};
      if (reason) setStatusError(reason);
    };
    window.addEventListener('work-order-parts-error', handler as EventListener);
    return () => window.removeEventListener('work-order-parts-error', handler as EventListener);
  }, []);

  useEffect(() => { setConfirmDelete(false); }, [selectedWorkOrderId, panelMode]);

  const todoCount = useMemo(() => {
    if (!Array.isArray(workOrders)) return 0;
    const todayStr = new Date().toISOString().split('T')[0];
    return workOrders.filter(wo => 
      wo && 
      wo.status !== 'Done' && 
      !wo.isRepeating && 
      (!wo.occurrenceDate || wo.occurrenceDate <= todayStr)
    ).length;
  }, [workOrders]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="relative bg-[var(--panel-2)] box-border caret-transparent flex basis-[0%] flex-col grow overflow-auto">
      <div className="relative box-border caret-transparent flex basis-[0%] grow mx-2 lg:mx-4 flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="omp-panel shadow-none box-border caret-transparent flex flex-col shrink-0 w-full lg:max-w-[500px] lg:min-w-[300px] lg:w-2/5 border border-[var(--border)] lg:mr-4 rounded-tl rounded-tr border-solid bg-[var(--panel)]">
          <TabButtons activeTab={activeTab} onTabChange={setActiveTab} />
          <SortControls />
          <div className="relative box-border caret-transparent basis-[0%] grow overflow-x-hidden overflow-y-auto pb-8 rounded-bl rounded-br rounded-tl rounded-tr">
            {activeTab === 'todo' ? (
              <>
                <div className="text-[var(--accent)] text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] px-4 py-2 opacity-[0.85]">
                  <span className="text-[var(--text)] box-border caret-transparent shrink-0 pr-1">
                    Assigned to Me ({todoCount})
                  </span>
                </div>
                {filteredWorkOrders.map((wo) => {
                  const isOverdue = wo.status !== 'Done' && wo.dueDate < todayStr;
                  return (
                    <WorkOrderCard 
                      key={wo.id} 
                      {...wo} 
                      isOverdue={isOverdue}
                      startDate={wo.startDate}
                      assetName={wo.asset} 
                      onClick={() => setSelectedWorkOrderId(wo.id)}
                      isActive={selectedWorkOrder?.id === wo.id}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <div className="text-[var(--accent)] text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] px-4 py-2 opacity-[0.85]">
                  <span className="text-[var(--text)] box-border caret-transparent shrink-0 pr-1">
                    Completed ({filteredWorkOrders.length})
                  </span>
                </div>
                {filteredWorkOrders.map((wo) => (
                  <WorkOrderCard 
                    key={wo.id} 
                    {...wo} 
                    startDate={wo.startDate}
                    assetName={wo.asset} 
                    onClick={() => setSelectedWorkOrderId(wo.id)}
                    isActive={selectedWorkOrder?.id === wo.id}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="box-border caret-transparent flex flex-col grow shrink-0 w-full lg:basis-[375px] lg:min-w-[200px] lg:pt-2 lg:px-2 border-l border-[var(--border)] bg-[var(--panel-2)]">
          <div className="omp-panel shadow-none box-border caret-transparent flex grow w-full border border-[var(--border)] overflow-hidden rounded-bl rounded-br rounded-tl rounded-tr border-solid bg-[var(--panel)]">
            {panelMode === 'create' && draft && (
              <WorkOrderCreatePanel
                value={draft}
                onChange={(patch) => setDraft(prev => ({ ...(prev as DraftWorkOrder), ...patch }))}
                onCancel={() => setPanelMode('view')}
                onCreate={(data) => {
                  const newWo = addWorkOrder(data);
                  setSelectedWorkOrderId(newWo.id);
                  // Attach pending procedure if any
                  if (pendingAttachProcedureId) {
                    attachProcedureToWorkOrder(newWo.id, pendingAttachProcedureId);
                    setPendingAttachProcedureId(null);
                  }
                  setPanelMode('view');
                  setDraft(null);
                  setActiveTab('todo');
                }}
              />
            )}
            <div className={panelMode === 'create' ? 'hidden w-full h-full' : 'block w-full h-full'}>
            {!selectedWorkOrder ? (
               <div className="flex items-center justify-center w-full h-full text-[var(--muted)] bg-[var(--panel-2)]">
                 Select a work order to view details
               </div>
            ) : (
                  <div className="box-border caret-transparent flex basis-[0%] flex-col grow h-full overflow-x-hidden overflow-y-auto w-full">
                <div className="relative box-border caret-transparent flex flex-col grow w-full">
                  <div className="box-border caret-transparent shrink-0">
                    <header className="bg-[var(--panel-2)] border-b border-[var(--border)] box-border caret-transparent gap-x-2 flex flex-col shrink-0 gap-y-2 py-4">
                      <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap justify-between gap-y-2 px-4">
                        <div className="items-center box-border caret-transparent gap-x-2 flex gap-y-2">
                          <div className="box-border caret-transparent">
                            <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                              <h3 className="text-[20.0004px] font-semibold box-border caret-transparent tracking-[-0.2px] leading-[28.0006px]">
                                {selectedWorkOrder.title}
                              </h3>
                              <button
                                title="Copy Link"
                                type="button"
                                className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-full hover:bg-accent hover:text-white transition-colors"
                              >
                                <span className="box-border caret-transparent flex text-nowrap">
                                  <img
                                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-35.svg"
                                    alt="Icon"
                                    className="box-border caret-transparent h-5 text-nowrap w-5 group-hover:brightness-0 group-hover:invert transition-all"
                                  />
                                </span>
                              </button>
                            </div>
                              <div className="items-center box-border caret-transparent gap-x-1 flex h-[18px] gap-y-1">
                                <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                                  <img
                                    src="https://c.animaapp.com/mkof8zon8iICvl/assets/icon-36.svg"
                                    alt="Icon"
                                    className="text-accent box-border caret-transparent h-3.5 w-3.5"
                                  />
                                  <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                    {selectedWorkOrder.workType}
                                  </span>
                                </div>
                                {selectedWorkOrder.startDate && (
                                  <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                                    <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                      - Start {new Date(selectedWorkOrder.startDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1">
                                  <span className="box-border caret-transparent flex mr-px">
                                    <span className="text-gray-600 text-[11.9994px] box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px]">
                                      {selectedWorkOrder.startDate ? ' • ' : ' - '}Due {new Date(selectedWorkOrder.dueDate).toLocaleDateString()}
                                    </span>
                                  </span>
                                </div>
                                {selectedWorkOrder.status !== 'Done' && new Date(selectedWorkOrder.dueDate) < new Date(new Date().toISOString().split('T')[0]) && (
                                  <div className="items-center box-border caret-transparent gap-x-1 flex gap-y-1 ml-1">
                                    <span className="text-red-600 text-[11.9994px] font-medium box-border caret-transparent block tracking-[-0.2px] leading-[14.3993px] flex items-center">
                                      <span className="mr-1">•</span>
                                      Overdue
                                    </span>
                                  </div>
                                )}
                              </div>
                          </div>
                        </div>
                        <div className="items-center box-border caret-transparent gap-x-2 flex shrink-0 flex-wrap gap-y-2 ml-auto">
                          <div className="items-center box-border caret-transparent flex shrink-0 justify-start">
                            <button
                              type="button"
                              onClick={() => setShowEditor(true)}
                              className="relative text-accent font-bold items-center bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] break-words gap-y-1 text-center text-nowrap border border-accent px-3 rounded-md border-solid hover:bg-accent hover:text-white transition-colors cursor-pointer"
                            >
                              <span className="box-border caret-transparent flex shrink-0 break-words text-nowrap">
                                Edit
                              </span>
                            </button>
                          </div>
                          <div className="relative box-border caret-transparent flex shrink-0">
                            <button
                              type="button"
                              className="relative text-accent font-bold items-center aspect-square bg-transparent caret-transparent gap-x-1 flex shrink-0 h-8 justify-center tracking-[-0.2px] leading-[14px] gap-y-1 text-center text-nowrap overflow-hidden px-2 rounded-md border border-transparent hover:border-[var(--border)] hover:bg-gray-100 transition-all cursor-pointer group/delete"
                              onClick={() => setConfirmDelete((v) => !v)}
                            >
                              <span className="box-border caret-transparent flex shrink-0 text-nowrap">
                                <span className="text-slate-500 box-border caret-transparent flex shrink-0 text-nowrap group-hover/delete:text-red-600 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </span>
                              </span>
                            </button>
                            {confirmDelete && (
                              <div className="flex items-center gap-2 ml-2 text-sm">
                                <span className="text-red-600">Delete this work order?</span>
                                <button
                                  type="button"
                                  className="text-white bg-red-500 border border-red-500 px-2 py-0.5 rounded hover:bg-red-400"
                                  onClick={() => { deleteWorkOrder(selectedWorkOrder.id); setSelectedWorkOrderId(null); setConfirmDelete(false); }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  className="text-gray-600 border border-[var(--border)] px-2 py-0.5 rounded hover:border-neutral-300"
                                  onClick={() => setConfirmDelete(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </header>
                  </div>
                  <div className="relative box-border caret-transparent flex flex-col grow scroll-smooth overflow-auto scroll-pt-4">
                    <div className="box-border caret-transparent shrink-0 pb-6 pt-4">
                      <div className="box-border caret-transparent flex shrink-0 justify-start max-w-[816px] mr-4">
                        <div className="box-border caret-transparent basis-[0%] grow ml-6 mb-3">
                          <div className="box-border caret-transparent shrink-0 pb-2">
                            <strong className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">
                              Status
                            </strong>
                          </div>
                          <div className="items-center box-border caret-transparent gap-x-1 flex shrink-0 flex-wrap-reverse gap-y-1">
                            <div className="box-border caret-transparent shrink-0">
                              <div className="items-center box-border caret-transparent flex shrink-0">
                                {(['Open', 'On Hold', 'In Progress', 'Done'] as const).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusUpdate(status)}
                                    className={`${
                                      selectedWorkOrder.status === status 
                                      ? 'bg-accent-muted border-accent text-accent opacity-100'
                                      : 'bg-transparent border-[var(--border)] text-[var(--muted)] opacity-65'
                                    } text-[11.2px] items-center caret-transparent flex flex-col shrink-0 h-[50px] justify-center leading-[13.44px] text-center w-[71.25px] border mr-2 p-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid md:h-[60px] md:w-[90px] hover:bg-[var(--panel-2)] hover:opacity-100 transition-all`}
                                  >
                                    <img
                                        src={
                                          status === "Open"
                                              ? "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-41.svg"
                                              : status === "On Hold"
                                                  ? "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-42.svg"
                                                  : status === "In Progress"
                                                      ? "/inprogress.svg"
                                                      : "https://c.animaapp.com/mkof8zon8iICvl/assets/icon-44.svg"
                                        }
                                        alt={status}
                                        className={`box-border caret-transparent shrink-0 h-4 w-4 md:h-6 md:w-6 ${
                                            selectedWorkOrder.status === status ? "opacity-100" : "opacity-65"
                                        }`}
                                    />
                                    <div className={`text-[12.6px] font-medium box-border caret-transparent shrink-0 leading-[15.12px] text-nowrap mt-1`}>
                                      {status}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="box-border caret-transparent shrink-0 mt-4 pt-4 border-t border-[var(--border)] text-[13px] text-[var(--muted)] space-y-1 italic opacity-80">
                            <div>Created by {getUserById(selectedWorkOrder.createdByUserId)?.fullName || (selectedWorkOrder.createdByUserId ? 'Deleted User' : 'Admin')} on {new Date(selectedWorkOrder.createdAt).toLocaleString()}</div>
                            {selectedWorkOrder.updatedAt && <div>Last updated on {new Date(selectedWorkOrder.updatedAt).toLocaleString()}</div>}
                            {selectedWorkOrder.categoryId && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="uppercase font-bold tracking-tighter text-[11px]">Category:</span>
                                {(() => {
                                  const cat = getCategoryById(selectedWorkOrder.categoryId);
                                  return cat ? (
                                    <span className={`text-accent text-[11px] font-bold uppercase tracking-tighter bg-accent-muted px-1 py-0.5 rounded border border-accent/20 ${!cat.isActive ? 'opacity-60' : ''}`}>
                                      {cat.name}{!cat.isActive && ' (Archived)'}
                                    </span>
                                  ) : (
                                    <span className="text-[var(--muted)] text-[11px] bg-gray-50 px-1 py-0.5 rounded border border-[var(--border)]">Unknown</span>
                                  );
                                })()}
                              </div>
                            )}
                          </div>

                          {statusError && (
                            <div className="mt-2 text-xs font-bold uppercase tracking-tight text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                              {statusError}
                            </div>
                          )}
                          
                          <div className="box-border caret-transparent shrink-0 mt-6 pb-1">
                            <strong className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">
                              Description
                            </strong>
                          </div>
                          <div className="box-border caret-transparent shrink-0 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {selectedWorkOrder.description || 'No description provided.'}
                          </div>

                          {/* Parts Summary */}
                          {(selectedWorkOrder.parts || []).length > 0 && (
                            <div className="mt-6">
                              <strong className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold block mb-2">
                                Parts ({selectedWorkOrder.parts!.length})
                              </strong>
                              <div className="border border-[var(--border)] rounded overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead className="bg-[var(--panel-2)] border-b border-[var(--border)]">
                                    <tr>
                                      <th className="text-left px-2 py-1 font-medium text-[var(--muted)] uppercase">Part</th>
                                      <th className="text-left px-2 py-1 font-medium text-[var(--muted)] uppercase">Location</th>
                                      <th className="text-center px-2 py-1 font-medium text-[var(--muted)] uppercase">Qty</th>
                                      <th className="text-center px-2 py-1 font-medium text-[var(--muted)] uppercase">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedWorkOrder.parts!.map(wop => (
                                      <tr key={`${wop.partId}-${wop.locationId}`} className="border-b border-[var(--border)] last:border-0">
                                        <td className="px-2 py-1.5 font-medium">{wop.partName}</td>
                                        <td className="px-2 py-1.5 text-gray-500">{wop.locationName}</td>
                                        <td className="px-2 py-1.5 text-center">{wop.quantityUsed}</td>
                                        <td className="px-2 py-1.5 text-center">
                                          {wop.consumed ? (
                                            <span className="bg-green-50 text-green-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Consumed</span>
                                          ) : (
                                            <span className="bg-gray-50 text-gray-500 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Pending</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          <div className="box-border caret-transparent shrink-0 mt-6 pb-2 flex items-center justify-between border-b border-[var(--border)] mb-4">
                            <strong className="text-[11px] uppercase tracking-[0.04em] text-[var(--muted)] font-semibold">
                              Procedures
                            </strong>
                            <button
                              type="button"
                              onClick={() => setShowProcedureSelector(true)}
                              className="text-blue-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-blue-400 transition-colors"
                            >
                              <Plus size={14} /> Add Procedure
                            </button>
                          </div>

                          {showProcedureSelector && (
                            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                              <ProcedureSelector
                                onSelect={(id) => {
                                  attachProcedureToWorkOrder(selectedWorkOrder.id, id);
                                  setShowProcedureSelector(false);
                                }}
                                onCancel={() => setShowProcedureSelector(false)}
                              />
                            </div>
                          )}

                          <div className="box-border caret-transparent shrink-0 space-y-6">
                            {(selectedWorkOrder.procedureInstances || []).length === 0 && (selectedWorkOrder.sections || []).length === 0 && (
                              <div className="text-gray-400 text-sm italic py-4 border-2 border-dashed border-[var(--border)] rounded-lg text-center">
                                No procedures attached.
                              </div>
                            )}

                            {(selectedWorkOrder.procedureInstances || []).map((pi, index) => (
                              <div key={pi.id} className="border border-[var(--border)] rounded-lg overflow-hidden bg-white shadow-sm">
                                <div className="bg-accent px-4 py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-white">
                                    <div className="flex flex-col gap-0.5 mr-1">
                                       <button
                                         disabled={index === 0}
                                         onClick={() => reorderProcedureInstance(selectedWorkOrder.id, index, 'up')}
                                         className={`p-0.5 rounded hover:bg-white/20 transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                       >
                                         <ChevronUp size={14} />
                                       </button>
                                       <button
                                         disabled={index === (selectedWorkOrder.procedureInstances?.length || 0) - 1}
                                         onClick={() => reorderProcedureInstance(selectedWorkOrder.id, index, 'down')}
                                         className={`p-0.5 rounded hover:bg-white/20 transition-colors ${index === (selectedWorkOrder.procedureInstances?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                       >
                                         <ChevronDown size={14} />
                                       </button>
                                    </div>
                                    <ClipboardList size={18} />
                                    <div>
                                      <h4 className="font-semibold text-sm leading-none">{pi.procedureNameSnapshot}</h4>
                                      <p className="text-[10px] opacity-80 mt-1">Version {pi.procedureVersionSnapshot} • Attached {new Date(pi.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     {procToRemove === pi.id ? (
                                       <div className="flex items-center gap-2 bg-white rounded p-1 shadow-sm border border-red-100">
                                          <span className="text-[10px] text-red-600 px-1 font-medium">
                                            {Object.keys(pi.responses).length > 0 ? 'Has responses! Delete?' : 'Remove procedure?'}
                                          </span>
                                          <button
                                            onClick={() => removeProcedureInstance(selectedWorkOrder.id, pi.id)}
                                            className="bg-red-500 text-white text-[10px] px-2 py-1 rounded hover:bg-red-600"
                                          >
                                            Confirm
                                          </button>
                                          <button
                                            onClick={() => setProcToRemove(null)}
                                            className="text-gray-500 text-[10px] px-2 py-1 hover:bg-gray-50 rounded"
                                          >
                                            Cancel
                                          </button>
                                       </div>
                                     ) : (
                                       <button
                                         onClick={() => setProcToRemove(pi.id)}
                                         className="text-white/60 hover:text-white transition-colors"
                                         title="Remove Procedure"
                                       >
                                         <Trash2 size={16} />
                                       </button>
                                     )}
                                  </div>
                                </div>
                                <div className="p-4 space-y-4">
                                  {pi.procedureSchemaSnapshot.map((section) => (
                                    <SectionRenderer
                                      key={section.id}
                                      section={section}
                                      onUpdate={(updates) => handleUpdateSection(section.id, updates)}
                                      disabled={selectedWorkOrder.status === 'Done'}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* Legacy Sections */}
                            {(selectedWorkOrder.sections || []).length > 0 && (
                               <div className="border border-amber-100 rounded-lg overflow-hidden bg-white shadow-sm">
                                  <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2 text-amber-800">
                                    <AlertTriangle size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Legacy Form Data</span>
                                  </div>
                                  <div className="p-4 space-y-4">
                                    {selectedWorkOrder.sections.map((section) => (
                                      <SectionRenderer
                                        key={section.id}
                                        section={section}
                                        onUpdate={(updates) => handleUpdateSection(section.id, updates)}
                                        disabled={selectedWorkOrder.status === 'Done'}
                                      />
                                    ))}
                                  </div>
                               </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <WorkOrderEditorPanel
                  open={showEditor}
                  initial={selectedWorkOrder}
                  onClose={() => setShowEditor(false)}
                  onSubmit={(val) => {
                    updateWorkOrder(selectedWorkOrder.id, val);
                    setShowEditor(false);
                  }}
                />
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
