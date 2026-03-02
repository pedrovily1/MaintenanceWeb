import { useEffect, useMemo, useState } from "react";
import { T, card, inner } from "@/lib/tokens";
import { Badge } from "@/components/Common/Badge";
import { usePartStore } from "@/store/usePartStore";
import { PartEditorPanel } from "./components/PartEditorPanel";
import { getTotalStock, needsRestock } from "@/types/part";
import type { Part } from "@/types/part";

/* ── helpers ──────────────────────────────────────────────── */
function partIcon(p: Part): string {
  switch (p.partType) {
    case "Spare Part": return "⚙️";
    case "Consumable": return "💧";
    case "Tool": return "🔧";
    case "Safety Equipment": return "🦺";
    default: return "📦";
  }
}

function stockStatus(p: Part): "Out of Stock" | "Low Stock" | "In Stock" {
  const total = getTotalStock(p);
  if (total === 0) return "Out of Stock";
  if (needsRestock(p)) return "Low Stock";
  return "In Stock";
}

function stockColor(p: Part): string {
  const s = stockStatus(p);
  return s === "Out of Stock" ? T.red : s === "Low Stock" ? T.amber : T.green;
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "—"; }
}

/* ── Inventory Detail Panel ───────────────────────────────── */
function InventoryDetailPanel({ part, onClose, onEdit }: { part: Part; onClose: () => void; onEdit: () => void }) {
  const total = getTotalStock(part);
  const sc = stockColor(part);
  const ss = stockStatus(part);
  const icon = partIcon(part);
  const maxStock = Math.max(part.minStock * 3, total, 1);
  const stockPct = Math.min(100, Math.round((total / maxStock) * 100));

  return (
    <div
      style={{
        width: 340, background: T.surface, borderLeft: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
        animation: "slideIn 0.22s cubic-bezier(.34,1.2,.64,1)",
      }}
    >
      {/* header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, background: sc + "14", border: `1px solid ${sc}28`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 3 }}>
                {part.barcode ?? part.id.slice(0, 8).toUpperCase()}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{part.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: T.muted, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge label={ss} color={sc} />
          <Badge label={part.partType} color={T.violet} />
          {part.unit && <Badge label={part.unit} color={T.muted} />}
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* stock card */}
        <div style={inner({ padding: "14px" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Total Stock</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: sc, letterSpacing: "-0.04em", lineHeight: 1 }}>{total}</div>
              <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{part.unit ?? "unit"} available</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Min Stock</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{part.minStock}</div>
              <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>threshold</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stock Level</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: sc }}>{total} {part.unit ?? "unit"} · min {part.minStock}</span>
          </div>
          <div style={{ height: 7, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${stockPct}%`, height: "100%", background: sc, borderRadius: 99, transition: "width 0.5s ease", boxShadow: `0 0 8px ${sc}55` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: T.dim }}>Min: {part.minStock}</span>
            <span style={{ fontSize: 10, color: T.dim }}>Target: {part.minStock * 3}</span>
          </div>
        </div>

        {/* info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Part Type", value: part.partType },
            { label: "Unit", value: part.unit ?? "—" },
            { label: "Barcode", value: part.barcode ?? "—" },
            { label: "Last Updated", value: fmtDate(part.updatedAt) },
          ].map(({ label, value }) => (
            <div key={label} style={inner({ padding: "10px 12px" })}>
              <div style={{ fontSize: 9.5, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{value}</div>
            </div>
          ))}
        </div>

        {/* description */}
        {part.description && (
          <div style={inner({ padding: "12px 14px" })}>
            <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Description</div>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{part.description}</p>
          </div>
        )}

        {/* per-location inventory */}
        {part.inventory.length > 0 && (
          <div style={inner({ padding: "12px 14px" })}>
            <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Inventory by Location</div>
            {part.inventory.map((inv, i) => {
              const locColor = inv.quantity === 0 ? T.red : inv.quantity <= inv.minQuantity ? T.amber : T.green;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: i < part.inventory.length - 1 ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: locColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.muted }}>{inv.locationName || "Unknown"}</span>
                  </div>
                  <div style={{ display: "flex", align: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: locColor }}>{inv.quantity}</span>
                    <span style={{ fontSize: 11, color: T.dim }}>/ min {inv.minQuantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* reorder alert */}
        {needsRestock(part) && (
          <div style={{ ...inner({ padding: "12px 14px" }), borderColor: sc + "44", background: sc + "08" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: sc, marginBottom: 4 }}>
              {total === 0 ? "⚠ Out of Stock — Immediate Reorder Required" : "⚠ Below Minimum — Reorder Recommended"}
            </div>
            <div style={{ fontSize: 11, color: T.dim, fontWeight: 300 }}>
              Minimum threshold: {part.minStock} {part.unit ?? "unit"}
            </div>
          </div>
        )}

        {/* actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          <button
            onClick={onEdit}
            style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.28)", borderRadius: 12, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            ✎ Edit
          </button>
          <button
            style={{ background: "rgba(52,211,153,0.10)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 12, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            ↑ Adjust Stock
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Parts (Inventory) View ─────────────────────────── */
const COLS = [
  { key: "name", label: "Part / Description", w: "200px" },
  { key: "partType", label: "Type", w: "130px" },
  { key: "unit", label: "Unit", w: "70px" },
  { key: "stock", label: "Stock", w: "110px" },
  { key: "minStock", label: "Min", w: "70px" },
  { key: "status", label: "Status", w: "110px" },
] as const;

type StockFilter = "All" | "Out of Stock" | "Low Stock" | "In Stock";
type TypeFilter = "All" | string;

export const Parts = () => {
  const { parts, addPart, updatePart } = usePartStore();
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.id === selectedId) setSelectedId(null);
    };
    window.addEventListener("part-deleted", handler);
    return () => window.removeEventListener("part-deleted", handler);
  }, [selectedId]);

  const partTypes = useMemo(() => {
    const types = Array.from(new Set((parts ?? []).map((p) => p.partType))).sort();
    return ["All", ...types];
  }, [parts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (parts ?? [])
      .filter((p) => {
        if (stockFilter !== "All" && stockStatus(p) !== stockFilter) return false;
        if (typeFilter !== "All" && p.partType !== typeFilter) return false;
        if (q) {
          return [p.name, p.description, p.barcode, p.partType].some(
            (f) => (f ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const mul = sortDir;
        if (sortCol === "name") return mul * a.name.localeCompare(b.name);
        if (sortCol === "partType") return mul * a.partType.localeCompare(b.partType);
        if (sortCol === "stock") return mul * (getTotalStock(a) - getTotalStock(b));
        if (sortCol === "minStock") return mul * (a.minStock - b.minStock);
        if (sortCol === "unit") return mul * ((a.unit ?? "").localeCompare(b.unit ?? ""));
        if (sortCol === "status") return mul * stockStatus(a).localeCompare(stockStatus(b));
        return 0;
      });
  }, [parts, search, stockFilter, typeFilter, sortCol, sortDir]);

  const stats = useMemo(() => {
    const all = parts ?? [];
    const outOfStock = all.filter((p) => getTotalStock(p) === 0).length;
    const low = all.filter((p) => getTotalStock(p) > 0 && needsRestock(p)).length;
    return { total: all.length, outOfStock, low };
  }, [parts]);

  const selectedPart = selectedId ? (parts ?? []).find((p) => p.id === selectedId) ?? null : null;

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortCol(col); setSortDir(1); }
  };

  const stockOpts: StockFilter[] = ["All", "Out of Stock", "Low Stock", "In Stock"];

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* ── page header */}
        <div style={{ padding: "18px 22px 14px", flexShrink: 0, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 2, color: T.text, margin: 0 }}>Inventory</h2>
              <div style={{ fontSize: 12, color: T.dim, fontWeight: 300, marginTop: 4 }}>
                {stats.total} parts tracked
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.28)", borderRadius: 12, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              + Add Part
            </button>
          </div>

          {/* KPI strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Total Parts", value: stats.total, color: T.blue, icon: "▦" },
              { label: "Out of Stock", value: stats.outOfStock, color: T.red, icon: "⚠" },
              { label: "Low Stock", value: stats.low, color: T.amber, icon: "▲" },
              { label: "Needs Reorder", value: stats.outOfStock + stats.low, color: T.violet, icon: "↺" },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={inner({ padding: "12px 14px" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                  <span style={{ fontSize: 13, color: color + "aa" }}>{icon}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* filters row */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, ...inner({ padding: "7px 12px", borderRadius: 10 }), minWidth: 220 }}>
              <span style={{ color: T.dim, fontSize: 13 }}>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search parts, barcode…"
                style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, width: "100%", fontFamily: "inherit" }}
              />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕</button>}
            </div>
            <div style={{ width: 1, height: 20, background: T.border }} />
            {stockOpts.map((s) => {
              const col = s === "Out of Stock" ? T.red : s === "Low Stock" ? T.amber : s === "In Stock" ? T.green : T.muted;
              return (
                <button
                  key={s}
                  onClick={() => setStockFilter(s)}
                  style={{
                    background: stockFilter === s ? "#1a2d4a" : "transparent",
                    color: stockFilter === s ? "#7aacf0" : T.dim,
                    border: `1px solid ${stockFilter === s ? "rgba(59,130,246,0.28)" : T.border}`,
                    borderRadius: 8, padding: "5px 11px", fontSize: 11.5,
                    fontWeight: stockFilter === s ? 600 : 400, cursor: "pointer",
                    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" as const,
                  }}
                >
                  {s !== "All" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />}
                  {s}
                </button>
              );
            })}
            {partTypes.length > 1 && (
              <>
                <div style={{ width: 1, height: 20, background: T.border }} />
                <div style={{ display: "flex", gap: 4, overflowX: "auto" as const, maxWidth: 380 }}>
                  {partTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      style={{
                        background: typeFilter === t ? "rgba(167,139,250,0.15)" : "transparent",
                        color: typeFilter === t ? "#a78bfa" : T.dim,
                        border: `1px solid ${typeFilter === t ? "rgba(167,139,250,0.3)" : T.border}`,
                        borderRadius: 8, padding: "5px 11px", fontSize: 11.5,
                        fontWeight: typeFilter === t ? 600 : 400, cursor: "pointer",
                        fontFamily: "inherit", whiteSpace: "nowrap" as const,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: T.raised, position: "sticky", top: 0, zIndex: 1 }}>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    style={{
                      padding: "10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600,
                      color: T.dim, textTransform: "uppercase", letterSpacing: "0.07em",
                      cursor: "pointer", whiteSpace: "nowrap", borderBottom: `1px solid ${T.border}`,
                      userSelect: "none", width: c.w,
                    }}
                  >
                    {c.label}
                    {sortCol === c.key && <span style={{ color: T.blue, fontSize: 10, marginLeft: 4 }}>{sortDir === 1 ? "↑" : "↓"}</span>}
                  </th>
                ))}
                <th style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, width: "120px" }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((part) => {
                const sc = stockColor(part);
                const ss = stockStatus(part);
                const icon = partIcon(part);
                const total = getTotalStock(part);
                const sel = selectedId === part.id;
                const maxStock = Math.max(part.minStock * 3, total, 1);
                const pct = Math.min(100, Math.round((total / maxStock) * 100));
                return (
                  <tr
                    key={part.id}
                    onClick={() => setSelectedId(sel ? null : part.id)}
                    style={{
                      borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                      background: sel ? T.blueGlow : "transparent",
                      borderLeft: `3px solid ${sel ? T.blue : "transparent"}`,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = T.raised; }}
                    onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: sc + "14", border: `1px solid ${sc}28`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: T.text, marginBottom: 1 }}>{part.name}</div>
                          {part.description && <div style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>{part.description.slice(0, 40)}{part.description.length > 40 ? "…" : ""}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}><Badge label={part.partType} color={T.violet} /></td>
                    <td style={{ padding: "12px 14px", color: T.muted, fontSize: 12 }}>{part.unit ?? "—"}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 700, color: sc, fontSize: 15, letterSpacing: "-0.02em", marginBottom: 4 }}>
                        {total}<span style={{ fontSize: 10, color: T.dim, fontWeight: 400, marginLeft: 3 }}>{part.unit ?? ""}</span>
                      </div>
                      <div style={{ width: 60, height: 4, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: sc, borderRadius: 99 }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.muted, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{part.minStock}</td>
                    <td style={{ padding: "12px 14px" }}><Badge label={ss} color={sc} /></td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedId(sel ? null : part.id); }}
                          style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          View
                        </button>
                        {needsRestock(part) && (
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 7, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: T.dim }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>No parts match your filters</div>
            </div>
          )}
        </div>
      </div>

      {/* ── detail panel */}
      {selectedPart && (
        <InventoryDetailPanel
          part={selectedPart}
          onClose={() => setSelectedId(null)}
          onEdit={() => { setEditingPart(selectedPart); setSelectedId(null); }}
        />
      )}

      {/* ── create panel */}
      <PartEditorPanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={(data) => { addPart(data); setShowCreate(false); }}
      />

      {/* ── edit panel */}
      {editingPart && (
        <PartEditorPanel
          open={!!editingPart}
          initial={editingPart}
          onClose={() => setEditingPart(null)}
          onSubmit={(data) => { updatePart(editingPart.id, data); setEditingPart(null); }}
        />
      )}
    </div>
  );
};
