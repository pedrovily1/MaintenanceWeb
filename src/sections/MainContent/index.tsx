import { useState, useMemo, useEffect } from "react";
import { T, card, inner, statusColor, priorityColor } from "@/lib/tokens";
import { Badge } from "@/components/Common/Badge";
import { Avatar } from "@/components/Common/Avatar";
import { HR } from "@/components/Common/HR";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useUserStore } from "@/store/useUserStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useProcedureStore } from "@/store/useProcedureStore";
import { useSiteStore } from "@/store/useSiteStore";
import { WorkOrder, ProcedureInstance, WorkOrderSection } from "@/types/workOrder";
import { WorkOrderCreatePanel, buildDefaultDraft, DraftWorkOrder } from "@/components/WorkOrder/WorkOrderCreatePanel";
import { WorkOrderEditorPanel } from "@/sections/WorkOrderList/components/WorkOrderEditorPanel";
import { ProcedureSelector } from "@/components/WorkOrder/ProcedureSelector";
import { SectionRenderer } from "@/components/WorkOrder/SectionRenderer";
import { procedureToWorkOrderSections } from "@/utils/procedureMapping";
import { ClipboardList, AlertTriangle, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

/* ─── Status display helpers ─────────────────────────────────── */
const woStatusDisplay = (s: string) =>
  ({ Open: "Scheduled", "On Hold": "On Hold", "In Progress": "Ongoing", Done: "Completed" } as Record<string, string>)[s] ?? s;

const woStatusDisplayColor = (s: string) =>
  statusColor(woStatusDisplay(s));

const woColor = (s: string): string =>
  ({ Open: T.blue, "On Hold": T.amber, "In Progress": T.green, Done: T.muted } as Record<string, string>)[s] ?? T.muted;

const STATUS_FILTERS = ["All", "Scheduled", "Ongoing", "On Hold", "Completed"];

const COLS = [
  { key: "workOrderNumber", label: "Work Order",  w: "130px" },
  { key: "status",          label: "Status",       w: "110px" },
  { key: "priority",        label: "Priority",     w: "90px"  },
  { key: "title",           label: "Title",        w: "200px" },
  { key: "asset",           label: "Asset",        w: "160px" },
  { key: "assignedTo",      label: "Assignee",     w: "130px" },
  { key: "dueDate",         label: "Due Date",     w: "110px" },
];

/* ─── Right-panel (WO detail) ─────────────────────────────────── */
function WODetailPanel({
  wo,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  statusError,
  isValidForDone,
  onAttachProcedure,
  onRemoveProcedure,
  onReorderProcedure,
  onUpdateSection,
  showProcedureSelector,
  setShowProcedureSelector,
}: {
  wo: WorkOrder;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: "Open" | "On Hold" | "In Progress" | "Done") => void;
  statusError: string | null;
  isValidForDone: boolean;
  onAttachProcedure: (id: string) => void;
  onRemoveProcedure: (instanceId: string) => void;
  onReorderProcedure: (index: number, dir: "up" | "down") => void;
  onUpdateSection: (sectionId: string, updates: Partial<WorkOrderSection>) => void;
  showProcedureSelector: boolean;
  setShowProcedureSelector: (v: boolean) => void;
}) {
  const [tab, setTab] = useState("Details");
  const [procToRemove, setProcToRemove] = useState<string | null>(null);
  const { getCategoryById } = useCategoryStore();
  const { activeUserId } = useSiteStore();
  const { getUserById } = useUserStore();
  const TABS = ["Details", "Procedure", "Parts"];

  const col = woColor(wo.status);

  return (
    <div
      style={{
        width: 360,
        background: T.surface,
        borderLeft: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        animation: "slideIn 0.22s cubic-bezier(.34,1.2,.64,1)",
      }}
    >
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>

      {/* Header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: T.dim, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
              Work Order
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>
              {wo.workOrderNumber}
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 3, fontWeight: 400 }}>{wo.title}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: T.raised,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              width: 30,
              height: 30,
              cursor: "pointer",
              color: T.muted,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge label={woStatusDisplay(wo.status)} color={woStatusDisplayColor(wo.status)} />
          {wo.priority && <Badge label={`${wo.priority} Priority`} color={priorityColor(wo.priority)} />}
          {wo.workType && <Badge label={wo.workType} color={T.violet} />}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 4px", borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              fontFamily: "inherit",
              color: tab === t ? T.blue : T.dim,
              borderBottom: `2px solid ${tab === t ? T.blue : "transparent"}`,
              padding: "10px 12px",
              fontSize: 11.5,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t === "Procedure" ? "📋 Procedure" : t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {tab === "Details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Status buttons */}
            <div style={inner({ padding: "12px 14px" })}>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                Status
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["Open", "On Hold", "In Progress", "Done"] as const).map(s => {
                  const active = wo.status === s;
                  const c = woColor(s);
                  return (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      style={{
                        flex: 1,
                        minWidth: 60,
                        padding: "8px 6px",
                        borderRadius: 9,
                        fontSize: 11,
                        fontWeight: active ? 700 : 400,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        background: active ? c + "22" : "transparent",
                        color: active ? c : T.dim,
                        border: `1.5px solid ${active ? c + "66" : T.border}`,
                        transition: "all 0.15s",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {statusError && (
                <div style={{ marginTop: 8, fontSize: 11, color: T.red, fontWeight: 500 }}>{statusError}</div>
              )}
            </div>

            {/* Assignee */}
            {wo.assignedTo && (
              <div style={inner({ padding: "12px 14px" })}>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                  Assigned Technician
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={wo.assignedTo} color={col} size={36} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{wo.assignedTo}</div>
                    <div style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>Field Technician</div>
                  </div>
                </div>
              </div>
            )}

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Asset",    value: wo.asset?.slice(0, 20)    ?? "—" },
                { label: "Location", value: wo.location?.slice(0, 20) ?? "—" },
                { label: "Due Date", value: wo.dueDate ? new Date(wo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                { label: "Created",  value: wo.createdAt ? new Date(wo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={inner({ padding: "10px 12px" })}>
                  <div style={{ fontSize: 9.5, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.text, lineHeight: 1.4 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {wo.description && (
              <div style={inner({ padding: "12px 14px" })}>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                  Notes
                </div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, fontWeight: 300 }}>{wo.description}</p>
              </div>
            )}

            {/* Category */}
            {wo.categoryId && (() => {
              const cat = getCategoryById(wo.categoryId);
              return cat ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge label={cat.name} color={T.violet} />
                </div>
              ) : null;
            })()}

            {/* Meta */}
            <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.8, fontWeight: 300, paddingTop: 4, borderTop: `1px solid ${T.border}` }}>
              <div>Created by {getUserById(wo.createdByUserId)?.fullName ?? "Admin"} on {new Date(wo.createdAt).toLocaleString()}</div>
              {wo.updatedAt && <div>Updated {new Date(wo.updatedAt).toLocaleString()}</div>}
            </div>
          </div>
        )}

        {tab === "Procedure" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Procedures</span>
              <button
                onClick={() => setShowProcedureSelector(true)}
                style={{
                  background: "#1a2d4a",
                  color: "#7aacf0",
                  border: "1px solid rgba(59,130,246,0.28)",
                  borderRadius: 8,
                  padding: "5px 11px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>

            {showProcedureSelector && (
              <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                <ProcedureSelector
                  onSelect={(id) => { onAttachProcedure(id); setShowProcedureSelector(false); }}
                  onCancel={() => setShowProcedureSelector(false)}
                />
              </div>
            )}

            {(wo.procedureInstances ?? []).length === 0 && (wo.sections ?? []).length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 0" }}>
                <div style={{ width: 60, height: 60, background: T.raised, border: `1px solid ${T.border}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  📋
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 5 }}>No Procedure Attached</div>
                  <div style={{ fontSize: 12, color: T.dim, fontWeight: 300, lineHeight: 1.75, maxWidth: 220 }}>
                    Attach a standard operating procedure to guide technicians through this work order.
                  </div>
                </div>
                <button
                  onClick={() => setShowProcedureSelector(true)}
                  style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.28)", borderRadius: 12, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  📚 Browse Procedures
                </button>
              </div>
            ) : (
              <>
                {(wo.procedureInstances ?? []).map((pi, idx) => (
                  <div key={pi.id} style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ background: T.blue, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button disabled={idx === 0} onClick={() => onReorderProcedure(idx, "up")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: idx === 0 ? "not-allowed" : "pointer", padding: 2, opacity: idx === 0 ? 0.3 : 1 }}>
                            <ChevronUp size={12} />
                          </button>
                          <button disabled={idx === (wo.procedureInstances?.length ?? 0) - 1} onClick={() => onReorderProcedure(idx, "down")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: idx === (wo.procedureInstances?.length ?? 0) - 1 ? "not-allowed" : "pointer", padding: 2, opacity: idx === (wo.procedureInstances?.length ?? 0) - 1 ? 0.3 : 1 }}>
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <ClipboardList size={16} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{pi.procedureNameSnapshot}</div>
                          <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>v{pi.procedureVersionSnapshot} · {new Date(pi.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {procToRemove === pi.id ? (
                        <div style={{ display: "flex", gap: 6, background: "#fff", borderRadius: 6, padding: "4px 8px" }}>
                          <span style={{ fontSize: 10, color: "#dc2626" }}>Remove?</span>
                          <button onClick={() => { onRemoveProcedure(pi.id); setProcToRemove(null); }} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 10, cursor: "pointer" }}>Yes</button>
                          <button onClick={() => setProcToRemove(null)} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 10, cursor: "pointer" }}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setProcToRemove(pi.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                      {pi.procedureSchemaSnapshot.map(section => (
                        <SectionRenderer key={section.id} section={section} onUpdate={u => onUpdateSection(section.id, u)} disabled={wo.status === "Done"} />
                      ))}
                    </div>
                  </div>
                ))}
                {(wo.sections ?? []).length > 0 && (
                  <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ background: T.raised, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, color: T.muted }}>
                      <AlertTriangle size={14} />
                      <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Legacy Form Data</span>
                    </div>
                    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                      {wo.sections.map(section => (
                        <SectionRenderer key={section.id} section={section} onUpdate={u => onUpdateSection(section.id, u)} disabled={wo.status === "Done"} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "Parts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(wo.parts ?? []).length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: T.dim, fontSize: 12 }}>No parts attached</div>
            ) : (
              (wo.parts ?? []).map((p, i) => (
                <div key={`${p.partId}-${p.locationId}-${i}`} style={{ ...inner({ padding: "11px 13px" }), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{p.partName}</div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontWeight: 300 }}>Qty: {p.quantityUsed} · {p.locationName}</div>
                  </div>
                  <Badge label={p.consumed ? "Consumed" : "Pending"} color={p.consumed ? T.green : T.amber} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
        <button
          onClick={onEdit}
          style={{ flex: 1, background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{ flex: 1, background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.22)", borderRadius: 12, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ─── Main WorkOrders view ───────────────────────────────────── */
export const MainContent = () => {
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrderStore();
  const { activeUserId } = useSiteStore();
  const { getUserById } = useUserStore();
  const { getProcedureById } = useProcedureStore();

  const [filter,      setFilter]      = useState("All");
  const [search,      setSearch]      = useState("");
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [sortCol,     setSortCol]     = useState("dueDate");
  const [sortDir,     setSortDir]     = useState(1);
  const [panelMode,   setPanelMode]   = useState<"view" | "create">("view");
  const [draft,       setDraft]       = useState<DraftWorkOrder | null>(null);
  const [showEditor,  setShowEditor]  = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showProcSelector, setShowProcSelector] = useState(false);

  const activeWOs = useMemo(() => {
    if (!Array.isArray(workOrders)) return [];
    const todayStr = new Date().toISOString().split("T")[0];
    return workOrders.filter(w => !w.isRepeating && (!w.occurrenceDate || w.occurrenceDate <= todayStr));
  }, [workOrders]);

  const stats = useMemo(() => ({
    total:     activeWOs.length,
    ongoing:   activeWOs.filter(w => w.status === "In Progress").length,
    scheduled: activeWOs.filter(w => w.status === "Open").length,
    onHold:    activeWOs.filter(w => w.status === "On Hold").length,
  }), [activeWOs]);

  const filtered = useMemo(() => {
    let list = activeWOs;
    if (filter !== "All") {
      const statusMap: Record<string, string> = { Scheduled: "Open", Ongoing: "In Progress", Completed: "Done", "On Hold": "On Hold" };
      list = list.filter(w => w.status === (statusMap[filter] ?? filter));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.workOrderNumber.toLowerCase().includes(q) ||
        (w.assignedTo ?? "").toLowerCase().includes(q) ||
        (w.asset ?? "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const av = (a as any)[sortCol] ?? "";
      const bv = (b as any)[sortCol] ?? "";
      return (typeof av === "number" ? av - bv : String(av).localeCompare(String(bv))) * sortDir;
    });
  }, [activeWOs, filter, search, sortCol, sortDir]);

  const selectedWO = useMemo(() => {
    if (selectedId) return workOrders.find(w => w.id === selectedId) ?? null;
    return filtered[0] ?? null;
  }, [selectedId, workOrders, filtered]);

  const isValidForDone = useMemo(() => {
    if (!selectedWO) return false;
    const sections = [
      ...(selectedWO.sections ?? []),
      ...(selectedWO.procedureInstances ?? []).flatMap(pi => pi.procedureSchemaSnapshot ?? []),
    ];
    return sections.every(s => {
      if (!s?.required) return true;
      return (s.fields ?? []).every(f => {
        if (!f?.required) return true;
        if (f.type === "photo" || f.type === "file") return Array.isArray(f.attachments) && f.attachments.length > 0;
        return f.value !== undefined && f.value !== null && f.value !== "";
      });
    });
  }, [selectedWO]);

  const handleStatusChange = (status: "Open" | "On Hold" | "In Progress" | "Done") => {
    if (!selectedWO) return;
    if (status === "Done" && !isValidForDone) {
      setStatusError("Please complete all required fields before marking as Done.");
      return;
    }
    setStatusError(null);
    const updates: Partial<WorkOrder> = { status };
    if (status === "Done" && selectedWO.status !== "Done") updates.completedAt = new Date().toISOString();
    if (status !== "Done" && selectedWO.status === "Done") updates.completedAt = undefined;
    updateWorkOrder(selectedWO.id, updates);
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<WorkOrderSection>) => {
    if (!selectedWO) return;
    if ((selectedWO.sections ?? []).find(s => s.id === sectionId)) {
      updateWorkOrder(selectedWO.id, { sections: selectedWO.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s) });
      return;
    }
    const instances = selectedWO.procedureInstances ?? [];
    for (let i = 0; i < instances.length; i++) {
      const pi = instances[i];
      const idx = pi.procedureSchemaSnapshot.findIndex(s => s.id === sectionId);
      if (idx >= 0) {
        const newSections = pi.procedureSchemaSnapshot.map((s, k) => k === idx ? { ...s, ...updates } : s);
        const newResponses = { ...pi.responses };
        if (updates.fields) updates.fields.forEach(f => { newResponses[f.id] = f.value; });
        const newInstances = instances.map((inst, j) => j !== i ? inst : { ...inst, procedureSchemaSnapshot: newSections, responses: newResponses, updatedAt: new Date().toISOString() } as ProcedureInstance);
        updateWorkOrder(selectedWO.id, { procedureInstances: newInstances });
        return;
      }
    }
  };

  const attachProcedure = (procedureId: string) => {
    if (!selectedWO) return;
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
    const existing = selectedWO.procedureInstances ?? [];
    updateWorkOrder(selectedWO.id, { procedureInstances: [...existing, instance] });
  };

  const removeProcedure = (instanceId: string) => {
    if (!selectedWO) return;
    updateWorkOrder(selectedWO.id, { procedureInstances: (selectedWO.procedureInstances ?? []).filter(i => i.id !== instanceId) });
  };

  const reorderProcedure = (index: number, dir: "up" | "down") => {
    if (!selectedWO) return;
    const instances = [...(selectedWO.procedureInstances ?? [])];
    const newIdx = dir === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= instances.length) return;
    const [moved] = instances.splice(index, 1);
    instances.splice(newIdx, 0, moved);
    updateWorkOrder(selectedWO.id, { procedureInstances: instances });
  };

  const handleDelete = () => {
    if (!selectedWO) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteWorkOrder(selectedWO.id);
    setSelectedId(null);
    setConfirmDelete(false);
  };

  // Listen for external new-WO trigger from Dashboard
  useEffect(() => {
    const h = () => { setPanelMode("create"); setDraft(prev => prev ?? buildDefaultDraft()); };
    window.addEventListener("trigger-new-work-order", h);
    return () => window.removeEventListener("trigger-new-work-order", h);
  }, []);

  const toggleSort = (key: string) => {
    if (sortCol === key) setSortDir(d => -d);
    else { setSortCol(key); setSortDir(1); }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, background: T.bg }}>
      {/* Page header */}
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.03em" }}>Work Orders</h1>
            <p style={{ fontSize: 12.5, color: T.dim, fontWeight: 300, marginTop: 4 }}>
              Manage and track all maintenance work orders
            </p>
          </div>
          <button
            onClick={() => { setPanelMode("create"); setDraft(prev => prev ?? buildDefaultDraft()); }}
            style={{
              background: "#1a2d4a",
              color: "#7aacf0",
              border: "1px solid rgba(59,130,246,0.28)",
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ＋ New Work Order
          </button>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total Orders", value: stats.total,     color: T.blue,   icon: "≡" },
            { label: "In Progress",  value: stats.ongoing,   color: T.green,  icon: "▶" },
            { label: "Scheduled",    value: stats.scheduled, color: T.violet, icon: "◷" },
            { label: "On Hold",      value: stats.onHold,    color: T.amber,  icon: "⏸" },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={inner({ padding: "13px 16px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{label}</div>
                </div>
                <span style={{ fontSize: 18, opacity: 0.4 }}>{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div
          style={{
            ...card({ borderRadius: 16, overflow: "visible" }),
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...inner({ padding: "7px 13px", borderRadius: 10 }), minWidth: 220 }}>
            <span style={{ color: T.dim, fontSize: 13 }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders, assets, techs…"
              style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 12.5, width: "100%", fontFamily: "inherit" }}
            />
            {search && <span onClick={() => setSearch("")} style={{ color: T.dim, cursor: "pointer", fontSize: 13 }}>✕</span>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#1a2d4a" : "transparent",
                  color: filter === f ? "#7aacf0" : T.dim,
                  border: `1px solid ${filter === f ? "rgba(59,130,246,0.28)" : T.border}`,
                  borderRadius: 8,
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: filter === f ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "12px 24px 20px", gap: 12 }}>
        <div style={{ ...card({ borderRadius: 18 }), flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${COLS.map(c => c.w).join(" ")} 1fr`,
              padding: "10px 20px",
              borderBottom: `1px solid ${T.border}`,
              flexShrink: 0,
              gap: 8,
            }}
          >
            {COLS.map(col => (
              <div
                key={col.key}
                onClick={() => toggleSort(col.key)}
                style={{
                  fontSize: 10,
                  color: T.dim,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  userSelect: "none",
                }}
              >
                {col.label}
                {sortCol === col.key && <span style={{ fontSize: 9, opacity: 0.7 }}>{sortDir > 0 ? "↑" : "↓"}</span>}
              </div>
            ))}
            <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Actions
            </div>
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: T.dim }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>≡</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>No work orders found</div>
              </div>
            ) : (
              filtered.map((wo, i) => {
                const isSel = selectedWO?.id === wo.id;
                const col   = woColor(wo.status);
                return (
                  <div key={wo.id}>
                    <div
                      onClick={() => { setSelectedId(isSel ? null : wo.id); setPanelMode("view"); setConfirmDelete(false); }}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `${COLS.map(c => c.w).join(" ")} 1fr`,
                        padding: "13px 20px",
                        gap: 8,
                        alignItems: "center",
                        cursor: "pointer",
                        background: isSel ? T.blueGlow : "transparent",
                        borderLeft: `3px solid ${isSel ? T.blue : "transparent"}`,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = T.raised; }}
                      onMouseLeave={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = ""; }}
                    >
                      {/* WO Number */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 3, height: 28, borderRadius: 99, background: col, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text, fontFamily: "monospace" }}>{wo.workOrderNumber}</div>
                        </div>
                      </div>
                      {/* Status */}
                      <div><Badge label={woStatusDisplay(wo.status)} color={woStatusDisplayColor(wo.status)} /></div>
                      {/* Priority */}
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {wo.priority && (
                          <>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: priorityColor(wo.priority) }} />
                            <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{wo.priority}</span>
                          </>
                        )}
                      </div>
                      {/* Title */}
                      <div style={{ fontSize: 12, color: T.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {wo.title}
                      </div>
                      {/* Asset */}
                      <div style={{ fontSize: 11.5, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {wo.asset ?? wo.location ?? "—"}
                      </div>
                      {/* Assignee */}
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {wo.assignedTo && (
                          <>
                            <Avatar name={wo.assignedTo} color={col} size={22} />
                            <span style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {wo.assignedTo}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Due date */}
                      <div style={{ fontSize: 12, color: T.muted, fontVariantNumeric: "tabular-nums" }}>
                        {wo.dueDate ? new Date(wo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </div>
                      {/* Actions */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedId(wo.id); setPanelMode("view"); }}
                          style={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 10px", fontSize: 11, color: T.muted, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                    {i < filtered.length - 1 && <HR mx={20} />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: T.dim, fontWeight: 300 }}>
              Showing {filtered.length} of {activeWOs.length} work orders
            </span>
          </div>
        </div>

        {/* Detail panel */}
        {panelMode === "create" && draft ? (
          <div style={{ width: 380, flexShrink: 0, background: T.surface, borderLeft: `1px solid ${T.border}`, overflowY: "auto" }}>
            <WorkOrderCreatePanel
              value={draft}
              onChange={patch => setDraft(prev => ({ ...(prev as DraftWorkOrder), ...patch }))}
              onCancel={() => setPanelMode("view")}
              onCreate={data => {
                const newWo = addWorkOrder(data, (tmp, real) => {
                  setSelectedId(prev => prev === tmp ? real : prev);
                });
                setSelectedId(newWo.id);
                setPanelMode("view");
                setDraft(null);
              }}
            />
          </div>
        ) : selectedWO && panelMode === "view" ? (
          <WODetailPanel
            wo={selectedWO}
            onClose={() => setSelectedId(null)}
            onEdit={() => setShowEditor(true)}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            statusError={statusError}
            isValidForDone={isValidForDone}
            onAttachProcedure={attachProcedure}
            onRemoveProcedure={removeProcedure}
            onReorderProcedure={reorderProcedure}
            onUpdateSection={handleUpdateSection}
            showProcedureSelector={showProcSelector}
            setShowProcedureSelector={setShowProcSelector}
          />
        ) : null}
      </div>

      {/* Editor overlay */}
      {selectedWO && (
        <WorkOrderEditorPanel
          open={showEditor}
          initial={selectedWO}
          onClose={() => setShowEditor(false)}
          onSubmit={val => { updateWorkOrder(selectedWO.id, val); setShowEditor(false); }}
        />
      )}
    </div>
  );
};
