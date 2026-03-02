import { useEffect, useMemo, useState } from "react";
import { T, card, inner } from "@/lib/tokens";
import { Badge } from "@/components/Common/Badge";
import { useAssetStore } from "@/store/useAssetStore";
import { AssetEditorPanel, AssetEditorValue } from "./components/AssetEditorPanel";
import type { Asset } from "@/types/asset";

/* ── helpers ──────────────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  Active: "Good",
  Inactive: "Alert",
  "Out of Service": "Critical",
};
const STATUS_COLOR: Record<string, string> = {
  Good: T.green,
  Alert: T.amber,
  Critical: T.red,
};
const CRIT_COLOR: Record<string, string> = {
  High: T.red,
  Medium: T.amber,
  Low: T.green,
};

function statusLabel(s: string) { return STATUS_LABEL[s] ?? s; }
function statusColor(s: string) { return STATUS_COLOR[STATUS_LABEL[s] ?? s] ?? T.muted; }

function assetIcon(a: Asset): string {
  const cat = (a.category ?? "").toLowerCase();
  if (cat.includes("hvac") || cat.includes("air") || cat.includes("cool")) return "🌀";
  if (cat.includes("pump") || cat.includes("hydraul")) return "⚙️";
  if (cat.includes("elec")) return "⚡";
  if (cat.includes("fire") || cat.includes("safety")) return "🔥";
  if (cat.includes("vehicle") || cat.includes("transport")) return "🚗";
  if (cat.includes("boiler") || cat.includes("heat")) return "🔆";
  if (cat.includes("compressor")) return "💨";
  return "◎";
}
function assetColor(a: Asset): string {
  const cat = (a.category ?? "").toLowerCase();
  if (cat.includes("hvac") || cat.includes("air") || cat.includes("cool")) return T.blue;
  if (cat.includes("pump") || cat.includes("hydraul")) return T.violet;
  if (cat.includes("elec")) return T.amber;
  if (cat.includes("fire") || cat.includes("safety")) return T.red;
  if (cat.includes("vehicle")) return T.green;
  return T.blue;
}

/** Deterministic uptime derived from asset id + status */
function deriveUptime(a: Asset): number {
  const hash = a.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = a.status === "Active" ? 85 : a.status === "Inactive" ? 60 : 20;
  return Math.min(99, base + (hash % 15));
}
function deriveMttr(a: Asset): number {
  return a.criticality === "High" ? 4 : a.criticality === "Medium" ? 2 : 1;
}
function fmtDate(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "—"; }
}

