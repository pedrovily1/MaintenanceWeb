import { useState, ReactNode } from "react";
import { T, card, inner } from "@/lib/tokens";
import { Badge } from "@/components/Common/Badge";
import { Avatar } from "@/components/Common/Avatar";
import { useWorkOrderStore } from "@/store/useWorkOrderStore";
import { useAssetStore } from "@/store/useAssetStore";
import { usePartStore } from "@/store/usePartStore";
import { getTotalStock, needsRestock } from "@/types/part";
import type { WorkOrder } from "@/types/workOrder";
import type { Asset } from "@/types/asset";

/* ── Status helpers ───────────────────────────────────────── */
function woStatusDisplay(s: string) {
  return s === "Open" ? "Scheduled" : s === "In Progress" ? "Ongoing" : s;
}
function woStatusColor(s: string) {
  return s === "Open" || s === "Scheduled" ? T.violet
    : s === "In Progress" || s === "Ongoing" ? T.green
    : s === "Done" || s === "Completed" ? T.blue
    : T.amber;
}
function priorityColor(p?: string) {
  return p === "High" ? T.red : p === "Medium" ? T.amber : T.green;
}
function assetStatusLabel(s: string) {
  return s === "Active" ? "Good" : s === "Inactive" ? "Alert" : "Critical";
}
function assetStatusColor(s: string) {
  return s === "Active" ? T.green : s === "Inactive" ? T.amber : T.red;
}
function partStockColor(p: any) {
  const total = getTotalStock(p);
  return total === 0 ? T.red : needsRestock(p) ? T.amber : T.green;
}
function partStockStatus(p: any) {
  const total = getTotalStock(p);
  return total === 0 ? "Out of Stock" : needsRestock(p) ? "Low Stock" : "In Stock";
}