/* ── Asset Detail Panel ───────────────────────────────────── */
function AssetDetailPanel({
  asset,
  onClose,
  onEdit,
}: {
  asset: Asset;
  onClose: () => void;
  onEdit: () => void;
}) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "Work Orders", "Metrics", "Documents"];
  const uptime = deriveUptime(asset);
  const mttr = deriveMttr(asset);
  const sc = statusColor(asset.status);
  const icon = assetIcon(asset);
  const color = assetColor(asset);
  const slabel = statusLabel(asset.status);

  const healthHistory = useMemo(() => {
    const hash = asset.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: 12 }, (_, i) => {
      const base = uptime;
      return Math.max(30, Math.min(99, base - 8 + ((hash * (i + 1)) % 16)));
    });
  }, [asset.id, uptime]);
  const maxH = Math.max(...healthHistory, 1);

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
      {/* header */}
      <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44, height: 44, background: color + "18", border: `1px solid ${color}30`,
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                {asset.assetTag ?? asset.id.slice(0, 8).toUpperCase()}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                {asset.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: T.raised, border: `1px solid ${T.border}`, borderRadius: 8,
              width: 30, height: 30, cursor: "pointer", color: T.muted, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge label={slabel} color={sc} />
          {asset.criticality && (
            <Badge label={`${asset.criticality} Criticality`} color={CRIT_COLOR[asset.criticality] ?? T.muted} />
          )}
          {asset.category && <Badge label={asset.category} color={T.violet} />}
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", padding: "0 20px", borderBottom: `1px solid ${T.border}`, gap: 0 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none", border: "none", fontFamily: "inherit",
              color: tab === t ? T.blue : T.dim,
              borderBottom: `2px solid ${tab === t ? T.blue : "transparent"}`,
              padding: "10px 10px", fontSize: 12, fontWeight: tab === t ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {tab === "Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* uptime */}
            <div style={inner({ padding: "14px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Uptime</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red, letterSpacing: "-0.03em" }}>
                  {uptime}%
                </span>
              </div>
              <div style={{ height: 6, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${uptime}%`, height: "100%", background: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red, borderRadius: 99, transition: "width 1s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>MTTR: {mttr}h avg</span>
                <span style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>0 open WOs</span>
              </div>
            </div>

            {/* health trend */}
            <div style={inner({ padding: "14px" })}>
              <div style={{ fontSize: 11, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Health Trend (12mo)
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 44 }}>
                {healthHistory.map((v, i) => {
                  const isLast = i === healthHistory.length - 1;
                  const col = v > 95 ? T.green : v > 80 ? T.amber : T.red;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1, height: `${(v / maxH) * 100}%`,
                        background: isLast ? `linear-gradient(to top,${col},${col}88)` : T.bg,
                        border: `1px solid ${isLast ? col + "44" : T.border}`,
                        borderBottom: "none", borderRadius: "3px 3px 0 0",
                        transition: "height 0.6s ease",
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ height: 1, background: T.border }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m) => (
                  <span key={m} style={{ fontSize: 9, color: T.dim }}>{m}</span>
                ))}
              </div>
            </div>

            {/* info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Manufacturer", value: asset.manufacturer ?? "—" },
                { label: "Model", value: asset.model ?? "—" },
                { label: "Serial No.", value: asset.serialNumber ?? "—" },
                { label: "Category", value: asset.category ?? "—" },
                { label: "Installed", value: fmtDate(asset.installDate) },
                { label: "Warranty End", value: fmtDate(asset.warrantyEnd) },
              ].map(({ label, value }) => (
                <div key={label} style={inner({ padding: "10px 12px" })}>
                  <div style={{ fontSize: 9.5, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{value}</div>
                </div>
              ))}
            </div>

            {/* maintenance schedule */}
            <div style={inner({ padding: "13px 14px" })}>
              <div style={{ fontSize: 11, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Asset Info
              </div>
              {[
                { label: "Location", value: asset.locationName ?? "—", icon: "📍", col: T.blue },
                { label: "Description", value: asset.description ? asset.description.slice(0, 60) + (asset.description.length > 60 ? "…" : "") : "—", icon: "📝", col: T.muted },
              ].map(({ label, value, icon, col }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: col + "18", border: `1px solid ${col}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: col, flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text, maxWidth: 140, textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Work Orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Work orders for this asset</span>
              <button
                onClick={() => { window.location.hash = "workorders"; }}
                style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                + Create WO
              </button>
            </div>
            <div style={{ padding: "40px 0", textAlign: "center", color: T.dim }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>≡</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>View in Work Orders</div>
              <div style={{ fontSize: 11, marginTop: 4, fontWeight: 300 }}>Filter by asset name to see related WOs</div>
            </div>
          </div>
        )}

        {tab === "Metrics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Overall Uptime", value: `${uptime}%`, sub: "Estimated (12 months)", color: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red, pct: uptime },
              { label: "Avg MTTR", value: `${mttr}h`, sub: "Mean time to repair", color: T.blue, pct: Math.min(100, (mttr / 8) * 100) },
              { label: "PM Compliance", value: "—", sub: "Planned maintenance", color: T.violet, pct: 0 },
              { label: "Criticality", value: asset.criticality ?? "—", sub: "Asset criticality level", color: CRIT_COLOR[asset.criticality ?? ""] ?? T.muted, pct: asset.criticality === "High" ? 90 : asset.criticality === "Medium" ? 55 : 20 },
            ].map(({ label, value, sub, color, pct }) => (
              <div key={label} style={inner({ padding: "13px 14px" })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{value}</div>
                  </div>
                  <span style={{ fontSize: 10.5, color: T.dim, fontWeight: 300 }}>{sub}</span>
                </div>
                <div style={{ height: 4, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, opacity: 0.8, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Documents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {asset.attachments && asset.attachments.length > 0 ? (
              asset.attachments.map((doc, i) => (
                <div
                  key={i}
                  style={{ ...inner({ padding: "11px 13px" }), display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.borderHi)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                >
                  <div style={{ width: 36, height: 36, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.fileName}</div>
                    <div style={{ fontSize: 10.5, color: T.dim, marginTop: 2, fontWeight: 300 }}>{fmtDate(doc.uploadedAt)}</div>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: T.blue, fontSize: 14 }}>↓</a>
                </div>
              ))
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center", color: T.dim }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>📁</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>No documents attached</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
        <button
          onClick={onEdit}
          style={{ flex: 1, background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Edit Asset
        </button>
        <button
          onClick={() => { window.location.hash = "workorders"; }}
          style={{ flex: 1, background: T.raised, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 12, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Create WO
        </button>
      </div>
    </div>
  );
}

/* ── Main AssetsView ──────────────────────────────────────── */
const COLS = [
  { key: "name", label: "Asset", w: "220px" },
  { key: "category", label: "Type", w: "110px" },
  { key: "status", label: "Status", w: "90px" },
  { key: "location", label: "Location", w: "180px" },
  { key: "uptime", label: "Uptime", w: "110px" },
  { key: "criticality", label: "Criticality", w: "100px" },
] as const;

export const Assets = () => {
  const { assets, addAsset, updateAsset } = useAssetStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  // dismiss selected on delete
  useEffect(() => {
    const onDeleted = (e: any) => {
      if (e?.detail?.id && e.detail.id === selectedId) setSelectedId(null);
    };
    window.addEventListener("asset-deleted", onDeleted as EventListener);
    return () => window.removeEventListener("asset-deleted", onDeleted as EventListener);
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (assets ?? [])
      .filter((a) => {
        const sl = statusLabel(a.status);
        if (filter !== "All" && sl !== filter) return false;
        if (q) {
          return [a.name, a.assetTag, a.category, a.manufacturer, a.model, a.serialNumber, a.locationName].some(
            (f) => (f ?? "").toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const mul = sortDir;
        if (sortCol === "name") return mul * a.name.localeCompare(b.name);
        if (sortCol === "status") return mul * a.status.localeCompare(b.status);
        if (sortCol === "criticality") return mul * ((a.criticality ?? "").localeCompare(b.criticality ?? ""));
        if (sortCol === "category") return mul * ((a.category ?? "").localeCompare(b.category ?? ""));
        if (sortCol === "location") return mul * ((a.locationName ?? "").localeCompare(b.locationName ?? ""));
        if (sortCol === "uptime") return mul * (deriveUptime(a) - deriveUptime(b));
        return 0;
      });
  }, [assets, search, filter, sortCol, sortDir]);

  const stats = useMemo(() => {
    const all = assets ?? [];
    return {
      total: all.length,
      good: all.filter((a) => a.status === "Active").length,
      alert: all.filter((a) => a.status === "Inactive").length,
      critical: all.filter((a) => a.status === "Out of Service").length,
    };
  }, [assets]);

  const selectedAsset = selectedId ? (assets ?? []).find((a) => a.id === selectedId) ?? null : null;

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortCol(col); setSortDir(1); }
  };

  const handleCreate = (val: AssetEditorValue) => {
    addAsset(val);
    setShowCreate(false);
  };

  const handleUpdate = (val: AssetEditorValue) => {
    if (!editingAsset) return;
    updateAsset(editingAsset.id, val);
    setEditingAsset(null);
    setSelectedId(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
      {/* ── page header */}
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.03em", margin: 0 }}>Assets</h1>
            <p style={{ fontSize: 12.5, color: T.dim, fontWeight: 300, marginTop: 4, margin: 0 }}>
              Monitor and manage all facility assets
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{ background: "#1a2d4a", color: "#7aacf0", border: "1px solid rgba(59,130,246,0.28)", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            ＋ Add Asset
          </button>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total Assets", value: stats.total, color: T.blue, icon: "◎", pct: null },
            { label: "Operational", value: stats.good, color: T.green, icon: "●", pct: stats.total ? Math.round((stats.good / stats.total) * 100) : 0 },
            { label: "Needs Attention", value: stats.alert, color: T.amber, icon: "⚠", pct: stats.total ? Math.round((stats.alert / stats.total) * 100) : 0 },
            { label: "Critical", value: stats.critical, color: T.red, icon: "🔴", pct: stats.total ? Math.round((stats.critical / stats.total) * 100) : 0 },
          ].map(({ label, value, color, icon, pct }) => (
            <div key={label} style={inner({ padding: "13px 16px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: pct != null ? 8 : 0 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{value}</div>
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{label}</div>
                </div>
                <span style={{ fontSize: 16, opacity: 0.5 }}>{icon}</span>
              </div>
              {pct != null && (
                <div style={{ height: 3, background: T.bg, borderRadius: 99 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, opacity: 0.7 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* filter bar */}
        <div style={{ ...card({ borderRadius: 16, overflow: "visible" }), padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...inner({ padding: "7px 13px", borderRadius: 10 }), minWidth: 200 }}>
            <span style={{ color: T.dim, fontSize: 13 }}>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 12.5, width: "100%", fontFamily: "inherit" }}
            />
            {search && <span onClick={() => setSearch("")} style={{ color: T.dim, cursor: "pointer", fontSize: 13 }}>✕</span>}
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {["All", "Good", "Alert", "Critical"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#1a2d4a" : "transparent",
                  color: filter === f ? "#7aacf0" : T.dim,
                  border: `1px solid ${filter === f ? "rgba(59,130,246,0.28)" : T.border}`,
                  borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: filter === f ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                }}
              >
                {f !== "All" && (
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[f], marginRight: 5, verticalAlign: "middle" }} />
                )}
                {f}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 2, ...inner({ padding: "4px", borderRadius: 9 }) }}>
              {([["⊞", "grid"], ["≡", "list"]] as const).map(([icon, mode]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    width: 28, height: 28, borderRadius: 7, border: "none",
                    background: viewMode === mode ? "#1a2d4a" : "transparent",
                    color: viewMode === mode ? "#7aacf0" : T.dim,
                    cursor: "pointer", fontSize: 14, fontFamily: "inherit", transition: "all 0.15s",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── content area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "12px 24px 20px", gap: 12 }}>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* ── grid view */}
          {viewMode === "grid" ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "80px 20px", textAlign: "center", color: T.dim }}>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>◎</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>No assets found</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, paddingBottom: 4 }}>
                  {filtered.map((asset) => {
                    const isSel = selectedId === asset.id;
                    const sc = statusColor(asset.status);
                    const icon = assetIcon(asset);
                    const color = assetColor(asset);
                    const uptime = deriveUptime(asset);
                    const mttr = deriveMttr(asset);
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedId(isSel ? null : asset.id)}
                        style={{
                          ...card({ borderRadius: 18, overflow: "hidden", cursor: "pointer" }),
                          borderColor: isSel ? T.blue + "66" : T.border,
                          boxShadow: isSel ? `0 0 0 1px ${T.blue}44,0 8px 32px ${T.blue}10` : "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!isSel) { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                        onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = ""; } }}
                      >
                        <div style={{ height: 3, background: sc, opacity: 0.7 }} />
                        <div style={{ padding: "16px 18px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div style={{ width: 42, height: 42, background: color + "14", border: `1px solid ${color}28`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
                            <div style={{ textAlign: "right" }}>
                              <Badge label={statusLabel(asset.status)} color={sc} />
                              <div style={{ fontSize: 10, color: T.dim, marginTop: 4, fontFamily: "monospace" }}>{asset.assetTag ?? asset.id.slice(0, 8).toUpperCase()}</div>
                            </div>
                          </div>
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.3, marginBottom: 3 }}>{asset.name}</div>
                            <div style={{ fontSize: 11.5, color: T.dim, fontWeight: 300 }}>📍 {asset.locationName ?? "—"}</div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                            {[
                              { label: "Uptime", value: `${uptime}%`, color: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red },
                              { label: "MTTR", value: `${mttr}h`, color: T.muted },
                              { label: "Open WOs", value: "0", color: T.muted },
                            ].map(({ label, value, color }) => (
                              <div key={label} style={{ ...inner({ padding: "8px 10px", borderRadius: 9 }), textAlign: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color, letterSpacing: "-0.02em" }}>{value}</div>
                                <div style={{ fontSize: 9.5, color: T.dim, marginTop: 2 }}>{label}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                            <div style={{ display: "flex", gap: 5 }}>
                              {asset.category && <Badge label={asset.category} color={T.violet} />}
                              {asset.criticality && <Badge label={asset.criticality} color={CRIT_COLOR[asset.criticality] ?? T.muted} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── list view */
            <div style={{ ...card({ borderRadius: 18 }), flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${COLS.map((c) => c.w).join(" ")} 1fr`,
                  padding: "10px 20px",
                  borderBottom: `1px solid ${T.border}`,
                  flexShrink: 0,
                  gap: 8,
                }}
              >
                {COLS.map((col) => (
                  <div
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, userSelect: "none" }}
                  >
                    {col.label}
                    {sortCol === col.key && <span style={{ fontSize: 9, opacity: 0.7 }}>{sortDir > 0 ? "↑" : "↓"}</span>}
                  </div>
                ))}
                <div style={{ fontSize: 10, color: T.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Actions</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {filtered.length === 0 && (
                  <div style={{ padding: "60px 20px", textAlign: "center", color: T.dim }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>No assets found</div>
                  </div>
                )}
                {filtered.map((asset, i) => {
                  const isSel = selectedId === asset.id;
                  const sc = statusColor(asset.status);
                  const icon = assetIcon(asset);
                  const color = assetColor(asset);
                  const uptime = deriveUptime(asset);
                  return (
                    <div key={asset.id}>
                      <div
                        onClick={() => setSelectedId(isSel ? null : asset.id)}
                        style={{
                          display: "grid",
                          gridTemplateColumns: `${COLS.map((c) => c.w).join(" ")} 1fr`,
                          padding: "12px 20px", gap: 8, alignItems: "center", cursor: "pointer",
                          background: isSel ? T.blueGlow : "transparent",
                          borderLeft: `3px solid ${isSel ? T.blue : "transparent"}`,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = T.raised; }}
                        onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = ""; }}
                      >
                        {/* asset name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, background: color + "14", border: `1px solid ${color}28`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{asset.name}</div>
                            <div style={{ fontSize: 10, color: T.dim, fontFamily: "monospace", marginTop: 1 }}>{asset.assetTag ?? asset.id.slice(0, 8).toUpperCase()}</div>
                          </div>
                        </div>
                        {/* type */}
                        <div>{asset.category ? <Badge label={asset.category} color={T.violet} /> : <span style={{ color: T.dim, fontSize: 12 }}>—</span>}</div>
                        {/* status */}
                        <div><Badge label={statusLabel(asset.status)} color={sc} /></div>
                        {/* location */}
                        <div style={{ fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.locationName ?? "—"}</div>
                        {/* uptime */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red }}>{uptime}%</span>
                          </div>
                          <div style={{ height: 4, background: T.bg, borderRadius: 99 }}>
                            <div style={{ width: `${uptime}%`, height: "100%", background: uptime > 95 ? T.green : uptime > 80 ? T.amber : T.red, borderRadius: 99, opacity: 0.8 }} />
                          </div>
                        </div>
                        {/* criticality */}
                        <div>{asset.criticality ? <Badge label={asset.criticality} color={CRIT_COLOR[asset.criticality] ?? T.muted} /> : <span style={{ color: T.dim, fontSize: 12 }}>—</span>}</div>
                        {/* actions */}
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedId(asset.id); }}
                            style={{ background: T.raised, border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 10px", fontSize: 11, color: T.muted, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingAsset(asset); }}
                            style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 8px", fontSize: 11, color: T.dim, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                      {i < filtered.length - 1 && <div style={{ height: 1, background: T.border, margin: "0 20px" }} />}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: T.dim, fontWeight: 300 }}>Showing {filtered.length} of {(assets ?? []).length} assets</span>
              </div>
            </div>
          )}
        </div>

        {/* ── detail panel */}
        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedId(null)}
            onEdit={() => { setEditingAsset(selectedAsset); setSelectedId(null); }}
          />
        )}
      </div>

      {/* ── create panel */}
      <AssetEditorPanel
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      {/* ── edit panel */}
      {editingAsset && (
        <AssetEditorPanel
          open={!!editingAsset}
          initial={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};