/* ── Bottom Sheet ─────────────────────────────────────────── */
export function BottomSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
      <div
        style={{
          position: "relative", background: T.surface, borderRadius: "24px 24px 0 0",
          border: `1px solid ${T.border}`, borderBottom: "none", maxHeight: "92vh",
          display: "flex", flexDirection: "column",
          animation: "sheetUp 0.3s cubic-bezier(.32,1.2,.64,1)",
          paddingBottom: "env(safe-area-inset-bottom,0px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: T.dim }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 20px 14px" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{title}</span>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >✕</button>
        </div>
        <div style={{ height: 1, background: T.border }} />
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Mobile Topbar ────────────────────────────────────────── */
function MobileTopbar({ title }: { title: string }) {
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  return (
    <header
      style={{
        background: T.surface, borderBottom: `1px solid ${T.border}`,
        padding: "0 16px", paddingTop: "env(safe-area-inset-top,12px)",
        flexShrink: 0, zIndex: 50,
      }}
    >
      {showSearch ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 52 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, ...inner({ padding: "9px 13px", borderRadius: 12 }) }}>
            <span style={{ color: T.dim, fontSize: 14 }}>⌕</span>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 14, width: "100%", fontFamily: "inherit" }}
            />
          </div>
          <button
            onClick={() => { setShowSearch(false); setQ(""); }}
            style={{ background: "none", border: "none", color: T.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: "4px 0" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: T.text, letterSpacing: "-0.03em" }}>{title}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setShowSearch(true)}
              style={{ width: 36, height: 36, borderRadius: 10, background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}
            >⌕</button>
            <button
              style={{ width: 36, height: 36, borderRadius: 10, background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", position: "relative" }}
            >
              🔔
              <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: T.red, borderRadius: "50%", border: `1.5px solid ${T.surface}` }} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Mobile Bottom Nav ────────────────────────────────────── */
const MOB_NAV = [
  { icon: "▣", label: "Dashboard", key: "dashboard" },
  { icon: "≡", label: "Work Orders", key: "workorders" },
  { icon: "◎", label: "Assets", key: "assets" },
  { icon: "▦", label: "Inventory", key: "parts" },
  { icon: "◈", label: "Reports", key: "reporting" },
] as const;
type MobileNav = typeof MOB_NAV[number]["key"];

function MobileBottomNav({ active, setActive }: { active: MobileNav; setActive: (v: MobileNav) => void }) {
  return (
    <nav
      style={{
        background: T.surface, borderTop: `1px solid ${T.border}`,
        display: "flex", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom,4px)",
        position: "sticky", bottom: 0, zIndex: 50,
      }}
    >
      {MOB_NAV.map(({ icon, label, key }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 3, padding: "10px 4px 8px", background: "none", border: "none", cursor: "pointer",
              color: isActive ? T.blue : T.dim, fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, opacity: isActive ? 1 : 0.55 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: "-0.01em" }}>{label}</span>
            {isActive && <div style={{ position: "absolute", top: 0, width: 30, height: 2, background: T.blue, borderRadius: "0 0 2px 2px" }} />}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Mobile Dashboard ─────────────────────────────────────── */
function MobileDashboard({ setView }: { setView: (v: MobileNav) => void }) {
  const { workOrders } = useWorkOrderStore();
  const { assets } = useAssetStore();
  const { parts } = usePartStore();

  const open = (workOrders ?? []).filter((w) => w.status !== "Done").length;
  const ongoing = (workOrders ?? []).filter((w) => w.status === "In Progress").length;
  const critical = (assets ?? []).filter((a) => a.status === "Out of Service").length;
  const lowStock = (parts ?? []).filter((p) => needsRestock(p)).length;

  const recentWOs = (workOrders ?? []).slice(0, 4);
  const goodCount = (assets ?? []).filter((a) => a.status === "Active").length;
  const alertCount = (assets ?? []).filter((a) => a.status === "Inactive").length;
  const critCount = (assets ?? []).filter((a) => a.status === "Out of Service").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 20px" }}>
      {/* KPI scroll */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 14, scrollSnapType: "x mandatory" }}>
        {[
          { value: open, label: "Open Orders", icon: "⚡", color: T.blue },
          { value: ongoing, label: "Ongoing", icon: "▶", color: T.green },
          { value: critical, label: "Critical Assets", icon: "⚠️", color: T.amber },
          { value: lowStock, label: "Low Stock", icon: "📦", color: T.red },
        ].map(({ value, label, icon, color }) => (
          <div
            key={label}
            style={{ ...inner({ padding: "14px 16px", borderRadius: 16, flexShrink: 0, minWidth: 130, scrollSnapAlign: "start" }), borderColor: color + "22" }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{value}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 5 }}>{label}</div>
            <span style={{ fontSize: 20 }}>{icon}</span>
          </div>
        ))}
      </div>

      {/* Work orders widget */}
      <div style={{ ...card({ borderRadius: 18, marginBottom: 12 }) }}>
        <div style={{ padding: "14px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: T.text }}>My Work Orders</span>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("trigger-new-work-order"))}
            style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 8, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            + New
          </button>
        </div>
        <div style={{ height: 1, background: T.border }} />
        {recentWOs.length === 0 ? (
          <div style={{ padding: "24px 16px", textAlign: "center", color: T.dim, fontSize: 12 }}>No work orders</div>
        ) : recentWOs.map((wo, i) => (
          <div key={wo.id}>
            <div
              onClick={() => setView("workorders")}
              style={{ padding: "12px 16px", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}
            >
              <div style={{ width: 3, height: 36, borderRadius: 99, background: woStatusColor(wo.status), flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: T.dim, fontFamily: "monospace" }}>{wo.workOrderNumber ?? wo.id.slice(0, 8)}</span>
                  <Badge label={woStatusDisplay(wo.status)} color={woStatusColor(wo.status)} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wo.title}</div>
                <div style={{ fontSize: 11, color: T.dim, marginTop: 2, fontWeight: 300 }}>
                  {wo.assignedTo ? `👤 ${wo.assignedTo}` : "Unassigned"} · Due {wo.dueDate ? new Date(wo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                </div>
              </div>
              <Avatar name={wo.assignedTo ?? "?"} color={woStatusColor(wo.status)} size={30} />
            </div>
            {i < recentWOs.length - 1 && <div style={{ height: 1, background: T.border, margin: "0 16px" }} />}
          </div>
        ))}
      </div>

      {/* Asset Overview */}
      <div style={{ ...card({ borderRadius: 18, marginBottom: 12 }), padding: "14px 16px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: T.text }}>Asset Overview</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Good", count: goodCount, color: T.green },
            { label: "Alert", count: alertCount, color: T.amber },
            { label: "Critical", count: critCount, color: T.red },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ ...inner({ padding: "12px 10px", textAlign: "center", borderRadius: 12 }) }}>
              <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{count}</div>
              <div style={{ width: 20, height: 3, background: color, borderRadius: 99, margin: "6px auto 4px" }} />
              <div style={{ fontSize: 10.5, color: T.dim }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Work Orders ───────────────────────────────────── */
function MobileWorkOrders() {
  const { workOrders } = useWorkOrderStore();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<WorkOrder | null>(null);
  const filters = ["All", "Scheduled", "Ongoing", "On Hold", "Completed"];

  const filtered = (workOrders ?? []).filter((w) => {
    if (filter === "All") return true;
    const display = woStatusDisplay(w.status);
    return display === filter;
  });

  const open = (workOrders ?? []).filter((w) => w.status !== "Done").length;
  const ongoing = (workOrders ?? []).filter((w) => w.status === "In Progress").length;
  const onHold = (workOrders ?? []).filter((w) => w.status === "On Hold").length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1a2d4a" : "transparent",
                color: filter === f ? "#7aacf0" : T.dim,
                border: `1px solid ${filter === f ? "rgba(59,130,246,0.28)" : T.border}`,
                borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: filter === f ? 600 : 400,
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0,
              }}
            >{f}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Open", value: open, color: T.blue },
            { label: "Ongoing", value: ongoing, color: T.green },
            { label: "On Hold", value: onHold, color: T.amber },
          ].map(({ label, value, color }) => (
            <div key={label} style={inner({ padding: "10px 12px", textAlign: "center" })}>
              <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{value}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 90px" }}>
        {filtered.map((wo) => (
          <div
            key={wo.id}
            onClick={() => setSelected(wo)}
            style={{ ...card({ borderRadius: 16, marginBottom: 10, cursor: "pointer" }) }}
          >
            <div style={{ height: 3, background: woStatusColor(wo.status), opacity: 0.8 }} />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: T.dim, fontFamily: "monospace" }}>{wo.workOrderNumber ?? wo.id.slice(0, 8)}</span>
                  <Badge label={woStatusDisplay(wo.status)} color={woStatusColor(wo.status)} />
                  {wo.priority && <Badge label={wo.priority} color={priorityColor(wo.priority)} />}
                </div>
                {wo.assignedTo && <Avatar name={wo.assignedTo} color={woStatusColor(wo.status)} size={30} />}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>{wo.title}</div>
              <div style={{ fontSize: 12, color: T.dim, fontWeight: 300, marginBottom: 10 }}>
                {wo.dueDate ? `📅 Due ${new Date(wo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No due date"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {[
                  { label: "Tech", value: wo.assignedTo ? wo.assignedTo.split(" ")[0] : "—", col: T.muted },
                  { label: "Priority", value: wo.priority ?? "—", col: T.text },
                  { label: "Status", value: woStatusDisplay(wo.status), col: T.text },
                ].map(({ label, value, col }) => (
                  <div key={label} style={inner({ padding: "8px 10px" })}>
                    <div style={{ fontSize: 9.5, color: T.dim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: col, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <BottomSheet title={selected.workOrderNumber ?? selected.id.slice(0, 8)} onClose={() => setSelected(null)}>
          <div style={{ padding: "16px 18px 32px" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <Badge label={woStatusDisplay(selected.status)} color={woStatusColor(selected.status)} />
              {selected.priority && <Badge label={`${selected.priority} Priority`} color={priorityColor(selected.priority)} />}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 12 }}>{selected.title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Assigned To", value: selected.assignedTo ?? "—" },
                { label: "Due Date", value: selected.dueDate ? new Date(selected.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                { label: "Priority", value: selected.priority ?? "—" },
                { label: "Status", value: woStatusDisplay(selected.status) },
              ].map(({ label, value }) => (
                <div key={label} style={inner({ padding: "10px 12px" })}>
                  <div style={{ fontSize: 9.5, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{value}</div>
                </div>
              ))}
            </div>
            {selected.description && (
              <div style={{ ...inner({ padding: "12px 14px" }), marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Notes</div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{selected.description}</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✏ Edit</button>
              <button style={{ background: T.raised, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🖨 Print</button>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ── Mobile Assets ────────────────────────────────────────── */
function MobileAssets() {
  const { assets } = useAssetStore();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Asset | null>(null);

  const filtered = (assets ?? []).filter((a) => filter === "All" || assetStatusLabel(a.status) === filter);
  const goodCount = (assets ?? []).filter((a) => a.status === "Active").length;
  const alertCount = (assets ?? []).filter((a) => a.status === "Inactive").length;
  const critCount = (assets ?? []).filter((a) => a.status === "Out of Service").length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
          {["All", "Good", "Alert", "Critical"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#1a2d4a" : "transparent",
                color: filter === f ? "#7aacf0" : T.dim,
                border: `1px solid ${filter === f ? "rgba(59,130,246,0.28)" : T.border}`,
                borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: filter === f ? 600 : 400,
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0,
              }}
            >
              {f !== "All" && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: f === "Good" ? T.green : f === "Alert" ? T.amber : T.red, marginRight: 5, verticalAlign: "middle" }} />}
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
          {[{ label: "Good", v: goodCount, c: T.green }, { label: "Alert", v: alertCount, c: T.amber }, { label: "Critical", v: critCount, c: T.red }].map(({ label, v, c }) => (
            <div key={label} style={inner({ padding: "10px 12px", textAlign: "center" })}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 90px" }}>
        {filtered.map((asset) => {
          const sc = assetStatusColor(asset.status);
          const sl = assetStatusLabel(asset.status);
          return (
            <div key={asset.id} onClick={() => setSelected(asset)} style={{ ...card({ borderRadius: 16, marginBottom: 10, cursor: "pointer" }) }}>
              <div style={{ height: 3, background: sc, opacity: 0.8 }} />
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, background: T.blue + "14", border: `1px solid ${T.blue}28`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>◎</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{asset.name}</div>
                    <div style={{ fontSize: 11.5, color: T.dim, fontWeight: 300 }}>📍 {asset.locationName ?? "—"}</div>
                  </div>
                  <Badge label={sl} color={sc} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {asset.category && <Badge label={asset.category} color={T.violet} />}
                    {asset.criticality && <Badge label={asset.criticality} color={asset.criticality === "High" ? T.red : asset.criticality === "Medium" ? T.amber : T.green} />}
                  </div>
                  <div style={{ fontSize: 10, color: T.dim }}>{asset.assetTag ?? ""}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <BottomSheet title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ padding: "16px 18px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge label={assetStatusLabel(selected.status)} color={assetStatusColor(selected.status)} />
              {selected.criticality && <Badge label={selected.criticality} color={selected.criticality === "High" ? T.red : selected.criticality === "Medium" ? T.amber : T.green} />}
              {selected.category && <Badge label={selected.category} color={T.violet} />}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: "Manufacturer", v: selected.manufacturer ?? "—" },
                { l: "Model", v: selected.model ?? "—" },
                { l: "Serial No.", v: selected.serialNumber ?? "—" },
                { l: "Location", v: selected.locationName ?? "—" },
                { l: "Asset Tag", v: selected.assetTag ?? "—" },
                { l: "Category", v: selected.category ?? "—" },
              ].map(({ l, v }) => (
                <div key={l} style={inner({ padding: "10px 12px" })}>
                  <div style={{ fontSize: 9.5, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: T.text }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.description && (
              <div style={{ ...inner({ padding: "12px 14px" }) }}>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✏ Edit</button>
              <button onClick={() => { window.location.hash = "workorders"; }} style={{ background: T.raised, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+ Create WO</button>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ── Mobile Inventory ─────────────────────────────────────── */
function MobileInventory() {
  const { parts } = usePartStore();
  const [stockFilter, setStockFilter] = useState("All");
  const [selected, setSelected] = useState<any>(null);

  const filtered = (parts ?? []).filter((p) => {
    if (stockFilter === "All") return true;
    return partStockStatus(p) === stockFilter;
  });

  const outOfStock = (parts ?? []).filter((p) => getTotalStock(p) === 0).length;
  const low = (parts ?? []).filter((p) => getTotalStock(p) > 0 && needsRestock(p)).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
          {["All", "Out of Stock", "Low Stock", "In Stock"].map((f) => (
            <button
              key={f}
              onClick={() => setStockFilter(f)}
              style={{
                background: stockFilter === f ? "#1a2d4a" : "transparent",
                color: stockFilter === f ? "#7aacf0" : T.dim,
                border: `1px solid ${stockFilter === f ? "rgba(59,130,246,0.28)" : T.border}`,
                borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: stockFilter === f ? 600 : 400,
                cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0,
              }}
            >{f}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Total", v: (parts ?? []).length, c: T.blue },
            { label: "Out of Stock", v: outOfStock, c: T.red },
            { label: "Low Stock", v: low, c: T.amber },
          ].map(({ label, v, c }) => (
            <div key={label} style={inner({ padding: "10px 12px", textAlign: "center" })}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 90px" }}>
        {filtered.map((part) => {
          const sc = partStockColor(part);
          const ss = partStockStatus(part);
          const total = getTotalStock(part);
          return (
            <div key={part.id} onClick={() => setSelected(part)} style={{ ...card({ borderRadius: 14, marginBottom: 10, cursor: "pointer" }), padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, background: sc + "14", border: `1px solid ${sc}28`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📦</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{part.name}</div>
                  <div style={{ fontSize: 11.5, color: T.dim, fontWeight: 300 }}>{part.partType}</div>
                </div>
                <Badge label={ss} color={sc} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: sc, letterSpacing: "-0.03em" }}>{total}</span>
                  <span style={{ fontSize: 12, color: T.dim, alignSelf: "flex-end", marginBottom: 3 }}>{part.unit ?? "unit"}</span>
                </div>
                <div style={{ fontSize: 11, color: T.dim }}>min: {part.minStock}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <BottomSheet title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ padding: "16px 18px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge label={partStockStatus(selected)} color={partStockColor(selected)} />
              <Badge label={selected.partType} color={T.violet} />
            </div>
            <div style={{ ...inner({ padding: "14px" }) }}>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Stock</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: partStockColor(selected), letterSpacing: "-0.04em", lineHeight: 1 }}>{getTotalStock(selected)}</div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{selected.unit ?? "unit"} available</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: T.dim, marginBottom: 2 }}>Min threshold</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.muted }}>{selected.minStock}</div>
                </div>
              </div>
            </div>
            {selected.inventory.length > 0 && (
              <div style={inner({ padding: "12px 14px" })}>
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>By Location</div>
                {selected.inventory.map((inv: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < selected.inventory.length - 1 ? 8 : 0 }}>
                    <span style={{ fontSize: 12, color: T.muted }}>{inv.locationName}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: inv.quantity <= inv.minQuantity ? T.amber : T.green }}>{inv.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ── Mobile Shell (top-level export) ─────────────────────── */
const VIEW_TITLES: Record<MobileNav, string> = {
  dashboard: "Dashboard",
  workorders: "Work Orders",
  assets: "Assets",
  parts: "Inventory",
  reporting: "Reports",
};

export function MobileShell({ initialView = "dashboard" }: { initialView?: string }) {
  const validMobileViews: MobileNav[] = ["dashboard", "workorders", "assets", "parts", "reporting"];
  const init = validMobileViews.includes(initialView as MobileNav) ? (initialView as MobileNav) : "dashboard";
  const [view, setView] = useState<MobileNav>(init);

  const renderView = () => {
    switch (view) {
      case "workorders": return <MobileWorkOrders />;
      case "assets": return <MobileAssets />;
      case "parts": return <MobileInventory />;
      case "dashboard":
      default: return <MobileDashboard setView={setView} />;
    }
  };

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", height: "100vh",
        width: "100%", background: T.bg, fontFamily: "Poppins, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <MobileTopbar title={VIEW_TITLES[view]} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {renderView()}
      </div>
      <MobileBottomNav active={view} setActive={setView} />
    </div>
  );
}
